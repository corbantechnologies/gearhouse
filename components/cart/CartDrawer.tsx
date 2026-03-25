"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Loader2, Zap, Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import CartItem from "./CartItem";
import { formatCurrency } from "@/components/dashboard/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, isLoading, isGuest } = useCart();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const itemCount = cart?.items.reduce((acc, i) => acc + i.quantity, 0) || 0;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative z-[100] w-full sm:w-[420px] h-full bg-white shadow-2xl border-l border-[#D2D2D7] animate-in slide-in-from-right duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5F5F7]">
          <h2 className="text-lg font-bold text-[#1D1D1F] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0071E3]" />
            Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-[#86868B]">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition-colors outline-none"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="w-7 h-7 animate-spin text-[#0071E3]" />
              <p className="text-sm text-[#86868B]">Loading your cart...</p>
            </div>
          ) : isGuest ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
              <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#D2D2D7]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#1D1D1F]">
                  Sign in to your account
                </p>
                <p className="text-sm text-[#86868B] mt-1 max-w-[200px] mx-auto">
                  Your cart items are saved to your account.
                </p>
              </div>
              <Link
                href="/login"
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ED] transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
              <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#D2D2D7]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#1D1D1F]">
                  Your cart is empty
                </p>
                <p className="text-sm text-[#86868B] mt-1 max-w-[200px] mx-auto">
                  Find something you love and add it here.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ED] transition-colors"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="py-4 divide-y divide-[#F5F5F7]">
              {cart.items.map((item) => (
                <CartItem key={item.reference} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#F5F5F7] bg-[#FAFAFA]">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6E6E73]">Subtotal</span>
                <span className="font-medium text-[#1D1D1F]">
                  {formatCurrency(cart.grand_total, "KES")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6E6E73]">Shipping</span>
                <span className="text-[#86868B]">Calculated at checkout</span>
              </div>
              <div className="h-px bg-[#D2D2D7] my-2" />
              <div className="flex justify-between">
                <span className="font-bold text-[#1D1D1F]">Total</span>
                <span className="font-bold text-[#1D1D1F] text-lg">
                  {formatCurrency(cart.grand_total, "KES")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1D1D1F] text-white rounded-2xl text-sm font-semibold hover:bg-black active:scale-[0.98] transition-all shadow-lg"
            >
              <Zap className="w-4 h-4 fill-white" />
              Checkout
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-center w-full py-3 text-sm font-medium text-[#0071E3] hover:underline mt-2"
            >
              View Full Cart
            </Link>
            <p className="text-[10px] text-[#86868B] text-center mt-3">
              Secure checkout · M-Pesa STK Push
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
