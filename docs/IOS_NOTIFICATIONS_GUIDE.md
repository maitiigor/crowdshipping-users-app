# iOS Push Notification Setup - Complete Guide

## What We Fixed

### 1. **iOS Device Registration**

- Added `messaging().registerDeviceForRemoteMessages()` before requesting FCM token
- This registers the device with Apple Push Notification service (APNs)

### 2. **APNs Entitlements**

- Added `"aps-environment": "development"` to `app.json`
- This authorizes the app to receive push notifications in development mode

### 3. **iOS Notification Configuration**

- Updated `notificationHelper.ts` to include iOS-specific settings:
  - Sound enabled
  - Alert enabled
  - Badge enabled
  - Foreground presentation options

### 4. **Background Message Handler**

- Created `utils/backgroundMessaging.ts` to handle notifications when app is:
  - In the background
  - Completely closed/quit
- This is REQUIRED for iOS notifications to work properly

### 5. **Entry Point Configuration**

- Created `index.js` to register background handler before app starts
- Updated `package.json` to use this new entry point

## How to Test iOS Notifications

### Testing Foreground Notifications (App is Open)

1. Open the app on iOS simulator/device
2. Send a test notification from Firebase Console or your backend
3. The notification should appear as a local notification using Notifee

### Testing Background Notifications (App is Minimized)

1. Open the app, then press home button to minimize it
2. Send a test notification
3. You should see a banner notification at the top of the screen
4. Tap it to open the app

### Testing Notifications When App is Closed

1. Completely close the app (swipe up from app switcher)
2. Send a test notification
3. You should receive the notification
4. Tap it to launch the app

## Important Notes for iOS

### Development vs Production

- Currently using `"aps-environment": "development"`
- For production builds, change to `"aps-environment": "production"`
- You'll also need to configure APNs certificates in Firebase Console

### iOS Simulator Limitations

- **iOS Simulator CANNOT receive remote push notifications**
- You MUST test on a real iOS device for actual FCM notifications
- The simulator can show local notifications (Notifee) but not remote ones

### Testing on Real Device

1. Connect your iPhone via USB
2. Run: `npx expo run:ios --device`
3. Select your device from the list
4. The app will build and install on your physical device
5. Send a test notification from Firebase Console

### Firebase Console Test Message

1. Go to Firebase Console → Cloud Messaging
2. Click "Send test message"
3. Enter your FCM token (check console logs)
4. Send the notification

## Troubleshooting

### Not Receiving Notifications on iOS?

**Check 1: Permissions**

- Go to Settings → [Your App] → Notifications
- Ensure "Allow Notifications" is enabled

**Check 2: FCM Token**

- Check console logs for "FCM Token: ..."
- Make sure the token is being generated

**Check 3: Device Registration**

- Look for "Registered for remote messages" in logs
- If you see errors, check APNs configuration

**Check 4: Background Handler**

- Ensure `index.js` is being loaded first
- Check that `backgroundMessaging.ts` is imported

**Check 5: Real Device**

- Remember: iOS Simulator cannot receive remote push notifications
- Always test on a real device for FCM

### Common Issues

**Issue**: "No APNs token"
**Solution**: Make sure you're testing on a real device, not simulator

**Issue**: Notifications work on Android but not iOS
**Solution**: Verify APNs certificates are configured in Firebase Console

**Issue**: App crashes when receiving notification
**Solution**: Check that Notifee is properly installed and configured

## Files Modified/Created

1. ✅ `hooks/useFCM.ts` - Added iOS device registration
2. ✅ `utils/notificationHelper.ts` - Added iOS notification config
3. ✅ `utils/backgroundMessaging.ts` - NEW: Background handler
4. ✅ `utils/notificationHandlers.ts` - NEW: Notification event handlers
5. ✅ `index.js` - NEW: Custom entry point
6. ✅ `app.json` - Added APNs entitlements
7. ✅ `package.json` - Updated main entry point

## Next Steps

1. **Test on a real iOS device** (simulator won't work for remote notifications)
2. **Configure APNs in Firebase Console** for production
3. **Handle notification taps** to navigate to specific screens
4. **Customize notification appearance** (icons, colors, etc.)
5. **Add notification categories** for actionable notifications
