
import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { invoicesStyles } from "./invoices.styles";

import {
    Invoice,
    getAllInvoices,
} from "@/lib/invoiceservice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCompanyById } from "@/lib/companyservice";

type InvoicesProps = {
    goToHome: () => void;

    goToInvoiceView: (
        invoiceId: string | number
    ) => void;
};

function Invoices({
    goToHome,
    goToInvoiceView,
}: InvoicesProps) {

    // =========================================================
    // STATE
    // =========================================================

    const [invoices, setInvoices] =
        useState<Invoice[]>([]);

    const [filteredInvoices, setFilteredInvoices] =
        useState<Invoice[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [
        downloadingInvoiceId,
        setDownloadingInvoiceId,
    ] = useState<string | number | null>(null);

    // =========================================================
    // LOAD INVOICES
    // =========================================================

    useEffect(() => {
        loadInvoices();
    }, []);

    // =========================================================
    // FILTER
    // =========================================================

    useEffect(() => {
        filterInvoices();
    }, [invoices, search]);

    // =========================================================
    // LOAD
    // =========================================================

    const loadInvoices = async () => {
        try {
            setLoading(true);

            console.log(
                "Loading invoices..."
            );

            const data =
                await getAllInvoices();

            console.log(
                "Invoices:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            setInvoices(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(
                "Invoices loading error:",
                error
            );

            setInvoices([]);

            Alert.alert(
                "Unable to Load Invoices",
                "Unable to load invoices. Please try again."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // FILTER INVOICES
    // =========================================================

    const filterInvoices = () => {

        let result =
            [...invoices];

        const query =
            search
                .trim()
                .toLowerCase();

        if (query) {

            result =
                result.filter(
                    (invoice) => {

                        const invoiceNumber =
                            getInvoiceNumber(
                                invoice
                            ).toLowerCase();

                        const ticket =
                            String(
                                invoice.ticketId ?? ""
                            ).toLowerCase();

                        const jobs =
                            invoice.jobIds
                                ?.join(", ")
                                .toLowerCase() ||
                            "";

                        const status =
                            formatStatus(
                                invoice.status
                            ).toLowerCase();

                        const paymentStatus =
                            formatPaymentStatus(
                                invoice.paymentStatus
                            ).toLowerCase();

                        return (
                            invoiceNumber.includes(
                                query
                            ) ||
                            ticket.includes(
                                query
                            ) ||
                            jobs.includes(
                                query
                            ) ||
                            status.includes(
                                query
                            ) ||
                            paymentStatus.includes(
                                query
                            )
                        );
                    }
                );
        }

        setFilteredInvoices(
            result
        );
    };

    // =========================================================
    // INVOICE NUMBER
    // =========================================================

    const getInvoiceNumber = (
        invoice: Invoice
    ): string => {

        return String(
            invoice.invoiceId ||
            `INV-${invoice.id}`
        );
    };

    // =========================================================
    // AMOUNT
    // =========================================================

    const getAmountNumber = (
        invoice: Invoice
    ): number => {

        const amount =
            Number(
                invoice.totalPrice ?? 0
            );

        return Number.isFinite(amount)
            ? amount
            : 0;
    };

    const getAmount = (
        invoice: Invoice
    ): string => {

        return getAmountNumber(
            invoice
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    // =========================================================
    // DATE
    // =========================================================

    const getDate = (
        invoice: Invoice
    ): string => {

        const date =
            invoice.createdAt;

        if (!date) {
            return "Date not available";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return String(date);
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =========================================================
    // STATUS FORMAT
    // =========================================================

    const formatStatus = (
        status?: string | null
    ): string => {

        if (!status) {
            return "Draft";
        }

        return String(status)
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    // =========================================================
    // PAYMENT STATUS FORMAT
    // =========================================================

    const formatPaymentStatus = (
        status?: string | null
    ): string => {

        if (!status) {
            return "Pending";
        }

        return String(status)
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    // =========================================================
    // STATUS COLOR
    // =========================================================

    const getStatusColor = (
        status?: string | null
    ): string => {

        const value =
            formatStatus(status);

        switch (value) {

            case "Issued":
                return "#2E8B57";

            case "Draft":
                return "#E28B00";

            case "Cancelled":
                return "#D32F2F";

            default:
                return "#777777";
        }
    };

    // =========================================================
    // PAYMENT COLOR
    // =========================================================

    const getPaymentStatusColor = (
        status?: string | null
    ): string => {

        const value =
            formatPaymentStatus(status);

        switch (value) {

            case "Paid":
                return "#2E8B57";

            case "Partially Paid":
                return "#E28B00";

            case "Pending":
                return "#E28B00";

            case "Cancelled":
                return "#D32F2F";

            default:
                return "#777777";
        }
    };

    // =========================================================
    // STATUS ICON
    // =========================================================

    const getStatusIcon = (
        status?: string | null
    ): any => {

        const value =
            formatStatus(status);

        switch (value) {

            case "Issued":
                return "checkmark-circle-outline";

            case "Cancelled":
                return "close-circle-outline";

            case "Draft":
                return "document-outline";

            default:
                return "ellipse-outline";
        }
    };

    // =========================================================
    // HTML ESCAPE
    // =========================================================

    const escapeHtml = (
        value: unknown
    ): string => {

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
const downloadInvoicePdf = async (
    invoice: Invoice
) => {
    try {
        setDownloadingInvoiceId(invoice.id);

        // =====================================================
        // GET LOGGED-IN USER / COMPANY
        // =====================================================

        const storedUser =
            await AsyncStorage.getItem("user");

        let user: any = null;

        try {
            user = storedUser
                ? JSON.parse(storedUser)
                : null;
        } catch {
            user = null;
        }

        const companyId =
            user?.companyId ??
            user?.company?.id ??
            null;

        console.log(
            "Invoice PDF companyId:",
            companyId
        );

        if (!companyId) {
            Alert.alert(
                "Company Not Found",
                "Company information is not available for this user."
            );

            return;
        }


        const company =
            await getCompanyById(
                Number(companyId)
            );

        console.log(
            "Invoice PDF company:",
            JSON.stringify(
                company,
                null,
                2
            )
        );

        // =====================================================
        // COMPANY DATA
        // =====================================================

        const companyData: any =
            company || {};

        const companyName =
            companyData.legalName ||
            companyData.brandName ||
            companyData.name ||
            "Company Name";

        const companyBrand =
            companyData.brandName ||
            companyData.legalName ||
            companyName;

        const companyAddress =
            companyData.address ||
            companyData.companyAddress ||
            companyData.location ||
            "";

        const companyCity =
            companyData.city ||
            "";

        const companyState =
            companyData.state ||
            companyData.companyState ||
            "Kerala";

        const companyPincode =
            companyData.pincode ||
            companyData.pinCode ||
            "";

        const companyPhone =
            companyData.phone ||
            companyData.mobile ||
            companyData.phoneNumber ||
            "";

        const companyEmail =
            companyData.email ||
            "";

        const companyGst =
            companyData.gst ||
            companyData.gstNumber ||
            companyData.gstin ||
            companyData.GSTIN ||
            "";

        // =====================================================
        // LOGO
        // =====================================================

        const API_BASE_URL =
            process.env.EXPO_PUBLIC_API_BASE_URL ||
            process.env.EXPO_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "http://192.168.1.3:8080";

        let logoUrl = "";

        const rawLogo =
            companyData.logo ||
            companyData.logoPath ||
            companyData.logoUrl ||
            companyData.logo_url ||
            "";

        if (rawLogo) {
            if (
                String(rawLogo).startsWith(
                    "http://"
                ) ||
                String(rawLogo).startsWith(
                    "https://"
                )
            ) {
                logoUrl =
                    String(rawLogo);
            } else {
                logoUrl =
                    `${API_BASE_URL}${String(
                        rawLogo
                    ).startsWith("/")
                        ? ""
                        : "/"}${rawLogo}`;
            }
        } else if (
            companyData.id
        ) {
            /*
             * Your existing backend logo structure:
             *
             * upload/logo/{brand}/{id}.jpg
             *
             * If your backend exposes /uploads or another
             * endpoint, change this URL accordingly.
             */
            const brand =
                String(
                    companyBrand
                )
                    .trim()
                    .replace(
                        /\s+/g,
                        "_"
                    );

            logoUrl =
                `${API_BASE_URL}/upload/logo/${encodeURIComponent(
                    brand
                )}/${companyData.id}.jpg`;
        }

        // =====================================================
        // INVOICE DATA
        // =====================================================

        const invoiceNumber =
            getInvoiceNumber(
                invoice
            );

        const invoiceDate =
            getDate(
                invoice
            );

        const totalAmount =
            getAmountNumber(
                invoice
            );

        // =====================================================
        // TAX
        //
        // Example:
        // Taxable amount = ₹52,000
        // CGST 9% = ₹4,680
        // SGST 9% = ₹4,680
        // Total = ₹61,360
        // =====================================================

        const taxableAmount =
            totalAmount;

        const cgstRate =
            Number(
                (invoice as any).cgstRate ??
                (invoice as any).cgstPercentage ??
                9
            );

        const sgstRate =
            Number(
                (invoice as any).sgstRate ??
                (invoice as any).sgstPercentage ??
                9
            );

        const cgstAmount =
            Number(
                (
                    taxableAmount *
                    cgstRate /
                    100
                ).toFixed(2)
            );

        const sgstAmount =
            Number(
                (
                    taxableAmount *
                    sgstRate /
                    100
                ).toFixed(2)
            );

        const calculatedTotal =
            Number(
                (
                    taxableAmount +
                    cgstAmount +
                    sgstAmount
                ).toFixed(2)
            );

        /*
         * If your backend already returns the final invoice
         * total including tax, use that instead.
         */
        const grandTotal =
            Number(
                (invoice as any).grandTotal ??
                (invoice as any).totalAmount ??
                calculatedTotal
            );

        const amountPayable =
            Number(
                (invoice as any).amountPayable ??
                grandTotal
            );

        // =====================================================
        // DUE DATE
        // =====================================================

        const dueDateRaw =
            (invoice as any).dueDate ||
            (invoice as any).due_date ||
            null;

        const dueDate =
            dueDateRaw
                ? new Date(
                      dueDateRaw
                  ).toLocaleDateString(
                      "en-IN",
                      {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      }
                  )
                : invoiceDate;

        // =====================================================
        // CUSTOMER
        // =====================================================

        const customerName =
            (invoice as any).customerName ||
            (invoice as any).customer?.name ||
            "Customer";

        const customerPhone =
            (invoice as any).customerPhone ||
            (invoice as any).customer?.phone ||
            "";

        const customerEmail =
            (invoice as any).customerEmail ||
            (invoice as any).customer?.email ||
            "";

        const customerAddress =
            (invoice as any).customerAddress ||
            (invoice as any).customer?.address ||
            "";

        const customerCity =
            (invoice as any).customer?.city ||
            (invoice as any).city ||
            "";

        const customerState =
            (invoice as any).customer?.state ||
            (invoice as any).state ||
            "";

        const customerPincode =
            (invoice as any).customer?.pincode ||
            (invoice as any).customer?.pinCode ||
            "";

        const placeOfSupply =
            (invoice as any).placeOfSupply ||
            (invoice as any).customer?.state ||
            companyState ||
            "Kerala";

        // =====================================================
        // ITEM
        // =====================================================

        const jobIds =
            invoice.jobIds &&
            invoice.jobIds.length > 0
                ? invoice.jobIds
                : [];

        const itemDescription =
            (invoice as any).description ||
            (invoice as any).jobTitle ||
            "Field Service / Technician Service";

        const sac =
            (invoice as any).sac ||
            (invoice as any).sacCode ||
            "998313";

        const quantity =
            Number(
                (invoice as any).quantity ??
                1
            );

        // =====================================================
        // BANK DETAILS
        // =====================================================

        const bankName =
            companyData.bankName ||
            companyData.bank?.name ||
            "";

        const accountNumber =
            companyData.accountNumber ||
            companyData.bankAccountNumber ||
            companyData.bank?.accountNumber ||
            "";

        const ifscCode =
            companyData.ifscCode ||
            companyData.bank?.ifsc ||
            "";

        const branch =
            companyData.branch ||
            companyData.bankBranch ||
            companyData.bank?.branch ||
            "";

        // =====================================================
        // HELPERS
        // =====================================================

        const escapeHtml = (
            value: unknown
        ): string => {
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

        const money = (
            value: number
        ) => {
            return Number(
                value || 0
            ).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            );
        };

        const companyAddressLine =
            [
                companyAddress,
                companyCity,
                companyState,
                companyPincode,
            ]
                .filter(Boolean)
                .join(", ");

        const billingAddressLine =
            [
                customerAddress,
                customerCity,
                customerState,
                customerPincode,
            ]
                .filter(Boolean)
                .join(", ");

        // =====================================================
        // TOTAL IN WORDS
        // =====================================================

        const numberToWords = (
            amount: number
        ): string => {

            const ones = [
                "",
                "One",
                "Two",
                "Three",
                "Four",
                "Five",
                "Six",
                "Seven",
                "Eight",
                "Nine",
                "Ten",
                "Eleven",
                "Twelve",
                "Thirteen",
                "Fourteen",
                "Fifteen",
                "Sixteen",
                "Seventeen",
                "Eighteen",
                "Nineteen",
            ];

            const tens = [
                "",
                "",
                "Twenty",
                "Thirty",
                "Forty",
                "Fifty",
                "Sixty",
                "Seventy",
                "Eighty",
                "Ninety",
            ];

            const convert = (
                num: number
            ): string => {

                if (num < 20) {
                    return ones[num];
                }

                if (num < 100) {
                    return (
                        tens[
                            Math.floor(
                                num / 10
                            )
                        ] +
                        (
                            num % 10
                                ? " " +
                                  ones[
                                      num % 10
                                  ]
                                : ""
                        )
                    );
                }

                if (num < 1000) {
                    return (
                        ones[
                            Math.floor(
                                num / 100
                            )
                        ] +
                        " Hundred" +
                        (
                            num % 100
                                ? " " +
                                  convert(
                                      num % 100
                                  )
                                : ""
                        )
                    );
                }

                if (num < 100000) {
                    return (
                        convert(
                            Math.floor(
                                num / 1000
                            )
                        ) +
                        " Thousand" +
                        (
                            num % 1000
                                ? " " +
                                  convert(
                                      num % 1000
                                  )
                                : ""
                        )
                    );
                }

                if (num < 10000000) {
                    return (
                        convert(
                            Math.floor(
                                num / 100000
                            )
                        ) +
                        " Lakh" +
                        (
                            num % 100000
                                ? " " +
                                  convert(
                                      num % 100000
                                  )
                                : ""
                        )
                    );
                }

                return (
                    convert(
                        Math.floor(
                            num / 10000000
                        )
                    ) +
                    " Crore" +
                    (
                        num % 10000000
                            ? " " +
                              convert(
                                  num % 10000000
                              )
                            : ""
                    )
                );
            };

            const rounded =
                Math.round(
                    amount
                );

            return (
                convert(
                    rounded
                ) || "Zero"
            );
        };

        const totalInWords =
            numberToWords(
                grandTotal
            );

        // =====================================================
        // HTML
        // =====================================================

        const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<title>
    ${escapeHtml(invoiceNumber)}
</title>

<style>

@page {
    size: A4;
    margin: 20px 30px 25px 30px;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #222222;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
}

.invoice {
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
}

/* =====================================================
   TOP HEADER
===================================================== */

.header {
    display: table;
    width: 100%;
    padding-bottom: 10px;
}

.header-left {
    display: table-cell;
    width: 63%;
    vertical-align: top;
}

.header-right {
    display: table-cell;
    width: 37%;
    vertical-align: top;
    text-align: right;
}

.tax-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #555555;
    margin-bottom: 12px;
}

.company-name {
    font-size: 22px;
    font-weight: 700;
    color: #111111;
    margin-bottom: 6px;
}

.company-details {
    font-size: 11px;
    line-height: 1.55;
    color: #333333;
}

.original {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #333333;
    margin-bottom: 18px;
}

.logo {
    max-width: 180px;
    max-height: 65px;
    object-fit: contain;
}

/* =====================================================
   INVOICE META
===================================================== */

.meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
}

.meta-table td {
    border: none;
    padding: 3px 0;
    vertical-align: top;
}

.meta-label {
    font-weight: 700;
    color: #222222;
}

.meta-value {
    color: #333333;
}

/* =====================================================
   CUSTOMER
===================================================== */

.customer-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 5px;
}

.customer-table td {
    width: 33.33%;
    vertical-align: top;
    padding: 4px 8px 4px 0;
    border: none;
}

.customer-title {
    font-weight: 700;
    font-size: 12px;
    margin-bottom: 7px;
}

.customer-text {
    font-size: 10.5px;
    line-height: 1.5;
    color: #333333;
}

/* =====================================================
   PLACE OF SUPPLY
===================================================== */

.place {
    margin-top: 7px;
    margin-bottom: 15px;
}

.place-title {
    font-weight: 700;
    font-size: 11px;
}

.place-value {
    font-size: 11px;
    margin-top: 4px;
}

/* =====================================================
   ITEMS
===================================================== */

.items {
    width: 100%;
    border-collapse: collapse;
    margin-top: 5px;
}

.items th {
    border-top: 2px solid #777777;
    border-bottom: 2px solid #777777;
    padding: 7px 6px;
    font-size: 10px;
    font-weight: 700;
    text-align: left;
    color: #222222;
}

.items td {
    border-bottom: 1px solid #BBBBBB;
    padding: 9px 6px;
    font-size: 10.5px;
    vertical-align: top;
}

.items .center {
    text-align: center;
}

.items .right {
    text-align: right;
}

.item-description {
    font-weight: 600;
}

.sac {
    margin-top: 5px;
    font-size: 9.5px;
}

/* =====================================================
   TOTAL
===================================================== */

.total-section {
    width: 100%;
    margin-top: 2px;
}

.total-table {
    width: 100%;
    border-collapse: collapse;
}

.total-table td {
    padding: 3px 6px;
    border: none;
}

.total-label {
    text-align: right;
    font-weight: 700;
    font-size: 11px;
}

.total-value {
    width: 150px;
    text-align: right;
    font-weight: 700;
    font-size: 11px;
}

.grand-total td {
    border-top: 2px solid #777777;
    font-size: 17px;
    font-weight: 700;
    padding-top: 7px;
}

.amount-payable td {
    border-top: 1px solid #777777;
    font-size: 12px;
    font-weight: 700;
    padding-top: 6px;
}

/* =====================================================
   WORDS
===================================================== */

.words-row {
    display: table;
    width: 100%;
    border-bottom: 1px solid #777777;
    padding: 5px 0;
}

.words-left {
    display: table-cell;
    width: 36%;
    font-size: 9.5px;
    vertical-align: middle;
}

.words-right {
    display: table-cell;
    width: 64%;
    text-align: right;
    font-size: 10px;
    vertical-align: middle;
}

/* =====================================================
   BANK
===================================================== */

.bank-signature {
    display: table;
    width: 100%;
    margin-top: 20px;
}

.bank-details {
    display: table-cell;
    width: 55%;
    vertical-align: top;
}

.signature {
    display: table-cell;
    width: 45%;
    vertical-align: top;
    text-align: right;
}

.bank-title {
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 7px;
}

.bank-row {
    font-size: 10.5px;
    margin-bottom: 5px;
}

.bank-label {
    display: inline-block;
    width: 100px;
}

.bank-value {
    font-weight: 600;
}

.for-company {
    font-size: 11px;
    font-weight: 700;
    margin-top: 15px;
}

.authorized {
    margin-top: 70px;
    font-size: 10.5px;
}

/* =====================================================
   FOOTER
===================================================== */

.footer {
    margin-top: 35px;
    border-top: 1px solid #CCCCCC;
    padding-top: 5px;
    font-size: 8.5px;
    color: #333333;
    line-height: 1.45;
}

.footer-left {
    float: left;
}

.footer-right {
    float: right;
    text-align: right;
    font-weight: 700;
    font-size: 15px;
}

.clear {
    clear: both;
}

</style>

</head>

<body>

<div class="invoice">

    <!-- =================================================
         HEADER
    ================================================== -->

    <div class="header">

        <div class="header-left">

            <div class="tax-title">
                TAX INVOICE
            </div>

            <div class="company-name">
                ${escapeHtml(companyName)}
            </div>

            <div class="company-details">

                ${escapeHtml(companyAddressLine)}

                ${
                    companyPhone
                        ? `<br />
                           Mobile ${escapeHtml(
                               companyPhone
                           )}`
                        : ""
                }

                ${
                    companyEmail
                        ? `&nbsp;&nbsp;
                           Email ${escapeHtml(
                               companyEmail
                           )}`
                        : ""
                }

                ${
                    companyGst
                        ? `<br />
                           GSTIN: ${escapeHtml(
                               companyGst
                           )}`
                        : ""
                }

            </div>

        </div>

        <div class="header-right">

            <div class="original">
                ORIGINAL FOR RECIPIENT
            </div>

            ${
                logoUrl
                    ? `
                    <img
                        class="logo"
                        src="${escapeHtml(
                            logoUrl
                        )}"
                    />
                    `
                    : `
                    <div
                        style="
                            font-size:28px;
                            font-weight:700;
                            color:#555;
                        "
                    >
                        ${escapeHtml(
                            companyBrand
                        )}
                    </div>
                    `
            }

        </div>

    </div>

    <!-- =================================================
         INVOICE DETAILS
    ================================================== -->

    <table class="meta-table">

        <tr>

            <td style="width:33.33%;">

                <span class="meta-label">
                    Invoice #:
                </span>

                <span class="meta-value">
                    ${escapeHtml(
                        invoiceNumber
                    )}
                </span>

            </td>

            <td style="width:33.33%;">

                <span class="meta-label">
                    Invoice Date:
                </span>

                <span class="meta-value">
                    ${escapeHtml(
                        invoiceDate
                    )}
                </span>

            </td>

            <td style="width:33.33%;">

                <span class="meta-label">
                    Due Date:
                </span>

                <span class="meta-value">
                    ${escapeHtml(
                        dueDate
                    )}
                </span>

            </td>

        </tr>

    </table>

    <!-- =================================================
         CUSTOMER
    ================================================== -->

    <table class="customer-table">

        <tr>

            <td>

                <div class="customer-title">
                    Customer Details:
                </div>

                <div class="customer-text">

                    <strong>
                        ${escapeHtml(
                            customerName
                        )}
                    </strong>

                    ${
                        customerPhone
                            ? `<br />
                               ${escapeHtml(
                                   customerPhone
                               )}`
                            : ""
                    }

                    ${
                        customerEmail
                            ? `<br />
                               ${escapeHtml(
                                   customerEmail
                               )}`
                            : ""
                    }

                </div>

            </td>

            <td>

                <div class="customer-title">
                    Billing Address:
                </div>

                <div class="customer-text">

                    ${
                        billingAddressLine
                            ? escapeHtml(
                                  billingAddressLine
                              )
                            : "Address not available"
                    }

                </div>

            </td>

            <td></td>

        </tr>

    </table>

    <!-- =================================================
         PLACE OF SUPPLY
    ================================================== -->

    <div class="place">

        <div class="place-title">
            Place of Supply:
        </div>

        <div class="place-value">
            ${escapeHtml(
                placeOfSupply
            )}
        </div>

    </div>

    <!-- =================================================
         ITEMS
    ================================================== -->

    <table class="items">

        <thead>

            <tr>

                <th style="width:5%;">
                    #
                </th>

                <th style="width:36%;">
                    Item
                </th>

                <th
                    class="right"
                    style="width:16%;"
                >
                    Rate / Item
                </th>

                <th
                    class="center"
                    style="width:8%;"
                >
                    Qty
                </th>

                <th
                    class="right"
                    style="width:14%;"
                >
                    Taxable Value
                </th>

                <th
                    class="right"
                    style="width:11%;"
                >
                    Tax Amount
                </th>

                <th
                    class="right"
                    style="width:14%;"
                >
                    Amount
                </th>

            </tr>

        </thead>

        <tbody>

            <tr>

                <td>
                    1
                </td>

                <td>

                    <div class="item-description">
                        ${escapeHtml(
                            itemDescription
                        )}
                    </div>

                    <div class="sac">
                        SAC: ${escapeHtml(
                            sac
                        )}
                    </div>

                </td>

                <td class="right">
                    ${money(
                        taxableAmount
                    )}
                </td>

                <td class="center">
                    ${quantity}
                </td>

                <td class="right">
                    ${money(
                        taxableAmount
                    )}
                </td>

                <td class="right">
                    ${money(
                        cgstAmount +
                        sgstAmount
                    )}
                    (${cgstRate +
                        sgstRate}%)
                </td>

                <td class="right">
                    ${money(
                        grandTotal
                    )}
                </td>

            </tr>

        </tbody>

    </table>

    <!-- =================================================
         TOTAL
    ================================================== -->

    <div class="total-section">

        <table class="total-table">

            <tr>

                <td></td>

                <td class="total-label">
                    Taxable Amount
                </td>

                <td class="total-value">
                    ₹${money(
                        taxableAmount
                    )}
                </td>

            </tr>

            <tr>

                <td></td>

                <td class="total-label">
                    CGST ${cgstRate}%
                </td>

                <td class="total-value">
                    ₹${money(
                        cgstAmount
                    )}
                </td>

            </tr>

            <tr>

                <td></td>

                <td class="total-label">
                    SGST ${sgstRate}%
                </td>

                <td class="total-value">
                    ₹${money(
                        sgstAmount
                    )}
                </td>

            </tr>

            <tr class="grand-total">

                <td></td>

                <td class="total-label">
                    Total
                </td>

                <td class="total-value">
                    ₹${money(
                        grandTotal
                    )}
                </td>

            </tr>

        </table>

    </div>

    <!-- =================================================
         WORDS
    ================================================== -->

    <div class="words-row">

        <div class="words-left">

            Total Items / Qty :
            1 / ${quantity}

        </div>

        <div class="words-right">

            Total amount (in words):
            INR ${escapeHtml(
                totalInWords
            )} Only.

        </div>

    </div>

    <!-- =================================================
         AMOUNT PAYABLE
    ================================================== -->

    <table class="total-table">

        <tr class="amount-payable">

            <td></td>

            <td class="total-label">
                Amount Payable:
            </td>

            <td class="total-value">
                ₹${money(
                    amountPayable
                )}
            </td>

        </tr>

    </table>

    <!-- =================================================
         BANK DETAILS + SIGNATURE
    ================================================== -->

    <div class="bank-signature">

        <div class="bank-details">

            <div class="bank-title">
                Bank Details:
            </div>

            ${
                bankName
                    ? `
                    <div class="bank-row">
                        <span class="bank-label">
                            Bank:
                        </span>
                        <span class="bank-value">
                            ${escapeHtml(
                                bankName
                            )}
                        </span>
                    </div>
                    `
                    : ""
            }

            ${
                accountNumber
                    ? `
                    <div class="bank-row">
                        <span class="bank-label">
                            Account #:
                        </span>
                        <span class="bank-value">
                            ${escapeHtml(
                                accountNumber
                            )}
                        </span>
                    </div>
                    `
                    : ""
            }

            ${
                ifscCode
                    ? `
                    <div class="bank-row">
                        <span class="bank-label">
                            IFSC Code:
                        </span>
                        <span class="bank-value">
                            ${escapeHtml(
                                ifscCode
                            )}
                        </span>
                    </div>
                    `
                    : ""
            }

            ${
                branch
                    ? `
                    <div class="bank-row">
                        <span class="bank-label">
                            Branch:
                        </span>
                        <span class="bank-value">
                            ${escapeHtml(
                                branch
                            )}
                        </span>
                    </div>
                    `
                    : ""
            }

        </div>

        <div class="signature">

            <div class="for-company">
                For ${escapeHtml(
                    companyName
                )}
            </div>

            <div class="authorized">
                Authorized Signatory
            </div>

        </div>

    </div>

    <!-- =================================================
         FOOTER
    ================================================== -->

    <div class="footer">

        <div class="footer-left">

            <strong>
                Page 1 / 1
            </strong>

            &nbsp;&nbsp;•&nbsp;&nbsp;

            This is a computer generated document and requires no signature.

        </div>

        <div class="footer-right">
            ${escapeHtml(
                companyBrand
            )}
        </div>

        <div class="clear"></div>

    </div>

</div>

</body>

</html>
        `;

        // =====================================================
        // GENERATE PDF
        // =====================================================

        console.log(
            "Generating Tax Invoice PDF:",
            invoiceNumber
        );

        const result =
            await Print.printToFileAsync({
                html,
                base64: false,
            });

        console.log(
            "PDF created:",
            result.uri
        );

        // =====================================================
        // SHARE / SAVE
        // =====================================================

        const sharingAvailable =
            await Sharing.isAvailableAsync();

        if (
            sharingAvailable
        ) {
            await Sharing.shareAsync(
                result.uri,
                {
                    mimeType:
                        "application/pdf",

                    dialogTitle:
                        `Download ${invoiceNumber}`,

                    UTI:
                        "com.adobe.pdf",
                }
            );
        } else {
            Alert.alert(
                "PDF Created",
                `Invoice ${invoiceNumber} was created successfully.`
            );
        }

    } catch (error) {

        console.log(
            "Invoice PDF error:",
            error
        );

        Alert.alert(
            "Download Failed",
            "Unable to create the invoice PDF. Please try again."
        );

    } finally {

        setDownloadingInvoiceId(
            null
        );
    }
};



    const onRefresh = () => {

        setRefreshing(true);

        loadInvoices();
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <SafeAreaView
                style={
                    invoicesStyles.screen
                }
            >

                <View
                    style={
                        invoicesStyles.loadingContainer
                    }
                >

                    <ActivityIndicator
                        size="large"
                        color="#421DDB"
                    />

                    <Text
                        style={
                            invoicesStyles.loadingText
                        }
                    >
                        Loading invoices...
                    </Text>

                </View>

            </SafeAreaView>
        );
    }

    // =========================================================
    // MAIN SCREEN
    // =========================================================

    return (
        <SafeAreaView
            style={
                invoicesStyles.screen
            }
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <View
                style={
                    invoicesStyles.header
                }
            >

                <TouchableOpacity
                    onPress={
                        goToHome
                    }
                    style={
                        invoicesStyles.backButton
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
                        invoicesStyles.headerTextContainer
                    }
                >

                    <Text
                        style={
                            invoicesStyles.headerTitle
                        }
                    >
                        Invoices
                    </Text>

                    <Text
                        style={
                            invoicesStyles.headerSubtitle
                        }
                    >
                        {invoices.length} total invoices
                    </Text>

                </View>

                <View
                    style={
                        invoicesStyles.headerRight
                    }
                />

            </View>

            {/* =================================================
                CONTENT
            ================================================= */}

            <ScrollView
                contentContainerStyle={
                    invoicesStyles.content
                }
                showsVerticalScrollIndicator={
                    false
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={
                            onRefresh
                        }
                        tintColor="#421DDB"
                        colors={[
                            "#421DDB",
                        ]}
                    />
                }
            >

                {/* =================================================
                    SEARCH
                ================================================= */}

                <View
                    style={
                        invoicesStyles.searchContainer
                    }
                >

                    <Ionicons
                        name="search-outline"
                        size={21}
                        color="#421DDB"
                    />

                    <TextInput
                        value={
                            search
                        }
                        onChangeText={
                            setSearch
                        }
                        placeholder="Search invoices..."
                        placeholderTextColor="#9AA7B5"
                        style={
                            invoicesStyles.searchInput
                        }
                    />

                    {search.length > 0 && (

                        <TouchableOpacity
                            onPress={() =>
                                setSearch("")
                            }
                        >

                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="#421DDB"
                            />

                        </TouchableOpacity>
                    )}

                </View>

                {/* =================================================
                    RESULT COUNT
                ================================================= */}

                <View
                    style={
                        invoicesStyles.resultRow
                    }
                >

                    <Text
                        style={
                            invoicesStyles.resultText
                        }
                    >
                        {filteredInvoices.length} invoices found
                    </Text>

                </View>

                {/* =================================================
                    EMPTY
                ================================================= */}

                {filteredInvoices.length === 0 ? (

                    <View
                        style={
                            invoicesStyles.emptyContainer
                        }
                    >

                        <Ionicons
                            name="document-text-outline"
                            size={52}
                            color="#421DDB"
                        />

                        <Text
                            style={
                                invoicesStyles.emptyTitle
                            }
                        >
                            No invoices found
                        </Text>

                        <Text
                            style={
                                invoicesStyles.emptyText
                            }
                        >
                            {search
                                ? "Try changing your search."
                                : "No invoices are available yet."}
                        </Text>

                    </View>

                ) : (

                    filteredInvoices.map(
                        (invoice) => {

                            const statusColor =
                                getStatusColor(
                                    invoice.status
                                );

                            const paymentColor =
                                getPaymentStatusColor(
                                    invoice.paymentStatus
                                );

                            const isDownloading =
                                downloadingInvoiceId ===
                                invoice.id;

                            return (

                                <View
                                    key={
                                        String(
                                            invoice.id
                                        )
                                    }
                                    style={
                                        invoicesStyles.invoiceCard
                                    }
                                >

                                    {/* =========================================
                                        INVOICE INFORMATION
                                    ========================================== */}

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            goToInvoiceView(
                                                invoice.id
                                            )
                                        }
                                    >

                                        {/* TOP */}

                                        <View
                                            style={
                                                invoicesStyles.invoiceTop
                                            }
                                        >

                                            <View
                                                style={
                                                    invoicesStyles.invoiceIcon
                                                }
                                            >

                                                <Ionicons
                                                    name="document-text-outline"
                                                    size={23}
                                                    color="#421DDB"
                                                />

                                            </View>

                                            <View
                                                style={
                                                    invoicesStyles.invoiceMain
                                                }
                                            >

                                                <Text
                                                    style={
                                                        invoicesStyles.invoiceNumber
                                                    }
                                                >
                                                    {
                                                        getInvoiceNumber(
                                                            invoice
                                                        )
                                                    }
                                                </Text>

                                                <Text
                                                    style={
                                                        invoicesStyles.customerName
                                                    }
                                                    numberOfLines={
                                                        1
                                                    }
                                                >
                                                    Ticket #
                                                    {
                                                        invoice.ticketId ??
                                                        "N/A"
                                                    }
                                                </Text>

                                            </View>

                                            {/* STATUS */}

                                            <View
                                                style={[
                                                    invoicesStyles.statusBadge,
                                                    {
                                                        backgroundColor:
                                                            `${statusColor}18`,
                                                    },
                                                ]}
                                            >

                                                <Ionicons
                                                    name={
                                                        getStatusIcon(
                                                            invoice.status
                                                        )
                                                    }
                                                    size={13}
                                                    color={
                                                        statusColor
                                                    }
                                                />

                                                <Text
                                                    style={[
                                                        invoicesStyles.statusText,
                                                        {
                                                            color:
                                                                statusColor,
                                                        },
                                                    ]}
                                                >
                                                    {
                                                        formatStatus(
                                                            invoice.status
                                                        )
                                                    }
                                                </Text>

                                            </View>

                                        </View>

                                        {/* DIVIDER */}

                                        <View
                                            style={
                                                invoicesStyles.divider
                                            }
                                        />

                                        {/* DETAILS */}

                                        <View
                                            style={
                                                invoicesStyles.invoiceDetails
                                            }
                                        >

                                            {/* DATE */}

                                            <View
                                                style={
                                                    invoicesStyles.detailItem
                                                }
                                            >

                                                <Ionicons
                                                    name="calendar-outline"
                                                    size={17}
                                                    color="#6B7785"
                                                />

                                                <View>

                                                    <Text
                                                        style={
                                                            invoicesStyles.detailLabel
                                                        }
                                                    >
                                                        Date
                                                    </Text>

                                                    <Text
                                                        style={
                                                            invoicesStyles.detailValue
                                                        }
                                                    >
                                                        {
                                                            getDate(
                                                                invoice
                                                            )
                                                        }
                                                    </Text>

                                                </View>

                                            </View>

                                            {/* TOTAL */}

                                            <View
                                                style={
                                                    invoicesStyles.amountContainer
                                                }
                                            >

                                                <Text
                                                    style={
                                                        invoicesStyles.amountLabel
                                                    }
                                                >
                                                    Total
                                                </Text>

                                                <Text
                                                    style={
                                                        invoicesStyles.amountValue
                                                    }
                                                >
                                                    ₹ {getAmount(invoice)}
                                                </Text>

                                            </View>

                                        </View>

                                        {/* JOBS */}

                                        <View
                                            style={
                                                invoicesStyles.jobRow
                                            }
                                        >

                                            <Ionicons
                                                name="briefcase-outline"
                                                size={16}
                                                color="#8A96A3"
                                            />

                                            <Text
                                                style={
                                                    invoicesStyles.jobText
                                                }
                                                numberOfLines={1}
                                            >
                                                Jobs:{" "}
                                                {
                                                    invoice.jobIds
                                                        ?.join(", ") ||
                                                    "None"
                                                }
                                            </Text>

                                        </View>

                                        {/* PAYMENT */}

                                        <View
                                            style={[
                                                invoicesStyles.jobRow,
                                                {
                                                    marginTop: 8,
                                                },
                                            ]}
                                        >

                                            <Ionicons
                                                name="card-outline"
                                                size={16}
                                                color={
                                                    paymentColor
                                                }
                                            />

                                            <Text
                                                style={[
                                                    invoicesStyles.jobText,
                                                    {
                                                        color:
                                                            paymentColor,
                                                        fontWeight:
                                                            "600",
                                                    },
                                                ]}
                                            >
                                                Payment:{" "}
                                                {
                                                    formatPaymentStatus(
                                                        invoice.paymentStatus
                                                    )
                                                }
                                            </Text>

                                        </View>

                                    </TouchableOpacity>

                                    {/* =========================================
                                        DOWNLOAD BUTTON
                                    ========================================== */}

                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        disabled={
                                            isDownloading
                                        }
                                        onPress={() =>
                                            downloadInvoicePdf(
                                                invoice
                                            )
                                        }
                                        style={[
                                            invoicesStyles.downloadButton,
                                            isDownloading &&
                                            invoicesStyles.downloadButtonDisabled,
                                        ]}
                                    >

                                        {isDownloading ? (

                                            <ActivityIndicator
                                                size="small"
                                                color="#FFFFFF"
                                            />

                                        ) : (

                                            <Ionicons
                                                name="download-outline"
                                                size={20}
                                                color="#FFFFFF"
                                            />

                                        )}

                                        <Text
                                            style={
                                                invoicesStyles.downloadButtonText
                                            }
                                        >
                                            {isDownloading
                                                ? "Creating PDF..."
                                                : "Download Invoice PDF"}
                                        </Text>

                                    </TouchableOpacity>

                                </View>
                            );
                        }
                    )
                )}

            </ScrollView>

        </SafeAreaView>
    );
}

export default Invoices;
