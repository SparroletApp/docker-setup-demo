"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./service-type.css";
import {
    ServiceType,
    getAllServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType,
} from "../apiservice/servicetype";

function ServiceTypePage() {
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        description: "",
    });

    const getCurrentUser = () => {
        if (typeof window === "undefined") {
            return null;
        }

        const user = sessionStorage.getItem("user");

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user);
        } catch {
            return null;
        }
    };

    const getCurrentUserPhone = () => {
        const user = getCurrentUser();

        return (
            user?.phone?.toString() ||
            user?.user_phone?.toString() ||
            user?.userPhone?.toString() ||
            ""
        );
    };

    const loadServiceTypes = async () => {
        try {
            setLoading(true);

            const data = await getAllServiceTypes();

            setServiceTypes(data || []);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to load",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load service types",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServiceTypes();
    }, []);

    const openAddPopup = () => {
        setIsEdit(false);

        setFormData({
            id: 0,
            name: "",
            description: "",
        });

        setShowPopup(true);
    };

    const openEditPopup = (serviceType: ServiceType) => {
        setIsEdit(true);

        setFormData({
            id: serviceType.id,
            name: serviceType.name,
            description: serviceType.description || "",
        });

        setShowPopup(true);
    };

    const closePopup = () => {
        if (saving) {
            return;
        }

        setShowPopup(false);

        setFormData({
            id: 0,
            name: "",
            description: "",
        });
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const name = formData.name.trim();
        const description = formData.description.trim();

        if (!name) {
            Swal.fire({
                icon: "warning",
                title: "Name required",
                text: "Please enter a service type name.",
                timer: 1800,
                showConfirmButton: false,
            });

            return;
        }

        const userPhone = getCurrentUserPhone();

        if (!userPhone) {
            Swal.fire({
                icon: "error",
                title: "User phone not found",
                text: "Unable to get the logged-in user's phone number from session storage.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        try {
            setSaving(true);

            if (isEdit) {
                const updatedServiceType = await updateServiceType({
                    id: formData.id,
                    name,
                    description,
                    updatedBy: userPhone,
                });

                setServiceTypes((previous) =>
                    previous.map((serviceType) =>
                        serviceType.id === formData.id
                            ? updatedServiceType
                            : serviceType
                    )
                );

                setShowPopup(false);

                setFormData({
                    id: 0,
                    name: "",
                    description: "",
                });

                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Service type updated successfully.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                const createdServiceType = await createServiceType({
                    name,
                    description,
                    createdBy: userPhone,
                });

                setServiceTypes((previous) => [
                    createdServiceType,
                    ...previous,
                ]);

                setShowPopup(false);

                setFormData({
                    id: 0,
                    name: "",
                    description: "",
                });

                Swal.fire({
                    icon: "success",
                    title: "Created",
                    text: "Service type created successfully.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: isEdit ? "Update failed" : "Creation failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete service type?",
            text: `"${name}" will be removed from the service type list.`,
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc3545",
        });

        if (!result.isConfirmed) {
            return;
        }

        const userPhone = getCurrentUserPhone();

        if (!userPhone) {
            Swal.fire({
                icon: "error",
                title: "User phone not found",
                text: "Unable to get the logged-in user's phone number from session storage.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        try {
            await deleteServiceType({
                id,
                deletedBy: userPhone,
            });

            setServiceTypes((previous) =>
                previous.filter((serviceType) => serviceType.id !== id)
            );

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Service type deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete service type",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const filteredServiceTypes = serviceTypes.filter((serviceType) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) {
            return true;
        }

        return (
            serviceType.name.toLowerCase().includes(search) ||
            (serviceType.description || "")
                .toLowerCase()
                .includes(search)
        );
    });

    return (
        <div className="service-type-page">

            <div className="service-type-header">
                <div>
                    <h1>Service Types</h1>
                    <p>
                        Manage the types of services your team provides.
                    </p>
                </div>

                <button
                    type="button"
                    className="service-type-add-btn"
                    onClick={openAddPopup}
                >
                    <i className="bi bi-plus-lg"></i>
                    Add Service Type
                </button>
            </div>

            <div className="service-type-content">

                <div className="service-type-toolbar">

                    <div className="service-type-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search service types..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="service-type-search-clear"
                                onClick={() => setSearchTerm("")}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                    </div>

                    <div className="service-type-count">
                        <span>{filteredServiceTypes.length}</span>
                        {filteredServiceTypes.length === 1
                            ? " Service Type"
                            : " Service Types"}
                    </div>

                </div>

                <div className="service-type-table-wrapper">

                    {loading ? (
                        <div className="service-type-state">
                            <div className="service-type-spinner"></div>
                            <p>Loading service types...</p>
                        </div>
                    ) : filteredServiceTypes.length === 0 ? (
                        <div className="service-type-state">

                            <div className="service-type-empty-icon">
                                <i className="bi bi-tools"></i>
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No service types found"
                                    : "No service types yet"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try changing your search."
                                    : "Create your first service type to get started."}
                            </p>

                        </div>
                    ) : (
                        <table className="service-type-table">

                            <thead>
                                <tr>
                                    <th>SERVICE TYPE</th>
                                    <th>DESCRIPTION</th>
                                    <th>CREATED DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredServiceTypes.map((serviceType) => (
                                    <tr key={serviceType.id}>

                                        <td>
                                            <div className="service-type-name">

                                                <div className="service-type-icon">
                                                    <i className="bi bi-tools"></i>
                                                </div>

                                                <div>
                                                    <span className="service-type-title">
                                                        {serviceType.name}
                                                    </span>

                                    
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            <span className="service-type-description">
                                                {serviceType.description || "—"}
                                            </span>
                                        </td>

                                    

                                        <td>
                                            <span className="service-type-date">
                                                {serviceType.createdAt
                                                    ? new Date(
                                                          serviceType.createdAt
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="service-type-status">
                                                <span className="service-type-status-dot"></span>
                                                Active
                                            </span>
                                        </td>

                                        <td>
                                            <div className="service-type-actions">

                                                <button
                                                    type="button"
                                                    className="service-type-action-btn edit"
                                                    title="Edit"
                                                    onClick={() =>
                                                        openEditPopup(
                                                            serviceType
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="service-type-action-btn delete"
                                                    title="Delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            serviceType.id,
                                                            serviceType.name
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash3"></i>
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}

                </div>

            </div>

            {showPopup && (
                <div
                    className="service-type-modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePopup();
                        }
                    }}
                >

                    <div className="service-type-modal">

                        <div className="service-type-modal-header">

                            <div>
                                <h2>
                                    {isEdit
                                        ? "Edit Service Type"
                                        : "Add Service Type"}
                                </h2>

                                <p>
                                    {isEdit
                                        ? "Update the service type details."
                                        : "Create a new service type."}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="service-type-modal-close"
                                onClick={closePopup}
                                disabled={saving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <form
                            className="service-type-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="service-type-form-group">

                                <label htmlFor="service-type-name">
                                    Service Type Name
                                    <span>*</span>
                                </label>

                                <input
                                    id="service-type-name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter service type name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    maxLength={150}
                                    autoFocus
                                />

                            </div>

                            <div className="service-type-form-group">

                                <label htmlFor="service-type-description">
                                    Description
                                </label>

                                <textarea
                                    id="service-type-description"
                                    name="description"
                                    placeholder="Enter service type description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                />

                            </div>

                            <div className="service-type-modal-footer">

                                <button
                                    type="button"
                                    className="service-type-cancel-btn"
                                    onClick={closePopup}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="service-type-save-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="service-type-button-spinner"></span>
                                            {isEdit
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            <i
                                                className={
                                                    isEdit
                                                        ? "bi bi-check-lg"
                                                        : "bi bi-plus-lg"
                                                }
                                            ></i>

                                            {isEdit
                                                ? "Update Service Type"
                                                : "Create Service Type"}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ServiceTypePage;
