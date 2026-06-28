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

export interface CashierPerformance {
  cashier_name: string;
  total_sales: number;
  total_revenue: number;
  average_sale_value: number;
  total_discount_given: number;
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
  const response = await apiActions.get(
    `/api/v1/possales/analytics/kpi/`,
    { ...headers, params },
  );
  const data = response.data;
  return {
    ...data,
    total_revenue: Number(data.total_revenue) || 0,
    total_profit: Number(data.total_profit) || 0,
    profit_margin: Number(data.profit_margin) || 0,
    average_order_value: Number(data.average_order_value) || 0,
    online_revenue: Number(data.online_revenue) || 0,
    pos_revenue: Number(data.pos_revenue) || 0,
  };
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

// Cashier Performance: /api/v1/possales/analytics/cashier/
export const getCashierPerformance = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<CashierPerformance[]> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/cashier/`,
    { ...headers, params },
  );
  return response.data.cashiers || [];
};
