"use client";

import React from "react";
import VendorModal from "@/components/vendor/Modal";
import UpdateShopForm from "@/forms/shop/UpdateShop";
import { Shop } from "@/services/shops";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { AlertTriangle } from "lucide-react";

interface ProfileOnboardingProps {
  vendorShop: Shop | null;
}

export default function ProfileOnboarding({ vendorShop }: ProfileOnboardingProps) {
  const { refetch: refetchAccount } = useFetchAccount();

  if (!vendorShop) return null;

  const requiredFields = [
    vendorShop.country,
    vendorShop.city,
    vendorShop.address,
    vendorShop.return_policy,
    vendorShop.shipping_policy,
    vendorShop.refund_policy,
  ];

  const isProfileIncomplete = requiredFields.some(
    (field) => !field || field.trim() === "",
  );

  if (!isProfileIncomplete) return null;

  return (
    <VendorModal
      isOpen={true}
      onClose={() => {}}
      title="Complete Your Shop Profile"
      maxWidth="max-w-2xl"
    >
      <div className="mb-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Action required:</strong> Please complete your shop&apos;s address and
          policy information before accessing your GearHouse Vendor Portal.
        </p>
      </div>
      <UpdateShopForm onSuccess={() => refetchAccount()} />
    </VendorModal>
  );
}
