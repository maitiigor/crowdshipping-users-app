import notifee, { AndroidImportance } from "@notifee/react-native";

export async function displayLocalNotification(
  title: string,
  body: string,
  data?: any
) {
  console.log("📱 Displaying local notification:", { title, body, data });

  try {
    // Request permissions (required for iOS)
    const permission = await notifee.requestPermission();
    console.log("📱 Notification permission:", permission);

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });
    console.log("📱 Created channel:", channelId);

    // Display a notification
    const notificationId = await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
        pressAction: {
          id: "default",
        },
      },
      ios: {
        sound: "default",
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });

    console.log("📱 Notification displayed successfully:", notificationId);
  } catch (error) {
    console.error("📱 Error displaying notification:", error);
  }
}
