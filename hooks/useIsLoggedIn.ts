import { isTokenStored } from "@/lib/auth/tokenStorage";
import { useCallback, useEffect, useRef, useState } from "react";

export const useIsLoggedIn = () => {
  const mountedRef = useRef(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    try {
      const hasToken = await isTokenStored();
      if (mountedRef.current) setIsLoggedIn(hasToken);
    } catch {
      if (mountedRef.current) setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();
    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  return { isLoggedIn, refresh };
};
