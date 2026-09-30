
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#F8F9FF",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666666",
  },

  emptyScreen: {
    flex: 1,
    backgroundColor: "#F8F9FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  emptyTitle: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
  },

  header: {
    height: 105,
    backgroundColor: "#421DDB",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  headerBackButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  headerRight: {
    width: 40,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 45,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7E9F0",
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F1EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F4",
  },

  detailLabel: {
    width: 115,
    fontSize: 13,
    color: "#777777",
  },

  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
    fontWeight: "600",
    textAlign: "right",
  },

  completedBadge: {
    backgroundColor: "#EAF7EF",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: "auto",
  },

  completedBadgeText: {
    color: "#2E8B57",
    fontSize: 11,
    fontWeight: "700",
  },

  inputLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "600",
    marginBottom: 7,
  },

  helperText: {
    marginTop: 9,
    color: "#777777",
    fontSize: 12,
    lineHeight: 18,
  },

  dropdown: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#DDE1E7",
    borderRadius: 10,
    paddingHorizontal: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    flex: 1,
    color: "#222222",
    fontSize: 14,
    fontWeight: "600",
  },

  dropdownPlaceholder: {
    color: "#A0A6AD",
    fontWeight: "400",
  },

  dropdownList: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  dropdownItem: {
    minHeight: 48,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F4",
  },

  dropdownItemText: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
    fontWeight: "500",
  },

  emptyDropdownText: {
    padding: 15,
    color: "#777777",
    fontSize: 13,
    textAlign: "center",
  },

  infoBox: {
    minHeight: 55,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#F6F7FA",
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    color: "#777777",
    lineHeight: 18,
  },

  addPartButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#421DDB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  addPartButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 7,
  },

  addPartChevron: {
    position: "absolute",
    right: 14,
  },

  partDropdownList: {
    borderWidth: 1,
    borderColor: "#E0E3E8",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    overflow: "hidden",
  },

  partDropdownItem: {
    minHeight: 58,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F4",
  },

  partDropdownInfo: {
    flex: 1,
    paddingRight: 10,
  },

  partDropdownName: {
    fontSize: 14,
    color: "#222222",
    fontWeight: "700",
  },

  partDropdownNumber: {
    fontSize: 11,
    color: "#777777",
    marginTop: 3,
  },

  partDropdownPrice: {
    fontSize: 13,
    color: "#421DDB",
    fontWeight: "700",
  },

  noPartsContainer: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  noPartsText: {
    marginTop: 8,
    color: "#888888",
    fontSize: 13,
  },

  partCard: {
    borderWidth: 1,
    borderColor: "#E4E6EC",
    borderRadius: 13,
    padding: 13,
    marginBottom: 12,
  },

  partHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  partIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F1EDFF",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#777777",
    marginTop: 3,
  },

  removePartButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F1",
    marginLeft: 8,
  },

  partInputsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  partInputContainer: {
    flex: 1,
  },

  lineTotalContainer: {
    flex: 1,
  },

  numberInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#DDE1E7",
    borderRadius: 9,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },

  lineTotal: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E7E9EE",
    borderRadius: 9,
    paddingHorizontal: 9,
    textAlignVertical: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#222222",
    backgroundColor: "#F8F9FC",
  },

  partsTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E8E9EE",
    marginTop: 4,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  partsTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
  },

  partsTotalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#421DDB",
  },

  currencyInputWrapper: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDE1E7",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  currencySymbol: {
    fontSize: 17,
    fontWeight: "700",
    color: "#555555",
    marginLeft: 14,
  },

  currencyInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#222222",
  },

  paymentMethodLabel: {
    marginTop: 18,
  },

  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7E9F0",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },

  totalLabel: {
    fontSize: 14,
    color: "#666666",
  },

  totalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },

  grandTotalDivider: {
    height: 1,
    backgroundColor: "#E4E6EA",
    marginVertical: 8,
  },

  grandTotalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222222",
  },

  grandTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#421DDB",
  },

  createButton: {
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: "#421DDB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginBottom: 12,
  },

  createButtonDisabled: {
    opacity: 0.65,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  backButton: {
    backgroundColor: "#421DDB",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 7,
  },

  bottomBackButton: {
    backgroundColor: "#777777",
    minHeight: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  bottomBackButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 7,
  },
});

export default styles;
