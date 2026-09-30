import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./pages/login/LoginScreen";
import OtpScreen from "./pages/otp/OtpScreen";

import Home from "./pages/home/home";
import Jobs from "./pages/jobs/jobs";
import JobView from "./pages/JobView/JobView";

import Layout from "./pages/Layout/Layout";
import TechnicianProfile from "./pages/profile/profile";
import EditProfile from "./pages/edit-profile/edit-profile";

import CreateInvoice from "./pages/createInvoice/cretaeInvoice";
import Invoices from "./pages/invoices/invoices";

// Invoice View - enable when ready
// import InvoiceView from "./pages/InvoiceView/InvoiceView";

type Screen =
  | "login"
  | "otp"
  | "home"
  | "jobs"
  | "jobview"
  | "invoicecreate"
  | "invoices"
  | "invoiceview"
  | "profile"
  | "editprofile";

export default function App() {
  // =========================================================
  // CURRENT SCREEN
  // =========================================================

  const [screen, setScreen] =
    useState<Screen>("login");

  // =========================================================
  // SELECTED JOB
  // =========================================================

  const [selectedJobId, setSelectedJobId] =
    useState<string | number | null>(null);

  // =========================================================
  // SELECTED INVOICE
  // =========================================================

  const [selectedInvoiceId, setSelectedInvoiceId] =
    useState<string | number | null>(null);

  // =========================================================
  // CURRENT USER
  // =========================================================

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [currentUserName, setCurrentUserName] =
    useState<string | undefined>(undefined);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const goToHome = () => {
    setScreen("home");
  };

  const goToJobs = () => {
    setScreen("jobs");
  };

  const goToInvoices = () => {
    setScreen("invoices");
  };

  const goToProfile = () => {
    setScreen("profile");
  };

  const goToEditProfile = () => {
    setScreen("editprofile");
  };

  // =========================================================
  // CREATE INVOICE
  // =========================================================
  //
  // This is now shared by:
  //
  // 1. JobView
  // 2. Jobs card
  //
  // Both send the selected job ID to the existing
  // CreateInvoice page.
  // =========================================================

  const goToCreateInvoice = (
    jobId: string | number
  ) => {
    console.log(
      "Opening Create Invoice for job:",
      jobId
    );

    setSelectedJobId(jobId);
    setScreen("invoicecreate");
  };

  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

  useEffect(() => {
    loadCurrentUser();
  }, [screen]);

  const loadCurrentUser = async () => {
    try {
      const storedId =
        await AsyncStorage.getItem(
          "technician_id"
        );

      const storedName =
        await AsyncStorage.getItem(
          "technician_name"
        );

      // -----------------------------------------
      // USER ID
      // -----------------------------------------

      if (storedId) {
        const numericId = Number(
          storedId
        );

        if (!Number.isNaN(numericId)) {
          setCurrentUserId(
            numericId
          );
        }
      }

      // -----------------------------------------
      // USER NAME
      // -----------------------------------------

      if (storedName) {
        setCurrentUserName(
          storedName
        );
      }
    } catch (error) {
      console.log(
        "Unable to load current technician:",
        error
      );
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  if (screen === "login") {
    return (
      <LoginScreen
        goToOtp={() => {
          setScreen("otp");
        }}
      />
    );
  }

  // =========================================================
  // OTP
  // =========================================================

  if (screen === "otp") {
    return (
      <OtpScreen
        goToHome={async () => {
          await loadCurrentUser();

          setScreen("home");
        }}
        goToLogin={() => {
          setScreen("login");
        }}
      />
    );
  }

  // =========================================================
  // HOME
  // =========================================================

  if (screen === "home") {
    return (
      <Layout
        activeTab="home"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <Home
          goToJobs={goToJobs}
          goToInvoices={goToInvoices}
          goToJobView={(jobId) => {
            setSelectedJobId(jobId);
            setScreen("jobview");
          }}
        />
      </Layout>
    );
  }

  // =========================================================
  // JOBS
  // =========================================================

  if (screen === "jobs") {
    return (
      <Layout
        activeTab="jobs"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <Jobs
          goToHome={goToHome}

          // -----------------------------------------
          // OPEN JOB VIEW
          // -----------------------------------------

          goToJobView={(jobId) => {
            setSelectedJobId(jobId);
            setScreen("jobview");
          }}

          // -----------------------------------------
          // OPEN CREATE INVOICE PAGE
          // -----------------------------------------

          goToCreateInvoice={
            goToCreateInvoice
          }
        />
      </Layout>
    );
  }

  // =========================================================
  // JOB VIEW
  // =========================================================

  if (
    screen === "jobview" &&
    selectedJobId !== null
  ) {
    return (
      <Layout
        activeTab="jobs"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <JobView
          jobId={Number(
            selectedJobId
          )}

          currentUserId={
            currentUserId ?? -1
          }

          currentUserName={
            currentUserName
          }

          goToJobs={goToJobs}

          // -----------------------------------------
          // OPEN CREATE INVOICE PAGE
          // -----------------------------------------

          goToInvoiceCreate={
            goToCreateInvoice
          }
        />
      </Layout>
    );
  }

  // =========================================================
  // CREATE INVOICE
  // =========================================================

  if (
    screen === "invoicecreate" &&
    selectedJobId !== null
  ) {
    return (
      <Layout
        activeTab="jobs"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <CreateInvoice
          jobId={
            selectedJobId
          }

          // -----------------------------------------
          // BACK
          // -----------------------------------------

          onBack={() => {
            setScreen("jobview");
          }}

          // -----------------------------------------
          // SUCCESS
          // -----------------------------------------

          onSuccess={() => {
            console.log(
              "Invoice created successfully."
            );

            setScreen("invoices");
          }}
        />
      </Layout>
    );
  }

  // =========================================================
  // INVOICES
  // =========================================================

  if (screen === "invoices") {
    return (
      <Layout
        activeTab="invoices"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <Invoices
          goToHome={
            goToHome
          }

        
          goToInvoiceView={(
            invoiceId
          ) => {
            setSelectedInvoiceId(
              invoiceId
            );

            console.log(
              "Selected invoice ID:",
              invoiceId
            );

    
          }}
        />
      </Layout>
    );
  }

  // =========================================================
  // INVOICE VIEW
  // =========================================================

  /*
  if (
    screen === "invoiceview" &&
    selectedInvoiceId !== null
  ) {
    return (
      <Layout
        activeTab="invoices"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <InvoiceView
          invoiceId={selectedInvoiceId}
          goToInvoices={
            goToInvoices
          }
        />
      </Layout>
    );
  }
  */


  if (screen === "profile") {
    return (
      <Layout
        activeTab="profile"
        goToHome={goToHome}
        goToJobs={goToJobs}
        goToInvoices={goToInvoices}
        goToProfile={goToProfile}
      >
        <TechnicianProfile
          onLogout={() => {
            setScreen("login");
          }}
          onEditProfile={
            goToEditProfile
          }
        />
      </Layout>
    );
  }


  if (screen === "editprofile") {
    return (
      <EditProfile
        onBack={
          goToProfile
        }
        onLogout={() => {
          setScreen("login");
        }}
      />
    );
  }

  return (
    <LoginScreen
      goToOtp={() => {
        setScreen("otp");
      }}
    />
  );
}