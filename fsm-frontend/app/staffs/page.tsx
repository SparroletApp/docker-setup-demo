"use client";

import { useEffect, useState } from "react";
import "./staffs.css";
import AddTechnician from "../add-technician/page";
import { getAllUsers, User } from "../apiservice/userservice";

interface StaffMember {
    id: string;
    name: string;
    phone: string;
    email: string;
    specialization: string;
    ability: string;
    license: string[];
    status:
        | "In-Progress"
        | "Available"
        | "Dispatched"
        | "Standby"
        | "Completed";
    action: string;
    avatar: string;
}

const getStatusClass = (
    status: StaffMember["status"]
) => {
    switch (status) {
        case "In-Progress":
            return "staff-table-status-progress";

        case "Available":
            return "staff-table-status-available";

        case "Dispatched":
            return "staff-table-status-dispatched";

        case "Standby":
            return "staff-table-status-standby";

        case "Completed":
            return "staff-table-status-completed";

        default:
            return "";
    }
};

const convertStatus = (
    status: string
): StaffMember["status"] => {
    switch (status?.toUpperCase()) {
        case "IN_PROGRESS":
        case "IN-PROGRESS":
            return "In-Progress";

        case "AVAILABLE":
        case "ACTIVE":
            return "Available";

        case "DISPATCHED":
            return "Dispatched";

        case "COMPLETED":
            return "Completed";

        case "STANDBY":
            return "Standby";

        default:
            return "Standby";
    }
};

function Staff() {
    const [showAddTechnician, setShowAddTechnician] =
        useState(false);

    const [staffMembers, setStaffMembers] =
        useState<StaffMember[]>([]);

    const [loading, setLoading] =
        useState(true);

    const loadStaff = async () => {
        try {
            setLoading(true);

            const users: User[] =
                await getAllUsers();

            const technicians =
                users.filter(
                    (user) =>
                        user.role?.toUpperCase() ===
                            "TECHNICIAN" &&
                        !user.deleted
                );

            const mappedStaff: StaffMember[] =
                technicians.map((user) => ({
                    id:
                        user.technicianId ||
                        `TECH-${user.id}`,

                    name:
                        user.name || "—",

                    phone:
                        user.phone || "—",

                    email:
                        user.email || "—",

                    specialization:
                        user.specialization ||
                        "Not Assigned",

                    ability:
                        user.ability ||
                        "Not Assigned",

                    license:
                        user.license || [],

                    status:
                        convertStatus(
                            user.status
                        ),

                    action:
                        "View →",

                    avatar:
                        "/avatar.png",
                }));

            setStaffMembers(
                mappedStaff
            );

        } catch (error) {
            console.error(
                "Error loading technicians:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    const handleTechnicianClose = () => {
        setShowAddTechnician(false);
        loadStaff();
    };

    const hvacCount =
        staffMembers.filter(
            (staff) =>
                staff.specialization
                    .toUpperCase() === "HVAC"
        ).length;

    const electricalCount =
        staffMembers.filter(
            (staff) =>
                staff.specialization
                    .toUpperCase() ===
                "INDUSTRIAL ELECTRICAL"
        ).length;

    const plumbingCount =
        staffMembers.filter(
            (staff) =>
                staff.specialization
                    .toUpperCase() ===
                "PLUMBING"
        ).length;

    const telemetryCount =
        staffMembers.filter(
            (staff) =>
                staff.specialization
                    .toUpperCase() ===
                "TELEMETRY"
        ).length;

    const onDutyCount =
        staffMembers.filter(
            (staff) =>
                staff.status ===
                    "In-Progress" ||
                staff.status ===
                    "Available" ||
                staff.status ===
                    "Dispatched"
        ).length;

    const standbyCount =
        staffMembers.filter(
            (staff) =>
                staff.status ===
                "Standby"
        ).length;

    const offDutyCount =
        staffMembers.filter(
            (staff) =>
                staff.status ===
                "Completed"
        ).length;

    return (
        <>
            <div className="dashboard-header">

                <div className="left-header-dashboard">
                    Technicians
                </div>

                <div className="right-header-dashboard">

                    <button
                        type="button"
                        onClick={() =>
                            setShowAddTechnician(
                                true
                            )
                        }
                    >
                        <span>
                            <i className="bi bi-plus-lg"></i>
                        </span>

                        Add Technician
                    </button>

                </div>

            </div>

            <div className="staff-page-container">

                <div className="staff-page-header">

                    <div className="tech-role-staffs">

                        <div className="live-staffs-details">

                            <div>

                                <h1 className="staff-page-title">
                                    Field Technicians
                                </h1>

                                <p className="staff-page-description">
                                    Manage technician profiles,
                                    contact information,
                                    specialization and
                                    certifications.
                                </p>

                            </div>

                            <span className="real-time-staff">

                                <i className="bi bi-dot"></i>

                                Real-Time Sync

                            </span>

                        </div>

                        <div className="active-autosyncing">

                            <div className="autosyncing-refresh-staffs">

                                Auto-Syncing (10s)

                                <span>
                                    <i className="bi bi-arrow-repeat"></i>
                                </span>

                            </div>

                            <button
                                type="button"
                                className="export-staffs-details"
                            >

                                <span>
                                    <i className="bi bi-download"></i>
                                </span>

                                Export Roster

                            </button>

                        </div>

                    </div>

                    <div className="staff-filter-area">

                        <button
                            type="button"
                            className="staff-filter-button staff-filter-active"
                        >
                            All Personnel

                            <span>
                                {staffMembers.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="staff-filter-button"
                        >
                            HVAC

                            <span>
                                {hvacCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="staff-filter-button"
                        >
                            Industrial Electrical

                            <span>
                                {electricalCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="staff-filter-button"
                        >
                            Plumbing

                            <span>
                                {plumbingCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="staff-filter-button"
                        >
                            Telemetry

                            <span>
                                {telemetryCount}
                            </span>
                        </button>

                        <div className="staff-status-summary">

                            <span className="staff-summary-duty">

                                <b></b>

                                {onDutyCount} On Duty

                            </span>

                            <span className="staff-summary-standby">

                                <b></b>

                                {standbyCount} Standby

                            </span>

                            <span className="staff-summary-off">

                                <b></b>

                                {offDutyCount} Off-Duty

                            </span>

                        </div>

                    </div>

                </div>

                <div className="staff-table-container">

                    <div className="staff-table-scroll">

                        <table className="staff-data-table">

                            <thead>

                                <tr>

                                    <th>
                                        TECHNICIAN
                                    </th>

                                    <th>
                                        PHONE NUMBER
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        SPECIALIZATION
                                    </th>

                                    <th>
                                        ABILITY
                                    </th>

                                    <th>
                                        LICENSE
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan={8}
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "40px",
                                            }}
                                        >
                                            Loading
                                            technicians...
                                        </td>

                                    </tr>

                                ) : staffMembers.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={8}
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "40px",
                                            }}
                                        >
                                            No technicians
                                            found.
                                        </td>

                                    </tr>

                                ) : (

                                    staffMembers.map(
                                        (staff) => (

                                            <tr
                                                key={
                                                    staff.id
                                                }
                                            >

                                

                                                <td>

                                                    <div className="staff-technician-cell">

                                                        <img
                                                            src={
                                                                staff.avatar
                                                            }
                                                            alt={
                                                                staff.name
                                                            }
                                                            className="staff-technician-avatar"
                                                        />

                                                        <div className="staff-technician-info">

                                                            <strong>
                                                                {
                                                                    staff.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    staff.id
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>

                                      

                                                <td>

                                                    <div className="staff-phone">

                                                        <i className="bi bi-telephone"></i>

                                                        <span>
                                                            {
                                                                staff.phone
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                       

                                                <td>

                                                    <div className="staff-email">

                                                        <i className="bi bi-envelope"></i>

                                                        <span>
                                                            {
                                                                staff.email
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                              

                                                <td>

                                                    <div className="staff-specialization">

                                                        {
                                                            staff.specialization
                                                        }

                                                    </div>

                                                </td>

                                          

                                                <td>

                                                    <div className="staff-ability">

                                                        {
                                                            staff.ability
                                                        }

                                                    </div>

                                                </td>

                                             

                                                <td>

                                                    <div className="staff-license-list">

                                                        {staff.license.length >
                                                        0 ? (

                                                            staff.license.map(
                                                                (
                                                                    license,
                                                                    index
                                                                ) => (

                                                                    <span
                                                                        className="staff-license"
                                                                        key={`${license}-${index}`}
                                                                    >

                                                                        <i className="bi bi-patch-check"></i>

                                                                        {
                                                                            license
                                                                        }

                                                                    </span>

                                                                )
                                                            )

                                                        ) : (

                                                            <span className="staff-no-license">
                                                                No License
                                                            </span>

                                                        )}

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`staff-status-badge ${getStatusClass(
                                                            staff.status
                                                        )}`}
                                                    >

                                                        <b></b>

                                                        {
                                                            staff.status
                                                        }

                                                    </span>

                                                </td>

                                
                                                <td>

                                                    <button
                                                        type="button"
                                                        className="staff-action-button"
                                                    >

                                                        {
                                                            staff.action
                                                        }

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="staff-table-footer">

                        <span>

                            Showing{" "}

                            <strong>
                                {staffMembers.length >
                                0
                                    ? `1-${staffMembers.length}`
                                    : "0"}
                            </strong>{" "}

                            of{" "}

                            <strong>
                                {
                                    staffMembers.length
                                }
                            </strong>{" "}

                            field technicians

                        </span>

                        <div className="staff-pagination">

                            <button
                                type="button"
                                disabled
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                className="staff-pagination-active"
                            >
                                1
                            </button>

                            <button
                                type="button"
                                disabled
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {showAddTechnician && (

                <div
                    className="add-technician-popup-overlay"
                    onClick={() =>
                        setShowAddTechnician(
                            false
                        )
                    }
                >

                    <div
                        className="add-technician-popup"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <AddTechnician
                            onClose={
                                handleTechnicianClose
                            }
                        />

                    </div>

                </div>

            )}

        </>
    );
}

export default Staff;