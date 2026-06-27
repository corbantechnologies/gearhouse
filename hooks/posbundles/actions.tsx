"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getPOSBundles,
  createPOSBundle,
  updatePOSBundle,
  deletePOSBundle,
} from "@/services/posbundles";

export const useFetchPOSBundles = (activeOnly: boolean = false) => {
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useQuery({
    queryKey: ["posbundles", activeOnly],
    queryFn: () => getPOSBundles(activeOnly, { headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });
};

export const useCreatePOSBundle = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (data: FormData) =>
      createPOSBundle(data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posbundles"] });
    },
  });
};

export const useUpdatePOSBundle = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updatePOSBundle(id, data, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posbundles"] });
    },
  });
};

export const useDeletePOSBundle = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  return useMutation({
    mutationFn: (id: string) =>
      deletePOSBundle(id, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posbundles"] });
    },
  });
};
