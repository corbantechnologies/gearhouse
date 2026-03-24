"use client";

import { useCart } from "@/context/CartContext";
import { CartItem as CartItemType } from "@/services/cartitems";
import { formatCurrency } from "@/components/dashboard/utils";
import { Loader2, Minus, Plus, Trash2, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  currency?: string;
}

export default function CartItem({ item, currency = "KES" }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateItem(item.reference, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeItem(item.reference);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDisabled = isUpdating || isDeleting;

  return (
    <div className={`flex gap-4 py-4 transition-opacity ${isDeleting ? "opacity-40" : "opacity-100"}`}>
      {/* Image */}
      <div className="relative w-16 h-16 bg-[#F5F5F7] rounded-xl overflow-hidden flex-shrink-0 border border-[#D2D2D7]/60">
        {item.variant_image ? (
          <Image
            src={item.variant_image}
            alt={item.variant_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-[#D2D2D7]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[#1D1D1F] line-clamp-2 leading-snug">
          {item.variant_name}
        </h4>
        {item.variant_attributes &&
          Object.keys(item.variant_attributes).length > 0 && (
            <p className="text-xs text-[#86868B] mt-0.5">
              {Object.values(item.variant_attributes).join(" · ")}
            </p>
          )}
        <p className="text-sm font-bold text-[#1D1D1F] mt-1">
          {formatCurrency(
            parseFloat(item.sub_total.toString()),
            item.variant_shop_currency || currency,
          )}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center bg-[#F5F5F7] rounded-full border border-[#D2D2D7] divide-x divide-[#D2D2D7] overflow-hidden h-8">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isDisabled || item.quantity <= 1}
              className="w-8 h-full flex items-center justify-center text-[#1D1D1F] hover:bg-[#E8E8E8] transition-colors disabled:opacity-40"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 h-full flex items-center justify-center text-xs font-semibold text-[#1D1D1F]">
              {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isDisabled}
              className="w-8 h-full flex items-center justify-center text-[#1D1D1F] hover:bg-[#E8E8E8] transition-colors disabled:opacity-40"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={isDisabled}
            className="p-1.5 text-[#86868B] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-40"
            aria-label="Remove item"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
