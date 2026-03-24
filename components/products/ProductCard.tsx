"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/components/dashboard/utils";
import { Product } from "@/services/products";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const prices = product.variants.map((v) => parseFloat(v.price));
  const discountedPrices = product.variants
    .filter((v) => v.discounted_price)
    .map((v) => parseFloat(v.discounted_price!));

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const minDiscounted = discountedPrices.length > 0 ? Math.min(...discountedPrices) : null;
  const isRange = minPrice !== maxPrice;
  const currency = product.shop_details.currency || "KES";
  const isInStock = product.total_stock > 0;

  return (
    <Link href={`/shop/${product.reference}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F5F7] rounded-2xl mb-3 border border-[#D2D2D7]/60">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-[#D2D2D7]" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {!isInStock && (
            <span className="px-2 py-0.5 bg-[#1D1D1F]/80 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">
              Out of Stock
            </span>
          )}
          {isInStock && product.total_stock <= 5 && (
            <span className="px-2 py-0.5 bg-orange-500/90 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">
              Low Stock
            </span>
          )}
          {minDiscounted && (
            <span className="px-2 py-0.5 bg-[#0071E3]/90 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">
              Sale
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#1D1D1F]/0 group-hover:bg-[#1D1D1F]/5 transition-colors duration-300 rounded-2xl" />
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="text-[10px] font-medium text-[#86868B] uppercase tracking-widest mb-1">
          {product.sub_category[0]?.name || "Tech"}
        </p>
        <h3 className="text-sm font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors line-clamp-2 leading-snug mb-1.5">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          {prices.length > 0 ? (
            <>
              <span className="text-sm font-bold text-[#1D1D1F]">
                {isRange
                  ? `${formatCurrency(minPrice, currency)} – ${formatCurrency(maxPrice, currency)}`
                  : formatCurrency(minDiscounted ?? minPrice, currency)}
              </span>
              {minDiscounted && !isRange && (
                <span className="text-xs text-[#86868B] line-through">
                  {formatCurrency(minPrice, currency)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-[#86868B]">Price not set</span>
          )}
        </div>
      </div>
    </Link>
  );
}
