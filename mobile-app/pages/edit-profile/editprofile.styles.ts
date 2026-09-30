import { StyleSheet } from "react-native";

const editProfileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },

  /*
   * HEADER
   */
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#421DDB",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerSpacer: {
    width: 42,
  },

  /*
   * SCROLL
   */
  scrollContent: {
    padding: 18,
    paddingBottom: 50,
  },

  /*
   * LOADING
   */
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F8F9FF",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 18,
    minWidth: 110,
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#421DDB",
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /*
   * PROFILE HEADER
   */
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F1EDFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileHeaderInfo: {
    flex: 1,
    marginLeft: 16,
    minWidth: 0,
  },

  profileName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222222",
  },

  profileId: {
    marginTop: 5,
    fontSize: 14,
    color: "#777777",
  },

  profileStatus: {
    marginTop: 7,
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "600",
    color: "#421DDB",
  },

  /*
   * SECTIONS
   */
  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 10,
  },

  /*
   * FORM CARD
   */
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  fieldContainer: {
    marginBottom: 17,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555555",
    marginBottom: 7,
  },

  inputWrapper: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  fieldIcon: {
    width: 46,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 10,
    paddingRight: 14,
    fontSize: 15,
    color: "#222222",
  },

  /*
   * LICENSE
   */
  addLicenseButton: {
    width: 44,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#EEEEEE",
  },

  licenseList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },

  licenseChip: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1EDFF",
    borderWidth: 1,
    borderColor: "#D9D0FF",
  },

  licenseChipText: {
    flexShrink: 1,
    marginRight: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#421DDB",
  },

  /*
   * READ ONLY
   */
  readOnlyRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  readOnlyContent: {
    flex: 1,
    paddingVertical: 8,
  },

  readOnlyValue: {
    marginTop: 3,
    fontSize: 15,
    color: "#888888",
  },

  /*
   * SAVE
   */
  saveButton: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#421DDB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /*
   * CANCEL
   */
  cancelButton: {
    height: 50,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555555",
  },
});

export default editProfileStyles;