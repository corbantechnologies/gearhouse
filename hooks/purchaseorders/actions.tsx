"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} from "@/services/purchaseorders";

export const useFetchPurchaseOrders = () => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["purchaseorders"],
    queryFn: () => getPurchaseOrders({ headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (data: Parameters<typeof createPurchaseOrder>[0]) =>
      createPurchaseOrder(data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseorders"] });
    },
  });
};

export const useUpdatePurchaseOrderStatus = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: ({ reference, status }: { reference: string; status: "ORDERED" | "RECEIVED" | "CANCELLED" }) =>
      updatePurchaseOrderStatus(reference, status, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseorders"] });
      // Updating status to received affects inventory, so invalidate stock adjustments
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
