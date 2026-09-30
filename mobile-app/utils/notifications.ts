// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { Platform } from "react-native";

// import { supabase } from "../lib/supabase";


// // --------------------------------------------------
// // Notification display settings
// // --------------------------------------------------

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });


// // --------------------------------------------------
// // Register device for push notifications
// // --------------------------------------------------

// export async function registerForPushNotifications(): Promise<
//   string | null
// > {
//   try {

//     // Push notifications require a real physical device
//     if (!Device.isDevice) {

//       console.log(
//         "Push notifications require a physical device."
//       );

//       return null;
//     }


//     // ------------------------------------------------
//     // Android notification channel
//     // ------------------------------------------------

//     if (Platform.OS === "android") {

//       await Notifications.setNotificationChannelAsync(
//         "default",
//         {
//           name: "Default",
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: "#0757A0",
//         }
//       );
//     }


//     // ------------------------------------------------
//     // Check notification permission
//     // ------------------------------------------------

//     const {
//       status: existingStatus,
//     } = await Notifications.getPermissionsAsync();

//     let finalStatus = existingStatus;


//     // Ask permission if not already granted
//     if (existingStatus !== "granted") {

//       const {
//         status,
//       } = await Notifications.requestPermissionsAsync();

//       finalStatus = status;
//     }


//     // Permission denied
//     if (finalStatus !== "granted") {

//       console.log(
//         "Notification permission was not granted."
//       );

//       return null;
//     }


//     // ------------------------------------------------
//     // Get Expo project ID
//     // ------------------------------------------------

//     const projectId =
//       Constants.expoConfig?.extra?.eas?.projectId ??
//       Constants.easConfig?.projectId;


//     if (!projectId) {

//       console.log(
//         "Expo project ID not found."
//       );

//       console.log(
//         "Run: eas init"
//       );

//       return null;
//     }


//     console.log(
//       "Expo Project ID:",
//       projectId
//     );


//     // ------------------------------------------------
//     // Get Expo Push Token
//     // ------------------------------------------------

//     const token =
//       await Notifications.getExpoPushTokenAsync({
//         projectId,
//       });


//     console.log(
//       "Expo Push Token:",
//       token.data
//     );


//     return token.data;

//   } catch (error) {

//     console.error(
//       "Push notification registration error:",
//       error
//     );

//     return null;
//   }
// }


// // --------------------------------------------------
// // Register technician push token in Supabase
// // --------------------------------------------------

// export async function registerTechnicianPushToken(
//   technicianId: string
// ): Promise<boolean> {

//   try {

//     console.log(
//       "Registering notification token for technician:",
//       technicianId
//     );


//     // Get Expo push token
//     const expoPushToken =
//       await registerForPushNotifications();


//     // Token could not be generated
//     if (!expoPushToken) {

//       console.log(
//         "Expo push token was not generated."
//       );

//       return false;
//     }


//     // ------------------------------------------------
//     // Save token in Supabase
//     // ------------------------------------------------

//     const {
//       error,
//     } = await supabase
//       .from("technician_push_tokens")
//       .upsert(
//         {
//           technician_id: Number(technicianId),
//           expo_push_token: expoPushToken,
//           device_type: Platform.OS,
//           updated_at: new Date().toISOString(),
//         },
//         {
//           onConflict: "expo_push_token",
//         }
//       );


//     if (error) {

//       console.error(
//         "Saving push token error:",
//         error
//       );

//       return false;
//     }


//     console.log(
//       "Technician push token saved successfully."
//     );


//     return true;

//   } catch (error) {

//     console.error(
//       "Push token save error:",
//       error
//     );

//     return false;
//   }
// }