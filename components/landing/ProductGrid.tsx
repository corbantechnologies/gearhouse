"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "../products/ProductCard";

export default function ProductGrid() {
  const { data: products, isLoading } = useFetchProducts();

  const displayProducts =
    products?.filter((p) => p.is_active && p.images.length > 0).slice(0, 8) || [];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold text-[#0071E3] uppercase tracking-widest mb-2">
              Handpicked for you
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
              Featured Gear
            </h2>
            <p className="text-[#6E6E73] mt-2 text-sm md:text-base max-w-md">
              Our best-selling products, trusted by thousands of customers.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0071E3] hover:gap-2.5 transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.reference} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#86868B]">
            No products available yet.
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0071E3]"
          >
            View all gear <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
