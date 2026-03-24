import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">{title}</h2>
    {description && (
      <p className="text-sm text-[#86868B] mt-1">{description}</p>
    )}
  </div>
);

export default SectionHeader;
