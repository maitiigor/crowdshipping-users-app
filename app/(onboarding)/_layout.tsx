import { useAuthSelectors } from "@/lib/useAuth";
import { Redirect, Stack, usePathname } from "expo-router";
import React from "react";

const OnboardingLayout = () => {
  const { isAuthenticated } = useAuthSelectors();
  const pathname = usePathname();
  console.log("🚀 ~ OnboardingLayout ~ pathname:", pathname)
  // Public pages that should be reachable even when authenticated
  const allowlist = new Set<string>([
    "/terms-of-service",
    "/privacy-policy",
    "/user-profile-setup",
  ]);

  if (isAuthenticated && !allowlist.has(pathname)) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack />;
};

export default OnboardingLayout;
