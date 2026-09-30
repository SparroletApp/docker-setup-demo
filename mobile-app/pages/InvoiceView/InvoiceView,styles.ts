import { StyleSheet } from "react-native";

export const invoiceViewStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 25,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666666",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
    marginTop: 15,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    height: 105,
    backgroundColor: "#dd651b",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 17,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#FFE4D5",
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },

  pdfHeaderButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  invoiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF1E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  summaryMain: {
    flex: 1,
  },

  invoiceNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
  },

  createdText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: "#EAF7EF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },

  statusText: {
    color: "#2E8B57",
    fontSize: 11,
    fontWeight: "700",
  },

  amountBox: {
    backgroundColor: "#FFF7F2",
    borderRadius: 11,
    marginTop: 15,
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  amountLabel: {
    fontSize: 13,
    color: "#777777",
    fontWeight: "500",
  },

  amountValue: {
    fontSize: 21,
    color: "#dd651b",
    fontWeight: "800",
  },

  pdfButton: {
    height: 51,
    backgroundColor: "#dd651b",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 2,
  },

  pdfButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 9,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
    marginTop: 3,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 18,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF1E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  infoContent: {
    flex: 1,
    paddingTop: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    fontWeight: "500",
  },

  infoSubValue: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },

  detailRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 9,
  },

  lastDetailRow: {
    borderBottomWidth: 0,
  },

  detailLabel: {
    width: "40%",
    fontSize: 12,
    color: "#888888",
    fontWeight: "500",
  },

  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#333333",
    fontWeight: "600",
    lineHeight: 19,
  },

  description: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 21,
    paddingVertical: 12,
  },

  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 15,
    marginBottom: 11,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  jobCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  jobNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222222",
  },

  jobTitle: {
    fontSize: 13,
    color: "#666666",
    marginTop: 4,
    maxWidth: 210,
  },

  jobStatus: {
    backgroundColor: "#EAF7EF",
    color: "#2E8B57",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: "hidden",
    textTransform: "capitalize",
  },

  jobDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },

  jobLabel: {
    width: "40%",
    fontSize: 12,
    color: "#999999",
  },

  jobValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#444444",
    fontWeight: "600",
  },

  jobDescriptionBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginTop: 11,
    padding: 11,
  },

  jobDescription: {
    fontSize: 13,
    color: "#555555",
    lineHeight: 20,
  },

  partCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 15,
    marginBottom: 11,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  partHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  partHeaderInfo: {
    flex: 1,
    marginLeft: 10,
  },

  partName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },

  partNumber: {
    fontSize: 12,
    color: "#888888",
    marginTop: 3,
  },

  partDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  partLabel: {
    fontSize: 12,
    color: "#999999",
  },

  partValue: {
    fontSize: 13,
    color: "#444444",
    fontWeight: "600",
  },

  partTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },

  partTotalLabel: {
    fontSize: 13,
    color: "#555555",
    fontWeight: "600",
  },

  partTotalValue: {
    fontSize: 15,
    color: "#dd651b",
    fontWeight: "800",
  },

  assetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 15,
    marginBottom: 11,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  assetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF1E9",
    justifyContent: "center",
    alignItems: "center",
  },

  assetHeaderInfo: {
    flex: 1,
    marginLeft: 10,
  },

  assetTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },

  assetStatus: {
    fontSize: 11,
    color: "#2E8B57",
    marginTop: 3,
    textTransform: "capitalize",
    fontWeight: "600",
  },

  assetDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  assetLabel: {
    width: "42%",
    fontSize: 12,
    color: "#999999",
  },

  assetValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#444444",
    fontWeight: "600",
  },

  assetDescription: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    fontSize: 13,
    color: "#555555",
    lineHeight: 19,
  },

  noDataRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  noDataText: {
    fontSize: 13,
    color: "#999999",
    marginLeft: 9,
  },

  workSummaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  workSummaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF1E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  workSummaryContent: {
    flex: 1,
    paddingTop: 1,
  },

  workHoursValue: {
    fontSize: 17,
    color: "#dd651b",
    fontWeight: "800",
    marginTop: 2,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  amountRowLabel: {
    fontSize: 14,
    color: "#666666",
  },

  amountRowValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "600",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 17,
    paddingBottom: 12,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222222",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#dd651b",
  },

  bottomPdfButton: {
    height: 52,
    backgroundColor: "#dd651b",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    marginBottom: 11,
    elevation: 2,
  },

  bottomPdfButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 9,
  },

  backAction: {
    height: 50,
    backgroundColor: "#555555",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  backActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});