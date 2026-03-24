"use client";

import React, { useState } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { User, Phone, Mail, MapPin, Shield, Edit } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import VendorModal from "@/components/vendor/Modal";
import UpdateAccountForm from "@/forms/account/UpdateAccount";

export default function VendorSettings() {
  const {
    data: vendor,
    isLoading,
    refetch: refetchAccount,
  } = useFetchAccount();
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] =
    useState(false);

  const profileFields = [
    {
      label: "Full Name",
      value: `${vendor?.first_name || ""} ${vendor?.last_name || ""}`,
      icon: User,
    },
    {
      label: "Email Address",
      value: vendor?.email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: vendor?.phone_number || "Not provided",
      icon: Phone,
    },
    {
      label: "Location",
      value:
        `${vendor?.town || ""}, ${vendor?.county || ""}, ${vendor?.country || ""}`
          .replace(/^, /, "")
          .replace(/, $/, "")
          .replace(/^,/, "") || "Not specified",
      icon: MapPin,
    },
    {
      label: "Account Role",
      value: vendor?.is_superuser ? "Super Administrator" : "Vendor",
      icon: Shield,
    },
    {
      label: "Vendor Code",
      value: vendor?.usercode,
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Account Settings"
        description="View and manage your personal account details."
      />

      <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
            <User className="w-4 h-4 text-[#0071E3]" />
            Personal Profile
          </h3>
          <button
            onClick={() => setIsUpdateAccountModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] transition-colors"
          >
            <Edit className="w-3 h-3" />
            Edit Profile
          </button>
        </div>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {profileFields.map((field, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-[#F5F5F7] transition-colors"
              >
                <div className="w-8 h-8 bg-[#0071E3]/10 rounded-xl flex items-center justify-center text-[#0071E3] flex-shrink-0 mt-0.5">
                  <field.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#86868B] font-semibold mb-1">
                    {field.label}
                  </p>
                  {isLoading ? (
                    <div className="h-5 w-3/4 bg-[#F5F5F7] animate-pulse rounded-lg" />
                  ) : (
                    <p className="text-[#1D1D1F] font-medium text-sm break-words">
                      {field.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VendorModal
        isOpen={isUpdateAccountModalOpen}
        onClose={() => setIsUpdateAccountModalOpen(false)}
        title="Update Profile Details"
        maxWidth="max-w-2xl"
      >
        <UpdateAccountForm
          onSuccess={() => {
            setIsUpdateAccountModalOpen(false);
            refetchAccount();
          }}
        />
      </VendorModal>
    </div>
  );
}
