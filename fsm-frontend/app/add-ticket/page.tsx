"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./add-ticket.css";
import AddCustomers from "../add-customers/page";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    Customer,
    getAllCustomers,
} from "../apiservice/customersservice";

import {
    getAllServiceTypes,
    ServiceType,
} from "../apiservice/servicetype";

import {
    createTicket,
    getTicketById,
    updateTicket,
    Ticket,
} from "../apiservice/ticketservice";

import {
    createJob,
} from "../apiservice/jobservice";

import {
    getAllUsers,
    User,
} from "../apiservice/userservice";

interface Technician {
    id: number;
    name: string;
    specialization: string;
    status: string;
    pendingTasks: number;
    phone: string;
    technicianId: string | null;
}

function AddTicket() {
    const router = useRouter();

    const TICKET_STORAGE_KEY = "add_job_ticket_id";

    const searchParams = useSearchParams();

    const isCreateJobMode =
        searchParams.get("mode") === "create-job";

    const [currentStep, setCurrentStep] =
        useState(isCreateJobMode ? 3 : 1);

    const [loading, setLoading] = useState(false);

    const [showAddCustomer, setShowAddCustomer] = useState(false);

    const [createdTicket, setCreatedTicket] =
        useState<Ticket | null>(null);

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [customersLoading, setCustomersLoading] =
        useState(false);

    const [serviceTypes, setServiceTypes] =
        useState<ServiceType[]>([]);

    const [serviceTypesLoading, setServiceTypesLoading] =
        useState(false);

    const [technicians, setTechnicians] =
        useState<Technician[]>([]);

    const [techniciansLoading, setTechniciansLoading] =
        useState(false);

    const [searchCustomer, setSearchCustomer] =
        useState("");

    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);

    const [searchTechnician, setSearchTechnician] =
        useState("");

    const [selectedTechnician, setSelectedTechnician] =
        useState<Technician | null>(null);

    const [selectedServiceType, setSelectedServiceType] =
        useState<ServiceType | null>(null);

    const [product, setProduct] = useState("");

    const [complaintNote, setComplaintNote] =
        useState("");

    const [jobType, setJobType] = useState("");

    const [jobTitle, setJobTitle] = useState("");

    const [jobDescription, setJobDescription] =
        useState("");

    const [priority, setPriority] = useState("Medium");

    const [preferredDate, setPreferredDate] =
        useState("");

    const [preferredTime, setPreferredTime] =
        useState("");

    const [duration, setDuration] = useState("2");

    const [assignmentType, setAssignmentType] =
        useState<"open_pool" | "technician">(
            "open_pool"
        );



    useEffect(() => {
        const loadServiceTypes = async () => {
            try {
                setServiceTypesLoading(true);

                const response =
                    await getAllServiceTypes();

                setServiceTypes(response || []);
            } catch (error) {
                console.error(
                    "Failed to load service types:",
                    error
                );

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Failed to load service types",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } finally {
                setServiceTypesLoading(false);
            }
        };

        loadServiceTypes();
    }, []);

  
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setCustomersLoading(true);

                const response =
                    await getAllCustomers();

                setCustomers(response || []);
            } catch (error) {
                console.error(
                    "Failed to load customers:",
                    error
                );

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Failed to load customers",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } finally {
                setCustomersLoading(false);
            }
        };

        loadCustomers();
    }, []);


    useEffect(() => {
        const loadTechnicians = async () => {
            try {
                setTechniciansLoading(true);

                const users: User[] =
                    await getAllUsers();

                const technicianUsers: Technician[] =
                    (users || [])
                        .filter(
                            (user) =>
                                user.role?.toUpperCase() ===
                                "TECHNICIAN"
                        )
                        .map((user) => ({
                            id: user.id,
                            name: user.name,
                            specialization:
                                user.specialization ||
                                "Technician",
                            status:
                                user.status ||
                                "Available",
                            pendingTasks: 0,
                            phone: user.phone,
                            technicianId:
                                user.technicianId,
                        }));

                setTechnicians(technicianUsers);
            } catch (error) {
                console.error(
                    "Failed to load technicians:",
                    error
                );

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Failed to load technicians",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } finally {
                setTechniciansLoading(false);
            }
        };

        loadTechnicians();
    }, []);

    const filteredCustomers = useMemo(() => {
        const search =
            searchCustomer
                .toLowerCase()
                .trim();

        if (!search) {
            return [...customers]
                .sort((a, b) => {
                    const dateA =
                        a.createdAt
                            ? new Date(
                                a.createdAt
                            ).getTime()
                            : 0;

                    const dateB =
                        b.createdAt
                            ? new Date(
                                b.createdAt
                            ).getTime()
                            : 0;

                    return dateB - dateA;
                })
                .slice(0, 2);
        }

        return customers.filter(
            (customer) => {
                return (
                    customer.name
                        .toLowerCase()
                        .includes(search) ||

                    customer.phone
                        .toLowerCase()
                        .includes(search) ||

                    customer.address
                        .toLowerCase()
                        .includes(search) ||

                    customer.pincode
                        .toLowerCase()
                        .includes(search) ||

                    String(customer.id)
                        .includes(search)
                );
            }
        );
    }, [
        customers,
        searchCustomer,
    ]);

    const filteredTechnicians =
        useMemo(() => {
            const search =
                searchTechnician
                    .toLowerCase()
                    .trim();

            if (!search) {
                return technicians;
            }

            return technicians.filter(
                (technician) => {
                    return (
                        technician.name
                            .toLowerCase()
                            .includes(search) ||

                        technician.specialization
                            .toLowerCase()
                            .includes(search) ||

                        technician.status
                            .toLowerCase()
                            .includes(search) ||

                        technician.phone
                            .toLowerCase()
                            .includes(search) ||

                        (
                            technician.technicianId ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search) ||

                        String(technician.id)
                            .includes(search)
                    );
                }
            );
        }, [
            technicians,
            searchTechnician,
        ]);

    useEffect(() => {
        if (currentStep !== 2) {
            return;
        }

        const storedTicketId = localStorage.getItem(TICKET_STORAGE_KEY);

        if (!storedTicketId) {
            return;
        }

        const ticketId =
            Number(storedTicketId);

        if (!ticketId) {
            localStorage.removeItem(
                TICKET_STORAGE_KEY
            );
            return;
        }

        const loadStoredTicket =
            async () => {
                try {
                    setLoading(true);

                    const ticket =
                        await getTicketById({
                            id: ticketId,
                        });

                    if (!ticket) {
                        localStorage.removeItem(
                            TICKET_STORAGE_KEY
                        );
                        return;
                    }

                    setCreatedTicket(ticket);

                    const customer =
                        customers.find(
                            (item) =>
                                item.id ===
                                ticket.customerId
                        );

                    if (customer) {
                        setSelectedCustomer(
                            customer
                        );
                    }

                    const serviceType =
                        serviceTypes.find(
                            (item) =>
                                item.id ===
                                ticket.serviceTypeId
                        );

                    if (serviceType) {
                        setSelectedServiceType(
                            serviceType
                        );
                    }

                    setComplaintNote(
                        ticket.ticketNote || ""
                    );
                } catch (error) {
                    console.error(
                        "Failed to load stored ticket:",
                        error
                    );

                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "error",
                        title: "Failed to load ticket",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                } finally {
                    setLoading(false);
                }
            };

        loadStoredTicket();
    }, [
        currentStep,
        customers,
        serviceTypes,
    ]);

    const selectedDuration =
        Number(duration);

    const calculateEndTime = () => {
        if (
            !preferredTime ||
            !duration
        ) {
            return "-";
        }

        const [
            hours,
            minutes,
        ] =
            preferredTime
                .split(":")
                .map(Number);

        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);

        date.setMinutes(
            date.getMinutes() +
            selectedDuration * 60
        );

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getPriorityClass = () => {
        switch (priority) {
            case "Low":
                return "review-priority-low";

            case "Medium":
                return "review-priority-medium";

            case "High":
                return "review-priority-high";

            case "Urgent":
                return "review-priority-urgent";

            default:
                return "";
        }
    };


    const getTechnicianStatusClass = (
        status: string
    ) => {
        const normalizedStatus =
            status?.toLowerCase();

        switch (normalizedStatus) {
            case "available":
            case "active":
                return "add-ticket-technician-status-available";

            case "busy":
            case "in-progress":
            case "in_progress":
                return "add-ticket-technician-status-progress";

            case "offline":
            case "inactive":
            case "standby":
                return "add-ticket-technician-status-standby";

            default:
                return "add-ticket-technician-status-available";
        }
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!selectedCustomer) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please select a customer",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }
        }

        if (currentStep === 2) {
            if (!selectedServiceType) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please select a service type",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }

            if (!complaintNote.trim()) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please enter the complaint note",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }
        }

        if (currentStep === 3) {
            if (!jobTitle.trim()) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please enter a job title",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }

            if (!priority) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please select priority",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }

            if (!preferredDate) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please select an expecting date",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }

            if (
                assignmentType ===
                "technician" &&
                !selectedTechnician
            ) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please select a technician",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return false;
            }
        }

        return true;
    };

    const createOrUpdateTicketFromStepTwo =
        async () => {
            if (!validateStep()) {
                return;
            }

            if (
                !selectedCustomer ||
                !selectedServiceType
            ) {
                return;
            }

            try {
                setLoading(true);

                const userPhone =
                    sessionStorage.getItem(
                        "user_phone"
                    ) || "";

                if (!userPhone) {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "warning",
                        title: "User session not found",
                        text: "Please log in again.",
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    return;
                }

                const storedTicketId =
                    localStorage.getItem(
                        TICKET_STORAGE_KEY
                    );

                if (storedTicketId) {
                    const ticketId =
                        Number(storedTicketId);

                    if (!ticketId) {
                        localStorage.removeItem(
                            TICKET_STORAGE_KEY
                        );

                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "warning",
                            title: "Invalid ticket ID",
                            showConfirmButton: false,
                            timer: 1800,
                        });

                        return;
                    }

                    const updateData = {
                        id: ticketId,
                        serviceTypeId:
                            selectedServiceType.id,
                        customerId:
                            selectedCustomer.id,
                        ticketNote:
                            complaintNote.trim(),
                        updatedBy:
                            userPhone,
                    };

                    console.log(
                        "Updating Ticket:",
                        updateData
                    );

                    const updatedTicket =
                        await updateTicket(
                            updateData
                        );

                    setCreatedTicket(
                        updatedTicket
                    );

                    localStorage.setItem(
                        TICKET_STORAGE_KEY,
                        String(updatedTicket.id)
                    );

                    await Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Ticket updated successfully",
                        showConfirmButton: false,
                        timer: 1500,
                    });

                    setCurrentStep(3);

                    return;
                }
                const ticketData = {
                    serviceTypeId:
                        selectedServiceType.id,
                    customerId:
                        selectedCustomer.id,
                    ticketNote:
                        complaintNote.trim(),
                    createdBy:
                        userPhone,
                };

                console.log(
                    "Creating Ticket:",
                    ticketData
                );

                const response =
                    await createTicket(
                        ticketData
                    );

                setCreatedTicket(response);

                if (response?.id) {
                    localStorage.setItem(
                        TICKET_STORAGE_KEY,
                        String(response.id)
                    );
                }

                console.log(
                    "Created Ticket:",
                    response
                );

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Ticket created successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });

                setCurrentStep(3);
            } catch (error) {
                console.error(
                    "Failed to create/update ticket:",
                    error
                );

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Failed to save ticket",
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

    const goNext = async () => {
        if (currentStep === 1) {
            if (!validateStep()) {
                return;
            }

            setCurrentStep(2);

            return;
        }

        if (currentStep === 2) {
            await createOrUpdateTicketFromStepTwo();

            return;
        }
    };


    const createTicketAndJob = async () => {
        if (!validateStep()) {
            return;
        }

        try {
            setLoading(true);

            const storedTicketId =
                localStorage.getItem(
                    TICKET_STORAGE_KEY
                );

            console.log(
                "Ticket ID from localStorage:",
                storedTicketId
            );

            if (!storedTicketId) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Ticket ID not found",
                    text: "No ticket ID was found in local storage.",
                    showConfirmButton: false,
                    timer: 2000,
                });

                return;
            }

            const ticketId =
                Number(storedTicketId);

            console.log(
                "Ticket ID as number:",
                ticketId,
                typeof ticketId
            );

            if (
                !Number.isInteger(ticketId) ||
                ticketId <= 0
            ) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Invalid Ticket ID",
                    text: "The stored ticket ID is invalid.",
                    showConfirmButton: false,
                    timer: 2000,
                });

                return;
            }

            const createdBy =
                sessionStorage.getItem(
                    "user_phone"
                ) || "";

            if (!createdBy) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "User session not found",
                    text: "Please log in again.",
                    showConfirmButton: false,
                    timer: 2000,
                });

                return;
            }

            let expectedDate: string | null = null;

            if (
                preferredDate &&
                preferredTime
            ) {
                expectedDate =
                    `${preferredDate}T${preferredTime}:00`;
            } else if (preferredDate) {
                expectedDate =
                    `${preferredDate}T00:00:00`;
            }

            const userId =
                assignmentType === "technician"
                    ? selectedTechnician?.id ?? null
                    : null;

            if (
                assignmentType === "technician" &&
                !userId
            ) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "warning",
                    title: "Please select a technician",
                    showConfirmButton: false,
                    timer: 1800,
                });

                return;
            }

            const jobData = {
                userId: userId,

                ticketId: ticketId,

                jobTitle:
                    jobTitle.trim(),

                priority:
                    priority,

                expectedDate:
                    expectedDate,

                jobDescription:
                    jobDescription.trim() ||
                    null,

                createdBy:
                    createdBy,
            };

            console.log(
                "Creating Job:",
                jobData
            );

            const createdJob =
                await createJob(
                    jobData
                );

            console.log(
                "Created Job:",
                createdJob
            );

            localStorage.removeItem(
                TICKET_STORAGE_KEY
            );

            await Swal.fire({
                icon: "success",
                title: "Created Successfully",
                text: "Ticket and job have been created successfully.",
                confirmButtonText: "Done",
                confirmButtonColor:
                    "#421ddb",
            });

            router.push(
                "/tickets"
            );

        } catch (error) {
            console.error(
                "Failed to create job:",
                error
            );

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to create job",
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
    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const handleBack = () => {
        router.back();
    };

    const handleStepBack = () => {
        if (loading) {
            return;
        }

        if (currentStep === 3) {
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    return (
        <>
            <div className="add-ticket">

                <div className="add-ticket-top">

                    <div className="add-ticket-title-wrapper">

                        <div
                            className="add-ticket-title-icon"
                            onClick={
                                handleBack
                            }
                        >
                            <i className="bi bi-arrow-left"></i>
                        </div>

                        <div className="add-ticket-title">

                            <h3>
                                Create Service Request
                            </h3>

                            <p>
                                Create a complaint and schedule a service
                                job in 3 simple steps
                            </p>

                        </div>

                    </div>

                </div>

                <div className="add-ticket-stepper">

                    <div
                        className={`add-ticket-step ${currentStep >= 1
                            ? "add-ticket-step-active"
                            : ""
                            } ${currentStep > 1
                                ? "add-ticket-step-completed"
                                : ""
                            }`}
                    >

                        <div className="add-ticket-step-circle">

                            {currentStep > 1 ? (
                                <i className="bi bi-check-lg"></i>
                            ) : (
                                "1"
                            )}

                        </div>

                        <span>
                            Customer
                        </span>

                    </div>

                    <div
                        className={`add-ticket-step-line ${currentStep >= 2
                            ? "add-ticket-step-line-active"
                            : ""
                            }`}
                    ></div>

                    <div
                        className={`add-ticket-step ${currentStep >= 2
                            ? "add-ticket-step-active"
                            : ""
                            } ${currentStep > 2
                                ? "add-ticket-step-completed"
                                : ""
                            }`}
                    >

                        <div className="add-ticket-step-circle">

                            {currentStep > 2 ? (
                                <i className="bi bi-check-lg"></i>
                            ) : (
                                "2"
                            )}

                        </div>

                        <span>
                            Ticket
                        </span>

                    </div>

                    <div
                        className={`add-ticket-step-line ${currentStep >= 3
                            ? "add-ticket-step-line-active"
                            : ""
                            }`}
                    ></div>

                    <div
                        className={`add-ticket-step ${currentStep >= 3
                            ? "add-ticket-step-active"
                            : ""
                            }`}
                    >

                        <div className="add-ticket-step-circle">
                            3
                        </div>

                        <span>
                            Create Job
                        </span>

                    </div>

                </div>

                <div className="add-ticket-content">



                    {currentStep === 1 && (

                        <div className="add-ticket-panel">

                            <div className="add-ticket-section-head">

                                <span>
                                    <i className="bi bi-person"></i>
                                </span>

                                <div>

                                    <h3>
                                        Select Customer
                                    </h3>

                                    <p>
                                        Choose the customer for this
                                        service request.
                                    </p>

                                </div>

                            </div>

                            <div className="add-ticket-customer-layout">

                                <div className="add-ticket-customer-left">

                                    <div className="add-ticket-search">

                                        <i className="bi bi-search"></i>

                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="Search customer by name, phone or address..."
                                            value={
                                                searchCustomer
                                            }
                                            onChange={(e) =>
                                                setSearchCustomer(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        {searchCustomer && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSearchCustomer(
                                                        ""
                                                    )
                                                }
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>

                                        )}

                                    </div>

                                    <div className="add-ticket-customer-list">

                                        {customersLoading ? (

                                            <div className="add-ticket-no-customer">

                                                <h4>
                                                    Loading customers...
                                                </h4>

                                            </div>

                                        ) : filteredCustomers.length > 0 ? (

                                            filteredCustomers.map(
                                                (customer) => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            customer.id
                                                        }
                                                        className={`add-ticket-customer ${selectedCustomer?.id ===
                                                            customer.id
                                                            ? "add-ticket-customer-selected"
                                                            : ""
                                                            }`}
                                                        onClick={() =>
                                                            setSelectedCustomer(
                                                                customer
                                                            )
                                                        }
                                                    >

                                                        <div className="add-ticket-customer-info">

                                                            <strong>
                                                                {
                                                                    customer.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    customer.phone
                                                                }
                                                            </span>

                                                        </div>

                                                        <i className="bi bi-chevron-right add-ticket-customer-arrow"></i>

                                                    </button>

                                                )
                                            )

                                        ) : (

                                            <div className="add-ticket-no-customer">

                                                <div>
                                                    <i className="bi bi-person-x"></i>
                                                </div>

                                                <h4>
                                                    No customer found
                                                </h4>

                                                <p>
                                                    This customer is not
                                                    registered yet.
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                    <button
                                        type="button"
                                        className="add-ticket-new-customer-button"
                                        onClick={() =>
                                            setShowAddCustomer(
                                                true
                                            )
                                        }
                                    >

                                        <i className="bi bi-plus-lg"></i>

                                        Add New Customer

                                    </button>

                                </div>

                                <div className="add-ticket-customer-right">

                                    {selectedCustomer ? (

                                        <>

                                            <div className="add-ticket-selected-customer-head">

                                                <div className="add-ticket-selected-avatar">

                                                    <i className="bi bi-person"></i>

                                                </div>

                                                <div>

                                                    <div className="add-ticket-selected-name">

                                                        <h3>
                                                            {
                                                                selectedCustomer.name
                                                            }
                                                        </h3>

                                                        <span>
                                                            Existing Customer
                                                        </span>

                                                    </div>

                                                    <div className="add-ticket-selected-contact">

                                                        <span>

                                                            <i className="bi bi-telephone"></i>

                                                            {
                                                                selectedCustomer.phone
                                                            }

                                                        </span>

                                                        <span>

                                                            <i className="bi bi-geo-alt"></i>

                                                            {
                                                                selectedCustomer.address
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="add-ticket-customer-details">

                                                <h4>
                                                    Customer Details
                                                </h4>

                                                <div className="add-ticket-detail-row">

                                                    <span>
                                                        Name
                                                    </span>

                                                    <strong>
                                                        {
                                                            selectedCustomer.name
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="add-ticket-detail-row">

                                                    <span>
                                                        Phone
                                                    </span>

                                                    <strong>
                                                        {
                                                            selectedCustomer.phone
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="add-ticket-detail-row">

                                                    <span>
                                                        Address
                                                    </span>

                                                    <strong>
                                                        {
                                                            selectedCustomer.address
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </>

                                    ) : (

                                        <div className="add-ticket-empty-selection">

                                            <div className="add-ticket-empty-icon">

                                                <i className="bi bi-person-check"></i>

                                            </div>

                                            <h4>
                                                Select a Customer
                                            </h4>

                                            <p>
                                                Select a customer from the
                                                list to view their details.
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}
     

                    {currentStep === 2 && (

                        <div className="add-ticket-panel">

                            <div className="add-ticket-section-head">

                                <span>
                                    <i className="bi bi-exclamation-circle"></i>
                                </span>

                                <div>

                                    <h3>
                                        Ticket Details
                                    </h3>

                                    <p>
                                        Enter the complaint reported by
                                        the customer.
                                    </p>

                                </div>

                            </div>

                            <div className="add-ticket-form">

                                <div className="row">

                                    <div className="col-lg-6 col-md-6 col-sm-12">

                                        <div className="add-ticket-field">

                                            <label>
                                                Service Type *
                                            </label>

                                            <select
                                                className="form-input"
                                                value={
                                                    selectedServiceType?.id ??
                                                    ""
                                                }
                                                onChange={(e) => {

                                                    const serviceTypeId =
                                                        Number(
                                                            e.target.value
                                                        );

                                                    const serviceType =
                                                        serviceTypes.find(
                                                            (item) =>
                                                                item.id ===
                                                                serviceTypeId
                                                        ) || null;

                                                    setSelectedServiceType(
                                                        serviceType
                                                    );

                                                }}
                                                disabled={
                                                    serviceTypesLoading
                                                }
                                            >

                                                <option value="">

                                                    {serviceTypesLoading
                                                        ? "Loading service types..."
                                                        : "Select service type"}

                                                </option>

                                                {serviceTypes.map(
                                                    (serviceType) => (

                                                        <option
                                                            key={
                                                                serviceType.id
                                                            }
                                                            value={
                                                                serviceType.id
                                                            }
                                                        >
                                                            {
                                                                serviceType.name
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>

                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">

                                        <div className="add-ticket-field">

                                            <label>
                                                Ticket Note *
                                            </label>

                                            <textarea
                                                className="form-input"
                                                placeholder="Describe the customer's complaint..."
                                                value={
                                                    complaintNote
                                                }
                                                onChange={(e) =>
                                                    setComplaintNote(
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={
                                                    500
                                                }
                                            />

                                            <small>
                                                {
                                                    complaintNote.length
                                                }
                                                /500
                                            </small>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="add-ticket-complaint-preview">

                                <div className="add-ticket-complaint-preview-icon">

                                    <i className="bi bi-info-circle"></i>

                                </div>

                                <div>

                                    <strong>
                                        Complaint will be linked to the
                                        customer
                                    </strong>

                                    <p>
                                        The service type and complaint
                                        note will be saved under this
                                        customer's ticket.
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}



                    {currentStep === 3 && (

                        <div className="add-ticket-panel">

                            <div className="add-ticket-section-head">

                                <span>
                                    <i className="bi bi-calendar2-check"></i>
                                </span>

                                <div>

                                    <h3>
                                        Create Job
                                    </h3>

                                    <p>
                                        Create the service job and choose
                                        how it should be assigned.
                                    </p>

                                </div>

                            </div>

                            <div className="add-ticket-form">

                                <div className="row">

                                    <div className="col-lg-6 col-md-6 col-sm-12">

                                        <div className="add-ticket-field">

                                            <label>
                                                Job Title *
                                            </label>

                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Enter job title"
                                                value={
                                                    jobTitle
                                                }
                                                onChange={(e) =>
                                                    setJobTitle(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">

                                        <div className="add-ticket-field">

                                            <label>
                                                Priority *
                                            </label>

                                            <select
                                                className="form-input"
                                                value={
                                                    priority
                                                }
                                                onChange={(e) =>
                                                    setPriority(
                                                        e.target.value
                                                    )
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

                                    <div className="col-lg-6 col-md-6 col-sm-12">

                                        <div className="add-ticket-field">

                                            <label>
                                                Expecting Date *
                                            </label>

                                            <div className="add-ticket-input-icon">

                                                <i className="bi bi-calendar3"></i>

                                                <input
                                                    className="form-input"
                                                    type="date"
                                                    min={
                                                        today
                                                    }
                                                    value={
                                                        preferredDate
                                                    }
                                                    onChange={(e) =>
                                                        setPreferredDate(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">

                                        <div className="add-ticket-field">

                                            <label>
                                                Job Description
                                                <span>
                                                    {" "}Optional
                                                </span>
                                            </label>

                                            <textarea
                                                className="form-input"
                                                placeholder="Add additional instructions or work details..."
                                                value={
                                                    jobDescription
                                                }
                                                onChange={(e) =>
                                                    setJobDescription(
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={
                                                    500
                                                }
                                            />

                                            <small>
                                                {
                                                    jobDescription.length
                                                }
                                                /500
                                            </small>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div className="add-ticket-assignment">

                                <div className="add-ticket-assignment-head">

                                    <div className="add-ticket-assignment-icon">

                                        <i className="bi bi-person-workspace"></i>

                                    </div>

                                    <div>

                                        <h4>
                                            Job Assignment
                                        </h4>

                                        <p>
                                            Choose whether the job should
                                            be available to technicians or
                                            assigned directly.
                                        </p>

                                    </div>

                                </div>

                                <div className="add-ticket-assignment-options">

                                    <button
                                        type="button"
                                        className={`add-ticket-assignment-option ${assignmentType ===
                                            "open_pool"
                                            ? "add-ticket-assignment-option-active"
                                            : ""
                                            }`}
                                        onClick={() => {

                                            setAssignmentType(
                                                "open_pool"
                                            );

                                            setSelectedTechnician(
                                                null
                                            );

                                            setSearchTechnician(
                                                ""
                                            );

                                        }}
                                    >

                                        <div className="add-ticket-assignment-radio">

                                            {assignmentType ===
                                                "open_pool" ? (
                                                <i className="bi bi-check"></i>
                                            ) : null}

                                        </div>

                                        <div className="add-ticket-assignment-option-icon">

                                            <i className="bi bi-people"></i>

                                        </div>

                                        <div className="add-ticket-assignment-option-content">

                                            <strong>
                                                Open Pool
                                            </strong>

                                            <span>
                                                Make the job available to
                                                eligible technicians.
                                            </span>

                                        </div>

                                    </button>

                                    <button
                                        type="button"
                                        className={`add-ticket-assignment-option ${assignmentType ===
                                            "technician"
                                            ? "add-ticket-assignment-option-active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setAssignmentType(
                                                "technician"
                                            )
                                        }
                                    >

                                        <div className="add-ticket-assignment-radio">

                                            {assignmentType ===
                                                "technician" ? (
                                                <i className="bi bi-check"></i>
                                            ) : null}

                                        </div>

                                        <div className="add-ticket-assignment-option-icon">

                                            <i className="bi bi-person-check"></i>

                                        </div>

                                        <div className="add-ticket-assignment-option-content">

                                            <strong>
                                                Select Technician
                                            </strong>

                                            <span>
                                                Assign the job directly to
                                                one technician.
                                            </span>

                                        </div>

                                    </button>

                                </div>

                                {assignmentType ===
                                    "open_pool" && (

                                        <div className="add-ticket-open-pool-info">

                                            <i className="bi bi-broadcast"></i>

                                            <div>

                                                <strong>
                                                    Job will be added to Open
                                                    Pool
                                                </strong>

                                                <p>
                                                    Eligible technicians can
                                                    view and take this job from
                                                    their mobile app.
                                                </p>

                                            </div>

                                        </div>

                                    )}

                                {assignmentType ===
                                    "technician" && (

                                        <div className="add-ticket-technician-selection">

                                            <div className="add-ticket-field">

                                                <label>
                                                    Select Technician *
                                                </label>

                                                <div className="add-ticket-search">

                                                    <i className="bi bi-search"></i>

                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        placeholder="Search technician by name, specialization, status or ID..."
                                                        value={
                                                            searchTechnician
                                                        }
                                                        onChange={(e) =>
                                                            setSearchTechnician(
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    {searchTechnician && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSearchTechnician(
                                                                    ""
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-x"></i>
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                            <div className="add-ticket-customer-list">

                                                <div className="add-ticket-technician-grid row">

                                                    {techniciansLoading ? (

                                                        <div className="col-12">

                                                            <div className="add-ticket-no-customer">

                                                                <div>
                                                                    <i className="bi bi-hourglass-split"></i>
                                                                </div>

                                                                <h4>
                                                                    Loading technicians...
                                                                </h4>

                                                                <p>
                                                                    Fetching technicians from users.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    ) : filteredTechnicians.length >
                                                        0 ? (

                                                        filteredTechnicians.map(
                                                            (
                                                                technician
                                                            ) => (

                                                                <div
                                                                    className="col-lg-6 col-md-6 col-sm-12"
                                                                    key={
                                                                        technician.id
                                                                    }
                                                                >

                                                                    <button
                                                                        type="button"
                                                                        className={`add-ticket-customer ${selectedTechnician?.id ===
                                                                            technician.id
                                                                            ? "add-ticket-customer-selected"
                                                                            : ""
                                                                            }`}
                                                                        onClick={() =>
                                                                            setSelectedTechnician(
                                                                                technician
                                                                            )
                                                                        }
                                                                    >

                                                                        <div className="add-ticket-customer-info">

                                                                            <strong>
                                                                                {
                                                                                    technician.name
                                                                                }
                                                                            </strong>

                                                                            <span>
                                                                                {
                                                                                    technician.specialization
                                                                                }
                                                                            </span>

                                                                            <span>
                                                                                User ID:{" "}
                                                                                {
                                                                                    technician.id
                                                                                }
                                                                            </span>

                                                                            {technician.technicianId && (
                                                                                <span>
                                                                                    Technician ID:{" "}
                                                                                    {
                                                                                        technician.technicianId
                                                                                    }
                                                                                </span>
                                                                            )}

                                                                        </div>

                                                                        <small className="add-ticket-technician-pending">

                                                                            {
                                                                                technician.pendingTasks
                                                                            }{" "}
                                                                            Pending Tasks

                                                                        </small>

                                                                        <div
                                                                            className={`add-ticket-technician-status ${getTechnicianStatusClass(
                                                                                technician.status
                                                                            )}`}
                                                                        >

                                                                            <i className="bi bi-circle-fill"></i>

                                                                            {
                                                                                technician.status
                                                                            }

                                                                        </div>

                                                                        <i className="bi bi-chevron-right add-ticket-customer-arrow"></i>

                                                                    </button>

                                                                </div>

                                                            )
                                                        )

                                                    ) : (

                                                        <div className="col-12">

                                                            <div className="add-ticket-no-customer">

                                                                <div>

                                                                    <i className="bi bi-person-x"></i>

                                                                </div>

                                                                <h4>
                                                                    No technician found
                                                                </h4>

                                                                <p>
                                                                    No user with the
                                                                    TECHNICIAN role
                                                                    matches your search.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                            {selectedTechnician && (

                                                <div className="add-ticket-selected-technician">

                                                    <div className="add-ticket-technician-avatar">

                                                        <i className="bi bi-person"></i>

                                                    </div>

                                                    <div className="add-ticket-technician-info">

                                                        <strong>
                                                            {
                                                                selectedTechnician.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                selectedTechnician.specialization
                                                            }
                                                        </span>

                                                        <span>
                                                            User ID:{" "}
                                                            {
                                                                selectedTechnician.id
                                                            }
                                                        </span>

                                                    </div>

                                                    <div
                                                        className={`add-ticket-technician-status ${getTechnicianStatusClass(
                                                            selectedTechnician.status
                                                        )}`}
                                                    >

                                                        <i className="bi bi-circle-fill"></i>

                                                        {
                                                            selectedTechnician.status
                                                        }

                                                    </div>

                                                </div>

                                            )}

                                        </div>

                                    )}

                            </div>

   

                            <div className="add-ticket-final-summary">

                                <div className="add-ticket-final-summary-head">

                                    <i className="bi bi-check2-circle"></i>

                                    <strong>
                                        Ready to Create
                                    </strong>

                                </div>

                                <div className="add-ticket-final-summary-grid">

                                    <div>

                                        <span>
                                            Customer
                                        </span>

                                        <strong>
                                            {
                                                selectedCustomer?.name ||
                                                "-"
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Ticket ID
                                        </span>

                                        <strong>
                                            {
                                                createdTicket?.id
                                                    ? `#${createdTicket.id}`
                                                    : "-"
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Job
                                        </span>

                                        <strong>
                                            {
                                                jobTitle ||
                                                "-"
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Priority
                                        </span>

                                        <strong
                                            className={`review-priority ${getPriorityClass()}`}
                                        >

                                            <i className="bi bi-circle-fill"></i>

                                            {
                                                priority
                                            }

                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Assignment
                                        </span>

                                        <strong>
                                            {
                                                assignmentType ===
                                                    "open_pool"
                                                    ? "Open Pool"
                                                    : selectedTechnician?.name ||
                                                    "-"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </div>



                <div className="add-ticket-footer">

                    <button
                        type="button"
                        className="add-ticket-back"
                        onClick={handleStepBack}
                        disabled={
                            currentStep === 1 ||
                            loading
                        }
                    >

                        <i className="bi bi-arrow-left"></i>

                        Back

                    </button>

                    {currentStep < 3 ? (

                        <button
                            type="button"
                            className="add-ticket-next"
                            onClick={goNext}
                            disabled={loading}
                        >

                            {loading &&
                                currentStep === 2
                                ? "Creating Ticket..."
                                : "Next"}

                            {!loading ||
                                currentStep !== 2 ? (
                                <i className="bi bi-arrow-right"></i>
                            ) : null}

                        </button>

                    ) : (

                        <button
                            type="button"
                            className="add-ticket-create"
                            onClick={
                                createTicketAndJob
                            }
                            disabled={loading}
                        >

                            <i className="bi bi-check-circle"></i>

                            {loading
                                ? "Creating Job..."
                                : "Create Ticket & Job"}

                        </button>

                    )}

                </div>

            </div>

            {showAddCustomer && (

                <div className="customers-add-popup-wrapper">

                    <AddCustomers
                        onClose={() =>
                            setShowAddCustomer(
                                false
                            )
                        }
                    />

                </div>

            )}

        </>
    );
}

export default AddTicket;

