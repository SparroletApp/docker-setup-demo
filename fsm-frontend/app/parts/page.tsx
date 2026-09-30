"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./parts.css";
import AddPart from "../add-part/page";
import { getAllParts, Part } from "../apiservice/partservice";
import EditPart from "../edit-part/page";

function Parts() {
    const [showAddPart, setShowAddPart] = useState(false);
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditPart, setShowEditPart] = useState(false);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);

    const handleEdit = (part: Part) => {
        setSelectedPart(part);
        setShowEditPart(true);
    };

    useEffect(() => {
        loadParts();
    }, []);

    const loadParts = async () => {
        try {
            setLoading(true);

            const response = await getAllParts();

            setParts(response);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load parts.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (part: Part) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete Part?",
            text: `Are you sure you want to delete ${part.name}?`,
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
        

            await Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Part deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadParts();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete part.",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const getStockClass = (stock: number, threshold: number) => {
        if (stock === 0) {
            return "inventory-stock-out";
        }

        if (stock <= threshold) {
            return "inventory-stock-low";
        }

        return "inventory-stock-normal";
    };

    const getStockText = (stock: number, threshold: number) => {
        if (stock === 0) {
            return "Out of Stock";
        }

        return `Min: ${threshold}`;
    };

    const getPartIcon = (categoryName: string) => {
        const category = categoryName?.toLowerCase() || "";

        if (
            category.includes("hvac") ||
            category.includes("cooling")
        ) {
            return "bi-snow";
        }

        if (
            category.includes("electrical") ||
            category.includes("electric")
        ) {
            return "bi-lightning-charge";
        }

        if (
            category.includes("plumbing") ||
            category.includes("water")
        ) {
            return "bi-droplet";
        }

        if (
            category.includes("mechanical") ||
            category.includes("machine")
        ) {
            return "bi-gear";
        }

        return "bi-box-seam";
    };

    return (
        <>
            <div className="dashboard-headers">

                <div className="left-header-dashboard">
                    Parts & Inventory Catalog
                </div>

                <div className="right-header-dashboard">

                    <button
                        type="button"
                        onClick={() => setShowAddPart(true)}
                    >
                        <span>
                            <i className="bi bi-plus-lg"></i>
                        </span>
                        Add New Part
                    </button>

                </div>

            </div>

            <div className="inventory">

                <div className="inventory-filter-wrapper">

                    <div className="inventory-filter-tabs">

                        <button className="inventory-filter-tab inventory-filter-active">
                            All Inventory
                            <span>{parts.length}</span>
                        </button>

                        <button className="inventory-filter-tab">
                            In Stock
                            <span>
                                {
                                    parts.filter(
                                        (part) =>
                                            part.stockQuantity >
                                            part.thresholdAlert
                                    ).length
                                }
                            </span>
                        </button>

                        <button className="inventory-filter-tab inventory-filter-low">
                            Low Stock Alert
                            <span>
                                {
                                    parts.filter(
                                        (part) =>
                                            part.stockQuantity > 0 &&
                                            part.stockQuantity <=
                                            part.thresholdAlert
                                    ).length
                                }
                            </span>
                        </button>

                        <button className="inventory-filter-tab inventory-filter-out">
                            Out of Stock
                            <span>
                                {
                                    parts.filter(
                                        (part) =>
                                            part.stockQuantity === 0
                                    ).length
                                }
                            </span>
                        </button>

                        <button className="inventory-filter-tab">
                            Allocated
                        </button>

                    </div>

                    <div className="inventory-filter-actions">

                        <button className="inventory-filter-button">
                            <i className="bi bi-sliders2"></i>
                            Filter
                            <i className="bi bi-chevron-down"></i>
                        </button>

                        <button className="inventory-filter-button">
                            <i className="bi bi-download"></i>
                            Export CSV
                        </button>

                    </div>

                </div>

            </div>

            <div className="admin-inventory-table-wrapper">

                <div className="admin-inventory-table-scroll">

                    <table className="admin-inventory-table">

                        <thead>

                            <tr>

                                <th>
                                    PART NAME & SKU
                                </th>

                                <th>
                                    CATEGORY
                                </th>

                                <th>
                                    SUPPLIER
                                </th>

                                <th>
                                    PRICING
                                </th>

                                <th>
                                    STOCK /
                                    <br />
                                    MIN
                                </th>

                                <th>
                                    ACTION
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={6}
                                        style={{
                                            textAlign: "center",
                                            padding: "40px",
                                        }}
                                    >
                                        Loading parts...
                                    </td>

                                </tr>

                            ) : parts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={6}
                                        style={{
                                            textAlign: "center",
                                            padding: "40px",
                                        }}
                                    >
                                        No parts found.
                                    </td>

                                </tr>

                            ) : (

                                parts.map((part) => (

                                    <tr key={part.id}>

                                        <td>

                                            <div className="admin-inventory-part">

                                                <div className="admin-inventory-part-icon">

                                                    <i
                                                        className={`bi ${getPartIcon(
                                                            part.categoryName
                                                        )}`}
                                                    ></i>

                                                </div>

                                                <div className="admin-inventory-part-info">

                                                    <span className="admin-inventory-part-name">
                                                        {part.name}
                                                    </span>

                                                    <div className="admin-inventory-part-meta">

                                                        <span className="admin-inventory-sku">
                                                            #{part.sku}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span className="admin-inventory-category">
                                                {part.categoryName}
                                            </span>

                                        </td>

                                        <td>

                                            <span className="admin-inventory-compatibility">
                                                {part.supplier || "—"}
                                            </span>

                                        </td>

                                        <td>

                                            <div className="admin-inventory-location">

                                                <span className="admin-inventory-location-name">
                                                    ₹{" "}
                                                    {part.unitPrice.toFixed(2)}
                                                </span>

                                                <span className="admin-inventory-location-sub">
                                                    Retail: ₹{" "}
                                                    {part.retailPrice.toFixed(2)}
                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <div
                                                className={`admin-inventory-stock ${getStockClass(
                                                    part.stockQuantity,
                                                    part.thresholdAlert
                                                )}`}
                                            >

                                                <span>
                                                    {part.stockQuantity}
                                                </span>

                                                <small>
                                                    {getStockText(
                                                        part.stockQuantity,
                                                        part.thresholdAlert
                                                    )}
                                                </small>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="admin-inventory-actions">

                                                <button
                                                    type="button"
                                                    className="admin-inventory-action-edit"
                                                    onClick={() =>
                                                        handleEdit(part)
                                                    }
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-inventory-action-delete"
                                                    onClick={() =>
                                                        handleDelete(part)
                                                    }
                                                    title="Delete"
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

                <div className="admin-inventory-table-footer">

                    <span className="admin-inventory-showing">

                        {loading
                            ? "Loading..."
                            : `Showing 1 to ${parts.length} of ${parts.length} inventory parts`}

                    </span>

                    <div className="admin-inventory-pagination">

                        <button
                            className="admin-inventory-page-button admin-inventory-page-disabled"
                            disabled
                        >
                            Previous
                        </button>

                        <button className="admin-inventory-page-button admin-inventory-page-active">
                            1
                        </button>

                        <button className="admin-inventory-page-button">
                            Next
                        </button>

                    </div>

                </div>

            </div>

            {showAddPart && (
                <AddPart
                    onClose={() => {
                        setShowAddPart(false);
                        loadParts();
                    }}
                />
            )}

            {showEditPart && selectedPart && (
                <EditPart
                    part={selectedPart}
                    onClose={() => {
                        setShowEditPart(false);
                        setSelectedPart(null);
                        loadParts();
                    }}
                />
            )}

        </>
    );
}

export default Parts;