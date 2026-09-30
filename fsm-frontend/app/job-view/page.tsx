"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./job-view.css";

import {
getJobById,
Job,
} from "../apiservice/jobservice";

import {
getTicketById,
Ticket,
} from "../apiservice/ticketservice";

import {
getCustomerById,
Customer,
} from "../apiservice/customersservice";

import {
getAllUsers,
User,
} from "../apiservice/userservice";

const normalizeStatus = (
status: string | null | undefined
) => {
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
    case "accepted":
    case "working":
        return "In Progress";

    case "completed":
        return "Completed";

    case "closed":
        return "Closed";

    default:
        return status;
}


};

const formatDate = (
value: string | null | undefined
) => {
if (!value) {
return "-";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    return value;
}

return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});


};

const formatTime = (
value: string | null | undefined
) => {
if (!value) {
return "-";
}


const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    return "-";
}

return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
});


};

const getStatusClass = (
status: string | null | undefined
) => {
const normalized = normalizeStatus(status);


switch (normalized) {
    case "Pending":
        return "job-view-status-pending";

    case "In Progress":
        return "job-view-status-progress";

    case "Completed":
        return "job-view-status-completed";

    case "Closed":
        return "job-view-status-closed";

    default:
        return "job-view-status-pending";
}


};

function JobView() {
const router = useRouter();


const [job, setJob] = useState<Job | null>(null);
const [ticket, setTicket] =
    useState<Ticket | null>(null);
const [customer, setCustomer] =
    useState<Customer | null>(null);
const [technician, setTechnician] =
    useState<User | null>(null);

const [loading, setLoading] =
    useState(true);

useEffect(() => {
    const loadJob = async () => {
        try {
            setLoading(true);

            const storedJobId =
                localStorage.getItem("job_id");

            if (!storedJobId) {
                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Job not found",
                    text: "No job was selected.",
                    showConfirmButton: false,
                    timer: 2000,
                });

                router.push("/jobs");
                return;
            }

            const jobId =
                Number(storedJobId);

            if (
                !Number.isInteger(jobId) ||
                jobId <= 0
            ) {
                localStorage.removeItem(
                    "job_id"
                );

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Invalid job",
                    showConfirmButton: false,
                    timer: 2000,
                });

                router.push("/jobs");
                return;
            }

            console.log(
                "Fetching job:",
                jobId
            );

            const jobResponse =
                await getJobById({
                    id: jobId,
                });

            console.log(
                "Job API response:",
                jobResponse
            );

            if (!jobResponse) {
                throw new Error(
                    "Job not found"
                );
            }

            setJob(jobResponse);

            if (
                jobResponse.ticketId
            ) {
                try {
                    const ticketResponse =
                        await getTicketById({
                            id: jobResponse.ticketId,
                        });

                    setTicket(
                        ticketResponse
                    );

                    if (
                        ticketResponse?.customerId
                    ) {
                        try {
                            const customerResponse =
                                await getCustomerById(
                                    ticketResponse.customerId
                                );

                            setCustomer(
                                customerResponse
                            );
                        } catch (
                            customerError
                        ) {
                            console.error(
                                "Failed to load customer:",
                                customerError
                            );
                        }
                    }
                } catch (
                    ticketError
                ) {
                    console.error(
                        "Failed to load ticket:",
                        ticketError
                    );
                }
            }

            if (
                jobResponse.userId
            ) {
                try {
                    const users =
                        await getAllUsers();

                    const foundTechnician =
                        (
                            users || []
                        ).find(
                            (user) =>
                                user.id ===
                                jobResponse.userId
                        );

                    setTechnician(
                        foundTechnician ||
                        null
                    );
                } catch (
                    technicianError
                ) {
                    console.error(
                        "Failed to load technician:",
                        technicianError
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to load job:",
                error
            );

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to load job",
                text:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                showConfirmButton: false,
                timer: 2500,
            });

            router.push("/jobs");
        } finally {
            setLoading(false);
        }
    };

    loadJob();
}, [router]);

const handleBack = () => {
    localStorage.removeItem(
        "job_id"
    );

    router.push("/jobs");
};

const handleEdit = () => {
    if (!job) {
        return;
    }

    localStorage.setItem(
        "job_id",
        String(job.id)
    );

    router.push(
        "/add-ticket?mode=edit-job"
    );
};

if (loading) {
    return (
        <div className="job-view-page">

            <div className="job-view-loading">

                <div className="job-view-loading-icon">
                    <i className="bi bi-hourglass-split"></i>
                </div>

                <h3>
                    Loading Job
                </h3>

                <p>
                    Fetching job details...
                </p>

            </div>

        </div>
    );
}

if (!job) {
    return (
        <div className="job-view-page">

            <div className="job-view-loading">

                <div className="job-view-loading-icon">
                    <i className="bi bi-briefcase-x"></i>
                </div>

                <h3>
                    Job Not Found
                </h3>

                <p>
                    The selected job could not be found.
                </p>

                <button
                    type="button"
                    onClick={handleBack}
                    className="job-view-back-button"
                >
                    <i className="bi bi-arrow-left"></i>
                    Back to Jobs
                </button>

            </div>

        </div>
    );
}

const jobNumber =
    job.jobId ||
    `JB-${String(job.id).padStart(5, "0")}`;

const status =
    normalizeStatus(job.status);

return (
    <div className="job-view-page">

        <div className="dashboard-header">

            <div className="left-header-dashboard">
                Job Details
            </div>

            <div className="right-header-dashboard">

                <button
                    type="button"
                    onClick={handleBack}
                >
                    <span>
                        <i className="bi bi-arrow-left"></i>
                    </span>
                    Back to Jobs
                </button>

            </div>

        </div>

        <div className="job-view-container">

            <div className="job-view-top">

                <div className="job-view-title-section">

                    <div className="job-view-icon">
                        <i className="bi bi-briefcase"></i>
                    </div>

                    <div>

                        <div className="job-view-number">
                            #{jobNumber}
                        </div>

                        <h1>
                            {job.jobTitle ||
                                "Service Job"}
                        </h1>

                        <p>
                            Job ID #{job.id}
                        </p>

                    </div>

                </div>

                <div className="job-view-top-actions">

                    <span
                        className={`job-view-status ${getStatusClass(
                            job.status
                        )}`}
                    >
                        <b></b>
                        {status}
                    </span>

                    <button
                        type="button"
                        className="job-view-edit-button"
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pencil"></i>
                        Edit Job
                    </button>

                </div>

            </div>

            <div className="job-view-grid">

                <div className="job-view-main">

                    <div className="job-view-card">

                        <div className="job-view-card-header">

                            <div>
                                <h2>
                                    Job Information
                                </h2>

                                <p>
                                    Service job details and schedule.
                                </p>
                            </div>

                            <i className="bi bi-info-circle"></i>

                        </div>

                        <div className="job-view-details-grid">

                            <div className="job-view-detail">

                                <span>
                                    Job Title
                                </span>

                                <strong>
                                    {job.jobTitle ||
                                        "-"}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Priority
                                </span>

                                <strong className="job-view-priority">
                                    {job.priority ||
                                        "Medium"}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Expected Date
                                </span>

                                <strong>
                                    <i className="bi bi-calendar3"></i>
                                    {formatDate(
                                        job.expectedDate
                                    )}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Expected Time
                                </span>

                                <strong>
                                    <i className="bi bi-clock"></i>
                                    {formatTime(
                                        job.expectedDate
                                    )}
                                </strong>

                            </div>

                        </div>

                        <div className="job-view-description">

                            <span>
                                Description
                            </span>

                            <p>
                                {job.jobDescription ||
                                    "No description provided."}
                            </p>

                        </div>

                    </div>

                    <div className="job-view-card">

                        <div className="job-view-card-header">

                            <div>
                                <h2>
                                    Ticket Information
                                </h2>

                                <p>
                                    Ticket linked to this service job.
                                </p>
                            </div>

                            <i className="bi bi-ticket-perforated"></i>

                        </div>

                        <div className="job-view-details-grid">

                            <div className="job-view-detail">

                                <span>
                                    Ticket ID
                                </span>

                                <strong>
                                    #
                                    {ticket?.ticketId ||
                                        job.ticketId}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Ticket Record
                                </span>

                                <strong>
                                    #
                                    {job.ticketId}
                                </strong>

                            </div>

                            <div className="job-view-detail job-view-detail-full">

                                <span>
                                    Complaint Note
                                </span>

                                <p>
                                    {ticket?.ticketNote ||
                                        "No complaint note available."}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="job-view-card">

                        <div className="job-view-card-header">

                            <div>
                                <h2>
                                    Audit Information
                                </h2>

                                <p>
                                    Job creation and update information.
                                </p>
                            </div>

                            <i className="bi bi-clock-history"></i>

                        </div>

                        <div className="job-view-details-grid">

                            <div className="job-view-detail">

                                <span>
                                    Created At
                                </span>

                                <strong>
                                    {formatDate(
                                        job.createdAt
                                    )}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Created By
                                </span>

                                <strong>
                                    {job.createdBy ||
                                        "-"}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Updated At
                                </span>

                                <strong>
                                    {formatDate(
                                        job.updatedAt
                                    )}
                                </strong>

                            </div>

                            <div className="job-view-detail">

                                <span>
                                    Updated By
                                </span>

                                <strong>
                                    {job.updatedBy ||
                                        "-"}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="job-view-sidebar">

                    <div className="job-view-card">

                        <div className="job-view-card-header">

                            <div>
                                <h2>
                                    Customer
                                </h2>

                                <p>
                                    Customer linked through ticket.
                                </p>
                            </div>

                            <i className="bi bi-person"></i>

                        </div>

                        <div className="job-view-person">

                            <div className="job-view-person-avatar">
                                <i className="bi bi-person"></i>
                            </div>

                            <div>

                                <strong>
                                    {customer?.name ||
                                        "Customer not found"}
                                </strong>

                                <span>
                                    Customer #
                                    {customer?.id ||
                                        ticket?.customerId ||
                                        "-"}
                                </span>

                            </div>

                        </div>

                        {customer?.phone && (

                            <div className="job-view-contact">

                                <i className="bi bi-telephone"></i>

                                <span>
                                    {customer.phone}
                                </span>

                            </div>

                        )}

                        {customer?.address && (

                            <div className="job-view-contact">

                                <i className="bi bi-geo-alt"></i>

                                <span>
                                    {customer.address}
                                </span>

                            </div>

                        )}

                    </div>

                    <div className="job-view-card">

                        <div className="job-view-card-header">

                            <div>
                                <h2>
                                    Technician
                                </h2>

                                <p>
                                    Assigned service technician.
                                </p>
                            </div>

                            <i className="bi bi-person-gear"></i>

                        </div>

                        {technician ? (

                            <div className="job-view-person">

                                <div className="job-view-person-avatar job-view-technician-avatar">
                                    <img
                                        src="/avatar.png"
                                        alt={
                                            technician.name ||
                                            "Technician"
                                        }
                                    />
                                </div>

                                <div>

                                    <strong>
                                        {
                                            technician.name ||
                                            "Technician"
                                        }
                                    </strong>

                                    <span>
                                        #
                                        {
                                            technician.technicianId ||
                                            technician.id
                                        }
                                    </span>

                                </div>

                            </div>

                        ) : (

                            <div className="job-view-unassigned">

                                <div>
                                    <i className="bi bi-people"></i>
                                </div>

                                <strong>
                                    Open Pool
                                </strong>

                                <span>
                                    No technician assigned
                                </span>

                            </div>

                        )}

                    </div>

                    <div className="job-view-card">

                        <div className="job-view-card-header">

                            <div>
                                <h2>
                                    Job Summary
                                </h2>

                                <p>
                                    Current job information.
                                </p>
                            </div>

                            <i className="bi bi-bar-chart"></i>

                        </div>

                        <div className="job-view-summary-list">

                            <div>
                                <span>
                                    Job
                                </span>

                                <strong>
                                    #{jobNumber}
                                </strong>
                            </div>

                           

                            <div>
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {status}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Priority
                                </span>

                                <strong>
                                    {job.priority ||
                                        "Medium"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);


}

export default JobView;
