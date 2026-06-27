"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import POSNavbar from "@/components/pos/Navbar";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { Loader2 } from "lucide-react";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { data: user, isLoading, isError } = useFetchAccount();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isLoading && user) {
      const isAllowed = user.is_vendor || user.is_superuser || user.is_pos_staff;
      if (!isAllowed) {
        router.push("/login");
      }
    }
  }, [status, user, isLoading, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Unable to load account</h2>
        <p className="text-muted-foreground mb-4">Please try refreshing the page or logging in again.</p>
        <button onClick={() => router.push("/login")} className="px-4 py-2 bg-[#0071E3] text-white rounded-lg">Back to Login</button>
      </div>
    );
  }

  const isAllowed = user?.is_vendor || user?.is_superuser || user?.is_pos_staff;
  if (!isAllowed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <POSNavbar />
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
