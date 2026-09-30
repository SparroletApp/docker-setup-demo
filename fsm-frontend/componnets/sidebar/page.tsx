"use client";

import React, { useEffect, useState } from "react";
import "./sidebar.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";

interface SidenavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

interface NavItem {
  label: string;
  icon: string;
  path?: string;
  children?: {
    label: string;
    path: string;
    icon: string;
  }[];
}

const Sidenav: React.FC<SidenavProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [tooltip, setTooltip] = useState({
    text: "",
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const storedRole = sessionStorage.getItem("user_role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path;
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const showTooltip = (
    e: React.MouseEvent<HTMLElement>,
    text: string
  ) => {
    if (!collapsed) return;

    setTooltip({
      text,
      visible: true,
      x: e.clientX + 10,
      y: e.clientY,
    });
  };

  const moveTooltip = (e: React.MouseEvent<HTMLElement>) => {
    if (!collapsed) return;

    setTooltip((prev) => ({
      ...prev,
      x: e.clientX + 10,
      y: e.clientY,
    }));
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const normalNavItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: "bi-grid-1x2-fill",
      path: "/dashboard",
    },
    {
      label: "Service-Type",
      icon: "bi-hdd-network",
      path: "/service-type",
    },
    {
      label: "Tickets",
      icon: "bi-ticket-perforated",
      path: "/tickets",
    },
    {
      label: "Customers",
      icon: "bi-people",
      path: "/customers",
    },
    {
      label: "Jobs",
      icon: "bi-tools",
      path: "/jobs",
    },
    {
      label: "Category",
      icon: "bi-pie-chart",
      path: "/category",
    },
    {
      label: "Parts",
      icon: "bi-archive",
      path: "/parts",
    },
    {
      label: "Staffs",
      icon: "bi-image",
      path: "/staffs",
    },
    {
      label: "Invoices",
      icon: "bi-receipt-cutoff",
      path: "/invoices",
    },
    {
      label: "Settings",
      icon: "bi-gear",
      path: "/settings",
    },
  ];

  const superAdminNavItems: NavItem[] = [
    
    {
      label: "Dashboard",
      icon: "bi-building",
      path: "/admin-dashboard",
    },
    {
      label: "Users",
      icon: "bi-people",
      path: "/user-list",
    },

  ];

  const navItems =
    role === "SUPER_ADMIN"
      ? superAdminNavItems
      : normalNavItems;

  return (
    <>
      {isMobile && collapsed && (
        <button
          className="sidenav-mobile-toggle-btn"
          onClick={() => setCollapsed(false)}
        >
          <i className="bi bi-list" />
        </button>
      )}

      <div
        className={`sidebar-container ${
          collapsed ? "collapsed" : ""
        } ${isMobile ? "mobile-sidebar" : ""}`}
      >
        <div className="side-top-bar">

          <div className="profile text-center">
            {collapsed ? (
              <img
                onClick={() => setCollapsed(false)}
                src="/fsm-logo.png"
                alt="Logo"
                className="sidebar-logo-img"
              />
            ) : (
              <div className="top-img-layout">
                <img
                  onClick={() => setCollapsed(false)}
                  src="/fsm-logo.png"
                  alt="Logo"
                  className="sidebar-logo-img"
                />

                <div className="top-right-layout">
                  <h2>Fsm Cloud</h2>

                  <div className="enterprise-layout">
                    {role === "super_admin" ? (
                      <>
                        Super Admin
                        <br />
                        Management
                      </>
                    ) : (
                      <>
                        Enterprise
                        <br />
                        Logistics
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!collapsed ? (
              <span
                className="left-tan-layout"
                onClick={() => setCollapsed(true)}
              >
                <i className="bi bi-chevron-double-left"></i>
              </span>
            ) : (
              <span
                className="right-tan-layout"
                onClick={() => setCollapsed(false)}
              >
                <i className="bi bi-chevron-double-right"></i>
              </span>
            )}
          </div>

          <div className="dispatch-layout">
            {role === "super_admin"
              ? "SYSTEM MANAGEMENT"
              : "DISPATCH & OPERATIONS"}
          </div>

          <ul className="sidebar-menu mt-2">
            {navItems.map((item, index) => {
              const isParentActive =
                item.children?.some(
                  (sub) => pathname === sub.path
                ) || false;

              return (
                <React.Fragment key={index}>

                  {item.label === "Parts" &&
                    !collapsed && (
                      <li className="sidebar-resources-heading">
                        RESOURCES & MANAGEMENT
                      </li>
                    )}

                  {item.label === "Settings" &&
                    !collapsed &&
                    role === "super_admin" && (
                      <li className="sidebar-resources-heading">
                        SYSTEM
                      </li>
                    )}

                  <li
                    className={`menu-item ${
                      isActive(item.path) ||
                      isParentActive
                        ? "active"
                        : ""
                    }`}
                  >
                    {item.children ? (
                      <>
                        <div
                          className="menu-link"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === item.label
                                ? null
                                : item.label
                            )
                          }
                          onMouseEnter={(e) =>
                            showTooltip(e, item.label)
                          }
                          onMouseMove={moveTooltip}
                          onMouseLeave={hideTooltip}
                        >
                          <i
                            className={`bi ${item.icon}`}
                          />

                          {!collapsed && (
                            <span className="ms-2">
                              {item.label}
                            </span>
                          )}
                        </div>

                        {openMenu === item.label && (
                          <ul className="submenu">
                            {item.children.map(
                              (sub, i) => (
                                <li
                                  key={i}
                                  className={`submenu-item ${
                                    pathname === sub.path
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <Link
                                    href={sub.path}
                                    className="submenu-link"
                                    onClick={
                                      handleLinkClick
                                    }
                                    onMouseEnter={(e) =>
                                      showTooltip(
                                        e,
                                        sub.label
                                      )
                                    }
                                    onMouseMove={
                                      moveTooltip
                                    }
                                    onMouseLeave={
                                      hideTooltip
                                    }
                                  >
                                    <i
                                      className={`bi ${sub.icon}`}
                                    />

                                    {!collapsed && (
                                      <span>
                                        {sub.label}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.path || "#"}
                        className="menu-link"
                        onClick={handleLinkClick}
                        onMouseEnter={(e) =>
                          showTooltip(e, item.label)
                        }
                        onMouseMove={moveTooltip}
                        onMouseLeave={hideTooltip}
                      >
                        <div className="icon-wrapper">
                          <i
                            className={`bi ${item.icon}`}
                          />
                        </div>

                        {!collapsed && (
                          <span className="ms-2">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>

        <div>
          <div
            className={`sidebar-bottom-card ${
              collapsed ? "collapsed-card" : ""
            }`}
          >
            {!collapsed ? (
              <>
                <div className="plan-card-header">
                  <div className="plan-card-title">
                    <i className="bi bi-stars"></i>
                    <h6>
                      {role === "super_admin"
                        ? "FSM Administration"
                        : "Rayloop FSM Plan"}
                    </h6>
                  </div>

                  <span className="pro-layout">
                    {role === "super_admin"
                      ? "ADMIN"
                      : "PRO"}
                  </span>
                </div>

                <div className="plan-card-seats">
                  <span>
                    {role === "super_admin"
                      ? "System access"
                      : "Seats utilized"}
                  </span>

                  <span>
                    {role === "super_admin"
                      ? "Full"
                      : "18/25"}
                  </span>
                </div>

                <div className="plan-progress">
                  <div className="plan-progress-fill"></div>
                </div>

                <div className="plan-card-footer">
                  <span>
                    {role === "super_admin"
                      ? "System Management"
                      : "Renews Oct 2025"}
                  </span>

                  <button className="plan-manage-button">
                    Manage
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="plan-collapsed-icon">
                <i className="bi bi-stars"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            top: tooltip.y,
            left: tooltip.x,
          }}
        >
          {tooltip.text}
        </div>
      )}

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h5>Confirm Sign Out</h5>

            <p>
              Are you sure you want to sign out?
            </p>

            <div className="logout-modal-buttons">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-danger ms-2"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidenav;