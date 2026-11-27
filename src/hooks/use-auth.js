"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "../lib/api-client";

export const useAuth = ({ redirectTo = null, redirectIfFound = false } = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const checkAuth = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data);

        if (redirectIfFound && redirectTo) {
          router.push(redirectTo);
        }
      } catch (error) {
        setUser(null);

        if (!redirectIfFound && redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);      }
    };

    checkAuth();

    return () => controller.abort();
  }, [router, redirectTo, redirectIfFound, pathname]);

  return { user, isLoading };
};