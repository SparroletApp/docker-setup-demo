"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./tickets.css";

import {
    Ticket,
    getAllTickets,
    deleteTicket,
    updateTicket,
} from "../apiservice/ticketservice";

import {
    Customer,
    getCustomerById,
    getAllCustomers,
} from "../apiservice/customersservice";

import {
    getServiceTypeById,
    getAllServiceTypes,
    ServiceType,
} from "../apiservice/servicetype";

import {
    getAllJobs,
    Job,
} from "../apiservice/jobservice";

interface TicketRow extends Ticket {
    customer?: Customer;
    serviceType?: ServiceType;
}

function Tickets() {
    const router = useRouter();

    const [tickets, setTickets] = useState<TicketRow[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const [showEditPopup, setShowEditPopup] =
        useState(false);

    const [editingTicket, setEditingTicket] =
        useState<TicketRow | null>(null);

    const [editCustomerId, setEditCustomerId] =
        useState<number | "">("");

    const [editServiceTypeId, setEditServiceTypeId] =
        useState<number | "">("");

    const [editTicketNote, setEditTicketNote] =
        useState("");

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [serviceTypes, setServiceTypes] =
        useState<ServiceType[]>([]);

    const [savingTicket, setSavingTicket] =
        useState(false);

    const handleAddTicket = () => {
        router.push("/add-ticket");
    };

    const loadTickets = async () => {
        try {
            setLoading(true);

            const [
                ticketData,
                jobData,
                customerData,
                serviceTypeData,
            ] = await Promise.all([
                getAllTickets(),
                getAllJobs(),
                getAllCustomers(),
                getAllServiceTypes(),
            ]);

            setJobs(jobData || []);
            setCustomers(customerData || []);
            setServiceTypes(serviceTypeData || []);

            if (!ticketData || ticketData.length === 0) {
                setTickets([]);
                return;
            }

            const ticketRows = await Promise.all(
                ticketData.map(async (ticket) => {
                    let customer:
                        | Customer
                        | undefined;

                    let serviceType:
                        | ServiceType
                        | undefined;

                    try {
                        if (ticket.customerId) {
                            customer =
                                await getCustomerById(
                                    ticket.customerId
                                );
                        }
                    } catch (error) {
                        console.error(
                            "Error loading customer:",
                            error
                        );
                    }

                    try {
                        if (ticket.serviceTypeId) {
                            serviceType =
                                await getServiceTypeById({
                                    id: ticket.serviceTypeId,
                                });
                        }
                    } catch (error) {
                        console.error(
                            "Error loading service type:",
                            error
                        );
                    }

                    return {
                        ...ticket,
                        customer,
                        serviceType,
                    };
                })
            );

            setTickets(ticketRows);
        } catch (error) {
            console.error(
                "Error loading tickets:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Failed to load tickets",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load tickets.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

const handleViewTicket = (id: number) => {
    localStorage.setItem("ticket_id", id.toString());

    console.log("Saved ticket ID:", localStorage.getItem("ticket_id"));

    router.push("/ticket-view");
};

    const handleEditTicket = (
        ticket: TicketRow
    ) => {
        setEditingTicket(ticket);

        setEditCustomerId(
            ticket.customerId || ""
        );

        setEditServiceTypeId(
            ticket.serviceTypeId || ""
        );

        setEditTicketNote(
            ticket.ticketNote || ""
        );

        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        if (savingTicket) {
            return;
        }

        setShowEditPopup(false);
        setEditingTicket(null);

        setEditCustomerId("");
        setEditServiceTypeId("");
        setEditTicketNote("");
    };

    const handleUpdateTicket = async () => {
        if (!editingTicket) {
            return;
        }

        if (!editCustomerId) {
            Swal.fire({
                icon: "warning",
                title: "Customer required",
                text: "Please select a customer.",
                timer: 1800,
                showConfirmButton: false,
            });

            return;
        }

        if (!editServiceTypeId) {
            Swal.fire({
                icon: "warning",
                title: "Service type required",
                text: "Please select a service type.",
                timer: 1800,
                showConfirmButton: false,
            });

            return;
        }

        try {
            setSavingTicket(true);

            const storedUser =
                sessionStorage.getItem("user");

            let updatedBy = "System";

            if (storedUser) {
                try {
                    const user =
                        JSON.parse(storedUser);

                    updatedBy =
                        user.userName ||
                        user.user_name ||
                        user.email ||
                        "System";
                } catch {
                    updatedBy = storedUser;
                }
            }

            await updateTicket({
                id: editingTicket.id,
                customerId: Number(
                    editCustomerId
                ),
                serviceTypeId: Number(
                    editServiceTypeId
                ),
                ticketNote:
                    editTicketNote.trim(),
                updatedBy,
            });

            const updatedCustomer =
                customers.find(
                    (customer) =>
                        customer.id ===
                        Number(editCustomerId)
                );

            const updatedServiceType =
                serviceTypes.find(
                    (serviceType) =>
                        serviceType.id ===
                        Number(
                            editServiceTypeId
                        )
                );

            setTickets(
                (currentTickets) =>
                    currentTickets.map(
                        (ticket) =>
                            ticket.id ===
                            editingTicket.id
                                ? {
                                      ...ticket,
                                      customerId:
                                          Number(
                                              editCustomerId
                                          ),
                                      serviceTypeId:
                                          Number(
                                              editServiceTypeId
                                          ),
                                      ticketNote:
                                          editTicketNote.trim(),
                                      customer:
                                          updatedCustomer,
                                      serviceType:
                                          updatedServiceType,
                                  }
                                : ticket
                    )
            );

            setShowEditPopup(false);
            setEditingTicket(null);

            setEditCustomerId("");
            setEditServiceTypeId("");
            setEditTicketNote("");

            Swal.fire({
                icon: "success",
                title: "Ticket updated",
                text: `${editingTicket.ticketId} has been updated successfully.`,
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Error updating ticket:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Update failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to update the ticket.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setSavingTicket(false);
        }
    };

    const handleDeleteTicket = async (
        ticket: TicketRow
    ) => {
        const ticketHasJob = jobs.some(
            (job) =>
                Number(job.ticketId) ===
                Number(ticket.id)
        );

        if (ticketHasJob) {
            Swal.fire({
                icon: "warning",
                title: "Ticket cannot be deleted",
                text:
                    "A job is assigned to this ticket. Please remove or complete the assigned job before deleting this ticket.",
                confirmButtonText: "Okay",
            });

            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Delete ticket?",
            text: `Are you sure you want to delete ${ticket.ticketId}? This action cannot be undone.`,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteTicket({
                id: ticket.id,
            });

            setTickets((currentTickets) =>
                currentTickets.filter(
                    (item) =>
                        item.id !== ticket.id
                )
            );

            Swal.fire({
                icon: "success",
                title: "Ticket deleted",
                text: `${ticket.ticketId} has been deleted successfully.`,
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Error deleting ticket:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete the ticket.",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const formatDate = (date?: string) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
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

    return (
        <>
            <div className="dashboard-header">
                <div className="left-header-dashboard">
                    Tickets
                </div>

                <div className="right-header-dashboard">
                    <button
                        type="button"
                        onClick={handleAddTicket}
                    >
                        <span>
                            <i className="bi bi-plus-lg"></i>
                        </span>

                        New Ticket
                    </button>
                </div>
            </div>

            <div className="admin-ticket-table-wrapper">
                <div className="admin-ticket-table-scroll">
                    {loading ? (
                        <div className="admin-ticket-state">
                            <div className="admin-ticket-spinner"></div>

                            <p>
                                Loading tickets...
                            </p>
                        </div>
                    ) : tickets.length ===
                      0 ? (
                        <div className="admin-ticket-state">
                            <div className="admin-ticket-empty-icon">
                                <i className="bi bi-ticket-perforated"></i>
                            </div>

                            <h3>
                                No tickets found
                            </h3>

                            <p>
                                Create your first
                                service ticket to
                                get started.
                            </p>
                        </div>
                    ) : (
                        <table className="admin-ticket-table">
                            <thead>
                                <tr>
                                    <th>
                                        TICKET ID
                                    </th>

                                    <th>
                                        CUSTOMER
                                    </th>

                                    <th>
                                        SERVICE TYPE
                                    </th>

                                    <th>
                                        TICKET DESCRIPTION
                                    </th>

                                    <th>
                                        CREATED AT
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tickets.map(
                                    (
                                        ticket
                                    ) => (
                                        <tr
                                            key={
                                                ticket.id
                                            }
                                        >
                                            <td>
                                                <span className="admin-ticket-id">
                                                    {
                                                        ticket.ticketId
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-ticket-customer">
                                                    <span className="admin-ticket-customer-name">
                                                        {ticket
                                                            .customer
                                                            ?.name ||
                                                            "Customer not found"}
                                                    </span>

                                                    <span className="admin-ticket-location">
                                                        {ticket
                                                            .customer
                                                            ?.phone ||
                                                            "Phone not available"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="admin-ticket-category admin-ticket-category-hvac">
                                                    <i className="bi bi-tools"></i>

                                                    <span>
                                                        {ticket
                                                            .serviceType
                                                            ?.name ||
                                                            "Service type not found"}
                                                    </span>
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-ticket-note">
                                                    {ticket.ticketNote ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-ticket-time">
                                                    <i className="bi bi-calendar3"></i>

                                                    <span>
                                                        {formatDate(
                                                            ticket.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="admin-ticket-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-ticket-action-button admin-ticket-action-view"
                                                        onClick={() =>
                                                            handleViewTicket(
                                                                ticket.id
                                                            )
                                                        }
                                                        title="View ticket"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-ticket-action-button admin-ticket-action-edit"
                                                        onClick={() =>
                                                            handleEditTicket(
                                                                ticket
                                                            )
                                                        }
                                                        title="Edit ticket"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-ticket-action-button admin-ticket-action-delete"
                                                        onClick={() =>
                                                            handleDeleteTicket(
                                                                ticket
                                                            )
                                                        }
                                                        title="Delete ticket"
                                                    >
                                                        <i className="bi bi-trash3"></i>
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
                    tickets.length >
                        0 && (
                        <div className="admin-ticket-table-footer">
                            <span className="admin-ticket-showing">
                                Showing 1 to{" "}
                                {
                                    tickets.length
                                }{" "}
                                of{" "}
                                {
                                    tickets.length
                                }{" "}
                                service
                                tickets
                            </span>

                            <div className="admin-ticket-pagination">
                                <button
                                    type="button"
                                    className="admin-ticket-page-button admin-ticket-page-disabled"
                                    disabled
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    className="admin-ticket-page-button admin-ticket-page-active"
                                >
                                    1
                                </button>

                                <button
                                    type="button"
                                    className="admin-ticket-page-button admin-ticket-page-disabled"
                                    disabled
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
            </div>

            {showEditPopup &&
                editingTicket && (
                    <div className="admin-ticket-modal-overlay">
                        <div className="admin-ticket-modal">
                            <div className="admin-ticket-modal-header">
                                <div>
                                    <h2>
                                        Edit Ticket
                                        <div className="admin-ticket-edit-ticket-id">
                                    <span>
                                        Ticket ID
                                    </span>

                                    <strong>
                                        {
                                            editingTicket.ticketId
                                        }
                                    </strong>
                                </div>
                                    </h2>

                                    <p>
                                        Update customer,
                                        service type and
                                        ticket details.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-ticket-modal-close"
                                    onClick={
                                        handleCloseEditPopup
                                    }
                                    disabled={
                                        savingTicket
                                    }
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            <div className="admin-ticket-modal-body">
                                

                                <div className="admin-ticket-form-group">
                                    <label>
                                        Customer
                                    </label>

                                    <select
                                        value={
                                            editCustomerId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditCustomerId(
                                                event
                                                    .target
                                                    .value
                                                    ? Number(
                                                          event
                                                              .target
                                                              .value
                                                      )
                                                    : ""
                                            )
                                        }
                                        disabled={
                                            savingTicket
                                        }
                                    >
                                        <option value="">
                                            Select
                                            customer
                                        </option>

                                        {customers.map(
                                            (
                                                customer
                                            ) => (
                                                <option
                                                    key={
                                                        customer.id
                                                    }
                                                    value={
                                                        customer.id
                                                    }
                                                >
                                                    {
                                                        customer.name
                                                    }

                                                    {customer.phone
                                                        ? ` - ${customer.phone}`
                                                        : ""}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="admin-ticket-form-group">
                                    <label>
                                        Service Type
                                    </label>

                                    <select
                                        value={
                                            editServiceTypeId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditServiceTypeId(
                                                event
                                                    .target
                                                    .value
                                                    ? Number(
                                                          event
                                                              .target
                                                              .value
                                                      )
                                                    : ""
                                            )
                                        }
                                        disabled={
                                            savingTicket
                                        }
                                    >
                                        <option value="">
                                            Select
                                            service
                                            type
                                        </option>

                                        {serviceTypes.map(
                                            (
                                                serviceType
                                            ) => (
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

                                <div className="admin-ticket-form-group">
                                    <label>
                                        Ticket
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            editTicketNote
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditTicketNote(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter ticket description"
                                        rows={5}
                                        disabled={
                                            savingTicket
                                        }
                                    />
                                </div>
                            </div>

                            <div className="admin-ticket-modal-footer">
                                <button
                                    type="button"
                                    className="admin-ticket-modal-cancel"
                                    onClick={
                                        handleCloseEditPopup
                                    }
                                    disabled={
                                        savingTicket
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="admin-ticket-modal-save"
                                    onClick={
                                        handleUpdateTicket
                                    }
                                    disabled={
                                        savingTicket
                                    }
                                >
                                    {savingTicket ? (
                                        <>
                                            <span className="admin-ticket-button-spinner"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>
                                            Update Ticket
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

export default Tickets;