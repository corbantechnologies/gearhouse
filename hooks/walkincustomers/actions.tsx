"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getWalkInCustomers,
  lookupWalkInCustomer,
  getLoyaltyHistory,
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

export const useFetchLoyaltyHistory = (customerId: string) => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["loyaltyHistory", customerId],
    queryFn: () => getLoyaltyHistory(customerId, { headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token && !!customerId,
  });
};

