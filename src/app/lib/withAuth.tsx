"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuth<T extends React.ComponentType<any>>(
  WrappedComponent: T
) {
  return function AuthWrapper(props: React.ComponentProps<T>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (loading) return;

      if (!user) {
        router.push("/login");
      }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return <WrappedComponent {...props} />;
  };
}
