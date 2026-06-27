"use client";

import React, { useState } from "react";
import { useFetchPOSStaffList, useCreatePOSStaff, useUpdatePOSStaff, useDeactivatePOSStaff } from "@/hooks/accounts/actions";
import { Users, Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import VendorModal from "@/components/vendor/Modal";

export default function POSStaffSection() {
  const { data: staffList = [], isLoading } = useFetchPOSStaffList();
  const createMutation = useCreatePOSStaff();
  const updateMutation = useUpdatePOSStaff();
  const deactivateMutation = useDeactivatePOSStaff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    is_active: true,
  });

  const handleOpenModal = (staff: any = null) => {
    if (staff) {
      setEditingId(staff.usercode);
      setFormData({
        email: staff.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
        phone_number: staff.phone_number || "",
        is_active: staff.is_active,
      });
    } else {
      setEditingId(null);
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          staffUsercode: editingId,
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            is_active: formData.is_active,
          },
        });
      } else {
        await createMutation.mutateAsync({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeactivate = async (usercode: string) => {
    if (confirm("Are you sure you want to deactivate this cashier? They will no longer be able to log in or process sales.")) {
      await deactivateMutation.mutateAsync(usercode);
    }
  };

  return (
    <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden mt-8">
      <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0071E3]" />
          POS Staff Management
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#0071E3] text-white px-3 py-1.5 rounded-lg hover:bg-[#0077ED] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Staff
        </button>
      </div>

      <div className="p-4 md:p-8">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
             <div className="h-14 bg-[#F5F5F7] rounded-xl w-full"></div>
             <div className="h-14 bg-[#F5F5F7] rounded-xl w-full"></div>
          </div>
        ) : staffList.length === 0 ? (
          <p className="text-sm text-[#86868B] text-center py-6">No POS Staff accounts created yet.</p>
        ) : (
          <div className="space-y-3">
            {staffList.map((staff) => (
              <div key={staff.usercode} className="border border-[#F5F5F7] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0071E3]/10 text-[#0071E3] rounded-full flex items-center justify-center font-bold text-sm">
                    {staff.first_name[0]}{staff.last_name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1D1D1F]">
                      {staff.first_name} {staff.last_name}
                      {!staff.is_active && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          Inactive
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#86868B] mt-0.5">{staff.email} • {staff.phone_number || "No phone"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(staff)} className="p-2 text-[#86868B] hover:text-[#0071E3] bg-[#F5F5F7] hover:bg-[#0071E3]/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  {staff.is_active && (
                    <button onClick={() => handleDeactivate(staff.usercode)} className="p-2 text-[#86868B] hover:text-red-500 bg-[#F5F5F7] hover:bg-red-50 rounded-lg transition-colors" title="Deactivate">
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Update POS Staff" : "Create POS Staff"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 px-4 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full h-11 px-4 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full h-11 px-4 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full h-11 px-4 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
            />
          </div>
          
          {editingId && (
            <label className="flex items-center gap-2 text-sm text-[#1D1D1F] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]"
              />
              Staff Account is Active
            </label>
          )}

          {!editingId && (
            <p className="text-xs text-[#86868B] bg-blue-50 text-blue-800 p-3 rounded-lg">
              The default password will be generated and sent in an email (or they can use forgot password with this email). For now, the backend auto-generates a secure password.
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full h-11 bg-[#0071E3] text-white font-semibold rounded-xl text-sm hover:bg-[#0077ED] transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Staff"}
            </button>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
