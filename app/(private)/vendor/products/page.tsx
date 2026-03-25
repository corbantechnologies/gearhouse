"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchProductsVendor } from "@/hooks/products/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import { formatDate } from "@/components/dashboard/utils";
import VendorModal from "@/components/vendor/Modal";
import { CreateProduct } from "@/forms/products/CreateProduct";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  MoreHorizontal,
} from "lucide-react";

export default function ProductsPage() {
  const { data: vendor } = useFetchAccount();
  const { data: products, isLoading, refetch } = useFetchProductsVendor();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? product.is_active
          : !product.is_active;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8">
          <div className="flex-1">
            <span className="text-xs font-semibold text-[#0071E3] uppercase tracking-widest mb-2 block">
              Product Management
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
              Products
            </h1>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-[#0071E3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0077ED] transition-all shadow-md shadow-[#0071E3]/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-[#86868B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3] w-20">Image</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Product Details</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Stock</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Status</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3] hidden md:table-cell">Date</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} />)
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.reference} className="hover:bg-[#F5F5F7] transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] overflow-hidden flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-[#D2D2D7]" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#1D1D1F] text-sm">{product.name}</p>
                          <p className="text-[10px] font-mono text-[#86868B] mt-0.5">{product.product_code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6E6E73]">{product.total_stock} units</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${
                            product.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#86868B] hidden md:table-cell">{formatDate(product.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/vendor/products/${product.reference}`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] border border-[#0071E3]/30 hover:border-[#0071E3] rounded-full transition-all"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#D2D2D7]" />
                        </div>
                        <p className="text-sm font-semibold text-[#1D1D1F]">No products yet</p>
                        <p className="text-xs text-[#86868B]">Add your first tech product to start selling on GearHouse.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Products View - Card based */}
          <div className="sm:hidden divide-y divide-[#F5F5F7]">
            {isLoading ? (
               Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#F5F5F7] rounded-xl" />
                    <div className="flex-1 space-y-2">
                       <div className="h-4 bg-[#F5F5F7] rounded w-3/4" />
                       <div className="h-3 bg-[#F5F5F7] rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.reference} className="p-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] overflow-hidden flex items-center justify-center flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-[#D2D2D7]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1D1D1F] text-sm truncate">{product.name}</p>
                      <p className="text-[10px] font-mono text-[#86868B] mt-0.5">{product.product_code}</p>
                      <div className="mt-2 text-xs text-[#6E6E73]">
                        {product.total_stock} units in stock
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${
                          product.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/vendor/products/${product.reference}`}
                      className="inline-flex items-center px-4 py-2 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] border border-[#0071E3]/30 hover:border-[#0071E3] rounded-full transition-all w-full justify-center bg-[#F5F5F7] group"
                    >
                      Manage Product
                      <MoreHorizontal className="ml-2 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-20">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#D2D2D7]" />
                  </div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">No products yet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <VendorModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Product"
        >
          <CreateProduct
            onSuccess={() => {
              setIsCreateModalOpen(false);
              refetch();
            }}
          />
        </VendorModal>
      </div>
    </div>
  );
}
