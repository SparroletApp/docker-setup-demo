
import {
    Text,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from "react-native";

import { loginscreen } from "./Loginscreen.styles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "@/lib/userservice";


function LoginScreen({
    goToOtp,
}: {
    goToOtp: () => void;
}) {
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        const cleanPhone = phone.trim();

        if (!cleanPhone) {
            Alert.alert(
                "Error",
                "Please enter your phone number"
            );
            return;
        }               

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            Alert.alert(
                "Error",
                "Please enter a valid 10-digit phone number"
            );
            return;
        }

        setLoading(true);

        try {
            const user = await loginUser({
                phone: cleanPhone,
            });

            if (!user) {
                Alert.alert(
                    "Login Failed",
                    "Technician account not found."
                );
                return;
            }

            if (
                user.role !==   "TECHNICIAN"
            ) {
                Alert.alert(
                    "Access Denied",
                    "Only technician accounts can access this application."
                );
                return;
            }

            await AsyncStorage.setItem(
                "login_phone",
                cleanPhone
            );

            await AsyncStorage.setItem(
                "user_id",
                String(user.id)
            );

            if (user.companyId !== null) {
                await AsyncStorage.setItem(
                    "company_id",
                    String(user.companyId)
                );
            }

            goToOtp();

        } catch (error: any) {
            console.error(
                "Login error:",
                error
            );

            Alert.alert(
                "Login Failed",
                error?.message ||
                    "Something went wrong while logging in."
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
            <ScrollView
                contentContainerStyle={loginscreen.data}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require("../../assets/login.png")}
                    style={loginscreen.image}
                />

                <Text style={loginscreen.tab}>
                    Welcome Back
                </Text>

                <TextInput
                    style={[
                        loginscreen.input,
                        phoneFocused &&
                            loginscreen.inputFocused,
                    ]}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                    onFocus={() =>
                        setPhoneFocused(true)
                    }
                    onBlur={() =>
                        setPhoneFocused(false)
                    }
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[
                        loginscreen.loginButton,
                        loading &&
                            loginscreen.loginButtonDisabled,
                    ]}
                    onPress={sendOtp}
                    disabled={loading}
                >
                    <Text
                        style={
                            loginscreen.loginButtonText
                        }
                    >
                        {loading
                            ? "Sending..."
                            : "Login"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

