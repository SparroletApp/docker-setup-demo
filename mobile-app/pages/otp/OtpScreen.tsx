import {
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

// import { registerTechnicianPushToken } from "../../utils/notifications";

import { otpscreen } from "./OtpScreen.styles";
import { verifyOtp } from "@/lib/userservice";

function OtpScreen({
  goToHome,
  goToLogin,
}: {
  goToHome: () => void;
  goToLogin: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtpCode = async () => {
    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 8 digit OTP"
      );
      return;
    }

    setLoading(true);

    try {
      // Get phone number saved during login
      const phone = await AsyncStorage.getItem("login_phone");

      if (!phone) {
        Alert.alert(
          "Error",
          "Phone number is missing. Please login again."
        );
        return;
      }

      const cleanPhone = phone.trim();

      console.log("Verifying OTP for:", cleanPhone);
      const response = await verifyOtp({
        phone: cleanPhone,
        otp: cleanOtp,
      });

      if (!response) {
        Alert.alert(
          "OTP Verification Failed",
          "No response received from the server."
        );
        return;
      }

      const token = response.token;
      const user = response.user;

      if (!token) {
        Alert.alert(
          "Login Failed",
          "Authentication token was not returned."
        );
        return;
      }

      if (!user) {
        Alert.alert(
          "Login Failed",
          "User information was not returned."
        );
        return;
      }


      if (user.role?.toLowerCase() !== "technician") {
        Alert.alert(
          "Login Failed",
          "This account is not registered as a technician."
        );
        return;
      }

      console.log("Technician login successful");
      console.log("User ID:", user.id);
      console.log("User:", user);

      await AsyncStorage.setItem(
        "access_token",
        token
      );

      await AsyncStorage.setItem(
        "technician_id",
        user.id.toString()
      );

      if (user.companyId !== null && user.companyId !== undefined) {
        await AsyncStorage.setItem(
          "company_id",
          user.companyId.toString()
        );
      }

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log(
        "Technician ID:",
        user.id
      );

      console.log(
        "Company ID:",
        user.companyId
      );


      console.log(
        "Registering push notification token..."
      );

      // const pushTokenRegistered =
      //   await registerTechnicianPushToken(
      //     user.id.toString()
      //   );

      // if (pushTokenRegistered) {
      //   console.log(
      //     "Push notification token registered successfully."
      //   );
      // } else {
      //   console.log(
      //     "Push notification token was not registered."
      //   );
      // }

      await AsyncStorage.removeItem(
        "login_phone"
      );

      Alert.alert(
        "Success",
        "Technician login successful!",
        [
          {
            text: "OK",
            onPress: () => {
              goToHome();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "Verify OTP error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while verifying OTP.";

      Alert.alert(
        "OTP Verification Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <SafeAreaView style={otpscreen.safeArea}>
        <View style={otpscreen.header}>
          <TouchableOpacity
            style={otpscreen.backButton}
            onPress={goToLogin}
            disabled={loading}
          >
            <Text style={otpscreen.backButtonText}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={otpscreen.headerTitle}>
            Verify OTP
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={otpscreen.data}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={otpscreen.title}>
          Verify your phone
        </Text>

        <Text style={otpscreen.description}>
          Enter the OTP sent to your phone number
        </Text>

        <TextInput
          style={otpscreen.input}
          placeholder="Enter 8 digit OTP"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={8}
          value={otp}
          onChangeText={(text) => {
            setOtp(
              text.replace(/\D/g, "")
            );
          }}
          editable={!loading}
        />

        <TouchableOpacity
          style={[
            otpscreen.verifyButton,
            loading &&
              otpscreen.buttonDisabled,
          ]}
          disabled={
            loading ||
            otp.length !== 6
          }
          onPress={verifyOtpCode}
        >
          <Text
            style={otpscreen.verifyButtonText}
          >
            {loading
              ? "Verifying..."
              : "Verify & Login"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default OtpScreen;