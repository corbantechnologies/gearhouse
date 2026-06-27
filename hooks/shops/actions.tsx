"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShops, getShop, updateShop } from "@/services/shops";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchShops() {
    return useQuery({
        queryKey: ["shops"],
        queryFn: () => getShops(),
        enabled: true,
    });
}

export function useFetchShop(shop_code: string) {
    return useQuery({
        queryKey: ["shop", shop_code],
        queryFn: () => getShop(shop_code),
        enabled: !!shop_code,
    });
}

export function useUpdateShop() {
    const header = useAxiosAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ shop_code, data }: { shop_code: string; data: any }) =>
            updateShop(shop_code, data, header),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shop", variables.shop_code] });
            queryClient.invalidateQueries({ queryKey: ["account"] }); // Invalidate account to refresh vendor.shop
        },
    });
}