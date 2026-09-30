
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import {
    getUserById,
    updateUser,
    User,
} from "@/lib/userservice";

import {
    getCompanyById,
    Company,
} from "@/lib/companyservice";

import editProfileStyles from "./editprofile.styles";

const STORAGE_USER_ID_KEY = "technician_id";
const STORAGE_USER_KEY = "user";

interface EditProfileProps {
    onBack: () => void;
    onLogout?: () => void;
}

export default function EditProfile({
    onBack,
    onLogout,
}: EditProfileProps) {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [ability, setAbility] = useState("");
    const [license, setLicense] = useState<string[]>([]);
    const [licenseInput, setLicenseInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);

            const storedId = await AsyncStorage.getItem(
                STORAGE_USER_ID_KEY
            );
            console.log(
                "Edit profile technician ID:",
                storedId
            );

            if (!storedId) {
                Alert.alert(
                    "Session Expired",
                    "Please login again."
                );

                router.back();
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
                    STORAGE_USER_KEY,
                ]);

                router.back();
                return;
            }

            const data = await getUserById({
                id: userId,
            });

            console.log(
                "Full user data:",
                JSON.stringify(data, null, 2)
            );

            console.log(
                "companyId:",
                data?.companyId
            );

            console.log(
                "company_id:",
                (data as any)?.company_id
            );

            console.log(
                "user id:",
                data?.id
            );

            console.log(
                "technician id:",
                data?.technicianId
            );

            if (!data) {
                Alert.alert(
                    "Profile Not Found",
                    "Technician profile could not be found."
                );
                return;
            }

            setUser(data);

            setName(data.name ?? "");
            setPhone(data.phone ?? "");
            setEmail(data.email ?? "");
            setSpecialization(
                data.specialization ?? ""
            );
            setAbility(data.ability ?? "");
            setLicense(data.license ?? []);

            if (
                data.companyId !== null &&
                data.companyId !== undefined
            ) {
                try {
                    console.log(
                        "Loading company with ID:",
                        data.companyId
                    );

                    const companyData =
                        await getCompanyById(
                            Number(data.companyId)
                        );

                    console.log(
                        "Company data:",
                        JSON.stringify(
                            companyData,
                            null,
                            2
                        )
                    );

                    setCompany(companyData);
                } catch (companyError: any) {
                    console.error(
                        "Failed to load company:",
                        companyError
                    );

                    setCompany(null);
                }
            } else {
                console.log(
                    "No company ID found for user."
                );

                setCompany(null);
            }
        } catch (error: any) {
            console.error(
                "Failed to load technician profile:",
                error
            );

            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddLicense = () => {
        const cleanLicense =
            licenseInput.trim();

        if (!cleanLicense) {
            return;
        }

        const alreadyExists = license.some(
            (item) =>
                item.toLowerCase() ===
                cleanLicense.toLowerCase()
        );

        if (alreadyExists) {
            Alert.alert(
                "Duplicate License",
                "This license has already been added."
            );
            return;
        }

        setLicense((current) => [
            ...current,
            cleanLicense,
        ]);

        setLicenseInput("");
    };

    const handleRemoveLicense = (
        index: number
    ) => {
        setLicense((current) =>
            current.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const handleSave = async () => {
        if (!user) {
            return;
        }

        const cleanName = name.trim();
        const cleanPhone = phone.trim();
        const cleanEmail = email.trim();

        const cleanSpecialization =
            specialization.trim();

        const cleanAbility =
            ability.trim();

        const cleanLicenses = license
            .map((item) => item.trim())
            .filter(Boolean);

        if (!cleanName) {
            Alert.alert(
                "Validation Error",
                "Please enter your name."
            );
            return;
        }

        if (!cleanPhone) {
            Alert.alert(
                "Validation Error",
                "Please enter your phone number."
            );
            return;
        }

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            Alert.alert(
                "Validation Error",
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        if (
            cleanEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                cleanEmail
            )
        ) {
            Alert.alert(
                "Validation Error",
                "Please enter a valid email address."
            );
            return;
        }

        try {
            setSaving(true);

            const updatedBy =
                user.updatedBy ||
                user.createdBy ||
                String(user.id);

            const updatedUser =
                await updateUser({
                    id: user.id,
                    name: cleanName,
                    phone: cleanPhone,
                    email:
                        cleanEmail ||
                        undefined,
                    specialization:
                        cleanSpecialization ||
                        undefined,
                    ability:
                        cleanAbility ||
                        undefined,
                    license:
                        cleanLicenses.length > 0
                            ? cleanLicenses
                            : [],
                    updatedBy,
                });

            console.log(
                "Profile updated successfully:",
                updatedUser
            );

            setUser(updatedUser);

            setName(
                updatedUser.name ?? ""
            );

            setPhone(
                updatedUser.phone ?? ""
            );

            setEmail(
                updatedUser.email ?? ""
            );

            setSpecialization(
                updatedUser.specialization ?? ""
            );

            setAbility(
                updatedUser.ability ?? ""
            );

            setLicense(
                updatedUser.license ?? []
            );

            await AsyncStorage.setItem(
                STORAGE_USER_KEY,
                JSON.stringify(updatedUser)
            );

            Alert.alert(
                "Success",
                "Profile updated successfully.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            onBack();
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.error(
                "Update profile error:",
                error
            );

            Alert.alert(
                "Update Failed",
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    /*
     * LOADING
     */
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#421DDB",
                }}
            >
                <StatusBar
                    backgroundColor="#421DDB"
                    barStyle="light-content"
                    translucent={false}
                />

                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: "#F8F9FF",
                    }}
                    edges={[
                        "top",
                        "left",
                        "right",
                    ]}
                >
                    <View
                        style={
                            editProfileStyles.loadingContainer
                        }
                    >
                        <ActivityIndicator
                            size="large"
                            color="#421DDB"
                        />

                        <Text
                            style={
                                editProfileStyles.loadingText
                            }
                        >
                            Loading profile...
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    /*
     * PROFILE NOT FOUND
     */
    if (!user) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#421DDB",
                }}
            >
                <StatusBar
                    backgroundColor="#421DDB"
                    barStyle="light-content"
                    translucent={false}
                />

                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: "#F8F9FF",
                    }}
                    edges={[
                        "top",
                        "left",
                        "right",
                    ]}
                >
                    <View
                        style={
                            editProfileStyles.loadingContainer
                        }
                    >
                        <Ionicons
                            name="person-circle-outline"
                            size={70}
                            color="#999"
                        />

                        <Text
                            style={
                                editProfileStyles.loadingText
                            }
                        >
                            Profile not found
                        </Text>

                        <TouchableOpacity
                            style={
                                editProfileStyles.retryButton
                            }
                            onPress={loadProfile}
                        >
                            <Text
                                style={
                                    editProfileStyles.retryButtonText
                                }
                            >
                                Retry
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    /*
     * MAIN SCREEN
     */
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#421DDB",
            }}
        >
            <StatusBar
                backgroundColor="#421DDB"
                barStyle="light-content"
                translucent={false}
            />

            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: "#421DDB",
                }}
                edges={[
                    "top",
                    "left",
                    "right",
                ]}
            >
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        backgroundColor: "#F8F9FF",
                    }}
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : undefined
                    }
                >
                    {/* HEADER */}
                    <View
                        style={
                            editProfileStyles.header
                        }
                    >
                        <TouchableOpacity
                            style={
                                editProfileStyles.backButton
                            }
                            onPress={() =>
                                router.back()
                            }
                            disabled={saving}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        <Text
                            style={
                                editProfileStyles.headerTitle
                            }
                        >
                            Edit Profile
                        </Text>

                        <View
                            style={
                                editProfileStyles.headerSpacer
                            }
                        />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={
                            editProfileStyles.scrollContent
                        }
                    >
                        {/* PROFILE HEADER */}
                        <View
                            style={
                                editProfileStyles.profileHeader
                            }
                        >
                            <View
                                style={
                                    editProfileStyles.profileImage
                                }
                            >
                                <Ionicons
                                    name="person"
                                    size={42}
                                    color="#666"
                                />
                            </View>

                            <View
                                style={
                                    editProfileStyles.profileHeaderInfo
                                }
                            >
                                <Text
                                    style={
                                        editProfileStyles.profileName
                                    }
                                    numberOfLines={1}
                                >
                                    {user.name ||
                                        "Technician"}
                                </Text>

                                <Text
                                    style={
                                        editProfileStyles.profileId
                                    }
                                >
                                    {user.technicianId ||
                                        user.id}
                                </Text>

                                <Text
                                    style={
                                        editProfileStyles.profileStatus
                                    }
                                >
                                    {user.status ||
                                        "Not available"}
                                </Text>
                            </View>
                        </View>

                        {/* PERSONAL INFORMATION */}
                        <View
                            style={
                                editProfileStyles.section
                            }
                        >
                            <Text
                                style={
                                    editProfileStyles.sectionTitle
                                }
                            >
                                Personal Information
                            </Text>

                            <View
                                style={
                                    editProfileStyles.formCard
                                }
                            >
                                <FormField
                                    label="Full Name"
                                    icon="person-outline"
                                    value={name}
                                    onChangeText={
                                        setName
                                    }
                                    placeholder="Enter your full name"
                                    editable={!saving}
                                />

                                <FormField
                                    label="Phone Number"
                                    icon="call-outline"
                                    value={phone}
                                    onChangeText={(
                                        text
                                    ) =>
                                        setPhone(
                                            text.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    editable={!saving}
                                />

                                <FormField
                                    label="Email"
                                    icon="mail-outline"
                                    value={email}
                                    onChangeText={
                                        setEmail
                                    }
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!saving}
                                />
                            </View>
                        </View>

                        {/* WORK INFORMATION */}
                        <View
                            style={
                                editProfileStyles.section
                            }
                        >
                            <Text
                                style={
                                    editProfileStyles.sectionTitle
                                }
                            >
                                Work Information
                            </Text>

                            <View
                                style={
                                    editProfileStyles.formCard
                                }
                            >
                                <FormField
                                    label="Specialization"
                                    icon="construct-outline"
                                    value={
                                        specialization
                                    }
                                    onChangeText={
                                        setSpecialization
                                    }
                                    placeholder="Enter specialization"
                                    editable={!saving}
                                />

                                <FormField
                                    label="Ability / Experience"
                                    icon="time-outline"
                                    value={ability}
                                    onChangeText={
                                        setAbility
                                    }
                                    placeholder="Enter ability or experience"
                                    editable={!saving}
                                />

                                {/* LICENSE */}
                                <View
                                    style={
                                        editProfileStyles.fieldContainer
                                    }
                                >
                                    <Text
                                        style={
                                            editProfileStyles.fieldLabel
                                        }
                                    >
                                        Licenses
                                    </Text>

                                    <View
                                        style={
                                            editProfileStyles.inputWrapper
                                        }
                                    >
                                        <View
                                            style={
                                                editProfileStyles.fieldIcon
                                            }
                                        >
                                            <Ionicons
                                                name="ribbon-outline"
                                                size={21}
                                                color="#555"
                                            />
                                        </View>

                                        <TextInput
                                            style={
                                                editProfileStyles.input
                                            }
                                            value={
                                                licenseInput
                                            }
                                            onChangeText={
                                                setLicenseInput
                                            }
                                            placeholder="Enter license"
                                            placeholderTextColor="#999"
                                            editable={
                                                !saving
                                            }
                                            autoCapitalize="characters"
                                            onSubmitEditing={
                                                handleAddLicense
                                            }
                                            returnKeyType="done"
                                        />

                                        <TouchableOpacity
                                            style={
                                                editProfileStyles.addLicenseButton
                                            }
                                            onPress={
                                                handleAddLicense
                                            }
                                            disabled={
                                                saving ||
                                                !licenseInput.trim()
                                            }
                                        >
                                            <Ionicons
                                                name="add"
                                                size={22}
                                                color="#421DDB"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {license.length >
                                        0 && (
                                            <View
                                                style={
                                                    editProfileStyles.licenseList
                                                }
                                            >
                                                {license.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <View
                                                            key={`${item}-${index}`}
                                                            style={
                                                                editProfileStyles.licenseChip
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    editProfileStyles.licenseChipText
                                                                }
                                                            >
                                                                {
                                                                    item
                                                                }
                                                            </Text>

                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    handleRemoveLicense(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    saving
                                                                }
                                                            >
                                                                <Ionicons
                                                                    name="close-circle"
                                                                    size={
                                                                        18
                                                                    }
                                                                    color="#777"
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                )}
                                            </View>
                                        )}
                                </View>

                                {/* TECHNICIAN ID */}
                                <ReadOnlyRow
                                    icon="id-card-outline"
                                    label="Technician ID"
                                    value={
                                        user.technicianId ||
                                        String(
                                            user.id
                                        )
                                    }
                                />

                                {/* ROLE */}
                                <ReadOnlyRow
                                    icon="person-circle-outline"
                                    label="Role"
                                    value={
                                        user.role ||
                                        "Not available"
                                    }
                                />

                                {/* STATUS */}
                                <ReadOnlyRow
                                    icon="shield-checkmark-outline"
                                    label="Status"
                                    value={
                                        user.status ||
                                        "Not available"
                                    }
                                />

                                {/* COMPANY */}
                                <ReadOnlyRow
                                    icon="business-outline"
                                    label="Company"
                                    value={
                                        company
                                            ? company.brandName ||
                                            company.legalName ||
                                            "Not available"
                                            : "Not available"
                                    }
                                />
                            </View>
                        </View>

                        {/* SAVE */}
                        <TouchableOpacity
                            style={[
                                editProfileStyles.saveButton,
                                saving &&
                                editProfileStyles.saveButtonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Ionicons
                                    name="checkmark"
                                    size={21}
                                    color="#FFFFFF"
                                />
                            )}

                            <Text
                                style={
                                    editProfileStyles.saveButtonText
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Text>
                        </TouchableOpacity>

                        {/* CANCEL */}
                        <TouchableOpacity
                            style={
                                editProfileStyles.cancelButton
                            }
                            onPress={() =>
                                router.back()
                            }
                            disabled={saving}
                        >
                            <Text
                                style={
                                    editProfileStyles.cancelButtonText
                                }
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

interface FormFieldProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    editable: boolean;
    keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad";
    maxLength?: number;
    autoCapitalize?:
    | "none"
    | "sentences"
    | "words"
    | "characters";
}

function FormField({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    editable,
    keyboardType = "default",
    maxLength,
    autoCapitalize = "sentences",
}: FormFieldProps) {
    return (
        <View
            style={
                editProfileStyles.fieldContainer
            }
        >
            <Text
                style={
                    editProfileStyles.fieldLabel
                }
            >
                {label}
            </Text>

            <View
                style={
                    editProfileStyles.inputWrapper
                }
            >
                <View
                    style={
                        editProfileStyles.fieldIcon
                    }
                >
                    <Ionicons
                        name={icon}
                        size={21}
                        color="#555"
                    />
                </View>

                <TextInput
                    style={
                        editProfileStyles.input
                    }
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    editable={editable}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    autoCapitalize={
                        autoCapitalize
                    }
                />
            </View>
        </View>
    );
}

function ReadOnlyRow({
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
            style={
                editProfileStyles.readOnlyRow
            }
        >
            <View
                style={
                    editProfileStyles.fieldIcon
                }
            >
                <Ionicons
                    name={icon}
                    size={21}
                    color="#888"
                />
            </View>

            <View
                style={
                    editProfileStyles.readOnlyContent
                }
            >
                <Text
                    style={
                        editProfileStyles.fieldLabel
                    }
                >
                    {label}
                </Text>

                <Text
                    style={
                        editProfileStyles.readOnlyValue
                    }
                >
                    {value}
                </Text>
            </View>
        </View>
    );
}
