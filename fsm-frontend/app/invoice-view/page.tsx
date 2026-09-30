"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import "./invoice-view.css";

import {
    getInvoiceById,
    updateInvoice,
    Invoice,
} from "../apiservice/invoiceService";

import { getTicketById } from "../apiservice/ticketservice";
import { getCustomerById } from "../apiservice/customersservice";

interface Ticket {
    id: number;
    ticketId?: string | null;
    customerId?: number | null;
    serviceTypeId?: number | null;
    title?: string | null;
    description?: string | null;
    note?: string | null;
    status?: string | null;
}

interface Customer {
    id: number;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    taxId?: string | null;
}

const unwrapResponse = <T,>(response: any): T => {
    return (response?.data ?? response) as T;
};

function InvoiceView() {
    const router = useRouter();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingPayment, setUpdatingPayment] = useState(false);

    /*
     * ============================================================
     * LOAD INVOICE ID FROM SESSION STORAGE
     * ============================================================
     */
    useEffect(() => {
        const storedInvoiceId =
            sessionStorage.getItem("invoice_id");

        if (!storedInvoiceId) {
            setError("Invoice ID not found.");
            setLoading(false);
            return;
        }

        const invoiceId = Number(storedInvoiceId);

        if (
            Number.isNaN(invoiceId) ||
            invoiceId <= 0
        ) {
            setError("Invalid invoice ID.");
            setLoading(false);
            return;
        }

        loadInvoice(invoiceId);
    }, []);

    /*
     * ============================================================
     * LOAD INVOICE FROM BACKEND
     * ============================================================
     */
    const loadInvoice = async (invoiceId: number) => {
        try {
            setLoading(true);
            setError("");

            /*
             * Get invoice directly from backend
             */
            const invoiceResponse =
                await getInvoiceById(invoiceId);

            const loadedInvoice =
                unwrapResponse<Invoice>(
                    invoiceResponse
                );

            if (!loadedInvoice) {
                throw new Error(
                    "Invoice not found."
                );
            }

            setInvoice(loadedInvoice);

            /*
             * ====================================================
             * LOAD TICKET
             * ====================================================
             */
            if (loadedInvoice.ticketId) {
                try {
                    const ticketResponse =
                        await getTicketById({
                            id: Number(
                                loadedInvoice.ticketId
                            ),
                        });

                    const loadedTicket =
                        unwrapResponse<Ticket>(
                            ticketResponse
                        );

                    if (loadedTicket) {
                        setTicket(loadedTicket);

                        /*
                         * ==================================================
                         * LOAD CUSTOMER FROM TICKET
                         * ==================================================
                         */
                        if (
                            loadedTicket.customerId
                        ) {
                            try {
                                const customerResponse =
                                    await getCustomerById(
                                        Number(
                                            loadedTicket.customerId
                                        )
                                    );

                                const loadedCustomer =
                                    unwrapResponse<Customer>(
                                        customerResponse
                                    );

                                setCustomer(
                                    loadedCustomer
                                );
                            } catch (customerError) {
                                console.error(
                                    "Customer loading error:",
                                    customerError
                                );
                            }
                        }
                    }
                } catch (ticketError) {
                    console.error(
                        "Ticket loading error:",
                        ticketError
                    );
                }
            }
        } catch (requestError: any) {
            console.error(
                "Invoice view error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to load invoice."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * ============================================================
     * CURRENCY
     * ============================================================
     */
    const formatCurrency = (
        value: number | null | undefined
    ) => {
        return `₹${Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    /*
     * ============================================================
     * DATE
     * ============================================================
     */
    const formatDate = (
        value?: string | null
    ) => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
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
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    /*
     * ============================================================
     * STATUS
     * ============================================================
     */
    const paymentStatus =
        String(
            invoice?.paymentStatus ||
            "PENDING"
        ).toUpperCase();

    const invoiceStatus =
        String(
            invoice?.status ||
            "DRAFT"
        ).toUpperCase();

    const getPaymentStatusClass = () => {
        switch (paymentStatus) {
            case "PAID":
                return "invoice-view-status-paid";

            case "PARTIAL":
                return "invoice-view-status-partial";

            case "FAILED":
                return "invoice-view-status-failed";

            case "PENDING":
            default:
                return "invoice-view-status-pending";
        }
    };

    const getInvoiceStatusClass = () => {
        switch (invoiceStatus) {
            case "ISSUED":
                return "invoice-view-status-issued";

            case "CANCELLED":
                return "invoice-view-status-cancelled";

            case "PAID":
                return "invoice-view-status-paid";

            case "DRAFT":
            default:
                return "invoice-view-status-draft";
        }
    };

    /*
     * ============================================================
     * JOB IDS
     * ============================================================
     */
    const jobIds = useMemo(() => {
        if (!invoice?.jobIds) {
            return [];
        }

        return Array.isArray(
            invoice.jobIds
        )
            ? invoice.jobIds
            : [];
    }, [invoice]);

    /*
     * ============================================================
     * MARK AS PAID
     * ============================================================
     */
    const handleMarkAsPaid = async () => {
        if (
            !invoice ||
            updatingPayment
        ) {
            return;
        }

        try {
            setUpdatingPayment(true);

            let updatedBy = "admin";

            if (
                typeof window !==
                "undefined"
            ) {
                updatedBy =
                    sessionStorage.getItem(
                        "user_phone"
                    ) ||
                    sessionStorage.getItem(
                        "user_id"
                    ) ||
                    "admin";
            }

            const updatedInvoice =
                await updateInvoice({
                    id: invoice.id,
                    paymentStatus: "PAID",
                    status: invoice.status,
                    updatedBy,
                });

            const normalizedInvoice =
                unwrapResponse<Invoice>(
                    updatedInvoice
                );

            if (normalizedInvoice) {
                setInvoice(
                    normalizedInvoice
                );
            } else {
                setInvoice(
                    current =>
                        current
                            ? {
                                  ...current,
                                  paymentStatus:
                                      "PAID",
                              }
                            : current
                );
            }

            window.alert(
                "Payment marked as paid successfully."
            );
        } catch (paymentError: any) {
            console.error(
                "Payment update error:",
                paymentError
            );

            window.alert(
                paymentError?.message ||
                "Unable to update payment status."
            );
        } finally {
            setUpdatingPayment(false);
        }
    };

    /*
     * ============================================================
     * PRINT
     * ============================================================
     */
    const handlePrint = () => {
        window.print();
    };

    /*
     * ============================================================
     * LOADING
     * ============================================================
     */
    if (loading) {
        return (
            <div className="invoice-view-loading">
                <div className="invoice-view-spinner"></div>

                <p>
                    Loading invoice...
                </p>
            </div>
        );
    }

    /*
     * ============================================================
     * ERROR
     * ============================================================
     */
    if (
        error ||
        !invoice
    ) {
        return (
            <div className="invoice-view-error-page">
                <div className="invoice-view-error-card">

                    <div className="invoice-view-error-icon">
                        <i className="bi bi-receipt"></i>
                    </div>

                    <h2>
                        Invoice not found
                    </h2>

                    <p>
                        {error ||
                            "The requested invoice could not be loaded."}
                    </p>

                    <button
                        className="invoice-view-back-btn"
                        onClick={() =>
                            router.back()
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Invoices
                    </button>

                </div>
            </div>
        );
    }

    /*
     * ============================================================
     * PAGE
     * ============================================================
     */
    return (
        <div className="invoice-view-page">

            {/* TOP BAR */}
            <div className="invoice-view-topbar">

                <div className="invoice-view-topbar-left">

                    <button
                        className="invoice-view-back-icon"
                        onClick={() =>
                            router.back()
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <div>

                        <div className="invoice-view-breadcrumb">
                            Invoices
                            <i className="bi bi-chevron-right"></i>
                            View Invoice
                        </div>

                        <h1>
                            {invoice.invoiceId ||
                                `INV-${invoice.id}`}
                        </h1>

                    </div>

                </div>

                <div className="invoice-view-topbar-actions">

                    <button
                        className="invoice-view-secondary-btn"
                        onClick={
                            handlePrint
                        }
                    >
                        <i className="bi bi-printer"></i>
                        Print
                    </button>

                    {paymentStatus !==
                        "PAID" && (
                        <button
                            className="invoice-view-paid-btn"
                            onClick={
                                handleMarkAsPaid
                            }
                            disabled={
                                updatingPayment
                            }
                        >
                            {updatingPayment ? (
                                <>
                                    <span className="invoice-view-small-spinner"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle"></i>
                                    Mark as Paid
                                </>
                            )}
                        </button>
                    )}

                </div>

            </div>

            {/* MAIN */}
            <div className="invoice-view-container">

                {/* HEADER */}
                <div className="invoice-view-card invoice-view-main-header">

                    <div className="invoice-view-company">

                        <div className="invoice-view-company-logo">
                            <i className="bi bi-buildings"></i>
                        </div>

                        <div>
                            <h2>
                                FSM Cloud
                            </h2>

                            <p>
                                Field Service Management
                            </p>
                        </div>

                    </div>

                    <div className="invoice-view-header-right">

                        <div className="invoice-view-invoice-label">
                            INVOICE
                        </div>

                        <div className="invoice-view-number">
                            {invoice.invoiceId ||
                                `INV-${invoice.id}`}
                        </div>

                        <div className="invoice-view-date">
                            Issued{" "}
                            {formatDate(
                                invoice.createdAt
                            )}
                        </div>

                    </div>

                </div>

                {/* STATUS */}
                <div className="invoice-view-status-card">

                    <div className="invoice-view-status-item">

                        <span>
                            Invoice Status
                        </span>

                        <span
                            className={`invoice-view-status-pill ${getInvoiceStatusClass()}`}
                        >
                            <span className="invoice-view-status-dot"></span>
                            {invoiceStatus}
                        </span>

                    </div>

                    <div className="invoice-view-status-divider"></div>

                    <div className="invoice-view-status-item">

                        <span>
                            Payment Status
                        </span>

                        <span
                            className={`invoice-view-status-pill ${getPaymentStatusClass()}`}
                        >
                            <span className="invoice-view-status-dot"></span>
                            {paymentStatus}
                        </span>

                    </div>

                    {invoice.paymentMethod && (
                        <>
                            <div className="invoice-view-status-divider"></div>

                            <div className="invoice-view-status-item">

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {invoice.paymentMethod.replace(
                                        /_/g,
                                        " "
                                    )}
                                </strong>

                            </div>
                        </>
                    )}

                </div>

                {/* CUSTOMER + DETAILS */}
                <div className="invoice-view-two-column">

                    {/* CUSTOMER */}
                    <div className="invoice-view-card">

                        <div className="invoice-view-section-title">

                            <div className="invoice-view-section-icon">
                                <i className="bi bi-person"></i>
                            </div>

                            <h3>
                                Bill To
                            </h3>

                        </div>

                        <div className="invoice-view-customer-info">

                            <h4>
                                {customer?.name ||
                                    "Customer"}
                            </h4>

                            {customer?.phone && (
                                <div>
                                    <i className="bi bi-telephone"></i>
                                    {customer.phone}
                                </div>
                            )}

                            {customer?.email && (
                                <div>
                                    <i className="bi bi-envelope"></i>
                                    {customer.email}
                                </div>
                            )}

                            {customer?.address && (
                                <div>
                                    <i className="bi bi-geo-alt"></i>
                                    {customer.address}
                                </div>
                            )}

                            {(
                                customer?.gstin ||
                                customer?.gstNumber
                            ) && (
                                <div>
                                    <i className="bi bi-card-text"></i>
                                    GSTIN:{" "}
                                    {customer.gstin ||
                                        customer.gstNumber}
                                </div>
                            )}

                            {customer?.taxId && (
                                <div>
                                    <i className="bi bi-card-text"></i>
                                    Tax ID:{" "}
                                    {customer.taxId}
                                </div>
                            )}

                            {!customer && (
                                <p className="invoice-view-muted">
                                    Customer information is not available.
                                </p>
                            )}

                        </div>

                    </div>

                    {/* DETAILS */}
                    <div className="invoice-view-card">

                        <div className="invoice-view-section-title">

                            <div className="invoice-view-section-icon">
                                <i className="bi bi-info-circle"></i>
                            </div>

                            <h3>
                                Invoice Details
                            </h3>

                        </div>

                        <div className="invoice-view-detail-list">

                            <div>
                                <span>
                                    Invoice ID
                                </span>

                                <strong>
                                    {invoice.invoiceId ||
                                        `INV-${invoice.id}`}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Ticket
                                </span>

                                <strong>
                                    {ticket?.ticketId ||
                                        ticket?.id ||
                                        invoice.ticketId}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Created
                                </span>

                                <strong>
                                    {formatDateTime(
                                        invoice.createdAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Working Hours
                                </span>

                                <strong>
                                    {Number(
                                        invoice.workingHours ||
                                        0
                                    ).toFixed(2)}{" "}
                                    hrs
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

                {/* TICKET */}
                <div className="invoice-view-card">

                    <div className="invoice-view-section-title">

                        <div className="invoice-view-section-icon">
                            <i className="bi bi-ticket-perforated"></i>
                        </div>

                        <h3>
                            Linked Ticket
                        </h3>

                    </div>

                    <div className="invoice-view-ticket-grid">

                        <div>
                            <span>
                                Ticket
                            </span>

                            <strong>
                                {ticket?.ticketId ||
                                    `#${invoice.ticketId}`}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Title
                            </span>

                            <strong>
                                {ticket?.title ||
                                    "Service Ticket"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Service Type
                            </span>

                            <strong>
                                {ticket?.serviceTypeId ||
                                    "—"}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* JOBS */}
                <div className="invoice-view-card">

                    <div className="invoice-view-section-title">

                        <div className="invoice-view-section-icon">
                            <i className="bi bi-briefcase"></i>
                        </div>

                        <h3>
                            Linked Jobs
                        </h3>

                    </div>

                    {jobIds.length === 0 ? (
                        <div className="invoice-view-empty">
                            No jobs linked to this invoice.
                        </div>
                    ) : (
                        <div className="invoice-view-job-list">

                            {jobIds.map(
                                id => (
                                    <div
                                        className="invoice-view-job-item"
                                        key={id}
                                    >

                                        <div className="invoice-view-job-icon">
                                            <i className="bi bi-briefcase"></i>
                                        </div>

                                        <div>
                                            <span>
                                                Job
                                            </span>

                                            <strong>
                                                #{id}
                                            </strong>
                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* AMOUNT */}
                <div className="invoice-view-card">

                    <div className="invoice-view-section-title">

                        <div className="invoice-view-section-icon">
                            <i className="bi bi-calculator"></i>
                        </div>

                        <h3>
                            Invoice Summary
                        </h3>

                    </div>

                    <div className="invoice-view-amount-section">

                        <div className="invoice-view-amount-row">

                            <span>
                                Service Charge
                            </span>

                            <strong>
                                {formatCurrency(
                                    invoice.serviceCharge
                                )}
                            </strong>

                        </div>

                        <div className="invoice-view-amount-row">

                            <span>
                                Parts Charge
                            </span>

                            <strong>
                                {formatCurrency(
                                    invoice.partsCharge
                                )}
                            </strong>

                        </div>

                        <div className="invoice-view-amount-row">

                            <span>
                                Tax
                            </span>

                            <strong>
                                {formatCurrency(
                                    invoice.taxAmount
                                )}
                            </strong>

                        </div>

                        <div className="invoice-view-total-divider"></div>

                        <div className="invoice-view-grand-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                {formatCurrency(
                                    invoice.totalPrice
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* PAYMENT */}
                <div className="invoice-view-card">

                    <div className="invoice-view-section-title">

                        <div className="invoice-view-section-icon">
                            <i className="bi bi-credit-card"></i>
                        </div>

                        <h3>
                            Payment Information
                        </h3>

                    </div>

                    <div className="invoice-view-payment-grid">

                        <div>
                            <span>
                                Payment Status
                            </span>

                            <strong
                                className={
                                    getPaymentStatusClass()
                                }
                            >
                                {paymentStatus}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {invoice.paymentMethod
                                    ? invoice.paymentMethod.replace(
                                          /_/g,
                                          " "
                                      )
                                    : "Not selected"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Amount
                            </span>

                            <strong>
                                {formatCurrency(
                                    invoice.totalPrice
                                )}
                            </strong>
                        </div>

                    </div>

                    {paymentStatus !==
                        "PAID" && (
                        <div className="invoice-view-payment-action">

                            <div>
                                <i className="bi bi-info-circle"></i>

                                <span>
                                    Payment has not been marked as completed.
                                </span>
                            </div>

                            <button
                                onClick={
                                    handleMarkAsPaid
                                }
                                disabled={
                                    updatingPayment
                                }
                            >
                                <i className="bi bi-check-circle"></i>

                                {updatingPayment
                                    ? "Updating..."
                                    : "Mark Payment as Paid"}
                            </button>

                        </div>
                    )}

                    {paymentStatus ===
                        "PAID" && (
                        <div className="invoice-view-paid-message">

                            <i className="bi bi-check-circle-fill"></i>

                            <div>

                                <strong>
                                    Payment Successful
                                </strong>

                                <span>
                                    This invoice has been fully paid.
                                </span>

                            </div>

                        </div>
                    )}

                </div>

                {/* NOTES */}
                {invoice.notes && (
                    <div className="invoice-view-card">

                        <div className="invoice-view-section-title">

                            <div className="invoice-view-section-icon">
                                <i className="bi bi-sticky"></i>
                            </div>

                            <h3>
                                Notes
                            </h3>

                        </div>

                        <div className="invoice-view-notes">
                            {invoice.notes}
                        </div>

                    </div>
                )}

                {/* FOOTER */}
                <div className="invoice-view-footer">

                    <button
                        className="invoice-view-footer-back"
                        onClick={() =>
                            router.back()
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Invoices
                    </button>

                    <button
                        className="invoice-view-footer-print"
                        onClick={
                            handlePrint
                        }
                    >
                        <i className="bi bi-printer"></i>
                        Print Invoice
                    </button>

                </div>

            </div>
        </div>
    );
}

export default InvoiceView;