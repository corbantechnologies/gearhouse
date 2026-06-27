"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPOSBundles,
  getPOSBundle,
} from "@/services/posbundles";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useFetchPOSBundles = (activeOnly: boolean = false) => {
  const header = useAxiosAuth()

  return useQuery({
    queryKey: ["posbundles", activeOnly],
    queryFn: () => getPOSBundles(activeOnly, header),
    enabled: !!header,
  });
};

export const useFetchPOSBundle = (id: string) => {
  const header = useAxiosAuth()

  return useQuery({
    queryKey: ["posbundles", id],
    queryFn: () => getPOSBundle(id, header),
    enabled: !!header && !!id,
  });
};