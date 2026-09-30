"use client";

import React, { useEffect, useState } from "react";
import "./layout.css";
import { Sidebar } from "lucide-react";
import Sidenav from "@/componnets/sidebar/page";

interface AgentLayoutProps {
  children: React.ReactNode;
}

const LayoutStructure: React.FC<AgentLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = collapsed ? "auto" : "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [collapsed, isMobile]);

  return (
    <div className="agent-layout">
      <Sidenav
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />


      {isMobile && !collapsed && (
        <div
          className="sidebar-backdrop"
          onClick={() => setCollapsed(true)}
        />
      )}

    
      <main
        className={`agent-content ${
          !collapsed && isMobile ? "content-hidden" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default LayoutStructure;