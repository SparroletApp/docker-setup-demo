
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./add-part.css";
import {
    Category,
    getAllCategories,
} from "../apiservice/categoryservice";
import { createPart } from "../apiservice/partservice";

interface AddPartProps {
    onClose?: () => void;
}

export default function AddPart({ onClose }: AddPartProps) {

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

    const generateSku = () => {
        const randomNumber = Math.floor(
            100000 + Math.random() * 900000
        );

        setSku(`PART-${randomNumber}`);
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
                text: "Please enter the initial stock quantity.",
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

            const createdBy =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("user_phone") || ""
                    : "";

            if (!createdBy) {
                Swal.fire({
                    icon: "warning",
                    title: "User Information Missing",
                    text: "Unable to identify the logged-in user.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                return;
            }

            await createPart({
                name: partName.trim(),
                sku: sku.trim(),
                categoryId: Number(categoryId),
                stockQuantity: Number(initialStock),
                thresholdAlert: Number(alertThreshold),
                unitPrice: Number(costPrice),
                retailPrice: Number(sellingPrice),
                supplier: supplier.trim(),
                createdBy: createdBy,
            });

            await Swal.fire({
                icon: "success",
                title: "Part Added",
                text: "Part has been added successfully.",
                timer: 2000,
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
                        : "Unable to add part.",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-part-overlay">

            <aside className="add-part-drawer">

                <div className="add-part-header">

                    <div className="add-part-header-content">

                        <div className="add-part-header-icon">
                            <i className="bi bi-box-seam"></i>
                        </div>

                        <div className="add-part-header-text">

                            <h2>
                                Add New Part & Inventory
                            </h2>

                            <p>
                                Register SKU, category specifications,
                                warehouse inventory, and pricing
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="add-part-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>

                </div>

                <form
                    className="add-part-form"
                    onSubmit={handleSubmit}
                >



                    <div className="add-part-section">

                        <div className="add-part-section-header">

                            <h3>
                                1. PART SPECIFICATIONS & IDENTIFIERS
                            </h3>

                            <span>
                                REQUIRED DETAILS
                            </span>

                        </div>

                        <div className="add-part-section-body">

                            <div className="add-part-field add-part-field-full">

                                <label htmlFor="partName">
                                    Part / Item Name <b>*</b>
                                </label>

                                <input
                                    id="partName"
                                    name="partName"
                                    type="text"
                                    value={partName}
                                    onChange={(e) =>
                                        setPartName(e.target.value)
                                    }
                                    placeholder="Enter part name"
                                />

                            </div>

                            <div className="add-part-grid">

                                <div className="add-part-field">

                                    <label htmlFor="sku">
                                        SKU / Part Number <b>*</b>
                                    </label>

                                    <div className="add-part-input-icon">

                                        <input
                                            id="sku"
                                            name="sku"
                                            type="text"
                                            value={sku}
                                            onChange={(e) =>
                                                setSku(e.target.value)
                                            }
                                            placeholder="Enter SKU"
                                        />

                                        <button
                                            type="button"
                                            className="add-part-generate"
                                            onClick={generateSku}
                                            aria-label="Generate SKU"
                                        >
                                            <i className="bi bi-arrow-repeat"></i>
                                        </button>

                                    </div>

                                </div>

                                <div className="add-part-field">

                                    <label htmlFor="category">
                                        Category & Trade <b>*</b>
                                    </label>

                                    <div className="add-part-select-wrapper">

                                        <select
                                            id="category"
                                            name="category"
                                            value={categoryId}
                                            onChange={(e) =>
                                                setCategoryId(
                                                    e.target.value
                                                        ? Number(e.target.value)
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


   

                    <div className="add-part-section">

                        <div className="add-part-section-header">

                            <h3>
                                2. STOCK, LOCATION & ALLOCATION
                            </h3>

                            <span>
                                WAREHOUSE CONFIG
                            </span>

                        </div>

                        <div className="add-part-section-body">

                            <div className="add-part-grid">

                                <div className="add-part-field">

                                    <label htmlFor="initialStock">
                                        Initial Stock Quantity <b>*</b>
                                    </label>

                                    <input
                                        id="initialStock"
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

                                <div className="add-part-field">

                                    <label htmlFor="alertThreshold">
                                        Min. Alert Threshold <b>*</b>
                                    </label>

                                    <div className="add-part-alert-input">

                                        <input
                                            id="alertThreshold"
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




                    <div className="add-part-section">

                        <div className="add-part-section-header">

                            <h3>
                                3. PRICING & PROCUREMENT
                            </h3>

                            <span>
                                PRICING
                            </span>

                        </div>

                        <div className="add-part-section-body">

                            <div className="add-part-grid">

                                <div className="add-part-field">

                                    <label htmlFor="costPrice">
                                        Unit Cost (₹) <b>*</b>
                                    </label>

                                    <div className="add-part-price-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            id="costPrice"
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

                                <div className="add-part-field">

                                    <label htmlFor="sellingPrice">
                                        Retail / Customer Price (₹) <b>*</b>
                                    </label>

                                    <div className="add-part-price-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            id="sellingPrice"
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

                            <div className="add-part-field dep-input">

                                <label htmlFor="supplier">
                                    Preferred Supplier / Vendor
                                </label>

                                <input
                                    id="supplier"
                                    name="supplier"
                                    type="text"
                                    value={supplier}
                                    onChange={(e) =>
                                        setSupplier(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter supplier name"
                                />

                            </div>

                        </div>

                    </div>



                    <div className="add-part-footer">

                        <button
                            type="button"
                            className="add-part-cancel"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-part-submit"
                            disabled={submitting}
                        >

                            {submitting ? (
                                <>
                                    <i className="bi bi-arrow-repeat"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-plus-circle"></i>
                                    Save & Add Part
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </aside>

        </div>
    );
}
