
import { StyleSheet } from "react-native";

export const invoicesStyles = StyleSheet.create({

    // =========================================================
    // SCREEN
    // =========================================================

    screen: {
        flex: 1,
        backgroundColor: "#F5F8FC",
    },

    // =========================================================
    // HEADER
    // =========================================================

    header: {
        height: 105,

        backgroundColor: "#421DDB",

        flexDirection: "row",

        alignItems: "flex-end",

        justifyContent: "space-between",

        paddingHorizontal: 20,

        paddingBottom: 18,

        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    backButton: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor:
            "rgba(255,255,255,0.15)",

        alignItems: "center",

        justifyContent: "center",
    },

    headerTextContainer: {
        flex: 1,

        marginLeft: 12,
    },

    headerTitle: {
        color: "#FFFFFF",

        fontSize: 22,

        fontWeight: "700",
    },

    headerSubtitle: {
        color: "#DDD7FF",

        fontSize: 13,

        marginTop: 3,
    },

    headerRight: {
        width: 40,
    },

    // =========================================================
    // CONTENT
    // =========================================================

    content: {
        padding: 16,

        paddingBottom: 40,

        backgroundColor: "#F5F8FC",
    },

    // =========================================================
    // SEARCH
    // =========================================================

    searchContainer: {
        height: 50,

        backgroundColor: "#FFFFFF",

        borderRadius: 12,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 14,

        marginBottom: 14,

        borderWidth: 1,

        borderColor: "#E1E7ED",

        elevation: 1,

        shadowColor: "#000000",

        shadowOpacity: 0.04,

        shadowRadius: 4,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    searchInput: {
        flex: 1,

        height: 50,

        marginLeft: 10,

        fontSize: 15,

        color: "#17212B",
    },

    // =========================================================
    // RESULT
    // =========================================================

    resultRow: {
        marginBottom: 12,
    },

    resultText: {
        fontSize: 13,

        color: "#421DDB",

        fontWeight: "600",
    },

    // =========================================================
    // INVOICE CARD
    // =========================================================

    invoiceCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 15,

        padding: 16,

        marginBottom: 14,

        borderWidth: 1,

        borderColor: "#E6EBF0",

        elevation: 2,

        shadowColor: "#000000",

        shadowOpacity: 0.05,

        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    // =========================================================
    // TOP
    // =========================================================

    invoiceTop: {
        flexDirection: "row",

        alignItems: "center",
    },

    invoiceIcon: {
        width: 45,

        height: 45,

        borderRadius: 12,

        backgroundColor: "#F0ECFF",

        alignItems: "center",

        justifyContent: "center",

        marginRight: 12,
    },

    invoiceMain: {
        flex: 1,

        paddingRight: 8,
    },

    invoiceNumber: {
        fontSize: 16,

        fontWeight: "700",

        color: "#17212B",

        marginBottom: 4,
    },

    customerName: {
        fontSize: 13,

        color: "#737F8C",

        fontWeight: "500",
    },

    // =========================================================
    // STATUS
    // =========================================================

    statusBadge: {
        borderRadius: 20,

        paddingHorizontal: 9,

        paddingVertical: 6,

        flexDirection: "row",

        alignItems: "center",

        gap: 5,
    },

    statusText: {
        fontSize: 10,

        fontWeight: "700",
    },

    // =========================================================
    // DIVIDER
    // =========================================================

    divider: {
        height: 1,

        backgroundColor: "#EEF1F4",

        marginVertical: 14,
    },

    // =========================================================
    // DETAILS
    // =========================================================

    invoiceDetails: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    detailItem: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,

        flex: 1,
    },

    detailLabel: {
        fontSize: 11,

        color: "#8A96A3",

        marginBottom: 3,
    },

    detailValue: {
        fontSize: 13,

        color: "#293541",

        fontWeight: "600",
    },

    // =========================================================
    // AMOUNT
    // =========================================================

    amountContainer: {
        alignItems: "flex-end",
    },

    amountLabel: {
        fontSize: 11,

        color: "#8A96A3",

        marginBottom: 3,
    },

    amountValue: {
        fontSize: 17,

        color: "#421DDB",

        fontWeight: "700",
    },

    // =========================================================
    // JOB ROW
    // =========================================================

    jobRow: {
        flexDirection: "row",

        alignItems: "center",

        marginTop: 13,

        paddingTop: 12,

        borderTopWidth: 1,

        borderTopColor: "#EEF1F4",

        gap: 7,
    },

    jobText: {
        flex: 1,

        fontSize: 12,

        color: "#737F8C",

        fontWeight: "500",
    },

    // =========================================================
    // DOWNLOAD BUTTON
    // =========================================================

    downloadButton: {
        height: 46,

        marginTop: 15,

        borderRadius: 11,

        backgroundColor: "#421DDB",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        paddingHorizontal: 16,
    },

    downloadButtonDisabled: {
        backgroundColor: "#AFA7E8",
    },

    downloadButtonText: {
        marginLeft: 8,

        color: "#FFFFFF",

        fontSize: 14,

        fontWeight: "700",
    },

    // =========================================================
    // EMPTY
    // =========================================================

    emptyContainer: {
        backgroundColor: "#FFFFFF",

        borderRadius: 15,

        paddingVertical: 55,

        paddingHorizontal: 20,

        alignItems: "center",

        justifyContent: "center",

        marginTop: 5,

        borderWidth: 1,

        borderColor: "#E6EBF0",
    },

    emptyTitle: {
        marginTop: 14,

        fontSize: 19,

        fontWeight: "700",

        color: "#293541",
    },

    emptyText: {
        marginTop: 7,

        fontSize: 14,

        color: "#7A8793",

        textAlign: "center",

        lineHeight: 21,
    },

    // =========================================================
    // LOADING
    // =========================================================

    loadingContainer: {
        flex: 1,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#F5F8FC",
    },

    loadingText: {
        marginTop: 12,

        fontSize: 15,

        color: "#6B7785",
    },

    // =========================================================
    // BOTTOM NAVIGATION
    // =========================================================

    bottomNav: {
        height: 72,

        backgroundColor: "#FFFFFF",

        borderTopWidth: 1,

        borderTopColor: "#E4E9EE",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-around",

        paddingBottom: 4,
    },

    navItem: {
        flex: 1,

        alignItems: "center",

        justifyContent: "center",
    },

    navText: {
        marginTop: 4,

        fontSize: 11,

        color: "#8A96A3",

        fontWeight: "500",
    },

    navTextActive: {
        color: "#421DDB",

        fontWeight: "700",
    },
});
