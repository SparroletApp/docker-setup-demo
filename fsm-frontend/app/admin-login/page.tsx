
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./admin-login.css";
import { superAdminService } from "../apiservice/SuperAdminService";

export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await superAdminService.login({
                email: email.trim(),
                password,
            });

            sessionStorage.setItem("access_token", response.token);
            sessionStorage.setItem("user_id", String(response.id));
            sessionStorage.setItem("user_email", response.email);
            sessionStorage.setItem("user_role", response.role);

            router.push("/admin-dashboard");
        } catch (error) {
            console.error("Login error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <div className="admin-login-container">

                <section className="admin-login-form-section">
                    <div className="admin-login-form-wrapper">

                        <div className="admin-login-mobile-logo">
                            <span className="admin-login-logo-icon">
                                <i className="bi bi-lightning-charge-fill"></i>
                            </span>

                            <span>FSM Cloud</span>
                        </div>

                        <div className="admin-login-heading">
                            <h2>Welcome back</h2>

                            <p>
                                Sign in to your admin account to continue.
                            </p>
                        </div>

                        <form
                            className="admin-login-form"
                            onSubmit={handleLogin}
                        >

         
                            <div className="admin-login-field">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="admin-login-input-wrapper">
                                    <i className="bi bi-envelope"></i>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

         
                            <div className="admin-login-field">
                                <div className="admin-login-label-row">
                                    <label htmlFor="password">
                                        Password
                                    </label>
                                </div>

                                <div className="admin-login-input-wrapper">
                                    <i className="bi bi-lock"></i>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="admin-login-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <i
                                            className={
                                                showPassword
                                                    ? "bi bi-eye-slash"
                                                    : "bi bi-eye"
                                            }
                                        ></i>
                                    </button>
                                </div>
                            </div>

            
                            {error && (
                                <div className="admin-login-error">
                                    <i className="bi bi-exclamation-circle"></i>
                                    <span>{error}</span>
                                </div>
                            )}

                 
                            <button
                                type="submit"
                                className="admin-login-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="admin-login-spinner"></span>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Login</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="admin-login-security">
                            <i className="bi bi-shield-check"></i>

                            <span>
                                Your account information is securely protected.
                            </span>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}
