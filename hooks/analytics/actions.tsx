"use client";

import { useQuery } from "@tanstack/react-query";
import { getKPI, getSales, getCashierPerformance, AnalyticsParams } from "@/services/analytics";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useKPI = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["kpi", params],
    queryFn: () => getKPI(headers, params),
  });
};

export const useSales = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => getSales(headers, params),
  });
};

export const useCashierPerformance = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["cashierPerformance", params],
    queryFn: () => getCashierPerformance(headers, params),
  });
};
