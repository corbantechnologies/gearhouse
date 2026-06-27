"use client";

import { useQuery } from "@tanstack/react-query";

import {
    getAccount,
    getPOSStaffList,
    createPOSStaff,
    getPOSStaff,
    updatePOSStaff,
    deactivatePOSStaff,
    CreatePOSStaff,
    UpdatePOSStaff,
} from "@/services/accounts";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserCode from "../authentication/useUserCode";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export function useFetchAccount() {
    const usercode = useUserCode();
    const header = useAxiosAuth();

    return useQuery({
        queryKey: ["account", usercode],
        queryFn: () => getAccount(usercode!, header),
        enabled: !!usercode,
    });
}

// ─── POS Staff Management Hooks ─────────────────────────────────────────────

export function useFetchPOSStaffList() {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["posStaffList"],
        queryFn: () => getPOSStaffList(header),
    });
}

export function useFetchPOSStaff(staffUsercode: string) {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["posStaff", staffUsercode],
        queryFn: () => getPOSStaff(staffUsercode, header),
        enabled: !!staffUsercode,
    });
}

export function useCreatePOSStaff() {
    const header = useAxiosAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePOSStaff) => createPOSStaff(data, header),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posStaffList"] });
        },
    });
}

export function useUpdatePOSStaff() {
    const header = useAxiosAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ staffUsercode, data }: { staffUsercode: string; data: UpdatePOSStaff }) =>
            updatePOSStaff(staffUsercode, data, header),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["posStaffList"] });
            queryClient.invalidateQueries({ queryKey: ["posStaff", variables.staffUsercode] });
        },
    });
}

export function useDeactivatePOSStaff() {
    const header = useAxiosAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (staffUsercode: string) => deactivatePOSStaff(staffUsercode, header),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["posStaffList"] });
            queryClient.invalidateQueries({ queryKey: ["posStaff", variables] });
        },
    });
}
