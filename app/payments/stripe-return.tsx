import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function StripeReturnScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)/payment-logs/top-up");
    }, 300);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <ThemedView className="flex-1 items-center justify-center gap-4 bg-background-0">
      <ActivityIndicator size="large" />
      <ThemedText
        type="b2_body"
        className="text-typography-600 text-center px-10"
      >
        Redirecting back to your wallet…
      </ThemedText>
    </ThemedView>
  );
}
