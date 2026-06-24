"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPOSSales,
  getPOSSale,
  createPOSSale,
  voidPOSSale,
  getPOSSaleReceipt,
  CreatePOSSale,
} from "@/services/possales";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchPOSSales() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sales"],
    queryFn: () => getPOSSales(headers),
  });
}

export function useFetchPOSSale(reference: string) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sale", reference],
    queryFn: () => getPOSSale(reference, headers),
    enabled: !!reference,
  });
}

export function useFetchPOSSaleReceipt(reference: string) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sale-receipt", reference],
    queryFn: () => getPOSSaleReceipt(reference, headers),
    enabled: !!reference,
  });
}

export function useCreatePOSSale() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePOSSale) => createPOSSale(data, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos-sales"] });
      // Also invalidate inventory since stock changes
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useVoidPOSSale() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => voidPOSSale(reference, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos-sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}
