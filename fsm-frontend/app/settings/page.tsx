"use client";

import { useEffect, useState } from "react";
import "./settings.css";
import {
    Company,
    CompanyRequest,
    createCompany,
    getCompanyById,
    updateCompany,
} from "../apiservice/companyService";
import {
    getUserById,
    updateUser,
    User,
} from "../apiservice/userservice";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function Settings() {
    const [company, setCompany] = useState<Company | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoPreview, setLogoPreview] = useState<string>("");

    const [formData, setFormData] = useState<CompanyRequest>({
        legalName: "",
        brandName: "",
        phone: "",
        email: "",
        logo: null,
        officeAddress: "",
        city: "",
        state: "",
        pincode: "",
        country: "",

        isGstRegistered: false,
        gstIdentificationNumber: "",
        gstName: "",
        registeredGstAddress: "",
        registeredState: "",
        registeredPin: "",

        // Tax settings
        taxEnabled: false,
        taxPercentage: null,
    });

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setLoading(true);

                const userId = sessionStorage.getItem("user_id");

                if (!userId) {
                    console.error("User ID not found in sessionStorage");
                    return;
                }

                const user = await getUserById({
                    id: Number(userId),
                });

                if (!user) {
                    console.error("User not found");
                    return;
                }

                setCurrentUser(user);

                if (!user.companyId) {
                    setCompany(null);
                    return;
                }

                const companyData = await getCompanyById(
                    Number(user.companyId)
                );

                setCompany(companyData);

                setFormData({
                    legalName: companyData.legalName || "",
                    brandName: companyData.brandName || "",
                    phone: companyData.phone || "",
                    email: companyData.email || "",
                    logo: null,
                    officeAddress: companyData.officeAddress || "",
                    city: companyData.city || "",
                    state: companyData.state || "",
                    pincode: companyData.pincode || "",
                    country: companyData.country || "",

                    isGstRegistered:
                        companyData.isGstRegistered || false,

                    gstIdentificationNumber:
                        companyData.gstIdentificationNumber || "",

                    gstName:
                        companyData.gstName || "",

                    registeredGstAddress:
                        companyData.registeredGstAddress || "",

                    registeredState:
                        companyData.registeredState || "",

                    registeredPin:
                        companyData.registeredPin || "",

                    // Tax settings
                    taxEnabled:
                        companyData.taxEnabled || false,

                    taxPercentage:
                        companyData.taxPercentage ?? null,

                    id: companyData.id,
                });

                setLogoPreview("");
            } catch (error) {
                console.error(
                    "Failed to fetch company details:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleLogoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            console.error("Please select an image file.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            console.error("Logo size must be less than 2MB.");
            return;
        }

        setFormData((previous) => ({
            ...previous,
            logo: file,
        }));

        const reader = new FileReader();

        reader.onload = () => {
            setLogoPreview(reader.result as string);
        };

        reader.readAsDataURL(file);
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);

            const userId = sessionStorage.getItem("user_id");

            if (!userId) {
                console.error("User ID not found in sessionStorage");
                return;
            }

            let savedCompany: Company;

            if (formData.id) {
                savedCompany = await updateCompany(formData);
            } else {
                savedCompany = await createCompany(formData);

                if (!savedCompany?.id) {
                    console.error(
                        "Company was created but company ID was not returned"
                    );
                    return;
                }

                if (!currentUser) {
                    console.error(
                        "Current user information is not available"
                    );
                    return;
                }

                await updateUser({
                    id: currentUser.id,
                    name: currentUser.name,
                    phone: currentUser.phone,
                    companyId: savedCompany.id,
                    updatedBy: currentUser.phone,
                });

                setCurrentUser({
                    ...currentUser,
                    companyId: savedCompany.id,
                    updatedAt: new Date().toISOString(),
                    updatedBy: currentUser.phone,
                });
            }

            setCompany(savedCompany);

            setFormData({
                legalName: savedCompany.legalName || "",
                brandName: savedCompany.brandName || "",
                phone: savedCompany.phone || "",
                email: savedCompany.email || "",
                logo: null,
                officeAddress: savedCompany.officeAddress || "",
                city: savedCompany.city || "",
                state: savedCompany.state || "",
                pincode: savedCompany.pincode || "",
                country: savedCompany.country || "",

                isGstRegistered:
                    savedCompany.isGstRegistered || false,

                gstIdentificationNumber:
                    savedCompany.gstIdentificationNumber || "",

                gstName:
                    savedCompany.gstName || "",

                registeredGstAddress:
                    savedCompany.registeredGstAddress || "",

                registeredState:
                    savedCompany.registeredState || "",

                registeredPin:
                    savedCompany.registeredPin || "",

                // Tax settings
                taxEnabled:
                    savedCompany.taxEnabled || false,

                taxPercentage:
                    savedCompany.taxPercentage ?? null,

                id: savedCompany.id,
            });

            setLogoPreview("");
        } catch (error) {
            console.error(
                "Failed to save company details:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const getLogoUrl = () => {
        if (logoPreview) {
            return logoPreview;
        }

        if (company?.logo) {
            return `${API_BASE_URL}/${company.logo}`;
        }

        return "/fsm-logo.png";
    };

    return (
        <>
            <div className="settings-container">

                <div className="dashboard-header settings-header">

                    <div className="left-header-dashboard">
                        Settings
                    </div>

                    <div className="right-setting-top">

                        <div className="left-header-settings">
                            <button>
                                Discard
                            </button>
                        </div>

                        <div className="right-header-dashboard">
                            <button
                                onClick={handleSaveChanges}
                                disabled={loading}
                            >
                                <span>
                                    <i className="bi bi-bookmark"></i>
                                </span>

                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>

                <div className="card-form-container">

                    <div className="company-tax">

                        <div className="company-tax-left">

                            <h2>
                                Company & Tax Settings
                            </h2>

                            <p>
                                Manage your company profile, business
                                location, and GST tax registration status.
                            </p>

                        </div>

                        <div className="right-card-top">

                            <span className="real-time-staff">
                                <i className="bi bi-dot"></i>
                                Profile & Tax Status: Active
                            </span>

                        </div>

                    </div>

                    {/* ================= COMPANY DETAILS ================= */}

                    <div className="white-card">

                        <div className="card-header-company">

                            <div className="card-header-company-left">

                                <span>
                                    <i className="bi bi-buildings"></i>
                                </span>

                                <div className="heading-form-company">

                                    <h5>
                                        Company Details
                                    </h5>

                                    <div className="tax-setting-desc">
                                        Displayed on invoices, customer work
                                        orders, and email dispatches. SVG,
                                        PNG or JPG (max 2MB).
                                    </div>

                                </div>

                            </div>

                            <div className="right-card-top">

                                <span className="real-time-staff">

                                    <i className="bi bi-dot"></i>

                                    Verified Profile

                                </span>

                            </div>

                        </div>

                        {/* ================= LOGO ================= */}

                        <div className="brand-logo-form">

                            <div className="logo-name-top">

                                <div className="logo-dotted-border">

                                    <div className="logo-bg-white">

                                        <div className="brand-logo-setting">

                                            <img
                                                src={getLogoUrl()}
                                                alt="Company Logo"
                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="company-logo-header">

                                    <h4>
                                        Company Brand Logo
                                    </h4>

                                    <p>
                                        Displayed on invoices, customer work
                                        orders, and email dispatches. SVG,
                                        PNG or JPG (max 2MB).
                                    </p>

                                </div>

                            </div>

                            <div className="logo-upload-box">

                                <div className="logo-upload">

                                    <input
                                        type="file"
                                        id="logo-upload"
                                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                        hidden
                                        onChange={handleLogoChange}
                                    />

                                    <label
                                        htmlFor="logo-upload"
                                        className="logo-upload-label"
                                    >
                                        <i className="bi bi-cloud-arrow-up"></i>

                                        <span>
                                            Upload New Logo
                                        </span>
                                    </label>

                                </div>

                                <span>
                                    <i className="bi bi-trash3"></i>
                                </span>

                            </div>

                        </div>

                        {/* ================= COMPANY FORM ================= */}

                        <div className="forms-settings">

                            <div className="row">

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Company Legal Name
                                        </div>

                                        <input
                                            className="form-input"
                                            name="legalName"
                                            value={formData.legalName}
                                            onChange={handleInputChange}
                                            placeholder={
                                                loading
                                                    ? "Loading..."
                                                    : ""
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Trade Name / Brand Name
                                        </div>

                                        <input
                                            className="form-input"
                                            name="brandName"
                                            value={formData.brandName}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Central Operations Hotline / Phone *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Official Business Email *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-12 col-md-12 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Headquarters / Office Street Address *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="officeAddress"
                                            value={formData.officeAddress}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            City
                                        </div>

                                        <input
                                            className="form-input"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            State / Province
                                        </div>

                                        <input
                                            className="form-input"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            PIN / Postal Code
                                        </div>

                                        <input
                                            className="form-input"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-3 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Country
                                        </div>

                                        <input
                                            className="form-input"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ================= GST & TAX ================= */}

                    <div className="white-card">

                        <div className="card-header-company">

                            <div className="card-header-company-left">

                                <span>
                                    <i className="bi bi-buildings"></i>
                                </span>

                                <div className="heading-form-company">

                                    <h5>
                                        GST & Tax Registration
                                    </h5>

                                    <div className="tax-setting-desc">
                                        Configure GST number, billing address,
                                        tax status, and automatic tax invoice
                                        generation.
                                    </div>

                                </div>

                            </div>

                            <div className="right-card-top">

                                <span className="real-time-staff purple">

                                    <i className="bi bi-shield-check"></i>

                                    GST & Tax Settings

                                </span>

                            </div>

                        </div>

                        {/* ================= TAX ENABLE ================= */}

                        <div className="brand-logo-form">

                            <div className="logo-name-top">

                                <div className="card-header-company-left">

                                    <span>
                                        <i className="bi bi-percent"></i>
                                    </span>

                                </div>

                                <div className="company-logo-header">

                                    <h4>
                                        Enable Tax
                                    </h4>

                                    <p>
                                        Enable this option to automatically
                                        calculate tax on customer invoices
                                        and billing.
                                    </p>

                                </div>

                            </div>

                            <div className="logo-upload-box">

                                <div
                                    className="toggle-icon"
                                    onClick={() =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            taxEnabled:
                                                !previous.taxEnabled,
                                        }))
                                    }
                                >

                                    <i
                                        className={
                                            formData.taxEnabled
                                                ? "bi bi-toggle-on"
                                                : "bi bi-toggle-off"
                                        }
                                    ></i>

                                </div>

                            </div>

                        </div>

                        {/* ================= TAX PERCENTAGE ================= */}

                        {formData.taxEnabled && (

                            <div className="forms-settings">

                                <div className="row">

                                    <div className="col-lg-6 col-md-6 col-sm-12">

                                        <div className="input-label">

                                            <div className="label-form">
                                                Tax Percentage *
                                            </div>

                                            <div
                                                style={{
                                                    position: "relative",
                                                }}
                                            >

                                                <input
                                                    className="form-input"
                                                    type="number"
                                                    name="taxPercentage"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={
                                                        formData.taxPercentage ??
                                                        ""
                                                    }
                                                    onChange={(event) => {

                                                        const value =
                                                            event.target.value;

                                                        setFormData(
                                                            (previous) => ({
                                                                ...previous,
                                                                taxPercentage:
                                                                    value === ""
                                                                        ? null
                                                                        : Number(
                                                                            value
                                                                        ),
                                                            })
                                                        );

                                                    }}
                                                    placeholder="Enter tax percentage"
                                                />

                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        right: "15px",
                                                        top: "50%",
                                                        transform:
                                                            "translateY(-50%)",
                                                        fontWeight: 600,
                                                        color: "#777",
                                                    }}
                                                >
                                                    %
                                                </span>

                                            </div>

                                            <p>
                                                Enter the tax percentage that
                                                should be automatically applied
                                                to invoices.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}


                        <div className="brand-logo-form">

                            <div className="logo-name-top">

                                <div className="card-header-company-left">

                                    <span>
                                        <i className="bi bi-cone-striped"></i>
                                    </span>

                                </div>

                                <div className="company-logo-header">

                                    <h4>
                                        Is your business GST Registered?
                                    </h4>

                                    <p>
                                        Enable this to generate and issue GST
                                        Tax Invoices during customer billing
                                        and work order checkout.
                                    </p>

                                </div>

                            </div>

                            <div className="logo-upload-box">

                                <div
                                    className="toggle-icon"
                                    onClick={() =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            isGstRegistered:
                                                !previous.isGstRegistered,
                                        }))
                                    }
                                >

                                    <i
                                        className={
                                            formData.isGstRegistered
                                                ? "bi bi-toggle-on"
                                                : "bi bi-toggle-off"
                                        }
                                    ></i>

                                </div>

                            </div>

                        </div>

        

                        <div className="forms-settings">

                            <div className="row">

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            GST Identification Number (GSTIN) *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="gstIdentificationNumber"
                                            value={
                                                formData.gstIdentificationNumber
                                            }
                                            onChange={handleInputChange}
                                            placeholder={
                                                loading
                                                    ? "Loading..."
                                                    : ""
                                            }
                                        />

                                        <p>
                                            15-digit alphanumeric code assigned
                                            by Government of India.
                                        </p>

                                    </div>

                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Registered GST Legal Name *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="gstName"
                                            value={formData.gstName}
                                            onChange={handleInputChange}
                                            placeholder={
                                                loading
                                                    ? "Loading..."
                                                    : ""
                                            }
                                        />

                                        <p>
                                            Must match the business name
                                            printed on your GST Registration
                                            Certificate.
                                        </p>

                                    </div>

                                </div>

                                <div className="col-lg-12 col-md-12 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Registered Business / Billing
                                            Address (for GST Invoices) *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="registeredGstAddress"
                                            value={
                                                formData.registeredGstAddress
                                            }
                                            onChange={handleInputChange}
                                            placeholder={
                                                loading
                                                    ? "Loading..."
                                                    : ""
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            Registered State / Jurisdiction *
                                        </div>

                                        <select
                                            className="form-input"
                                            name="registeredState"
                                            value={
                                                formData.registeredState
                                            }
                                            onChange={(event) =>
                                                setFormData(
                                                    (previous) => ({
                                                        ...previous,
                                                        registeredState:
                                                            event.target.value,
                                                    })
                                                )
                                            }
                                        >

                                            <option value="">
                                                Select State
                                            </option>

                                            <option value="Kerala">
                                                Kerala
                                            </option>

                                            <option value="Tamil Nadu">
                                                Tamil Nadu
                                            </option>

                                            <option value="Karnataka">
                                                Karnataka
                                            </option>

                                            <option value="Maharashtra">
                                                Maharashtra
                                            </option>

                                            <option value="Delhi">
                                                Delhi
                                            </option>

                                            <option value="Andhra Pradesh">
                                                Andhra Pradesh
                                            </option>

                                            <option value="Telangana">
                                                Telangana
                                            </option>

                                            <option value="Gujarat">
                                                Gujarat
                                            </option>

                                            <option value="Rajasthan">
                                                Rajasthan
                                            </option>

                                            <option value="West Bengal">
                                                West Bengal
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">

                                    <div className="input-label">

                                        <div className="label-form">
                                            PIN / Postal Code *
                                        </div>

                                        <input
                                            className="form-input"
                                            name="registeredPin"
                                            value={
                                                formData.registeredPin
                                            }
                                            onChange={handleInputChange}
                                            placeholder={
                                                loading
                                                    ? "Loading..."
                                                    : ""
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        <div className="brand-logo-form notify">

                            <span>
                                <i className="bi bi-exclamation-circle"></i>
                            </span>

                            <div className="notify-bottom">

                                <h6>
                                    Automatic Tax & GST Invoicing
                                </h6>

                                <div className="auto-bills">

                                    {formData.taxEnabled &&
                                    formData.taxPercentage !== null ? (
                                        <>
                                            Tax is enabled at{" "}
                                            <strong>
                                                {formData.taxPercentage}%
                                            </strong>
                                            .{" "}
                                        </>
                                    ) : (
                                        <>
                                            Automatic tax calculation is
                                            currently disabled.{" "}
                                        </>
                                    )}

                                    {formData.isGstRegistered && (
                                        <>
                                            GST invoicing is enabled with GSTIN,
                                            State code, and applicable CGST /
                                            SGST / IGST tax breakdowns.
                                        </>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Settings;