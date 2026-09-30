"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./category-view.css";

import {
    Category as CategoryType,
    getCategoryById,
} from "../apiservice/categoryservice";

function CategoryView() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState<CategoryType | null>(null);
    const [loading, setLoading] = useState(true);

    const categoryName = searchParams.get("name");
    const categoryId = searchParams.get("id");

    useEffect(() => {
        if (categoryId) {
            fetchCategory(Number(categoryId));
        } else {
            setLoading(false);
        }
    }, [categoryId]);

    const fetchCategory = async (id: number) => {
        try {
            setLoading(true);

            const response = await getCategoryById({
                id,
            });

            setCategory(response);
        } catch (error) {
            console.error("Failed to fetch category:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to load category",
                text:
                    error instanceof Error
                        ? error.message
                        : "Unable to fetch category details.",
                timer: 2000,
                showConfirmButton: false,
            });

            router.push("/category");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string | null | undefined) => {
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

    const displayName = category?.name || categoryName || "-";

    if (loading) {
        return (
            <div className="category-view-page">
                <div className="category-view-loading">
                    <span className="category-view-spinner"></span>
                    Loading category...
                </div>
            </div>
        );
    }

    return (
        <div className="category-view-page">

            <div className="category-view-header">

                <div className="category-view-header-left">

                    <button
                        className="category-view-back-button"
                        onClick={() => router.push("/category")}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <div>
                        <h1>
                            Category Details
                        </h1>

                        <p>
                            View category information
                        </p>
                    </div>

                </div>

            </div>

            <div className="category-view-content">

                <div className="category-view-main-card">

                    <div className="category-view-icon">
                        <i className="bi bi-grid-fill"></i>
                    </div>

                    <div className="category-view-main-info">

                        <span className="category-view-label">
                            CATEGORY
                        </span>

                        <h2>
                            {displayName}
                        </h2>

                    </div>

                </div>

                <div className="category-view-details-card">

                    <div className="category-view-card-header">

                        <div>
                            <h2>
                                Category Information
                            </h2>

                            <p>
                                Details of the selected category
                            </p>
                        </div>

                    </div>

                    <div className="category-view-details-grid">

                        <div className="category-view-detail-item">

                            <span className="category-view-detail-label">
                                Category Name
                            </span>

                            <strong>
                                {displayName}
                            </strong>

                        </div>

                        <div className="category-view-detail-item">

                            <span className="category-view-detail-label">
                                Description
                            </span>

                            <strong>
                                {category?.description || "-"}
                            </strong>

                        </div>

                        {category && (
                            <>
                                <div className="category-view-detail-item">

                                    <span className="category-view-detail-label">
                                        Created At
                                    </span>

                                    <strong>
                                        {formatDate(category.createdAt)}
                                    </strong>

                                </div>

                                <div className="category-view-detail-item">

                                    <span className="category-view-detail-label">
                                        Created By
                                    </span>

                                    <strong>
                                        {category.createdBy || "-"}
                                    </strong>

                                </div>

                                <div className="category-view-detail-item">

                                    <span className="category-view-detail-label">
                                        Updated At
                                    </span>

                                    <strong>
                                        {formatDate(category.updatedAt)}
                                    </strong>

                                </div>

                                <div className="category-view-detail-item">

                                    <span className="category-view-detail-label">
                                        Updated By
                                    </span>

                                    <strong>
                                        {category.updatedBy || "-"}
                                    </strong>

                                </div>
                            </>
                        )}

                    </div>

                </div>

                <div className="category-view-footer">

                    <button
                        className="category-view-back-footer"
                        onClick={() => router.push("/category")}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Categories
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CategoryView;
