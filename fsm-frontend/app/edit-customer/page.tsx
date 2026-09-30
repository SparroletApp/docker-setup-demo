
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./edit-customer.css";
import { Customer, updateCustomer } from "../apiservice/customersservice";
import { getUserById } from "../apiservice/userservice";

interface EditCustomerProps {
    customer: Customer;
    onClose: () => void;
}

function EditCustomer({ customer, onClose }: EditCustomerProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!customer) {
            return;
        }

        setName(customer.name || "");
        setPhone(customer.phone || "");
        setAddress(customer.address || "");
        setPincode(customer.pincode || "");
    }, [customer]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Name Required",
                text: "Please enter customer name.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (!phone.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Phone Required",
                text: "Please enter customer phone number.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (!address.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Address Required",
                text: "Please enter customer address.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (!pincode.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Pincode Required",
                text: "Please enter customer pincode.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        try {
            setSubmitting(true);

            const userId =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("user_id")
                    : null;

            const updatedBy =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("user_phone")
                    : null;

            if (!userId) {
                Swal.fire({
                    icon: "warning",
                    title: "User Information Missing",
                    text: "Unable to identify the logged-in user.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            if (!updatedBy) {
                Swal.fire({
                    icon: "warning",
                    title: "User Phone Missing",
                    text: "Unable to identify the logged-in user's phone number.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            const user = await getUserById({
                id: Number(userId),
            });

            if (!user) {
                Swal.fire({
                    icon: "warning",
                    title: "User Not Found",
                    text: "Unable to find the logged-in user.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            const loggedInCompanyId = user.companyId;

            if (!loggedInCompanyId) {
                Swal.fire({
                    icon: "warning",
                    title: "Company Information Missing",
                    text: "The logged-in user is not associated with a company.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            await updateCustomer({
                id: customer.id,
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                pincode: pincode.trim(),
                companyId: Number(loggedInCompanyId),
                updatedBy,
            });

            await Swal.fire({
                icon: "success",
                title: "Customer Updated",
                text: "Customer has been updated successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            onClose();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to update customer.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="edit-customer-overlay">
            <div className="edit-customer">

                <div className="edit-customer-top">
                    <div className="edit-customer-field-top">
                        <div className="edit-customer-icon-box">
                            <i className="bi bi-person"></i>
                        </div>

                        <div className="edit-title-customer">
                            <h3>Edit Customer</h3>
                            <span>Update customer information</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="edit-customer-close"
                        onClick={onClose}
                        aria-label="Close"
                        disabled={submitting}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="edit-customer-body">

                    <div className="edit-customer-head">
                        <span>
                            <i className="bi bi-person-vcard"></i>
                        </span>

                        <div>
                            <h3>Customer Details</h3>
                            <p>Update the customer's basic information.</p>
                        </div>
                    </div>

                    <div className="edit-customer-forms-settings">
                        <div className="row">

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="edit-customer-input-label">
                                    <div className="edit-customer-label-form">
                                        Customer Name *
                                    </div>

                                    <input
                                        type="text"
                                        className="edit-customer-form-input"
                                        placeholder="Enter customer name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="edit-customer-input-label">
                                    <div className="edit-customer-label-form">
                                        Phone Number *
                                    </div>

                                    <input
                                        type="tel"
                                        className="edit-customer-form-input"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="edit-customer-input-label">
                                    <div className="edit-customer-label-form">
                                        Address *
                                    </div>

                                    <textarea
                                        className="edit-customer-form-input edit-customer-address-input"
                                        placeholder="Enter customer address"
                                        rows={4}
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="edit-customer-input-label">
                                    <div className="edit-customer-label-form">
                                        Pincode *
                                    </div>

                                    <input
                                        type="text"
                                        className="edit-customer-form-input"
                                        placeholder="Enter pincode"
                                        value={pincode}
                                        onChange={(e) =>
                                            setPincode(e.target.value)
                                        }
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="edit-customer-footer">
                    <button
                        type="button"
                        className="edit-customer-cancel"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="edit-customer-submit"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <i className="bi bi-arrow-repeat edit-customer-loading"></i>
                                Updating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i>
                                Update Customer
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditCustomer;
