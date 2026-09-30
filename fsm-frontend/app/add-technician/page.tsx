
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import "./add-technician.css";
import {
    createUser,
    getUserById,
} from "../apiservice/userservice";

interface AddTechnicianProps {
    onClose: () => void;
}

function AddTechnician({ onClose }: AddTechnicianProps) {
    const [selectedLevel, setSelectedLevel] =
        useState("Apprentice");

    const [licenses, setLicenses] =
        useState<string[]>([]);

    const [licenseInput, setLicenseInput] =
        useState("");

    const [showLicenseInput, setShowLicenseInput] =
        useState(false);

    const [fullName, setFullName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [specialization, setSpecialization] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const options = [
        {
            id: "Apprentice",
            title: "Apprentice",
            icon: "bi bi-circle",
            activeIcon: "bi bi-record-circle-fill",
        },
        {
            id: "Journeyman",
            title: "Journeyman",
            icon: "bi bi-circle",
            activeIcon: "bi bi-record-circle-fill",
        },
        {
            id: "Master / Lead",
            title: "Master / Lead",
            icon: "bi bi-circle",
            activeIcon: "bi bi-record-circle-fill",
        },
    ];

    const handleLicenseKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") {
            return;
        }

        e.preventDefault();

        const license =
            licenseInput.trim();

        if (!license) {
            return;
        }

        if (!licenses.includes(license)) {
            setLicenses([
                ...licenses,
                license,
            ]);
        }

        setLicenseInput("");
    };

    const removeLicense = (
        license: string
    ) => {
        setLicenses(
            licenses.filter(
                (item) => item !== license
            )
        );
    };

    const closeLicenseInput = () => {
        setShowLicenseInput(false);
        setLicenseInput("");
    };

   const handleSaveTechnician = async () => {
    console.log(
        "========== SAVE TECHNICIAN =========="
    );

    if (!fullName.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Full name required",
            text: "Please enter the technician's full name.",
            timer: 2000,
            showConfirmButton: false,
        });

        return;
    }

    if (!phone.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Phone number required",
            text: "Please enter the technician's phone number.",
            timer: 2000,
            showConfirmButton: false,
        });

        return;
    }

    /*
     * Session storage contains:
     *
     * user_id
     * user_phone
     * user_role
     * company_id
     * access_token
     */

    const userId =
        sessionStorage.getItem("user_id");

    const userPhone =
        sessionStorage.getItem("user_phone");

    const companyId =
        sessionStorage.getItem("company_id");

    console.log(
        "Session user_id:",
        userId
    );

    console.log(
        "Session user_phone:",
        userPhone
    );

    console.log(
        "Session company_id:",
        companyId
    );

    if (!userId) {
        Swal.fire({
            icon: "error",
            title: "User ID not found",
            text: "Please log in again.",
            timer: 2500,
            showConfirmButton: false,
        });

        return;
    }

    if (!userPhone) {
        Swal.fire({
            icon: "error",
            title: "User phone not found",
            text: "Please log in again.",
            timer: 2500,
            showConfirmButton: false,
        });

        return;
    }

    if (!companyId) {
        Swal.fire({
            icon: "error",
            title: "Company ID not found",
            text: "Please log in again.",
            timer: 2500,
            showConfirmButton: false,
        });

        return;
    }

    try {
        setLoading(true);

        const requestData = {
            name:
                fullName.trim(),

            phone:
                phone.trim(),

            email:
                email.trim() ||
                undefined,

            role:
                "TECHNICIAN",

            specialization:
                specialization.trim() ||
                undefined,

            ability:
                selectedLevel ||
                undefined,

            license:
                licenses.length > 0
                    ? licenses
                    : undefined,

            /*
             * Company ID comes directly
             * from sessionStorage.
             */
            companyId:
                Number(companyId),

            /*
             * CreatedBy comes from
             * logged-in user's phone.
             */
            createdBy:
                userPhone,
        };

        console.log(
            "================================"
        );

        console.log(
            "CREATE TECHNICIAN REQUEST:"
        );

        console.log(
            requestData
        );

        console.log(
            "Company ID:",
            requestData.companyId
        );

        console.log(
            "Created By:",
            requestData.createdBy
        );

        console.log(
            "Calling createUser..."
        );

        const response =
            await createUser(
                requestData
            );

        console.log(
            "CREATE TECHNICIAN RESPONSE:",
            response
        );

        if (!response) {
            throw new Error(
                "Server returned an empty response."
            );
        }

        console.log(
            "Technician successfully created."
        );

        await Swal.fire({
            icon: "success",
            title: "Technician Added",
            text:
                response.technicianId
                    ? `Technician ${response.technicianId} has been successfully onboarded.`
                    : "Technician has been successfully onboarded.",
            timer: 1800,
            showConfirmButton: false,
        });

        onClose();

    } catch (error: any) {
        console.error(
            "========== CREATE TECHNICIAN ERROR =========="
        );

        console.error(
            "Full error:",
            error
        );

        console.error(
            "Error message:",
            error?.message
        );

        console.error(
            "Error response:",
            error?.response
        );

        console.error(
            "Error response data:",
            error?.response?.data
        );

        console.error(
            "Error status:",
            error?.response?.status
        );

        const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Something went wrong while creating the technician.";

        Swal.fire({
            icon: "error",
            title: "Failed to add technician",
            text: errorMessage,
            timer: 4000,
            showConfirmButton: false,
        });

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="add-technician">

            <div className="add-field-top">

                <div className="human-field-top">

                    <div className="add-title-technician">

                        <h3>
                            Add Field Technician
                        </h3>

                    </div>

                </div>

                <button
                    type="button"
                    className="add-technician-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <i className="bi bi-x-lg"></i>
                </button>

            </div>

            <div className="add-technician-head">

                <span>
                    <i className="bi bi-person-video2"></i>
                </span>

                <h3>
                    1. PERSONAL &amp; CONTACT DETAILS
                </h3>

            </div>

            <div className="logo-upload-section">

                <div className="logo-upload-photo">

                    <i className="bi bi-camera"></i>

                    <span>
                        Photo
                    </span>

                </div>

                <div className="logo-upload-content">

                    <div className="logo-upload-actions">

                        <label
                            htmlFor="technician-avatar-upload"
                            className="logo-upload-button"
                        >
                            <i className="bi bi-upload"></i>
                            Upload Avatar
                        </label>

                        <input
                            type="file"
                            id="technician-avatar-upload"
                            accept="image/png, image/jpeg, image/webp"
                            hidden
                        />

                        <button
                            type="button"
                            className="logo-upload-remove"
                        >
                            Remove
                        </button>

                    </div>

                    <p>
                        PNG, JPG or WebP up to 4MB.
                        Square aspect recommended.
                    </p>

                </div>

            </div>

            <div className="forms-settings">

                <div className="row">

                    <div className="col-lg-6 col-md-6 col-sm-12">

                        <div className="input-label">

                            <div className="label-form">
                                Full Name*
                            </div>

                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter full name"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">

                        <div className="input-label">

                            <div className="label-form">
                                Phone Number*
                            </div>

                            <input
                                type="tel"
                                className="form-input"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">

                        <div className="input-label">

                            <div className="label-form">
                                Work Email
                            </div>

                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter work email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

            <div className="add-technician-head">

                <span>
                    <i className="bi bi-tools"></i>
                </span>

                <h3>
                    2. SPECIALIZATION &amp;
                    TRADE CERTIFICATIONS
                </h3>

            </div>

            <div className="forms-settings">

                <div className="row">

                    <div className="col-lg-12 col-md-12 col-sm-12">

                        <div className="input-label">

                            <div className="label-form">
                                Primary Trade Specialization
                            </div>

                            <select
                                className="form-input"
                                value={specialization}
                                onChange={(e) =>
                                    setSpecialization(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select specialization
                                </option>

                                <option value="HVAC">
                                    HVAC
                                </option>

                                <option value="Industrial Electrical">
                                    Industrial Electrical
                                </option>

                                <option value="Plumbing">
                                    Plumbing
                                </option>

                                <option value="Telemetry">
                                    Telemetry
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="row">

                        {options.map(
                            (option) => (

                                <div
                                    className="col-lg-4 col-md-4 col-sm-12"
                                    key={option.id}
                                >

                                    <button
                                        type="button"
                                        className={`form-input ${
                                            selectedLevel ===
                                            option.id
                                                ? "technician-level-option-active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedLevel(
                                                option.id
                                            )
                                        }
                                    >

                                        <i
                                            className={
                                                selectedLevel ===
                                                option.id
                                                    ? option.activeIcon
                                                    : option.icon
                                            }
                                        ></i>

                                        <span>
                                            {option.title}
                                        </span>

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12">

                        <div className="input-label technician-license-field">

                            <div className="label-form">
                                Certifications &amp;
                                Active Licenses
                            </div>

                            <div className="technician-license-list">

                                {licenses.map(
                                    (license) => (

                                        <div
                                            className="technician-license-chip"
                                            key={license}
                                        >

                                            <span className="technician-license-icon">

                                                <i className="bi bi-patch-check"></i>

                                            </span>

                                            <span className="technician-license-name">
                                                {license}
                                            </span>

                                            <button
                                                type="button"
                                                className="technician-license-remove"
                                                onClick={() =>
                                                    removeLicense(
                                                        license
                                                    )
                                                }
                                                aria-label={`Remove ${license}`}
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                            {!showLicenseInput ? (

                                <button
                                    type="button"
                                    className="technician-add-license-button"
                                    onClick={() =>
                                        setShowLicenseInput(
                                            true
                                        )
                                    }
                                >

                                    <i className="bi bi-plus-lg"></i>

                                    Add License

                                </button>

                            ) : (

                                <div className="technician-license-input-wrapper">

                                    <input
                                        type="text"
                                        className="technician-license-input"
                                        placeholder="Enter certification or license"
                                        value={licenseInput}
                                        onChange={(e) =>
                                            setLicenseInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleLicenseKeyDown
                                        }
                                        autoFocus
                                    />

                                    <button
                                        type="button"
                                        className="technician-license-input-close"
                                        onClick={
                                            closeLicenseInput
                                        }
                                        aria-label="Close license input"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

            <div className="add-technician-footer">

                <button
                    type="button"
                    className="add-technician-cancel"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="add-technician-submit"
                    onClick={handleSaveTechnician}
                    disabled={loading}
                >

                    <i className="bi bi-check-circle"></i>

                    {loading
                        ? "Saving..."
                        : "Save & Onboard Technician"}

                </button>

            </div>

        </div>
    );
}

export default AddTechnician;
