import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

/**
 * Hook to initialize authentication when the app starts
 * This should be called in the root component or app layout
 */
export const useInitializeAuth = () => {
  const { restoreAuthentication } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await restoreAuthentication();
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [restoreAuthentication]);

  return { isInitializing };
};
