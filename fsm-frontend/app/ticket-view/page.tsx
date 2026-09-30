"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import "./ticket-view.css";

import {
    Ticket,
    getTicketById,
} from "../apiservice/ticketservice";

import {
    Customer,
    getCustomerById,
} from "../apiservice/customersservice";

import {
    getServiceTypeById,
    ServiceType,
} from "../apiservice/servicetype";

import {
    Job,
    getAllJobs,
} from "../apiservice/jobservice";

import {
    User,
    getAllUsers,
} from "../apiservice/userservice";

type TimelineStatus = "completed" | "active" | "pending";

interface TimelineItem {
    step: string;
    title: string;
    description: string;
    time: string;
    status: TimelineStatus;
}

export default function TicketsView() {
    const router = useRouter();
    const searchParams = useSearchParams();


    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [serviceType, setServiceType] = useState<ServiceType | null>(null);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [note, setNote] = useState("");

    useEffect(() => {
        const storedTicketId = localStorage.getItem("ticket_id");

        console.log("Ticket ID from localStorage:", storedTicketId);

        if (!storedTicketId) {
            setError("Ticket ID is missing.");
            setLoading(false);
            return;
        }

        const id = Number(storedTicketId);

        if (!Number.isInteger(id) || id <= 0) {
            localStorage.removeItem("ticket_id");
            setError("Invalid ticket ID.");
            setLoading(false);
            return;
        }

        loadTicketData(id);
    }, []);

    const loadTicketData = async (id: number) => {
        try {
            setLoading(true);
            setError("");

            const ticketResponse = await getTicketById({
                id,
            });

            if (!ticketResponse) {
                throw new Error("Ticket not found.");
            }

            setTicket(ticketResponse);

            const [
                customerResponse,
                jobsResponse,
                usersResponse,
            ] = await Promise.all([
                getCustomerById(ticketResponse.customerId),
                getAllJobs(),
                getAllUsers(),
            ]);

            setCustomer(customerResponse);
            setUsers(usersResponse);

            const ticketJobs = jobsResponse.filter(
                (job) =>
                    Number(job.ticketId) === Number(ticketResponse.id)
            );

            setJobs(ticketJobs);

            if (ticketResponse.serviceTypeId) {
                try {
                    const serviceResponse = await getServiceTypeById({
                        id: ticketResponse.serviceTypeId,
                    });

                    setServiceType(serviceResponse);
                } catch {
                    setServiceType(null);
                }
            }
        } catch (err) {
            console.error("Failed to load ticket:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load ticket details."
            );

            Swal.fire({
                icon: "error",
                title: "Unable to load ticket",
                text:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while loading the ticket.",
                confirmButtonColor: "#421DDB",
            });
        } finally {
            setLoading(false);
        }
    };

    const getUserByIdFromList = (
        userId: number | null | undefined
    ): User | null => {
        if (!userId) {
            return null;
        }

        return (
            users.find(
                (user) => Number(user.id) === Number(userId)
            ) || null
        );
    };

    const getServiceTypeName = (): string => {
        if (!serviceType) {
            return "Service";
        }

        const service = serviceType as ServiceType & {
            name?: string;
            serviceName?: string;
            title?: string;
            serviceTypeName?: string;
            description?: string;
        };

        return (
            service.name ||
            service.serviceName ||
            service.title ||
            service.serviceTypeName ||
            `Service Type #${ticket?.serviceTypeId ?? ""}`
        );
    };

    const formatDate = (
        value?: string | null,
        includeTime = true
    ): string => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            ...(includeTime
                ? {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }
                : {}),
        }).format(date);
    };

    const formatShortDate = (
        value?: string | null
    ): string => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    const formatStatus = (
        status?: string | null
    ): string => {
        if (!status) {
            return "Pending";
        }

        return status
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const normalizeStatus = (
        status?: string | null
    ): string => {
        return (status || "")
            .toLowerCase()
            .replace(/[\s_-]/g, "");
    };

    const getJobUser = (
        job: Job
    ): User | null => {
        return getUserByIdFromList(job.userId);
    };

    const getPriority = (): string => {
        if (!jobs.length) {
            return "Normal";
        }

        const priorities = jobs.map((job) =>
            (job.priority || "").toLowerCase()
        );

        if (priorities.includes("urgent")) {
            return "Urgent";
        }

        if (priorities.includes("high")) {
            return "High";
        }

        if (priorities.includes("medium")) {
            return "Medium";
        }

        if (priorities.includes("low")) {
            return "Low";
        }

        return jobs[0]?.priority || "Normal";
    };

    const getTicketStatus = (): string => {
        if (!jobs.length) {
            return "Open";
        }

        const statuses = jobs.map((job) =>
            normalizeStatus(job.status)
        );

        if (
            statuses.every(
                (status) =>
                    status === "completed" ||
                    status === "closed"
            )
        ) {
            return "Completed";
        }

        if (
            statuses.some(
                (status) =>
                    status === "inprogress" ||
                    status === "dispatched" ||
                    status === "assigned"
            )
        ) {
            return "In Progress";
        }

        if (
            statuses.some(
                (status) =>
                    status === "pending" ||
                    status === "open"
            )
        ) {
            return "Open";
        }

        return jobs[0]?.status || "Open";
    };

    const ticketStatus = useMemo(
        () => getTicketStatus(),
        [jobs]
    );

    const priority = useMemo(
        () => getPriority(),
        [jobs]
    );

    const statusClass = useMemo(() => {
        const status = normalizeStatus(ticketStatus);

        if (
            status === "completed" ||
            status === "closed"
        ) {
            return "tickets-view-badge-completed";
        }

        if (
            status === "inprogress" ||
            status === "dispatched"
        ) {
            return "tickets-view-badge-progress";
        }

        return "tickets-view-badge-progress";
    }, [ticketStatus]);

    const timeline = useMemo<TimelineItem[]>(() => {
        const items: TimelineItem[] = [];

        if (!ticket) {
            return items;
        }

        items.push({
            step: "Step 1",
            title: "Ticket Created",
            description:
                ticket.ticketNote ||
                "Ticket was created and registered in the service management system.",
            time: formatDate(ticket.createdAt),
            status: "completed",
        });

        if (!jobs.length) {
            items.push({
                step: "Step 2",
                title: "Waiting for Job",
                description:
                    "No job has been created for this ticket yet.",
                time: "Pending",
                status: "active",
            });

            return items;
        }

        const sortedJobs = [...jobs].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );

        sortedJobs.forEach((job, index) => {
            const jobUser = getJobUser(job);
            const normalized = normalizeStatus(job.status);

            let status: TimelineStatus = "pending";

            if (
                normalized === "completed" ||
                normalized === "closed"
            ) {
                status = "completed";
            } else if (
                normalized === "inprogress" ||
                normalized === "dispatched" ||
                normalized === "assigned"
            ) {
                status = "active";
            } else if (
                normalized === "pending" ||
                normalized === "open"
            ) {
                status = "active";
            }

            items.push({
                step: `Step ${index + 2}`,
                title: job.jobTitle || "Job",
                description:
                    job.jobDescription ||
                    (jobUser
                        ? `Assigned to ${jobUser.name}.`
                        : "Job has not been assigned to a technician yet."),
                time:
                    status === "pending"
                        ? "Pending"
                        : formatDate(
                            job.updatedAt ||
                            job.createdAt
                        ),
                status,
            });
        });

        return items;
    }, [ticket, jobs, users]);

    const assignedUsers = useMemo(() => {
        const uniqueIds = new Set<number>();

        jobs.forEach((job) => {
            if (job.userId) {
                uniqueIds.add(Number(job.userId));
            }
        });

        return Array.from(uniqueIds)
            .map((id) =>
                users.find(
                    (user) =>
                        Number(user.id) === id
                )
            )
            .filter(
                (user): user is User =>
                    Boolean(user)
            );
    }, [jobs, users]);

    const totalJobs = jobs.length;

    const completedJobs = jobs.filter((job) => {
        const status = normalizeStatus(job.status);

        return (
            status === "completed" ||
            status === "closed"
        );
    }).length;

    const activeJobs = jobs.filter((job) => {
        const status = normalizeStatus(job.status);

        return (
            status === "inprogress" ||
            status === "dispatched" ||
            status === "assigned"
        );
    }).length;

    const getInitials = (
        name?: string | null
    ): string => {
        if (!name) {
            return "—";
        }

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!parts.length) {
            return "—";
        }

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    };

    const handleEditTicket = () => {
        if (!ticket) {
            return;
        }

        router.push(
            `/tickets/add?id=${ticket.id}&mode=edit`
        );
    };

    const handleCreateJob = () => {
        if (!ticket) {
            return;
        }

        router.push(
            `/add-job`
        );
    };

    const handleViewJob = (
        job: Job
    ) => {
        router.push(
            `/jobs/view?id=${job.id}`
        );
    };

    const handlePostNote = async () => {
        if (!note.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Note is empty",
                text: "Please enter a note before posting.",
                timer: 1800,
                showConfirmButton: false,
            });

            return;
        }

        Swal.fire({
            icon: "info",
            title: "Internal notes API not available",
            text:
                "The current API set does not contain an endpoint for saving ticket notes.",
            confirmButtonColor: "#421DDB",
        });
    };

    if (loading) {
        return (
            <div className="tickets-view-page">
                <div
                    style={{
                        minHeight: "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <strong>
                        Loading ticket details...
                    </strong>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="tickets-view-page">
                <div
                    style={{
                        minHeight: "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <i
                        className="bi bi-ticket-perforated"
                        style={{
                            fontSize: "48px",
                        }}
                    ></i>

                    <h2>
                        Ticket Not Found
                    </h2>

                    <p>
                        {error ||
                            "The requested ticket could not be found."}
                    </p>

                    <button
                        className="tickets-view-create-job"
                        onClick={() => {
                            localStorage.removeItem("ticket_id");
                            router.push("/tickets");
                        }}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="tickets-view-page">

            <header className="tickets-view-header">

                <div className="tickets-view-header-left">

                    <div className="tickets-view-header-icon">
                        <i className="bi bi-ticket-detailed"></i>
                    </div>

                    <div>
                        <h1>
                            Ticket Details{" "}
                            <span>
                                #{ticket.ticketId}
                            </span>
                        </h1>

                        <p>
                            Service Ticket Details -
                            Customer, Jobs & History
                        </p>
                    </div>

                </div>

                <div className="tickets-view-header-right">

                    <div className="tickets-view-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search tickets, jobs, parts, serial numbers..."
                        />
                    </div>

                    <button className="tickets-view-icon-button">
                        <i className="bi bi-bell"></i>

                        <span className="tickets-view-notification-dot"></span>
                    </button>

                    <div className="tickets-view-user">

                        <div className="tickets-view-log-avatar">
                            {getInitials(
                                ticket.createdBy ||
                                "Admin"
                            )}
                        </div>

                        <div>
                            <strong>
                                {ticket.createdBy ||
                                    "Admin"}
                            </strong>

                            <span>
                                Ticket Creator
                            </span>
                        </div>

                        <i className="bi bi-chevron-down"></i>

                    </div>

                </div>

            </header>

            <div className="tickets-view-action-bar">

                <div className="tickets-view-actions">

                    <span
                        className={`tickets-view-badge ${statusClass}`}
                    >
                        <span></span>
                        {ticketStatus}
                    </span>

                    <span className="tickets-view-badge tickets-view-badge-priority">
                        <span></span>
                        {formatStatus(priority)} Priority
                    </span>

                    <button
                        className="tickets-view-action-button"
                        onClick={() => window.print()}
                    >
                        <i className="bi bi-printer"></i>
                        Print Work Order
                    </button>

                    <button
                        className="tickets-view-action-button"
                        onClick={handleEditTicket}
                    >
                        <i className="bi bi-pencil"></i>
                        Edit Ticket
                    </button>

                    <button
                        className="tickets-view-create-job"
                        onClick={handleCreateJob}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Create Job
                    </button>

                </div>

            </div>

            <main className="tickets-view-content">

                <div className="tickets-view-grid">

                    <section className="tickets-view-main-column">

                  

                        <div className="tickets-view-card tickets-view-ticket-card">

                            <div className="tickets-view-ticket-top">

                                <div className="tickets-view-ticket-heading">

                                    <div className="tickets-view-category-row">

                                        <span className="tickets-view-category">
                                            {getServiceTypeName()}
                                        </span>

                                        <span className="tickets-view-emergency">
                                            {formatStatus(priority)} Priority
                                        </span>

                                        <span className="tickets-view-telemetry">
                                            <i className="bi bi-ticket"></i>
                                            Ticket: #{ticket.ticketId}
                                        </span>

                                    </div>

                                    <h2>
                                        {ticket.ticketNote ||
                                            "Service request"}
                                    </h2>

                                </div>

                                <div className="tickets-view-reported">

                                    <span>
                                        Reported on
                                    </span>

                                    <strong>
                                        {formatDate(
                                            ticket.createdAt
                                        )}
                                    </strong>

                                    <small>
                                        by{" "}
                                        <b>
                                            {ticket.createdBy ||
                                                "System"}
                                        </b>
                                    </small>

                                </div>

                            </div>

                            <div className="tickets-view-divider"></div>

                            <div className="tickets-view-section-title">

                                <i className="bi bi-activity"></i>

                                Issue Description

                            </div>

                            <div className="tickets-view-description">

                                {ticket.ticketNote ||
                                    "No ticket description has been added."}

                            </div>

                            <div className="tickets-view-info-grid">

                                <div className="tickets-view-info-box">

                                    <span>
                                        Service Type
                                    </span>

                                    <strong>
                                        {getServiceTypeName()}
                                    </strong>

                                    <small>
                                        Service Type ID:{" "}
                                        {ticket.serviceTypeId}
                                    </small>

                                </div>

                                <div className="tickets-view-info-box">

                                    <span>
                                        Ticket Status
                                    </span>

                                    <strong>
                                        {ticketStatus}
                                    </strong>

                                    <small>
                                        {totalJobs} linked job
                                        {totalJobs !== 1
                                            ? "s"
                                            : ""}
                                    </small>

                                </div>

                                <div className="tickets-view-info-box">

                                    <span>
                                        Job Progress
                                    </span>

                                    <strong>
                                        {completedJobs} /{" "}
                                        {totalJobs} completed
                                    </strong>

                                    <small>
                                        {activeJobs} active job
                                        {activeJobs !== 1
                                            ? "s"
                                            : ""}
                                    </small>

                                </div>

                            </div>

                        </div>

                

                        <div className="tickets-view-card tickets-view-timeline-card">

                            <div className="tickets-view-card-header">

                                <div>

                                    <h3>
                                        Activity & Resolution Timeline
                                    </h3>

                                    <p>
                                        Live progress generated from
                                        ticket and job activity
                                    </p>

                                </div>

                                <span className="tickets-view-live-badge">

                                    <i className="bi bi-broadcast"></i>

                                    Ticket Activity

                                </span>

                            </div>

                            <div className="tickets-view-timeline">

                                {timeline.map(
                                    (item, index) => (
                                        <div
                                            className={`tickets-view-timeline-item tickets-view-timeline-${item.status}`}
                                            key={`${item.step}-${item.title}`}
                                        >

                                            <div className="tickets-view-timeline-marker">

                                                {item.status ===
                                                    "completed" && (
                                                        <i className="bi bi-check-lg"></i>
                                                    )}

                                                {item.status ===
                                                    "active" && (
                                                        <i className="bi bi-person-fill"></i>
                                                    )}

                                                {item.status ===
                                                    "pending" && (
                                                        <span></span>
                                                    )}

                                            </div>

                                            {index !==
                                                timeline.length - 1 && (
                                                    <div className="tickets-view-timeline-line"></div>
                                                )}

                                            <div className="tickets-view-timeline-content">

                                                <div className="tickets-view-timeline-heading">

                                                    <strong>
                                                        {item.step}:{" "}
                                                        {item.title}
                                                    </strong>

                                                    <span>
                                                        {item.time}
                                                    </span>

                                                </div>

                                                <p>
                                                    {item.description}
                                                </p>

                                                {item.status ===
                                                    "active" &&
                                                    item.title
                                                        .toLowerCase()
                                                        .includes(
                                                            "job"
                                                        ) && (
                                                        <div className="tickets-view-eta">
                                                            <i className="bi bi-person"></i>
                                                            Job currently active
                                                        </div>
                                                    )}

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>


                        <div className="tickets-view-card">

                            <div className="tickets-view-card-header">

                                <div>

                                    <h3>
                                        Job & Dispatch History
                                    </h3>

                                    <p>
                                        All jobs linked to this
                                        service ticket
                                    </p>

                                </div>

                                <button
                                    className="tickets-view-small-button"
                                    onClick={handleCreateJob}
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    Create Job
                                </button>

                            </div>

                            {jobs.length === 0 ? (
                                <div
                                    style={{
                                        padding: "40px",
                                        textAlign: "center",
                                    }}
                                >
                                    <i
                                        className="bi bi-briefcase"
                                        style={{
                                            fontSize: "36px",
                                        }}
                                    ></i>

                                    <h4>
                                        No jobs linked
                                    </h4>

                                    <p>
                                        Create a job to start
                                        working on this ticket.
                                    </p>
                                </div>
                            ) : (
                                <div className="tickets-view-table-wrapper">

                                    <table className="tickets-view-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    JOB ID & SERVICE SCOPE
                                                </th>

                                                <th>
                                                    ASSIGNED CREW
                                                </th>

                                                <th>
                                                    CREATED / EXPECTED
                                                </th>

                                                <th>
                                                    STATUS
                                                </th>

                                                <th>
                                                    ACTION
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {jobs.map(
                                                (job) => {
                                                    const jobUser =
                                                        getJobUser(
                                                            job
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                job.id
                                                            }
                                                        >

                                                            <td>

                                                                <div className="tickets-view-job">

                                                                    <strong>
                                                                        #{job.jobId}
                                                                    </strong>

                                                                    <b>
                                                                        {
                                                                            job.jobTitle
                                                                        }
                                                                    </b>

                                                                    <span>
                                                                        {
                                                                            job.jobDescription ||
                                                                            "No job description"
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>

                                                            <td>

                                                                <div className="tickets-view-crew">

                                                                    {jobUser ? (
                                                                        <>
                                                                            <strong>
                                                                                {
                                                                                    jobUser.name
                                                                                }
                                                                            </strong>

                                                                            <span>
                                                                                {
                                                                                    jobUser.role
                                                                                }

                                                                                {jobUser.specialization
                                                                                    ? ` • ${jobUser.specialization}`
                                                                                    : ""}
                                                                            </span>

                                                                            {jobUser.technicianId && (
                                                                                <small>
                                                                                    Tech ID:{" "}
                                                                                    {
                                                                                        jobUser.technicianId
                                                                                    }
                                                                                </small>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <strong>
                                                                                Open Pool
                                                                            </strong>

                                                                            <span>
                                                                                No technician assigned
                                                                            </span>
                                                                        </>
                                                                    )}

                                                                </div>

                                                            </td>

                                                            <td>

                                                                <div className="tickets-view-crew">

                                                                    <strong>
                                                                        {
                                                                            formatDate(
                                                                                job.createdAt
                                                                            )
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        Expected:{" "}
                                                                        {
                                                                            job.expectedDate
                                                                                ? formatDate(
                                                                                    job.expectedDate
                                                                                )
                                                                                : "Not scheduled"
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={`tickets-view-job-status ${normalizeStatus(job.status) ===
                                                                        "completed" ||
                                                                        normalizeStatus(job.status) ===
                                                                        "closed"
                                                                        ? "tickets-view-status-completed"
                                                                        : "tickets-view-status-dispatched"
                                                                        }`}
                                                                >
                                                                    {formatStatus(
                                                                        job.status
                                                                    )}
                                                                </span>

                                                            </td>

                                                            <td>

                                                                <button
                                                                    className="tickets-view-view-job"
                                                                    onClick={() =>
                                                                        handleViewJob(
                                                                            job
                                                                        )
                                                                    }
                                                                >
                                                                    View Job

                                                                    <i className="bi bi-arrow-right"></i>

                                                                </button>

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    

                        <div className="tickets-view-card">

                            <div className="tickets-view-card-header">

                                <div>

                                    <h3>
                                        Technician History & Work Logs
                                    </h3>

                                    <p>
                                        Technicians currently or previously
                                        assigned to this ticket
                                    </p>

                                </div>

                                <span className="tickets-view-total-hours">

                                    Assigned Technicians:{" "}
                                    <strong>
                                        {assignedUsers.length}
                                    </strong>

                                </span>

                            </div>

                            <div className="tickets-view-work-logs">

                                {assignedUsers.length === 0 ? (

                                    <div
                                        style={{
                                            padding: "30px",
                                            textAlign: "center",
                                        }}
                                    >
                                        <i
                                            className="bi bi-person-x"
                                            style={{
                                                fontSize: "32px",
                                            }}
                                        ></i>

                                        <p>
                                            No technician has been
                                            assigned to the jobs yet.
                                        </p>
                                    </div>

                                ) : (

                                    assignedUsers.map(
                                        (user) => {

                                            const userJobs =
                                                jobs.filter(
                                                    (job) =>
                                                        Number(
                                                            job.userId
                                                        ) ===
                                                        Number(
                                                            user.id
                                                        )
                                                );

                                            return (
                                                <div
                                                    className="tickets-view-work-log"
                                                    key={user.id}
                                                >

                                                    <div className="tickets-view-log-avatar">

                                                        {getInitials(
                                                            user.name
                                                        )}

                                                    </div>

                                                    <div className="tickets-view-log-content">

                                                        <div className="tickets-view-log-top">

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        user.name
                                                                    }
                                                                </strong>

                                                                <span className="tickets-view-log-role">
                                                                    {
                                                                        user.role
                                                                    }
                                                                </span>

                                                                {user.specialization && (
                                                                    <span className="tickets-view-log-hours">
                                                                        •{" "}
                                                                        {
                                                                            user.specialization
                                                                        }
                                                                    </span>
                                                                )}

                                                            </div>

                                                            <span>
                                                                {
                                                                    userJobs.length
                                                                } job
                                                                {userJobs.length !==
                                                                    1
                                                                    ? "s"
                                                                    : ""}
                                                            </span>

                                                        </div>

                                                        <p>

                                                            {user.phone &&
                                                                `Phone: ${user.phone}. `}

                                                            {user.email &&
                                                                `Email: ${user.email}. `}

                                                            {user.technicianId &&
                                                                `Technician ID: ${user.technicianId}. `}

                                                            {userJobs
                                                                .map(
                                                                    (
                                                                        job
                                                                    ) =>
                                                                        job.jobTitle
                                                                )
                                                                .join(
                                                                    ", "
                                                                )}

                                                        </p>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )

                                )}

                            </div>

                        </div>

                   

                        <div className="tickets-view-card tickets-view-billing-card">

                            <div className="tickets-view-card-header">

                                <div>

                                    <h3>
                                        Ticket System Information
                                    </h3>

                                    <p>
                                        Record information from the
                                        ticket management system
                                    </p>

                                </div>

                            </div>

                            <div className="tickets-view-billing-list">

                                <div className="tickets-view-billing-row">

                                    <div>
                                        <strong>
                                            Ticket ID
                                        </strong>
                                    </div>
                                    <strong>
                                        #{ticket.ticketId}
                                    </strong>

                                </div>

                                <div className="tickets-view-billing-row">

                                    <div>

                                        <strong>
                                            Created
                                        </strong>

                                        <span>
                                            {ticket.createdBy
                                                ? `Created by ${ticket.createdBy}`
                                                : "Ticket creator not available"}
                                        </span>

                                    </div>

                                    <strong>
                                        {formatDate(
                                            ticket.createdAt
                                        )}
                                    </strong>

                                </div>

                                <div className="tickets-view-billing-row">

                                    <div>

                                        <strong>
                                            Last Updated
                                        </strong>

                                        <span>
                                            {ticket.updatedBy
                                                ? `Updated by ${ticket.updatedBy}`
                                                : "No updater information"}
                                        </span>

                                    </div>

                                    <strong>
                                        {formatDate(
                                            ticket.updatedAt
                                        )}
                                    </strong>

                                </div>




                            </div>

                        </div>

                    </section>


                    <aside className="tickets-view-sidebar">



                        <div className="tickets-view-card tickets-view-customer-card">

                            <div className="tickets-view-sidebar-title">

                                <div>

                                    <span>
                                        Customer Account
                                    </span>

                                    <h3>
                                        {customer?.name ||
                                            "Customer"}
                                    </h3>

                                </div>

                                <span className="tickets-view-commercial">
                                    Customer
                                </span>

                            </div>

                            <div className="tickets-view-customer-details">

                                <div>

                                    <span>
                                        Customer ID:
                                    </span>

                                    <strong>
                                        #{customer?.customerId}
                                    </strong>

                                </div>

                                

                                <div className="tickets-view-contact-block">

                                    <span>
                                        Primary Contact
                                    </span>

                                    <strong>
                                        {customer?.name ||
                                            "—"}
                                    </strong>

                                    {customer?.phone && (
                                        <a
                                            href={`tel:${customer.phone}`}
                                        >
                                            <i className="bi bi-telephone"></i>
                                            {customer.phone}
                                        </a>
                                    )}

                                </div>

                                <div className="tickets-view-contact-block">

                                    <span>
                                        Service Location
                                    </span>

                                    <strong>

                                        <i className="bi bi-geo-alt"></i>

                                        {customer?.address ||
                                            "Address not available"}

                                    </strong>

                                    {customer?.pincode && (
                                        <small>
                                            PIN Code:{" "}
                                            {
                                                customer.pincode
                                            }
                                        </small>
                                    )}

                                </div>

                                <div className="tickets-view-access-note">

                                    <strong>
                                        Ticket Service Information:
                                    </strong>

                                    <p>
                                        Service:{" "}
                                        {getServiceTypeName()}
                                        <br />
                                        Ticket: #
                                        {ticket.ticketId}
                                        <br />
                                        Jobs: {jobs.length}
                                    </p>

                                </div>

                            </div>

                        </div>

      

                        <div className="tickets-view-card">

                            <div className="tickets-view-card-header">

                                <div>

                                    <h3>
                                        Assigned Technicians
                                    </h3>

                                    <p>
                                        Users assigned to this ticket's jobs
                                    </p>

                                </div>

                            </div>

                            <div
                                style={{
                                    padding: "0 20px 20px",
                                }}
                            >

                                {assignedUsers.length === 0 ? (

                                    <div
                                        style={{
                                            padding:
                                                "20px 0",
                                            textAlign:
                                                "center",
                                        }}
                                    >

                                        <i className="bi bi-person-plus"></i>

                                        <p>
                                            No technician assigned
                                        </p>

                                    </div>

                                ) : (

                                    assignedUsers.map(
                                        (user) => (
                                            <div
                                                key={user.id}
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: "12px",
                                                    padding:
                                                        "12px 0",
                                                    borderBottom:
                                                        "1px solid #eee",
                                                }}
                                            >

                                                <div className="tickets-view-log-avatar">
                                                    {getInitials(
                                                        user.name
                                                    )}
                                                </div>

                                                <div
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >

                                                    <strong>
                                                        {
                                                            user.name
                                                        }
                                                    </strong>

                                                    <div>
                                                        <small>
                                                            {
                                                                user.role
                                                            }

                                                            {user.technicianId
                                                                ? ` • ${user.technicianId}`
                                                                : ""}
                                                        </small>
                                                    </div>

                                                    {user.specialization && (
                                                        <small>
                                                            {
                                                                user.specialization
                                                            }
                                                        </small>
                                                    )}

                                                </div>

                                            </div>
                                        )
                                    )

                                )}

                            </div>

                        </div>

      

                        <div className="tickets-view-card tickets-view-note-card">

                            <div className="tickets-view-note-header">

                                <div>

                                    <span>
                                        Quick Dispatch Note
                                    </span>

                                    <h3>
                                        Post an internal note
                                    </h3>

                                </div>

                                <i className="bi bi-sticky"></i>

                            </div>

                            <textarea
                                value={note}
                                onChange={(event) =>
                                    setNote(
                                        event.target.value
                                    )
                                }
                                placeholder="Post internal safety advisory, gate clearance code, or status note..."
                            ></textarea>

                            <div className="tickets-view-note-footer">

                                <div>

                                    <button type="button">
                                        <i className="bi bi-paperclip"></i>
                                    </button>

                                    <button type="button">
                                        <i className="bi bi-flag"></i>
                                    </button>

                                </div>

                                <button
                                    className="tickets-view-post-note"
                                    onClick={
                                        handlePostNote
                                    }
                                >
                                    Post Note
                                </button>

                            </div>

                        </div>

           
                        <div className="tickets-view-card">

                            <div className="tickets-view-card-header">

                                <div>

                                    <h3>
                                        Ticket Information
                                    </h3>

                                </div>

                            </div>

                            <div
                                className="tickets-view-customer-details"
                                style={{
                                    padding:
                                        "0 20px 20px",
                                }}
                            >

                                <div>

                                    <span>
                                        Ticket Database ID
                                    </span>

                                    <strong>
                                        {ticket.id}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Ticket Number
                                    </span>

                                    <strong>
                                        #{ticket.ticketId}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Current Status
                                    </span>

                                    <strong>
                                        {ticketStatus}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Priority
                                    </span>

                                    <strong>
                                        {formatStatus(
                                            priority
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatShortDate(
                                            ticket.createdAt
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}