"use client";

import React, { useState } from "react";
import { useFetchPOSTills } from "@/hooks/postills/actions";
import { useOpenShift, useCloseShift } from "@/hooks/posshifts/actions";
import { Loader2, Monitor, DollarSign, AlertCircle } from "lucide-react";

export const OpenShiftModal = ({
  currency,
}: {
  currency: string;
}) => {
  const { data: tills = [], isLoading: isTillsLoading } = useFetchPOSTills();
  const openShiftMutation = useOpenShift();
  const [tillId, setTillId] = useState("");
  const [floatAmount, setFloatAmount] = useState(0);

  const activeTills = tills.filter((t) => t.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tillId) return alert("Please select a Till.");
    
    try {
      await openShiftMutation.mutateAsync({
        till: tillId,
        opening_float: floatAmount,
      });
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to open shift.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="w-12 h-12 bg-[#0071E3]/10 text-[#0071E3] rounded-2xl flex items-center justify-center mb-6">
            <Monitor className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Open Register Shift</h2>
          <p className="text-sm text-[#86868B] mb-8 leading-relaxed">
            You must open a shift before you can process any sales. Select your till and declare your starting cash float.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                Select Till
              </label>
              {isTillsLoading ? (
                <div className="h-12 bg-[#F5F5F7] rounded-xl animate-pulse" />
              ) : activeTills.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>No active tills found. Please ask an administrator to create one in POS Settings.</p>
                </div>
              ) : (
                <select
                  required
                  value={tillId}
                  onChange={(e) => setTillId(e.target.value)}
                  className="w-full px-4 h-12 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                >
                  <option value="" disabled>Select a till...</option>
                  {activeTills.map((till) => (
                    <option key={till.id} value={till.id}>{till.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Opening Cash Float ({currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={floatAmount}
                  onChange={(e) => setFloatAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 h-12 bg-[#F5F5F7] border border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={openShiftMutation.isPending || activeTills.length === 0}
              className="w-full h-12 mt-4 bg-[#0071E3] text-white rounded-xl text-sm font-bold hover:bg-[#0077ED] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {openShiftMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Start Shift
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const CloseShiftModal = ({
  currency,
  onClose,
}: {
  currency: string;
  onClose: () => void;
}) => {
  const closeShiftMutation = useCloseShift();
  const [floatAmount, setFloatAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await closeShiftMutation.mutateAsync({
        closing_float: floatAmount,
      });
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to close shift.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Close Shift</h2>
          <p className="text-sm text-[#86868B] mb-8 leading-relaxed">
            Enter the final cash amount in your till before closing the shift. This will be recorded to calculate discrepancies.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                Closing Cash Float ({currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={floatAmount}
                  onChange={(e) => setFloatAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 h-12 bg-[#F5F5F7] border border-transparent rounded-xl text-lg font-bold focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-sm font-bold hover:bg-[#E8E8ED] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={closeShiftMutation.isPending}
                className="flex-1 h-12 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {closeShiftMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Close Shift
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
