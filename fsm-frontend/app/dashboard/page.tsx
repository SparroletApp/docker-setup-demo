
"use client";

import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";

import {
    DashboardResponse,
    getDashboard,
} from "../apiservice/DashboardService";

import {
    Job,
    getAllJobs,
} from "../apiservice/jobservice";


/*
 * =========================================================
 * STORED USER
 * =========================================================
 */

interface StoredUser {
    id?: number;
    userId?: number;
    companyId?: number;
    phone?: string;
    userPhone?: string;
    role?: string;
}


/*
 * =========================================================
 * DASHBOARD CARD
 * =========================================================
 */

interface DashboardCard {
    title: string;
    icon: string;
    value: number | string;
    text: string;
    className: string;
}


/*
 * =========================================================
 * DASHBOARD
 * =========================================================
 */

function Dashboard() {

    /*
     * =====================================================
     * DASHBOARD STATE
     * =====================================================
     */

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [refreshing, setRefreshing] =
        useState(false);


    /*
     * =====================================================
     * JOB STATE
     * =====================================================
     */

    const [jobs, setJobs] =
        useState<Job[]>([]);

    const [jobsLoading, setJobsLoading] =
        useState(true);

    const [jobsError, setJobsError] =
        useState("");


    /*
     * =====================================================
     * GET COMPANY ID
     * =====================================================
     */

    const getCompanyId = (): number | null => {

        if (typeof window === "undefined") {
            return null;
        }


        /*
         * Get company ID from stored user
         */

        const storedUser =
            sessionStorage.getItem("user");


        if (storedUser) {

            try {

                const user: StoredUser =
                    JSON.parse(storedUser);


                if (
                    user.companyId !== undefined &&
                    user.companyId !== null
                ) {

                    const companyId =
                        Number(user.companyId);


                    if (
                        !Number.isNaN(companyId) &&
                        companyId > 0
                    ) {

                        return companyId;
                    }
                }

            } catch (error) {

                console.error(
                    "Failed to parse stored user:",
                    error
                );
            }
        }


        /*
         * Fallback
         */

        const storedCompanyId =
            sessionStorage.getItem("companyId");


        if (storedCompanyId) {

            const companyId =
                Number(storedCompanyId);


            if (
                !Number.isNaN(companyId) &&
                companyId > 0
            ) {

                return companyId;
            }
        }


        return null;
    };


    /*
     * =====================================================
     * GET USER PHONE
     * =====================================================
     */

    const getUserPhone = (): string | undefined => {

        if (typeof window === "undefined") {
            return undefined;
        }


        return (
            sessionStorage.getItem("user_phone") ||
            undefined
        );
    };


    /*
     * =====================================================
     * LOAD DASHBOARD
     * =====================================================
     */

    const loadDashboard = async () => {

        try {

            setError("");

            setLoading(true);


            const companyId =
                getCompanyId();


            if (!companyId) {

                setError(
                    "Company information is not available for this user."
                );

                setDashboard(null);

                return;
            }


            const userPhone =
                getUserPhone();


            const response =
                await getDashboard({
                    companyId,
                    userPhone,
                });


            console.log(
                "Dashboard response:",
                response
            );


            setDashboard(response);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );


            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
     * =====================================================
     * LOAD JOBS
     * =====================================================
     */

    const loadJobs = async () => {

        try {

            setJobsError("");

            setJobsLoading(true);


            const response =
                await getAllJobs();


            console.log(
                "Jobs response:",
                response
            );




            const activeJobs =
                response.filter(
                    (job) =>
                        !job.deleted
                );


            setJobs(activeJobs);

        } catch (error) {

            console.error(
                "Failed to load jobs:",
                error
            );


            setJobsError(
                error instanceof Error
                    ? error.message
                    : "Failed to load jobs."
            );

            setJobs([]);

        } finally {

            setJobsLoading(false);
        }
    };




    useEffect(() => {

        loadDashboard();

        loadJobs();

    }, []);


    
    const handleRefresh = async () => {

        setRefreshing(true);


        try {

            await Promise.all([
                loadDashboard(),
                loadJobs(),
            ]);

        } finally {

            setRefreshing(false);
        }
    };



    const dashboardCards: DashboardCard[] =
        useMemo(() => {

            if (!dashboard) {

                return [
                    {
                        title: "Customers",
                        icon: "bi-people",
                        value: 0,
                        text: "Total customers",
                        className: "customers-card",
                    },

                    {
                        title: "Pending Tickets",
                        icon: "bi-ticket-perforated",
                        value: 0,
                        text: "Tickets waiting for service",
                        className: "tickets-card",
                    },

                    {
                        title: "Pending Jobs",
                        icon: "bi-tools",
                        value: 0,
                        text: "Jobs waiting for service",
                        className: "jobs-card",
                    },

                    {
                        title: "Technicians",
                        icon: "bi-person-badge",
                        value: 0,
                        text: "Active technicians",
                        className: "revenue-card",
                    },
                ];
            }


            return [
                {
                    title: "Customers",
                    icon: "bi-people",
                    value: dashboard.customerCount,
                    text: "Total customers",
                    className: "customers-card",
                },

                {
                    title: "Pending Tickets",
                    icon: "bi-ticket-perforated",
                    value: dashboard.pendingTicketCount,
                    text: "Tickets waiting for service",
                    className: "tickets-card",
                },

                {
                    title: "Pending Jobs",
                    icon: "bi-tools",
                    value: dashboard.pendingJobCount,
                    text: "Jobs waiting for service",
                    className: "jobs-card",
                },

                {
                    title: "Technicians",
                    icon: "bi-person-badge",
                    value: dashboard.technicianCount,
                    text: "Active technicians",
                    className: "revenue-card",
                },
            ];

        }, [dashboard]);




    const getStatusClass = (
        status?: string | null
    ): string => {

        if (!status) {
            return "pending";
        }


        switch (
            status
                .trim()
                .toUpperCase()
        ) {

            case "COMPLETED":
                return "completed";

            case "CLOSED":
                return "completed";

            case "IN_PROGRESS":
                return "in-progress";

            case "IN PROGRESS":
                return "in-progress";

            case "ASSIGNED":
                return "in-progress";

            case "ACCEPTED":
                return "in-progress";

            case "CANCELLED":
                return "cancelled";

            case "CANCELED":
                return "cancelled";

            case "UNASSIGNED":
                return "pending";

            case "PENDING":
                return "pending";

            default:
                return "pending";
        }
    };


   
    const formatStatus = (
        status?: string | null
    ): string => {

        if (!status) {
            return "Pending";
        }


        return status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };



    const formatPriority = (
        priority?: string | null
    ): string => {

        if (!priority) {
            return "-";
        }


        return priority
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };


 

    const formatDate = (
        date?: string | null
    ): string => {

        if (!date) {
            return "-";
        }


        try {

            const parsedDate =
                new Date(date);


            if (Number.isNaN(
                parsedDate.getTime()
            )) {

                return date;
            }


            return parsedDate.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        } catch {

            return date;
        }
    };




    const jobCount =
        jobs.length;


  

    return (
        <>

            <div className="dashboard-contain">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="dashboard-header">

                    <div className="left-header-dashboard">
                        Dashboard
                    </div>


                    <div className="right-header-dashboard">

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >

                            <span>

                                <i
                                    className={`bi ${
                                        refreshing
                                            ? "bi-arrow-repeat"
                                            : "bi-arrow-clockwise"
                                    }`}
                                ></i>

                            </span>


                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}

                        </button>


                    
                    </div>

                </div>


                {error && (

                    <div className="dashboard-error">

                        <div>

                            <i className="bi bi-exclamation-circle"></i>

                        </div>


                        <div>

                            <strong>
                                Unable to load dashboard
                            </strong>


                            <p>
                                {error}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={loadDashboard}
                        >
                            Retry
                        </button>

                    </div>

                )}



                <div className="dashboard-cards-details">

                    <div className="row">

                        {dashboardCards.map(
                            (card, index) => (

                                <div
                                    className="col-lg-3 col-md-6 col-12"
                                    key={index}
                                >

                                    <div
                                        className={`dashboard-top-card ${card.className}`}
                                    >


                                        <div className="dashboard-card-top">

                                            <div className="dashboard-card-title">

                                                {card.title}

                                            </div>


                                            <div className="dashboard-card-icon">

                                                <i
                                                    className={`bi ${card.icon}`}
                                                ></i>

                                            </div>

                                        </div>


                                        <div className="dashboard-card-price">

                                            {loading
                                                ? "..."
                                                : card.value}

                                        </div>


                                        <div className="dashboard-card-bottom">

                                            <span className="dashboard-card-percentage">

                                                <i className="bi bi-bar-chart-line"></i>

                                            </span>


                                            <span className="dashboard-card-text">

                                                {card.text}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


             

                <div className="table-dashboard-details">


          

                    <div className="table-dashboard">

                        <div className="dashboard-table-head">


                            <div className="dashboard-table-head-left">

                                <div className="order-manage-dashboard">

                                    <h3>
                                        Jobs & Service Activity
                                    </h3>


                                    <div className="order-dashboard-fade">

                                        Latest jobs from the system

                                    </div>

                                </div>


                                <span>

                                    {jobsLoading
                                        ? "Loading..."
                                        : `${jobCount} jobs`}

                                </span>

                            </div>


                            <div className="dashboard-actions">

                                <button
                                    type="button"
                                    className="dashboard-action-button"
                                    onClick={loadJobs}
                                    disabled={jobsLoading}
                                >

                                    <i
                                        className={`bi ${
                                            jobsLoading
                                                ? "bi-arrow-repeat"
                                                : "bi-arrow-clockwise"
                                        }`}
                                    ></i>

                                    <span>
                                        Refresh Jobs
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    className="dashboard-action-button export-action"
                                >

                                    <i className="bi bi-download"></i>

                                    <span>
                                        Export CSV
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    className="dashboard-action-more"
                                >

                                    <i className="bi bi-three-dots"></i>

                                </button>

                            </div>

                        </div>

                    </div>


                    

                    <div className="dashboard-table-wrapper">

                        {jobsError && (

                            <div className="dashboard-error">

                                <div>

                                    <i className="bi bi-exclamation-circle"></i>

                                </div>


                                <div>

                                    <strong>
                                        Unable to load jobs
                                    </strong>


                                    <p>
                                        {jobsError}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={loadJobs}
                                >
                                    Retry
                                </button>

                            </div>

                        )}


                        <table className="dashboard-orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        JOB ID
                                    </th>

                                    <th>
                                        JOB
                                    </th>

                                    <th>
                                        TECHNICIAN
                                    </th>

                                    <th>
                                        PRIORITY
                                    </th>

                                    <th>
                                        EXPECTED DATE
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                </tr>

                            </thead>


                            <tbody>




                                {jobsLoading && (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            style={{
                                                textAlign: "center",
                                                padding: "40px",
                                            }}
                                        >

                                            <i
                                                className="bi bi-arrow-repeat"
                                                style={{
                                                    marginRight: "8px",
                                                }}
                                            ></i>

                                            Loading jobs...

                                        </td>

                                    </tr>

                                )}



                                {!jobsLoading &&
                                    jobs.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan={6}
                                                style={{
                                                    textAlign: "center",
                                                    padding: "40px",
                                                }}
                                            >

                                                <div>

                                                    <i
                                                        className="bi bi-inbox"
                                                        style={{
                                                            fontSize: "28px",
                                                            display: "block",
                                                            marginBottom: "8px",
                                                        }}
                                                    ></i>


                                                    <strong>
                                                        No jobs found
                                                    </strong>


                                                    <div>
                                                        There are no jobs available.
                                                    </div>

                                                </div>

                                            </td>

                                        </tr>

                                    )}


                     

                                {!jobsLoading &&
                                    jobs.map((job) => (

                                        <tr
                                            key={job.id}
                                        >


                                           

                                            <td>

                                                <span className="dashboard-order-id">

                                                    {job.jobId || `job-${job.id}`}

                                                </span>

                                            </td>


                                           

                                            <td>

                                                <div className="dashboard-customer">


                                                    <div className="dashboard-customer-image">

                                                        <i className="bi bi-tools"></i>

                                                    </div>


                                                    <div>

                                                        <div className="dashboard-customer-name">

                                                            {job.jobTitle || "Untitled Job"}

                                                        </div>


                                                        <div className="dashboard-customer-info">

                                                            {job.jobDescription
                                                                ? job.jobDescription
                                                                : `Ticket #${job.ticketId}`}

                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                           

                                            <td>

                                                {job.userId !== null &&
                                                job.userId !== undefined ? (

                                                    <div className="dashboard-customer">

                                                        <div className="dashboard-customer-image">

                                                            <i className="bi bi-person-badge"></i>

                                                        </div>


                                                        <div>

                                                            <div className="dashboard-customer-name">

                                                                Technician #{job.userId}

                                                            </div>


                                                            <div className="dashboard-customer-info">

                                                                Assigned technician

                                                            </div>

                                                        </div>

                                                    </div>

                                                ) : (

                                                    <span className="dashboard-status pending">

                                                        <span></span>

                                                        Unassigned

                                                    </span>

                                                )}

                                            </td>


                                           

                                            <td>

                                                <span className="dashboard-order-id">

                                                    {formatPriority(
                                                        job.priority
                                                    )}

                                                </span>

                                            </td>


                                            

                                            <td>

                                                {formatDate(
                                                    job.expectedDate
                                                )}

                                            </td>


                                          
                                            <td>

                                                <span
                                                    className={`dashboard-status ${getStatusClass(
                                                        job.status
                                                    )}`}
                                                >

                                                    <span></span>

                                                    {formatStatus(
                                                        job.status
                                                    )}

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="dashboard-table-footer">

                        <div>

                            {jobsLoading
                                ? "Loading jobs..."
                                : `Showing ${jobCount} jobs`}

                        </div>


                        <div className="dashboard-pagination">

                            <button
                                type="button"
                                disabled
                            >
                                Previous
                            </button>


                            <button
                                type="button"
                                disabled
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>


                

            </div>

        </>
    );
}


export default Dashboard;
