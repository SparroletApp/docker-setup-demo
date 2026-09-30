"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import "./user-list.css";
import {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser,
    User,
} from "../apiservice/userservice";

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [showViewUser, setShowViewUser] = useState(false);

    const [formError, setFormError] = useState("");
    const [editFormError, setEditFormError] = useState("");

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        role: "ADMIN",
        status: "ACTIVE",
    });

    const [editFormData, setEditFormData] = useState({
        id: 0,
        name: "",
        phone: "",
        updatedBy: "",
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const data = await getAllUsers();

            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);

            await Swal.fire({
                icon: "error",
                title: "Failed to Load Users",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load users.",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getCurrentUserEmail = () => {
        if (typeof window === "undefined") {
            return "";
        }

        return sessionStorage.getItem("user_email") || "";
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (formError) {
            setFormError("");
        }
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (editFormError) {
            setEditFormError("");
        }
    };

    const resetAddForm = () => {
        setFormData({
            name: "",
            phone: "",
            role: "ADMIN",
            status: "ACTIVE",
        });

        setFormError("");
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Name Required",
                text: "Please enter the user name.",
            });
            return;
        }

        if (!formData.phone.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Phone Required",
                text: "Please enter the phone number.",
            });
            return;
        }

        const currentUserEmail = getCurrentUserEmail();

        if (!currentUserEmail) {
            await Swal.fire({
                icon: "warning",
                title: "User Email Not Found",
                text: "Logged-in user email was not found in session storage.",
            });
            return;
        }

        try {
            setSaving(true);
            setFormError("");

            await createUser({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                role: "ADMIN",
                createdBy: currentUserEmail,
            });

            setShowAddUser(false);

            resetAddForm();

            await fetchUsers();

            await Swal.fire({
                icon: "success",
                title: "User Added",
                text: "User has been created successfully.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to create user:", error);

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Unable to create user."
            );
        } finally {
            setSaving(false);
        }
    };

    const openEditUser = (user: User) => {
        const currentUserEmail = getCurrentUserEmail();

        setSelectedUser(user);
        setEditFormError("");

        setEditFormData({
            id: user.id,
            name: user.name || "",
            phone: user.phone || "",
            updatedBy: currentUserEmail,
        });

        setShowEditUser(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editFormData.name.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Name Required",
                text: "Please enter the user name.",
            });
            return;
        }

        if (!editFormData.phone.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Phone Required",
                text: "Please enter the phone number.",
            });
            return;
        }

        if (!editFormData.updatedBy) {
            await Swal.fire({
                icon: "warning",
                title: "User Email Not Found",
                text: "Logged-in user email was not found in session storage.",
            });
            return;
        }

        if (!editFormData.id) {
            await Swal.fire({
                icon: "error",
                title: "User ID Missing",
                text: "Unable to identify the user to update.",
            });
            return;
        }

        try {
            setSaving(true);
            setEditFormError("");

            await updateUser({
                id: editFormData.id,
                name: editFormData.name.trim(),
                phone: editFormData.phone.trim(),
                updatedBy: editFormData.updatedBy,
            });

            setShowEditUser(false);
            setSelectedUser(null);
            setEditFormError("");

            await fetchUsers();

            await Swal.fire({
                icon: "success",
                title: "User Updated",
                text: "User has been updated successfully.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to update user:", error);

            setEditFormError(
                error instanceof Error
                    ? error.message
                    : "Unable to update user."
            );
        } finally {
            setSaving(false);
        }
    };
const handleDeleteUser = async (user: User) => {
    const result = await Swal.fire({
        icon: "warning",
        title: "Delete User?",
        text: `Are you sure you want to delete ${
            user.name || `User #${user.id}`
        }?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
    });

    if (!result.isConfirmed) {
        return;
    }

    const currentUserEmail = getCurrentUserEmail();

    if (!currentUserEmail) {
        await Swal.fire({
            icon: "warning",
            title: "User Email Not Found",
            text: "Logged-in user email was not found in session storage.",
        });
        return;
    }

    try {
        setDeleting(true);

        await deleteUser({
            id: user.id,
            deletedBy: currentUserEmail,
        });

        if (selectedUser?.id === user.id) {
            setSelectedUser(null);
            setShowViewUser(false);
            setShowEditUser(false);
        }

        await fetchUsers();

        await Swal.fire({
            icon: "success",
            title: "User Deleted",
            text: "User has been deleted successfully.",
            timer: 1800,
            showConfirmButton: false,
        });
    } catch (error) {
        console.error("Failed to delete user:", error);

        await Swal.fire({
            icon: "error",
            title: "Failed to Delete User",
            text:
                error instanceof Error
                    ? error.message
                    : "Unable to delete user.",
            confirmButtonText: "OK",
        });
    } finally {
        setDeleting(false);
    }
};

    const openViewUser = (user: User) => {
        setSelectedUser(user);
        setShowViewUser(true);
    };

    const closeAllModals = () => {
        if (saving) {
            return;
        }

        setShowAddUser(false);
        setShowEditUser(false);
        setShowViewUser(false);

        setFormError("");
        setEditFormError("");

        setSelectedUser(null);
    };

    return (
        <div className="user-list-page">
            <div className="user-list-header">
                <div>
                    <h2>Users</h2>
                    <p>Manage all registered users</p>
                </div>

                <div className="user-list-header-actions">
                    <div className="user-list-total">
                        <span>Total Users</span>
                        <strong>{users.length}</strong>
                    </div>

                    <button
                        type="button"
                        className="user-list-add-button"
                        onClick={() => {
                            resetAddForm();
                            setShowAddUser(true);
                        }}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add User
                    </button>
                </div>
            </div>

            <div className="user-list-table-wrapper">
                <table className="user-list-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="user-list-empty"
                                >
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="user-list-empty"
                                >
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-list-user">
                                            <div className="user-list-avatar">
                                                <i className="bi bi-person"></i>
                                            </div>

                                            <div className="user-list-user-info">
                                                <strong>
                                                    {user.name ||
                                                        `User #${user.id}`}
                                                </strong>

                                                <span>
                                                    ID: #{user.id}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{user.phone || "-"}</td>

                                    <td>
                                        <span className="user-list-role">
                                            {user.role || "-"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`user-list-status ${
                                                user.status?.toLowerCase() ===
                                                "active"
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                        >
                                            {user.status || "-"}
                                        </span>
                                    </td>

                                    <td>{user.createdBy || "-"}</td>

                                    <td>
                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString("en-IN", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </td>

                                    <td>
                                        <div className="user-list-actions">
                                            <button
                                                type="button"
                                                className="user-list-action"
                                                title="View"
                                                onClick={() =>
                                                    openViewUser(user)
                                                }
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="user-list-action"
                                                title="Edit"
                                                onClick={() =>
                                                    openEditUser(user)
                                                }
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="user-list-action user-list-delete-action"
                                                title="Delete"
                                                onClick={() =>
                                                    handleDeleteUser(user)
                                                }
                                                disabled={deleting}
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showAddUser && (
                <div
                    className="user-list-modal-overlay"
                    onClick={closeAllModals}
                >
                    <div
                        className="user-list-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="user-list-modal-header">
                            <div>
                                <h3>Add User</h3>
                                <p>Create a new system user</p>
                            </div>

                            <button
                                type="button"
                                className="user-list-modal-close"
                                onClick={closeAllModals}
                                disabled={saving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddUser}>
                            <div className="user-list-modal-body">
                                <div className="user-list-form-group">
                                    <label htmlFor="name">Name</label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter user name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="user-list-form-group">
                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {formError && (
                                    <div className="user-list-form-error">
                                        <i className="bi bi-exclamation-circle"></i>
                                        <span>{formError}</span>
                                    </div>
                                )}
                            </div>

                            <div className="user-list-modal-footer">
                                <button
                                    type="button"
                                    className="user-list-cancel-button"
                                    onClick={closeAllModals}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="user-list-save-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="user-list-button-loader"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-lg"></i>
                                            Add User
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditUser && selectedUser && (
                <div
                    className="user-list-modal-overlay"
                    onClick={closeAllModals}
                >
                    <div
                        className="user-list-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="user-list-modal-header">
                            <div>
                                <h3>Edit User</h3>
                                <p>Update user information</p>
                            </div>

                            <button
                                type="button"
                                className="user-list-modal-close"
                                onClick={closeAllModals}
                                disabled={saving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser}>
                            <div className="user-list-modal-body">
                                <div className="user-list-form-group">
                                    <label htmlFor="edit-name">
                                        Name
                                    </label>

                                    <input
                                        id="edit-name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter user name"
                                        value={editFormData.name}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>

                                <div className="user-list-form-group">
                                    <label htmlFor="edit-phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="edit-phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={editFormData.phone}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>

                                <div className="user-list-form-group">
                                    <label htmlFor="edit-updated-by">
                                        Updated By
                                    </label>

                                    <input
                                        id="edit-updated-by"
                                        name="updatedBy"
                                        type="email"
                                        value={editFormData.updatedBy}
                                        readOnly
                                    />
                                </div>

                                {editFormError && (
                                    <div className="user-list-form-error">
                                        <i className="bi bi-exclamation-circle"></i>
                                        <span>{editFormError}</span>
                                    </div>
                                )}
                            </div>

                            <div className="user-list-modal-footer">
                                <button
                                    type="button"
                                    className="user-list-cancel-button"
                                    onClick={closeAllModals}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="user-list-save-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="user-list-button-loader"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>
                                            Update User
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showViewUser && selectedUser && (
                <div
                    className="user-list-modal-overlay"
                    onClick={closeAllModals}
                >
                    <div
                        className="user-list-modal user-list-view-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="user-list-modal-header">
                            <div>
                                <h3>User Details</h3>
                                <p>View user information</p>
                            </div>

                            <button
                                type="button"
                                className="user-list-modal-close"
                                onClick={closeAllModals}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="user-list-view-body">
                            <div className="user-list-view-profile">
                                <div className="user-list-view-avatar">
                                    <i className="bi bi-person"></i>
                                </div>

                                <div>
                                    <h4>
                                        {selectedUser.name ||
                                            `User #${selectedUser.id}`}
                                    </h4>

                                    <span>
                                        User ID: #{selectedUser.id}
                                    </span>
                                </div>
                            </div>

                            <div className="user-list-details-grid">
                                <div className="user-list-detail-item">
                                    <span>Phone</span>
                                    <strong>
                                        {selectedUser.phone || "-"}
                                    </strong>
                                </div>

                                <div className="user-list-detail-item">
                                    <span>Role</span>
                                    <strong>
                                        {selectedUser.role || "-"}
                                    </strong>
                                </div>

                                <div className="user-list-detail-item">
                                    <span>Status</span>
                                    <strong>
                                        {selectedUser.status || "-"}
                                    </strong>
                                </div>

                                <div className="user-list-detail-item">
                                    <span>Created By</span>
                                    <strong>
                                        {selectedUser.createdBy || "-"}
                                    </strong>
                                </div>

                                <div className="user-list-detail-item">
                                    <span>Created</span>
                                    <strong>
                                        {selectedUser.createdAt
                                            ? new Date(
                                                  selectedUser.createdAt
                                              ).toLocaleDateString("en-IN", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </strong>
                                </div>

                                <div className="user-list-detail-item">
                                    <span>Updated By</span>
                                    <strong>
                                        {selectedUser.updatedBy || "-"}
                                    </strong>
                                </div>

                                <div className="user-list-detail-item">
                                    <span>Updated</span>
                                    <strong>
                                        {selectedUser.updatedAt
                                            ? new Date(
                                                  selectedUser.updatedAt
                                              ).toLocaleDateString("en-IN", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="user-list-modal-footer">
                            <button
                                type="button"
                                className="user-list-cancel-button"
                                onClick={closeAllModals}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;