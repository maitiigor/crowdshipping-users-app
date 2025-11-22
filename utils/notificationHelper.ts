import notifee, { AndroidImportance } from "@notifee/react-native";

export async function displayLocalNotification(
  title: string,
  body: string,
  data?: any
) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
  });
}
