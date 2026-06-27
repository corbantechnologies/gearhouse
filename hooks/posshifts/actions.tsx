"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getPOSShifts,
  getCurrentShift,
  openShift,
  closeShift,
} from "@/services/posshifts";

export const useFetchPOSShifts = () => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["posshifts"],
    queryFn: () => getPOSShifts({ headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });
};

export const useFetchCurrentShift = () => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["currentShift"],
    queryFn: () => getCurrentShift({ headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
    retry: false, // Don't retry if 404
  });
};

export const useOpenShift = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (data: { till: string; opening_float: number }) =>
      openShift(data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      queryClient.invalidateQueries({ queryKey: ["posshifts"] });
    },
  });
};

export const useCloseShift = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (data: { closing_float: number }) =>
      closeShift(data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      queryClient.invalidateQueries({ queryKey: ["posshifts"] });
    },
  });
};
