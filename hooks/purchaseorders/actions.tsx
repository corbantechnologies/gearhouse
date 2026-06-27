"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getPurchaseOrders } from "@/services/purchaseorders";

export const useFetchPurchaseOrders = () => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["purchaseorders"],
    queryFn: () => getPurchaseOrders({ headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });
};

