
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// Services
import {
    getInvoiceById,
    Invoice,
} from "../../lib/invoiceservice";

import {
    getJobById,
} from "../../lib/jobservice";

import {
    getTicketById,
} from "../../lib/ticketservice";

import {
    getCompanyById,
} from "../../lib/companyservice";

import {
    getUserById,
} from "../../lib/userservice";

import {
    getCustomerById,
} from "../../lib/customerservice";
import { invoiceViewStyles } from "./InvoiceView,styles";


/* =========================================================
   TYPES
========================================================= */

type Customer = {
    id?: number;
    customerId?: string;

    name?: string | null;
    phone?: string | number | null;
    email?: string | null;

    address?: string | null;
    pincode?: string | number | null;

    [key: string]: any;
};

type Company = {
    id?: number;

    legalName?: string | null;
    brandName?: string | null;

    name?: string | null;
    companyName?: string | null;

    phone?: string | number | null;
    email?: string | null;

    officeAddress?: string | null;
    address?: string | null;

    city?: string | null;
    state?: string | null;
    pincode?: string | number | null;
    country?: string | null;

    gstNumber?: string | null;
    gstin?: string | null;

    logo?: string | null;
    logoPath?: string | null;
    logoUrl?: string | null;

    [key: string]: any;
};

type Technician = {
    id?: number;

    name?: string | null;
    userName?: string | null;
    user_name?: string | null;

    phone?: string | number | null;
    userPhone?: string | number | null;
    user_phone?: string | number | null;

    email?: string | null;

    technicianId?: string | null;

    [key: string]: any;
};

type Job = {
    id: number;

    jobId?: string | null;
    jobNumber?: string | null;

    ticketId?: number | null;

    customerId?: number | null;
    technicianId?: number | null;
    companyId?: number | null;

    title?: string | null;
    description?: string | null;

    status?: string | null;
    priority?: string | null;

    expectedDate?: string | null;
    scheduledDate?: string | null;

    workStartedAt?: string | null;
    workCompletedAt?: string | null;

    workingHours?: number | string | null;

    serviceAddress?: string | null;

    [key: string]: any;
};

type Ticket = {
    id?: number;

    ticketId?: string | null;

    customerId?: number | null;
    companyId?: number | null;

    title?: string | null;
    description?: string | null;

    serviceTypeId?: number | null;

    status?: string | null;

    [key: string]: any;
};

type InvoiceViewProps = {
    invoiceId: string | number;
    goToInvoices: () => void;
};

/* =========================================================
   HELPERS
========================================================= */

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_API_URL ||
    "";

const toNumber = (
    value: any,
    fallback = 0
): number => {
    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : fallback;
};

const firstValue = (
    ...values: any[]
) => {
    for (const value of values) {
        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   COMPONENT
========================================================= */

function InvoiceView({
    invoiceId,
    goToInvoices,
}: InvoiceViewProps) {
    const [invoice, setInvoice] =
        useState<Invoice | null>(null);

    const [customer, setCustomer] =
        useState<Customer | null>(null);

    const [company, setCompany] =
        useState<Company | null>(null);

    const [technician, setTechnician] =
        useState<Technician | null>(null);

    const [jobs, setJobs] =
        useState<Job[]>([]);

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [creatingPdf, setCreatingPdf] =
        useState(false);

    /* =====================================================
       LOAD INVOICE
    ===================================================== */

    useEffect(() => {
        loadInvoice();
    }, [invoiceId]);

    const loadInvoice = async () => {
        try {
            setLoading(true);

            const numericInvoiceId =
                Number(invoiceId);

            if (
                !Number.isFinite(
                    numericInvoiceId
                )
            ) {
                Alert.alert(
                    "Invalid Invoice",
                    "The selected invoice ID is invalid."
                );

                return;
            }

            const invoiceData =
                await getInvoiceById(
                    numericInvoiceId
                );

            if (!invoiceData) {
                setInvoice(null);
                return;
            }

            setInvoice(invoiceData);

            await loadRelatedData(
                invoiceData
            );
        } catch (error) {
            console.log(
                "Invoice loading error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to load invoice details."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD RELATED DATA
    ===================================================== */

    const loadRelatedData = async (
        invoiceData: Invoice
    ) => {
        try {
            const jobIds = Array.isArray(
                invoiceData.jobIds
            )
                ? invoiceData.jobIds
                    .map(Number)
                    .filter(
                        (id) =>
                            Number.isFinite(id)
                    )
                : [];

            const loadedJobs: Job[] = [];

            for (const jobId of jobIds) {
                try {
                    const jobData =
                        await getJobById({
                            id: jobId,
                        });

                    if (jobData) {
                        loadedJobs.push(
                            jobData as Job
                        );
                    }
                } catch (error) {
                    console.log(
                        `Unable to load job ${jobId}:`,
                        error
                    );
                }
            }

            setJobs(loadedJobs);

            /* ---------------------------------------------
               CUSTOMER
            --------------------------------------------- */

            const customerId =
                firstValue(
                    loadedJobs[0]?.customerId
                );

            if (
                customerId !== null &&
                customerId !== undefined
            ) {
                try {
                    const customerData =
                        await getCustomerById(
                            Number(customerId)
                        );

                    if (customerData) {
                        setCustomer(
                            customerData as Customer
                        );
                    }
                } catch (error) {
                    console.log(
                        "Customer loading error:",
                        error
                    );
                }
            }

            /* ---------------------------------------------
               COMPANY
            --------------------------------------------- */

            const companyId =
                firstValue(
                    loadedJobs[0]?.companyId
                );

            if (
                companyId !== null &&
                companyId !== undefined
            ) {
                try {
                    const companyData =
                        await getCompanyById(
                            Number(companyId)
                        );

                    if (companyData) {
                        setCompany(
                            companyData as Company
                        );
                    }
                } catch (error) {
                    console.log(
                        "Company loading error:",
                        error
                    );
                }
            }

            /* ---------------------------------------------
               TECHNICIAN
            --------------------------------------------- */

            const technicianId =
                firstValue(
                    loadedJobs[0]?.technicianId
                );

            if (
                technicianId !== null &&
                technicianId !== undefined
            ) {
                try {
                    const technicianData =
                        await getUserById({
                            id: Number(
                                technicianId
                            ),
                        });

                    if (technicianData) {
                        setTechnician(
                            technicianData as Technician
                        );
                    }
                } catch (error) {
                    console.log(
                        "Technician loading error:",
                        error
                    );
                }
            }

            /* ---------------------------------------------
               TICKETS
            --------------------------------------------- */

            const ticketIds =
                Array.from(
                    new Set(
                        loadedJobs
                            .map(
                                (job) =>
                                    job.ticketId
                            )
                            .filter(
                                (
                                    id
                                ): id is number =>
                                    id !== null &&
                                    id !== undefined
                            )
                            .map(Number)
                    )
                );

            const loadedTickets: Ticket[] =
                [];

            for (
                const ticketId of ticketIds
            ) {
                try {
                    const ticketData =
                        await getTicketById({
                            id: ticketId,
                        });

                    if (ticketData) {
                        loadedTickets.push(
                            ticketData as Ticket
                        );
                    }
                } catch (error) {
                    console.log(
                        `Unable to load ticket ${ticketId}:`,
                        error
                    );
                }
            }

            setTickets(
                loadedTickets
            );
        } catch (error) {
            console.log(
                "Related invoice data error:",
                error
            );
        }
    };

    /* =====================================================
       DISPLAY HELPERS
    ===================================================== */

    const getInvoiceNumber = () => {
        return (
            invoice?.invoiceId ||
            `INV-${invoice?.id || invoiceId}`
        );
    };

    const getStatus = () => {
        const status =
            invoice?.status ||
            "PENDING";

        return String(status)
            .replace(/_/g, " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
    };

    const getPaymentStatus = () => {
        const status =
            invoice?.paymentStatus ||
            "PENDING";

        return String(status)
            .replace(/_/g, " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
    };

    const formatCurrency = (
        value?: number | string | null
    ) => {
        const numericValue =
            toNumber(value);

        return `₹${numericValue.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const formatDate = (
        value?: string | null
    ) => {
        if (!value) {
            return "Not available";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatDateTime = (
        value?: string | null
    ) => {
        if (!value) {
            return "Not available";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }
        );
    };

    const getCustomerName = () => {
        return (
            customer?.name ||
            "Not available"
        );
    };

    const getCustomerPhone = () => {
        return customer?.phone
            ? String(customer.phone)
            : "Not available";
    };

    const getCustomerAddress = () => {
        return (
            customer?.address ||
            "Not available"
        );
    };

    const getCompanyName = () => {
        return (
            company?.brandName ||
            company?.legalName ||
            company?.companyName ||
            company?.name ||
            "Company"
        );
    };

    const getCompanyAddress = () => {
        const addressParts = [
            company?.officeAddress ||
                company?.address,
            company?.city,
            company?.state,
            company?.pincode,
            company?.country,
        ].filter(
            (value) =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
        );

        return addressParts.join(", ");
    };

    const getTechnicianName = () => {
        return (
            technician?.name ||
            technician?.userName ||
            technician?.user_name ||
            "Not available"
        );
    };

    const getTechnicianPhone = () => {
        const phone =
            firstValue(
                technician?.phone,
                technician?.userPhone,
                technician?.user_phone
            );

        return phone
            ? String(phone)
            : "Not available";
    };

    const getJobNumber = (
        job: Job
    ) => {
        return (
            job.jobId ||
            job.jobNumber ||
            `JOB-${job.id}`
        );
    };

    const getServiceAddress = () => {
        return (
            jobs[0]?.serviceAddress ||
            getCustomerAddress()
        );
    };

    const getTotalPrice = () => {
        return toNumber(
            invoice?.totalPrice
        );
    };

    /*
      These fields are optional because the current
      CreateInvoiceRequest only exposes totalPrice.

      If your backend later returns these fields,
      the PDF will automatically use them.
    */
    const getSubtotal = () => {
        const invoiceAny =
            invoice as any;

        return toNumber(
            firstValue(
                invoiceAny?.subtotal,
                invoiceAny?.subTotal,
                invoiceAny?.servicePrice
            )
        );
    };

    const getTaxableAmount = () => {
        const invoiceAny =
            invoice as any;

        const subtotal =
            getSubtotal();

        const partsTotal =
            toNumber(
                invoiceAny?.partsTotal
            );

        if (
            subtotal === 0 &&
            partsTotal > 0
        ) {
            return partsTotal;
        }

        if (
            subtotal === 0 &&
            getTotalPrice() > 0
        ) {
            return getTotalPrice();
        }

        return subtotal;
    };

    const getCgst = () => {
        const invoiceAny =
            invoice as any;

        return toNumber(
            firstValue(
                invoiceAny?.cgst,
                invoiceAny?.cgstAmount,
                invoiceAny?.cgstTax
            )
        );
    };

    const getSgst = () => {
        const invoiceAny =
            invoice as any;

        return toNumber(
            firstValue(
                invoiceAny?.sgst,
                invoiceAny?.sgstAmount,
                invoiceAny?.sgstTax
            )
        );
    };

    const getTaxTotal = () => {
        return (
            getCgst() +
            getSgst()
        );
    };

    /* =====================================================
       PHONE
    ===================================================== */

    const openPhone = async () => {
        const phone =
            getCustomerPhone();

        if (
            phone ===
            "Not available"
        ) {
            return;
        }

        try {
            await Linking.openURL(
                `tel:${phone}`
            );
        } catch (error) {
            console.log(
                "Phone error:",
                error
            );
        }
    };

    /* =====================================================
       HTML HELPERS
    ===================================================== */

    const escapeHtml = (
        value: any
    ) => {
        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    };

    const getLogoUrl = () => {
        const companyAny =
            company as any;

        const logo = firstValue(
            companyAny?.logoUrl,
            companyAny?.logoPath,
            companyAny?.logo,
            companyAny?.companyLogo
        );

        if (!logo) {
            return "";
        }

        const logoString =
            String(logo);

        if (
            logoString.startsWith(
                "http://"
            ) ||
            logoString.startsWith(
                "https://"
            ) ||
            logoString.startsWith(
                "data:"
            )
        ) {
            return logoString;
        }

        if (!API_BASE_URL) {
            return "";
        }

        return `${API_BASE_URL.replace(
            /\/$/,
            ""
        )}/${logoString.replace(
            /^\//,
            ""
        )}`;
    };

    /* =====================================================
       PDF
    ===================================================== */

    const generatePdfHtml = () => {
        const logoUrl =
            getLogoUrl();

        const invoiceAny =
            invoice as any;

        const companyPhone =
            firstValue(
                company?.phone
            );

        const companyEmail =
            firstValue(
                company?.email
            );

        const companyGstin =
            firstValue(
                company?.gstNumber,
                company?.gstin,
                invoiceAny?.gstin
            );

        const servicePrice =
            getSubtotal();

        const cgst =
            getCgst();

        const sgst =
            getSgst();

        const taxTotal =
            getTaxTotal();

        const grandTotal =
            getTotalPrice();

        const jobsRows =
            jobs.length > 0
                ? jobs
                    .map(
                        (
                            job,
                            index
                        ) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${escapeHtml(
                                getJobNumber(
                                    job
                                )
                            )}</td>
                            <td>${escapeHtml(
                                job.ticketId ??
                                    "-"
                            )}</td>
                            <td>${escapeHtml(
                                job.title ||
                                    "Service Job"
                            )}</td>
                            <td>${escapeHtml(
                                formatDate(
                                    job.scheduledDate ||
                                        job.expectedDate
                                )
                            )}</td>
                            <td>${escapeHtml(
                                job.status ||
                                    "-"
                            )}</td>
                            <td>${escapeHtml(
                                toNumber(
                                    job.workingHours
                                ).toFixed(
                                    2
                                )
                            )}</td>
                        </tr>
                    `
                    )
                    .join("")
                : `
                    <tr>
                        <td
                            colspan="7"
                            class="empty-cell"
                        >
                            No job details available
                        </td>
                    </tr>
                `;

        const invoiceItems =
            jobs.length > 0
                ? jobs
                : [];

        const itemRows =
            invoiceItems.length > 0
                ? invoiceItems
                    .map(
                        (
                            job,
                            index
                        ) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                ${escapeHtml(
                                    getJobNumber(
                                        job
                                    )
                                )}
                            </td>
                            <td>
                                ${escapeHtml(
                                    job.title ||
                                        "Service"
                                )}
                            </td>
                            <td>
                                ${escapeHtml(
                                    job.description ||
                                        "-"
                                )}
                            </td>
                        </tr>
                    `
                    )
                    .join("")
                : `
                    <tr>
                        <td
                            colspan="4"
                            class="empty-cell"
                        >
                            Service details not available
                        </td>
                    </tr>
                `;

        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>

@page {
    size: A4;
    margin: 0;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #222222;
    background: #ffffff;
    font-size: 11px;
}

.page {
    width: 100%;
    padding: 28px 34px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #421DDB;
    padding-bottom: 16px;
    margin-bottom: 18px;
}

.company-left {
    width: 62%;
}

.logo {
    max-width: 135px;
    max-height: 65px;
    object-fit: contain;
    margin-bottom: 7px;
}

.company-name {
    font-size: 22px;
    font-weight: 700;
    color: #421DDB;
    margin-bottom: 5px;
}

.company-details {
    color: #555555;
    line-height: 1.5;
    font-size: 10px;
}

.invoice-right {
    width: 32%;
    text-align: right;
}

.invoice-title {
    font-size: 27px;
    font-weight: 700;
    color: #222222;
    margin-bottom: 6px;
}

.invoice-number {
    font-size: 13px;
    font-weight: 700;
    color: #421DDB;
}

.invoice-date {
    margin-top: 5px;
    color: #666666;
    font-size: 10px;
}

.status {
    display: inline-block;
    margin-top: 8px;
    padding: 5px 10px;
    border-radius: 12px;
    background: #eeeaff;
    color: #421DDB;
    font-weight: 700;
    font-size: 9px;
}

.section {
    margin-top: 17px;
}

.section-title {
    font-size: 13px;
    font-weight: 700;
    color: #421DDB;
    border-bottom: 1px solid #dedede;
    padding-bottom: 6px;
    margin-bottom: 9px;
}

.info-grid {
    display: flex;
    width: 100%;
}

.info-box {
    width: 50%;
    padding-right: 15px;
}

.label {
    font-size: 8px;
    color: #777777;
    text-transform: uppercase;
    margin-bottom: 2px;
}

.value {
    font-size: 11px;
    color: #222222;
    font-weight: 600;
    margin-bottom: 7px;
    line-height: 1.4;
}

.customer-box {
    border: 1px solid #dddddd;
    padding: 11px;
}

.customer-columns {
    display: flex;
}

.customer-column {
    width: 50%;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 5px;
}

th {
    background: #f2f1fb;
    color: #333333;
    font-size: 9px;
    font-weight: 700;
    border: 1px solid #d8d8d8;
    padding: 7px 6px;
    text-align: left;
}

td {
    border: 1px solid #dddddd;
    padding: 7px 6px;
    font-size: 9px;
    vertical-align: top;
}

.empty-cell {
    text-align: center;
    color: #777777;
    padding: 12px;
}

.summary-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 13px;
}

.summary {
    width: 280px;
    border: 1px solid #dddddd;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 7px 9px;
    border-bottom: 1px solid #eeeeee;
}

.summary-row:last-child {
    border-bottom: none;
}

.summary-label {
    color: #555555;
}

.summary-value {
    font-weight: 600;
}

.total-row {
    background: #f2f1fb;
    color: #421DDB;
    font-size: 14px;
    font-weight: 700;
}

.payment-box {
    margin-top: 15px;
    border: 1px solid #dddddd;
    padding: 10px;
}

.footer {
    margin-top: 22px;
    border-top: 1px solid #dddddd;
    padding-top: 9px;
    text-align: center;
    color: #777777;
    font-size: 8px;
    line-height: 1.5;
}

</style>
</head>

<body>

<div class="page">

    <!-- HEADER -->

    <div class="header">

        <div class="company-left">

            ${
                logoUrl
                    ? `
                    <img
                        src="${escapeHtml(
                            logoUrl
                        )}"
                        class="logo"
                    />
                    `
                    : ""
            }

            <div class="company-name">
                ${escapeHtml(
                    getCompanyName()
                )}
            </div>

            <div class="company-details">

                ${
                    getCompanyAddress()
                        ? escapeHtml(
                              getCompanyAddress()
                          ) +
                          "<br />"
                        : ""
                }

                ${
                    companyPhone
                        ? "Phone: " +
                          escapeHtml(
                              companyPhone
                          ) +
                          "<br />"
                        : ""
                }

                ${
                    companyEmail
                        ? "Email: " +
                          escapeHtml(
                              companyEmail
                          ) +
                          "<br />"
                        : ""
                }

                ${
                    companyGstin
                        ? "GSTIN: " +
                          escapeHtml(
                              companyGstin
                          )
                        : ""
                }

            </div>

        </div>

        <div class="invoice-right">

            <div class="invoice-title">
                INVOICE
            </div>

            <div class="invoice-number">
                ${escapeHtml(
                    getInvoiceNumber()
                )}
            </div>

            <div class="invoice-date">
                Date:
                ${escapeHtml(
                    formatDate(
                        invoice?.createdAt
                    )
                )}
            </div>

            <div class="status">
                ${escapeHtml(
                    getStatus()
                )}
            </div>

        </div>

    </div>

    <!-- CUSTOMER -->

    <div class="section">

        <div class="section-title">
            BILL TO
        </div>

        <div class="customer-box">

            <div class="customer-columns">

                <div class="customer-column">

                    <div class="label">
                        Customer Name
                    </div>

                    <div class="value">
                        ${escapeHtml(
                            getCustomerName()
                        )}
                    </div>

                    <div class="label">
                        Phone
                    </div>

                    <div class="value">
                        ${escapeHtml(
                            getCustomerPhone()
                        )}
                    </div>

                    <div class="label">
                        Email
                    </div>

                    <div class="value">
                        ${escapeHtml(
                            customer?.email ||
                                "Not available"
                        )}
                    </div>

                </div>

                <div class="customer-column">

                    <div class="label">
                        Customer Address
                    </div>

                    <div class="value">
                        ${escapeHtml(
                            getCustomerAddress()
                        )}
                    </div>

                    <div class="label">
                        Service Address
                    </div>

                    <div class="value">
                        ${escapeHtml(
                            getServiceAddress()
                        )}
                    </div>

                    <div class="label">
                        Pincode
                    </div>

                    <div class="value">
                        ${escapeHtml(
                            customer?.pincode ||
                                "Not available"
                        )}
                    </div>

                </div>

            </div>

        </div>

    </div>

    <!-- INVOICE DETAILS -->

    <div class="section">

        <div class="section-title">
            INVOICE DETAILS
        </div>

        <div class="info-grid">

            <div class="info-box">

                <div class="label">
                    Invoice Number
                </div>

                <div class="value">
                    ${escapeHtml(
                        getInvoiceNumber()
                    )}
                </div>

                <div class="label">
                    Ticket ID
                </div>

                <div class="value">
                    ${escapeHtml(
                        invoice?.ticketId ??
                            "-"
                    )}
                </div>

                <div class="label">
                    Technician
                </div>

                <div class="value">
                    ${escapeHtml(
                        getTechnicianName()
                    )}
                </div>

            </div>

            <div class="info-box">

                <div class="label">
                    Invoice ID
                </div>

                <div class="value">
                    ${escapeHtml(
                        invoice?.id ??
                            "-"
                    )}
                </div>

                <div class="label">
                    Payment Status
                </div>

                <div class="value">
                    ${escapeHtml(
                        getPaymentStatus()
                    )}
                </div>

                <div class="label">
                    Technician Phone
                </div>

                <div class="value">
                    ${escapeHtml(
                        getTechnicianPhone()
                    )}
                </div>

            </div>

        </div>

    </div>

    <!-- SERVICE JOBS -->

    <div class="section">

        <div class="section-title">
            SERVICE DETAILS
        </div>

        <table>

            <thead>

                <tr>
                    <th>#</th>
                    <th>Job</th>
                    <th>Ticket</th>
                    <th>Service</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                    <th>Hours</th>
                </tr>

            </thead>

            <tbody>

                ${jobsRows}

            </tbody>

        </table>

    </div>

    <!-- JOB DESCRIPTION -->

    <div class="section">

        <div class="section-title">
            WORK DETAILS
        </div>

        <table>

            <thead>

                <tr>
                    <th>#</th>
                    <th>Job</th>
                    <th>Service</th>
                    <th>Description</th>
                </tr>

            </thead>

            <tbody>

                ${itemRows}

            </tbody>

        </table>

    </div>

    <!-- AMOUNT -->

    <div class="section">

        <div class="section-title">
            AMOUNT SUMMARY
        </div>

        <div class="summary-wrapper">

            <div class="summary">

                <div class="summary-row">

                    <span class="summary-label">
                        Sub Total
                    </span>

                    <span class="summary-value">
                        ${escapeHtml(
                            formatCurrency(
                                servicePrice
                            )
                        )}
                    </span>

                </div>

                ${
                    cgst > 0
                        ? `
                        <div class="summary-row">

                            <span class="summary-label">
                                CGST
                            </span>

                            <span class="summary-value">
                                ${escapeHtml(
                                    formatCurrency(
                                        cgst
                                    )
                                )}
                            </span>

                        </div>
                        `
                        : ""
                }

                ${
                    sgst > 0
                        ? `
                        <div class="summary-row">

                            <span class="summary-label">
                                SGST
                            </span>

                            <span class="summary-value">
                                ${escapeHtml(
                                    formatCurrency(
                                        sgst
                                    )
                                )}
                            </span>

                        </div>
                        `
                        : ""
                }

                ${
                    taxTotal > 0
                        ? ""
                        : ""
                }

                <div class="summary-row total-row">

                    <span>
                        GRAND TOTAL
                    </span>

                    <span>
                        ${escapeHtml(
                            formatCurrency(
                                grandTotal
                            )
                        )}
                    </span>

                </div>

            </div>

        </div>

    </div>

    <!-- PAYMENT -->

    <div class="payment-box">

        <div class="label">
            PAYMENT STATUS
        </div>

        <div class="value">
            ${escapeHtml(
                getPaymentStatus()
            )}
        </div>

    </div>

    <!-- FOOTER -->

    <div class="footer">

        ${escapeHtml(
            getCompanyName()
        )}

        <br />

        Invoice:
        ${escapeHtml(
            getInvoiceNumber()
        )}

        <br />

        Thank you for choosing our service.

    </div>

</div>

</body>
</html>
`;
    };

    /* =====================================================
       PDF SHARE
    ===================================================== */

    const handlePrintPdf = async () => {
        if (!invoice) {
            return;
        }

        try {
            setCreatingPdf(true);

            const html =
                generatePdfHtml();

            const {
                uri,
            } =
                await Print.printToFileAsync(
                    {
                        html,
                        base64: false,
                    }
                );

            const sharingAvailable =
                await Sharing.isAvailableAsync();

            if (
                sharingAvailable
            ) {
                await Sharing.shareAsync(
                    uri,
                    {
                        mimeType:
                            "application/pdf",
                        dialogTitle:
                            "Share Invoice PDF",
                        UTI:
                            "com.adobe.pdf",
                    }
                );
            } else {
                Alert.alert(
                    "PDF Created",
                    "The invoice PDF was created successfully."
                );
            }
        } catch (error) {
            console.log(
                "PDF generation error:",
                error
            );

            Alert.alert(
                "PDF Error",
                "Unable to generate the invoice PDF."
            );
        } finally {
            setCreatingPdf(false);
        }
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <SafeAreaView
                style={
                    invoiceViewStyles.screen
                }
            >
                <View
                    style={
                        invoiceViewStyles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color="#421DDB"
                    />

                    <Text
                        style={
                            invoiceViewStyles.loadingText
                        }
                    >
                        Loading invoice...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!invoice) {
        return (
            <SafeAreaView
                style={
                    invoiceViewStyles.screen
                }
            >
                <View
                    style={
                        invoiceViewStyles.loadingContainer
                    }
                >
                    <Ionicons
                        name="document-text-outline"
                        size={52}
                        color="#421DDB"
                    />

                    <Text
                        style={
                            invoiceViewStyles.emptyTitle
                        }
                    >
                        Invoice not found
                    </Text>

                    <TouchableOpacity
                        style={
                            invoiceViewStyles.backAction
                        }
                        onPress={
                            goToInvoices
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.backActionText
                            }
                        >
                            Back to Invoices
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <SafeAreaView
            style={
                invoiceViewStyles.screen
            }
        >

            {/* HEADER */}

            <View
                style={
                    invoiceViewStyles.header
                }
            >

                <TouchableOpacity
                    style={
                        invoiceViewStyles.backButton
                    }
                    onPress={
                        goToInvoices
                    }
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <View
                    style={
                        invoiceViewStyles.headerTextContainer
                    }
                >

                    <Text
                        style={
                            invoiceViewStyles.headerTitle
                        }
                    >
                        Invoice Details
                    </Text>

                    <Text
                        style={
                            invoiceViewStyles.headerSubtitle
                        }
                    >
                        {getInvoiceNumber()}
                    </Text>

                </View>

                <TouchableOpacity
                    style={
                        invoiceViewStyles.pdfHeaderButton
                    }
                    onPress={
                        handlePrintPdf
                    }
                    disabled={
                        creatingPdf
                    }
                >

                    {creatingPdf ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <Ionicons
                            name="download-outline"
                            size={22}
                            color="#FFFFFF"
                        />
                    )}

                </TouchableOpacity>

            </View>

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    invoiceViewStyles.content
                }
            >

                {/* SUMMARY */}

                <View
                    style={
                        invoiceViewStyles.summaryCard
                    }
                >

                    <View
                        style={
                            invoiceViewStyles.summaryTop
                        }
                    >

                        <View
                            style={
                                invoiceViewStyles.invoiceIcon
                            }
                        >
                            <Ionicons
                                name="document-text-outline"
                                size={27}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.summaryMain
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.invoiceNumber
                                }
                            >
                                {getInvoiceNumber()}
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.createdText
                                }
                            >
                                Created{" "}
                                {formatDateTime(
                                    invoice.createdAt
                                )}
                            </Text>

                        </View>

                        <View
                            style={
                                invoiceViewStyles.statusBadge
                            }
                        >
                            <Text
                                style={
                                    invoiceViewStyles.statusText
                                }
                            >
                                {getStatus()}
                            </Text>
                        </View>

                    </View>

                    <View
                        style={
                            invoiceViewStyles.amountBox
                        }
                    >

                        <Text
                            style={
                                invoiceViewStyles.amountLabel
                            }
                        >
                            Total Amount
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.amountValue
                            }
                        >
                            {formatCurrency(
                                invoice.totalPrice
                            )}
                        </Text>

                    </View>

                </View>

                {/* PDF BUTTON */}

                <TouchableOpacity
                    style={
                        invoiceViewStyles.pdfButton
                    }
                    onPress={
                        handlePrintPdf
                    }
                    disabled={
                        creatingPdf
                    }
                >

                    {creatingPdf ? (
                        <ActivityIndicator
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <Ionicons
                                name="document-outline"
                                size={21}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    invoiceViewStyles.pdfButtonText
                                }
                            >
                                Print / Share Invoice PDF
                            </Text>
                        </>
                    )}

                </TouchableOpacity>

                {/* CUSTOMER */}

                <Text
                    style={
                        invoiceViewStyles.sectionTitle
                    }
                >
                    Customer Information
                </Text>

                <View
                    style={
                        invoiceViewStyles.card
                    }
                >

                    <View
                        style={
                            invoiceViewStyles.infoRow
                        }
                    >

                        <View
                            style={
                                invoiceViewStyles.infoIcon
                            }
                        >
                            <Ionicons
                                name="person-outline"
                                size={19}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.infoContent
                            }
                        >
                            <Text
                                style={
                                    invoiceViewStyles.infoLabel
                                }
                            >
                                Customer
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.infoValue
                                }
                            >
                                {getCustomerName()}
                            </Text>
                        </View>

                    </View>

                    <TouchableOpacity
                        style={
                            invoiceViewStyles.infoRow
                        }
                        onPress={
                            openPhone
                        }
                    >

                        <View
                            style={
                                invoiceViewStyles.infoIcon
                            }
                        >
                            <Ionicons
                                name="call-outline"
                                size={19}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.infoContent
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.infoLabel
                                }
                            >
                                Phone
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.infoValue
                                }
                            >
                                {getCustomerPhone()}
                            </Text>

                        </View>

                    </TouchableOpacity>

                    <View
                        style={
                            invoiceViewStyles.infoRow
                        }
                    >

                        <View
                            style={
                                invoiceViewStyles.infoIcon
                            }
                        >
                            <Ionicons
                                name="mail-outline"
                                size={19}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.infoContent
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.infoLabel
                                }
                            >
                                Email
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.infoValue
                                }
                            >
                                {customer?.email ||
                                    "Not available"}
                            </Text>

                        </View>

                    </View>

                    <View
                        style={[
                            invoiceViewStyles.infoRow,
                            invoiceViewStyles.lastRow,
                        ]}
                    >

                        <View
                            style={
                                invoiceViewStyles.infoIcon
                            }
                        >
                            <Ionicons
                                name="location-outline"
                                size={19}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.infoContent
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.infoLabel
                                }
                            >
                                Address
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.infoValue
                                }
                            >
                                {getCustomerAddress()}
                            </Text>

                            {customer?.pincode && (
                                <Text
                                    style={
                                        invoiceViewStyles.infoSubValue
                                    }
                                >
                                    Pincode:{" "}
                                    {
                                        customer.pincode
                                    }
                                </Text>
                            )}

                        </View>

                    </View>

                </View>

                {/* COMPANY */}

                <Text
                    style={
                        invoiceViewStyles.sectionTitle
                    }
                >
                    Company Information
                </Text>

                <View
                    style={
                        invoiceViewStyles.card
                    }
                >

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Company
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {getCompanyName()}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Phone
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {company?.phone ||
                                "Not available"}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Address
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {getCompanyAddress() ||
                                "Not available"}
                        </Text>
                    </View>

                    <View
                        style={[
                            invoiceViewStyles.detailRow,
                            invoiceViewStyles.lastDetailRow,
                        ]}
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            GSTIN
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {
                                (company as any)
                                    ?.gstNumber ||
                                (company as any)
                                    ?.gstin ||
                                "Not available"
                            }
                        </Text>
                    </View>

                </View>

                {/* INVOICE INFORMATION */}

                <Text
                    style={
                        invoiceViewStyles.sectionTitle
                    }
                >
                    Invoice Information
                </Text>

                <View
                    style={
                        invoiceViewStyles.card
                    }
                >

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Invoice Number
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {getInvoiceNumber()}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Invoice ID
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {invoice.id}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Ticket ID
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {invoice.ticketId}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Job Count
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {Array.isArray(
                                invoice.jobIds
                            )
                                ? invoice
                                      .jobIds
                                      .length
                                : 0}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Payment Status
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {getPaymentStatus()}
                        </Text>
                    </View>

                    <View
                        style={
                            invoiceViewStyles.detailRow
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Status
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {getStatus()}
                        </Text>
                    </View>

                    <View
                        style={[
                            invoiceViewStyles.detailRow,
                            invoiceViewStyles.lastDetailRow,
                        ]}
                    >
                        <Text
                            style={
                                invoiceViewStyles.detailLabel
                            }
                        >
                            Created
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.detailValue
                            }
                        >
                            {formatDateTime(
                                invoice.createdAt
                            )}
                        </Text>
                    </View>

                </View>

                {/* JOBS */}

                <Text
                    style={
                        invoiceViewStyles.sectionTitle
                    }
                >
                    Jobs Included
                </Text>

                {jobs.length === 0 ? (
                    <View
                        style={
                            invoiceViewStyles.card
                        }
                    >
                        <Text
                            style={
                                invoiceViewStyles.description
                            }
                        >
                            No job details available.
                        </Text>
                    </View>
                ) : (
                    jobs.map(
                        (job) => (
                            <View
                                key={
                                    job.id
                                }
                                style={
                                    invoiceViewStyles.jobCard
                                }
                            >

                                <View
                                    style={
                                        invoiceViewStyles.jobCardHeader
                                    }
                                >

                                    <View
                                        style={{
                                            flex: 1,
                                        }}
                                    >

                                        <Text
                                            style={
                                                invoiceViewStyles.jobNumber
                                            }
                                        >
                                            {getJobNumber(
                                                job
                                            )}
                                        </Text>

                                        <Text
                                            style={
                                                invoiceViewStyles.jobTitle
                                            }
                                        >
                                            {job.title ||
                                                "Service Job"}
                                        </Text>

                                    </View>

                                    <Text
                                        style={
                                            invoiceViewStyles.jobStatus
                                        }
                                    >
                                        {job.status ||
                                            "Completed"}
                                    </Text>

                                </View>

                                <View
                                    style={
                                        invoiceViewStyles.jobDetailRow
                                    }
                                >

                                    <Text
                                        style={
                                            invoiceViewStyles.jobLabel
                                        }
                                    >
                                        Ticket
                                    </Text>

                                    <Text
                                        style={
                                            invoiceViewStyles.jobValue
                                        }
                                    >
                                        {job.ticketId ??
                                            "-"}
                                    </Text>

                                </View>

                                <View
                                    style={
                                        invoiceViewStyles.jobDetailRow
                                    }
                                >

                                    <Text
                                        style={
                                            invoiceViewStyles.jobLabel
                                        }
                                    >
                                        Scheduled
                                    </Text>

                                    <Text
                                        style={
                                            invoiceViewStyles.jobValue
                                        }
                                    >
                                        {formatDate(
                                            job.scheduledDate ||
                                                job.expectedDate
                                        )}
                                    </Text>

                                </View>

                                <View
                                    style={
                                        invoiceViewStyles.jobDetailRow
                                    }
                                >

                                    <Text
                                        style={
                                            invoiceViewStyles.jobLabel
                                        }
                                    >
                                        Working Hours
                                    </Text>

                                    <Text
                                        style={
                                            invoiceViewStyles.jobValue
                                        }
                                    >
                                        {toNumber(
                                            job.workingHours
                                        ).toFixed(
                                            2
                                        )}{" "}
                                        hrs
                                    </Text>

                                </View>

                                {job.description && (
                                    <View
                                        style={
                                            invoiceViewStyles.jobDescriptionBox
                                        }
                                    >
                                        <Text
                                            style={
                                                invoiceViewStyles.jobDescription
                                            }
                                        >
                                            {
                                                job.description
                                            }
                                        </Text>
                                    </View>
                                )}

                            </View>
                        )
                    )
                )}

                {/* TICKETS */}

                {tickets.length > 0 && (
                    <>
                        <Text
                            style={
                                invoiceViewStyles.sectionTitle
                            }
                        >
                            Ticket Information
                        </Text>

                        {tickets.map(
                            (
                                ticket,
                                index
                            ) => (
                                <View
                                    key={
                                        ticket.id ||
                                        index
                                    }
                                    style={
                                        invoiceViewStyles.card
                                    }
                                >

                                    <View
                                        style={
                                            invoiceViewStyles.detailRow
                                        }
                                    >
                                        <Text
                                            style={
                                                invoiceViewStyles.detailLabel
                                            }
                                        >
                                            Ticket ID
                                        </Text>

                                        <Text
                                            style={
                                                invoiceViewStyles.detailValue
                                            }
                                        >
                                            {
                                                ticket.ticketId ||
                                                ticket.id ||
                                                "-"
                                            }
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            invoiceViewStyles.detailRow,
                                            invoiceViewStyles.lastDetailRow,
                                        ]}
                                    >
                                        <Text
                                            style={
                                                invoiceViewStyles.detailLabel
                                            }
                                        >
                                            Description
                                        </Text>

                                        <Text
                                            style={
                                                invoiceViewStyles.detailValue
                                            }
                                        >
                                            {
                                                ticket.description ||
                                                ticket.title ||
                                                "Not available"
                                            }
                                        </Text>
                                    </View>

                                </View>
                            )
                        )}
                    </>
                )}

                {/* WORK SUMMARY */}

                <Text
                    style={
                        invoiceViewStyles.sectionTitle
                    }
                >
                    Work Summary
                </Text>

                <View
                    style={
                        invoiceViewStyles.card
                    }
                >

                    <View
                        style={
                            invoiceViewStyles.workSummaryRow
                        }
                    >

                        <View
                            style={
                                invoiceViewStyles.workSummaryIcon
                            }
                        >
                            <Ionicons
                                name="briefcase-outline"
                                size={20}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.workSummaryContent
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.infoLabel
                                }
                            >
                                Jobs
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.workHoursValue
                                }
                            >
                                {jobs.length}
                            </Text>

                        </View>

                    </View>

                    <View
                        style={
                            invoiceViewStyles.workSummaryRow
                        }
                    >

                        <View
                            style={
                                invoiceViewStyles.workSummaryIcon
                            }
                        >
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color="#421DDB"
                            />
                        </View>

                        <View
                            style={
                                invoiceViewStyles.workSummaryContent
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.infoLabel
                                }
                            >
                                Service Address
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.infoValue
                                }
                            >
                                {getServiceAddress()}
                            </Text>

                        </View>

                    </View>

                </View>

                {/* AMOUNT */}

                <Text
                    style={
                        invoiceViewStyles.sectionTitle
                    }
                >
                    Amount Summary
                </Text>

                <View
                    style={
                        invoiceViewStyles.card
                    }
                >

                    <View
                        style={
                            invoiceViewStyles.amountRow
                        }
                    >

                        <Text
                            style={
                                invoiceViewStyles.amountRowLabel
                            }
                        >
                            Total Price
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.amountRowValue
                            }
                        >
                            {formatCurrency(
                                invoice.totalPrice
                            )}
                        </Text>

                    </View>

                    {getCgst() > 0 && (
                        <View
                            style={
                                invoiceViewStyles.amountRow
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.amountRowLabel
                                }
                            >
                                CGST
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.amountRowValue
                                }
                            >
                                {formatCurrency(
                                    getCgst()
                                )}
                            </Text>

                        </View>
                    )}

                    {getSgst() > 0 && (
                        <View
                            style={
                                invoiceViewStyles.amountRow
                            }
                        >

                            <Text
                                style={
                                    invoiceViewStyles.amountRowLabel
                                }
                            >
                                SGST
                            </Text>

                            <Text
                                style={
                                    invoiceViewStyles.amountRowValue
                                }
                            >
                                {formatCurrency(
                                    getSgst()
                                )}
                            </Text>

                        </View>
                    )}

                    <View
                        style={
                            invoiceViewStyles.amountRow
                        }
                    >

                        <Text
                            style={
                                invoiceViewStyles.amountRowLabel
                            }
                        >
                            Payment Status
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.amountRowValue
                            }
                        >
                            {getPaymentStatus()}
                        </Text>

                    </View>

                    <View
                        style={
                            invoiceViewStyles.totalRow
                        }
                    >

                        <Text
                            style={
                                invoiceViewStyles.totalLabel
                            }
                        >
                            Grand Total
                        </Text>

                        <Text
                            style={
                                invoiceViewStyles.totalValue
                            }
                        >
                            {formatCurrency(
                                invoice.totalPrice
                            )}
                        </Text>

                    </View>

                </View>

                {/* PDF */}

                <TouchableOpacity
                    style={
                        invoiceViewStyles.bottomPdfButton
                    }
                    onPress={
                        handlePrintPdf
                    }
                    disabled={
                        creatingPdf
                    }
                >

                    {creatingPdf ? (
                        <ActivityIndicator
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <Ionicons
                                name="print-outline"
                                size={21}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    invoiceViewStyles.bottomPdfButtonText
                                }
                            >
                                Print / Share PDF
                            </Text>
                        </>
                    )}

                </TouchableOpacity>

                {/* BACK */}

                <TouchableOpacity
                    style={
                        invoiceViewStyles.backAction
                    }
                    onPress={
                        goToInvoices
                    }
                >

                    <Ionicons
                        name="arrow-back"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text
                        style={
                            invoiceViewStyles.backActionText
                        }
                    >
                        Back to Invoices
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>
    );
}

export default InvoiceView;
