"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import "./user-login.css";
import {
    loginUser,
    verifyOtp,
} from "../apiservice/userservice";

function UserLogin() {
    const router = useRouter();

    const [step, setStep] = useState<"mobile" | "otp">("mobile");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const handleMobileChange = (value: string) => {
        const numbersOnly = value
            .replace(/\D/g, "")
            .slice(0, 10);

        setMobile(numbersOnly);
    };

    const handleContinue = async () => {
        if (mobile.length !== 10) {
            Swal.fire({
                icon: "warning",
                title: "Invalid mobile number",
                text: "Please enter a valid 10-digit mobile number.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        try {
            setLoading(true);

            await loginUser({
                phone: mobile,
            });

            setOtp(["", "", "", "", "", ""]);
            setStep("otp");

            Swal.fire({
                icon: "success",
                title: "OTP Sent",
                text: "OTP has been sent to your mobile number.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to send OTP.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (
        value: string,
        index: number
    ) => {
        const number = value
            .replace(/\D/g, "")
            .slice(-1);

        const newOtp = [...otp];

        newOtp[index] = number;

        setOtp(newOtp);

        if (number && index < 5) {
            document
                .getElementById(`otp-${index + 1}`)
                ?.focus();
        }
    };

    const handleOtpKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            document
                .getElementById(`otp-${index - 1}`)
                ?.focus();
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            Swal.fire({
                icon: "warning",
                title: "Invalid OTP",
                text: "Please enter the 6-digit OTP.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        try {
            setLoading(true);

            const response = await verifyOtp({
                phone: mobile,
                otp: enteredOtp,
            });

            const user = response.user;

            const userRole = String(user.role ?? "")
                .trim()
                .toUpperCase();

            if (userRole !== "STAFF") {
                sessionStorage.clear();

                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: "Only staff users are allowed to access FSM Cloud.",
                    timer: 2500,
                    showConfirmButton: false,
                });

                setOtp(["", "", "", "", "", ""]);
                setStep("mobile");

                return;
            }

            /*
             * Store session only after STAFF role validation.
             */
            sessionStorage.clear();

            sessionStorage.setItem(
                "access_token",
                response.token
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            sessionStorage.setItem(
                "user_id",
                String(user.id)
            );

            

            sessionStorage.setItem(
                "user_phone",
                user.phone ?? mobile
            );

              sessionStorage.setItem(
                "company_id",
                String(user.companyId)
            );

            sessionStorage.setItem(
                "user_role",
                user.role ?? ""
            );

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Welcome to FSM Cloud.",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                router.push("/dashboard");
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Invalid OTP.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);

            await loginUser({
                phone: mobile,
            });

            setOtp(["", "", "", "", "", ""]);

            Swal.fire({
                icon: "success",
                title: "OTP Resent",
                text: "A new OTP has been sent.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to resend OTP.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeNumber = () => {
        if (loading) {
            return;
        }

        setOtp(["", "", "", "", "", ""]);
        setStep("mobile");
    };

    return (
        <div className="agent-login-page">
            <div className="agent-login-card">

                <div className="agent-login-left">
                    <div className="agent-login-brand">
                        <div className="agent-login-brand-icon">
                            <i className="bi bi-grid-1x2-fill"></i>
                        </div>

                        <span>FSM Cloud</span>
                    </div>

                    <div className="agent-login-illustration">
                        <div className="agent-login-circle agent-login-circle-one"></div>

                        <div className="agent-login-circle agent-login-circle-two"></div>

                        <div className="agent-login-main-icon">
                            <i className="bi bi-person-workspace"></i>
                        </div>

                        <div className="agent-login-floating-icon agent-login-floating-one">
                            <i className="bi bi-check-lg"></i>
                        </div>

                        <div className="agent-login-floating-icon agent-login-floating-two">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>

                        <div className="agent-login-floating-icon agent-login-floating-three">
                            <i className="bi bi-clipboard-check-fill"></i>
                        </div>
                    </div>

                    <div className="agent-login-left-content">
                        <h1>Manage Your Field Operations</h1>

                        <p>
                            Track jobs, manage technicians and keep your
                            service operations running smoothly.
                        </p>
                    </div>
                </div>

                <div className="agent-login-right">

                    {step === "mobile" ? (
                        <div className="agent-login-form">

                            <div className="agent-login-form-header">
                                <span className="agent-login-small-title">
                                    Welcome Back
                                </span>

                                <h2>
                                    Sign in to your account
                                </h2>

                                <p>
                                    Enter your mobile number to continue.
                                </p>
                            </div>

                            <div className="agent-login-field">
                                <label htmlFor="mobile">
                                    Mobile Number
                                </label>

                                <div className="agent-login-mobile-input">
                                    
                                    <input
                                        id="mobile"
                                        type="tel"
                                        value={mobile}
                                        onChange={(event) =>
                                            handleMobileChange(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter mobile number"
                                        maxLength={12}
                                        disabled={loading}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter"
                                            ) {
                                                handleContinue();
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="agent-login-button"
                                onClick={handleContinue}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Sending OTP
                                        <i className="bi bi-arrow-repeat"></i>
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <i className="bi bi-arrow-right"></i>
                                    </>
                                )}
                            </button>

                            <p className="agent-login-footer-text">
                                Secure login powered by FSM Cloud
                            </p>
                        </div>
                    ) : (
                        <div className="agent-login-form">

                            <div className="agent-login-form-header">
                                <button
                                    type="button"
                                    className="agent-login-back-button"
                                    onClick={handleChangeNumber}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Change number
                                </button>

                                <span className="agent-login-small-title">
                                    Verification
                                </span>

                                <h2>
                                    Verify OTP
                                </h2>

                                <p>
                                    Enter the 6-digit OTP sent to
                                    <strong>
                                        {mobile}
                                    </strong>
                                </p>
                            </div>

                            <div className="agent-login-otp-section">
                                <label>
                                    Enter OTP
                                </label>

                                <div className="agent-login-otp-container">
                                    {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={value}
                                            disabled={loading}
                                            onChange={(event) =>
                                                handleOtpChange(
                                                    event.target.value,
                                                    index
                                                )
                                            }
                                            onKeyDown={(event) =>
                                                handleOtpKeyDown(
                                                    event,
                                                    index
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="agent-login-resend">
                                <span>
                                    Didn't receive the OTP?
                                </span>

                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <button
                                type="button"
                                className="agent-login-button"
                                onClick={handleVerify}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Verifying
                                        <i className="bi bi-arrow-repeat"></i>
                                    </>
                                ) : (
                                    <>
                                        Verify & Continue
                                        <i className="bi bi-arrow-right"></i>
                                    </>
                                )}
                            </button>

                            <p className="agent-login-footer-text">
                                Secure login powered by FSM Cloud
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
