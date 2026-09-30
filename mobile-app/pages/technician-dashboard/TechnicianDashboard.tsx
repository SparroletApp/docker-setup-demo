// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   Switch,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { techniciandashboard } from "./TechnicianDashboard.styles";

// type InvoiceAssetLine = {
//   asset_id: number;
//   asset_name: string;
//   asset_number: string | null;
//   serial_number: string | null;
//   quantity: number;
//   unit_price: number;
// };

// type Technician = {
//   id: string | number;
//   auth_user_id: string | null;
//   user_name: string;
//   user_phone: string;
//   email: string | null;
//   role: string;
//   company_id: number | null;
// };

// type Company = {
//   id: number;
//   company_name?: string;
//   company_phone?: string;
//   company_email?: string;
//   address?: string;
// };

// type Asset = {
//   id: number;
//   title: string;
//   description: string | null;
//   serial_number: string | null;
//   model_number: string | null;
//   manufacturer: string | null;
//   purchase_date: string | null;
//   sale_date: string | null;
//   status: string | null;
//   notes: string | null;
//   created_at: string | null;
//   updated_at: string | null;
//   company_id: number | null;
// };

// type Part = {
//   id: number;
//   part_name: string;
//   part_number: string | null;
//   description: string | null;
//   manufacturer: string | null;
//   model_number: string | null;
//   price: number | null;
//   quantity: number | null;
//   status: string | null;
//   created_at: string | null;
//   updated_at: string | null;
//   asset_id: number | null;
// };

// type ScheduleFrequency = "daily" | "weekly" | "monthly" | "yearly";

// type Job = {
//   id: number;
//   job_number: string;
//   ticket_id: number;
//   company_id: number | null;
//   complaint_id: number | null;
//   technician_id: number | null;
//   job_type: string | null;
//   title: string;
//   description: string | null;
//   scheduled_date: string | null;
//   scheduled_start_time: string | null;
//   scheduled_end_time: string | null;
//   scheduled_at: string | null;
//   is_recurring: boolean;
//   recurrence_frequency: ScheduleFrequency | null;
//   recurrence_interval: number;
//   recurrence_start_date: string | null;
//   recurrence_end_date: string | null;
//   next_recurrence_date: string | null;
//   status: string;
//   priority: string | null;
//   work_started_at: string | null;
//   work_completed_at: string | null;
//   work_description: string | null;
//   notes: string | null;
//   technician_remarks: string | null;
//   customer_remarks: string | null;
//   customer_signature: string | null;
//   service_address: string | null;
//   working_hours: number | null;
//   invoice_id: number | null;
//   created_at: string;
//   updated_at: string;
// };

// type ComplaintLink = {
//   id: number;
//   asset_id: number[];
//   part_id: number[];
// };

// type KanbanStatus = "pending" | "in_progress" | "completed" | "closed";

// type InvoicePartLine = {
//   part_id: number;
//   part_name: string;
//   part_number: string | null;
//   quantity: number;
//   unit_price: number;
// };

// type InvoiceJobSnapshot = {
//   job_id: number;
//   job_number: string | null;
//   title: string | null;
//   work_started_at: string | null;
//   work_completed_at: string | null;
//   working_hours: number | null;
//   work_description: string | null;
//   technician_remarks: string | null;
// };

// type Invoice = {
//   id: number;
//   invoice_number: string;
//   job_id: number | null;
//   job_ids: number[];
//   ticket_id: number | null;
//   complaint_id: number | null;
//   company_id: number | null;
//   customer_id: number | null;
//   technician_id: number | null;
//   service_address: string | null;
//   jobs_snapshot: InvoiceJobSnapshot[];
//   working_hours: number | null;
//   service_price: number;
//   parts_total: number;
//   total_amount: number;
//   status: string;
//   notes: string | null;
//   created_at: string;
// };

// type AssetForm = {
//   title: string;
//   description: string;
//   serial_number: string;
//   model_number: string;
//   manufacturer: string;
//   purchase_date: string;
//   sale_date: string;
//   status: string;
//   notes: string;
// };

// type PartForm = {
//   part_name: string;
//   part_number: string;
//   description: string;
//   manufacturer: string;
//   model_number: string;
//   price: string;
//   quantity: string;
//   status: string;
// };

// type ApiResponse<T> = {
//   data?: T;
//   message?: string;
//   success?: boolean;
// };

// const emptyPartForm: PartForm = {
//   part_name: "",
//   part_number: "",
//   description: "",
//   manufacturer: "",
//   model_number: "",
//   price: "0",
//   quantity: "1",
//   status: "available",
// };

// const ENDPOINTS = {
//   technician: "/users/get",
//   company: "/companies/get",
//   jobs: "/jobs/technician",
//   jobUpdate: "/jobs/update",
//   jobTake: "/jobs/take",
//   complaint: "/complaints/get",
//   complaintUpdate: "/complaints/update",
//   assets: "/assets/company",
//   assetUpdate: "/assets/update",
//   parts: "/parts/asset",
//   partCreate: "/parts/create",
//   partUpdate: "/parts/update",
//   partDelete: "/parts/delete",
//   invoices: "/invoices/company",
//   invoiceCreate: "/invoices/create",
//   invoiceJobsClose: "/jobs/close",
// };

// const STATUS_TABS: [KanbanStatus, string][] = [
//   ["pending", "Pending"],
//   ["in_progress", "Working"],
//   ["completed", "Completed"],
//   ["closed", "Closed"],
// ];

// const getApiData = <T,>(response: T | ApiResponse<T>): T => {
//   if (
//     response &&
//     typeof response === "object" &&
//     "data" in response &&
//     (response as ApiResponse<T>).data !== undefined
//   ) {
//     return (response as ApiResponse<T>).data as T;
//   }

//   return response as T;
// };

// const getApiErrorMessage = (error: any, fallback: string) => {
//   return (
//     error?.response?.data?.message ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// };

// export default function TechnicianDashboard() {
//   const router = useRouter();

//   const [technician, setTechnician] = useState<Technician | null>(null);
//   const [company, setCompany] = useState<Company | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [tasksLoading, setTasksLoading] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [activeTab, setActiveTab] =
//     useState<KanbanStatus>("pending");

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [invoicesLoading, setInvoicesLoading] = useState(false);

//   const [selectedJobId, setSelectedJobId] =
//     useState<number | null>(null);

//   const [complaint, setComplaint] =
//     useState<ComplaintLink | null>(null);

//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
//   const [assetsLoading, setAssetsLoading] = useState(false);

//   const [parts, setParts] = useState<Part[]>([]);
//   const [selectedParts, setSelectedParts] = useState<Part[]>([]);
//   const [partsLoading, setPartsLoading] = useState(false);

//   const [savingJob, setSavingJob] = useState(false);
//   const [savingAsset, setSavingAsset] = useState(false);
//   const [savingPart, setSavingPart] = useState(false);
//   const [deletingPartId, setDeletingPartId] =
//     useState<number | null>(null);
//   const [savingSchedule, setSavingSchedule] = useState(false);

//   const [isRecurring, setIsRecurring] = useState(false);
//   const [scheduleFrequency, setScheduleFrequency] =
//     useState<ScheduleFrequency>("monthly");
//   const [repeatEvery, setRepeatEvery] = useState("1");
//   const [scheduleStartDate, setScheduleStartDate] = useState("");
//   const [scheduleEndDate, setScheduleEndDate] = useState("");
//   const [scheduleStartTime, setScheduleStartTime] = useState("");
//   const [scheduleEndTime, setScheduleEndTime] = useState("");

//   const [showAssetForm, setShowAssetForm] = useState(false);
//   const [showPartForm, setShowPartForm] = useState(false);
//   const [editingPartId, setEditingPartId] =
//     useState<number | null>(null);

//   const [jobStartTime, setJobStartTime] = useState("");
//   const [jobEndTime, setJobEndTime] = useState("");
//   const [technicianRemarks, setTechnicianRemarks] = useState("");
//   const [workDescription, setWorkDescription] = useState("");

//   const [assetForm, setAssetForm] = useState<AssetForm>({
//     title: "",
//     description: "",
//     serial_number: "",
//     model_number: "",
//     manufacturer: "",
//     purchase_date: "",
//     sale_date: "",
//     status: "active",
//     notes: "",
//   });

//   const [partForm, setPartForm] =
//     useState<PartForm>(emptyPartForm);

//   const [invoicePromptJobId, setInvoicePromptJobId] =
//     useState<number | null>(null);

//   const [invoiceJobs, setInvoiceJobs] = useState<Job[]>([]);
//   const [invoiceIncludedJobIds, setInvoiceIncludedJobIds] =
//     useState<number[]>([]);

//   const [invoiceComplaintId, setInvoiceComplaintId] =
//     useState<number | null>(null);

//   const [invoiceParts, setInvoiceParts] =
//     useState<InvoicePartLine[]>([]);

//   const [invoiceAssets, setInvoiceAssets] =
//     useState<InvoiceAssetLine[]>([]);

//   const [loadingInvoiceAssets, setLoadingInvoiceAssets] =
//     useState(false);

//   const [invoiceServicePrice, setInvoiceServicePrice] =
//     useState("");

//   const [invoiceNotes, setInvoiceNotes] = useState("");

//   const [loadingInvoiceParts, setLoadingInvoiceParts] =
//     useState(false);

//   const [savingInvoice, setSavingInvoice] = useState(false);

//   const fetchTechnicianById = async (
//     technicianId: number
//   ): Promise<Technician | null> => {
//     try {
//       const response = await api.post<Technician>(
//         ENDPOINTS.technician,
//         {
//           id: technicianId,
//         }
//       );

//       return getApiData(response);
//     } catch (error) {
//       console.error("fetchTechnicianById:", error);
//       return null;
//     }
//   };

//   const fetchCompany = async (
//     companyId: number
//   ): Promise<Company | null> => {
//     try {
//       const response = await api.post<Company>(
//         ENDPOINTS.company,
//         {
//           id: companyId,
//         }
//       );

//       return getApiData(response);
//     } catch (error) {
//       console.error("fetchCompany:", error);
//       return null;
//     }
//   };

//   const fetchAssignedTasks = async (
//     technicianId: string | number,
//     companyId: number | null
//   ) => {
//     if (companyId === null) {
//       setJobs([]);
//       return;
//     }

//     setTasksLoading(true);

//     try {
//       const response = await api.post<Job[]>(
//         ENDPOINTS.jobs,
//         {
//           technicianId: Number(technicianId),
//           companyId: Number(companyId),
//         }
//       );

//       const result = getApiData(response);

//       setJobs(Array.isArray(result) ? result : []);
//     } catch (error) {
//       console.error("fetchAssignedTasks:", error);

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to load technician jobs."
//         )
//       );

//       setJobs([]);
//     } finally {
//       setTasksLoading(false);
//     }
//   };

//   const fetchInvoices = async (
//     companyId: number | null,
//     technicianId?: number
//   ) => {
//     if (companyId === null) {
//       setInvoices([]);
//       return;
//     }

//     setInvoicesLoading(true);

//     try {
//       const response = await api.post<Invoice[]>(
//         ENDPOINTS.invoices,
//         {
//           companyId: Number(companyId),
//           technicianId:
//             technicianId !== undefined
//               ? Number(technicianId)
//               : undefined,
//         }
//       );

//       const result = getApiData(response);

//       setInvoices(Array.isArray(result) ? result : []);
//     } catch (error) {
//       console.error("fetchInvoices:", error);

//       setInvoices([]);
//     } finally {
//       setInvoicesLoading(false);
//     }
//   };

//   const fetchTechnician = async () => {
//     setLoading(true);

//     try {
//       const storedUser = await AsyncStorage.getItem("user");

//       if (!storedUser) {
//         router.replace("/technician-login");
//         return;
//       }

//       let storedTechnician: any;

//       try {
//         storedTechnician = JSON.parse(storedUser);
//       } catch {
//         storedTechnician = null;
//       }

//       const technicianId = Number(
//         storedTechnician?.id ||
//           storedTechnician?.user_id ||
//           storedTechnician?.technician_id
//       );

//       if (!Number.isFinite(technicianId)) {
//         await AsyncStorage.multiRemove([
//           "user",
//           "access_token",
//           "login_email",
//         ]);

//         router.replace("/technician-login");
//         return;
//       }

//       let technicianData =
//         await fetchTechnicianById(technicianId);

//       if (!technicianData) {
//         technicianData = storedTechnician as Technician;
//       }

//       if (!technicianData) {
//         await AsyncStorage.multiRemove([
//           "user",
//           "access_token",
//           "login_email",
//         ]);

//         router.replace("/technician-login");
//         return;
//       }

//       if (
//         technicianData.role &&
//         technicianData.role.toLowerCase() !== "technician"
//       ) {
//         Alert.alert(
//           "Access denied",
//           "This account is not a technician account."
//         );

//         await AsyncStorage.multiRemove([
//           "user",
//           "access_token",
//           "login_email",
//         ]);

//         router.replace("/technician-login");
//         return;
//       }

//       setTechnician(technicianData);

//       if (technicianData.company_id !== null) {
//         const companyData = await fetchCompany(
//           Number(technicianData.company_id)
//         );

//         if (companyData) {
//           setCompany(companyData);
//         }
//       }

//       await fetchAssignedTasks(
//         technicianData.id,
//         technicianData.company_id
//       );

//       await fetchInvoices(
//         technicianData.company_id,
//         Number(technicianData.id)
//       );
//     } catch (error) {
//       console.error("fetchTechnician:", error);

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to load technician account."
//         )
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAssets = async () => {
//     if (!technician || technician.company_id === null) {
//       setAssets([]);
//       return;
//     }

//     setAssetsLoading(true);

//     try {
//       const response = await api.post<Asset[]>(
//         ENDPOINTS.assets,
//         {
//           companyId: Number(technician.company_id),
//         }
//       );

//       const result = getApiData(response);

//       setAssets(Array.isArray(result) ? result : []);
//     } catch (error) {
//       console.error("fetchAssets:", error);

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to load assets."
//         )
//       );

//       setAssets([]);
//     } finally {
//       setAssetsLoading(false);
//     }
//   };

//   const fetchPartsForAssets = async (
//     assetIds: number[]
//   ) => {
//     if (assetIds.length === 0) {
//       setParts([]);
//       return;
//     }

//     setPartsLoading(true);

//     try {
//       const response = await api.post<Part[]>(
//         ENDPOINTS.parts,
//         {
//           assetIds,
//         }
//       );

//       const result = getApiData(response);

//       setParts(Array.isArray(result) ? result : []);
//     } catch (error) {
//       console.error("fetchPartsForAssets:", error);

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to load parts."
//         )
//       );

//       setParts([]);
//     } finally {
//       setPartsLoading(false);
//     }
//   };

//   const fetchComplaint = async (
//     complaintId: number
//   ): Promise<ComplaintLink | null> => {
//     try {
//       const response = await api.post<ComplaintLink>(
//         ENDPOINTS.complaint,
//         {
//           id: complaintId,
//         }
//       );

//       const result = getApiData(response);

//       if (!result) {
//         return null;
//       }

//       return {
//         id: Number(result.id),
//         asset_id: Array.isArray(result.asset_id)
//           ? result.asset_id.map(Number)
//           : [],
//         part_id: Array.isArray(result.part_id)
//           ? result.part_id.map(Number)
//           : [],
//       };
//     } catch (error) {
//       console.error("fetchComplaint:", error);
//       return null;
//     }
//   };

//   const formatInputDate = (date: Date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");

//     return `${y}-${m}-${d}`;
//   };

//   const getNextOccurrence = (
//     startDate: string,
//     frequency: ScheduleFrequency,
//     interval: number
//   ) => {
//     const date = new Date(`${startDate}T00:00:00`);

//     if (Number.isNaN(date.getTime())) {
//       return startDate;
//     }

//     switch (frequency) {
//       case "daily":
//         date.setDate(date.getDate() + interval);
//         break;

//       case "weekly":
//         date.setDate(date.getDate() + interval * 7);
//         break;

//       case "monthly":
//         date.setMonth(date.getMonth() + interval);
//         break;

//       case "yearly":
//         date.setFullYear(date.getFullYear() + interval);
//         break;
//     }

//     return formatInputDate(date);
//   };

//   const toDateTimeLocal = (value: string) => {
//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//       return "";
//     }

//     const offset = date.getTimezoneOffset();

//     const local = new Date(
//       date.getTime() - offset * 60000
//     );

//     return local
//       .toISOString()
//       .slice(0, 16)
//       .replace("T", " ");
//   };

//   const formatDate = (date: string | null) => {
//     if (!date) {
//       return "-";
//     }

//     return new Date(
//       `${date}T00:00:00`
//     ).toLocaleDateString();
//   };

//   const formatTime = (time: string | null) =>
//     time ? time.substring(0, 5) : "-";

//   const formatCurrency = (
//     value: number | null | undefined
//   ) => `₹${Number(value || 0).toFixed(2)}`;

//   const normalizeStatus = (
//     status: string | null
//   ): KanbanStatus => {
//     switch (status?.toLowerCase()) {
//       case "in_progress":
//         return "in_progress";

//       case "completed":
//         return "completed";

//       case "closed":
//         return "closed";

//       default:
//         return "pending";
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     switch (normalizeStatus(status)) {
//       case "pending":
//         return "Pending";

//       case "in_progress":
//         return "Working";

//       case "completed":
//         return "Completed";

//       case "closed":
//         return "Closed";
//     }
//   };

//   const getJobsForStatus = (
//     status: KanbanStatus
//   ) =>
//     jobs.filter(
//       job => normalizeStatus(job.status) === status
//     );

//   const assetToForm = (
//     asset: Asset
//   ): AssetForm => ({
//     title: asset.title || "",
//     description: asset.description || "",
//     serial_number: asset.serial_number || "",
//     model_number: asset.model_number || "",
//     manufacturer: asset.manufacturer || "",
//     purchase_date: asset.purchase_date || "",
//     sale_date: asset.sale_date || "",
//     status: asset.status || "active",
//     notes: asset.notes || "",
//   });

//   const handleTakeJob = async (jobId: number) => {
//     if (!technician || updatingStatus === jobId) {
//       return;
//     }

//     if (technician.company_id === null) {
//       Alert.alert(
//         "Error",
//         "Technician company is not available."
//       );
//       return;
//     }

//     setUpdatingStatus(jobId);

//     try {
//       const response = await api.post<Job>(
//         ENDPOINTS.jobTake,
//         {
//           id: jobId,
//           technicianId: Number(technician.id),
//           companyId: Number(technician.company_id),
//         }
//       );

//       const updatedJob = getApiData(response);

//       setJobs(current =>
//         current.map(job =>
//           job.id === jobId
//             ? {
//                 ...job,
//                 ...(updatedJob || {
//                   technician_id: Number(
//                     technician.id
//                   ),
//                 }),
//               }
//             : job
//         )
//       );
//     } catch (error) {
//       console.error("handleTakeJob:", error);

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to take this job."
//         )
//       );

//       await fetchAssignedTasks(
//         technician.id,
//         technician.company_id
//       );
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   const handleStatusChange = async (
//     jobId: number,
//     newStatus: KanbanStatus
//   ) => {
//     if (updatingStatus === jobId || !technician) {
//       return;
//     }

//     if (newStatus === "closed") {
//       Alert.alert(
//         "Notice",
//         "Jobs close automatically once an invoice is created."
//       );
//       return;
//     }

//     const existingJob = jobs.find(
//       job => job.id === jobId
//     );

//     if (!existingJob) {
//       return;
//     }

//     if (existingJob.status === "closed") {
//       Alert.alert(
//         "Notice",
//         "This job is closed and locked."
//       );
//       return;
//     }

//     if (existingJob.technician_id === null) {
//       Alert.alert(
//         "Notice",
//         "Please take this job first."
//       );
//       return;
//     }

//     if (
//       Number(existingJob.technician_id) !==
//       Number(technician.id)
//     ) {
//       Alert.alert(
//         "Notice",
//         "This job belongs to another technician."
//       );
//       return;
//     }

//     if (
//       normalizeStatus(existingJob.status) ===
//       newStatus
//     ) {
//       return;
//     }

//     setUpdatingStatus(jobId);

//     try {
//       const response = await api.post<Job>(
//         ENDPOINTS.jobUpdate,
//         {
//           id: jobId,
//           status: newStatus,
//           technicianId: Number(technician.id),
//         }
//       );

//       const updatedJob = getApiData(response);

//       setJobs(current =>
//         current.map(job =>
//           job.id === jobId
//             ? {
//                 ...job,
//                 ...(updatedJob || {
//                   status: newStatus,
//                 }),
//               }
//             : job
//         )
//       );

//       if (newStatus === "completed") {
//         setInvoicePromptJobId(jobId);
//       }
//     } catch (error) {
//       console.error("handleStatusChange:", error);

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to update job status."
//         )
//       );
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   const loadJobSchedule = (job: Job) => {
//     setIsRecurring(Boolean(job.is_recurring));

//     setScheduleFrequency(
//       job.recurrence_frequency || "monthly"
//     );

//     setRepeatEvery(
//       String(job.recurrence_interval || 1)
//     );

//     setScheduleStartDate(
//       job.recurrence_start_date ||
//         job.scheduled_date ||
//         ""
//     );

//     setScheduleEndDate(
//       job.recurrence_end_date || ""
//     );

//     setScheduleStartTime(
//       job.scheduled_start_time
//         ? job.scheduled_start_time.substring(0, 5)
//         : ""
//     );

//     setScheduleEndTime(
//       job.scheduled_end_time
//         ? job.scheduled_end_time.substring(0, 5)
//         : ""
//     );
//   };

//   const openJobPopup = async (job: Job) => {
//     if (job.status === "closed") {
//       Alert.alert(
//         "Locked",
//         "This job is closed and locked. Find its invoice in the Invoices section."
//       );
//       return;
//     }

//     setSelectedJobId(job.id);
//     setComplaint(null);
//     setSelectedAssets([]);
//     setSelectedParts([]);
//     setParts([]);

//     setShowAssetForm(false);
//     setShowPartForm(false);
//     setEditingPartId(null);
//     setPartForm(emptyPartForm);

//     setJobStartTime(
//       job.work_started_at
//         ? toDateTimeLocal(job.work_started_at)
//         : ""
//     );

//     setJobEndTime(
//       job.work_completed_at
//         ? toDateTimeLocal(job.work_completed_at)
//         : ""
//     );

//     setTechnicianRemarks(
//       job.technician_remarks || ""
//     );

//     setWorkDescription(
//       job.work_description || ""
//     );

//     loadJobSchedule(job);

//     await fetchAssets();

//     if (!job.complaint_id) {
//       return;
//     }

//     try {
//       const complaintData =
//         await fetchComplaint(
//           Number(job.complaint_id)
//         );

//       if (!complaintData) {
//         return;
//       }

//       setComplaint(complaintData);

//       const assetIds =
//         complaintData.asset_id || [];

//       const partIds =
//         complaintData.part_id || [];

//       const matchingAssets =
//         assets.filter(asset =>
//           assetIds.includes(asset.id)
//         );

//       setSelectedAssets(matchingAssets);

//       if (matchingAssets.length > 0) {
//         setAssetForm(
//           assetToForm(matchingAssets[0])
//         );
//       }

//       if (assetIds.length > 0) {
//         const response =
//           await api.post<Part[]>(
//             ENDPOINTS.parts,
//             {
//               assetIds,
//             }
//           );

//         const loadedParts =
//           getApiData(response);

//         const normalizedParts =
//           Array.isArray(loadedParts)
//             ? loadedParts
//             : [];

//         setParts(normalizedParts);

//         setSelectedParts(
//           normalizedParts.filter(part =>
//             partIds.includes(part.id)
//           )
//         );
//       }
//     } catch (error) {
//       console.error("openJobPopup:", error);
//     }
//   };

//   const closeJobPopup = () => {
//     setSelectedJobId(null);
//     setComplaint(null);
//     setSelectedAssets([]);
//     setSelectedParts([]);
//     setParts([]);

//     setShowAssetForm(false);
//     setShowPartForm(false);
//     setEditingPartId(null);
//     setPartForm(emptyPartForm);

//     setJobStartTime("");
//     setJobEndTime("");
//     setTechnicianRemarks("");
//     setWorkDescription("");

//     setIsRecurring(false);
//     setScheduleFrequency("monthly");
//     setRepeatEvery("1");
//     setScheduleStartDate("");
//     setScheduleEndDate("");
//     setScheduleStartTime("");
//     setScheduleEndTime("");
//   };

//   const selectedJob =
//     selectedJobId !== null
//       ? jobs.find(
//           job => job.id === selectedJobId
//         ) || null
//       : null;

//   const selectedAssetForEdit =
//     selectedAssets.length > 0
//       ? selectedAssets[
//           selectedAssets.length - 1
//         ]
//       : null;

//   const handleSaveSchedule = async () => {
//     if (!selectedJob || !technician) {
//       return;
//     }

//     if (selectedJob.status === "closed") {
//       Alert.alert(
//         "Locked",
//         "This job is closed and locked."
//       );
//       return;
//     }

//     if (selectedJob.technician_id === null) {
//       Alert.alert(
//         "Notice",
//         "Take the job before changing its schedule."
//       );
//       return;
//     }

//     if (
//       Number(selectedJob.technician_id) !==
//       Number(technician.id)
//     ) {
//       Alert.alert(
//         "Notice",
//         "You can only change your own job schedule."
//       );
//       return;
//     }

//     if (!scheduleStartDate) {
//       Alert.alert(
//         "Notice",
//         "Please enter a schedule start date."
//       );
//       return;
//     }

//     const interval = Number(repeatEvery);

//     if (
//       isRecurring &&
//       (!Number.isInteger(interval) ||
//         interval < 1)
//     ) {
//       Alert.alert(
//         "Notice",
//         "Repeat Every must be at least 1."
//       );
//       return;
//     }

//     if (
//       isRecurring &&
//       scheduleEndDate &&
//       scheduleEndDate < scheduleStartDate
//     ) {
//       Alert.alert(
//         "Notice",
//         "End date cannot be before start date."
//       );
//       return;
//     }

//     if (
//       scheduleStartTime &&
//       scheduleEndTime &&
//       scheduleStartTime >= scheduleEndTime
//     ) {
//       Alert.alert(
//         "Notice",
//         "End time must be after start time."
//       );
//       return;
//     }

//     setSavingSchedule(true);

//     try {
//       let nextRecurrenceDate: string | null =
//         null;

//       if (isRecurring) {
//         nextRecurrenceDate =
//           getNextOccurrence(
//             scheduleStartDate,
//             scheduleFrequency,
//             interval
//           );

//         if (
//           scheduleEndDate &&
//           nextRecurrenceDate > scheduleEndDate
//         ) {
//           nextRecurrenceDate = null;
//         }
//       }

//       const response = await api.post<Job>(
//         ENDPOINTS.jobUpdate,
//         {
//           id: selectedJob.id,
//           technicianId: Number(technician.id),
//           scheduled_date: scheduleStartDate,
//           scheduled_start_time:
//             scheduleStartTime || null,
//           scheduled_end_time:
//             scheduleEndTime || null,
//           scheduled_at:
//             new Date().toISOString(),
//           is_recurring: isRecurring,
//           recurrence_frequency: isRecurring
//             ? scheduleFrequency
//             : null,
//           recurrence_interval: isRecurring
//             ? interval
//             : 1,
//           recurrence_start_date: isRecurring
//             ? scheduleStartDate
//             : null,
//           recurrence_end_date: isRecurring
//             ? scheduleEndDate || null
//             : null,
//           next_recurrence_date:
//             isRecurring
//               ? nextRecurrenceDate
//               : null,
//         }
//       );

//       const updatedJob = getApiData(response);

//       setJobs(current =>
//         current.map(job =>
//           job.id === selectedJob.id
//             ? {
//                 ...job,
//                 ...(updatedJob || {}),
//               }
//             : job
//         )
//       );

//       Alert.alert(
//         "Saved",
//         isRecurring && nextRecurrenceDate
//           ? `Recurring schedule saved. Next recurrence: ${formatDate(
//               nextRecurrenceDate
//             )}`
//           : "Job schedule saved."
//       );
//     } catch (error) {
//       console.error(
//         "handleSaveSchedule:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to save schedule."
//         )
//       );
//     } finally {
//       setSavingSchedule(false);
//     }
//   };

//   const handleSaveJob = async () => {
//     if (!technician || !selectedJob) {
//       return;
//     }

//     if (selectedJob.status === "closed") {
//       Alert.alert(
//         "Locked",
//         "This job is closed and locked."
//       );
//       return;
//     }

//     if (selectedJob.technician_id === null) {
//       Alert.alert(
//         "Notice",
//         "Take the job before editing it."
//       );
//       return;
//     }

//     if (
//       Number(selectedJob.technician_id) !==
//       Number(technician.id)
//     ) {
//       Alert.alert(
//         "Notice",
//         "You cannot edit another technician's job."
//       );
//       return;
//     }

//     setSavingJob(true);

//     try {
//       const startedAt = jobStartTime
//         ? new Date(
//             jobStartTime.replace(" ", "T")
//           ).toISOString()
//         : null;

//       const completedAt = jobEndTime
//         ? new Date(
//             jobEndTime.replace(" ", "T")
//           ).toISOString()
//         : null;

//       if (
//         startedAt &&
//         completedAt &&
//         new Date(startedAt) >
//           new Date(completedAt)
//       ) {
//         Alert.alert(
//           "Notice",
//           "End time cannot be before start time."
//         );
//         return;
//       }

//       let status = selectedJob.status;

//       if (startedAt && !completedAt) {
//         status = "in_progress";
//       }

//       if (completedAt) {
//         status = "completed";
//       }

//       let workingHours = Number(
//         selectedJob.working_hours || 0
//       );

//       if (startedAt && completedAt) {
//         workingHours =
//           (new Date(completedAt).getTime() -
//             new Date(startedAt).getTime()) /
//           (1000 * 60 * 60);
//       }

//       const response = await api.post<Job>(
//         ENDPOINTS.jobUpdate,
//         {
//           id: selectedJob.id,
//           technicianId: Number(
//             technician.id
//           ),
//           work_started_at: startedAt,
//           work_completed_at: completedAt,
//           working_hours: Number(
//             workingHours.toFixed(2)
//           ),
//           technician_remarks:
//             technicianRemarks,
//           work_description:
//             workDescription,
//           status,
//         }
//       );

//       const jobData = getApiData(response);

//       setJobs(current =>
//         current.map(job =>
//           job.id === selectedJob.id
//             ? {
//                 ...job,
//                 ...(jobData || {}),
//               }
//             : job
//         )
//       );

//       if (selectedJob.complaint_id) {
//         const assetIds =
//           selectedAssets.map(
//             asset => asset.id
//           );

//         const partIds =
//           selectedParts.map(
//             part => part.id
//           );

//         try {
//           const complaintResponse =
//             await api.post<ComplaintLink>(
//               ENDPOINTS.complaintUpdate,
//               {
//                 id: selectedJob.complaint_id,
//                 asset_id: assetIds,
//                 part_id: partIds,
//               }
//             );

//           const complaintData =
//             getApiData(complaintResponse);

//           if (complaintData) {
//             setComplaint({
//               id: Number(
//                 complaintData.id
//               ),
//               asset_id:
//                 Array.isArray(
//                   complaintData.asset_id
//                 )
//                   ? complaintData.asset_id.map(
//                       Number
//                     )
//                   : [],
//               part_id:
//                 Array.isArray(
//                   complaintData.part_id
//                 )
//                   ? complaintData.part_id.map(
//                       Number
//                     )
//                   : [],
//             });
//           }
//         } catch (error) {
//           Alert.alert(
//             "Partial save",
//             getApiErrorMessage(
//               error,
//               "Job was saved, but complaint assets/parts could not be updated."
//             )
//           );
//         }
//       }

//       Alert.alert(
//         "Saved",
//         "Job, working time, assets and parts updated successfully."
//       );

//       if (
//         status === "completed" &&
//         selectedJob.status !== "completed"
//       ) {
//         const finishedJobId =
//           selectedJob.id;

//         closeJobPopup();
//         setInvoicePromptJobId(
//           finishedJobId
//         );
//       }
//     } catch (error) {
//       console.error(
//         "handleSaveJob:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to update job."
//         )
//       );
//     } finally {
//       setSavingJob(false);
//     }
//   };

//   const handleAssetToggle = async (
//     assetId: number
//   ) => {
//     if (!selectedJob || !technician) {
//       return;
//     }

//     if (selectedJob.technician_id === null) {
//       Alert.alert(
//         "Notice",
//         "Take the job before editing it."
//       );
//       return;
//     }

//     if (
//       Number(selectedJob.technician_id) !==
//       Number(technician.id)
//     ) {
//       Alert.alert(
//         "Notice",
//         "You can only change your own job."
//       );
//       return;
//     }

//     const asset = assets.find(
//       item => item.id === assetId
//     );

//     if (!asset) {
//       return;
//     }

//     const already =
//       selectedAssets.some(
//         item => item.id === assetId
//       );

//     const newSelected = already
//       ? selectedAssets.filter(
//           item => item.id !== assetId
//         )
//       : [...selectedAssets, asset];

//     setSelectedAssets(newSelected);

//     const newAssetIds =
//       newSelected.map(
//         item => item.id
//       );

//     await fetchPartsForAssets(
//       newAssetIds
//     );

//     if (newAssetIds.length === 0) {
//       setSelectedParts([]);
//     } else {
//       setSelectedParts(current =>
//         current.filter(
//           part =>
//             part.asset_id !== null &&
//             newAssetIds.includes(
//               part.asset_id
//             )
//         )
//       );
//     }

//     const last =
//       newSelected[
//         newSelected.length - 1
//       ];

//     setAssetForm(
//       last
//         ? assetToForm(last)
//         : {
//             title: "",
//             description: "",
//             serial_number: "",
//             model_number: "",
//             manufacturer: "",
//             purchase_date: "",
//             sale_date: "",
//             status: "active",
//             notes: "",
//           }
//     );
//   };

//   const handlePartToggle = (
//     part: Part
//   ) => {
//     const already =
//       selectedParts.some(
//         item => item.id === part.id
//       );

//     setSelectedParts(current =>
//       already
//         ? current.filter(
//             item => item.id !== part.id
//           )
//         : [...current, part]
//     );
//   };

//   const handleSaveAsset = async () => {
//     if (
//       !selectedAssetForEdit ||
//       !technician ||
//       technician.company_id === null
//     ) {
//       return;
//     }

//     setSavingAsset(true);

//     try {
//       const response = await api.post<Asset>(
//         ENDPOINTS.assetUpdate,
//         {
//           id: selectedAssetForEdit.id,
//           companyId:
//             Number(technician.company_id),
//           title: assetForm.title.trim(),
//           description:
//             assetForm.description.trim() ||
//             null,
//           serial_number:
//             assetForm.serial_number.trim() ||
//             null,
//           model_number:
//             assetForm.model_number.trim() ||
//             null,
//           manufacturer:
//             assetForm.manufacturer.trim() ||
//             null,
//           purchase_date:
//             assetForm.purchase_date || null,
//           sale_date:
//             assetForm.sale_date || null,
//           status:
//             assetForm.status || "active",
//           notes:
//             assetForm.notes.trim() || null,
//         }
//       );

//       const updated =
//         getApiData(response);

//       if (!updated) {
//         throw new Error(
//           "Asset update failed."
//         );
//       }

//       setAssets(current =>
//         current.map(asset =>
//           asset.id === updated.id
//             ? updated
//             : asset
//         )
//       );

//       setSelectedAssets(current =>
//         current.map(asset =>
//           asset.id === updated.id
//             ? updated
//             : asset
//         )
//       );

//       setShowAssetForm(false);

//       Alert.alert(
//         "Saved",
//         "Asset updated successfully."
//       );
//     } catch (error) {
//       console.error(
//         "handleSaveAsset:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to update asset."
//         )
//       );
//     } finally {
//       setSavingAsset(false);
//     }
//   };

//   const handleSavePart = async () => {
//     if (
//       !selectedAssetForEdit ||
//       !technician
//     ) {
//       return;
//     }

//     if (!partForm.part_name.trim()) {
//       Alert.alert(
//         "Notice",
//         "Part name is required."
//       );
//       return;
//     }

//     setSavingPart(true);

//     try {
//       const payload = {
//         id:
//           editingPartId !== null
//             ? editingPartId
//             : undefined,
//         part_name:
//           partForm.part_name.trim(),
//         part_number:
//           partForm.part_number.trim() ||
//           null,
//         description:
//           partForm.description.trim() ||
//           null,
//         manufacturer:
//           partForm.manufacturer.trim() ||
//           null,
//         model_number:
//           partForm.model_number.trim() ||
//           null,
//         price:
//           Number(partForm.price) || 0,
//         quantity:
//           Number(partForm.quantity) || 0,
//         status:
//           partForm.status || "available",
//         asset_id:
//           selectedAssetForEdit.id,
//       };

//       const response =
//         editingPartId !== null
//           ? await api.post<Part>(
//               ENDPOINTS.partUpdate,
//               payload
//             )
//           : await api.post<Part>(
//               ENDPOINTS.partCreate,
//               payload
//             );

//       const result = getApiData(
//         response
//       );

//       if (!result) {
//         throw new Error(
//           "Part operation failed."
//         );
//       }

//       if (editingPartId !== null) {
//         setParts(current =>
//           current.map(part =>
//             part.id === editingPartId
//               ? result
//               : part
//           )
//         );

//         setSelectedParts(current =>
//           current.map(part =>
//             part.id === editingPartId
//               ? result
//               : part
//           )
//         );

//         Alert.alert(
//           "Saved",
//           "Part updated successfully."
//         );
//       } else {
//         setParts(current => [
//           result,
//           ...current,
//         ]);

//         Alert.alert(
//           "Saved",
//           "Part added successfully."
//         );
//       }

//       setPartForm(emptyPartForm);
//       setEditingPartId(null);
//       setShowPartForm(false);
//     } catch (error) {
//       console.error(
//         "handleSavePart:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         getApiErrorMessage(
//           error,
//           "Unable to save part."
//         )
//       );
//     } finally {
//       setSavingPart(false);
//     }
//   };

//   const handleEditPart = (
//     part: Part
//   ) => {
//     setEditingPartId(part.id);

//     setPartForm({
//       part_name:
//         part.part_name || "",
//       part_number:
//         part.part_number || "",
//       description:
//         part.description || "",
//       manufacturer:
//         part.manufacturer || "",
//       model_number:
//         part.model_number || "",
//       price:
//         String(part.price ?? 0),
//       quantity:
//         String(part.quantity ?? 0),
//       status:
//         part.status || "available",
//     });

//     setShowPartForm(true);
//   };

//   const handleDeletePart = (
//     part: Part
//   ) => {
//     if (!selectedAssetForEdit) {
//       return;
//     }

//     Alert.alert(
//       "Remove part",
//       `Remove "${part.part_name}" from this asset?`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: async () => {
//             setDeletingPartId(part.id);

//             try {
//               await api.post(
//                 ENDPOINTS.partDelete,
//                 {
//                   id: part.id,
//                   assetId:
//                     selectedAssetForEdit.id,
//                 }
//               );

//               setParts(current =>
//                 current.filter(
//                   item => item.id !== part.id
//                 )
//               );

//               setSelectedParts(current =>
//                 current.filter(
//                   item => item.id !== part.id
//                 )
//               );
//             } catch (error) {
//               console.error(
//                 "handleDeletePart:",
//                 error
//               );

//               Alert.alert(
//                 "Error",
//                 getApiErrorMessage(
//                   error,
//                   "Unable to delete part."
//                 )
//               );
//             } finally {
//               setDeletingPartId(null);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const invoicePromptJob =
//     invoicePromptJobId !== null
//       ? jobs.find(
//           job =>
//             job.id ===
//             invoicePromptJobId
//         ) || null
//       : null;

//   const closeInvoicePrompt = () =>
//     setInvoicePromptJobId(null);

//   const handleSkipInvoice = () =>
//     closeInvoicePrompt();

//   const generateInvoiceNumber = (
//     job: Job
//   ) => {
//     const datePart = new Date()
//       .toISOString()
//       .slice(0, 10)
//       .replace(/-/g, "");

//     const randomPart =
//       Math.floor(
//         1000 + Math.random() * 9000
//       );

//     return `INV-${
//       job.job_number || job.id
//     }-${datePart}-${randomPart}`;
//   };

//   const getInvoiceableJobsFor =
//     async (
//       job: Job
//     ): Promise<Job[]> => {
//       if (
//         !technician ||
//         technician.company_id === null
//       ) {
//         return [];
//       }

//       const invoiceableJobs =
//         jobs.filter(item => {
//           const isCompleted =
//             normalizeStatus(
//               item.status
//             ) === "completed";

//           return (
//             isCompleted &&
//             !item.invoice_id &&
//             Number(item.company_id) ===
//               Number(
//                 technician.company_id
//               )
//           );
//         });

//       if (
//         normalizeStatus(job.status) ===
//           "completed" &&
//         !job.invoice_id &&
//         !invoiceableJobs.some(
//           item => item.id === job.id
//         )
//       ) {
//         return [
//           job,
//           ...invoiceableJobs,
//         ];
//       }

//       return invoiceableJobs;
//     };

//   const loadInvoiceItems = async (
//     complaintId: number
//   ) => {
//     setLoadingInvoiceParts(true);
//     setLoadingInvoiceAssets(true);

//     try {
//       const complaintData =
//         await fetchComplaint(
//           complaintId
//         );

//       if (!complaintData) {
//         setInvoiceAssets([]);
//         setInvoiceParts([]);
//         return;
//       }

//       const assetIds =
//         Array.isArray(
//           complaintData.asset_id
//         )
//           ? complaintData.asset_id
//               .map(Number)
//               .filter(Number.isFinite)
//           : [];

//       const partIds =
//         Array.isArray(
//           complaintData.part_id
//         )
//           ? complaintData.part_id
//               .map(Number)
//               .filter(Number.isFinite)
//           : [];

//       if (assetIds.length > 0) {
//         try {
//           const response =
//             await api.post<Asset[]>(
//               ENDPOINTS.assets,
//               {
//                 ids: assetIds,
//               }
//             );

//           const assetData =
//             getApiData(response);

//           const lines: InvoiceAssetLine[] =
//             (Array.isArray(assetData)
//               ? assetData
//               : []
//             ).map(asset => ({
//               asset_id: Number(
//                 asset.id
//               ),
//               asset_name:
//                 asset.title ||
//                 asset.model_number ||
//                 asset.manufacturer ||
//                 "Asset",
//               asset_number:
//                 asset.model_number ||
//                 null,
//               serial_number:
//                 asset.serial_number ||
//                 null,
//               quantity: 1,
//               unit_price: 0,
//             }));

//           setInvoiceAssets(lines);
//         } catch {
//           setInvoiceAssets([]);
//         }
//       } else {
//         setInvoiceAssets([]);
//       }

//       if (partIds.length > 0) {
//         try {
//           const response =
//             await api.post<Part[]>(
//               ENDPOINTS.parts,
//               {
//                 ids: partIds,
//               }
//             );

//           const partData =
//             getApiData(response);

//           const lines: InvoicePartLine[] =
//             (Array.isArray(partData)
//               ? partData
//               : []
//             ).map(part => ({
//               part_id: Number(
//                 part.id
//               ),
//               part_name:
//                 part.part_name ||
//                 "Part",
//               part_number:
//                 part.part_number ||
//                 null,
//               quantity: Math.max(
//                 1,
//                 Number(
//                   part.quantity || 1
//                 )
//               ),
//               unit_price:
//                 Number(
//                   part.price || 0
//                 ),
//             }));

//           setInvoiceParts(lines);
//         } catch {
//           setInvoiceParts([]);
//         }
//       } else {
//         setInvoiceParts([]);
//       }
//     } catch (error) {
//       console.error(
//         "loadInvoiceItems:",
//         error
//       );

//       setInvoiceAssets([]);
//       setInvoiceParts([]);
//     } finally {
//       setLoadingInvoiceParts(false);
//       setLoadingInvoiceAssets(false);
//     }
//   };

//   const openInvoiceForm = async (
//     job: Job
//   ) => {
//     try {
//       setSavingInvoice(false);

//       const availableJobs =
//         await getInvoiceableJobsFor(
//           job
//         );

//       setInvoiceJobs(
//         availableJobs
//       );

//       setInvoiceIncludedJobIds([
//         Number(job.id),
//       ]);

//       setInvoiceComplaintId(
//         job.complaint_id ?? null
//       );

//       setInvoiceServicePrice("");
//       setInvoiceNotes("");

//       if (job.complaint_id) {
//         await loadInvoiceItems(
//           Number(job.complaint_id)
//         );
//       } else {
//         setInvoiceAssets([]);
//         setInvoiceParts([]);
//       }
//     } catch (error) {
//       console.error(
//         "openInvoiceForm:",
//         error
//       );

//       setInvoiceAssets([]);
//       setInvoiceParts([]);
//     }
//   };

//   const handleStartInvoiceFromPrompt =
//     () => {
//       if (!invoicePromptJob) {
//         return;
//       }

//       const job =
//         invoicePromptJob;

//       closeInvoicePrompt();
//       openInvoiceForm(job);
//     };

//   const closeInvoiceForm = () => {
//     setInvoiceJobs([]);
//     setInvoiceIncludedJobIds([]);
//     setInvoiceComplaintId(null);
//     setInvoiceParts([]);
//     setInvoiceAssets([]);
//     setInvoiceServicePrice("");
//     setInvoiceNotes("");
//   };

//   const toggleInvoiceJobInclusion = (
//     jobId: number
//   ) => {
//     setInvoiceIncludedJobIds(
//       current =>
//         current.includes(jobId)
//           ? current.filter(
//               id => id !== jobId
//             )
//           : [...current, jobId]
//     );
//   };

//   const getIncludedInvoiceJobs =
//     () =>
//       invoiceJobs.filter(
//         job =>
//           invoiceIncludedJobIds.includes(
//             job.id
//           )
//       );

//   const getIncludedWorkingHours =
//     () =>
//       getIncludedInvoiceJobs().reduce(
//         (sum, job) =>
//           sum +
//           Number(
//             job.working_hours || 0
//           ),
//         0
//       );

//   const updateInvoicePartQuantity = (
//     partId: number,
//     value: string
//   ) => {
//     const quantity = Math.max(
//       0,
//       Number(value) || 0
//     );

//     setInvoiceParts(current =>
//       current.map(line =>
//         line.part_id === partId
//           ? {
//               ...line,
//               quantity,
//             }
//           : line
//       )
//     );
//   };

//   const updateInvoicePartPrice = (
//     partId: number,
//     value: string
//   ) => {
//     const unit_price = Math.max(
//       0,
//       Number(value) || 0
//     );

//     setInvoiceParts(current =>
//       current.map(line =>
//         line.part_id === partId
//           ? {
//               ...line,
//               unit_price,
//             }
//           : line
//       )
//     );
//   };

//   const getInvoicePartsTotal =
//     () =>
//       invoiceParts.reduce(
//         (sum, line) =>
//           sum +
//           line.quantity *
//             line.unit_price,
//         0
//       );

//   const getInvoiceGrandTotal =
//     () =>
//       getInvoicePartsTotal() +
//       (Number(
//         invoiceServicePrice
//       ) || 0);

//   const handleCreateInvoice =
//     async () => {
//       if (!technician) {
//         return;
//       }

//       const includedJobs =
//         getIncludedInvoiceJobs();

//       if (
//         includedJobs.length === 0
//       ) {
//         Alert.alert(
//           "Notice",
//           "Select at least one job to include in this invoice."
//         );
//         return;
//       }

//       const servicePriceValue =
//         Number(invoiceServicePrice);

//       if (
//         invoiceServicePrice.trim() ===
//           "" ||
//         Number.isNaN(
//           servicePriceValue
//         ) ||
//         servicePriceValue < 0
//       ) {
//         Alert.alert(
//           "Notice",
//           "Please enter a valid service price (0 or more)."
//         );
//         return;
//       }

//       setSavingInvoice(true);

//       try {
//         const anchorJob =
//           includedJobs[0];

//         const partsTotal =
//           getInvoicePartsTotal();

//         const workingHours =
//           getIncludedWorkingHours();

//         const totalAmount =
//           partsTotal +
//           servicePriceValue;

//         const partsSnapshot =
//           invoiceParts.map(
//             line => ({
//               part_id:
//                 line.part_id,
//               part_name:
//                 line.part_name,
//               part_number:
//                 line.part_number,
//               quantity:
//                 line.quantity,
//               unit_price:
//                 line.unit_price,
//               line_total:
//                 Number(
//                   (
//                     line.quantity *
//                     line.unit_price
//                   ).toFixed(2)
//                 ),
//             })
//           );

//         const jobsSnapshot: InvoiceJobSnapshot[] =
//           includedJobs.map(job => ({
//             job_id: job.id,
//             job_number:
//               job.job_number,
//             title: job.title,
//             work_started_at:
//               job.work_started_at,
//             work_completed_at:
//               job.work_completed_at,
//             working_hours:
//               job.working_hours,
//             work_description:
//               job.work_description,
//             technician_remarks:
//               job.technician_remarks,
//           }));

//         const invoiceNumber =
//           generateInvoiceNumber(
//             anchorJob
//           );

//         const response =
//           await api.post<Invoice>(
//             ENDPOINTS.invoiceCreate,
//             {
//               invoice_number:
//                 invoiceNumber,

//               job_id:
//                 anchorJob.id,

//               job_ids:
//                 includedJobs.map(
//                   job => job.id
//                 ),

//               ticket_id:
//                 anchorJob.ticket_id,

//               complaint_id:
//                 invoiceComplaintId,

//               company_id:
//                 anchorJob.company_id,

//               technician_id:
//                 Number(
//                   technician.id
//                 ),

//               service_address:
//                 anchorJob.service_address,

//               jobs_snapshot:
//                 jobsSnapshot,

//               working_hours:
//                 Number(
//                   workingHours.toFixed(
//                     2
//                   )
//                 ),

//               service_price:
//                 Number(
//                   servicePriceValue.toFixed(
//                     2
//                   )
//                 ),

//               parts_total:
//                 Number(
//                   partsTotal.toFixed(
//                     2
//                   )
//                 ),

//               total_amount:
//                 Number(
//                   totalAmount.toFixed(
//                     2
//                   )
//                 ),

//               parts_snapshot:
//                 partsSnapshot,

//               status: "issued",

//               notes:
//                 invoiceNotes.trim() ||
//                 null,

//               created_by:
//                 Number(
//                   technician.id
//                 ),
//             }
//           );

//         const newInvoice =
//           getApiData(response);

//         if (!newInvoice) {
//           throw new Error(
//             "Invoice creation failed."
//           );
//         }

//         try {
//           const closeResponse =
//             await api.post<Job[]>(
//               ENDPOINTS.invoiceJobsClose,
//               {
//                 jobIds:
//                   includedJobs.map(
//                     job => job.id
//                   ),
//                 invoiceId:
//                   newInvoice.id,
//                 technicianId:
//                   Number(
//                     technician.id
//                   ),
//               }
//             );

//           const updatedJobs =
//             getApiData(
//               closeResponse
//             );

//           if (
//             Array.isArray(
//               updatedJobs
//             )
//           ) {
//             const updatedMap =
//               new Map(
//                 updatedJobs.map(
//                   job => [
//                     job.id,
//                     job,
//                   ]
//                 )
//               );

//             setJobs(current =>
//               current.map(job =>
//                 updatedMap.has(
//                   job.id
//                 )
//                   ? {
//                       ...job,
//                       ...updatedMap.get(
//                         job.id
//                       ),
//                     }
//                   : job
//               )
//             );
//           } else {
//             setJobs(current =>
//               current.map(job =>
//                 includedJobs.some(
//                   item =>
//                     item.id ===
//                     job.id
//                 )
//                   ? {
//                       ...job,
//                       status:
//                         "closed",
//                       invoice_id:
//                         newInvoice.id,
//                     }
//                   : job
//               )
//             );
//           }
//         } catch (closeError) {
//           Alert.alert(
//             "Partial success",
//             `Invoice ${invoiceNumber} was created, but the jobs could not be closed. ${getApiErrorMessage(
//               closeError,
//               ""
//             )}`
//           );
//         }

//         if (
//           invoiceComplaintId !==
//           null
//         ) {
//           try {
//             await api.post(
//               ENDPOINTS.complaintUpdate,
//               {
//                 id:
//                   invoiceComplaintId,
//                 status: "closed",
//                 closed_at:
//                   new Date()
//                     .toISOString()
//                     .slice(0, 10),
//               }
//             );
//           } catch (complaintError) {
//             Alert.alert(
//               "Partial success",
//               "Invoice was created and jobs were processed, but the complaint could not be closed."
//             );
//           }
//         }

//         setInvoices(current => [
//           newInvoice,
//           ...current,
//         ]);

//         Alert.alert(
//           "Invoice created",
//           `Invoice ${invoiceNumber} created covering ${includedJobs.length} job(s).`
//         );

//         closeInvoiceForm();
//       } catch (error) {
//         console.error(
//           "handleCreateInvoice:",
//           error
//         );

//         Alert.alert(
//           "Error",
//           getApiErrorMessage(
//             error,
//             "Unable to create invoice."
//           )
//         );
//       } finally {
//         setSavingInvoice(false);
//       }
//     };

//   const handleRefreshTasks = async () => {
//     if (!technician) {
//       return;
//     }

//     await fetchAssignedTasks(
//       technician.id,
//       technician.company_id
//     );

//     await fetchInvoices(
//       technician.company_id,
//       Number(technician.id)
//     );
//   };

//   const handleLogout = async () => {
//     if (loggingOut) {
//       return;
//     }

//     setLoggingOut(true);

//     try {
//       await AsyncStorage.multiRemove([
//         "user",
//         "access_token",
//         "login_email",
//       ]);

//       router.replace(
//         "/technician-login"
//       );
//     } catch (error) {
//       console.error(
//         "handleLogout:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         "Unable to logout."
//       );
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   useEffect(() => {
//     fetchTechnician();
//   }, []);

//   const Checkbox = ({
//     checked,
//   }: {
//     checked: boolean;
//   }) => (
//     <View
//       style={[
//         techniciandashboard.checkbox,
//         checked &&
//           techniciandashboard.checkboxChecked,
//       ]}
//     >
//       {checked && (
//         <Text
//           style={
//             techniciandashboard.checkboxMark
//           }
//         >
//           ✓
//         </Text>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View
//         style={
//           techniciandashboard.centerScreen
//         }
//       >
//         <ActivityIndicator
//           size="large"
//           color="#2563eb"
//         />

//         <Text
//           style={[
//             techniciandashboard.loadingTitle,
//             { marginTop: 14 },
//           ]}
//         >
//           Loading dashboard...
//         </Text>

//         <Text
//           style={
//             techniciandashboard.loadingSub
//           }
//         >
//           Please wait.
//         </Text>
//       </View>
//     );
//   }

//   if (!technician) {
//     return null;
//   }

//   const renderJobCard = (
//     job: Job
//   ) => {
//     const isUnassigned =
//       job.technician_id === null;

//     const isUpdating =
//       updatingStatus === job.id;

//     const isClosed =
//       job.status === "closed";

//     const isCompletedWithoutInvoice =
//       normalizeStatus(
//         job.status
//       ) === "completed" &&
//       !job.invoice_id;

//     return (
//       <TouchableOpacity
//         key={job.id}
//         activeOpacity={0.85}
//         style={[
//           techniciandashboard.jobCard,
//           isUnassigned &&
//             techniciandashboard.jobCardUnassigned,
//           isClosed &&
//             techniciandashboard.jobCardClosed,
//         ]}
//         onPress={() =>
//           openJobPopup(job)
//         }
//       >
//         {isClosed && (
//           <View
//             style={
//               techniciandashboard.badge
//             }
//           >
//             <Text
//               style={
//                 techniciandashboard.badgeClosedText
//               }
//             >
//               🔒 Closed & Invoiced
//             </Text>
//           </View>
//         )}

//         {isUnassigned && (
//           <View
//             style={[
//               techniciandashboard.badge,
//               techniciandashboard.badgeUnassigned,
//             ]}
//           >
//             <Text
//               style={
//                 techniciandashboard.badgeUnassignedText
//               }
//             >
//               Unassigned
//             </Text>
//           </View>
//         )}

//         {job.is_recurring && (
//           <View
//             style={[
//               techniciandashboard.badge,
//               techniciandashboard.badgeRecurring,
//             ]}
//           >
//             <Text
//               style={
//                 techniciandashboard.badgeRecurringText
//               }
//             >
//               ↻ Recurring
//             </Text>
//           </View>
//         )}

//         <Text
//           style={
//             techniciandashboard.jobNumber
//           }
//         >
//           {job.job_number ||
//             `JOB-${job.id}`}
//         </Text>

//         <Text
//           style={
//             techniciandashboard.jobTitle
//           }
//         >
//           {job.title ||
//             "Untitled Job"}
//         </Text>

//         <Text
//           style={
//             techniciandashboard.jobDesc
//           }
//           numberOfLines={3}
//         >
//           {job.description ||
//             "No description provided."}
//         </Text>

//         <View
//           style={
//             techniciandashboard.jobInfoRow
//           }
//         >
//           <Text
//             style={
//               techniciandashboard.jobInfoText
//             }
//           >
//             Job ID: {job.id}
//           </Text>

//           <Text
//             style={
//               techniciandashboard.jobInfoText
//             }
//           >
//             Ticket ID:{" "}
//             {job.ticket_id ?? "-"}
//           </Text>

//           <Text
//             style={
//               techniciandashboard.jobInfoText
//             }
//           >
//             Complaint ID:{" "}
//             {job.complaint_id ?? "-"}
//           </Text>

//           <Text
//             style={
//               techniciandashboard.jobInfoText
//             }
//           >
//             Job Type:{" "}
//             {job.job_type || "-"}
//           </Text>
//         </View>

//         <View
//           style={
//             techniciandashboard.jobFooterRow
//           }
//         >
//           <Text
//             style={
//               techniciandashboard.jobInfoText
//             }
//           >
//             Priority:{" "}
//             {job.priority || "Medium"}
//           </Text>

//           <Text
//             style={
//               techniciandashboard.priorityPill
//             }
//           >
//             {getStatusLabel(
//               job.status
//             )}
//           </Text>
//         </View>

//         <View
//           style={
//             techniciandashboard.scheduleRow
//           }
//         >
//           <View>
//             <Text
//               style={
//                 techniciandashboard.scheduleLabel
//               }
//             >
//               Scheduled
//             </Text>

//             <Text
//               style={
//                 techniciandashboard.scheduleValue
//               }
//             >
//               {formatDate(
//                 job.scheduled_date
//               )}
//             </Text>
//           </View>

//           <View>
//             <Text
//               style={
//                 techniciandashboard.scheduleLabel
//               }
//             >
//               Time
//             </Text>

//             <Text
//               style={
//                 techniciandashboard.scheduleValue
//               }
//             >
//               {formatTime(
//                 job.scheduled_start_time
//               )}{" "}
//               -{" "}
//               {formatTime(
//                 job.scheduled_end_time
//               )}
//             </Text>
//           </View>
//         </View>

//         {isUnassigned && (
//           <TouchableOpacity
//             style={[
//               techniciandashboard.actionBtn,
//               techniciandashboard.actionBtnTake,
//               isUpdating &&
//                 techniciandashboard.btnDisabled,
//             ]}
//             disabled={isUpdating}
//             onPress={() =>
//               handleTakeJob(
//                 job.id
//               )
//             }
//           >
//             <Text
//               style={
//                 techniciandashboard.actionBtnText
//               }
//             >
//               {isUpdating
//                 ? "Taking..."
//                 : "Take Job"}
//             </Text>
//           </TouchableOpacity>
//         )}

//         {isCompletedWithoutInvoice && (
//           <TouchableOpacity
//             style={[
//               techniciandashboard.actionBtn,
//               techniciandashboard.actionBtnInvoice,
//             ]}
//             onPress={() =>
//               openInvoiceForm(job)
//             }
//           >
//             <Text
//               style={
//                 techniciandashboard.actionBtnText
//               }
//             >
//               🧾 Create Invoice
//             </Text>
//           </TouchableOpacity>
//         )}

//         {!isUnassigned &&
//           !isClosed && (
//             <Text
//               style={
//                 techniciandashboard.openHint
//               }
//             >
//               Tap to view / update
//             </Text>
//           )}

//         {!isUnassigned &&
//           !isClosed && (
//             <View
//               style={[
//                 techniciandashboard.row,
//                 { marginTop: 10 },
//               ]}
//             >
//               {STATUS_TABS.filter(
//                 ([status]) =>
//                   status !== "closed"
//               ).map(
//                 ([status, label]) => (
//                   <TouchableOpacity
//                     key={status}
//                     style={[
//                       techniciandashboard.chip,
//                       normalizeStatus(
//                         job.status
//                       ) ===
//                         status &&
//                         techniciandashboard.chipActive,
//                     ]}
//                     onPress={() =>
//                       handleStatusChange(
//                         job.id,
//                         status
//                       )
//                     }
//                   >
//                     <Text
//                       style={[
//                         techniciandashboard.chipText,
//                         normalizeStatus(
//                           job.status
//                         ) ===
//                           status &&
//                           techniciandashboard.chipTextActive,
//                       ]}
//                     >
//                       {label}
//                     </Text>
//                   </TouchableOpacity>
//                 )
//               )}
//             </View>
//           )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView
//       style={
//         techniciandashboard.screen
//       }
//       edges={[
//         "top",
//         "left",
//         "right",
//       ]}
//     >
//       <ScrollView
//         contentContainerStyle={
//           techniciandashboard.scrollContent
//         }
//       >
//         <View
//           style={
//             techniciandashboard.header
//           }
//         >
//           <Text
//             style={
//               techniciandashboard.headerTitle
//             }
//           >
//             Technician Dashboard
//           </Text>

//           <Text
//             style={
//               techniciandashboard.headerSub
//             }
//           >
//             Welcome,{" "}
//             {technician.user_name}
//           </Text>
//         </View>

//         <View
//           style={
//             techniciandashboard.welcomeCard
//           }
//         >
//           <View>
//             <Text
//               style={
//                 techniciandashboard.welcomeLabel
//               }
//             >
//               Welcome
//             </Text>

//             <Text
//               style={
//                 techniciandashboard.welcomeName
//               }
//             >
//               {technician.user_name}
//             </Text>

//             <Text
//               style={
//                 techniciandashboard.welcomeSub
//               }
//             >
//               You are logged in as a
//               technician.
//             </Text>
//           </View>

//           <View
//             style={
//               techniciandashboard.roleBadge
//             }
//           >
//             <Text
//               style={
//                 techniciandashboard.roleBadgeText
//               }
//             >
//               {technician.role}
//             </Text>
//           </View>
//         </View>

//         <Text
//           style={
//             techniciandashboard.sectionTitle
//           }
//         >
//           Technician Information
//         </Text>

//         <View
//           style={
//             techniciandashboard.infoGrid
//           }
//         >
//           {[
//             ["User ID", technician.id],
//             [
//               "Name",
//               technician.user_name,
//             ],
//             [
//               "Email",
//               technician.email || "-",
//             ],
//             [
//               "Phone",
//               technician.user_phone,
//             ],
//             [
//               "Role",
//               technician.role,
//             ],
//             [
//               "Company ID",
//               technician.company_id ??
//                 "-",
//             ],
//           ].map(
//             ([label, value]) => (
//               <View
//                 key={String(label)}
//                 style={
//                   techniciandashboard.infoCard
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.infoLabel
//                   }
//                 >
//                   {label}
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.infoValue
//                   }
//                 >
//                   {String(value)}
//                 </Text>
//               </View>
//             )
//           )}
//         </View>

//         {company && (
//           <>
//             <Text
//               style={
//                 techniciandashboard.sectionTitle
//               }
//             >
//               Company
//             </Text>

//             <View
//               style={
//                 techniciandashboard.companyCard
//               }
//             >
//               <View
//                 style={
//                   techniciandashboard.companyBlock
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.companyLabel
//                   }
//                 >
//                   Company Name
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.companyValueLg
//                   }
//                 >
//                   {company.company_name ||
//                     "-"}
//                 </Text>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.companyBlock
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.companyLabel
//                   }
//                 >
//                   Company ID
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.companyValue
//                   }
//                 >
//                   {company.id}
//                 </Text>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.companyBlock
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.companyLabel
//                   }
//                 >
//                   Email
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.companyValue
//                   }
//                 >
//                   {company.company_email ||
//                     "-"}
//                 </Text>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.companyBlock
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.companyLabel
//                   }
//                 >
//                   Phone
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.companyValue
//                   }
//                 >
//                   {company.company_phone ||
//                     "-"}
//                 </Text>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.companyBlock
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.companyLabel
//                   }
//                 >
//                   Address
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.companyValue
//                   }
//                 >
//                   {company.address ||
//                     "-"}
//                 </Text>
//               </View>
//             </View>
//           </>
//         )}

//         <View
//           style={
//             techniciandashboard.tasksHeader
//           }
//         >
//           <View>
//             <Text
//               style={
//                 techniciandashboard.tasksHeaderTitle
//               }
//             >
//               My Jobs
//             </Text>

//             <Text
//               style={
//                 techniciandashboard.tasksHeaderSub
//               }
//             >
//               Unassigned jobs can be taken
//               by anyone. Closed jobs are
//               locked.
//             </Text>
//           </View>

//           <View
//             style={
//               techniciandashboard.countPill
//             }
//           >
//             <Text
//               style={
//                 techniciandashboard.countPillText
//               }
//             >
//               {jobs.length}{" "}
//               {jobs.length === 1
//                 ? "Job"
//                 : "Jobs"}
//             </Text>
//           </View>
//         </View>

//         <View
//           style={
//             techniciandashboard.tabsRow
//           }
//         >
//           {STATUS_TABS.map(
//             ([status, label]) => (
//               <TouchableOpacity
//                 key={status}
//                 style={[
//                   techniciandashboard.tabBtn,
//                   activeTab ===
//                     status &&
//                     techniciandashboard.tabBtnActive,
//                 ]}
//                 onPress={() =>
//                   setActiveTab(status)
//                 }
//               >
//                 <Text
//                   style={[
//                     techniciandashboard.tabBtnText,
//                     activeTab ===
//                       status &&
//                       techniciandashboard.tabBtnTextActive,
//                   ]}
//                 >
//                   {label} (
//                   {
//                     getJobsForStatus(
//                       status
//                     ).length
//                   }
//                   )
//                 </Text>
//               </TouchableOpacity>
//             )
//           )}
//         </View>

//         <TouchableOpacity
//           style={{
//             alignSelf: "flex-end",
//             marginBottom: 12,
//             paddingHorizontal: 14,
//             paddingVertical: 8,
//             borderRadius: 8,
//             backgroundColor:
//               "#eef2ff",
//           }}
//           onPress={
//             handleRefreshTasks
//           }
//         >
//           <Text
//             style={{
//               color: "#2563eb",
//               fontWeight: "700",
//             }}
//           >
//             Refresh
//           </Text>
//         </TouchableOpacity>

//         {tasksLoading && (
//           <View
//             style={{
//               paddingVertical: 30,
//               alignItems: "center",
//             }}
//           >
//             <ActivityIndicator
//               color="#2563eb"
//             />
//           </View>
//         )}

//         {!tasksLoading &&
//           getJobsForStatus(
//             activeTab
//           ).length === 0 && (
//             <View
//               style={
//                 techniciandashboard.emptyBox
//               }
//             >
//               <Text
//                 style={
//                   techniciandashboard.emptyText
//                 }
//               >
//                 {activeTab ===
//                 "closed"
//                   ? "No closed jobs yet"
//                   : "No jobs in this column"}
//               </Text>
//             </View>
//           )}

//         {!tasksLoading &&
//           getJobsForStatus(
//             activeTab
//           ).map(renderJobCard)}

//         <View
//           style={[
//             techniciandashboard.tasksHeader,
//             { marginTop: 24 },
//           ]}
//         >
//           <View>
//             <Text
//               style={
//                 techniciandashboard.tasksHeaderTitle
//               }
//             >
//               Invoices
//             </Text>

//             <Text
//               style={
//                 techniciandashboard.tasksHeaderSub
//               }
//             >
//               Invoices for completed and
//               closed jobs.
//             </Text>
//           </View>

//           <View
//             style={
//               techniciandashboard.countPill
//             }
//           >
//             <Text
//               style={
//                 techniciandashboard.countPillText
//               }
//             >
//               {invoices.length}{" "}
//               {invoices.length ===
//               1
//                 ? "Invoice"
//                 : "Invoices"}
//             </Text>
//           </View>
//         </View>

//         {invoicesLoading && (
//           <View
//             style={{
//               paddingVertical: 20,
//               alignItems: "center",
//             }}
//           >
//             <ActivityIndicator
//               color="#2563eb"
//             />
//           </View>
//         )}

//         {!invoicesLoading &&
//           invoices.length === 0 && (
//             <View
//               style={
//                 techniciandashboard.emptyBox
//               }
//             >
//               <Text
//                 style={
//                   techniciandashboard.emptyText
//                 }
//               >
//                 No invoices have been
//                 created yet.
//               </Text>
//             </View>
//           )}

//         {!invoicesLoading &&
//           invoices.map(invoice => (
//             <TouchableOpacity
//               key={invoice.id}
//               style={
//                 techniciandashboard.invoiceRow
//               }
//               onPress={() =>
//                 router.push(
//                   `/invoices/${encodeURIComponent(
//                     invoice.invoice_number
//                   )}`
//                 )
//               }
//             >
//               <Text
//                 style={
//                   techniciandashboard.invoiceNumber
//                 }
//               >
//                 {invoice.invoice_number}
//               </Text>

//               <Text
//                 style={
//                   techniciandashboard.invoiceMeta
//                 }
//               >
//                 Jobs:{" "}
//                 {invoice.jobs_snapshot &&
//                 invoice.jobs_snapshot
//                   .length > 0
//                   ? invoice.jobs_snapshot
//                       .map(
//                         job =>
//                           job.job_number ||
//                           `#${job.job_id}`
//                       )
//                       .join(", ")
//                   : invoice.job_ids?.join(
//                       ", "
//                     ) || "-"}
//               </Text>

//               <Text
//                 style={
//                   techniciandashboard.invoiceMeta
//                 }
//               >
//                 Complaint ID:{" "}
//                 {invoice.complaint_id ??
//                   "-"}
//               </Text>

//               <Text
//                 style={
//                   techniciandashboard.invoiceMeta
//                 }
//               >
//                 Service{" "}
//                 {formatCurrency(
//                   invoice.service_price
//                 )}{" "}
//                 + Parts{" "}
//                 {formatCurrency(
//                   invoice.parts_total
//                 )}
//               </Text>

//               <View
//                 style={
//                   techniciandashboard.invoiceStatusPill
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.invoiceStatusText
//                   }
//                 >
//                   {invoice.status}
//                 </Text>
//               </View>

//               <Text
//                 style={
//                   techniciandashboard.invoiceTotal
//                 }
//               >
//                 {formatCurrency(
//                   invoice.total_amount
//                 )}
//               </Text>
//             </TouchableOpacity>
//           ))}
//       </ScrollView>

//       <Modal
//         visible={!!invoicePromptJob}
//         transparent
//         animationType="slide"
//         onRequestClose={
//           closeInvoicePrompt
//         }
//       >
//         <View
//           style={
//             techniciandashboard.modalOverlay
//           }
//         >
//           <View
//             style={
//               techniciandashboard.modalCard
//             }
//           >
//             <View
//               style={
//                 techniciandashboard.modalHeader
//               }
//             >
//               <View>
//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderLabel
//                   }
//                 >
//                   Job Completed
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderTitle
//                   }
//                 >
//                   {invoicePromptJob?.job_number ||
//                     `JOB-${invoicePromptJob?.id}`}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={
//                   techniciandashboard.modalCloseBtn
//                 }
//                 onPress={
//                   closeInvoicePrompt
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.modalCloseText
//                   }
//                 >
//                   ×
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View
//               style={
//                 techniciandashboard.modalBody
//               }
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: "#4b5563",
//                   lineHeight: 20,
//                   marginBottom: 10,
//                 }}
//               >
//                 {
//                   invoicePromptJob?.title
//                 }{" "}
//                 has been marked
//                 completed. Is the job
//                 fully complete and ready
//                 to be invoiced?
//               </Text>

//               <Text
//                 style={{
//                   fontSize: 13,
//                   color: "#6b7280",
//                   lineHeight: 19,
//                 }}
//               >
//                 If this visit has other
//                 jobs still pending, skip
//                 for now and invoice later
//                 from the job card.
//               </Text>
//             </View>

//             <View
//               style={
//                 techniciandashboard.modalFooter
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   techniciandashboard.btnSecondary
//                 }
//                 onPress={
//                   handleSkipInvoice
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.btnSecondaryText
//                   }
//                 >
//                   Skip
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={
//                   techniciandashboard.btnGreen
//                 }
//                 onPress={
//                   handleStartInvoiceFromPrompt
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.btnGreenText
//                   }
//                 >
//                   Yes, Create Invoice
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={invoiceJobs.length > 0}
//         transparent
//         animationType="slide"
//         onRequestClose={
//           closeInvoiceForm
//         }
//       >
//         <View
//           style={
//             techniciandashboard.modalOverlay
//           }
//         >
//           <View
//             style={
//               techniciandashboard.modalCard
//             }
//           >
//             <View
//               style={
//                 techniciandashboard.modalHeader
//               }
//             >
//               <View>
//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderLabel
//                   }
//                 >
//                   Create Invoice
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderTitle
//                   }
//                 >
//                   Complaint #
//                   {invoiceComplaintId ??
//                     "-"}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={
//                   techniciandashboard.modalCloseBtn
//                 }
//                 onPress={
//                   closeInvoiceForm
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.modalCloseText
//                   }
//                 >
//                   ×
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               style={
//                 techniciandashboard.modalBody
//               }
//             >
//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Select Jobs
//                 </Text>

//                 <Text
//                   style={[
//                     techniciandashboard.sectionHeadSub,
//                     {
//                       marginBottom: 12,
//                     },
//                   ]}
//                 >
//                   Select completed jobs to
//                   include in this invoice.
//                 </Text>

//                 {invoiceJobs.map(
//                   job => {
//                     const checked =
//                       invoiceIncludedJobIds.includes(
//                         Number(job.id)
//                       );

//                     return (
//                       <TouchableOpacity
//                         key={job.id}
//                         style={[
//                           techniciandashboard.multiSelectItem,
//                           checked &&
//                             techniciandashboard.multiSelectItemSelected,
//                         ]}
//                         onPress={() =>
//                           toggleInvoiceJobInclusion(
//                             Number(
//                               job.id
//                             )
//                           )
//                         }
//                       >
//                         <Checkbox
//                           checked={
//                             checked
//                           }
//                         />

//                         <View
//                           style={{
//                             flex: 1,
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontWeight:
//                                 "700",
//                               color:
//                                 "#0f172a",
//                               marginBottom:
//                                 3,
//                             }}
//                           >
//                             {job.job_number ||
//                               `JOB-${job.id}`}{" "}
//                             —{" "}
//                             {job.title ||
//                               "Untitled Job"}
//                           </Text>

//                           <Text
//                             style={{
//                               fontSize:
//                                 12,
//                               color:
//                                 "#64748b",
//                             }}
//                           >
//                             Status:{" "}
//                             {
//                               job.status
//                             }{" "}
//                             • Worked{" "}
//                             {Number(
//                               job.working_hours ||
//                                 0
//                             ).toFixed(
//                               2
//                             )}{" "}
//                             hrs
//                           </Text>
//                         </View>
//                       </TouchableOpacity>
//                     );
//                   }
//                 )}

//                 <Text
//                   style={{
//                     marginTop: 10,
//                     fontWeight:
//                       "700",
//                     color:
//                       "#334155",
//                   }}
//                 >
//                   {
//                     invoiceIncludedJobIds.length
//                   }{" "}
//                   job
//                   {invoiceIncludedJobIds.length !==
//                   1
//                     ? "s"
//                     : ""}{" "}
//                   selected
//                 </Text>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Verify Details
//                 </Text>

//                 <View
//                   style={[
//                     techniciandashboard.infoGridSmall,
//                     { marginTop: 10 },
//                   ]}
//                 >
//                   <View
//                     style={
//                       techniciandashboard.infoBoxSmall
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.infoLabel
//                       }
//                     >
//                       Complaint ID
//                     </Text>

//                     <Text
//                       style={
//                         techniciandashboard.infoValue
//                       }
//                     >
//                       {invoiceComplaintId ??
//                         "-"}
//                     </Text>
//                   </View>

//                   <View
//                     style={
//                       techniciandashboard.infoBoxSmall
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.infoLabel
//                       }
//                     >
//                       Jobs Included
//                     </Text>

//                     <Text
//                       style={
//                         techniciandashboard.infoValue
//                       }
//                     >
//                       {
//                         getIncludedInvoiceJobs()
//                           .length
//                       }
//                     </Text>
//                   </View>

//                   <View
//                     style={
//                       techniciandashboard.infoBoxSmall
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.infoLabel
//                       }
//                     >
//                       Service Address
//                     </Text>

//                     <Text
//                       style={
//                         techniciandashboard.infoValue
//                       }
//                     >
//                       {
//                         invoiceJobs[0]
//                           ?.service_address ||
//                         "-"
//                       }
//                     </Text>
//                   </View>

//                   <View
//                     style={
//                       techniciandashboard.infoBoxSmall
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.infoLabel
//                       }
//                     >
//                       Combined Hours
//                     </Text>

//                     <Text
//                       style={
//                         techniciandashboard.infoValue
//                       }
//                     >
//                       {getIncludedWorkingHours().toFixed(
//                         2
//                       )}{" "}
//                       hrs
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Parts Used
//                 </Text>

//                 {loadingInvoiceParts ? (
//                   <ActivityIndicator
//                     style={{
//                       marginTop: 10,
//                     }}
//                     color="#2563eb"
//                   />
//                 ) : invoiceParts.length ===
//                   0 ? (
//                   <Text
//                     style={{
//                       marginTop: 10,
//                       color:
//                         "#6b7280",
//                     }}
//                   >
//                     No parts linked to
//                     this complaint.
//                   </Text>
//                 ) : (
//                   invoiceParts.map(
//                     line => (
//                       <View
//                         key={
//                           line.part_id
//                         }
//                         style={
//                           techniciandashboard.partCard
//                         }
//                       >
//                         <View
//                           style={{
//                             flex: 1,
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontWeight:
//                                 "700",
//                               color:
//                                 "#0f172a",
//                             }}
//                           >
//                             {
//                               line.part_name
//                             }
//                           </Text>

//                           <Text
//                             style={
//                               techniciandashboard.partMetaText
//                             }
//                           >
//                             Part No:{" "}
//                             {line.part_number ||
//                               "-"}
//                           </Text>

//                           <View
//                             style={[
//                               techniciandashboard.row,
//                               {
//                                 marginTop: 8,
//                               },
//                             ]}
//                           >
//                             <View
//                               style={{
//                                 flex: 1,
//                               }}
//                             >
//                               <Text
//                                 style={
//                                   techniciandashboard.fieldLabel
//                                 }
//                               >
//                                 Qty
//                               </Text>

//                               <TextInput
//                                 style={
//                                   techniciandashboard.input
//                                 }
//                                 keyboardType="numeric"
//                                 value={String(
//                                   line.quantity
//                                 )}
//                                 onChangeText={value =>
//                                   updateInvoicePartQuantity(
//                                     line.part_id,
//                                     value
//                                   )
//                                 }
//                               />
//                             </View>

//                             <View
//                               style={{
//                                 flex: 1,
//                               }}
//                             >
//                               <Text
//                                 style={
//                                   techniciandashboard.fieldLabel
//                                 }
//                               >
//                                 Unit Price
//                               </Text>

//                               <TextInput
//                                 style={
//                                   techniciandashboard.input
//                                 }
//                                 keyboardType="numeric"
//                                 value={String(
//                                   line.unit_price
//                                 )}
//                                 onChangeText={value =>
//                                   updateInvoicePartPrice(
//                                     line.part_id,
//                                     value
//                                   )
//                                 }
//                               />
//                             </View>
//                           </View>

//                           <Text
//                             style={{
//                               marginTop: 8,
//                               fontWeight:
//                                 "700",
//                               color:
//                                 "#0f172a",
//                             }}
//                           >
//                             Line Total:{" "}
//                             {formatCurrency(
//                               line.quantity *
//                                 line.unit_price
//                             )}
//                           </Text>
//                         </View>
//                       </View>
//                     )
//                   )
//                 )}
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Service Charge
//                 </Text>

//                 <View
//                   style={[
//                     techniciandashboard.fieldWrap,
//                     { marginTop: 12 },
//                   ]}
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.fieldLabel
//                     }
//                   >
//                     Service Price *
//                   </Text>

//                   <TextInput
//                     style={
//                       techniciandashboard.input
//                     }
//                     keyboardType="numeric"
//                     placeholder="0.00"
//                     value={
//                       invoiceServicePrice
//                     }
//                     onChangeText={
//                       setInvoiceServicePrice
//                     }
//                   />
//                 </View>

//                 <View
//                   style={
//                     techniciandashboard.fieldWrap
//                   }
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.fieldLabel
//                     }
//                   >
//                     Invoice Notes
//                   </Text>

//                   <TextInput
//                     style={
//                       techniciandashboard.textarea
//                     }
//                     multiline
//                     placeholder="Any notes to include on the invoice..."
//                     value={
//                       invoiceNotes
//                     }
//                     onChangeText={
//                       setInvoiceNotes
//                     }
//                   />
//                 </View>

//                 <View
//                   style={{
//                     borderTopWidth: 1,
//                     borderTopColor:
//                       "#e5e7eb",
//                     paddingTop: 12,
//                     gap: 8,
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection:
//                         "row",
//                       justifyContent:
//                         "space-between",
//                     }}
//                   >
//                     <Text>
//                       Parts Total
//                     </Text>

//                     <Text
//                       style={{
//                         fontWeight:
//                           "700",
//                       }}
//                     >
//                       {formatCurrency(
//                         getInvoicePartsTotal()
//                       )}
//                     </Text>
//                   </View>

//                   <View
//                     style={{
//                       flexDirection:
//                         "row",
//                       justifyContent:
//                         "space-between",
//                     }}
//                   >
//                     <Text>
//                       Service Price
//                     </Text>

//                     <Text
//                       style={{
//                         fontWeight:
//                           "700",
//                       }}
//                     >
//                       {formatCurrency(
//                         Number(
//                           invoiceServicePrice
//                         ) || 0
//                       )}
//                     </Text>
//                   </View>

//                   <View
//                     style={{
//                       flexDirection:
//                         "row",
//                       justifyContent:
//                         "space-between",
//                       borderTopWidth: 1,
//                       borderTopColor:
//                         "#d1d5db",
//                       borderStyle:
//                         "dashed",
//                       paddingTop: 8,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 16,
//                         fontWeight:
//                           "800",
//                       }}
//                     >
//                       Grand Total
//                     </Text>

//                     <Text
//                       style={{
//                         fontSize: 16,
//                         fontWeight:
//                           "800",
//                       }}
//                     >
//                       {formatCurrency(
//                         getInvoiceGrandTotal()
//                       )}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>

//             <View
//               style={
//                 techniciandashboard.modalFooter
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   techniciandashboard.btnSecondary
//                 }
//                 onPress={
//                   closeInvoiceForm
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.btnSecondaryText
//                   }
//                 >
//                   Cancel
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   techniciandashboard.btnPrimary,
//                   savingInvoice &&
//                     techniciandashboard.btnDisabled,
//                 ]}
//                 disabled={savingInvoice}
//                 onPress={
//                   handleCreateInvoice
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.btnPrimaryText
//                   }
//                 >
//                   {savingInvoice
//                     ? "Creating..."
//                     : "Create Invoice & Close Job"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={!!selectedJob}
//         transparent
//         animationType="slide"
//         onRequestClose={
//           closeJobPopup
//         }
//       >
//         <View
//           style={
//             techniciandashboard.modalOverlay
//           }
//         >
//           <View
//             style={
//               techniciandashboard.modalCard
//             }
//           >
//             <View
//               style={
//                 techniciandashboard.modalHeader
//               }
//             >
//               <View>
//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderLabel
//                   }
//                 >
//                   Job Details
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderTitle
//                   }
//                 >
//                   {selectedJob?.job_number ||
//                     `JOB-${selectedJob?.id}`}
//                 </Text>

//                 <Text
//                   style={
//                     techniciandashboard.modalHeaderSub
//                   }
//                 >
//                   {selectedJob?.title}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={
//                   techniciandashboard.modalCloseBtn
//                 }
//                 onPress={
//                   closeJobPopup
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.modalCloseText
//                   }
//                 >
//                   ×
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               style={
//                 techniciandashboard.modalBody
//               }
//             >
//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Job Information
//                 </Text>

//                 <View
//                   style={[
//                     techniciandashboard.infoGridSmall,
//                     { marginTop: 12 },
//                   ]}
//                 >
//                   {[
//                     [
//                       "Job ID",
//                       selectedJob?.id,
//                     ],
//                     [
//                       "Ticket ID",
//                       selectedJob?.ticket_id,
//                     ],
//                     [
//                       "Complaint ID",
//                       selectedJob?.complaint_id ??
//                         "-",
//                     ],
//                     [
//                       "Job Type",
//                       selectedJob?.job_type ||
//                         "-",
//                     ],
//                     [
//                       "Priority",
//                       selectedJob?.priority ||
//                         "Medium",
//                     ],
//                     [
//                       "Status",
//                       selectedJob
//                         ? getStatusLabel(
//                             selectedJob.status
//                           )
//                         : "-",
//                     ],
//                   ].map(
//                     ([label, value]) => (
//                       <View
//                         key={String(
//                           label
//                         )}
//                         style={
//                           techniciandashboard.infoBoxSmall
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.infoLabel
//                           }
//                         >
//                           {label}
//                         </Text>

//                         <Text
//                           style={
//                             techniciandashboard.infoValue
//                           }
//                         >
//                           {String(
//                             value
//                           )}
//                         </Text>
//                       </View>
//                     )
//                   )}
//                 </View>

//                 <Text
//                   style={
//                     techniciandashboard.fieldLabel
//                   }
//                 >
//                   Description
//                 </Text>

//                 <Text
//                   style={{
//                     color:
//                       "#334155",
//                     fontSize: 13,
//                     marginBottom: 10,
//                   }}
//                 >
//                   {selectedJob?.description ||
//                     "No description"}
//                 </Text>

//                 {selectedJob?.service_address ? (
//                   <>
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       Service Address
//                     </Text>

//                     <Text
//                       style={{
//                         color:
//                           "#334155",
//                         fontSize: 13,
//                       }}
//                     >
//                       {
//                         selectedJob.service_address
//                       }
//                     </Text>
//                   </>
//                 ) : null}
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Service Schedule
//                 </Text>

//                 <View
//                   style={[
//                     techniciandashboard.row,
//                     {
//                       alignItems:
//                         "center",
//                       marginVertical: 12,
//                     },
//                   ]}
//                 >
//                   <Switch
//                     value={
//                       isRecurring
//                     }
//                     onValueChange={
//                       setIsRecurring
//                     }
//                     disabled={
//                       savingSchedule
//                     }
//                   />

//                   <Text
//                     style={{
//                       marginLeft: 10,
//                       fontWeight:
//                         "700",
//                       color:
//                         "#0f172a",
//                     }}
//                   >
//                     Recurring Service
//                   </Text>
//                 </View>

//                 <View
//                   style={
//                     techniciandashboard.fieldWrap
//                   }
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.fieldLabel
//                     }
//                   >
//                     Start Date
//                     (YYYY-MM-DD) *
//                   </Text>

//                   <TextInput
//                     style={
//                       techniciandashboard.input
//                     }
//                     placeholder="2026-09-10"
//                     value={
//                       scheduleStartDate
//                     }
//                     onChangeText={
//                       setScheduleStartDate
//                     }
//                   />
//                 </View>

//                 {isRecurring && (
//                   <View
//                     style={
//                       techniciandashboard.fieldWrap
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       End Date
//                       (YYYY-MM-DD)
//                     </Text>

//                     <TextInput
//                       style={
//                         techniciandashboard.input
//                       }
//                       placeholder="Optional"
//                       value={
//                         scheduleEndDate
//                       }
//                       onChangeText={
//                         setScheduleEndDate
//                       }
//                     />
//                   </View>
//                 )}

//                 <View
//                   style={
//                     techniciandashboard.row
//                   }
//                 >
//                   <View
//                     style={
//                       techniciandashboard.flexHalf
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       Start Time
//                       (HH:MM)
//                     </Text>

//                     <TextInput
//                       style={
//                         techniciandashboard.input
//                       }
//                       placeholder="09:00"
//                       value={
//                         scheduleStartTime
//                       }
//                       onChangeText={
//                         setScheduleStartTime
//                       }
//                     />
//                   </View>

//                   <View
//                     style={
//                       techniciandashboard.flexHalf
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       End Time
//                       (HH:MM)
//                     </Text>

//                     <TextInput
//                       style={
//                         techniciandashboard.input
//                       }
//                       placeholder="11:00"
//                       value={
//                         scheduleEndTime
//                       }
//                       onChangeText={
//                         setScheduleEndTime
//                       }
//                     />
//                   </View>
//                 </View>

//                 {isRecurring && (
//                   <>
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       Frequency
//                     </Text>

//                     <View
//                       style={
//                         techniciandashboard.chipRow
//                       }
//                     >
//                       {(
//                         [
//                           "daily",
//                           "weekly",
//                           "monthly",
//                           "yearly",
//                         ] as ScheduleFrequency[]
//                       ).map(
//                         frequency => (
//                           <TouchableOpacity
//                             key={
//                               frequency
//                             }
//                             style={[
//                               techniciandashboard.chip,
//                               scheduleFrequency ===
//                                 frequency &&
//                                 techniciandashboard.chipActive,
//                             ]}
//                             onPress={() =>
//                               setScheduleFrequency(
//                                 frequency
//                               )
//                             }
//                           >
//                             <Text
//                               style={[
//                                 techniciandashboard.chipText,
//                                 scheduleFrequency ===
//                                   frequency &&
//                                   techniciandashboard.chipTextActive,
//                               ]}
//                             >
//                               {
//                                 frequency
//                               }
//                             </Text>
//                           </TouchableOpacity>
//                         )
//                       )}
//                     </View>

//                     <View
//                       style={[
//                         techniciandashboard.fieldWrap,
//                         {
//                           marginTop: 12,
//                         },
//                       ]}
//                     >
//                       <Text
//                         style={
//                           techniciandashboard.fieldLabel
//                         }
//                       >
//                         Repeat Every
//                       </Text>

//                       <TextInput
//                         style={
//                           techniciandashboard.input
//                         }
//                         keyboardType="numeric"
//                         value={
//                           repeatEvery
//                         }
//                         onChangeText={
//                           setRepeatEvery
//                         }
//                       />
//                     </View>
//                   </>
//                 )}

//                 <TouchableOpacity
//                   style={[
//                     techniciandashboard.btnPrimary,
//                     savingSchedule &&
//                       techniciandashboard.btnDisabled,
//                     { marginTop: 6 },
//                   ]}
//                   disabled={
//                     savingSchedule
//                   }
//                   onPress={
//                     handleSaveSchedule
//                   }
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.btnPrimaryText
//                     }
//                   >
//                     {savingSchedule
//                       ? "Saving..."
//                       : isRecurring
//                       ? "Save Recurring Schedule"
//                       : "Save Schedule"}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Working Time
//                 </Text>

//                 {selectedJob?.working_hours ? (
//                   <Text
//                     style={{
//                       color:
//                         "#2563eb",
//                       fontWeight:
//                         "700",
//                       marginTop: 6,
//                     }}
//                   >
//                     Total:{" "}
//                     {Number(
//                       selectedJob.working_hours
//                     ).toFixed(
//                       2
//                     )}{" "}
//                     hours
//                   </Text>
//                 ) : null}

//                 <View
//                   style={[
//                     techniciandashboard.row,
//                     {
//                       marginTop: 10,
//                     },
//                   ]}
//                 >
//                   <View
//                     style={
//                       techniciandashboard.flexHalf
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       Start (YYYY-MM-DD
//                       HH:MM)
//                     </Text>

//                     <TextInput
//                       style={
//                         techniciandashboard.input
//                       }
//                       value={
//                         jobStartTime
//                       }
//                       onChangeText={
//                         setJobStartTime
//                       }
//                     />
//                   </View>

//                   <View
//                     style={
//                       techniciandashboard.flexHalf
//                     }
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.fieldLabel
//                       }
//                     >
//                       End (YYYY-MM-DD
//                       HH:MM)
//                     </Text>

//                     <TextInput
//                       style={
//                         techniciandashboard.input
//                       }
//                       value={
//                         jobEndTime
//                       }
//                       onChangeText={
//                         setJobEndTime
//                       }
//                     />
//                   </View>
//                 </View>
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Complaint Assets
//                 </Text>

//                 {assetsLoading ? (
//                   <ActivityIndicator
//                     style={{
//                       marginTop: 10,
//                     }}
//                     color="#2563eb"
//                   />
//                 ) : assets.length ===
//                   0 ? (
//                   <Text
//                     style={{
//                       marginTop: 10,
//                       color:
//                         "#6b7280",
//                     }}
//                   >
//                     No assets found
//                     for this company.
//                   </Text>
//                 ) : (
//                   <View
//                     style={{
//                       marginTop: 10,
//                       gap: 8,
//                     }}
//                   >
//                     {assets.map(
//                       asset => {
//                         const checked =
//                           selectedAssets.some(
//                             item =>
//                               item.id ===
//                               asset.id
//                           );

//                         return (
//                           <TouchableOpacity
//                             key={
//                               asset.id
//                             }
//                             style={[
//                               techniciandashboard.multiSelectItem,
//                               checked &&
//                                 techniciandashboard.multiSelectItemSelected,
//                             ]}
//                             onPress={() =>
//                               handleAssetToggle(
//                                 asset.id
//                               )
//                             }
//                           >
//                             <Checkbox
//                               checked={
//                                 checked
//                               }
//                             />

//                             <View
//                               style={{
//                                 flex: 1,
//                               }}
//                             >
//                               <Text
//                                 style={{
//                                   fontWeight:
//                                     "700",
//                                   color:
//                                     "#0f172a",
//                                 }}
//                               >
//                                 {
//                                   asset.title
//                                 }
//                               </Text>

//                               <Text
//                                 style={
//                                   techniciandashboard.partMetaText
//                                 }
//                               >
//                                 {asset.serial_number
//                                   ? `Serial: ${asset.serial_number}`
//                                   : "No serial number"}
//                                 {asset.model_number
//                                   ? ` • Model: ${asset.model_number}`
//                                   : ""}
//                               </Text>
//                             </View>
//                           </TouchableOpacity>
//                         );
//                       }
//                     )}
//                   </View>
//                 )}

//                 {selectedAssets.length >
//                   0 && (
//                   <View
//                     style={
//                       techniciandashboard.chipList
//                     }
//                   >
//                     {selectedAssets.map(
//                       asset => (
//                         <View
//                           key={
//                             asset.id
//                           }
//                           style={
//                             techniciandashboard.itemChip
//                           }
//                         >
//                           <Text
//                             style={
//                               techniciandashboard.itemChipText
//                             }
//                           >
//                             {
//                               asset.title
//                             }
//                           </Text>

//                           <TouchableOpacity
//                             onPress={() =>
//                               handleAssetToggle(
//                                 asset.id
//                               )
//                             }
//                           >
//                             <Text
//                               style={
//                                 techniciandashboard.itemChipText
//                               }
//                             >
//                               ×
//                             </Text>
//                           </TouchableOpacity>
//                         </View>
//                       )
//                     )}
//                   </View>
//                 )}

//                 {selectedAssetForEdit && (
//                   <TouchableOpacity
//                     style={[
//                       techniciandashboard.btnSecondary,
//                       {
//                         marginTop: 12,
//                       },
//                     ]}
//                     onPress={() => {
//                       setAssetForm(
//                         assetToForm(
//                           selectedAssetForEdit
//                         )
//                       );

//                       setShowAssetForm(
//                         value =>
//                           !value
//                       );
//                     }}
//                   >
//                     <Text
//                       style={
//                         techniciandashboard.btnSecondaryText
//                       }
//                     >
//                       {showAssetForm
//                         ? "Cancel Edit"
//                         : "Edit Asset"}
//                     </Text>
//                   </TouchableOpacity>
//                 )}

//                 {selectedAssetForEdit &&
//                   showAssetForm && (
//                     <View
//                       style={{
//                         marginTop: 14,
//                       }}
//                     >
//                       <View
//                         style={
//                           techniciandashboard.fieldWrap
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.fieldLabel
//                           }
//                         >
//                           Title
//                         </Text>

//                         <TextInput
//                           style={
//                             techniciandashboard.input
//                           }
//                           value={
//                             assetForm.title
//                           }
//                           onChangeText={value =>
//                             setAssetForm(
//                               current => ({
//                                 ...current,
//                                 title:
//                                   value,
//                               })
//                             )
//                           }
//                         />
//                       </View>

//                       <View
//                         style={
//                           techniciandashboard.fieldWrap
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.fieldLabel
//                           }
//                         >
//                           Serial Number
//                         </Text>

//                         <TextInput
//                           style={
//                             techniciandashboard.input
//                           }
//                           value={
//                             assetForm.serial_number
//                           }
//                           onChangeText={value =>
//                             setAssetForm(
//                               current => ({
//                                 ...current,
//                                 serial_number:
//                                   value,
//                               })
//                             )
//                           }
//                         />
//                       </View>

//                       <View
//                         style={
//                           techniciandashboard.fieldWrap
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.fieldLabel
//                           }
//                         >
//                           Manufacturer
//                         </Text>

//                         <TextInput
//                           style={
//                             techniciandashboard.input
//                           }
//                           value={
//                             assetForm.manufacturer
//                           }
//                           onChangeText={value =>
//                             setAssetForm(
//                               current => ({
//                                 ...current,
//                                 manufacturer:
//                                   value,
//                               })
//                             )
//                           }
//                         />
//                       </View>

//                       <View
//                         style={
//                           techniciandashboard.fieldWrap
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.fieldLabel
//                           }
//                         >
//                           Notes
//                         </Text>

//                         <TextInput
//                           style={
//                             techniciandashboard.textarea
//                           }
//                           multiline
//                           value={
//                             assetForm.notes
//                           }
//                           onChangeText={value =>
//                             setAssetForm(
//                               current => ({
//                                 ...current,
//                                 notes:
//                                   value,
//                               })
//                             )
//                           }
//                         />
//                       </View>

//                       <TouchableOpacity
//                         style={[
//                           techniciandashboard.btnPrimary,
//                           savingAsset &&
//                             techniciandashboard.btnDisabled,
//                         ]}
//                         disabled={
//                           savingAsset
//                         }
//                         onPress={
//                           handleSaveAsset
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.btnPrimaryText
//                           }
//                         >
//                           {savingAsset
//                             ? "Saving..."
//                             : "Save Asset"}
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   )}
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <View
//                   style={{
//                     flexDirection:
//                       "row",
//                     justifyContent:
//                       "space-between",
//                     alignItems:
//                       "center",
//                   }}
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.sectionHeadTitle
//                     }
//                   >
//                     Complaint Parts
//                   </Text>

//                   {selectedAssetForEdit && (
//                     <TouchableOpacity
//                       onPress={() => {
//                         setEditingPartId(
//                           null
//                         );
//                         setPartForm(
//                           emptyPartForm
//                         );
//                         setShowPartForm(
//                           true
//                         );
//                       }}
//                     >
//                       <Text
//                         style={{
//                           color:
//                             "#2563eb",
//                           fontWeight:
//                             "700",
//                         }}
//                       >
//                         + Add Part
//                       </Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>

//                 {!selectedAssets.length ? (
//                   <Text
//                     style={{
//                       marginTop: 10,
//                       color:
//                         "#6b7280",
//                     }}
//                   >
//                     Select an asset first —
//                     parts are loaded from
//                     selected assets.
//                   </Text>
//                 ) : partsLoading ? (
//                   <ActivityIndicator
//                     style={{
//                       marginTop: 10,
//                     }}
//                     color="#2563eb"
//                   />
//                 ) : parts.length ===
//                   0 ? (
//                   <Text
//                     style={{
//                       marginTop: 10,
//                       color:
//                         "#6b7280",
//                     }}
//                   >
//                     No parts found for
//                     the selected assets.
//                   </Text>
//                 ) : (
//                   <View
//                     style={{
//                       marginTop: 10,
//                       gap: 8,
//                     }}
//                   >
//                     {parts.map(
//                       part => {
//                         const checked =
//                           selectedParts.some(
//                             item =>
//                               item.id ===
//                               part.id
//                           );

//                         const asset =
//                           assets.find(
//                             item =>
//                               item.id ===
//                               part.asset_id
//                           );

//                         return (
//                           <TouchableOpacity
//                             key={
//                               part.id
//                             }
//                             style={[
//                               techniciandashboard.multiSelectItem,
//                               checked &&
//                                 techniciandashboard.multiSelectItemSelected,
//                             ]}
//                             onPress={() =>
//                               handlePartToggle(
//                                 part
//                               )
//                             }
//                           >
//                             <Checkbox
//                               checked={
//                                 checked
//                               }
//                             />

//                             <View
//                               style={{
//                                 flex: 1,
//                               }}
//                             >
//                               <Text
//                                 style={{
//                                   fontWeight:
//                                     "700",
//                                   color:
//                                     "#0f172a",
//                                 }}
//                               >
//                                 {
//                                   part.part_name
//                                 }
//                               </Text>

//                               <Text
//                                 style={
//                                   techniciandashboard.partMetaText
//                                 }
//                               >
//                                 Part No:{" "}
//                                 {part.part_number ||
//                                   "-"}{" "}
//                                 • Asset:{" "}
//                                 {asset?.title ||
//                                   "-"}
//                               </Text>
//                             </View>
//                           </TouchableOpacity>
//                         );
//                       }
//                     )}
//                   </View>
//                 )}

//                 {showPartForm && (
//                   <View
//                     style={{
//                       marginTop: 14,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontWeight:
//                           "800",
//                         marginBottom: 10,
//                       }}
//                     >
//                       {editingPartId
//                         ? "Edit Part"
//                         : "Add Part"}
//                     </Text>

//                     <View
//                       style={
//                         techniciandashboard.fieldWrap
//                       }
//                     >
//                       <Text
//                         style={
//                           techniciandashboard.fieldLabel
//                         }
//                       >
//                         Part Name *
//                       </Text>

//                       <TextInput
//                         style={
//                           techniciandashboard.input
//                         }
//                         value={
//                           partForm.part_name
//                         }
//                         onChangeText={value =>
//                           setPartForm(
//                             current => ({
//                               ...current,
//                               part_name:
//                                 value,
//                             })
//                           )
//                         }
//                       />
//                     </View>

//                     <View
//                       style={
//                         techniciandashboard.row
//                       }
//                     >
//                       <View
//                         style={
//                           techniciandashboard.flexHalf
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.fieldLabel
//                           }
//                         >
//                           Price
//                         </Text>

//                         <TextInput
//                           style={
//                             techniciandashboard.input
//                           }
//                           keyboardType="numeric"
//                           value={
//                             partForm.price
//                           }
//                           onChangeText={value =>
//                             setPartForm(
//                               current => ({
//                                 ...current,
//                                 price:
//                                   value,
//                               })
//                             )
//                           }
//                         />
//                       </View>

//                       <View
//                         style={
//                           techniciandashboard.flexHalf
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.fieldLabel
//                           }
//                         >
//                           Quantity
//                         </Text>

//                         <TextInput
//                           style={
//                             techniciandashboard.input
//                           }
//                           keyboardType="numeric"
//                           value={
//                             partForm.quantity
//                           }
//                           onChangeText={value =>
//                             setPartForm(
//                               current => ({
//                                 ...current,
//                                 quantity:
//                                   value,
//                               })
//                             )
//                           }
//                         />
//                       </View>
//                     </View>

//                     <View
//                       style={[
//                         techniciandashboard.row,
//                         {
//                           marginTop: 10,
//                         },
//                       ]}
//                     >
//                       <TouchableOpacity
//                         style={
//                           techniciandashboard.btnSecondary
//                         }
//                         onPress={() => {
//                           setShowPartForm(
//                             false
//                           );
//                           setEditingPartId(
//                             null
//                           );
//                           setPartForm(
//                             emptyPartForm
//                           );
//                         }}
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.btnSecondaryText
//                           }
//                         >
//                           Cancel
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={[
//                           techniciandashboard.btnPrimary,
//                           savingPart &&
//                             techniciandashboard.btnDisabled,
//                         ]}
//                         disabled={
//                           savingPart
//                         }
//                         onPress={
//                           handleSavePart
//                         }
//                       >
//                         <Text
//                           style={
//                             techniciandashboard.btnPrimaryText
//                           }
//                         >
//                           {savingPart
//                             ? "Saving..."
//                             : editingPartId
//                             ? "Update Part"
//                             : "Add Part"}
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}

//                 {parts.length > 0 && (
//                   <View
//                     style={{
//                       marginTop: 14,
//                       gap: 10,
//                     }}
//                   >
//                     {parts.map(
//                       part => (
//                         <View
//                           key={
//                             part.id
//                           }
//                           style={
//                             techniciandashboard.partCard
//                           }
//                         >
//                           <View
//                             style={{
//                               flex: 1,
//                             }}
//                           >
//                             <Text
//                               style={{
//                                 fontWeight:
//                                   "700",
//                                 color:
//                                   "#0f172a",
//                               }}
//                             >
//                               {
//                                 part.part_name
//                               }
//                             </Text>

//                             <Text
//                               style={
//                                 techniciandashboard.partMetaText
//                               }
//                             >
//                               Qty{" "}
//                               {part.quantity ??
//                                 0}{" "}
//                               •{" "}
//                               {formatCurrency(
//                                 part.price
//                               )}
//                             </Text>

//                             <View
//                               style={[
//                                 techniciandashboard.row,
//                                 {
//                                   marginTop: 8,
//                                 },
//                               ]}
//                             >
//                               <TouchableOpacity
//                                 style={
//                                   techniciandashboard.btnSecondary
//                                 }
//                                 onPress={() =>
//                                   handleEditPart(
//                                     part
//                                   )
//                                 }
//                               >
//                                 <Text
//                                   style={
//                                     techniciandashboard.btnSecondaryText
//                                   }
//                                 >
//                                   Edit
//                                 </Text>
//                               </TouchableOpacity>

//                               <TouchableOpacity
//                                 style={[
//                                   techniciandashboard.btnSecondary,
//                                   {
//                                     borderColor:
//                                       "#fecaca",
//                                     backgroundColor:
//                                       "#fff1f2",
//                                   },
//                                 ]}
//                                 disabled={
//                                   deletingPartId ===
//                                   part.id
//                                 }
//                                 onPress={() =>
//                                   handleDeletePart(
//                                     part
//                                   )
//                                 }
//                               >
//                                 <Text
//                                   style={{
//                                     color:
//                                       "#dc2626",
//                                     fontWeight:
//                                       "700",
//                                     fontSize: 13,
//                                   }}
//                                 >
//                                   {deletingPartId ===
//                                   part.id
//                                     ? "Removing..."
//                                     : "Remove"}
//                                 </Text>
//                               </TouchableOpacity>
//                             </View>
//                           </View>
//                         </View>
//                       )
//                     )}
//                   </View>
//                 )}
//               </View>

//               <View
//                 style={
//                   techniciandashboard.section
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.sectionHeadTitle
//                   }
//                 >
//                   Technician Work Notes
//                 </Text>

//                 <View
//                   style={[
//                     techniciandashboard.fieldWrap,
//                     { marginTop: 12 },
//                   ]}
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.fieldLabel
//                     }
//                   >
//                     Work Description
//                   </Text>

//                   <TextInput
//                     style={
//                       techniciandashboard.textarea
//                     }
//                     multiline
//                     placeholder="Describe the work performed..."
//                     value={
//                       workDescription
//                     }
//                     onChangeText={
//                       setWorkDescription
//                     }
//                   />
//                 </View>

//                 <View
//                   style={
//                     techniciandashboard.fieldWrap
//                   }
//                 >
//                   <Text
//                     style={
//                       techniciandashboard.fieldLabel
//                     }
//                   >
//                     Technician Remarks
//                   </Text>

//                   <TextInput
//                     style={
//                       techniciandashboard.textarea
//                     }
//                     multiline
//                     placeholder="Add technician remarks..."
//                     value={
//                       technicianRemarks
//                     }
//                     onChangeText={
//                       setTechnicianRemarks
//                     }
//                   />
//                 </View>
//               </View>
//             </ScrollView>

//             <View
//               style={
//                 techniciandashboard.modalFooter
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   techniciandashboard.btnSecondary
//                 }
//                 onPress={
//                   closeJobPopup
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.btnSecondaryText
//                   }
//                 >
//                   Close
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   techniciandashboard.btnPrimary,
//                   savingJob &&
//                     techniciandashboard.btnDisabled,
//                 ]}
//                 disabled={savingJob}
//                 onPress={
//                   handleSaveJob
//                 }
//               >
//                 <Text
//                   style={
//                     techniciandashboard.btnPrimaryText
//                   }
//                 >
//                   {savingJob
//                     ? "Saving..."
//                     : "Save Job Changes"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }