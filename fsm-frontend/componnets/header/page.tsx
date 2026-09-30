"use client";

import React from "react";
import {
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";
import "./header.css";

const Header = () => {
    return (
        <header>
            <div className="fsm-header-wrapper">
                <div className="fsm-header-left">
                    <h1 className="fsm-header-title">
                        Operations & Dispatch
                    </h1>
                </div>

                <div className="fsm-header-right">
                    <button className="fsm-header-notification">
                        <Bell size={23} strokeWidth={1.8} />
                        <span className="fsm-header-notification-dot"></span>
                    </button>

                    <button className="fsm-header-profile">
                        <div className="fsm-header-avatar">
                            <img
                                src="/globe.svg"
                                alt="Profile"
                            />
                        </div>
                    </button>
                </div>
            </div>
           

        </header>
    );
};

export default Header;