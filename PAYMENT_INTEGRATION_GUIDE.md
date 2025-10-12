# Payment Gateway Integration Guide

This guide explains how to use Stripe and Paystack payment SDKs in your Expo React Native app.

## 📦 Installed Packages

The following payment SDKs have been installed:

- **@stripe/stripe-react-native** - Official Stripe SDK for React Native (Expo compatible)
- **react-native-paystack-webview** - Paystack payment gateway for React Native

## 🔧 Configuration

### 1. App Configuration (app.json)

The following permissions have been added to support payment SDKs:

**iOS:**

```json
"ios": {
  "infoPlist": {
    "NSCameraUsageDescription": "This app uses the camera to scan payment cards.",
    "NSPhotoLibraryUsageDescription": "This app accesses your photo library for payment purposes."
  }
}
```

**Android:**

```json
"android": {
  "permissions": [
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE"
  ]
}
```

### 2. Environment Variables

Create a `.env` file in the root directory with your API keys:

```bash
# Stripe publishable key (starts with pk_test_ or pk_live_)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Apple Pay merchant identifier (for enabling Apple Pay with Stripe)
EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER=merchant.com.yourcompany.app

# Paystack public key (starts with pk_test_ or pk_live_)
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
```

**Important:**

- In Expo, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in your app
- Never commit your `.env` file to version control
- Use `.env.example` as a template for other developers

### 3. Provider Setup

Both the `StripeProvider` and the new `PaystackProvider` wrap the app in `app/_layout.tsx`:

```tsx
import { StripeProvider } from "@stripe/stripe-react-native";
import { PaystackProvider } from "react-native-paystack-webview";

// In your root component
<PaystackProvider publicKey={PAYSTACK_PUBLIC_KEY} currency="NGN">
  <StripeProvider
    publishableKey={STRIPE_PUBLISHABLE_KEY}
    merchantIdentifier={STRIPE_MERCHANT_IDENTIFIER}
  >
    <AppContent />
  </StripeProvider>
</PaystackProvider>;
```

## 💳 Usage

### Stripe Payment

The Stripe SDK is already configured. Here's how it works in `top-up.tsx`:

```tsx
import { useStripe } from "@stripe/stripe-react-native";

// Inside your component
const stripe = useStripe();

// Initialize payment
const { error: initError } = await stripe.initPaymentSheet({
  paymentIntentClientSecret: clientSecret,
  merchantDisplayName: "Your App Name",
  defaultBillingDetails: {
    name: "Customer Name",
  },
});

// Present payment sheet
const { error: presentError } = await stripe.presentPaymentSheet();
```

### Paystack Payment

Paystack now uses the provider + hook pattern:

```tsx
import { usePaystack } from "react-native-paystack-webview";

const { popup } = usePaystack();

const openPaystack = () => {
  const params: any = {
    email: userEmail,
    amount: amountInNaira,
    reference,
    metadata: {
      custom_fields: [
        {
          display_name: customerName,
          variable_name: "top_up_reference",
          value: reference,
        },
      ],
      accessCode,
    },
    onSuccess: ({ reference }) => verifyPayment(amountInNaira, reference),
    onCancel: () => showToast("Payment cancelled"),
    onError: (err) => showToast(err.message ?? "Payment failed"),
  };

  if (accessCode) {
    params.access_code = accessCode;
    popup.newTransaction?.(params) ?? popup.checkout(params);
  } else {
    popup.checkout(params);
  }
};
```

> **Troubleshooting:** If the Paystack modal shows only a spinner, confirm that you are supplying a valid customer email and, when using a server-generated access code, pass it as `access_code` (the new integration above handles this automatically). In development, the provider logs helpful diagnostics when `debug={true}`.

## 🚀 Getting Started

### Step 1: Get API Keys

**Stripe:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Add it to your `.env` file

**Paystack:**

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
2. Copy your **Public key** (starts with `pk_test_` for test mode)
3. Add it to your `.env` file

### Step 2: Update Environment Variables

Edit `.env` file with your actual keys:

```bash
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

### Step 3: Rebuild Your App

After adding environment variables, restart your Expo development server:

```bash
# Clear cache and restart
npm start -- --clear

# Or for specific platforms
npm run ios -- --clear
npm run android -- --clear
```

## 📱 Testing

### Test Cards

**Stripe Test Cards:**

- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

**Paystack Test Cards:**

- Success: `5060 6666 6666 6666 6666` (Verve)
- Success: `4084 0840 8408 4081` (Visa)

**All test cards:**

- CVV: Any 3 digits
- Expiry: Any future date
- PIN (Paystack): `1234`

## 🔐 Security Notes

1. **Never expose secret keys** - Only use publishable keys in your app
2. **Server-side verification** - Always verify payments on your backend
3. **Environment variables** - Keep API keys in `.env` files (not in code)
4. **Production keys** - Switch to live keys only when ready for production

## 🐛 Troubleshooting

### Stripe Issues

**Error: "Stripe provider not found"**

- Make sure `StripeProvider` wraps your app in `app/_layout.tsx`
- Check that the publishable key is correctly set

**Payment sheet not opening**

- Ensure you have a valid `clientSecret` from your backend
- Check that the `initPaymentSheet` call succeeded

### Paystack Issues

**WebView not showing**

- Make sure you have a valid `accessCode` from your backend
- Check that `autoStart` is set to `true`

**Payment not completing**

- Verify your Paystack public key is correct
- Check the amount is in the correct format (kobo for NGN)

### Environment Variables Not Working

- Ensure variables are prefixed with `EXPO_PUBLIC_`
- Restart your development server after changing `.env`
- Clear cache: `npm start -- --clear`

## 📚 Additional Resources

- [Stripe React Native Docs](https://stripe.com/docs/payments/accept-a-payment?platform=react-native)
- [Paystack React Native Docs](https://paystack.com/docs/payments/accept-payments#react-native)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

## 🎉 Next Steps

1. Replace placeholder keys in `.env` with your actual test keys
2. Test both payment methods with test cards
3. Customize the payment flow to match your app's design
4. Add proper error handling and user feedback
5. Integrate with your backend for payment verification
6. Switch to production keys when ready to go live

---

**Note:** This integration uses test mode by default. Always test thoroughly before switching to production keys.
