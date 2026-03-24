"use client";

import Link from "next/link";
import { ArrowLeft, Zap, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 py-20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 mb-16">
        <Zap className="w-5 h-5 text-[#0071E3] fill-[#0071E3]" />
        <span className="text-lg font-bold text-[#1D1D1F]">GearHouse</span>
      </Link>

      {/* 404 */}
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-[#F5F5F7] rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#D2D2D7]">
          <Search className="w-9 h-9 text-[#D2D2D7]" />
        </div>

        <p className="text-xs font-semibold text-[#0071E3] uppercase tracking-widest mb-3">
          Error 404
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-4 tracking-tight">
          Signal Lost
        </h1>
        <p className="text-[#6E6E73] text-base mb-10 leading-relaxed">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back
          to the gear you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#0071E3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ED] transition-all shadow-lg shadow-[#0071E3]/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#F5F5F7] text-[#1D1D1F] border border-[#D2D2D7] rounded-full text-sm font-semibold hover:bg-[#E8E8E8] transition-all"
          >
            Browse Gear
          </Link>
        </div>
      </div>

      <p className="mt-20 text-xs text-[#86868B]">
        © 2026 GearHouse · Powered by Corban Technologies LTD
      </p>
    </div>
  );
}