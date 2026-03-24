"use client";

import { useCart } from "@/context/CartContext";
import { Loader2, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  variantSKU: string;
  quantity: number;
  stock: number;
  disabled?: boolean;
  className?: string;
  variantName?: string;
  variantPrice?: number;
  variantImage?: string;
  shopCurrency?: string;
}

export default function AddToCartButton({
  variantSKU,
  quantity,
  stock,
  disabled,
  className = "",
  variantName,
  variantPrice,
  variantImage,
  shopCurrency,
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!variantSKU) return;
    await addToCart({
      variant_sku: variantSKU,
      quantity,
      variant_name: variantName,
      variant_price: variantPrice,
      variant_image: variantImage,
      shop_currency: shopCurrency,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isLoading || isOutOfStock;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-semibold transition-all duration-200 ${
        isOutOfStock
          ? "bg-[#F5F5F7] text-[#86868B] cursor-not-allowed"
          : added
          ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
          : "bg-[#0071E3] text-white hover:bg-[#0077ED] active:bg-[#005BB5] shadow-lg shadow-[#0071E3]/25"
      } disabled:opacity-60 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : added ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {isLoading
        ? "Adding..."
        : added
        ? "Added to Cart!"
        : isOutOfStock
        ? "Out of Stock"
        : "Add to Cart"}
    </button>
  );
}
