"use client";

import { useFetchShopOrders } from "@/hooks/shoporders/actions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import { formatDate } from "@/components/dashboard/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function ShopOrdersPage() {
  const { data: orders, isLoading } = useFetchShopOrders();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-12">
        <div className="flex justify-between items-start md:items-center mb-6">
          <SectionHeader
            title="Shop Orders"
            description="Manage and track your incoming orders."
          />
        </div>

        <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Reference</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Date</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Customer</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Tracking No.</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Status</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#0071E3]">Actions</th>
              </tr>
              </thead>
                <tbody className="divide-y divide-[#F5F5F7]">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} />)
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F5F5F7] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#1D1D1F]">{order.reference}</td>
                      <td className="px-6 py-4 text-xs text-[#86868B]">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-[#1D1D1F]">{order.customer_name}</td>
                      <td className="px-6 py-4 text-xs font-mono text-[#86868B]">{order.tracking_number || "—"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter font-medium
                            ${
                              order.status === "PLACED"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "COMPLETED"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/vendor/shop-orders/${order.reference}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
                          <Eye className="w-5 h-5 text-[#D2D2D7]" />
                        </div>
                        <p className="text-sm font-semibold text-[#1D1D1F]">No orders yet</p>
                        <p className="text-xs text-[#86868B] max-w-xs">When customers place orders from your shop, they&apos;ll appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
