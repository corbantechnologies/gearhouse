"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Zap,
} from "lucide-react";
import UserMenu from "./UserMenu";
import { useSession, signOut } from "next-auth/react";
import { useFetchCategories } from "@/hooks/categories/actions";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { data: categories } = useFetchCategories();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount =
    cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const activeCategories = categories?.filter((c) => c.is_active) || [];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#D2D2D7]">
        <div className="max-w-7xl mx-auto px-6 h-[52px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl font-bold text-[#1D1D1F] tracking-tight z-50 relative outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded"
          >
            <Zap className="w-5 h-5 text-[#0071E3] fill-[#0071E3]" />
            GearHouse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm text-[#1D1D1F]/80 hover:text-[#0071E3] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#0071E3] rounded px-1"
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button
                className="flex items-center text-sm text-[#1D1D1F]/80 hover:text-[#0071E3] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#0071E3] rounded px-1"
                aria-expanded={isShopOpen}
                onClick={() => setIsShopOpen(!isShopOpen)}
              >
                Shop <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isShopOpen ? "rotate-180" : ""}`} />
              </button>

              {isShopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-3 animate-in fade-in duration-150">
                  <div className="bg-white rounded-2xl shadow-2xl border border-[#D2D2D7]/60 overflow-hidden p-2">
                    <Link
                      href="/shop"
                      className="flex items-center px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors font-medium"
                    >
                      All Products
                    </Link>
                    <div className="h-px bg-[#D2D2D7]/50 my-1" />
                    {activeCategories.length > 0 ? (
                      activeCategories.map((category) => (
                        <div key={category.reference}>
                          <Link
                            href={`/shop?category=${category.reference}`}
                            className="flex items-center px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
                          >
                            {category.name}
                          </Link>
                          {category.subcategories &&
                            category.subcategories.length > 0 && (
                              <div className="pl-4 pb-1">
                                {category.subcategories
                                  .filter((s) => s.is_active)
                                  .map((sub) => (
                                    <Link
                                      key={sub.reference}
                                      href={`/shop?subcategory=${sub.reference}`}
                                      className="flex items-center px-3 py-1.5 text-xs text-[#6E6E73] hover:text-[#0071E3] rounded-lg transition-colors"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-xs text-[#86868B] text-center">
                        No categories yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/orders"
              className="text-sm text-[#1D1D1F]/80 hover:text-[#0071E3] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#0071E3] rounded px-1"
            >
              Orders
            </Link>
          </div>

          {/* Right: User + Cart + Mobile Toggle */}
          <div className="flex items-center space-x-4 md:space-x-5">
            <UserMenu />

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-[#1D1D1F]/80 hover:text-[#0071E3] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#0071E3] rounded"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0071E3] text-white text-[10px] flex items-center justify-center rounded-full font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-[#1D1D1F] outline-none focus-visible:ring-1 focus-visible:ring-[#0071E3] rounded"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className="relative z-[100] w-full sm:w-80 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#D2D2D7]">
              <span className="flex items-center gap-1.5 text-lg font-bold text-[#1D1D1F]">
                <Zap className="w-4 h-4 text-[#0071E3] fill-[#0071E3]" />
                GearHouse
              </span>
              <button
                className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors outline-none rounded"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-3 text-[#1D1D1F] font-medium rounded-xl hover:bg-[#F5F5F7] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Shop Section */}
              <div>
                <button
                  onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                  className="flex w-full items-center justify-between px-3 py-3 text-[#1D1D1F] font-medium rounded-xl hover:bg-[#F5F5F7] transition-colors"
                >
                  Shop
                  <ChevronDown
                    className={`w-4 h-4 text-[#6E6E73] transition-transform duration-200 ${
                      isMobileShopOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileShopOpen && (
                  <div className="pl-3 mt-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2.5 text-sm text-[#1D1D1F] rounded-xl hover:bg-[#F5F5F7] transition-colors font-medium"
                    >
                      All Products
                    </Link>
                    {activeCategories.map((category) => (
                      <div key={category.reference}>
                        <Link
                          href={`/shop?category=${category.reference}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm text-[#1D1D1F] rounded-xl hover:bg-[#F5F5F7] transition-colors"
                        >
                          {category.name}
                        </Link>
                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <div className="pl-4 space-y-0.5">
                              {category.subcategories
                                .filter((s) => s.is_active)
                                .map((sub) => (
                                  <Link
                                    key={sub.reference}
                                    href={`/shop?subcategory=${sub.reference}`}
                                    className="flex items-center px-3 py-2 text-xs text-[#6E6E73] rounded-xl hover:text-[#0071E3] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/orders"
                className="flex items-center px-3 py-3 text-[#1D1D1F] font-medium rounded-xl hover:bg-[#F5F5F7] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Orders
              </Link>

              {session ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-3 py-3 text-[#1D1D1F] font-medium rounded-xl hover:bg-[#F5F5F7] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-[#6E6E73]" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-3 text-[#0071E3] font-medium rounded-xl hover:bg-[#F5F5F7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" /> Login / Register
                </Link>
              )}
            </div>

            <div className="px-6 py-5 border-t border-[#D2D2D7]">
              <p className="text-xs text-[#86868B] text-center">
                © 2026 GearHouse · Corban Technologies LTD
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
