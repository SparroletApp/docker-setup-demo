
import React, { ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { layoutStyles } from "./Layout.styles";

type LayoutProps = {
  children: ReactNode;
  activeTab: "home" | "jobs" | "invoices" | "profile";
  goToHome: () => void;
  goToJobs: () => void;
  goToInvoices: () => void;
  goToProfile: () => void;
  bottomAction?: ReactNode;
};

export default function Layout({
  children,
  activeTab,
  goToHome,
  goToJobs,
  goToInvoices,
  goToProfile,
  bottomAction,
}: LayoutProps) {
  return (
    <View style={layoutStyles.container}>

      <View style={layoutStyles.content}>
        {children}
      </View>

      {bottomAction && (
        <View style={layoutStyles.bottomAction}>
          {bottomAction}
        </View>
      )}

          <SafeAreaView
        edges={["bottom"]}
        style={layoutStyles.safeBottom}
      >
        <View style={layoutStyles.bottomNav}>

     
          <TouchableOpacity
            activeOpacity={0.7}
            style={layoutStyles.navItem}
            onPress={goToHome}
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={
                activeTab === "home"
                  ? "#421ddb"
                  : "#8A96A3"
              }
            />

            <Text
              style={[
                layoutStyles.navText,
                activeTab === "home" &&
                  layoutStyles.navTextActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

       
          <TouchableOpacity
            activeOpacity={0.7}
            style={layoutStyles.navItem}
            onPress={goToJobs}
          >
            <Ionicons
              name="briefcase-outline"
              size={24}
              color={
                activeTab === "jobs"
                  ? "#421ddb"
                  : "#8A96A3"
              }
            />

            <Text
              style={[
                layoutStyles.navText,
                activeTab === "jobs" &&
                  layoutStyles.navTextActive,
              ]}
            >
              Jobs
            </Text>
          </TouchableOpacity>

      
          <TouchableOpacity
            activeOpacity={0.7}
            style={layoutStyles.navItem}
            onPress={goToInvoices}
          >
            <Ionicons
              name="receipt-outline"
              size={24}
              color={
                activeTab === "invoices"
                  ? "#421ddb"
                  : "#8A96A3"
              }
            />

            <Text
              style={[
                layoutStyles.navText,
                activeTab === "invoices" &&
                  layoutStyles.navTextActive,
              ]}
            >
              Invoices
            </Text>
          </TouchableOpacity>

         
          <TouchableOpacity
            activeOpacity={0.7}
            style={layoutStyles.navItem}
            onPress={goToProfile}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={
                activeTab === "profile"
                  ? "#421ddb"
                  : "#8A96A3"
              }
            />

            <Text
              style={[
                layoutStyles.navText,
                activeTab === "profile" &&
                  layoutStyles.navTextActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}
