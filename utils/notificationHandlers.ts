import notifee, { EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

// Handle notification interactions (when user taps on notification)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log("Background notification event:", type, detail);

  if (type === EventType.PRESS) {
    console.log("User pressed notification:", detail.notification);
    // Handle navigation or other actions here
  }
});

// Handle initial notification (when app is opened from a notification)
export async function getInitialNotification() {
  const initialNotification = await notifee.getInitialNotification();

  if (initialNotification) {
    console.log("App opened from notification:", initialNotification);
    // Handle navigation or other actions here
  }

  return initialNotification;
}

// Handle FCM initial notification
export async function getFCMInitialNotification() {
  const remoteMessage = await messaging().getInitialNotification();

  if (remoteMessage) {
    console.log("App opened from FCM notification:", remoteMessage);
    // Handle navigation or other actions here
  }

  return remoteMessage;
}
