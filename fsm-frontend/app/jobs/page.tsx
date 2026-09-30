"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./jobs.css";

import {
    getAllJobs,
    Job as ApiJob,
    deleteJob,
    updateJob,
} from "../apiservice/jobservice";

import {
    getAllUsers,
    User,
} from "../apiservice/userservice";

import {
    Customer,
    getAllCustomers,
} from "../apiservice/customersservice";

import {
    getTicketById as fetchTicketById,
    getAllTickets,
    Ticket,
} from "../apiservice/ticketservice";

import { useRouter } from "next/navigation";

interface Job {
    id: number;
    jobNumber: string;
    ticketId: number;
    customer: string;
    customerId: number;
    technician: string;
    technicianId: string;
    technicianAvatar: string;
    userId: number | null;
    date: string;
    time: string;
    title: string;
    description: string;
    status:
    | "Pending"
    | "In-Progress"
    | "Completed"
    | "Closed";
    priority: string;
}

const getStatusClass = (status: Job["status"]) => {
    switch (status) {
        case "Pending":
            return "jobs-table-status-pending";

        case "In-Progress":
            return "jobs-table-status-progress";

        case "Completed":
            return "jobs-table-status-completed";

        case "Closed":
            return "jobs-table-status-closed";

        default:
            return "";
    }
};

const normalizeStatus = (
    status: string | null | undefined
): Job["status"] => {
    if (!status) {
        return "Pending";
    }

    const value = status
        .trim()
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-");

    switch (value) {
        case "pending":
        case "open":
        case "assigned":
            return "Pending";

        case "in-progress":
        case "inprogress":
        case "in-progress-job":
        case "accepted":
        case "working":
            return "In-Progress";

        case "completed":
            return "Completed";

        case "closed":
            return "Closed";

        default:
            return "Pending";
    }
};


const normalizePriority = (
    priority: string | null | undefined
) => {
    if (!priority) {
        return "Medium";
    }

    const value = priority
        .trim()
        .toLowerCase();

    switch (value) {
        case "low":
            return "Low";

        case "medium":
        case "med":
            return "Medium";

        case "high":
            return "High";

        case "urgent":
        case "critical":
            return "Urgent";

        default:
            return "Medium";
    }
};

const formatDate = (dateValue: string | null) => {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (dateValue: string | null) => {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getJobNumber = (job: ApiJob) => {
    return (
        job.jobId ||
        `JB-${String(job.id).padStart(5, "0")}`
    );
};

const getDateInputValue = (
    dateValue: string | null | undefined
) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getTimeInputValue = (
    dateValue: string | null | undefined
) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const hours = String(
        date.getHours()
    ).padStart(2, "0");

    const minutes = String(
        date.getMinutes()
    ).padStart(2, "0");

    return `${hours}:${minutes}`;
};

function Jobs() {
    const router = useRouter();

    const [activeStatus, setActiveStatus] =
        useState("All Jobs");

    const [jobs, setJobs] =
        useState<Job[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [isAddJobOpen, setIsAddJobOpen] =
        useState(false);

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [technicians, setTechnicians] =
        useState<User[]>([]);

    const [ticketLoading, setTicketLoading] =
        useState(false);

    const [ticketSearch, setTicketSearch] =
        useState("");



    const [isEditJobOpen, setIsEditJobOpen] =
        useState(false);

    const [editingJob, setEditingJob] =
        useState<Job | null>(null);

    const [editLoading, setEditLoading] =
        useState(false);

  
     

    const [editTicketId, setEditTicketId] =
        useState<number | null>(null);

    const [editUserId, setEditUserId] =
        useState<number | null>(null);

    const [editJobTitle, setEditJobTitle] =
        useState("");

    const [editDescription, setEditDescription] =
        useState("");

    const [editPriority, setEditPriority] =
        useState("Medium");

    const [editStatus, setEditStatus] =
        useState<Job["status"]>("Pending");

    const [editDate, setEditDate] =
        useState("");

    const [editTime, setEditTime] =
        useState("");

    const [editTicketSearch, setEditTicketSearch] =
        useState("");



    const getJobTicket = async (
        ticketId: number
    ): Promise<Ticket | null> => {
        try {
            const ticket =
                await fetchTicketById({
                    id: ticketId,
                });

            return ticket || null;
        } catch (error) {
            console.error(
                `Failed to load ticket ${ticketId}:`,
                error
            );

            return null;
        }
    };


    const loadJobs = async () => {
        try {
            setLoading(true);

            const [
                jobsResponse,
                customersResponse,
                usersResponse,
            ] = await Promise.all([
                getAllJobs(),
                getAllCustomers(),
                getAllUsers(),
            ]);

            const jobsData: ApiJob[] =
                jobsResponse || [];

            const customersData: Customer[] =
                customersResponse || [];

            const users: User[] =
                usersResponse || [];

            setCustomers(customersData);

            const technicianUsers =
                users.filter(
                    (user) =>
                        user.role
                            ?.trim()
                            .toUpperCase() ===
                        "TECHNICIAN"
                );

            setTechnicians(
                technicianUsers
            );

            const mappedJobs: Job[] =
                await Promise.all(
                    jobsData.map(
                        async (job) => {
                            let ticket:
                                | Ticket
                                | null = null;

                            let customer:
                                | Customer
                                | null = null;

                            if (job.ticketId) {
                                ticket =
                                    await getJobTicket(
                                        job.ticketId
                                    );

                                if (
                                    ticket?.customerId
                                ) {
                                    customer =
                                        customersData.find(
                                            (
                                                item
                                            ) =>
                                                item.id ===
                                                ticket!.customerId
                                        ) ||
                                        null;
                                }
                            }

                            const technician =
                                technicianUsers.find(
                                    (user) =>
                                        user.id ===
                                        job.userId
                                );

                            const customerId =
                                ticket?.customerId ||
                                0;

                            return {
                                id: job.id,

                                jobNumber:
                                    getJobNumber(
                                        job
                                    ),

                                ticketId:
                                    job.ticketId,

                                customer:
                                    customer?.name ||
                                    (customerId
                                        ? `Customer #${customerId}`
                                        : "Customer not found"),

                                customerId,

                                userId:
                                    job.userId,

                                technician:
                                    technician?.name ||
                                    (job.userId
                                        ? `User #${job.userId}`
                                        : "Open Pool"),

                                technicianId:
                                    technician?.technicianId ||
                                    (job.userId
                                        ? String(
                                            job.userId
                                        )
                                        : "-"),

                                technicianAvatar:
                                    "/avatar.png",

                                date:
                                    formatDate(
                                        job.expectedDate
                                    ),

                                time:
                                    formatTime(
                                        job.expectedDate
                                    ),

                                title:
                                    job.jobTitle ||
                                    "Service Job",

                                description:
                                    job.jobDescription ||
                                    "No description provided.",

                                status:
                                    normalizeStatus(
                                        job.status
                                    ),

                                priority:
                                    job.priority ||
                                    "Medium",
                            };
                        }
                    )
                );

            setJobs(mappedJobs);
        } catch (error) {
            console.error(
                "Failed to load jobs:",
                error
            );

            setJobs([]);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to load jobs",
                text:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                showConfirmButton: false,
                timer: 2500,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);




    const loadTickets = async () => {
        try {
            setTicketLoading(true);

            const [
                ticketsResponse,
                customersResponse,
                usersResponse,
            ] = await Promise.all([
                getAllTickets(),
                getAllCustomers(),
                getAllUsers(),
            ]);

            setTickets(
                ticketsResponse || []
            );

            setCustomers(
                customersResponse || []
            );

            const technicianUsers =
                (usersResponse || []).filter(
                    (user) =>
                        user.role
                            ?.trim()
                            .toUpperCase() ===
                        "TECHNICIAN"
                );

            setTechnicians(
                technicianUsers
            );
        } catch (error) {
            console.error(
                "Failed to load tickets:",
                error
            );

            setTickets([]);
            setCustomers([]);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to load tickets",
                text:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                showConfirmButton: false,
                timer: 2500,
            });
        } finally {
            setTicketLoading(false);
        }
    };

    const openAddJobModal = async () => {
        setIsAddJobOpen(true);
        setTicketSearch("");

        await loadTickets();
    };

    const closeAddJobModal = () => {
        setIsAddJobOpen(false);
        setTicketSearch("");
    };

    const getCustomer = (
        customerId: number
    ) => {
        return customers.find(
            (customer) =>
                customer.id === customerId
        );
    };


    const filteredTickets = useMemo(() => {
        const value =
            ticketSearch
                .toLowerCase()
                .trim();

        if (!value) {
            return tickets;
        }

        return tickets.filter(
            (ticket) => {
                const customer =
                    getCustomer(
                        ticket.customerId
                    );

                return (
                    String(ticket.id)
                        .toLowerCase()
                        .includes(value) ||

                    String(
                        ticket.ticketId ||
                        ""
                    )
                        .toLowerCase()
                        .includes(value) ||

                    String(
                        ticket.serviceTypeId
                    )
                        .toLowerCase()
                        .includes(value) ||

                    (
                        ticket.ticketNote ||
                        ""
                    )
                        .toLowerCase()
                        .includes(value) ||

                    (
                        customer?.name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(value) ||

                    (
                        customer?.phone ||
                        ""
                    )
                        .toLowerCase()
                        .includes(value)
                );
            }
        );
    }, [
        tickets,
        customers,
        ticketSearch,
    ]);



    const handleSelectTicket = (
        ticket: Ticket
    ) => {
        if (!ticket.id) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Invalid ticket",
                showConfirmButton: false,
                timer: 1800,
            });

            return;
        }

        if (!ticket.customerId) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Customer not found",
                text:
                    "This ticket does not have a customer assigned.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

        localStorage.setItem(
            "add_job_ticket_id",
            String(ticket.id)
        );

        closeAddJobModal();

        router.push(
            "/add-ticket?mode=create-job"
        );
    };



    const handleEdit = async (
        job: Job
    ) => {
        try {
            setEditLoading(true);
            const jobsResponse =
                await getAllJobs();

            const originalJob =
                (jobsResponse || []).find(
                    (item) =>
                        item.id === job.id
                );

            if (!originalJob) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Job not found",
                    showConfirmButton: false,
                    timer: 2000,
                });

                return;
            }


            setEditUserId(
                originalJob.userId ||
                null
            );


            setEditTicketId(
                originalJob.ticketId ||
                null
            );

            setEditJobTitle(
                originalJob.jobTitle ||
                ""
            );


            setEditPriority(
                normalizePriority(
                    originalJob.priority
                )
            );
            setEditDate(
                getDateInputValue(
                    originalJob.expectedDate
                )
            );

            setEditTime(
                getTimeInputValue(
                    originalJob.expectedDate
                )
            );

           
            setEditDescription(
                originalJob.jobDescription ||
                ""
            );

       
            setEditStatus(
                normalizeStatus(
                    originalJob.status
                )
            );

        

            setEditingJob({
                id: originalJob.id,

                jobNumber:
                    getJobNumber(
                        originalJob
                    ),

                ticketId:
                    originalJob.ticketId,

                customer:
                    job.customer,

                customerId:
                    job.customerId,

                technician:
                    job.technician,

                technicianId:
                    job.technicianId,

                technicianAvatar:
                    job.technicianAvatar,

                userId:
                    originalJob.userId,

                date:
                    formatDate(
                        originalJob.expectedDate
                    ),

                time:
                    formatTime(
                        originalJob.expectedDate
                    ),

                title:
                    originalJob.jobTitle,

                description:
                    originalJob.jobDescription ||
                    "No description provided.",

                status:
                    normalizeStatus(
                        originalJob.status
                    ),

                priority:
                    normalizePriority(
                        originalJob.priority
                    ),
            });

            setEditTicketSearch("");

            await loadTickets();

            setIsEditJobOpen(true);
        } catch (error) {
            console.error(
                "Failed to load job details:",
                error
            );

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title:
                    "Failed to load job",
                text:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                showConfirmButton: false,
                timer: 2500,
            });
        } finally {
            setEditLoading(false);
        }
    };




    const closeEditJobModal = () => {
        if (editLoading) {
            return;
        }

        setIsEditJobOpen(false);

        setEditingJob(null);

        setEditTicketId(null);
        setEditUserId(null);
        setEditJobTitle("");
        setEditDescription("");
        setEditPriority("Medium");
        setEditStatus("Pending");
        setEditDate("");
        setEditTime("");
        setEditTicketSearch("");
    };



    const filteredEditTickets =
        useMemo(() => {
            const value =
                editTicketSearch
                    .toLowerCase()
                    .trim();

            if (!value) {
                return tickets;
            }

            return tickets.filter(
                (ticket) => {
                    const customer =
                        getCustomer(
                            ticket.customerId
                        );

                    return (
                        String(
                            ticket.id
                        )
                            .toLowerCase()
                            .includes(value) ||

                        String(
                            ticket.ticketId ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value) ||

                        (
                            customer?.name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value) ||

                        (
                            customer?.phone ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value) ||

                        (
                            ticket.ticketNote ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value)
                    );
                }
            );
        }, [
            tickets,
            customers,
            editTicketSearch,
        ]);



    const handleEditTicketSelect = (
        ticket: Ticket
    ) => {
        if (!ticket.id) {
            return;
        }


        setEditTicketId(
            ticket.id
        );

        setEditTicketSearch("");
    };



    const handleUpdateJob = async () => {
        if (!editingJob) {
            return;
        }


        if (!editTicketId) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Select a ticket",
                text:
                    "Please select a ticket for this job.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

       
        if (!editJobTitle.trim()) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Job title required",
                text:
                    "Please enter the job title.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

  
        if (!editDate) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Date required",
                text:
                    "Please select the scheduled date.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

        if (!editTime) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Time required",
                text:
                    "Please select the scheduled time.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

        const selectedTicket =
            tickets.find(
                (ticket) =>
                    ticket.id ===
                    editTicketId
            );

        if (!selectedTicket) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Ticket not found",
                text:
                    "Please select a valid ticket.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

        if (!selectedTicket.customerId) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Customer not found",
                text:
                    "The selected ticket does not have a customer.",
                showConfirmButton: false,
                timer: 2200,
            });

            return;
        }

        try {
            setEditLoading(true);

           
            const expectedDate =
                `${editDate}T${editTime}:00`;

            const updatedBy =
                sessionStorage.getItem(
                    "user_phone"
                ) || "Admin";

            await updateJob({
                id: editingJob.id,

                userId:
                    editUserId,

                ticketId:
                    selectedTicket.id,

                jobTitle:
                    editJobTitle.trim(),

                priority:
                    editPriority,

                expectedDate,

                jobDescription:
                    editDescription.trim() ||
                    null,

                status:
                    editStatus,

                updatedBy,
            });

            setIsEditJobOpen(false);
            setEditingJob(null);

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title:
                    "Job updated successfully",
                showConfirmButton: false,
                timer: 2000,
            });

            await loadJobs();
        } catch (error) {
            console.error(
                "Failed to update job:",
                error
            );

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title:
                    "Failed to update job",
                text:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                showConfirmButton: false,
                timer: 2500,
            });
        } finally {
            setEditLoading(false);
        }
    };



    const handleView = (
        job: Job
    ) => {
        localStorage.setItem(
            "job_id",
            String(job.id)
        );

        router.push("/job-view");
    };



    const handleDelete = async (
        job: Job
    ) => {
        const result =
            await Swal.fire({
                title: "Delete Job?",
                text: `Are you sure you want to delete ${job.jobNumber}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText:
                    "Delete",
                cancelButtonText:
                    "Cancel",
                confirmButtonColor:
                    "#d33",
                reverseButtons: true,
            });

        if (
            !result.isConfirmed
        ) {
            return;
        }

        try {
            setLoading(true);

            const deletedBy =
                sessionStorage.getItem(
                    "user_phone"
                ) || "Admin";

            await deleteJob({
                id: job.id,
                deletedBy,
            });

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title:
                    "Job deleted successfully",
                showConfirmButton:
                    false,
                timer: 2000,
            });

            await loadJobs();
        } catch (error) {
            console.error(
                "Failed to delete job:",
                error
            );

            setLoading(false);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title:
                    "Failed to delete job",
                text:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                showConfirmButton:
                    false,
                timer: 2500,
            });
        }
    };


    const filteredJobs =
        activeStatus === "All Jobs"
            ? jobs
            : jobs.filter(
                (job) =>
                    job.status ===
                    activeStatus
            );

    const pendingCount =
        useMemo(
            () =>
                jobs.filter(
                    (job) =>
                        job.status ===
                        "Pending"
                ).length,
            [jobs]
        );

    const progressCount =
        useMemo(
            () =>
                jobs.filter(
                    (job) =>
                        job.status ===
                        "In-Progress"
                ).length,
            [jobs]
        );

    const completedCount =
        useMemo(
            () =>
                jobs.filter(
                    (job) =>
                        job.status ===
                        "Completed"
                ).length,
            [jobs]
        );

    const closedCount =
        useMemo(
            () =>
                jobs.filter(
                    (job) =>
                        job.status ===
                        "Closed"
                ).length,
            [jobs]
        );

    const selectedEditTicket =
        tickets.find(
            (ticket) =>
                ticket.id ===
                editTicketId
        );

    const selectedEditCustomer =
        selectedEditTicket
            ? getCustomer(
                selectedEditTicket.customerId
            )
            : null;

    return (
        <>
            <div className="jobs-page">

                <div className="dashboard-header">

                    <div className="left-header-dashboard">
                        Jobs
                    </div>

                    <div className="right-header-dashboard">

                        <button
                            type="button"
                            onClick={
                                openAddJobModal
                            }
                        >
                            <span>
                                <i className="bi bi-plus-lg"></i>
                            </span>

                            New Job
                        </button>

                    </div>

                </div>

                <div className="jobs-page-container">

                    <div className="jobs-page-header">

                        <div className="jobs-header-content">

                            <div>

                                <h1 className="jobs-page-title">
                                    Service Jobs & Dispatch
                                </h1>

                                <p className="jobs-page-description">
                                    Manage scheduled service jobs,
                                    technician assignments, and job
                                    progress.
                                </p>

                            </div>

                        </div>

                        <div className="jobs-filter-area">

                            <button
                                type="button"
                                className={`jobs-filter-button ${activeStatus ===
                                    "All Jobs"
                                    ? "jobs-filter-active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setActiveStatus(
                                        "All Jobs"
                                    )
                                }
                            >
                                All Jobs

                                <span>
                                    {
                                        jobs.length
                                    }
                                </span>

                            </button>

                            <button
                                type="button"
                                className={`jobs-filter-button ${activeStatus ===
                                    "Pending"
                                    ? "jobs-filter-active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setActiveStatus(
                                        "Pending"
                                    )
                                }
                            >
                                Pending

                                <span>
                                    {
                                        pendingCount
                                    }
                                </span>

                            </button>

                            <button
                                type="button"
                                className={`jobs-filter-button ${activeStatus ===
                                    "In-Progress"
                                    ? "jobs-filter-active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setActiveStatus(
                                        "In-Progress"
                                    )
                                }
                            >
                                In Progress

                                <span>
                                    {
                                        progressCount
                                    }
                                </span>

                            </button>

                            <button
                                type="button"
                                className={`jobs-filter-button ${activeStatus ===
                                    "Completed"
                                    ? "jobs-filter-active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setActiveStatus(
                                        "Completed"
                                    )
                                }
                            >
                                Completed

                                <span>
                                    {
                                        completedCount
                                    }
                                </span>

                            </button>

                            <button
                                type="button"
                                className={`jobs-filter-button ${activeStatus ===
                                    "Closed"
                                    ? "jobs-filter-active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setActiveStatus(
                                        "Closed"
                                    )
                                }
                            >
                                Closed

                                <span>
                                    {
                                        closedCount
                                    }
                                </span>

                            </button>

                            <div className="jobs-status-summary">

                                <span className="jobs-summary-pending">
                                    <b></b>
                                    {
                                        pendingCount
                                    }{" "}
                                    Pending
                                </span>

                                <span className="jobs-summary-progress">
                                    <b></b>
                                    {
                                        progressCount
                                    }{" "}
                                    In Progress
                                </span>

                                <span className="jobs-summary-completed">
                                    <b></b>
                                    {
                                        completedCount
                                    }{" "}
                                    Completed
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="jobs-table-container">

                        <div className="jobs-table-scroll">

                            {loading ? (
                                <div className="jobs-empty-state">

                                    <i className="bi bi-hourglass-split"></i>

                                    <h3>
                                        Loading Jobs
                                    </h3>

                                    <p>
                                        Fetching service jobs...
                                    </p>

                                </div>
                            ) : (
                                <table className="jobs-data-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                JOB
                                                <br />
                                                & ID
                                            </th>

                                            <th>
                                                CUSTOMER
                                            </th>

                                            <th>
                                                TECHNICIAN
                                                <br />
                                                & ID
                                            </th>

                                            <th>
                                                SCHEDULE
                                            </th>

                                            <th>
                                                JOB DETAILS
                                            </th>

                                            <th>
                                                PRIORITY
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

                                        {filteredJobs.map(
                                            (
                                                job
                                            ) => (
                                                <tr
                                                    key={
                                                        job.id
                                                    }
                                                >

                                                    <td>

                                                        <div className="jobs-number-cell">

                                                            <strong>
                                                                #
                                                                {
                                                                    job.jobNumber
                                                                }
                                                            </strong>

                                                            <span>
                                                                Ticket #
                                                                {
                                                                    job.ticketId
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <div className="jobs-customer-cell">

                                                            <strong>
                                                                {
                                                                    job.customer
                                                                }
                                                            </strong>

                                                            <span>
                                                                Customer #
                                                                {
                                                                    job.customerId
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <div className="jobs-technician-cell">

                                                            {job.userId ? (
                                                                <img
                                                                    src={
                                                                        job.technicianAvatar
                                                                    }
                                                                    alt={
                                                                        job.technician
                                                                    }
                                                                    className="jobs-technician-avatar"
                                                                />
                                                            ) : (
                                                                <div className="jobs-technician-avatar">
                                                                    <i className="bi bi-people"></i>
                                                                </div>
                                                            )}

                                                            <div className="jobs-technician-info">

                                                                <strong>
                                                                    {
                                                                        job.technician
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {job.userId
                                                                        ? `#${job.technicianId}`
                                                                        : "Unassigned"}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <div className="jobs-schedule-cell">

                                                            <div>

                                                                <i className="bi bi-calendar3"></i>

                                                                <span>
                                                                    {
                                                                        job.date
                                                                    }
                                                                </span>

                                                            </div>

                                                            <div>

                                                                <i className="bi bi-clock"></i>

                                                                <span>
                                                                    {
                                                                        job.time
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <div className="jobs-details-cell">

                                                            <strong>
                                                                {
                                                                    job.title
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    job.description
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <span

                                                        >

                                                            <b></b>

                                                            {
                                                                job.priority
                                                            }

                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`jobs-status-badge ${getStatusClass(
                                                                job.status
                                                            )}`}
                                                        >

                                                            <b></b>

                                                            {
                                                                job.status
                                                            }

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="jobs-action-buttons">

                                                            <button
                                                                type="button"
                                                                className="jobs-action-button jobs-action-view"
                                                                title="View Job"
                                                                onClick={() =>
                                                                    handleView(
                                                                        job
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="jobs-action-button jobs-action-edit"
                                                                title="Edit Job"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        job
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="jobs-action-button jobs-action-delete"
                                                                title="Delete Job"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        job
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>
                            )}

                        </div>

                        {!loading &&
                            filteredJobs.length ===
                            0 && (
                                <div className="jobs-empty-state">

                                    <i className="bi bi-clipboard-x"></i>

                                    <h3>
                                        No Jobs Found
                                    </h3>

                                    <p>
                                        No jobs are available
                                        for this status.
                                    </p>

                                </div>
                            )}

                        {!loading &&
                            filteredJobs.length >
                            0 && (
                                <div className="jobs-table-footer">

                                    <span>
                                        Showing{" "}
                                        <strong>
                                            1-
                                            {
                                                filteredJobs.length
                                            }
                                        </strong>{" "}
                                        of{" "}
                                        <strong>
                                            {
                                                jobs.length
                                            }
                                        </strong>{" "}
                                        jobs
                                    </span>

                                    <div className="jobs-pagination">

                                        <button
                                            type="button"
                                            disabled
                                        >
                                            Previous
                                        </button>

                                        <button
                                            type="button"
                                            className="jobs-pagination-active"
                                        >
                                            1
                                        </button>

                                        <button
                                            type="button"
                                            disabled
                                        >
                                            Next
                                        </button>

                                    </div>

                                </div>
                            )}

                    </div>

                </div>

            </div>



            {isAddJobOpen && (
                <div
                    className="jobs-add-job-overlay"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeAddJobModal();
                        }
                    }}
                >

                    <div className="jobs-add-job-modal">

                        <div className="jobs-add-job-modal-header">

                            <div className="jobs-add-job-modal-title">

                                <div className="jobs-add-job-modal-icon">
                                    <i className="bi bi-briefcase"></i>
                                </div>

                                <div>

                                    <h2>
                                        Create New Job
                                    </h2>

                                    <p>
                                        Select an existing ticket
                                        to create a service job.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="jobs-add-job-close"
                                onClick={
                                    closeAddJobModal
                                }
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <div className="jobs-add-job-modal-body">

                            <div className="jobs-add-job-section-header">

                                <div className="jobs-add-job-section-icon">
                                    <i className="bi bi-ticket-perforated"></i>
                                </div>

                                <div>

                                    <h3>
                                        Select Ticket
                                    </h3>

                                    <p>
                                        Choose the ticket for which
                                        you want to create a job.
                                    </p>

                                </div>

                            </div>

                            <div className="jobs-add-job-search-wrapper">

                                <i className="bi bi-search"></i>

                                <input
                                    type="text"
                                    placeholder="Search by ticket ID, customer name, phone or complaint..."
                                    value={
                                        ticketSearch
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTicketSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                {ticketSearch && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTicketSearch(
                                                ""
                                            )
                                        }
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}

                            </div>

                            <div className="jobs-add-job-ticket-count">

                                <span>
                                    Available Tickets
                                </span>

                                <strong>
                                    {
                                        filteredTickets.length
                                    }
                                </strong>

                            </div>

                            <div className="jobs-add-job-ticket-list">

                                {ticketLoading ? (
                                    <div className="jobs-add-job-empty">

                                        <div className="jobs-add-job-loading-icon">
                                            <i className="bi bi-hourglass-split"></i>
                                        </div>

                                        <h3>
                                            Loading Tickets
                                        </h3>

                                        <p>
                                            Fetching available tickets...
                                        </p>

                                    </div>
                                ) : filteredTickets.length >
                                    0 ? (
                                    filteredTickets.map(
                                        (
                                            ticket
                                        ) => {
                                            const customer =
                                                getCustomer(
                                                    ticket.customerId
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        ticket.id
                                                    }
                                                    className="jobs-add-job-ticket-card"
                                                    onClick={() =>
                                                        handleSelectTicket(
                                                            ticket
                                                        )
                                                    }
                                                >

                                                    <div className="jobs-add-job-ticket-icon">
                                                        <i className="bi bi-ticket-perforated"></i>
                                                    </div>

                                                    <div className="jobs-add-job-ticket-content">

                                                        <div className="jobs-add-job-ticket-top">

                                                            <strong>
                                                                #
                                                                {
                                                                    ticket.ticketId
                                                                }
                                                            </strong>

                                                            <span>
                                                                <b></b>
                                                                Open
                                                            </span>

                                                        </div>

                                                        <div className="jobs-add-job-ticket-customer">

                                                            <strong>
                                                                {
                                                                    customer?.name ||
                                                                    `Customer #${ticket.customerId}`
                                                                }
                                                            </strong>

                                                            {customer?.phone && (
                                                                <span>
                                                                    <i className="bi bi-telephone"></i>
                                                                    {
                                                                        customer.phone
                                                                    }
                                                                </span>
                                                            )}

                                                        </div>

                                                        <div className="jobs-add-job-ticket-details">

                                                            <span>
                                                                <i className="bi bi-person"></i>
                                                                Customer #
                                                                {
                                                                    ticket.customerId
                                                                }
                                                            </span>

                                                            <span>
                                                                <i className="bi bi-tools"></i>
                                                                Service Type #
                                                                {
                                                                    ticket.serviceTypeId
                                                                }
                                                            </span>

                                                        </div>

                                                        {ticket.ticketNote && (
                                                            <p>
                                                                {
                                                                    ticket.ticketNote
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                    <div className="jobs-add-job-ticket-arrow">
                                                        <i className="bi bi-chevron-right"></i>
                                                    </div>

                                                </button>
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="jobs-add-job-empty">

                                        <div className="jobs-add-job-empty-icon">
                                            <i className="bi bi-ticket-x"></i>
                                        </div>

                                        <h3>
                                            No Tickets Found
                                        </h3>

                                        <p>
                                            {ticketSearch
                                                ? "No tickets match your search."
                                                : "There are no tickets available for creating a job."}
                                        </p>

                                        {ticketSearch && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTicketSearch(
                                                        ""
                                                    )
                                                }
                                            >
                                                Clear Search
                                            </button>
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                        <div className="jobs-add-job-modal-footer">

                            <div className="jobs-add-job-info">

                                <i className="bi bi-info-circle"></i>

                                <span>
                                    After selecting a ticket, you
                                    will continue to the Create Job
                                    section with the ticket and
                                    customer already linked.
                                </span>

                            </div>

                            <button
                                type="button"
                                className="jobs-add-job-cancel"
                                onClick={
                                    closeAddJobModal
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            )}

  

            {isEditJobOpen && editingJob && (
                <div
                    className="jobs-edit-job-overlay"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeEditJobModal();
                        }
                    }}
                >

                    <div className="jobs-edit-job-modal">

       

                        <div className="jobs-edit-job-header">

                            <div className="jobs-edit-job-title-area">

                                <div className="jobs-edit-job-icon">
                                    <i className="bi bi-pencil-square"></i>
                                </div>

                                <div>

                                    <div className="jobs-edit-job-heading-row">

                                        <h2>
                                            Edit Job
                                        </h2>

                                        <span className="jobs-edit-job-number">
                                            #{editingJob.jobNumber}
                                        </span>

                                    </div>

                                    <p>
                                        Update the job details and assignment.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="jobs-edit-job-close"
                                onClick={
                                    closeEditJobModal
                                }
                                disabled={
                                    editLoading
                                }
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                

                        <div className="jobs-edit-job-body">

                   

                            <div className="jobs-edit-job-field jobs-edit-job-field-full">

                                <label>
                                    Ticket
                                    <span>*</span>
                                </label>

                                <div className="jobs-edit-ticket-selected">

                                    <div className="jobs-edit-ticket-selected-icon">
                                        <i className="bi bi-ticket-perforated"></i>
                                    </div>

                                    <div className="jobs-edit-ticket-selected-content">

                                        <strong>
                                            {selectedEditTicket
                                                ? `#${selectedEditTicket.ticketId}`
                                                : "No ticket selected"}
                                        </strong>

                                        <span>
                                            {selectedEditCustomer
                                                ? selectedEditCustomer.name
                                                : selectedEditTicket
                                                    ? `Customer #${selectedEditTicket.customerId}`
                                                    : "Select a ticket below"}
                                        </span>

                                    </div>

                                    {selectedEditTicket && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditTicketId(
                                                    null
                                                )
                                            }
                                            disabled={
                                                editLoading
                                            }
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}

                                </div>

                                <div className="jobs-edit-ticket-search">

                                    <i className="bi bi-search"></i>

                                    <input
                                        type="text"
                                        placeholder="Search ticket ID, customer or phone..."
                                        value={
                                            editTicketSearch
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditTicketSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            editLoading
                                        }
                                    />

                                </div>

                                <div className="jobs-edit-ticket-list">

                                    {ticketLoading ? (
                                        <div className="jobs-edit-ticket-loading">
                                            <i className="bi bi-hourglass-split"></i>
                                            Loading tickets...
                                        </div>
                                    ) : (
                                        filteredEditTickets
                                            .slice(0, 6)
                                            .map(
                                                (
                                                    ticket
                                                ) => {
                                                    const customer =
                                                        getCustomer(
                                                            ticket.customerId
                                                        );

                                                    const isSelected =
                                                        editTicketId ===
                                                        ticket.id;

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={
                                                                ticket.id
                                                            }
                                                            className={`jobs-edit-ticket-option ${isSelected
                                                                ? "jobs-edit-ticket-option-selected"
                                                                : ""
                                                                }`}
                                                            onClick={() =>
                                                                handleEditTicketSelect(
                                                                    ticket
                                                                )
                                                            }
                                                            disabled={
                                                                editLoading
                                                            }
                                                        >

                                                            <div className="jobs-edit-ticket-option-icon">
                                                                <i className="bi bi-ticket-perforated"></i>
                                                            </div>

                                                            <div className="jobs-edit-ticket-option-content">

                                                                <strong>
                                                                    #
                                                                    {
                                                                        ticket.ticketId
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        customer?.name ||
                                                                        `Customer #${ticket.customerId}`
                                                                    }
                                                                </span>

                                                            </div>

                                                            {isSelected && (
                                                                <i className="bi bi-check-circle-fill"></i>
                                                            )}

                                                        </button>
                                                    );
                                                }
                                            )
                                    )}

                                </div>

                            </div>

                            <div className="jobs-edit-job-divider"></div>

                       

                            <div className="jobs-edit-job-field">

                                <label>
                                    Technician
                                </label>

                                <div className="jobs-edit-select-wrapper">

                                    <i className="bi bi-person-gear"></i>

                                    <select
                                        value={
                                            editUserId ??
                                            ""
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            const value =
                                                event
                                                    .target
                                                    .value;

                                            setEditUserId(
                                                value
                                                    ? Number(
                                                        value
                                                    )
                                                    : null
                                            );
                                        }}
                                        disabled={
                                            editLoading
                                        }
                                    >

                                        <option value="">
                                            Open Pool
                                        </option>

                                        {technicians.map(
                                            (
                                                technician
                                            ) => (
                                                <option
                                                    key={
                                                        technician.id
                                                    }
                                                    value={
                                                        technician.id
                                                    }
                                                >
                                                    {
                                                        technician.name
                                                    }

                                                    {technician.technicianId
                                                        ? ` - ${technician.technicianId}`
                                                        : ""}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                       

                            <div className="jobs-edit-job-field">

                                <label>
                                    Job Title
                                    <span>*</span>
                                </label>

                                <div className="jobs-edit-input-wrapper">

                                    <i className="bi bi-briefcase"></i>

                                    <input
                                        type="text"
                                        value={
                                            editJobTitle
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditJobTitle(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter job title"
                                        disabled={
                                            editLoading
                                        }
                                    />

                                </div>

                            </div>

                    

                            <div className="jobs-edit-job-grid">

                                <div className="jobs-edit-job-field">

                                    <label>
                                        Priority
                                    </label>

                                    <div className="jobs-edit-select-wrapper">

                                        <i className="bi bi-flag"></i>

                                        <select
                                            value={
                                                editPriority
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEditPriority(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                editLoading
                                            }
                                        >

                                            <option value="Low">
                                                Low
                                            </option>

                                            <option value="Medium">
                                                Medium
                                            </option>

                                            <option value="High">
                                                High
                                            </option>

                                            <option value="Urgent">
                                                Urgent
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div className="jobs-edit-job-field">

                                    <label>
                                        Status
                                    </label>

                                    <div className="jobs-edit-select-wrapper">

                                        <i className="bi bi-circle-half"></i>

                                        <select
                                            value={
                                                editStatus
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEditStatus(
                                                    event
                                                        .target
                                                        .value as Job["status"]
                                                )
                                            }
                                            disabled={
                                                editLoading
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="In-Progress">
                                                In Progress
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                            <option value="Closed">
                                                Closed
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                         

                            <div className="jobs-edit-job-grid">

                                <div className="jobs-edit-job-field">

                                    <label>
                                        Expected Date
                                        <span>*</span>
                                    </label>

                                    <div className="jobs-edit-input-wrapper">

                                        <i className="bi bi-calendar3"></i>

                                        <input
                                            type="date"
                                            value={
                                                editDate
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEditDate(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                editLoading
                                            }
                                        />

                                    </div>

                                </div>


                            </div>


                            <div className="jobs-edit-job-field">

                                <label>
                                    Job Description
                                </label>

                                <div className="jobs-edit-textarea-wrapper">

                                    <textarea
                                        value={
                                            editDescription
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditDescription(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter job description..."
                                        rows={5}
                                        disabled={
                                            editLoading
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="jobs-edit-job-footer">

                            <div className="jobs-edit-job-footer-info">

                                <i className="bi bi-info-circle"></i>

                                <span>
                                    Customer is automatically linked
                                    through the selected ticket.
                                </span>

                            </div>

                            <div className="jobs-edit-job-footer-actions">

                                <button
                                    type="button"
                                    className="jobs-edit-job-cancel"
                                    onClick={
                                        closeEditJobModal
                                    }
                                    disabled={
                                        editLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="jobs-edit-job-save"
                                    onClick={
                                        handleUpdateJob
                                    }
                                    disabled={
                                        editLoading
                                    }
                                >

                                    {editLoading ? (
                                        <>
                                            <span className="jobs-edit-job-spinner"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>
                                            Save Changes
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}

export default Jobs;