import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
  trend?: string;
}

const StatCard = ({ title, value, icon: Icon, loading, trend }: StatCardProps) => (
  <div className="bg-white border border-[#D2D2D7] rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:border-[#0071E3]/30 transition-all duration-200 group">
    <div className="flex-1">
      <p className="text-xs font-semibold text-[#86868B] uppercase tracking-widest mb-2">
        {title}
      </p>
      {loading ? (
        <div className="h-8 w-20 bg-[#F5F5F7] animate-pulse rounded-lg mt-1" />
      ) : (
        <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
          {value}
        </h3>
      )}
      {trend && (
        <p className="text-xs text-[#86868B] mt-1">{trend}</p>
      )}
    </div>
    <div className="w-10 h-10 bg-[#0071E3]/10 rounded-xl flex items-center justify-center group-hover:bg-[#0071E3]/20 transition-colors flex-shrink-0 ml-4">
      <Icon className="w-5 h-5 text-[#0071E3]" />
    </div>
  </div>
);

export default StatCard;
