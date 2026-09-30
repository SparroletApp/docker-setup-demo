import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { jobsStyles } from "./Jobs.styles";

import {
    Job as ApiJob,
    getJobsByUserId,
} from "@/lib/jobservice";

import {
    getAllTickets,
    Ticket,
} from "@/lib/ticketservice";

type Job = ApiJob & {
    customerId: number | null;

    /*
     * Invoice ID returned from the backend.
     *
     * This is used to decide whether the
     * "Create Invoice" button should appear.
     */
    invoiceId?: number | null;
};

type JobsProps = {
    goToHome: () => void;

    goToJobView: (
        jobId: string | number
    ) => void;

    /*
     * Open the Create Invoice screen.
     *
     * Example from parent:
     *
     * goToCreateInvoice(jobId)
     */
    goToCreateInvoice?: (
        jobId: string | number
    ) => void;

    goToInvoiceDownload?: (
        invoiceId: number,
        jobId: string | number
    ) => void;
};

const filters = [
    "All",
    "Pending",
    "Assigned",
    "Accepted",
    "In Progress",
    "Completed",
    "Closed",
];

function Jobs({
    goToHome,
    goToJobView,
    goToCreateInvoice,
    goToInvoiceDownload,
}: JobsProps) {
    const [jobs, setJobs] = useState<Job[]>([]);

    const [filteredJobs, setFilteredJobs] =
        useState<Job[]>([]);

    const [search, setSearch] =
        useState("");

    const [selectedFilter, setSelectedFilter] =
        useState("All");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [creatingInvoiceForJob, setCreatingInvoiceForJob] =
        useState<number | null>(null);

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [
        jobs,
        search,
        selectedFilter,
    ]);

    /*
     * LOAD JOBS
     */
    const loadJobs = async () => {
        try {
            setLoading(true);

            const technicianId =
                await AsyncStorage.getItem(
                    "technician_id"
                );

            if (!technicianId) {
                console.log(
                    "Technician/User ID not found"
                );

                setJobs([]);

                return;
            }

            const userId =
                Number(technicianId);

            if (Number.isNaN(userId)) {
                console.log(
                    "Invalid Technician/User ID:",
                    technicianId
                );

                setJobs([]);

                return;
            }

            console.log(
                "Logged-in Technician/User ID:",
                userId
            );

            const [
                technicianJobs,
                allTickets,
            ] = await Promise.all([
                getJobsByUserId({
                    userId,
                }),

                getAllTickets(),
            ]);

            console.log(
                "Technician Jobs:",
                technicianJobs
            );

            console.log(
                "All Tickets:",
                allTickets
            );

            const ticketMap =
                new Map<number, Ticket>();

            allTickets.forEach(
                (ticket) => {
                    ticketMap.set(
                        ticket.id,
                        ticket
                    );
                }
            );

            const jobsWithCustomer:
                Job[] =
                technicianJobs.map(
                    (job) => {
                        const ticket =
                            ticketMap.get(
                                job.ticketId
                            );

                        return {
                            ...job,

                            customerId:
                                ticket?.customerId ??
                                null,
                        } as Job;
                    }
                );

            setJobs(
                jobsWithCustomer
            );
        } catch (error) {
            console.log(
                "Jobs loading error:",
                error
            );

            setJobs([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /*
     * FILTER JOBS
     */
    const filterJobs = () => {
        let result = [...jobs];

        if (
            selectedFilter !==
            "All"
        ) {
            result =
                result.filter(
                    (job) =>
                        formatStatus(
                            job.status
                        ) ===
                        selectedFilter
                );
        }

        if (search.trim()) {
            const query =
                search
                    .toLowerCase()
                    .trim();

            result =
                result.filter(
                    (job) => {
                        const jobNumber =
                            getJobNumber(
                                job
                            );

                        const title =
                            job.jobTitle ||
                            "";

                        const description =
                            job.jobDescription ||
                            "";

                        const customer =
                            job.customerId
                                ? `customer #${job.customerId}`
                                : "";

                        const priority =
                            job.priority ||
                            "";

                        const status =
                            formatStatus(
                                job.status
                            );

                        return (
                            jobNumber
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||

                            title
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||

                            description
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||

                            customer
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||

                            priority
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||

                            status
                                .toLowerCase()
                                .includes(
                                    query
                                )
                        );
                    }
                );
        }

        setFilteredJobs(
            result
        );
    };

    /*
     * FORMAT STATUS
     */
    const formatStatus = (
        status?: string | null
    ) => {
        if (!status) {
            return "Pending";
        }

        const value =
            status
                .replace(
                    /_/g,
                    " "
                )
                .replace(
                    /-/g,
                    " "
                )
                .trim();

        return value.replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );
    };

    /*
     * JOB NUMBER
     */
    const getJobNumber = (
        job: Job
    ) => {
        return String(
            job.jobId ||
            `JOB-${job.id}`
        );
    };

    /*
     * DATE
     */
    const getDate = (
        job: Job
    ) => {
        const date =
            job.expectedDate ||
            job.createdAt;

        if (!date) {
            return "Date not available";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    /*
     * CUSTOMER NAME
     */
    const getCustomerName = (
        job: Job
    ) => {
        if (job.customerId) {
            return `Customer #${job.customerId}`;
        }

        return "Customer";
    };

    /*
     * STATUS ICON
     */
    const getStatusIcon = (
        status?: string | null
    ) => {
        const value =
            formatStatus(status);

        if (
            value ===
            "Completed"
        ) {
            return "checkmark-circle-outline";
        }

        if (
            value ===
            "In Progress"
        ) {
            return "time-outline";
        }

        if (
            value ===
            "Assigned"
        ) {
            return "person-outline";
        }

        if (
            value ===
            "Accepted"
        ) {
            return "checkmark-outline";
        }

        if (
            value ===
            "Cancelled"
        ) {
            return "close-circle-outline";
        }

        if (
            value ===
            "Closed"
        ) {
            return "lock-closed-outline";
        }

        return "ellipse-outline";
    };

    /*
     * GET INVOICE ID
     *
     * The backend should return invoiceId
     * as part of the Job response.
     *
     * The extra fallbacks make this tolerant
     * if the backend currently sends invoice_id
     * or invoice.id.
     */
    const getInvoiceId = (
        job: Job
    ): number | null => {
        const rawJob =
            job as any;

        if (
            rawJob.invoiceId !==
                null &&
            rawJob.invoiceId !==
                undefined
        ) {
            const value =
                Number(
                    rawJob.invoiceId
                );

            if (
                !Number.isNaN(value) &&
                value > 0
            ) {
                return value;
            }
        }

        if (
            rawJob.invoice_id !==
                null &&
            rawJob.invoice_id !==
                undefined
        ) {
            const value =
                Number(
                    rawJob.invoice_id
                );

            if (
                !Number.isNaN(value) &&
                value > 0
            ) {
                return value;
            }
        }

        if (
            rawJob.invoice?.id !==
                null &&
            rawJob.invoice?.id !==
                undefined
        ) {
            const value =
                Number(
                    rawJob.invoice.id
                );

            if (
                !Number.isNaN(value) &&
                value > 0
            ) {
                return value;
            }
        }

        return null;
    };

    /*
     * CHECK WHETHER JOB CAN CREATE INVOICE
     *
     * Backend values are uppercase:
     * status = CLOSED
     * employeeStatus = COMPLETED
     *
     * The API currently does not return invoiceId, so a missing
     * invoice association means invoiceId is null and the Create
     * Invoice button is shown for a closed/completed job.
     */
    const canCreateInvoice = (
        job: Job
    ) => {
        const status = String(
            job.status ||
            ""
        )
            .trim()
            .toUpperCase();

        const employeeStatus = String(
            (job as any).employeeStatus ||
            ""
        )
            .trim()
            .toUpperCase();

        const invoiceId =
            getInvoiceId(job);

        const jobIsClosedOrCompleted =
            status === "CLOSED" ||
            status === "COMPLETED";

        const employeeIsCompleted =
            employeeStatus === "" ||
            employeeStatus === "COMPLETED";

        const result =
            jobIsClosedOrCompleted &&
            employeeIsCompleted &&
            invoiceId === null;

        console.log(
            "CREATE INVOICE CHECK",
            {
                jobId: job.id,
                status,
                employeeStatus,
                invoiceId,
                result,
            }
        );

        return result;
    };

    /*
     * CREATE INVOICE BUTTON
     */
    const handleCreateInvoice = (
        job: Job
    ) => {
        if (
            creatingInvoiceForJob !==
            null
        ) {
            return;
        }

        if (!canCreateInvoice(job)) {
            return;
        }

        if (!goToCreateInvoice) {
            Alert.alert(
                "Invoice",
                "Create Invoice screen is not connected yet."
            );

            return;
        }

        setCreatingInvoiceForJob(
            Number(job.id)
        );

        goToCreateInvoice(
            job.id
        );

        setTimeout(() => {
            setCreatingInvoiceForJob(
                null
            );
        }, 500);
    };

    /*
     * DOWNLOAD / OPEN EXISTING INVOICE
     */
    const handleDownloadInvoice = async (
        job: Job
    ) => {
        const invoiceId =
            getInvoiceId(job);

        if (!invoiceId) {
            Alert.alert(
                "Invoice",
                "Invoice not found for this job."
            );
            return;
        }

        if (!goToInvoiceDownload) {
            Alert.alert(
                "Invoice",
                "Invoice download is not connected yet."
            );
            return;
        }

        try {
            await Promise.resolve(
                goToInvoiceDownload(
                    invoiceId,
                    job.id
                )
            );
        } catch (error) {
            console.error(
                "Invoice download error:",
                error
            );

            Alert.alert(
                "Invoice",
                "Unable to open the invoice."
            );
        }
    };

    /*
     * REFRESH
     */
    const onRefresh = () => {
        setRefreshing(true);

        loadJobs();
    };

    /*
     * LOADING SCREEN
     */
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor:
                        "#421DDB",
                }}
            >
                <StatusBar
                    backgroundColor="#421DDB"
                    barStyle="light-content"
                    translucent={false}
                />

                <View
                    style={
                        jobsStyles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />

                    <Text
                        style={
                            jobsStyles.loadingText
                        }
                    >
                        Loading jobs...
                    </Text>
                </View>
            </View>
        );
    }

    /*
     * MAIN SCREEN
     */
    return (
        <View
            style={{
                flex: 1,
                backgroundColor:
                    "#421DDB",
            }}
        >
            <StatusBar
                backgroundColor="#421DDB"
                barStyle="light-content"
                translucent={false}
            />

            <SafeAreaView
                style={[
                    jobsStyles.screen,
                    {
                        backgroundColor:
                            "#421DDB",
                    },
                ]}
                edges={[
                    "top",
                    "left",
                    "right",
                    "bottom",
                ]}
            >
                {/* HEADER */}
                <View
                    style={
                        jobsStyles.header
                    }
                >
                    <TouchableOpacity
                        onPress={
                            goToHome
                        }
                        style={
                            jobsStyles.backButton
                        }
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <View
                        style={
                            jobsStyles.headerTextContainer
                        }
                    >
                        <Text
                            style={
                                jobsStyles.headerTitle
                            }
                        >
                            Jobs
                        </Text>

                        <Text
                            style={
                                jobsStyles.headerSubtitle
                            }
                        >
                            {jobs.length}{" "}
                            total jobs
                        </Text>
                    </View>
                </View>

                {/* CONTENT */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor:
                            "#F5F8FC",
                    }}
                >
                    <ScrollView
                        contentContainerStyle={
                            jobsStyles.content
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={
                                    refreshing
                                }
                                onRefresh={
                                    onRefresh
                                }
                                tintColor="#421DDB"
                                colors={[
                                    "#421DDB",
                                ]}
                            />
                        }
                    >
                        {/* SEARCH */}
                        <View
                            style={
                                jobsStyles.searchContainer
                            }
                        >
                            <Ionicons
                                name="search-outline"
                                size={21}
                                color="#421DDB"
                            />

                            <TextInput
                                value={
                                    search
                                }
                                onChangeText={
                                    setSearch
                                }
                                placeholder="Search jobs..."
                                placeholderTextColor="#9AA7B5"
                                style={
                                    jobsStyles.searchInput
                                }
                            />

                            {search.length >
                                0 && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setSearch(
                                            ""
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color="#421DDB"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* FILTERS */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={
                                false
                            }
                            style={
                                jobsStyles.filterScroll
                            }
                            contentContainerStyle={
                                jobsStyles.filterContainer
                            }
                        >
                            {filters.map(
                                (
                                    filter
                                ) => (
                                    <TouchableOpacity
                                        key={
                                            filter
                                        }
                                        onPress={() =>
                                            setSelectedFilter(
                                                filter
                                            )
                                        }
                                        style={[
                                            jobsStyles.filterButton,
                                            selectedFilter ===
                                                filter &&
                                                jobsStyles.filterButtonActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                jobsStyles.filterText,
                                                selectedFilter ===
                                                    filter &&
                                                    jobsStyles.filterTextActive,
                                            ]}
                                        >
                                            {
                                                filter
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </ScrollView>

                        {/* RESULT COUNT */}
                        <View
                            style={
                                jobsStyles.resultRow
                            }
                        >
                            <Text
                                style={
                                    jobsStyles.resultText
                                }
                            >
                                {
                                    filteredJobs.length
                                }{" "}
                                jobs found
                            </Text>
                        </View>

                        {/* EMPTY */}
                        {filteredJobs.length ===
                        0 ? (
                            <View
                                style={
                                    jobsStyles.emptyContainer
                                }
                            >
                                <Ionicons
                                    name="briefcase-outline"
                                    size={48}
                                    color="#421DDB"
                                />

                                <Text
                                    style={
                                        jobsStyles.emptyTitle
                                    }
                                >
                                    No jobs found
                                </Text>

                                <Text
                                    style={
                                        jobsStyles.emptyText
                                    }
                                >
                                    Try changing
                                    your search
                                    or filter.
                                </Text>
                            </View>
                        ) : (
                            /*
                             * JOB LIST
                             */
                            filteredJobs.map(
                                (job) => {
                                    const status =
                                        formatStatus(
                                            job.status
                                        );

                                    const showCreateInvoice =
                                        canCreateInvoice(
                                            job
                                        );

                                    const invoiceId =
                                        getInvoiceId(
                                            job
                                        );

                                    const isCreatingInvoice =
                                        creatingInvoiceForJob ===
                                        Number(
                                            job.id
                                        );

                                    return (
                                        <View
                                            key={String(
                                                job.id
                                            )}
                                            style={
                                                jobsStyles.jobCard
                                            }
                                        >
                                            {/* JOB MAIN AREA */}
                                            <TouchableOpacity
                                                activeOpacity={
                                                    0.8
                                                }
                                                onPress={() =>
                                                    goToJobView(
                                                        job.id
                                                    )
                                                }
                                            >
                                                <View
                                                    style={
                                                        jobsStyles.jobHeader
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            jobsStyles.jobIcon
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="construct-outline"
                                                            size={
                                                                23
                                                            }
                                                            color="#421DDB"
                                                        />
                                                    </View>

                                                    <View
                                                        style={
                                                            jobsStyles.jobMain
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                jobsStyles.jobNumber
                                                            }
                                                        >
                                                            {
                                                                getJobNumber(
                                                                    job
                                                                )
                                                            }
                                                        </Text>

                                                        <Text
                                                            style={
                                                                jobsStyles.jobTitle
                                                            }
                                                            numberOfLines={
                                                                1
                                                            }
                                                        >
                                                            {
                                                                job.jobTitle ||
                                                                "Service Job"
                                                            }
                                                        </Text>

                                                        <Text
                                                            style={
                                                                jobsStyles.customerName
                                                            }
                                                        >
                                                            {
                                                                getCustomerName(
                                                                    job
                                                                )
                                                            }
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            jobsStyles.statusBadge,

                                                            status ===
                                                                "Completed" &&
                                                                jobsStyles.completedBadge,

                                                            status ===
                                                                "In Progress" &&
                                                                jobsStyles.progressBadge,
                                                        ]}
                                                    >
                                                        <Ionicons
                                                            name={getStatusIcon(
                                                                job.status
                                                            )}
                                                            size={
                                                                13
                                                            }
                                                            color="#421DDB"
                                                        />

                                                        <Text
                                                            style={
                                                                jobsStyles.statusText
                                                            }
                                                        >
                                                            {
                                                                status
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View
                                                    style={
                                                        jobsStyles.divider
                                                    }
                                                />

                                                <View
                                                    style={
                                                        jobsStyles.jobFooter
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            jobsStyles.dateContainer
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="calendar-outline"
                                                            size={
                                                                17
                                                            }
                                                            color="#6B7785"
                                                        />

                                                        <Text
                                                            style={
                                                                jobsStyles.dateText
                                                            }
                                                        >
                                                            {
                                                                getDate(
                                                                    job
                                                                )
                                                            }
                                                        </Text>
                                                    </View>

                                                    <Ionicons
                                                        name="chevron-forward"
                                                        size={
                                                            20
                                                        }
                                                        color="#9AA7B5"
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                            {/*
                                             * INVOICE ACTION
                                             *
                                             * CLOSED + COMPLETED + no invoice
                                             * => Create Invoice
                                             *
                                             * Existing invoice
                                             * => Download Invoice
                                             */}
                                            {invoiceId === null &&
                                                showCreateInvoice && (
                                                    <View
                                                        style={{
                                                            marginTop: 14,
                                                            paddingTop: 14,
                                                            borderTopWidth: 1,
                                                            borderTopColor:
                                                                "#E8ECF2",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#6B7785",
                                                                fontSize: 12,
                                                                fontWeight: "600",
                                                                textAlign: "center",
                                                                marginBottom: 9,
                                                            }}
                                                        >
                                                            Job closed — invoice pending
                                                        </Text>

                                                        <TouchableOpacity
                                                            activeOpacity={0.8}
                                                            onPress={() =>
                                                                handleCreateInvoice(
                                                                    job
                                                                )
                                                            }
                                                            disabled={
                                                                isCreatingInvoice
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                minHeight: 48,
                                                                borderRadius: 10,
                                                                backgroundColor:
                                                                    "#421DDB",
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                paddingHorizontal: 14,
                                                            }}
                                                        >
                                                            {isCreatingInvoice ? (
                                                                <ActivityIndicator
                                                                    size="small"
                                                                    color="#FFFFFF"
                                                                />
                                                            ) : (
                                                                <Ionicons
                                                                    name="receipt-outline"
                                                                    size={19}
                                                                    color="#FFFFFF"
                                                                />
                                                            )}

                                                            <Text
                                                                style={{
                                                                    color: "#FFFFFF",
                                                                    fontSize: 14,
                                                                    fontWeight: "700",
                                                                    marginLeft: 8,
                                                                }}
                                                            >
                                                                {isCreatingInvoice
                                                                    ? "Opening Invoice..."
                                                                    : "Create Invoice"}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                            {invoiceId !== null && (
                                                <View
                                                    style={{
                                                        marginTop: 14,
                                                        paddingTop: 14,
                                                        borderTopWidth: 1,
                                                        borderTopColor:
                                                            "#E8ECF2",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#2E8B57",
                                                            fontSize: 12,
                                                            fontWeight: "600",
                                                            textAlign: "center",
                                                            marginBottom: 9,
                                                        }}
                                                    >
                                                        Invoice #{invoiceId} created
                                                    </Text>

                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() =>
                                                            handleDownloadInvoice(
                                                                job
                                                            )
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            minHeight: 48,
                                                            borderRadius: 10,
                                                            backgroundColor:
                                                                "#421DDB",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            paddingHorizontal: 14,
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name="download-outline"
                                                            size={19}
                                                            color="#FFFFFF"
                                                        />

                                                        <Text
                                                            style={{
                                                                color: "#FFFFFF",
                                                                fontSize: 14,
                                                                fontWeight: "700",
                                                                marginLeft: 8,
                                                            }}
                                                        >
                                                            Download Invoice
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    );
                                }
                            )
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default Jobs;
