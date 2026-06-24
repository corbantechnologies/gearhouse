"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface KPI {
  // Combined
  total_revenue: number;
  total_profit: number;
  profit_margin: number;
  total_orders: number;
  items_sold: number;
  average_order_value: number;
  // Breakdown
  online_revenue: number;
  online_orders: number;
  online_items_sold: number;
  pos_revenue: number;
  pos_sales: number;
  pos_items_sold: number;
}

export interface Sales {
  date: string;
  total_revenue: number;
  online_revenue: number;
  pos_revenue: number;
  online_orders: number;
  pos_sales: number;
}

export interface AnalyticsParams {
  start_date?: string;
  end_date?: string;
  group_by?: string;
  days?: number;
}

// Combined KPI: /api/v1/possales/analytics/kpi/
export const getKPI = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<KPI> => {
  const response: AxiosResponse<KPI> = await apiActions.get(
    `/api/v1/possales/analytics/kpi/`,
    { ...headers, params },
  );
  return response.data;
};

// Combined chart: /api/v1/possales/analytics/sales-chart/
export const getSales = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<Sales[]> => {
  const response: AxiosResponse<Sales[]> = await apiActions.get(
    `/api/v1/possales/analytics/sales-chart/`,
    { ...headers, params },
  );
  return response.data;
};
