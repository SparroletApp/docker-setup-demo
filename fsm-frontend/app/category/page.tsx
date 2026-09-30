
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./category.css";
import {
    Category as CategoryType,
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
} from "../apiservice/categoryservice";


function Category() {
    const router = useRouter();

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [showAddCategory, setShowAddCategory] = useState(false);

    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const [showEditCategory, setShowEditCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [editCategoryDescription, setEditCategoryDescription] = useState("");
    const [editSaving, setEditSaving] = useState(false);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await getAllCategories();

            setCategories(response || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to load categories",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to fetch category data.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const getCurrentUser = (): string => {
        if (typeof window === "undefined") {
            return "";
        }

        const storedUser = sessionStorage.getItem("user");

        if (!storedUser) {
            return "";
        }

        try {
            const user = JSON.parse(storedUser);

            return (
                user?.name ||
                user?.userName ||
                user?.username ||
                user?.phone ||
                ""
            );
        } catch (error) {
            console.error("Failed to parse stored user:", error);

            return "";
        }
    };

    const handleEditCategory = async (id: number) => {
        try {
            setEditSaving(true);

            const response = await getCategoryById({
                id,
            });

            setEditingCategoryId(response.id);
            setEditCategoryName(response.name || "");
            setEditCategoryDescription(response.description || "");
            setShowEditCategory(true);

        } catch (error) {
            console.error("Failed to fetch category:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to load category",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load category details.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setEditSaving(false);
        }
    };

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Category name required",
                text: "Please enter a category name.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        if (!categoryDescription.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Description required",
                text: "Please enter a category description.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        try {
            setSaving(true);

            const currentUser = getCurrentUser();

            await createCategory({
                name: categoryName.trim(),
                description: categoryDescription.trim(),
                createdBy: currentUser,
                updatedBy: currentUser,
            });

            Swal.fire({
                icon: "success",
                title: "Category Created",
                text: "Category has been created successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            setCategoryName("");
            setCategoryDescription("");
            setShowAddCategory(false);

            await fetchCategories();
        } catch (error) {
            console.error("Failed to create category:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to create category",
                text:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while creating the category.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (category: CategoryType) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete Category?",
            text: `Are you sure you want to delete "${category.name}"?`,
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc3545",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(category.id);

            const currentUser = getCurrentUser();

            await deleteCategory({
                id: category.id,
                deletedBy: currentUser,
            });

            Swal.fire({
                icon: "success",
                title: "Category Deleted",
                text: "Category has been deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            await fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete the category.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setDeletingId(null);
        }
    };

    const handleViewCategory = (name: string) => {
        router.push(`/category-view?name=${encodeURIComponent(name)}`);
    };

    const handleUpdateCategory = async () => {
        if (!editCategoryName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Category name required",
                text: "Please enter a category name.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        if (!editCategoryDescription.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Description required",
                text: "Please enter a category description.",
                timer: 2000,
                showConfirmButton: false,
            });

            return;
        }

        if (editingCategoryId === null) {
            return;
        }

        try {
            setEditSaving(true);

            const currentUser = getCurrentUser();

            await updateCategory({
                id: editingCategoryId,
                name: editCategoryName.trim(),
                description: editCategoryDescription.trim(),
                updatedBy: currentUser,
            });

            Swal.fire({
                icon: "success",
                title: "Category Updated",
                text: "Category has been updated successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            setShowEditCategory(false);
            setEditingCategoryId(null);
            setEditCategoryName("");
            setEditCategoryDescription("");

            await fetchCategories();

        } catch (error) {
            console.error("Failed to update category:", error);

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to update the category.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setEditSaving(false);
        }
    };

    const formatDate = (date: string) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <div className="dashboard-header">

                <div className="left-header-dashboard">
                    Categories
                </div>

                <div className="right-header-dashboard">

                    <button
                        onClick={() => setShowAddCategory(true)}
                    >
                        <span>
                            <i className="bi bi-plus-lg"></i>
                        </span>

                        New Category
                    </button>

                </div>

            </div>

            <div className="category-list">

                <div className="category-data-header">

                    <div className="category-summary-card">

                        <span>
                            <i className="bi bi-grid-fill"></i>
                        </span>

                        <div className="category-summary-right">

                            <h5>
                                All Categories
                            </h5>

                            <div className="category-count">
                                ({categories.length})
                            </div>

                        </div>

                    </div>

                    <div className="category-filter-right">

                        <button>
                            <span>
                                <i className="bi bi-download"></i>
                            </span>

                            Export CSV
                        </button>

                        <button>
                            <span>
                                <i className="bi bi-filter"></i>
                            </span>

                            Filter
                        </button>

                    </div>

                </div>

                <div className="category-table-container">

                    <div className="category-table-top">

                        <div>

                            <h2>
                                Product Categories
                            </h2>

                            <p>
                                Manage service categories used across
                                tickets, jobs, and customer requests
                            </p>

                        </div>

                    </div>

                    <div className="category-table-scroll">

                        <table className="category-data-table">

                            <thead>

                                <tr>
                                    <th>CATEGORY</th>
                                    <th>DESCRIPTION</th>
                                    <th>CREATED AT</th>
                                    <th>ACTIONS</th>
                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            className="category-loading-cell"
                                        >
                                            Loading categories...
                                        </td>

                                    </tr>

                                ) : categories.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            className="category-empty-cell"
                                        >
                                            No categories found
                                        </td>

                                    </tr>

                                ) : (

                                    categories.map((category) => (

                                        <tr key={category.id}>

                                            <td>

                                                <div className="category-name-cell">

                                                    <div className="category-avatar">
                                                        <i className="bi bi-grid"></i>
                                                    </div>

                                                    <div className="category-name-details">

                                                        <strong>
                                                            {category.name}
                                                        </strong>


                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="category-description-cell">
                                                    {category.description}
                                                </div>

                                            </td>

                                            <td>

                                                <div className="category-created-cell">

                                                    <i className="bi bi-calendar3"></i>

                                                    <span>
                                                        {formatDate(
                                                            category.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="category-actions">
{/* 
                                                    <button
                                                        className="category-action-view"
                                                        onClick={() => handleViewCategory(category.name)}
                                                        title="View Category"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                        View
                                                    </button> */}
                                                    <button
                                                        className="category-action-edit"
                                                        onClick={() =>
                                                            handleEditCategory(
                                                                category.id
                                                            )
                                                        }
                                                        title="Edit Category"
                                                    >

                                                        <i className="bi bi-pencil"></i>

                                                

                                                    </button>

                                                    <button
                                                        className="category-action-delete"
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                category
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            category.id
                                                        }
                                                        title="Delete Category"
                                                    >

                                                        {deletingId ===
                                                            category.id ? (

                                                            <span className="category-small-spinner"></span>

                                                        ) : (

                                                            <i className="bi bi-trash3"></i>

                                                        )}

                                                   
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="category-table-footer">

                        <span>

                            Showing{" "}

                            <strong>
                                {categories.length > 0
                                    ? `1-${categories.length}`
                                    : "0"}
                            </strong>{" "}

                            of{" "}

                            <strong>
                                {categories.length}
                            </strong>{" "}

                            categories

                        </span>

                        <div className="category-pagination">

                            <button disabled>
                                Previous
                            </button>

                            <button className="category-pagination-active">
                                1
                            </button>

                            <button>
                                2
                            </button>

                            <button>
                                3
                            </button>

                            <span>
                                ...
                            </span>

                            <button>
                                10
                            </button>

                            <button>
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {showAddCategory && (

                <div
                    className="category-add-popup-wrapper"
                    onClick={() => {
                        if (!saving) {
                            setShowAddCategory(false);
                        }
                    }}
                >

                    <div
                        className="category-add-popup"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="category-popup-header">

                            <div>

                                <h2>
                                    Add Category
                                </h2>

                                <p>
                                    Create a new service category
                                </p>

                            </div>

                            <button
                                className="category-popup-close"
                                onClick={() =>
                                    setShowAddCategory(false)
                                }
                                disabled={saving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <div className="category-popup-body">

                            <div className="category-form-group">

                                <label>
                                    Category Name
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={categoryName}
                                    onChange={(event) =>
                                        setCategoryName(
                                            event.target.value
                                        )
                                    }
                                    disabled={saving}
                                />

                            </div>

                            <div className="category-form-group">

                                <label>
                                    Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    placeholder="Enter category description"
                                    value={categoryDescription}
                                    onChange={(event) =>
                                        setCategoryDescription(
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    disabled={saving}
                                />

                            </div>

                        </div>

                        <div className="category-popup-footer">

                            <button
                                className="category-cancel-button"
                                onClick={() =>
                                    setShowAddCategory(false)
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                className="category-save-button"
                                onClick={handleAddCategory}
                                disabled={saving}
                            >

                                {saving ? (

                                    <>
                                        <span className="category-button-spinner"></span>
                                        Saving...
                                    </>

                                ) : (

                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Add Category
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {showEditCategory && (
                <div
                    className="category-add-popup-wrapper"
                    onClick={() => {
                        if (!editSaving) {
                            setShowEditCategory(false);
                        }
                    }}
                >
                    <div
                        className="category-add-popup"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="category-popup-header">

                            <div>
                                <h2>
                                    Edit Category
                                </h2>

                                <p>
                                    Update category details
                                </p>
                            </div>

                            <button
                                className="category-popup-close"
                                onClick={() => setShowEditCategory(false)}
                                disabled={editSaving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <div className="category-popup-body">

                            <div className="category-form-group">

                                <label>
                                    Category Name
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={editCategoryName}
                                    onChange={(event) =>
                                        setEditCategoryName(event.target.value)
                                    }
                                    disabled={editSaving}
                                />

                            </div>

                            <div className="category-form-group">

                                <label>
                                    Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    placeholder="Enter category description"
                                    value={editCategoryDescription}
                                    onChange={(event) =>
                                        setEditCategoryDescription(event.target.value)
                                    }
                                    rows={4}
                                    disabled={editSaving}
                                />

                            </div>

                        </div>

                        <div className="category-popup-footer">

                            <button
                                className="category-cancel-button"
                                onClick={() => setShowEditCategory(false)}
                                disabled={editSaving}
                            >
                                Cancel
                            </button>

                            <button
                                className="category-save-button"
                                onClick={handleUpdateCategory}
                                disabled={editSaving}
                            >
                                {editSaving ? (
                                    <>
                                        <span className="category-button-spinner"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Update Category
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

export default Category;
