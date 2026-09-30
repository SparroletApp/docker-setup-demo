import { StyleSheet } from "react-native";

export const otpscreen = StyleSheet.create({

  data: {
    flexGrow: 1,
    backgroundColor: "#EAF4FF",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },

  safeArea: {
  backgroundColor: "#FFFFFF",
},

header: {
  height: 56,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  backgroundColor: "#FFFFFF",
  borderBottomWidth: 1,
  borderBottomColor: "#E5E5E5",
},

backButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
},

backButtonText: {
  fontSize: 38,
  color: "#421DDB",
  fontWeight: "300",
  lineHeight: 40,
},

headerTitle: {
  fontSize: 18,
  fontWeight: "600",
  color: "#421DDB",
  marginLeft: 8,
},

  title: {
    color: "#421DDB",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },

  description: {
    color: "#555",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    width: "90%",
    height: 55,
    paddingHorizontal: 20,
    fontSize: 20,
    color: "#000",
    backgroundColor: "#FFFFFF",
    borderColor: "#bfbfc0",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    letterSpacing: 5,
  },

  verifyButton: {
    width: "90%",
    height: 55,
    marginTop: 20,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

});