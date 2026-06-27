"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getPOSTills,
  createPOSTill,
  updatePOSTill,
  deletePOSTill,
} from "@/services/postills";

export const useFetchPOSTills = () => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["postills"],
    queryFn: () => getPOSTills({ headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });
};

export const useCreatePOSTill = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (data: { name: string }) =>
      createPOSTill(data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postills"] });
    },
  });
};

export const useUpdatePOSTill = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }) =>
      updatePOSTill(id, data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postills"] });
    },
  });
};

export const useDeletePOSTill = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (id: string) =>
      deletePOSTill(id, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postills"] });
    },
  });
};
