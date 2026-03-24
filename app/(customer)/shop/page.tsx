"use client";

import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProductList() {
  const { data: products, isLoading: isLoadingProducts } = useFetchProducts();
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchCategories();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");

  // Filter out categories that have no products
  const categoriesWithProducts =
    categories?.filter((category) => {
      if (!category.is_active) return false;
      // Get all subcategory references for this category
      const subCategoryRefs =
        category.subcategories?.map((s) => s.reference) || [];
      // Check if any product belongs to one of these subcategories
      return products?.some(
        (p) =>
          p.is_active &&
          p.sub_category.some((sub) => subCategoryRefs.includes(sub.reference)),
      );
    }) || [];

  // Filter products based on selected category or subcategory
  const filteredProducts =
    products?.filter((p) => {
      if (!p.is_active) return false;

      // Prioritize subcategory filter
      if (selectedSubcategory) {
        return p.sub_category.some(
          (sub) => sub.reference === selectedSubcategory,
        );
      }

      if (!selectedCategory) return true;

      // Find the selected category object
      const category = categories?.find(
        (c) => c.reference === selectedCategory,
      );
      if (!category) return false;

      // Get all subcategory references for the selected category
      const subCategoryRefs =
        category.subcategories?.map((s) => s.reference) || [];

      // Check if product belongs to any of these subcategories
      return p.sub_category.some((sub) =>
        subCategoryRefs.includes(sub.reference),
      );
    }) || [];

  const handleCategoryClick = (categoryRef: string | null) => {
    // When clicking a main category, we clear the subcategory
    if (categoryRef) {
      router.push(`/shop?category=${categoryRef}`);
    } else {
      router.push("/shop");
    }
  };

  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-[#0071E3] uppercase tracking-widest mb-3">
          Our Collection
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
          All Gear
        </h1>
        <p className="text-[#6E6E73] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Browse our full range of premium tech — laptops, peripherals, gadgets, and accessories
          handpicked for performance and value.
        </p>
      </div>

      {/* Filters and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        {/* Categories - Horizontal Scrollable */}
        <div className="w-full md:w-auto overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
          <div className="flex flex-nowrap md:flex-wrap gap-2 min-w-max px-1">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${
                selectedCategory === null
                  ? "bg-[#0071E3] text-white border-[#0071E3]"
                  : "bg-white text-[#1D1D1F] border-[#D2D2D7] hover:border-[#0071E3] hover:text-[#0071E3]"
              }`}
            >
              All
            </button>
            {categoriesWithProducts.map((category) => (
              <button
                key={category.reference}
                onClick={() => handleCategoryClick(category.reference)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${
                  selectedCategory === category.reference
                    ? "bg-[#0071E3] text-white border-[#0071E3]"
                    : "bg-white text-[#1D1D1F] border-[#D2D2D7] hover:border-[#0071E3] hover:text-[#0071E3]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length > 0 ? (
          // Updated grid columns: 2 on mobile, 3 on md, 4 on lg
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.reference} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#F5F5F7] rounded-2xl border border-dashed border-[#D2D2D7]">
            <p className="text-[#6E6E73] mb-4">
              No products found in this category.
            </p>
            <button
              onClick={() => handleCategoryClick(null)}
              className="text-[#0071E3] font-semibold hover:underline underline-offset-4 text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-40">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        }
      >
        <ProductList />
      </Suspense>
    </div>
  );
}
