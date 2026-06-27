"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useFetchInventory } from "@/hooks/stockadjustments/actions";
import { useFetchPOSSales } from "@/hooks/possales/actions";
import { useFetchCurrentShift } from "@/hooks/posshifts/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useLookupCustomer } from "@/hooks/walkincustomers/actions";
import { voidPOSSale } from "@/services/possales";
import { createWalkInCustomer } from "@/services/walkincustomers";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { InventoryItem } from "@/services/stockadjustments";
import { POSSale, CreatePOSSaleItem } from "@/services/possales";
import SectionHeader from "@/components/dashboard/SectionHeader";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ScanLine,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Receipt,
  Clock,
  User,
  Info,
  LogOut,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { OpenShiftModal, CloseShiftModal } from "./ShiftModals";
import { CheckoutModal } from "@/components/vendor/pos/CheckoutModal";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartItem {
  variant: InventoryItem;
  quantity: number;
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "MPESA_MANUAL", label: "M-Pesa", icon: Smartphone },
  { value: "CARD", label: "Card", icon: CreditCard },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatKES(amount: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function attrLabel(attrs: Record<string, string>) {
  const entries = Object.entries(attrs);
  if (!entries.length) return null;
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

// ─── Product Grid Item ────────────────────────────────────────────────────────

const ProductTile = ({
  item,
  onAdd,
}: {
  item: InventoryItem;
  onAdd: (item: InventoryItem) => void;
}) => {
  const attrs = attrLabel(item.attributes);
  const outOfStock = item.stock === 0;

  return (
    <button
      onClick={() => !outOfStock && onAdd(item)}
      disabled={outOfStock}
      className={`group relative bg-white rounded-2xl border p-4 text-left transition-all duration-200 ${
        outOfStock
          ? "border-[#D2D2D7] opacity-50 cursor-not-allowed"
          : "border-[#D2D2D7] hover:border-[#0071E3]/50 hover:shadow-md cursor-pointer active:scale-95"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1D1D1F] truncate">
            {item.product_name}
          </p>
          {attrs && (
            <p className="text-xs text-[#86868B] mt-0.5 truncate">{attrs}</p>
          )}
          <p className="text-xs text-[#86868B] mt-1 font-mono">{item.sku}</p>
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center group-hover:bg-[#0071E3] group-hover:text-white transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-bold text-[#1D1D1F]">
          {formatKES(item.price)}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            outOfStock
              ? "bg-red-100 text-red-600"
              : item.is_low_stock
              ? "bg-amber-100 text-amber-600"
              : "bg-[#F5F5F7] text-[#6E6E73]"
          }`}
        >
          {outOfStock ? "Out of stock" : `${item.stock} left`}
        </span>
      </div>
    </button>
  );
};

// ─── Cart Line ────────────────────────────────────────────────────────────────

const CartLine = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) => {
  const attrs = attrLabel(item.variant.attributes);
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F7] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1D1D1F] truncate">
          {item.variant.product_name}
        </p>
        {attrs && (
          <p className="text-xs text-[#86868B] truncate">{attrs}</p>
        )}
        <p className="text-sm font-medium text-[#0071E3] mt-0.5">
          {formatKES(item.variant.price * item.quantity)}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onDecrease}
          className="w-7 h-7 rounded-lg border border-[#D2D2D7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-[#1D1D1F]">
          {item.quantity}
        </span>
        <button
          onClick={onIncrease}
          disabled={item.quantity >= item.variant.stock}
          className="w-7 h-7 rounded-lg border border-[#D2D2D7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-[#86868B] transition-colors ml-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Recent Sale Row ──────────────────────────────────────────────────────────

const RecentSaleRow = ({
  sale,
  currency,
  onVoid,
  isVoiding,
}: {
  sale: POSSale;
  currency: string;
  onVoid: (ref: string) => void;
  isVoiding: boolean;
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F7] last:border-0">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        sale.status === "VOIDED"
          ? "bg-red-100 text-red-500"
          : "bg-emerald-100 text-emerald-600"
      }`}
    >
      {sale.status === "VOIDED" ? (
        <XCircle className="w-4 h-4" />
      ) : (
        <CheckCircle2 className="w-4 h-4" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[#1D1D1F]">
        {formatKES(parseFloat(sale.total_amount), currency)}{" "}
        <span className="text-xs font-normal text-[#86868B]">
          via {sale.payment_method.replace("_", " ")}
        </span>
      </p>
      <p className="text-xs text-[#86868B] truncate">
        {sale.customer_name || "Walk-in"} · {sale.items.length} item{sale.items.length !== 1 ? "s" : ""} ·{" "}
        {new Date(sale.sale_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
    {sale.status === "COMPLETED" && (
      <button
        onClick={() => onVoid(sale.reference)}
        disabled={isVoiding}
        className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 flex-shrink-0"
      >
        Void
      </button>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function POSPage() {
  const { data: user } = useFetchAccount();
  const currency = user?.shop?.currency || "KES";

  const { data: currentShift, isLoading: shiftLoading } = useFetchCurrentShift();
  const { data: inventory = [], isLoading: inventoryLoading } = useFetchInventory();
  const { data: recentSales = [] } = useFetchPOSSales();
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  
  const [isVoiding, setIsVoiding] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleVoidSale = async (ref: string) => {
    setIsVoiding(ref);
    try {
      await voidPOSSale(ref, header);
      queryClient.invalidateQueries({ queryKey: ["possales"] });
    } catch (err: any) {
      alert("Failed to void sale.");
    } finally {
      setIsVoiding(null);
    }
  };

  const handleEnrollCustomer = async () => {
    setIsEnrolling(true);
    try {
      await createWalkInCustomer({ phone_number: debouncedPhone, first_name: customerName }, header);
      queryClient.invalidateQueries({ queryKey: ["walkincustomer", debouncedPhone] });
      queryClient.invalidateQueries({ queryKey: ["walkincustomers"] });
    } catch (err: any) {
      alert("Failed to enroll customer.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  // Customer data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  
  // Customer lookup
  const [debouncedPhone, setDebouncedPhone] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhone(customerPhone);
    }, 500);
    return () => clearTimeout(handler);
  }, [customerPhone]);
  
  const { data: foundCustomer, isLoading: customerLoading } = useLookupCustomer(debouncedPhone);

  useEffect(() => {
    if (foundCustomer) {
      setCustomerName(`${foundCustomer.first_name} ${foundCustomer.last_name || ""}`.trim());
    }
  }, [foundCustomer]);

  // Modal states
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);

  // UI state
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtered products
  const filteredInventory = useMemo(() => {
    const q = search.toLowerCase();
    return inventory.filter(
      (item) =>
        item.product_name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        Object.values(item.attributes).some((v) =>
          String(v).toLowerCase().includes(q),
        ),
    );
  }, [inventory, search]);

  // Today's sales only
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    return recentSales
      .filter((s) => new Date(s.sale_date).toDateString() === today)
      .slice(0, 10);
  }, [recentSales]);

  // Cart calculations
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0),
    [cart],
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  // Cart handlers
  const addToCart = (item: InventoryItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.variant.variant_id === item.variant_id);
      if (existing) {
        if (existing.quantity >= item.stock) return prev;
        return prev.map((c) =>
          c.variant.variant_id === item.variant_id
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        );
      }
      return [...prev, { variant: item, quantity: 1 }];
    });
  };

  const increase = (variantId: string) =>
    setCart((prev) =>
      prev.map((c) =>
        c.variant.variant_id === variantId && c.quantity < c.variant.stock
          ? { ...c, quantity: c.quantity + 1 }
          : c,
      ),
    );

  const decrease = (variantId: string) =>
    setCart((prev) =>
      prev
        .map((c) =>
          c.variant.variant_id === variantId
            ? { ...c, quantity: c.quantity - 1 }
            : c,
        )
        .filter((c) => c.quantity > 0),
    );

  const remove = (variantId: string) =>
    setCart((prev) => prev.filter((c) => c.variant.variant_id !== variantId));

  const clearCart = () => {
    setCart([]);
    setSuccessRef(null);
    setErrorMsg(null);
    setCustomerName("");
    setCustomerPhone("");
    setPointsToRedeem(0);
  };

  const handleCheckoutSuccess = (ref: string) => {
    setIsCheckoutModalOpen(false);
    setSuccessRef(ref);
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setPointsToRedeem(0);
  };

  if (shiftLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]"><Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SectionHeader
            title="POS Register"
            description={currentShift ? `Till: ${currentShift.till.name} • Opened: ${new Date(currentShift.opening_time).toLocaleTimeString()}` : "Log walk-in sales and manage in-store transactions."}
          />
          <div className="flex items-center gap-3">
            <Link
              href="/vendor/pos/info"
              className="flex items-center gap-2 text-sm text-[#0071E3] hover:underline font-medium"
            >
              <Info className="w-4 h-4" />
              Help
            </Link>
            {currentShift && (
              <button
                onClick={() => setIsCloseShiftModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Close Shift
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Product Grid ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                placeholder="Search products by name or SKU…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
              />
            </div>

            {/* Product Grid */}
            {inventoryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-28 bg-white rounded-2xl border border-[#D2D2D7] animate-pulse"
                    />
                  ))}
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 bg-white rounded-2xl border border-dashed border-[#D2D2D7]">
                <ScanLine className="w-10 h-10 text-[#D2D2D7]" />
                <p className="text-sm font-semibold text-[#1D1D1F]">No products found</p>
                <p className="text-xs text-[#86868B]">
                  Try a different search, or add products first.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredInventory.map((item) => (
                  <ProductTile key={item.variant_id} item={item} onAdd={addToCart} />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Cart + Checkout ─────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Success banner */}
            {successRef && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-700">Sale Recorded!</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Ref: {successRef}</p>
                </div>
                <button
                  onClick={clearCart}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  New Sale
                </button>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}

            {/* Cart Panel */}
            <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden">
              {/* Cart Header */}
              <div className="px-5 py-4 border-b border-[#F5F5F7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#0071E3]" />
                  <span className="text-sm font-semibold text-[#1D1D1F]">
                    Cart{cartCount > 0 && ` (${cartCount})`}
                  </span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Cart Items */}
              <div className="px-5 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="py-10 flex flex-col items-center gap-2">
                    <ShoppingCart className="w-8 h-8 text-[#D2D2D7]" />
                    <p className="text-xs text-[#86868B]">Add products to start a sale</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <CartLine
                      key={item.variant.variant_id}
                      item={item}
                      onIncrease={() => increase(item.variant.variant_id)}
                      onDecrease={() => decrease(item.variant.variant_id)}
                      onRemove={() => remove(item.variant.variant_id)}
                    />
                  ))
                )}
              </div>

              {/* Total */}
              {cart.length > 0 && (
                <div className="px-5 py-4 border-t border-[#F5F5F7] flex items-center justify-between">
                  <span className="text-sm text-[#6E6E73]">Total</span>
                  <span className="text-xl font-bold text-[#1D1D1F]">
                    {formatKES(cartTotal, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Info Panel */}
            <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0071E3]" /> Customer & Loyalty
                </h3>
                {customerLoading && <Loader2 className="w-4 h-4 animate-spin text-[#0071E3]" />}
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="tel"
                  placeholder="Phone Number (Lookup)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
                />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
                />
              </div>

              {foundCustomer ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-800">Loyalty Member</p>
                    <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" /> {foundCustomer.loyalty_points.toFixed(0)} pts
                    </p>
                  </div>
                  {foundCustomer.loyalty_points > 0 && cartTotal > 0 && pointsToRedeem === 0 && (
                    <button
                      onClick={() => setPointsToRedeem(Math.min(foundCustomer.loyalty_points, cartTotal))}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Redeem
                    </button>
                  )}
                  {pointsToRedeem > 0 && (
                    <button
                      onClick={() => setPointsToRedeem(0)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : debouncedPhone.length >= 9 && customerName ? (
                <button
                  onClick={handleEnrollCustomer}
                  disabled={isEnrolling}
                  className="w-full py-2 bg-[#F5F5F7] text-[#0071E3] rounded-xl text-xs font-bold hover:bg-[#E8E8ED] transition-colors"
                >
                  {isEnrolling ? "Enrolling..." : "Enroll in Loyalty Program"}
                </button>
              ) : null}
            </div>

            {/* Action Buttons */}
            {cart.length > 0 && (
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 bg-[#0071E3] text-white rounded-2xl text-base font-bold hover:bg-[#0077ED] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Checkout • {formatKES(cartTotal, currency)}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Today's Sales */}
            <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F5F5F7] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0071E3]" />
                <span className="text-sm font-semibold text-[#1D1D1F]">Today's Sales</span>
              </div>
              <div className="px-5 max-h-72 overflow-y-auto">
                {todaySales.length === 0 ? (
                  <div className="py-8 flex flex-col items-center gap-2">
                    <Receipt className="w-7 h-7 text-[#D2D2D7]" />
                    <p className="text-xs text-[#86868B]">No sales today yet</p>
                  </div>
                ) : (
                  todaySales.map((sale) => (
                    <RecentSaleRow
                      key={sale.reference}
                      sale={sale}
                      currency={currency}
                      onVoid={handleVoidSale}
                      isVoiding={isVoiding === sale.reference}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!currentShift && !shiftLoading && <OpenShiftModal currency={currency} />}
      {isCloseShiftModalOpen && <CloseShiftModal currency={currency} onClose={() => setIsCloseShiftModalOpen(false)} />}
      
      {isCheckoutModalOpen && (
        <CheckoutModal
          cart={cart}
          cartTotal={cartTotal}
          currency={currency}
          customerData={{ name: customerName, phone: customerPhone, pointsToRedeem }}
          onClose={() => setIsCheckoutModalOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
