"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import "./add-customers.css";
import { createCustomer } from "../apiservice/customersservice";
import { getUserById } from "../apiservice/userservice";

interface AddCustomersProps {
    onClose: () => void;
}

interface UserResponse {
    id: number;
    name?: string;
    phone?: string;
    companyId?: number;
}

function AddCustomers({ onClose }: AddCustomersProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

            const createdBy =
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

            if (!createdBy) {
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

            const companyId = user.companyId;

            if (!companyId) {
                Swal.fire({
                    icon: "warning",
                    title: "Company Information Missing",
                    text: "The logged-in user is not associated with a company.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                return;
            }

            await createCustomer({
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                pincode: pincode.trim(),
                companyId: Number(companyId),
                createdBy: createdBy,
            });
            onClose();
            await Swal.fire({
                icon: "success",
                title: "Customer Added",
                text: "Customer has been added successfully.",
                timer: 2000,
                showConfirmButton: false,
            });



        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to add customer.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-customer">

            <div className="add-customer-top">

                <div className="customer-field-top">

                    <div className="customer-icon-box">
                        <i className="bi bi-person"></i>
                    </div>

                    <div className="add-title-customer">
                        <h3>
                            Add Customer
                        </h3>
                    </div>

                </div>

                <button
                    type="button"
                    className="add-customer-close"
                    onClick={onClose}
                    aria-label="Close"
                    disabled={submitting}
                >
                    <i className="bi bi-x-lg"></i>
                </button>

            </div>


            <div className="add-customer-head">

                <span>
                    <i className="bi bi-person-vcard"></i>
                </span>

                <h3>
                    1. CUSTOMER DETAILS
                </h3>

            </div>


            <div className="customer-forms-settings">

                <div className="row">

                    <div className="col-lg-6 col-md-6 col-sm-12">

                        <div className="customer-input-label">

                            <div className="customer-label-form">
                                Customer Name *
                            </div>

                            <input
                                type="text"
                                className="customer-form-input"
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

                        <div className="customer-input-label">

                            <div className="customer-label-form">
                                Phone Number *
                            </div>

                            <input
                                type="tel"
                                className="customer-form-input"
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

                        <div className="customer-input-label">

                            <div className="customer-label-form">
                                Address *
                            </div>

                            <textarea
                                className="customer-form-input customer-address-input"
                                placeholder="Enter customer address"
                                rows={4}
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.target.value)
                                }
                                disabled={submitting}
                            ></textarea>

                        </div>

                    </div>


                    <div className="col-lg-6 col-md-6 col-sm-12">

                        <div className="customer-input-label">

                            <div className="customer-label-form">
                                Pincode *
                            </div>

                            <input
                                type="text"
                                className="customer-form-input"
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


            <div className="add-customer-footer">

                <button
                    type="button"
                    className="add-customer-cancel"
                    onClick={onClose}
                    disabled={submitting}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="add-customer-submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                >

                    {submitting ? (
                        <>
                            <i className="bi bi-arrow-repeat"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-circle"></i>
                            Save Customer
                        </>
                    )}

                </button>

            </div>

        </div>
    );
}

export default AddCustomers;