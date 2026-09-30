
import { StyleSheet } from "react-native";

export const jobsStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#421DDB",
    },

    header: {
        backgroundColor: "#421DDB",
        paddingHorizontal: 20,
        paddingVertical: 18,

        flexDirection: "row",
        alignItems: "center",

        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,

        backgroundColor:
            "rgba(255, 255, 255, 0.15)",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 14,
    },

    headerTextContainer: {
        flex: 1,
    },

    headerTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
    },

    headerSubtitle: {
        color: "#D9E9F8",
        fontSize: 13,
        marginTop: 3,
    },

    content: {
        padding: 16,
        paddingBottom: 100,
        backgroundColor: "#F5F8FC",
    },

    searchContainer: {
        height: 48,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 14,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#E1E7ED",
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: "#17212B",
    },

    filterScroll: {
        marginTop: 14,
    },

    filterContainer: {
        gap: 8,
    },

    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 9,
        borderRadius: 20,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#DCE3EA",
    },

    filterButtonActive: {
        backgroundColor: "#421DDB",
        borderColor: "#421DDB",
    },

    filterText: {
        color: "#667381",
        fontSize: 13,
        fontWeight: "600",
    },

    filterTextActive: {
        color: "#FFFFFF",
    },

    resultRow: {
        marginTop: 18,
        marginBottom: 10,
    },

    resultText: {
        fontSize: 14,
        color: "#421DDB",
        fontWeight: "500",
    },

    jobCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 16,
        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#E6EBF0",
    },

    jobHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    jobIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,

        backgroundColor: "#F0ECFF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 12,
    },

    jobMain: {
        flex: 1,
        paddingRight: 8,
    },

    jobNumber: {
        fontSize: 12,
        color: "#421DDB",
        fontWeight: "700",
    },

    jobTitle: {
        fontSize: 16,
        color: "#17212B",
        fontWeight: "700",
        marginTop: 4,
    },

    customerName: {
        fontSize: 13,
        color: "#737F8C",
        marginTop: 5,
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",

        gap: 4,

        backgroundColor: "#FFF5D9",

        paddingHorizontal: 8,
        paddingVertical: 5,

        borderRadius: 10,
    },

    completedBadge: {
        backgroundColor: "#E7F7ED",
    },

    progressBadge: {
        backgroundColor: "#F0ECFF",
    },

    statusText: {
        fontSize: 10,
        color: "#421DDB",
        fontWeight: "700",
    },

    divider: {
        height: 1,
        backgroundColor: "#EEF1F4",
        marginVertical: 14,
    },

    jobFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    dateText: {
        fontSize: 13,
        color: "#697684",
    },

    emptyContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,

        paddingVertical: 50,
        paddingHorizontal: 20,

        alignItems: "center",
        marginTop: 10,
    },

    emptyTitle: {
        color: "#293541",
        fontSize: 17,
        fontWeight: "700",
        marginTop: 12,
    },

    emptyText: {
        color: "#7A8793",
        fontSize: 13,
        textAlign: "center",
        marginTop: 6,
    },

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F8FC",
    },

    loadingText: {
        marginTop: 10,
        color: "#6B7785",
        fontSize: 14,
    },

    bottomNav: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,

        height: 72,

        backgroundColor: "#FFFFFF",

        borderTopWidth: 1,
        borderTopColor: "#E4E9EE",

        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    navItem: {
        alignItems: "center",
        justifyContent: "center",
        minWidth: 65,
    },

    navText: {
        fontSize: 11,
        color: "#8A96A3",
        marginTop: 4,
        fontWeight: "500",
    },

    navTextActive: {
        color: "#421DDB",
        fontWeight: "700",
    },
});
