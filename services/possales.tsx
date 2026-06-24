"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface POSSaleItem {
  id: string;
  variant: string;
  product_name: string;
  variant_sku: string;
  variant_attributes: Record<string, string>;
  quantity: number;
  price: string;
  cost_price: string;
  line_total: number;
  line_profit: number;
}

export interface POSSale {
  id: string;
  reference: string;
  shop_name: string;
  served_by_name: string;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: "CASH" | "MPESA_MANUAL" | "CARD" | "OTHER";
  mpesa_reference: string | null;
  total_amount: string;
  total_profit: number;
  status: "COMPLETED" | "VOIDED";
  notes: string | null;
  sale_date: string;
  created_at: string;
  updated_at: string;
  items: POSSaleItem[];
}

export interface POSSaleReceipt {
  reference: string;
  shop_name: string;
  shop_address: string | null;
  shop_phone: string | null;
  served_by_name: string;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: string;
  mpesa_reference: string | null;
  total_amount: string;
  status: string;
  sale_date: string;
  items: POSSaleItem[];
}

export interface CreatePOSSaleItem {
  variant: string; // UUID of the variant
  quantity: number;
}

export interface CreatePOSSale {
  items: CreatePOSSaleItem[];
  payment_method: "CASH" | "MPESA_MANUAL" | "CARD" | "OTHER";
  mpesa_reference?: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  sale_date?: string;
}

export const getPOSSales = async (headers: {
  headers: { Authorization: string };
}): Promise<POSSale[]> => {
  const response: AxiosResponse<PaginatedResponse<POSSale>> =
    await apiActions.get(`/api/v1/possales/`, headers);
  return response.data.results || [];
};

export const getPOSSale = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<POSSale> => {
  const response: AxiosResponse<POSSale> = await apiActions.get(
    `/api/v1/possales/${reference}/`,
    headers,
  );
  return response.data;
};

export const createPOSSale = async (
  data: CreatePOSSale,
  headers: { headers: { Authorization: string } },
): Promise<POSSale> => {
  const response: AxiosResponse<POSSale> = await apiActions.post(
    `/api/v1/possales/`,
    data,
    headers,
  );
  return response.data;
};

export const voidPOSSale = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<{ message: string; reference: string; status: string }> => {
  const response = await apiActions.patch(
    `/api/v1/possales/${reference}/void/`,
    {},
    headers,
  );
  return response.data;
};

export const getPOSSaleReceipt = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<POSSaleReceipt> => {
  const response: AxiosResponse<POSSaleReceipt> = await apiActions.get(
    `/api/v1/possales/${reference}/receipt/`,
    headers,
  );
  return response.data;
};
