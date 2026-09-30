"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./add-job.css";

import {
getAllTickets,
Ticket,
} from "../apiservice/ticketservice";

import {
Customer,
getAllCustomers,
} from "../apiservice/customersservice";

function AddJob() {

const router = useRouter();
const [tickets, setTickets] = useState<Ticket[]>([]);
const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const loadData = async () => {
    try {
        setLoading(true);
        const [
            ticketsResponse,
            customersResponse,
        ] = await Promise.all([
            getAllTickets(),
            getAllCustomers(),
        ]);
        setTickets(ticketsResponse || []);
        setCustomers(customersResponse || []);
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
        setLoading(false);
    }
};

useEffect(() => {
    loadData();
}, []);

const getCustomer = (
    customerId: number
) => {
    return customers.find(
        (customer) =>
            customer.id === customerId
    );
};

const filteredTickets = useMemo(() => {
    const value = search
        .toLowerCase()
        .trim();

    if (!value) {
        return tickets;
    }

    return tickets.filter((ticket) => {
        const customer =
            getCustomer(
                ticket.customerId
            );

        return (
            String(ticket.id)
                .toLowerCase()
                .includes(value) ||

            String(
                ticket.serviceTypeId
            )
                .toLowerCase()
                .includes(value) ||

            (
                ticket.ticketNote || ""
            )
                .toLowerCase()
                .includes(value) ||

            (
                customer?.name || ""
            )
                .toLowerCase()
                .includes(value) ||

            (
                customer?.phone || ""
            )
                .toLowerCase()
                .includes(value)
        );
    });
}, [
    tickets,
    customers,
    search,
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
            text: "This ticket does not have a customer assigned.",
            showConfirmButton: false,
            timer: 2200,
        });

        return;
    }

    localStorage.setItem(
        "add_job_ticket_id",
        String(ticket.id)
    );

    router.push(
        "/add-ticket?mode=create-job"
    );
};

const handleBack = () => {
    router.back();
};

return (
    <div className="add-job-page">

        <div className="add-job-header">

            <div className="add-job-header-left">

                <button
                    type="button"
                    className="add-job-back-button"
                    onClick={handleBack}
                >
                    <i className="bi bi-arrow-left"></i>
                </button>

                <div>

                    <h1>
                        Create New Job
                    </h1>

                    <p>
                        Select an existing ticket to create a service job.
                    </p>

                </div>

            </div>

        </div>

        <div className="add-job-container">

            <div className="add-job-panel">

                <div className="add-job-panel-header">

                    <div className="add-job-section-icon">
                        <i className="bi bi-ticket-perforated"></i>
                    </div>

                    <div>

                        <h2>
                            Select Ticket
                        </h2>

                        <p>
                            Choose the ticket for which you want to create a job.
                        </p>

                    </div>

                </div>

                <div className="add-job-search-wrapper">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        className="add-job-search"
                        placeholder="Search by ticket ID, customer name, phone or complaint..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="add-job-search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    )}

                </div>

                <div className="add-job-ticket-count">

                    <span>
                        Available Tickets
                    </span>

                    <strong>
                        {filteredTickets.length}
                    </strong>

                </div>

                <div className="add-job-ticket-list">

                    {loading ? (

                        <div className="add-job-empty-state">

                            <div className="add-job-loading-icon">
                                <i className="bi bi-hourglass-split"></i>
                            </div>

                            <h3>
                                Loading Tickets
                            </h3>

                            <p>
                                Fetching available tickets...
                            </p>

                        </div>

                    ) : filteredTickets.length > 0 ? (

                        filteredTickets.map(
                            (ticket) => {

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
                                        className="add-job-ticket-card"
                                        onClick={() =>
                                            handleSelectTicket(
                                                ticket
                                            )
                                        }
                                    >

                                        <div className="add-job-ticket-icon">

                                            <i className="bi bi-ticket-perforated"></i>

                                        </div>

                                        <div className="add-job-ticket-content">

                                            <div className="add-job-ticket-top">

                                                <strong>
                                                    #
                                                    {
                                                        ticket.ticketId
                                                    }
                                                </strong>

                                                <span className="add-job-ticket-status">
                                                    <b></b>
                                                    Open
                                                </span>

                                            </div>

                                            <div className="add-job-ticket-customer">

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

                                            <div className="add-job-ticket-details">

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
                                                <p className="add-job-ticket-note">
                                                    {
                                                        ticket.ticketNote
                                                    }
                                                </p>
                                            )}

                                        </div>

                                        <div className="add-job-ticket-arrow">

                                            <i className="bi bi-chevron-right"></i>

                                        </div>

                                    </button>
                                );
                            }
                        )

                    ) : (

                        <div className="add-job-empty-state">

                            <div className="add-job-empty-icon">
                                <i className="bi bi-ticket-x"></i>
                            </div>

                            <h3>
                                No Tickets Found
                            </h3>

                            <p>
                                {search
                                    ? "No tickets match your search."
                                    : "There are no tickets available for creating a job."}
                            </p>

                            {search && (
                                <button
                                    type="button"
                                    className="add-job-clear-search"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    Clear Search
                                </button>
                            )}

                        </div>

                    )}

                </div>

                <div className="add-job-info">

                    <div className="add-job-info-icon">
                        <i className="bi bi-info-circle"></i>
                    </div>

                    <div>

                        <strong>
                            What happens next?
                        </strong>

                        <p>
                            After selecting a ticket, you will be taken
                            directly to the Create Job section. The
                            selected ticket and its customer will already
                            be linked to the new job.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    </div>
);


}

export default AddJob;
