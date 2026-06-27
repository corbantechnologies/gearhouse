"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getWalkInCustomers,
  lookupWalkInCustomer,
  createWalkInCustomer,
  updateWalkInCustomer,
  getLoyaltyHistory,
  adjustLoyaltyPoints,
} from "@/services/walkincustomers";

export const useFetchWalkInCustomers = (search: string = "") => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["walkincustomers", search],
    queryFn: () => getWalkInCustomers(search, { headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });
};

export const useLookupCustomer = (phone: string) => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["customerLookup", phone],
    queryFn: () => lookupWalkInCustomer(phone, { headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token && !!phone && phone.length >= 9,
    retry: false,
  });
};

export const useCreateWalkInCustomer = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (data: Parameters<typeof createWalkInCustomer>[0]) =>
      createWalkInCustomer(data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walkincustomers"] });
    },
  });
};

export const useUpdateWalkInCustomer = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateWalkInCustomer>[1] }) =>
      updateWalkInCustomer(id, data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walkincustomers"] });
    },
  });
};

export const useFetchLoyaltyHistory = (customerId: string) => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["loyaltyHistory", customerId],
    queryFn: () => getLoyaltyHistory(customerId, { headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token && !!customerId,
  });
};

export const useAdjustLoyaltyPoints = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: Parameters<typeof adjustLoyaltyPoints>[1] }) =>
      adjustLoyaltyPoints(customerId, data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["walkincustomers"] });
      queryClient.invalidateQueries({ queryKey: ["loyaltyHistory", variables.customerId] });
    },
  });
};
