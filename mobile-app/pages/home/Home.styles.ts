import { StyleSheet } from "react-native";

export const home = StyleSheet.create({


  safeArea: {
    flex: 1,
    backgroundColor: "#421DDB",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F8FC",
  },


  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F8FC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },


  header: {
    backgroundColor: "#421DDB",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerLeft: {
    flex: 1,
    paddingRight: 15,
  },

  greeting: {
    fontSize: 13,
    color: "#D9EAF8",
    marginBottom: 2,
  },

  technicianName: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  role: {
    fontSize: 11,
    color: "#D9EAF8",
    marginTop: 2,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 7,
    right: 7,

    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: "#FF5252",
  },

  profileCircle: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 25,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,

    minHeight: 82,

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    paddingHorizontal: 10,
    paddingVertical: 11,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  statIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 7,
  },

  todayIcon: {
    backgroundColor: "#F0ECFF",
  },

  completedIcon: {
    backgroundColor: "#E5F7ED",
  },

  pendingIcon: {
    backgroundColor: "#FFF3DD",
  },

  statContent: {
    flex: 1,
  },

  statNumber: {
    fontSize: 21,
    fontWeight: "700",
    color: "#421DDB",
  },

  completedNumber: {
    color: "#159447",
  },

  pendingNumber: {
    color: "#D98200",
  },

  statTitle: {
    fontSize: 9,
    color: "#666666",
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#17324D",
  },

  sectionSubtitle: {
    fontSize: 10,
    color: "#8A929C",
    marginTop: 3,
  },

  viewAll: {
    fontSize: 11,
    fontWeight: "700",
    color: "#421DDB",
  },

  tabsContainer: {
    flexDirection: "row",

    backgroundColor: "#EDEFF5",

    borderRadius: 13,

    padding: 4,

    marginBottom: 13,
  },

  tab: {
    flex: 1,

    minHeight: 44,

    borderRadius: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 7,

    gap: 6,
  },

  activeTab: {
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 4,

    elevation: 2,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777777",
  },

  activeTabText: {
    color: "#421DDB",
    fontWeight: "700",
  },

  tabCount: {
    minWidth: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: "#E3E5EA",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 5,
  },

  activeTabCount: {
    backgroundColor: "#F0ECFF",
  },

  tabCountText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#777777",
  },

  activeTabCountText: {
    color: "#421DDB",
  },

  jobsContainer: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  jobCard: {
    minHeight: 91,

    paddingHorizontal: 12,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  lastJobCard: {
    borderBottomWidth: 0,
  },

  jobStatusLine: {
    width: 3,
    height: 55,

    borderRadius: 3,

    backgroundColor: "#421DDB",

    marginRight: 11,
  },

  completedLine: {
    backgroundColor: "#20A464",
  },

  progressLine: {
    backgroundColor: "#421DDB",
  },

  unassignedLine: {
    backgroundColor: "#D98200",
  },

  jobInfo: {
    flex: 1,
    minWidth: 0,

    paddingRight: 7,
  },

  jobTopRow: {
    flexDirection: "row",
    alignItems: "center",

    minWidth: 0,
  },

  jobId: {
    flexShrink: 1,

    fontSize: 11,
    fontWeight: "700",
    color: "#17324D",
  },

  customerName: {
    fontSize: 10.5,
    color: "#555555",
    marginTop: 3,
  },

  jobTitle: {
    fontSize: 12,
    color: "#333333",

    marginTop: 3,

    fontWeight: "500",
  },

  jobMetaRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    marginTop: 5,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  jobTime: {
    fontSize: 9.5,
    color: "#777777",
  },

  unassignedSmallBadge: {
    marginLeft: 7,

    paddingHorizontal: 6,
    paddingVertical: 2,

    borderRadius: 5,

    backgroundColor: "#FFF0D7",
  },

  unassignedSmallText: {
    fontSize: 7,
    fontWeight: "800",
    color: "#D98200",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,

    marginLeft: 4,
  },

  statusText: {
    fontSize: 8.5,
    fontWeight: "600",
  },

  assignedBadge: {
    backgroundColor: "#DCEEFF",
  },

  assignedText: {
    color: "#421DDB",
  },

  acceptedBadge: {
    backgroundColor: "#DDF5E6",
  },

  acceptedText: {
    color: "#159447",
  },

  pendingBadge: {
    backgroundColor: "#FFF0D7",
  },

  pendingText: {
    color: "#D98200",
  },

  progressBadge: {
    backgroundColor: "#F0ECFF",
  },

  progressText: {
    color: "#421DDB",
  },

  completedBadge: {
    backgroundColor: "#DDF5E6",
  },

  completedText: {
    color: "#159447",
  },

  cancelledBadge: {
    backgroundColor: "#FDE5E5",
  },

  cancelledText: {
    color: "#D83A3A",
  },

  emptyJobs: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    minHeight: 210,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,

    elevation: 2,
  },

  emptyIcon: {
    width: 68,
    height: 68,

    borderRadius: 34,

    backgroundColor: "#F0ECFF",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#421DDB",
  },

  emptyDescription: {
    fontSize: 11,
    color: "#888888",

    textAlign: "center",

    marginTop: 6,

    lineHeight: 17,
  },
  bottomNav: {
    height: 67,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E8EDF2",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 8,
  },

  navItem: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 8.5,
    color: "#777777",

    marginTop: 4,
  },

  navActiveText: {
    fontSize: 8.5,
    color: "#421DDB",

    fontWeight: "700",

    marginTop: 4,
  },
});