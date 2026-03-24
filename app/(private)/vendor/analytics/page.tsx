"use client";

import React, { useMemo } from "react";
import { useKPI, useSales } from "@/hooks/analytics/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import SectionHeader from "@/components/dashboard/SectionHeader";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  CreditCard,
  Percent,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react";

// --- Components ---

const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = "bg-primary/5 text-primary",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  colorClass?: string;
}) => (
  <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5 flex items-start justify-between hover:shadow-md hover:border-[#0071E3]/30 transition-all duration-200 group">
    <div className="flex-1">
      <p className="text-xs uppercase tracking-widest text-[#86868B] font-semibold mb-2">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
        {value}
      </h3>
      {trend && (
        <p className="text-xs text-green-600 mt-1.5 flex items-center font-medium">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </p>
      )}
    </div>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const SalesChart = ({
  data,
  isLoading,
  currency,
}: {
  data: { date: string; revenue: number }[] | undefined;
  isLoading: boolean;
  currency: string;
}) => {
  const maxRevenue = useMemo(() => {
    if (!data || data.length === 0) return 100;
    return Math.max(...data.map((d) => d.revenue)) * 1.1; // Add 10% buffer
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-[#F5F5F7] rounded-2xl border border-dashed border-[#D2D2D7] gap-3">
        <div className="w-12 h-12 bg-white rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-[#D2D2D7]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#1D1D1F]">No sales data yet</p>
          <p className="text-xs text-[#86868B] mt-1">Data will appear here once you start receiving orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#0071E3]" />
          Sales Overview
        </h3>
        <span className="text-xs text-[#6E6E73] bg-[#F5F5F7] border border-[#D2D2D7] px-3 py-1 rounded-full">
          Last 30 Days
        </span>
      </div>

      <div className="h-64 flex items-end gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {data.map((item, index) => {
          const heightPercentage = (item.revenue / maxRevenue) * 100;
          return (
            <div
              key={index}
              className="group relative flex flex-col items-center flex-1 min-w-[30px]"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                <span className="font-bold">
                  {formatCurrency(item.revenue, currency)}
                </span>
                <br />
                <span className="opacity-80">{item.date}</span>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
              </div>

              {/* Bar */}
              <div
                className="w-full bg-[#0071E3]/70 rounded-t-lg transition-all duration-500 hover:bg-[#0071E3] relative"
                style={{ height: `${heightPercentage}%` }}
              ></div>

              {/* X-Axis Label */}
              <div className="mt-2 text-[10px] text-muted-foreground font-mono rotate-0 truncate w-full text-center hidden md:block">
                {new Date(item.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const { data: user } = useFetchAccount();
  const currency = user?.shop?.currency || "KES";

  // Filter State
  const [dateRange, setDateRange] = React.useState("last_30_days");
  const [customStart, setCustomStart] = React.useState("");
  const [customEnd, setCustomEnd] = React.useState("");
  const [groupBy, setGroupBy] = React.useState("day");

  // Calculate params based on filters
  const params = useMemo(() => {
    const p: {
      start_date?: string;
      end_date?: string;
      group_by?: string;
    } = {};

    if (groupBy !== "day") {
      p.group_by = groupBy;
    }

    const today = new Date();
    if (dateRange === "today") {
      p.start_date = today.toISOString().split("T")[0];
      p.end_date = today.toISOString().split("T")[0];
    } else if (dateRange === "last_7_days") {
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      p.start_date = start.toISOString().split("T")[0];
      p.end_date = today.toISOString().split("T")[0];
    } else if (dateRange === "last_30_days") {
      const start = new Date(today);
      start.setDate(today.getDate() - 30);
      p.start_date = start.toISOString().split("T")[0];
      p.end_date = today.toISOString().split("T")[0];
    } else if (dateRange === "this_month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      p.start_date = start.toISOString().split("T")[0];
      p.end_date = end.toISOString().split("T")[0];
    } else if (dateRange === "custom") {
      if (customStart) p.start_date = customStart;
      if (customEnd) p.end_date = customEnd;
    }

    return p;
  }, [dateRange, customStart, customEnd, groupBy]);

  const { data: kpi, isLoading: kpiLoading } = useKPI(params);
  const { data: sales, isLoading: salesLoading } = useSales(params);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeader
            title="Analytics"
            description="Track your shop's performance and growth."
          />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white min-w-[100px]"
            >
              <option value="day">By Day</option>
              <option value="week">By Week</option>
              <option value="month">By Month</option>
              <option value="year">By Year</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white min-w-[140px]"
            >
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
                />
                <span className="text-[#86868B]">—</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white rounded-2xl border border-[#D2D2D7] animate-pulse"
                />
              ))
          ) : kpi ? (
            <>
              <KPICard
                title="Total Revenue"
                value={formatCurrency(kpi.total_revenue, currency)}
                icon={DollarSign}
                colorClass="bg-green-100 text-green-700"
              />
              <KPICard
                title="Total Orders"
                value={kpi.total_orders}
                icon={ShoppingBag}
                colorClass="bg-blue-100 text-blue-700"
              />
              <KPICard
                title="Items Sold"
                value={kpi.items_sold}
                icon={Package}
                colorClass="bg-purple-100 text-purple-700"
              />
              <KPICard
                title="Average Order Value"
                value={formatCurrency(kpi.average_order_value, currency)}
                icon={CreditCard}
                colorClass="bg-orange-100 text-orange-700"
              />
              <KPICard
                title="Total Profit"
                value={formatCurrency(kpi.total_profit, currency)}
                icon={TrendingUp}
                colorClass="bg-emerald-100 text-emerald-700"
              />
              <KPICard
                title="Profit Margin"
                value={`${kpi.profit_margin.toFixed(1)}%`}
                icon={Percent}
                colorClass="bg-pink-100 text-pink-700"
              />
            </>
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-sm font-semibold text-[#1D1D1F]">No KPI data available</p>
              <p className="text-xs text-[#86868B] mt-1">Start making sales to see your performance metrics here.</p>
            </div>
          )}
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <SalesChart
              data={sales}
              isLoading={salesLoading}
              currency={currency}
            />
          </div>

          {/* Quick Stats / Summary (could be extended) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
              <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0071E3]" />
                Performance Summary
              </h3>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                Your shop is performing well! Your average order value is
                currently{" "}
                <span className="font-semibold text-foreground">
                  {kpi
                    ? formatCurrency(kpi.average_order_value, currency)
                    : "..."}
                </span>
                . Focus on promoting high-margin items to boost your overall
                profit.
              </p>
              <div className="h-px bg-[#F5F5F7] my-4" />
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6E6E73]">Highest Sale</span>
                  {/* Placeholder logic for highest sale if available in future */}
                  <span className="font-medium text-foreground">
                    {sales && sales.length > 0
                      ? formatCurrency(
                          Math.max(...sales.map((s) => s.revenue)),
                          currency,
                        )
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6E6E73]">Busiest Day</span>
                  <span className="font-medium text-[#1D1D1F]">
                    {sales && sales.length > 0
                      ? new Date(
                          sales.reduce((a, b) =>
                            a.revenue > b.revenue ? a : b,
                          ).date,
                        ).toLocaleDateString("en-US", { weekday: "long" })
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
