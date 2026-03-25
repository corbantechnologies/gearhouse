/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Cart } from "@/services/cart";
import { CartItem } from "@/services/cartitems";
import { useFetchCart } from "@/hooks/cart/actions";
import {
  useAddToCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from "@/hooks/cartitems/mutations";
import { toast } from "react-hot-toast";

// Extended interface for Item input
export interface CartItemInput {
  variant_sku: string;
  quantity: number;
  variant_name?: string;
  variant_price?: number;
  variant_image?: string;
  shop_currency?: string;
  stock?: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (item: CartItemInput) => Promise<void>;
  updateItem: (reference: string, quantity: number) => Promise<void>;
  removeItem: (reference: string) => Promise<void>;
  isGuest: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  // ── Authenticated cart ──
  const { data: serverCart, isLoading: isServerLoading } = useFetchCart({
    enabled: isAuthenticated,
  });

  const { mutateAsync: serverAdd } = useAddToCart();
  const { mutateAsync: serverUpdate } = useUpdateCartItem();
  const { mutateAsync: serverDelete } = useDeleteCartItem();

  // ── Cart operations ──
  const addToCart = async (input: CartItemInput) => {
    if (!isAuthenticated) {
      toast("Please sign in to add items to your cart", { icon: "🔒" });
      router.push("/login");
      return;
    }
    await serverAdd({ variant: input.variant_sku, quantity: input.quantity });
    toast.success("Added to cart!");
  };

  const updateItem = async (reference: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(reference);
      return;
    }

    if (!isAuthenticated) return;
    await serverUpdate({ reference, quantity });
  };

  const removeItem = async (reference: string) => {
    if (!isAuthenticated) return;
    await serverDelete(reference);
  };

  // ── Context value ──
  const value: CartContextType = {
    cart: serverCart || null,
    isLoading: isAuthenticated ? isServerLoading : false,
    addToCart,
    updateItem,
    removeItem,
    isGuest: !isAuthenticated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
