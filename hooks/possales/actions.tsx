"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPOSSales,
  getPOSSale,
  createPOSSale,
  voidPOSSale,
  holdPOSSale,
  resumePOSSale,
  getPOSSaleReceipt,
  sendPOSSaleReceiptEmail,
  triggerMpesaSTKPush,
  searchPOSProducts,
  lookupPOSSku,
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

export function useFetchPOSSale(reference: string, pollInterval?: number) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sale", reference],
    queryFn: () => getPOSSale(reference, headers),
    enabled: !!reference,
    refetchInterval: pollInterval,
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
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
    },
  });
}

export function useHoldPOSSale() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => holdPOSSale(reference, headers),
    onSuccess: (_, reference) => {
      queryClient.invalidateQueries({ queryKey: ["pos-sales"] });
      queryClient.invalidateQueries({ queryKey: ["pos-sale", reference] });
    },
  });
}

export function useResumePOSSale() {
  const headers = useAxiosAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => resumePOSSale(reference, headers),
    onSuccess: (_, reference) => {
      queryClient.invalidateQueries({ queryKey: ["pos-sales"] });
      queryClient.invalidateQueries({ queryKey: ["pos-sale", reference] });
    },
  });
}

export function useSendPOSReceiptEmail() {
  const headers = useAxiosAuth();
  return useMutation({
    mutationFn: ({ reference, email }: { reference: string; email?: string }) =>
      sendPOSSaleReceiptEmail(reference, email, headers),
  });
}

export function useTriggerMpesaSTK() {
  const headers = useAxiosAuth();
  return useMutation({
    mutationFn: ({ reference, phone }: { reference: string; phone: string }) =>
      triggerMpesaSTKPush(reference, phone, headers),
  });
}

export function useFetchPOSProducts(search: string = "", inStockOnly: boolean = false) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-products", search, inStockOnly],
    queryFn: () => searchPOSProducts(search, inStockOnly, headers),
  });
}

export function useLookupPOSSku(sku: string) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sku", sku],
    queryFn: () => lookupPOSSku(sku, headers),
    enabled: !!sku && sku.length >= 3,
    retry: false,
  });
}
