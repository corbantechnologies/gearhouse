"use client";

import React, { useState } from "react";
import { useFetchPOSTills, useCreatePOSTill, useUpdatePOSTill, useDeletePOSTill } from "@/hooks/postills/actions";
import { Monitor, Plus, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import VendorModal from "@/components/vendor/Modal";

export default function POSTillsSection() {
  const { data: tills = [], isLoading } = useFetchPOSTills();
  const createMutation = useCreatePOSTill();
  const updateMutation = useUpdatePOSTill();
  const deleteMutation = useDeletePOSTill();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", is_active: true });

  const handleOpenModal = (till: any = null) => {
    if (till) {
      setEditingId(till.id);
      setFormData({ name: till.name, is_active: till.is_active });
    } else {
      setEditingId(null);
      setFormData({ name: "", is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
      } else {
        await createMutation.mutateAsync({ name: formData.name });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Till?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden mt-8">
      <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#0071E3]" />
          POS Tills Management
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#0071E3] text-white px-3 py-1.5 rounded-lg hover:bg-[#0077ED] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Till
        </button>
      </div>

      <div className="p-4 md:p-8">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-[#F5F5F7] rounded-xl w-full"></div>
            <div className="h-10 bg-[#F5F5F7] rounded-xl w-full"></div>
          </div>
        ) : tills.length === 0 ? (
          <p className="text-sm text-[#86868B] text-center py-6">No POS Tills configured yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tills.map((till) => (
              <div key={till.id} className="border border-[#F5F5F7] rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[#1D1D1F]">{till.name}</h4>
                  {till.is_active ? (
                    <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#F5F5F7]">
                  <button onClick={() => handleOpenModal(till)} className="p-1.5 text-[#86868B] hover:text-[#0071E3] bg-[#F5F5F7] hover:bg-[#0071E3]/10 rounded-lg transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(till.id)} className="p-1.5 text-[#86868B] hover:text-red-500 bg-[#F5F5F7] hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Update Till" : "Create New Till"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
              Till Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Front Desk Till 1"
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
              Till is Active
            </label>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full h-11 bg-[#0071E3] text-white font-semibold rounded-xl text-sm hover:bg-[#0077ED] transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Till"}
            </button>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
