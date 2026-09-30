import { StyleSheet } from "react-native";

export const layoutStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
  },

  bottomAction: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  safeBottom: {
    backgroundColor: "#FFFFFF",
  },

  bottomNav: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8ECF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    marginTop: 4,
    fontSize: 12,
    color: "#8A96A3",
  },

  navTextActive: {
    color: "#421ddb",
    fontWeight: "600",
  },

});