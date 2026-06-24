"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventory,
  getLowStock,
  getStockAdjustments,
  createStockAdjustment,
  CreateStockAdjustment,
} from "@/services/stockadjustments";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchInventory() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(headers),
  });
}

export function useFetchLowStock() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["low-stock"],
    queryFn: () => getLowStock(headers),
  });
}

export function useFetchStockAdjustments() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["stock-adjustments"],
    queryFn: () => getStockAdjustments(headers),
  });
}

export function useCreateStockAdjustment() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStockAdjustment) =>
      createStockAdjustment(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["stock-adjustments"] });
    },
  });
}
