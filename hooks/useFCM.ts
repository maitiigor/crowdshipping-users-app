import { displayLocalNotification } from "@/utils/notificationHelper";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export function useFCM() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const requestUserPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
        }
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        setPermissionGranted(enabled);
      }
    };

    requestUserPermission();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const getToken = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        await messaging().setAutoInitEnabled(true);
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        setFcmToken(token);
      } catch (error) {
        console.error("Failed to get FCM token:", error);
      }
    };

    getToken();

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      console.log("FCM Token Refreshed:", token);
      setFcmToken(token);
    });
  }, [permissionGranted]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));

      await displayLocalNotification(
        remoteMessage.notification?.title || "New Notification",
        remoteMessage.notification?.body || "You have a new message",
        remoteMessage.data
      );
    });

    return unsubscribe;
  }, []);

  return { fcmToken, permissionGranted };
}
