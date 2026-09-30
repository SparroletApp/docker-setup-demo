import { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { home } from "./Home.styles";

import { getAllJobs, getJobsByUserId, getUnassignedJobs, Job } from "@/lib/jobservice";
import { getAllTickets, Ticket } from "@/lib/ticketservice";
import { getUserById, User } from "@/lib/userservice";

type HomeJob = Job & {
    customerId: number | null;
};

type JobTab = "today" | "unassigned";

const formatTime = (dateValue?: string | null) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const normalizeStatus = (status?: string | null) => {
    if (!status) {
        return "Pending";
    }

    const value = status.toLowerCase().trim();

    if (value === "assigned" || value === "assign") {
        return "Assigned";
    }

    if (value === "accepted" || value === "accept") {
        return "Accepted";
    }

    if (
        value === "in progress" ||
        value === "in_progress" ||
        value === "in-progress" ||
        value === "ongoing"
    ) {
        return "In Progress";
    }

    if (
        value === "completed" ||
        value === "complete" ||
        value === "closed"
    ) {
        return "Completed";
    }

    if (value === "cancelled" || value === "canceled") {
        return "Cancelled";
    }

    if (value === "pending") {
        return "Pending";
    }

    return status;
};

const isToday = (job: Job) => {
    if (!job.expectedDate) {
        return false;
    }

    const date = new Date(job.expectedDate);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};


const isUnassigned = (job: Job) => {
    return (
        job.userId === null ||
        job.userId === undefined ||
        Number(job.userId) === 0
    );
};

function Home({
    goToJobs,
    goToInvoices,
    goToJobView,
}: {
    goToJobs: () => void;
    goToInvoices: () => void;
    goToJobView: (jobId: number) => void;
}) {
    const [jobs, setJobs] = useState<HomeJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [activeTab, setActiveTab] = useState<JobTab>("today");

    const [technician, setTechnician] = useState<User | null>(null);

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            setLoading(true);

            const technicianId =
                await AsyncStorage.getItem("technician_id");

            if (!technicianId) {
                console.log(
                    "Technician/User ID not found in AsyncStorage"
                );

                setTechnician(null);
                setJobs([]);

                return;
            }

            const userId = Number(technicianId);

            if (Number.isNaN(userId)) {
                console.log(
                    "Invalid Technician/User ID:",
                    technicianId
                );

                setTechnician(null);
                setJobs([]);

                return;
            }

            console.log(
                "Logged-in Technician/User ID:",
                userId
            );

            /*
            |--------------------------------------------------------------------------
            | Get technician details
            |--------------------------------------------------------------------------
            */

            try {
                const technicianUser =
                    await getUserById({
                        id: userId,
                    });

                console.log(
                    "Logged-in Technician:",
                    technicianUser
                );

                setTechnician(
                    technicianUser
                );
            } catch (userError) {
                console.error(
                    "Technician details error:",
                    userError
                );

                setTechnician(null);
            }

            /*
            |--------------------------------------------------------------------------
            | Get assigned jobs + unassigned jobs separately
            |--------------------------------------------------------------------------
            */

            const [
                technicianJobs,
                unassignedJobs,
                allTickets,
            ] = await Promise.all([
                getJobsByUserId({
                    userId,
                }),
                getUnassignedJobs(),
                getAllTickets(),
            ]);

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

            const technicianHomeJobs:
                HomeJob[] =
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
                        };
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | Add customer ID to unassigned jobs
            |--------------------------------------------------------------------------
            */

            const unassignedHomeJobs:
                HomeJob[] =
                unassignedJobs.map(
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
                        };
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | Combine only for UI state
            |--------------------------------------------------------------------------
            |
            | This does NOT assign unassigned jobs.
            | Their userId remains null.
            |
            */

            const homeJobs: HomeJob[] = [
                ...technicianHomeJobs,
                ...unassignedHomeJobs,
            ];

            console.log(
                "Technician Jobs:",
                technicianHomeJobs
            );

            console.log(
                "Unassigned Jobs:",
                unassignedHomeJobs
            );

            setJobs(homeJobs);

        } catch (error) {
            console.error(
                "Home data error:",
                error
            );

            setJobs([]);

        } finally {
            setLoading(false);
        }
    };

    const refreshHome = async () => {
        setRefreshing(true);

        await loadHomeData();

        setRefreshing(false);
    };

    const todaysJobs = useMemo(() => {
        return jobs
            .filter((job) => {
                const assignedToTechnician = !isUnassigned(job);

                return (
                    assignedToTechnician &&
                    isToday(job)
                );
            })
            .sort((a, b) => {
                const first = a.expectedDate
                    ? new Date(a.expectedDate).getTime()
                    : 0;

                const second = b.expectedDate
                    ? new Date(b.expectedDate).getTime()
                    : 0;

                return first - second;
            });
    }, [jobs]);

    const unassignedJobs = useMemo(() => {
        return jobs
            .filter((job) => isUnassigned(job))
            .sort((a, b) => {
                const first = a.expectedDate
                    ? new Date(a.expectedDate).getTime()
                    : 0;

                const second = b.expectedDate
                    ? new Date(b.expectedDate).getTime()
                    : 0;

                return first - second;
            });
    }, [jobs]);

    const visibleJobs =
        activeTab === "today"
            ? todaysJobs
            : unassignedJobs;


    const todayCount = todaysJobs.length;

    const completedCount = jobs.filter((job) => {
        const status = normalizeStatus(job.status);

        return (
            !isUnassigned(job) &&
            status === "Completed"
        );
    }).length;

    const pendingCount = jobs.filter((job) => {
        const status = normalizeStatus(job.status);

        return (
            !isUnassigned(job) &&
            (
                status === "Pending" ||
                status === "Assigned" ||
                status === "Accepted" ||
                status === "In Progress"
            )
        );
    }).length;

    const unassignedCount = unassignedJobs.length;

    const getStatusStyle = (
        status?: string | null
    ) => {
        const normalized = normalizeStatus(status);

        if (normalized === "Assigned") {
            return {
                badge: home.assignedBadge,
                text: home.assignedText,
            };
        }

        if (normalized === "Accepted") {
            return {
                badge: home.acceptedBadge,
                text: home.acceptedText,
            };
        }

        if (normalized === "In Progress") {
            return {
                badge: home.progressBadge,
                text: home.progressText,
            };
        }

        if (normalized === "Completed") {
            return {
                badge: home.completedBadge,
                text: home.completedText,
            };
        }

        if (normalized === "Cancelled") {
            return {
                badge: home.cancelledBadge,
                text: home.cancelledText,
            };
        }

        return {
            badge: home.pendingBadge,
            text: home.pendingText,
        };
    };

    /*
     * ------------------------------------------------------------------
     * LOADING
     * ------------------------------------------------------------------
     */

    if (loading) {
        return (
            <SafeAreaView
                style={home.safeArea}
                edges={["top", "left", "right"]}
            >
                <View style={home.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#421DDB"
                    />

                    <Text style={home.loadingText}>
                        Loading Home...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    /*
     * ------------------------------------------------------------------
     * TECHNICIAN DISPLAY VALUES
     * ------------------------------------------------------------------
     */

    const technicianName =
        technician?.name?.trim() || "Technician";

    const technicianDisplayId =
        technician?.technicianId?.trim() ||
        (technician?.id
            ? String(technician.id)
            : "N/A");

    return (
        <>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#421DDB"
        />
        <SafeAreaView
            style={home.safeArea}
            edges={["top", "left", "right"]}
        >
            <View style={home.container}>


                <View style={home.header}>
                    <View style={home.headerLeft}>
                        <Text style={home.greeting}>
                            Good Morning,
                        </Text>

                        <Text
                            style={home.technicianName}
                            numberOfLines={1}
                        >
                            {technicianName}
                        </Text>

                        <Text style={home.role}>
                            Technician ID: {technicianDisplayId}
                        </Text>
                    </View>

                    <View style={home.headerRight}>
                        <TouchableOpacity
                            style={home.headerIcon}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color="#FFFFFF"
                            />

                            <View
                                style={home.notificationDot}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={home.profileCircle}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="person"
                                size={20}
                                color="#421DDB"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    style={home.scroll}
                    contentContainerStyle={
                        home.scrollContent
                    }
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshHome}
                            tintColor="#421DDB"
                        />
                    }
                >


                    <View style={home.statsContainer}>

                        <View style={home.statCard}>
                            <View
                                style={[
                                    home.statIcon,
                                    home.todayIcon,
                                ]}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color="#421DDB"
                                />
                            </View>

                            <View style={home.statContent}>
                                <Text
                                    style={home.statNumber}
                                >
                                    {todayCount}
                                </Text>

                                <Text
                                    style={home.statTitle}
                                >
                                    Today's Jobs
                                </Text>
                            </View>
                        </View>

                        <View style={home.statCard}>
                            <View
                                style={[
                                    home.statIcon,
                                    home.completedIcon,
                                ]}
                            >
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={18}
                                    color="#159447"
                                />
                            </View>

                            <View style={home.statContent}>
                                <Text
                                    style={[
                                        home.statNumber,
                                        home.completedNumber,
                                    ]}
                                >
                                    {completedCount}
                                </Text>

                                <Text
                                    style={home.statTitle}
                                >
                                    Completed
                                </Text>
                            </View>
                        </View>

                        <View style={home.statCard}>
                            <View
                                style={[
                                    home.statIcon,
                                    home.pendingIcon,
                                ]}
                            >
                                <Ionicons
                                    name="time-outline"
                                    size={18}
                                    color="#D98200"
                                />
                            </View>

                            <View style={home.statContent}>
                                <Text
                                    style={[
                                        home.statNumber,
                                        home.pendingNumber,
                                    ]}
                                >
                                    {pendingCount}
                                </Text>

                                <Text
                                    style={home.statTitle}
                                >
                                    Pending
                                </Text>
                            </View>
                        </View>

                    </View>


                    <View style={home.sectionHeader}>
                        <View>
                            <Text
                                style={home.sectionTitle}
                            >
                                Jobs
                            </Text>

                            <Text
                                style={home.sectionSubtitle}
                            >
                                Manage your assigned and available jobs
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={goToJobs}
                        >
                            <Text style={home.viewAll}>
                                View All
                            </Text>
                        </TouchableOpacity>
                    </View>


                    <View style={home.tabsContainer}>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setActiveTab("today")
                            }
                            style={[
                                home.tab,
                                activeTab === "today" &&
                                home.activeTab,
                            ]}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={17}
                                color={
                                    activeTab === "today"
                                        ? "#421DDB"
                                        : "#777777"
                                }
                            />

                            <Text
                                style={[
                                    home.tabText,
                                    activeTab === "today" &&
                                    home.activeTabText,
                                ]}
                            >
                                Today's Jobs
                            </Text>

                            <View
                                style={[
                                    home.tabCount,
                                    activeTab === "today" &&
                                    home.activeTabCount,
                                ]}
                            >
                                <Text
                                    style={[
                                        home.tabCountText,
                                        activeTab === "today" &&
                                        home.activeTabCountText,
                                    ]}
                                >
                                    {todayCount}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setActiveTab("unassigned")
                            }
                            style={[
                                home.tab,
                                activeTab === "unassigned" &&
                                home.activeTab,
                            ]}
                        >
                            <Ionicons
                                name="briefcase-outline"
                                size={17}
                                color={
                                    activeTab === "unassigned"
                                        ? "#421DDB"
                                        : "#777777"
                                }
                            />

                            <Text
                                style={[
                                    home.tabText,
                                    activeTab === "unassigned" &&
                                    home.activeTabText,
                                ]}
                            >
                                Unassigned
                            </Text>

                            <View
                                style={[
                                    home.tabCount,
                                    activeTab === "unassigned" &&
                                    home.activeTabCount,
                                ]}
                            >
                                <Text
                                    style={[
                                        home.tabCountText,
                                        activeTab === "unassigned" &&
                                        home.activeTabCountText,
                                    ]}
                                >
                                    {unassignedCount}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {visibleJobs.length === 0 ? (
                        <View style={home.emptyJobs}>

                            <View style={home.emptyIcon}>
                                <Ionicons
                                    name={
                                        activeTab === "today"
                                            ? "calendar-outline"
                                            : "briefcase-outline"
                                    }
                                    size={34}
                                    color="#421DDB"
                                />
                            </View>

                            <Text
                                style={home.emptyTitle}
                            >
                                {activeTab === "today"
                                    ? "No jobs today"
                                    : "No unassigned jobs"}
                            </Text>

                            <Text
                                style={home.emptyDescription}
                            >
                                {activeTab === "today"
                                    ? "You don't have any jobs assigned for today."
                                    : "There are currently no unassigned jobs available."}
                            </Text>

                        </View>
                    ) : (
                        <View style={home.jobsContainer}>

                            {visibleJobs.map(
                                (job, index) => {
                                    const status =
                                        normalizeStatus(
                                            job.status
                                        );

                                    const statusStyle =
                                        getStatusStyle(
                                            job.status
                                        );

                                    const timeText =
                                        job.expectedDate
                                            ? formatTime(
                                                job.expectedDate
                                            )
                                            : "";

                                    const unassigned =
                                        isUnassigned(job);

                                    return (
                                        <TouchableOpacity
                                            key={String(job.id)}
                                            style={[
                                                home.jobCard,
                                                index === visibleJobs.length - 1 &&
                                                home.lastJobCard,
                                            ]}
                                            activeOpacity={0.8}
                                            onPress={() => goToJobView(job.id)}
                                        >
                                            <View
                                                style={[
                                                    home.jobStatusLine,
                                                    status ===
                                                    "Completed" &&
                                                    home.completedLine,
                                                    status ===
                                                    "In Progress" &&
                                                    home.progressLine,
                                                    unassigned &&
                                                    home.unassignedLine,
                                                ]}
                                            />


                                            <View
                                                style={
                                                    home.jobInfo
                                                }
                                            >

                                                <View
                                                    style={
                                                        home.jobTopRow
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            home.jobId
                                                        }
                                                        numberOfLines={
                                                            1
                                                        }
                                                    >
                                                        {job.jobId}
                                                    </Text>

                                                    {unassigned && (
                                                        <View
                                                            style={
                                                                home.unassignedSmallBadge
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    home.unassignedSmallText
                                                                }
                                                            >
                                                                OPEN
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>



                                                <Text
                                                    style={
                                                        home.jobTitle
                                                    }
                                                    numberOfLines={
                                                        1
                                                    }
                                                >
                                                    {job.jobTitle ||
                                                        "Service Job"}
                                                </Text>

                                                <View
                                                    style={
                                                        home.jobMetaRow
                                                    }
                                                >

                                                    {timeText ? (
                                                        <View
                                                            style={
                                                                home.timeRow
                                                            }
                                                        >
                                                            <Ionicons
                                                                name="time-outline"
                                                                size={
                                                                    13
                                                                }
                                                                color="#777777"
                                                            />

                                                            <Text
                                                                style={
                                                                    home.jobTime
                                                                }
                                                            >
                                                                {timeText}
                                                            </Text>
                                                        </View>
                                                    ) : null}

                                                    {job.expectedDate &&
                                                        activeTab ===
                                                        "unassigned" && (
                                                            <View
                                                                style={
                                                                    home.timeRow
                                                                }
                                                            >
                                                                <Ionicons
                                                                    name="calendar-outline"
                                                                    size={
                                                                        13
                                                                    }
                                                                    color="#777777"
                                                                />

                                                                <Text
                                                                    style={
                                                                        home.jobTime
                                                                    }
                                                                >
                                                                    {new Date(
                                                                        job.expectedDate
                                                                    ).toLocaleDateString(
                                                                        [],
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                        }
                                                                    )}
                                                                </Text>
                                                            </View>
                                                        )}

                                                </View>

                                            </View>



                                            <View
                                                style={[
                                                    home.statusBadge,
                                                    statusStyle.badge,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        home.statusText,
                                                        statusStyle.text,
                                                    ]}
                                                >
                                                    {unassigned
                                                        ? "Unassigned"
                                                        : status}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                    );
                                }
                            )}

                        </View>
                    )}

                </ScrollView>
            </View>
        </SafeAreaView>
        </>
    );
}

export default Home;