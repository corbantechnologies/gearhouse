"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { POSTill } from "./postills";

export interface POSShift {
  id: string;
  cashier_name: string;
  till: POSTill;
  opening_time: string;
  closing_time: string | null;
  opening_float: string;
  expected_cash: string;
  closing_float: string | null;
  discrepancy: string | null;
  status: "OPEN" | "CLOSED";
}

export const getPOSShifts = async (headers: {
  headers: { Authorization: string };
}): Promise<POSShift[]> => {
  const response: AxiosResponse<PaginatedResponse<POSShift>> =
    await apiActions.get(`/api/v1/posshifts/`, headers);
  return response.data.results || [];
};

export const getCurrentShift = async (headers: {
  headers: { Authorization: string };
}): Promise<POSShift | null> => {
  try {
    const response: AxiosResponse<POSShift> = await apiActions.get(
      `/api/v1/posshifts/current/`,
      headers
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const openShift = async (
  data: { till: string; opening_float: number },
  headers: { headers: { Authorization: string } }
): Promise<POSShift> => {
  const response: AxiosResponse<POSShift> = await apiActions.post(
    `/api/v1/posshifts/open/`,
    data,
    headers
  );
  return response.data;
};

export const closeShift = async (
  data: { closing_float: number },
  headers: { headers: { Authorization: string } }
): Promise<POSShift> => {
  const response: AxiosResponse<POSShift> = await apiActions.post(
    `/api/v1/posshifts/close/`,
    data,
    headers
  );
  return response.data;
};
