
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import technicianProfileStyles from "./profile.styles";
import { getUserById, User } from "@/lib/userservice";

interface TechnicianProfileProps {
  onLogout?: () => void;
  onEditProfile?: () => void;
}

const STORAGE_USER_ID_KEY = "technician_id";
const STORAGE_TOKEN_KEY = "access_token";

export default function TechnicianProfile({
  onLogout,
  onEditProfile,
}: TechnicianProfileProps) {
  const [technician, setTechnician] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnician();
  }, []);

  const fetchTechnician = async () => {
    try {
      setLoading(true);

      const storedId = await AsyncStorage.getItem(
        STORAGE_USER_ID_KEY
      );

      console.log("Stored technician ID:", storedId);

      if (!storedId) {
        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        router.replace("/login");
        return;
      }

      const userId = Number(storedId);

      if (!Number.isFinite(userId)) {
        Alert.alert(
          "Invalid Session",
          "Technician ID is invalid. Please login again."
        );

        await AsyncStorage.multiRemove([
          STORAGE_USER_ID_KEY,
          STORAGE_TOKEN_KEY,
        ]);

        router.replace("/login");
        return;
      }

      const data = await getUserById({
        id: userId,
      });

      if (!data) {
        Alert.alert(
          "Profile Not Found",
          "Technician profile could not be found."
        );
        return;
      }

      setTechnician(data);
    } catch (error) {
      console.error(
        "Failed to fetch technician:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load technician profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                STORAGE_USER_ID_KEY,
                STORAGE_TOKEN_KEY,
              ]);

              onLogout?.();

              router.replace("/login");
            } catch (error) {
              console.error(
                "Logout error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to logout."
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (
    date: string | null | undefined
  ) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString();
  };

  const formatLicense = (
    license: string[] | null | undefined
  ) => {
    if (!license || license.length === 0) {
      return "No licenses added";
    }

    return license.join(", ");
  };

  const formatValue = (
    value: string | null | undefined,
    fallback = "Not available"
  ) => {
    if (!value || value.trim() === "") {
      return fallback;
    }

    return value;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={technicianProfileStyles.screen}
        edges={["top", "left", "right"]}
      >
        <View
          style={
            technicianProfileStyles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#dd651b"
          />

          <Text
            style={
              technicianProfileStyles.loadingText
            }
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!technician) {
    return (
      <SafeAreaView
        style={technicianProfileStyles.screen}
        edges={["top", "left", "right"]}
      >
        <View
          style={
            technicianProfileStyles.loadingContainer
          }
        >
          <Ionicons
            name="person-circle-outline"
            size={70}
            color="#999"
          />

          <Text
            style={
              technicianProfileStyles.loadingText
            }
          >
            Profile not found
          </Text>

          <TouchableOpacity
            style={
              technicianProfileStyles.retryButton
            }
            onPress={fetchTechnician}
          >
            <Text
              style={
                technicianProfileStyles.retryButtonText
              }
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const technicianName = formatValue(
    technician.name,
    "Technician"
  );

  const technicianId = formatValue(
    technician.technicianId,
    String(technician.id)
  );

  const status = formatValue(
    technician.status,
    "Available"
  );

  return (
    <View style={technicianProfileStyles.screen}>
      <StatusBar
        backgroundColor="#421DDB"
        barStyle="light-content"
        translucent={false}
      />

      <SafeAreaView
        style={technicianProfileStyles.safeArea}
        edges={["top", "left", "right"]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            technicianProfileStyles.scrollContent
          }
        >
          {/* HEADER */}
          <View
            style={technicianProfileStyles.header}
          >
            <Text
              style={
                technicianProfileStyles.headerTitle
              }
            >
              Profile
            </Text>

            <TouchableOpacity
              style={
                technicianProfileStyles.headerIcon
              }
              onPress={handleEditProfile}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color="#222"
              />
            </TouchableOpacity>
          </View>

          {/* PROFILE CARD */}
          <View
            style={
              technicianProfileStyles.profileCard
            }
          >
            <View
              style={
                technicianProfileStyles.profileImage
              }
            >
              <Ionicons
                name="person"
                size={48}
                color="#666"
              />
            </View>

            <View
              style={
                technicianProfileStyles.profileInfo
              }
            >
              <Text
                style={
                  technicianProfileStyles.profileName
                }
                numberOfLines={1}
              >
                {technicianName}
              </Text>

              <Text
                style={
                  technicianProfileStyles.profileId
                }
              >
                {technicianId}
              </Text>

              <View
                style={
                  technicianProfileStyles.statusContainer
                }
              >
                <View
                  style={
                    technicianProfileStyles.statusDot
                  }
                />

                <Text
                  style={
                    technicianProfileStyles.statusText
                  }
                >
                  {status}
                </Text>
              </View>
            </View>
          </View>

          {/* PERSONAL INFORMATION */}
          <View
            style={technicianProfileStyles.section}
          >
            <Text
              style={
                technicianProfileStyles.sectionTitle
              }
            >
              Personal Information
            </Text>

            <View
              style={
                technicianProfileStyles.infoCard
              }
            >
              <InfoRow
                icon="person-outline"
                label="Full Name"
                value={technicianName}
              />

              <InfoRow
                icon="call-outline"
                label="Phone Number"
                value={formatValue(
                  technician.phone
                )}
              />

              <InfoRow
                icon="mail-outline"
                label="Email"
                value={formatValue(
                  technician.email
                )}
              />

              {/* UPI ID */}
              <InfoRow
                icon="wallet-outline"
                label="UPI ID"
                value={formatValue(
                  technician.upiId
                )}
              />
            </View>
          </View>

          {/* WORK INFORMATION */}
          <View
            style={technicianProfileStyles.section}
          >
            <Text
              style={
                technicianProfileStyles.sectionTitle
              }
            >
              Work Information
            </Text>

            <View
              style={
                technicianProfileStyles.infoCard
              }
            >
              <InfoRow
                icon="id-card-outline"
                label="Technician ID"
                value={technicianId}
              />

              <InfoRow
                icon="shield-checkmark-outline"
                label="Role"
                value={formatValue(
                  technician.role
                )}
              />

              <InfoRow
                icon="construct-outline"
                label="Specialization"
                value={formatValue(
                  technician.specialization
                )}
              />

              <InfoRow
                icon="time-outline"
                label="Ability / Experience"
                value={formatValue(
                  technician.ability
                )}
              />

              <InfoRow
                icon="ribbon-outline"
                label="License"
                value={formatLicense(
                  technician.license
                )}
              />

              <InfoRow
                icon="business-outline"
                label="Company ID"
                value={
                  technician.companyId !== null &&
                  technician.companyId !== undefined
                    ? String(technician.companyId)
                    : "Not available"
                }
              />

              <InfoRow
                icon="calendar-outline"
                label="Joining Date"
                value={formatDate(
                  technician.createdAt
                )}
              />
            </View>
          </View>

          {/* ACCOUNT INFORMATION */}
          <View
            style={technicianProfileStyles.section}
          >
            <Text
              style={
                technicianProfileStyles.sectionTitle
              }
            >
              Account Information
            </Text>

            <View
              style={
                technicianProfileStyles.infoCard
              }
            >
              <InfoRow
                icon="checkmark-circle-outline"
                label="Account Status"
                value={status}
              />

              <InfoRow
                icon="calendar-outline"
                label="Created At"
                value={formatDate(
                  technician.createdAt
                )}
              />

              <InfoRow
                icon="refresh-outline"
                label="Last Updated"
                value={formatDate(
                  technician.updatedAt
                )}
              />

              <InfoRow
                icon="person-outline"
                label="Created By"
                value={formatValue(
                  technician.createdBy
                )}
              />

              <InfoRow
                icon="create-outline"
                label="Updated By"
                value={formatValue(
                  technician.updatedBy
                )}
              />
            </View>
          </View>

          {/* ACCOUNT ACTIONS */}
          <View
            style={technicianProfileStyles.section}
          >
            <Text
              style={
                technicianProfileStyles.sectionTitle
              }
            >
              Account
            </Text>

            <View
              style={
                technicianProfileStyles.actionCard
              }
            >
              {/* EDIT PROFILE */}
              <TouchableOpacity
                style={
                  technicianProfileStyles.actionRow
                }
                onPress={handleEditProfile}
              >
                <View
                  style={
                    technicianProfileStyles.actionIcon
                  }
                >
                  <Ionicons
                    name="create-outline"
                    size={21}
                    color="#444"
                  />
                </View>

                <Text
                  style={
                    technicianProfileStyles.actionText
                  }
                >
                  Edit Profile
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>

              <View
                style={
                  technicianProfileStyles.divider
                }
              />

              {/* LOGOUT */}
              <TouchableOpacity
                style={
                  technicianProfileStyles.actionRow
                }
                onPress={handleLogout}
              >
                <View
                  style={[
                    technicianProfileStyles.actionIcon,
                    technicianProfileStyles.logoutIcon,
                  ]}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={21}
                    color="#D32F2F"
                  />
                </View>

                <Text
                  style={[
                    technicianProfileStyles.actionText,
                    technicianProfileStyles.logoutText,
                  ]}
                >
                  Logout
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={technicianProfileStyles.infoRow}
    >
      <View
        style={technicianProfileStyles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={21}
          color="#555"
        />
      </View>

      <View
        style={
          technicianProfileStyles.infoContent
        }
      >
        <Text
          style={
            technicianProfileStyles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            technicianProfileStyles.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
