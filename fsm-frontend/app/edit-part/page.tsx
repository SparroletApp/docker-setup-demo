"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./edit-part.css";
import {
    Category,
    getAllCategories,
} from "../apiservice/categoryservice";
import {
    Part,
    updatePart,
} from "../apiservice/partservice";

interface EditPartProps {
    part: Part;
    onClose?: () => void;
}

export default function EditPart({
    part,
    onClose,
}: EditPartProps) {
    const [partName, setPartName] = useState("");
    const [sku, setSku] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [initialStock, setInitialStock] = useState("");
    const [alertThreshold, setAlertThreshold] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [supplier, setSupplier] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (!part) {
            return;
        }

        setPartName(part.name || "");
        setSku(part.sku || "");
        setCategoryId(part.categoryId || "");

        setInitialStock(
            part.stockQuantity !== undefined &&
                part.stockQuantity !== null
                ? String(part.stockQuantity)
                : ""
        );

        setAlertThreshold(
            part.thresholdAlert !== undefined &&
                part.thresholdAlert !== null
                ? String(part.thresholdAlert)
                : ""
        );

        setCostPrice(
            part.unitPrice !== undefined &&
                part.unitPrice !== null
                ? String(part.unitPrice)
                : ""
        );

        setSellingPrice(
            part.retailPrice !== undefined &&
                part.retailPrice !== null
                ? String(part.retailPrice)
                : ""
        );

        setSupplier(part.supplier || "");
    }, [part]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);

            const response = await getAllCategories();

            setCategories(response);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to load categories.",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!partName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Part Name Required",
                text: "Please enter the part name.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (!sku.trim()) {
            Swal.fire({
                icon: "warning",
                title: "SKU Required",
                text: "Please enter the SKU / part number.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (!categoryId) {
            Swal.fire({
                icon: "warning",
                title: "Category Required",
                text: "Please select a category.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (initialStock === "") {
            Swal.fire({
                icon: "warning",
                title: "Stock Required",
                text: "Please enter the stock quantity.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (Number(initialStock) < 0) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Stock",
                text: "Stock quantity cannot be negative.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (alertThreshold === "") {
            Swal.fire({
                icon: "warning",
                title: "Alert Threshold Required",
                text: "Please enter the minimum alert threshold.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (Number(alertThreshold) < 0) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Threshold",
                text: "Alert threshold cannot be negative.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (costPrice === "") {
            Swal.fire({
                icon: "warning",
                title: "Unit Price Required",
                text: "Please enter the unit price.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (Number(costPrice) < 0) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Unit Price",
                text: "Unit price cannot be negative.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (sellingPrice === "") {
            Swal.fire({
                icon: "warning",
                title: "Retail Price Required",
                text: "Please enter the retail price.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (Number(sellingPrice) < 0) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Retail Price",
                text: "Retail price cannot be negative.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        try {
            setSubmitting(true);

            const updatedBy =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("user_phone") || ""
                    : "";

            if (!updatedBy) {
                Swal.fire({
                    icon: "warning",
                    title: "User Information Missing",
                    text: "Unable to identify the logged-in user.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                return;
            }

            await updatePart({
                id: part.id,
                name: partName.trim(),
                sku: sku.trim(),
                categoryId: Number(categoryId),
                stockQuantity: Number(initialStock),
                thresholdAlert: Number(alertThreshold),
                unitPrice: Number(costPrice),
                retailPrice: Number(sellingPrice),
                supplier: supplier.trim(),
                updatedBy: updatedBy,
            });
            onClose?.();
            await Swal.fire({
                icon: "success",
                title: "Part Updated",
                text: "Part has been updated successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            onClose?.();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to update part.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="edit-part-overlay">

            <aside className="edit-part-drawer">

                <div className="edit-part-header">

                    <div className="edit-part-header-content">

                        <div className="edit-part-header-icon">
                            <i className="bi bi-box-seam"></i>
                        </div>

                        <div className="edit-part-header-text">

                            <h2>
                                Edit Part & Inventory
                            </h2>

                            <p>
                                Update SKU, category specifications,
                                warehouse inventory, and pricing
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="edit-part-close"
                        onClick={onClose}
                        aria-label="Close"
                        disabled={submitting}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>

                </div>

                <form
                    className="edit-part-form"
                    onSubmit={handleSubmit}
                >

                    <div className="edit-part-section">

                        <div className="edit-part-section-header">

                            <h3>
                                1. PART SPECIFICATIONS & IDENTIFIERS
                            </h3>

                            <span>
                                REQUIRED DETAILS
                            </span>

                        </div>

                        <div className="edit-part-section-body">

                            <div className="edit-part-field edit-part-field-full">

                                <label htmlFor="editPartName">
                                    Part / Item Name <b>*</b>
                                </label>

                                <input
                                    id="editPartName"
                                    name="partName"
                                    type="text"
                                    value={partName}
                                    onChange={(e) =>
                                        setPartName(e.target.value)
                                    }
                                    placeholder="Enter part name"
                                />

                            </div>

                            <div className="edit-part-grid">

                                <div className="edit-part-field">

                                    <label htmlFor="editSku">
                                        SKU / Part Number <b>*</b>
                                    </label>

                                    <input
                                        id="editSku"
                                        name="sku"
                                        type="text"
                                        value={sku}
                                        onChange={(e) =>
                                            setSku(e.target.value)
                                        }
                                        placeholder="Enter SKU"
                                    />

                                </div>

                                <div className="edit-part-field">

                                    <label htmlFor="editCategory">
                                        Category & Trade <b>*</b>
                                    </label>

                                    <div className="edit-part-select-wrapper">

                                        <select
                                            id="editCategory"
                                            name="category"
                                            value={categoryId}
                                            onChange={(e) =>
                                                setCategoryId(
                                                    e.target.value
                                                        ? Number(
                                                            e.target.value
                                                        )
                                                        : ""
                                                )
                                            }
                                            disabled={loadingCategories}
                                        >

                                            <option value="">
                                                {loadingCategories
                                                    ? "Loading categories..."
                                                    : "Select Category"}
                                            </option>

                                            {categories.map(
                                                (category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        <i className="bi bi-chevron-down"></i>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="edit-part-section">

                        <div className="edit-part-section-header">

                            <h3>
                                2. STOCK, LOCATION & ALLOCATION
                            </h3>

                            <span>
                                WAREHOUSE CONFIG
                            </span>

                        </div>

                        <div className="edit-part-section-body">

                            <div className="edit-part-grid">

                                <div className="edit-part-field">

                                    <label htmlFor="editInitialStock">
                                        Stock Quantity <b>*</b>
                                    </label>

                                    <input
                                        id="editInitialStock"
                                        name="initialStock"
                                        type="number"
                                        min="0"
                                        value={initialStock}
                                        onChange={(e) =>
                                            setInitialStock(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                    />

                                </div>

                                <div className="edit-part-field">

                                    <label htmlFor="editAlertThreshold">
                                        Min. Alert Threshold <b>*</b>
                                    </label>

                                    <div className="edit-part-alert-input">

                                        <input
                                            id="editAlertThreshold"
                                            name="alertThreshold"
                                            type="number"
                                            min="0"
                                            value={alertThreshold}
                                            onChange={(e) =>
                                                setAlertThreshold(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0"
                                        />

                                        <span>
                                            Low Alert
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="edit-part-section">

                        <div className="edit-part-section-header">

                            <h3>
                                3. PRICING & PROCUREMENT
                            </h3>

                            <span>
                                PRICING
                            </span>

                        </div>

                        <div className="edit-part-section-body">

                            <div className="edit-part-grid">

                                <div className="edit-part-field">

                                    <label htmlFor="editCostPrice">
                                        Unit Cost (₹) <b>*</b>
                                    </label>

                                    <div className="edit-part-price-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            id="editCostPrice"
                                            name="costPrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={costPrice}
                                            onChange={(e) =>
                                                setCostPrice(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0.00"
                                        />

                                    </div>

                                </div>

                                <div className="edit-part-field">

                                    <label htmlFor="editSellingPrice">
                                        Retail / Customer Price (₹) <b>*</b>
                                    </label>

                                    <div className="edit-part-price-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            id="editSellingPrice"
                                            name="sellingPrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={sellingPrice}
                                            onChange={(e) =>
                                                setSellingPrice(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0.00"
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="edit-part-field edit-dep-input">

                                <label htmlFor="editSupplier">
                                    Preferred Supplier / Vendor
                                </label>

                                <input
                                    id="editSupplier"
                                    name="supplier"
                                    type="text"
                                    value={supplier}
                                    onChange={(e) =>
                                        setSupplier(e.target.value)
                                    }
                                    placeholder="Enter supplier name"
                                />

                            </div>

                        </div>

                    </div>

                    <div className="edit-part-footer">

                        <button
                            type="button"
                            className="edit-part-cancel"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-part-submit"
                            disabled={submitting}
                        >

                            {submitting ? (
                                <>
                                    <i className="bi bi-arrow-repeat"></i>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle"></i>
                                    Update Part
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </aside>

        </div>
    );
}