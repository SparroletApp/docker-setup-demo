
import { StyleSheet } from "react-native";

const jobEditStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    height: 105,
    backgroundColor: "#421ddb",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  headerBackButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  headerRight: {
    width: 38,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#777777",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#421ddb",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  jobHeaderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  jobNumberLabel: {
    fontSize: 12,
    color: "#8A96A3",
    marginBottom: 4,
  },

  jobNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  lockedBanner: {
    backgroundColor: "#F2EFF7",
    borderWidth: 1,
    borderColor: "#DDD6EA",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  lockedBannerText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    lineHeight: 19,
    color: "#5B4B8A",
    fontWeight: "600",
  },

  takeJobButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#421ddb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  takeJobButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#d1c6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },

  detailRow: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  detailLabel: {
    fontSize: 12,
    color: "#8A96A3",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },

  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },

  scheduleLabel: {
    fontSize: 12,
    color: "#8A96A3",
    marginBottom: 3,
  },

  scheduleValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "600",
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#555555",
  },

  workTimeRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  workTimeBlock: {
    flex: 1,
  },

  workTimeDivider: {
    width: 1,
    backgroundColor: "#E6E6E6",
    marginHorizontal: 14,
  },

  workTimeValue: {
    fontSize: 13,
    color: "#333333",
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 10,
    minHeight: 36,
  },

  clockButton: {
    height: 40,
    borderRadius: 9,
    backgroundColor: "#421ddb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  clockButtonEnd: {
    backgroundColor: "#333333",
  },

  clockButtonDisabled: {
    opacity: 0.4,
  },

  clockButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  resetLink: {
    color: "#421ddb",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },

  hoursBadge: {
    marginTop: 15,
    backgroundColor: "#FFF3EC",
    borderWidth: 1,
    borderColor: "#F5D5C0",
    borderRadius: 9,
    minHeight: 38,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  hoursBadgeText: {
    color: "#421ddb",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 7,
  },

  inputLabel: {
    fontSize: 13,
    color: "#555555",
    fontWeight: "700",
    marginBottom: 7,
  },

  textArea: {
    minHeight: 105,
    borderWidth: 1,
    borderColor: "#D9DDE2",
    borderRadius: 10,
    backgroundColor: "#FAFBFC",
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: "#333333",
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },

  saveButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#421ddb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  invoiceButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#2E8B57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  invoiceButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  bottomBackButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#421ddb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  bottomBackButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default jobEditStyles;

