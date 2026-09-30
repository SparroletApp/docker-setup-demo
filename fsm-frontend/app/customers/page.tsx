
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./customers.css";
import AddCustomers from "../add-customers/page";
import EditCustomer from "../edit-customer/page";
import {
    Customer,
    getAllCustomers,
    deleteCustomer,
} from "../apiservice/customersservice";

function Customers() {
    const [activeFilter, setActiveFilter] = useState("All Customers");

    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showEditCustomer, setShowEditCustomer] = useState(false);

    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);

            const response = await getAllCustomers();

            setCustomers(response);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load customers.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowEditCustomer(true);
    };

    const handleDelete = async (customer: Customer) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete Customer?",
            text: `Are you sure you want to delete ${customer.name}?`,
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const deletedBy =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("user_phone")
                    : null;

            if (!deletedBy) {
                Swal.fire({
                    icon: "warning",
                    title: "User Information Missing",
                    text: "Unable to identify the logged-in user.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                return;
            }

            await deleteCustomer({
                id: customer.id,
                deletedBy: deletedBy,
            });

            await Swal.fire({
                icon: "success",
                title: "Customer Deleted",
                text: "Customer has been deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadCustomers();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete customer.",
                timer: 2500,
                showConfirmButton: false,
            });
        }
    };

    return (
        <>
            <div className="dashboard-header">

                <div className="left-header-dashboard">
                    Customers
                </div>

                <div className="right-header-dashboard">

                    <button
                        type="button"
                        onClick={() => setShowAddCustomer(true)}
                    >
                        <span>
                            <i className="bi bi-plus-lg"></i>
                        </span>

                        New Customer
                    </button>

                </div>

            </div>

            <div className="customers-list">

                <div className="customers-data-header">

                    <div className="customer-filter-left">

                        <button
                            type="button"
                            className={`cutomers-filter-card ${activeFilter === "All Customers"
                                    ? "customer-filter-card-active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter("All Customers")
                            }
                        >
                            <span>
                                <i className="bi bi-people-fill"></i>
                            </span>

                            <div className="card-customer-right">

                                <h5>
                                    All Customers
                                </h5>

                                <div className="count-customer">
                                    ({customers.length})
                                </div>

                            </div>
                        </button>

                        <button
                            type="button"
                            className={`cutomers-filter-card ${activeFilter === "Recurring Service"
                                    ? "customer-filter-card-active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter("Recurring Service")
                            }
                        >
                            <span>
                                <i className="bi bi-arrow-repeat"></i>
                            </span>

                            <div className="card-customer-right">

                                <h5>
                                    Recurring Service
                                </h5>

                                <div className="count-customer">
                                    (0)
                                </div>

                            </div>
                        </button>

                        <button
                            type="button"
                            className={`cutomers-filter-card ${activeFilter === "One-Time / On-Demand"
                                    ? "customer-filter-card-active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveFilter(
                                    "One-Time / On-Demand"
                                )
                            }
                        >
                            <span>
                                <i className="bi bi-lightning"></i>
                            </span>

                            <div className="card-customer-right">

                                <h5>
                                    One-Time / On-Demand
                                </h5>

                                <div className="count-customer">
                                    (0)
                                </div>

                            </div>
                        </button>

                    </div>

                    <div className="customer-filter-right">

                        <button type="button">
                            <span>
                                <i className="bi bi-download"></i>
                            </span>

                            Export CSV
                        </button>

                        <button type="button">
                            <span>
                                <i className="bi bi-filter"></i>
                            </span>

                            Filter
                        </button>

                    </div>

                </div>

                <div className="customers-table-container">

                    <div className="customers-table-top">

                        <div>

                            <h2>
                                Client Directory & Accounts
                            </h2>

                            <p>
                                Viewing all active enterprise,
                                commercial, and multi-facility
                                customers
                            </p>

                        </div>

                    </div>

                    <div className="customers-table-scroll">

                        <table className="customers-data-table">

                            <thead>

                                <tr>

                                    <th>
                                        CUSTOMER
                                    </th>

                                    <th>
                                        PHONE
                                    </th>

                                    <th>
                                        ADDRESS
                                    </th>
                                    <th>
                                        PINCODE
                                    </th>
                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            style={{
                                                textAlign: "center",
                                                padding: "40px",
                                            }}
                                        >
                                            Loading customers...
                                        </td>

                                    </tr>

                                ) : customers.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            style={{
                                                textAlign: "center",
                                                padding: "40px",
                                            }}
                                        >
                                            No customers found.
                                        </td>

                                    </tr>

                                ) : (

                                    customers.map((customer) => (

                                        <tr key={customer.id}>

                                            <td>

                                                <div className="customer-name-cell">

                                                    <div className="customer-avatar">

                                                        <i className="bi bi-person"></i>

                                                    </div>

                                                    <div className="customer-name-details">

                                                        <strong>
                                                            {customer.name}
                                                        </strong>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="customer-phone-cell">

                                                    <i className="bi bi-telephone"></i>

                                                    <span>
                                                        {customer.phone}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="customer-address-cell">

                                                    <i className="bi bi-geo-alt"></i>

                                                    <span>
                                                        {customer.address}
                                                    </span>

                                                </div>

                                            </td>
                                              <td>

                                                <div className="customer-address-cell">

                                                    <i className="bi bi-geo-alt"></i>

                                                    <span>
                                                        {customer.pincode}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="customer-action-buttons">

                                                    <button
                                                        type="button"
                                                        className="customer-edit-button"
                                                        title="Edit Customer"
                                                        onClick={() =>
                                                            handleEdit(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="customer-delete-button"
                                                        title="Delete Customer"
                                                        onClick={() =>
                                                            handleDelete(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="customers-table-footer">

                        <span>

                            {loading
                                ? "Loading..."
                                : customers.length === 0
                                    ? "Showing 0 customers"
                                    : `Showing 1-${customers.length} of ${customers.length} customers`}

                        </span>

                        <div className="customers-pagination">

                            <button
                                type="button"
                                disabled
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                className="customers-pagination-active"
                            >
                                1
                            </button>

                            <button type="button">
                                2
                            </button>

                            <button type="button">
                                3
                            </button>

                            <span>
                                ...
                            </span>

                            <button type="button">
                                10
                            </button>

                            <button type="button">
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {showAddCustomer && (

                <div className="customers-add-popup-wrapper">

                    <AddCustomers
                        onClose={() => {
                            setShowAddCustomer(false);
                            loadCustomers();
                        }}
                    />

                </div>

            )}

            {showEditCustomer && selectedCustomer && (

                <div className="customers-add-popup-wrapper">

                    <EditCustomer
                        customer={selectedCustomer}
                        onClose={() => {
                            setShowEditCustomer(false);
                            setSelectedCustomer(null);
                            loadCustomers();
                        }}
                    />

                </div>

            )}

        </>
    );
}

export default Customers;

