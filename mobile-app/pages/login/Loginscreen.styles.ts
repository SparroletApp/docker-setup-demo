
import { StyleSheet } from "react-native";

export const loginscreen = StyleSheet.create({
  data: {
    flex: 1,
    backgroundColor: "#EAF4FF",
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButton: {
  width: "90%",
  height: 55,
  marginTop: 20,
  backgroundColor: "#421DDB",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

loginButtonText: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "700",
},

  tab: {
    color: "#421DDB",
    fontSize: 30,
    fontWeight: "700",
  },

  image: {
    width: 100,
    height: 200,
    resizeMode: "contain",
  },

  input: {
    padding: 20,
    width: "90%",
    marginTop: 20,
    fontSize: 17,
    color: "black",
    borderColor: "#bfbfc0",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"

  },

  inputFocused: {
    borderColor: "#2563EB",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,

    elevation: 4,
  },
});
