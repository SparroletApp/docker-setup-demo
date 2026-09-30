import { StyleSheet } from "react-native";

const technicianProfileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#421DDB",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#421DDB",
  },

  scrollContent: {
    paddingBottom: 40,
    backgroundColor: "#F5F7FB",
  },

  header: {
    height: 64,
    backgroundColor: "#421DDB",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileCard: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7EAF0",
  },

  profileImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EEEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },

  profileName: {
    color: "#1D2433",
    fontSize: 20,
    fontWeight: "700",
  },

  profileId: {
    color: "#421DDB",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#20A464",
    marginRight: 7,
  },

  statusText: {
    color: "#20A464",
    fontSize: 13,
    fontWeight: "600",
  },

  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    color: "#202733",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E7EAF0",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
    paddingVertical: 10,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F0EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: "#7A8492",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 3,
  },

  infoValue: {
    color: "#202733",
    fontSize: 14,
    fontWeight: "600",
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7EAF0",
    overflow: "hidden",
  },

  actionRow: {
    minHeight: 66,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F1EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  logoutIcon: {
    backgroundColor: "#FDECEC",
  },

  actionText: {
    flex: 1,
    color: "#303846",
    fontSize: 15,
    fontWeight: "600",
  },

  logoutText: {
    color: "#D32F2F",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF0F4",
    marginLeft: 70,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 12,
    color: "#667085",
    fontSize: 14,
    fontWeight: "500",
  },

  retryButton: {
    marginTop: 18,
    backgroundColor: "#421DDB",
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default technicianProfileStyles;