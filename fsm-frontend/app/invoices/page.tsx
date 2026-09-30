
"use client";
import { useEffect, useMemo, useState } from "react";
import "./invoices.css";
import { getAllInvoices, Invoice as InvoiceType, } from "../apiservice/invoiceService";
import { getTicketById } from "../apiservice/ticketservice";
import { getJobById } from "../apiservice/jobservice";
import { getCustomerById } from "../apiservice/customersservice";
import { useRouter } from "next/navigation";

// import {
//     getAllInvoices,
//     Invoice as InvoiceType,
// } from "../../apiservice/invoiceservice";


interface Ticket {
    id: number;

    ticketId?: string | null;

    customerId?: number | null;

    serviceTypeId?: number | null;

    title?: string | null;

    note?: string | null;

    description?: string | null;
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

interface Job {
    id: number;

    jobId?: string | null;

    jobTitle?: string | null;

    jobDescription?: string | null;

    userId?: number | null;

    ticketId?: number | null;
}

interface InvoiceRow {
    invoice: InvoiceType;

    customer: Customer | null;

    ticket: Ticket | null;

    jobs: Job[];

    technicianName: string;

    issueDate: string;

    dueDate: string;

    dueStatus: string;

    statusLabel: string;

    statusClass: string;

    icon: string;

    iconClass: string;
}

type FilterType =
    | "ALL"
    | "PAID"
    | "PENDING"
    | "OVERDUE"
    | "DRAFT";

const Invoice = () => {

    const [invoices, setInvoices] =
        useState<InvoiceType[]>([]);

    const [invoiceRows, setInvoiceRows] =
        useState<InvoiceRow[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeFilter, setActiveFilter] =
        useState<FilterType>("ALL");

    const [currentPage, setCurrentPage] =
        useState(1);

    const pageSize = 5;

    const router = useRouter();


    useEffect(() => {
        loadInvoices();
    }, []);

    const unwrapResponse = <T,>(
        response: any
    ): T => {
        return (
            response?.data ??
            response
        ) as T;
    };

    const loadInvoices = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getAllInvoices();

            const loadedInvoices =
                unwrapResponse<InvoiceType[]>(
                    response
                );

            if (
                !Array.isArray(
                    loadedInvoices
                )
            ) {

                setInvoices([]);

                setInvoiceRows([]);

                return;
            }

            setInvoices(
                loadedInvoices
            );

            /*
             * Load related ticket/customer/job
             * information.
             */
            const rows =
                await Promise.all(
                    loadedInvoices.map(
                        async (
                            invoice
                        ) => {

                            let ticket:
                                Ticket | null =
                                null;

                            let customer:
                                Customer | null =
                                null;

                            const jobs:
                                Job[] = [];

                            /*
                             * --------------------------------
                             * TICKET
                             * --------------------------------
                             */
                            try {

                                if (
                                    invoice.ticketId
                                ) {

                                    const ticketResponse =
                                        await getTicketById(
                                            {
                                                id: Number(
                                                    invoice.ticketId
                                                ),
                                            }
                                        );

                                    ticket =
                                        unwrapResponse<Ticket>(
                                            ticketResponse
                                        );
                                }

                            } catch (
                            ticketError
                            ) {

                                console.error(
                                    "Invoice ticket load error:",
                                    ticketError
                                );
                            }

                            /*
                             * --------------------------------
                             * CUSTOMER
                             * --------------------------------
                             */
                            try {

                                if (
                                    ticket?.customerId
                                ) {

                                    const customerResponse =
                                        await getCustomerById(
                                            Number(
                                                ticket.customerId
                                            )
                                        );

                                    customer =
                                        unwrapResponse<Customer>(
                                            customerResponse
                                        );
                                }

                            } catch (
                            customerError
                            ) {

                                console.error(
                                    "Invoice customer load error:",
                                    customerError
                                );
                            }

                            /*
                             * --------------------------------
                             * JOBS
                             * --------------------------------
                             */
                            if (
                                Array.isArray(
                                    invoice.jobIds
                                )
                            ) {

                                for (
                                    const jobId of invoice.jobIds
                                ) {

                                    try {

                                        const jobResponse =
                                            await getJobById(
                                                {
                                                    id: Number(
                                                        jobId
                                                    ),
                                                }
                                            );

                                        const job =
                                            unwrapResponse<Job>(
                                                jobResponse
                                            );

                                        if (
                                            job
                                        ) {

                                            jobs.push(
                                                job
                                            );
                                        }

                                    } catch (
                                    jobError
                                    ) {

                                        console.error(
                                            `Invoice job ${jobId} load error:`,
                                            jobError
                                        );
                                    }
                                }
                            }

                            /*
                             * --------------------------------
                             * TECHNICIAN
                             * --------------------------------
                             *
                             * The invoice table currently
                             * stores createdBy, not technician
                             * name.
                             *
                             * Therefore show createdBy first.
                             */
                            const technicianName =
                                invoice.createdBy ||
                                (
                                    jobs[0]
                                        ?.userId
                                        ? `User #${jobs[0].userId}`
                                        : "Unassigned"
                                );

                            /*
                             * --------------------------------
                             * ISSUE DATE
                             * --------------------------------
                             */
                            const issueDate =
                                formatDate(
                                    invoice.createdAt
                                );

                            /*
                             * --------------------------------
                             * DUE DATE
                             * --------------------------------
                             *
                             * Your current invoice table
                             * does not have due_date.
                             *
                             * So use updatedAt / issue date
                             * information without inventing
                             * a due date.
                             */
                            const dueDate =
                                "Not set";

                            /*
                             * --------------------------------
                             * STATUS
                             * --------------------------------
                             */
                            const statusInfo =
                                getStatusInfo(
                                    invoice
                                );

                            /*
                             * --------------------------------
                             * RETURN ROW
                             * --------------------------------
                             */
                            return {
                                invoice,

                                customer,

                                ticket,

                                jobs,

                                technicianName,

                                issueDate,

                                dueDate,

                                dueStatus:
                                    getDueStatus(
                                        invoice
                                    ),

                                statusLabel:
                                    statusInfo.label,

                                statusClass:
                                    statusInfo.className,

                                icon:
                                    statusInfo.icon,

                                iconClass:
                                    statusInfo.iconClass,
                            };
                        }
                    )
                );

            setInvoiceRows(
                rows
            );

        } catch (
        loadError: any
        ) {

            console.error(
                "Invoice load error:",
                loadError
            );

            setError(
                loadError?.message ||
                "Unable to load invoices."
            );

            setInvoices([]);

            setInvoiceRows([]);

        } finally {

            setLoading(false);
        }
    };

    /*
     * ============================================
     * FILTER
     * ============================================
     */
    const filteredRows =
        useMemo(() => {

            if (
                activeFilter ===
                "ALL"
            ) {

                return invoiceRows;
            }

            return invoiceRows.filter(
                (
                    row
                ) => {

                    const status =
                        String(
                            row.invoice
                                .paymentStatus ||
                            row.invoice
                                .status ||
                            ""
                        )
                            .trim()
                            .toUpperCase();

                    if (
                        activeFilter ===
                        "PAID"
                    ) {

                        return (
                            status ===
                            "PAID"
                        );
                    }

                    if (
                        activeFilter ===
                        "PENDING"
                    ) {

                        return (
                            status ===
                            "PENDING" ||
                            status ===
                            "PARTIAL"
                        );
                    }

                    if (
                        activeFilter ===
                        "OVERDUE"
                    ) {

                        return (
                            status ===
                            "OVERDUE"
                        );
                    }

                    if (
                        activeFilter ===
                        "DRAFT"
                    ) {

                        return (
                            status ===
                            "DRAFT" ||
                            String(
                                row.invoice
                                    .status ||
                                ""
                            )
                                .toUpperCase() ===
                            "DRAFT"
                        );
                    }

                    return true;
                }
            );

        }, [
            invoiceRows,
            activeFilter,
        ]);

    /*
     * ============================================
     * COUNTS
     * ============================================
     */
    const allCount =
        invoices.length;

    const paidCount =
        invoices.filter(
            (
                invoice
            ) =>
                String(
                    invoice.paymentStatus ||
                    ""
                ).toUpperCase() ===
                "PAID"
        ).length;

    const pendingCount =
        invoices.filter(
            (
                invoice
            ) => {

                const status =
                    String(
                        invoice.paymentStatus ||
                        ""
                    ).toUpperCase();

                return (
                    status ===
                    "PENDING" ||
                    status ===
                    "PARTIAL"
                );
            }
        ).length;

    const overdueCount =
        invoices.filter(
            (
                invoice
            ) =>
                String(
                    invoice.paymentStatus ||
                    ""
                ).toUpperCase() ===
                "OVERDUE"
        ).length;

    const draftCount =
        invoices.filter(
            (
                invoice
            ) =>
                String(
                    invoice.status ||
                    ""
                ).toUpperCase() ===
                "DRAFT"
        ).length;

    /*
     * ============================================
     * PAGINATION
     * ============================================
     */
    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredRows.length /
                pageSize
            )
        );

    const paginatedRows =
        useMemo(() => {

            const start =
                (
                    currentPage -
                    1
                ) *
                pageSize;

            return filteredRows.slice(
                start,
                start +
                pageSize
            );

        }, [
            filteredRows,
            currentPage,
        ]);

    /*
     * Reset page when filter changes.
     */
    useEffect(() => {

        setCurrentPage(1);

    }, [
        activeFilter,
    ]);

    /*
     * ============================================
     * FILTER CHANGE
     * ============================================
     */
    const handleFilterChange = (
        filter: FilterType
    ) => {

        setActiveFilter(
            filter
        );

        setCurrentPage(1);
    };

    const handleViewInvoice = (invoice: InvoiceType) => {
        if (!invoice?.id) {
            console.error("Invoice ID is missing");
            return;
        }

        localStorage.setItem(
            "invoice_id",
            String(invoice.id)
        );

        router.push("/invoice-view");
    };


    if (loading) {

        return (
            <div
                className="admin-invoice-page"
            >

                <div
                    className="admin-invoice-card"
                >

                    <div
                        style={{
                            padding:
                                "60px",
                            textAlign:
                                "center",
                        }}
                    >

                        <i
                            className="bi bi-arrow-repeat"
                            style={{
                                fontSize:
                                    "28px",
                                color:
                                    "#421DDB",
                            }}
                        />

                        <div
                            style={{
                                marginTop:
                                    "12px",
                                color:
                                    "#667085",
                            }}
                        >
                            Loading invoices...
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    /*
     * ============================================
     * ERROR
     * ============================================
     */
    if (error) {

        return (
            <div
                className="admin-invoice-page"
            >

                <div
                    className="admin-invoice-card"
                >

                    <div
                        style={{
                            padding:
                                "60px",
                            textAlign:
                                "center",
                        }}
                    >

                        <i
                            className="bi bi-exclamation-circle"
                            style={{
                                fontSize:
                                    "42px",
                                color:
                                    "#D64545",
                            }}
                        />

                        <div
                            style={{
                                marginTop:
                                    "15px",
                                fontWeight:
                                    600,
                            }}
                        >
                            Unable to load invoices
                        </div>

                        <div
                            style={{
                                marginTop:
                                    "8px",
                                color:
                                    "#667085",
                            }}
                        >
                            {error}
                        </div>

                        <button
                            className="admin-invoice-action-btn"
                            style={{
                                marginTop:
                                    "20px",
                            }}
                            onClick={
                                loadInvoices
                            }
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            Retry
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div
            className="admin-invoice-page"
        >

            <div
                className="admin-invoice-card"
            >

                {/* ============================================
                    TOP SECTION
                ============================================ */}

                <div
                    className="admin-invoice-top-section"
                >

                    <div
                        className="admin-invoice-filter-tabs"
                    >

                        <button
                            className={`admin-invoice-tab ${activeFilter ===
                                "ALL"
                                ? "admin-invoice-tab-active"
                                : ""
                                }`}
                            onClick={() =>
                                handleFilterChange(
                                    "ALL"
                                )
                            }
                        >
                            All Invoices

                            <span>
                                {allCount}
                            </span>
                        </button>

                        <button
                            className={`admin-invoice-tab ${activeFilter ===
                                "PAID"
                                ? "admin-invoice-tab-active"
                                : ""
                                }`}
                            onClick={() =>
                                handleFilterChange(
                                    "PAID"
                                )
                            }
                        >
                            Paid

                            <span className="admin-invoice-tab-green">
                                {paidCount}
                            </span>
                        </button>

                        <button
                            className={`admin-invoice-tab ${activeFilter ===
                                "PENDING"
                                ? "admin-invoice-tab-active"
                                : ""
                                }`}
                            onClick={() =>
                                handleFilterChange(
                                    "PENDING"
                                )
                            }
                        >
                            Pending Payment

                            <span className="admin-invoice-tab-blue">
                                {pendingCount}
                            </span>
                        </button>

                        <button
                            className={`admin-invoice-tab ${activeFilter ===
                                "OVERDUE"
                                ? "admin-invoice-tab-active"
                                : ""
                                }`}
                            onClick={() =>
                                handleFilterChange(
                                    "OVERDUE"
                                )
                            }
                        >
                            Overdue

                            <span className="admin-invoice-tab-red">
                                {overdueCount}
                            </span>
                        </button>

                        <button
                            className={`admin-invoice-tab ${activeFilter ===
                                "DRAFT"
                                ? "admin-invoice-tab-active"
                                : ""
                                }`}
                            onClick={() =>
                                handleFilterChange(
                                    "DRAFT"
                                )
                            }
                        >
                            Drafts

                            <span>
                                {draftCount}
                            </span>
                        </button>

                    </div>

                    <div
                        className="admin-invoice-actions"
                    >

                        <button
                            className="admin-invoice-action-btn"
                        >
                            <i className="bi bi-filter"></i>
                            Filter
                        </button>

                        <button
                            className="admin-invoice-action-btn"
                            onClick={() => {
                                console.log(
                                    "Export invoices:",
                                    filteredRows
                                );
                            }}
                        >
                            <i className="bi bi-download"></i>
                            Export CSV
                        </button>

                    </div>

                </div>

                {/* ============================================
                    TABLE
                ============================================ */}

                <div
                    className="admin-invoice-table-wrapper"
                >

                    <div
                        className="admin-invoice-table-scroll"
                    >

                        <table
                            className="admin-invoice-table"
                        >

                            <thead>

                                <tr>

                                    <th>
                                        INVOICE # &<br />
                                        ISSUE DATE
                                    </th>

                                    <th>
                                        CUSTOMER &<br />
                                        TAX ID
                                    </th>

                                    <th>
                                        LINKED JOB & TICKET
                                    </th>

                                    <th>
                                        TECHNICIAN
                                        <br />
                                        / CREW
                                    </th>

                                    <th>
                                        DUE DATE
                                    </th>

                                    <th>
                                        AMOUNT &<br />
                                        TAX
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {paginatedRows.length ===
                                    0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                8
                                            }
                                        >

                                            <div
                                                style={{
                                                    padding:
                                                        "50px",
                                                    textAlign:
                                                        "center",
                                                    color:
                                                        "#667085",
                                                }}
                                            >

                                                <i
                                                    className="bi bi-receipt"
                                                    style={{
                                                        fontSize:
                                                            "40px",
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "10px",
                                                    }}
                                                >
                                                    No invoices found.
                                                </div>

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    paginatedRows.map(
                                        (
                                            row
                                        ) => {

                                            const {
                                                invoice,
                                                customer,
                                                ticket,
                                                jobs,
                                                technicianName,
                                                issueDate,
                                                dueDate,
                                                dueStatus,
                                                statusLabel,
                                                statusClass,
                                                icon,
                                                iconClass,
                                            } = row;

                                            return (
                                                <tr
                                                    key={
                                                        invoice.id
                                                    }
                                                >

                                                    {/* INVOICE */}

                                                    <td>

                                                        <div
                                                            className="admin-invoice-number-cell"
                                                        >

                                                            <div
                                                                className={`admin-invoice-row-icon ${iconClass}`}
                                                            >

                                                                <i
                                                                    className={`bi ${icon}`}
                                                                />

                                                            </div>

                                                            <div>

                                                                <div
                                                                    className="admin-invoice-number"
                                                                >
                                                                    {invoice.invoiceId}
                                                                </div>

                                                                <div
                                                                    className="admin-invoice-date"
                                                                >
                                                                    {issueDate}
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* CUSTOMER */}

                                                    <td>

                                                        <div
                                                            className="admin-invoice-customer"
                                                        >
                                                            {
                                                                customer?.name ||
                                                                "Customer unavailable"
                                                            }
                                                        </div>

                                                        <div
                                                            className="admin-invoice-tax-id"
                                                        >
                                                            {
                                                                customer?.gstin ||
                                                                customer?.gstNumber ||
                                                                customer?.taxId ||
                                                                (
                                                                    customer?.phone
                                                                        ? `Phone: ${customer.phone}`
                                                                        : "Tax ID not available"
                                                                )
                                                            }
                                                        </div>

                                                    </td>

                                                    {/* JOB / TICKET */}

                                                    <td>

                                                        <div
                                                            className="admin-invoice-job"
                                                        >

                                                            {jobs.length >
                                                                0
                                                                ? jobs
                                                                    .map(
                                                                        (
                                                                            job
                                                                        ) =>
                                                                            job.jobId ||
                                                                            `JOB-${job.id}`
                                                                    )
                                                                    .join(
                                                                        ", "
                                                                    )
                                                                : invoice.jobIds
                                                                    ?.map(
                                                                        (
                                                                            id
                                                                        ) =>
                                                                            `JOB-${id}`
                                                                    )
                                                                    .join(
                                                                        ", "
                                                                    ) ||
                                                                "No job"}

                                                        </div>

                                                        <div
                                                            className="admin-invoice-ticket"
                                                        >

                                                            {ticket?.ticketId ||
                                                                `Ticket #${invoice.ticketId}`}

                                                            {ticket?.title
                                                                ? ` • ${ticket.title}`
                                                                : ""}

                                                        </div>

                                                    </td>

                                                    {/* TECHNICIAN */}

                                                    <td>

                                                        <div
                                                            className="admin-invoice-technician"
                                                        >

                                                            <div
                                                                className="admin-invoice-avatar"
                                                            >
                                                                <i className="bi bi-person"></i>
                                                            </div>

                                                            <div>
                                                                {
                                                                    technicianName
                                                                }
                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* DUE */}

                                                    <td>

                                                        <div
                                                            className="admin-invoice-due-date"
                                                        >
                                                            {
                                                                dueDate
                                                            }
                                                        </div>

                                                        <div
                                                            className={`admin-invoice-due-status ${statusClass}`}
                                                        >
                                                            {
                                                                dueStatus
                                                            }
                                                        </div>

                                                    </td>

                                                    {/* AMOUNT */}

                                                    <td>

                                                        <div
                                                            className="admin-invoice-amount"
                                                        >
                                                            ₹
                                                            {Number(
                                                                invoice.totalPrice ||
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </div>

                                                        <div
                                                            className="admin-invoice-tax"
                                                        >
                                                            Tax: ₹
                                                            {Number(
                                                                invoice.taxAmount ||
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </div>

                                                    </td>

                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={`admin-invoice-status ${statusClass}`}
                                                        >

                                                            <span className="admin-invoice-status-dot"></span>

                                                            {
                                                                statusLabel
                                                            }

                                                        </span>

                                                    </td>

                                                    {/* ACTION */}

                                                    <td>

                                                        <button
                                                            className="admin-invoice-view-btn"
                                                            onClick={() =>
                                                                handleViewInvoice(
                                                                    invoice
                                                                )
                                                            }
                                                        >
                                                            View
                                                            <br />
                                                            Invoice
                                                        </button>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* ============================================
                    FOOTER
                ============================================ */}

                <div
                    className="admin-invoice-footer"
                >

                    <div
                        className="admin-invoice-showing"
                    >

                        Showing{" "}

                        <strong>
                            {filteredRows.length ===
                                0
                                ? 0
                                : (
                                    (
                                        currentPage -
                                        1
                                    ) *
                                    pageSize +
                                    1
                                )}
                        </strong>

                        {" - "}

                        <strong>
                            {Math.min(
                                currentPage *
                                pageSize,
                                filteredRows.length
                            )}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {
                                filteredRows.length
                            }
                        </strong>

                        {" "}invoices

                    </div>

                    <div
                        className="admin-invoice-pagination"
                    >

                        <button
                            className="admin-invoice-page-btn"
                            disabled={
                                currentPage ===
                                1
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (
                                        page
                                    ) =>
                                        Math.max(
                                            1,
                                            page -
                                            1
                                        )
                                )
                            }
                        >

                            <i className="bi bi-chevron-left"></i>

                            Previous

                        </button>

                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (
                                _,
                                index
                            ) =>
                                index +
                                1
                        )
                            .slice(
                                0,
                                5
                            )
                            .map(
                                (
                                    page
                                ) => (

                                    <button
                                        key={
                                            page
                                        }
                                        className={`admin-invoice-page-number ${currentPage ===
                                            page
                                            ? "admin-invoice-page-active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                    >
                                        {page}
                                    </button>

                                )
                            )}

                        {totalPages >
                            5 && (
                                <>
                                    <span className="admin-invoice-pagination-dots">
                                        ...
                                    </span>

                                    <button
                                        className={`admin-invoice-page-number ${currentPage ===
                                            totalPages
                                            ? "admin-invoice-page-active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setCurrentPage(
                                                totalPages
                                            )
                                        }
                                    >
                                        {
                                            totalPages
                                        }
                                    </button>
                                </>
                            )}

                        <button
                            className="admin-invoice-page-btn"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (
                                        page
                                    ) =>
                                        Math.min(
                                            totalPages,
                                            page +
                                            1
                                        )
                                )
                            }
                        >

                            Next

                            <i className="bi bi-chevron-right"></i>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

/*
 * ============================================
 * FORMAT DATE
 * ============================================
 */
const formatDate = (
    value?: string
): string => {

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

/*
 * ============================================
 * STATUS INFO
 * ============================================
 */
const getStatusInfo = (
    invoice: InvoiceType
) => {

    const paymentStatus =
        String(
            invoice.paymentStatus ||
            ""
        )
            .trim()
            .toUpperCase();

    const invoiceStatus =
        String(
            invoice.status ||
            ""
        )
            .trim()
            .toUpperCase();

    /*
     * PAID
     */
    if (
        paymentStatus ===
        "PAID"
    ) {

        return {
            label: "Paid",

            className:
                "admin-invoice-status-paid",

            icon:
                "bi-check-circle",

            iconClass:
                "admin-invoice-row-icon-blue",
        };
    }

    /*
     * OVERDUE
     */
    if (
        paymentStatus ===
        "OVERDUE"
    ) {

        return {
            label: "Overdue",

            className:
                "admin-invoice-status-overdue",

            icon:
                "bi-exclamation-triangle",

            iconClass:
                "admin-invoice-row-icon-red",
        };
    }

    /*
     * DRAFT
     */
    if (
        invoiceStatus ===
        "DRAFT"
    ) {

        return {
            label: "Draft",

            className:
                "admin-invoice-status-draft",

            icon:
                "bi-file-earmark-text",

            iconClass:
                "admin-invoice-row-icon-gray",
        };
    }

    /*
     * PARTIAL
     */
    if (
        paymentStatus ===
        "PARTIAL"
    ) {

        return {
            label: "Partial",

            className:
                "admin-invoice-status-pending",

            icon:
                "bi-receipt",

            iconClass:
                "admin-invoice-row-icon-blue",
        };
    }

    /*
     * DEFAULT
     */
    return {
        label:
            paymentStatus ||
            invoiceStatus ||
            "Pending",

        className:
            "admin-invoice-status-pending",

        icon:
            "bi-receipt",

        iconClass:
            "admin-invoice-row-icon-blue",
    };
};

/*
 * ============================================
 * DUE STATUS
 * ============================================
 */
const getDueStatus = (
    invoice: InvoiceType
): string => {

    const paymentStatus =
        String(
            invoice.paymentStatus ||
            ""
        )
            .trim()
            .toUpperCase();

    if (
        paymentStatus ===
        "PAID"
    ) {
        return "Settled";
    }

    if (
        paymentStatus ===
        "OVERDUE"
    ) {
        return "Overdue";
    }

    if (
        paymentStatus ===
        "PARTIAL"
    ) {
        return "Partially Paid";
    }

    if (
        paymentStatus ===
        "PENDING"
    ) {
        return "Awaiting Payment";
    }

    return "Not set";
};

export default Invoice;
