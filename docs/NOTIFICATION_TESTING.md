# Quick Notification Testing Guide

## Current Status

✅ App is running
✅ FCM Token generated successfully
✅ Background handler registered

## Your FCM Token

```
e41sr34bek00t_Us33Xy2O:APA91bGRJQ1b070TTi1OaOyowEDGRjCVuC4Oeks43TdD2dThcdNLq4BMoxKlCWgIGXzygOd39kTMeOBPxqG4GRpHHt5bSQVLxRLsw7ddTD33qQy-ythjYig
```

## How to Test Notifications

### Option 1: Using Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com
2. Select your project
3. Navigate to: **Engage** → **Cloud Messaging**
4. Click **"Send your first message"** or **"New campaign"**
5. Enter:
   - **Notification title**: "Test Notification"
   - **Notification text**: "This is a test message"
6. Click **"Send test message"**
7. Paste your FCM token (from above)
8. Click **"Test"**

### Option 2: Using curl (For Developers)

```bash
# Replace YOUR_SERVER_KEY with your Firebase Server Key
# Get it from: Firebase Console → Project Settings → Cloud Messaging → Server key

curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "e41sr34bek00t_Us33Xy2O:APA91bGRJQ1b070TTi1OaOyowEDGRjCVuC4Oeks43TdD2dThcdNLq4BMoxKlCWgIGXzygOd39kTMeOBPxqG4GRpHHt5bSQVLxRLsw7ddTD33qQy-ythjYig",
    "notification": {
      "title": "Test Notification",
      "body": "This is a test message from curl"
    },
    "data": {
      "custom_key": "custom_value"
    }
  }'
```

## Testing Scenarios

### 1. Foreground (App is Open)

- Keep the app open
- Send a test notification
- **Expected**: You should see a local notification banner appear

### 2. Background (App is Minimized)

- Press home button to minimize the app
- Send a test notification
- **Expected**: System notification appears in notification center

### 3. Closed (App is Quit)

- Swipe up to close the app completely
- Send a test notification
- **Expected**: System notification appears
- Tap notification to open the app

## Troubleshooting

### If notifications don't appear:

**Check Console Logs**
Look for these messages:

- ✅ "FCM Token: ..." - Token generated
- ✅ "A new FCM message arrived!" - Foreground message received
- ✅ "Message handled in the background!" - Background message received

**Check Permissions**

- iOS: Settings → [Your App] → Notifications → Allow Notifications
- Android: Settings → Apps → [Your App] → Notifications → Enabled

**Common Issues**

1. **No notification in foreground**

   - Check if `onMessage` handler is working
   - Look for "A new FCM message arrived!" in logs

2. **No notification in background**

   - Check if background handler is registered
   - Look for "Message handled in the background!" in logs

3. **iOS Simulator**

   - Remember: Simulator can only show LOCAL notifications
   - For REMOTE notifications, you MUST use a real device

4. **Android not working**
   - Make sure `google-services.json` is present
   - Check if notification permissions are granted

## What to Look For

When you send a test notification, check the console for:

**Foreground (App Open):**

```
LOG  A new FCM message arrived! {"notification":{"title":"Test","body":"Message"}}
```

**Background (App Minimized/Closed):**

```
LOG  Message handled in the background! {"notification":{"title":"Test","body":"Message"}}
```

## Next Steps

1. **Test foreground notifications** (app open)
2. **Test background notifications** (app minimized)
3. **Test with app closed**
4. **Test on Android** (if not already done)
5. **Test on real iOS device** (for remote notifications)

## Notes

- The app is currently running on iOS Simulator
- iOS Simulator limitations: Can show local notifications but NOT remote push notifications
- For full iOS testing, deploy to a real device
- Android should work on both emulator and real device
