"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  LucideShoppingBasket,
  BarChart3,
  Zap,
} from "lucide-react";

export default function VendorNavbar() {
  const pathname = usePathname();
  const { data: vendor } = useFetchAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/vendor/products", icon: ShoppingBag },
    { name: "Shop Orders", href: "/vendor/shop-orders", icon: LucideShoppingBasket },
    { name: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
    { name: "Settings", href: "/vendor/settings", icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-[#D2D2D7] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <Link
            href="/vendor/dashboard"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-7 h-7 bg-[#0071E3] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-[#1D1D1F]">GearHouse</span>
              <span className="text-xs text-[#86868B] ml-1.5 font-medium">Vendor Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0071E3]/10 text-[#0071E3]"
                      : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: User + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-[#1D1D1F] leading-none">
                {vendor?.first_name} {vendor?.last_name}
              </p>
              <p className="text-[10px] text-[#86868B] mt-0.5 truncate max-w-[140px]">
                {vendor?.email}
              </p>
            </div>
            <div className="w-8 h-8 bg-[#0071E3] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {vendor?.first_name?.slice(0, 1)}{vendor?.last_name?.slice(0, 1)}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-[#86868B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#6E6E73] hover:bg-[#F5F5F7] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F5F5F7] shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0071E3]/10 text-[#0071E3]"
                      : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="px-4 py-4 border-t border-[#F5F5F7] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#0071E3] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {vendor?.first_name?.slice(0, 1)}{vendor?.last_name?.slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  {vendor?.first_name} {vendor?.last_name}
                </p>
                <p className="text-xs text-[#86868B]">{vendor?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
