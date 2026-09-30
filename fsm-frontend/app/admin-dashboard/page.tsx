"use client";

import { useEffect, useState } from "react";

import "./admin-dashboard.css"
import { Company, getAllCompanies } from "../apiservice/companyService";

function AdminDashboard() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getAllCompanies();
                setCompanies(data);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <div>
                    <h2>Companies</h2>
                    <p>Manage all registered companies</p>
                </div>

                <div className="admin-dashboard-total">
                    <span>Total Companies</span>
                    <strong>{companies.length}</strong>
                </div>
            </div>

            <div className="admin-dashboard-table-wrapper">
                <table className="admin-dashboard-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>GST</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="admin-dashboard-table-empty"
                                >
                                    Loading companies...
                                </td>
                            </tr>
                        ) : companies.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="admin-dashboard-table-empty"
                                >
                                    No companies found
                                </td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr key={company.id}>
                                    <td>
                                        <div className="admin-dashboard-company">
                                            <div className="admin-dashboard-company-icon">
                                                {company.brandName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {company.brandName}
                                                </strong>

                                                <span>
                                                    {company.legalName}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="admin-dashboard-contact">
                                            <span>{company.email}</span>
                                            <span>{company.phone}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="admin-dashboard-location">
                                            <span>{company.city}</span>
                                            <small>
                                                {company.state},{" "}
                                                {company.country}
                                            </small>
                                        </div>
                                    </td>

                                    <td>
                                        {company.isGstRegistered ? (
                                            <span className="admin-dashboard-gst registered">
                                                Registered
                                            </span>
                                        ) : (
                                            <span className="admin-dashboard-gst not-registered">
                                                Not Registered
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {company.deleted ? (
                                            <span className="admin-dashboard-status inactive">
                                                Inactive
                                            </span>
                                        ) : (
                                            <span className="admin-dashboard-status active">
                                                Active
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <span className="admin-dashboard-date">
                                            {new Date(
                                                company.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="admin-dashboard-action"
                                        >
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;