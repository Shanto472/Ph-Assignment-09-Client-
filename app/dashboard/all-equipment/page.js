'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  Edit3,
  X,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AllEquipmentAdminPage() {
  const { token, isAdmin } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchAdminEquipment = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.equipment)) {
        setEquipmentList(data.equipment);
      }
    } catch (err) {
      console.error('Fetch admin equipment error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdminEquipment();
  }, [token]);

  // Approve or Reject status handler (PDF page 11: Actions: Approve, Reject, Update, Delete)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setEquipmentList(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
        toast.success(`Equipment status updated to ${newStatus}!`);
      } else {
        toast.error('Failed to update equipment status.');
      }
    } catch (e) {
      toast.error('Error changing status.');
    }
  };

  // Delete equipment
  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: 'Delete Equipment?',
      text: `Are you sure you want to permanently delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Delete'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/equipment/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setEquipmentList(prev => prev.filter(e => e._id !== id));
          toast.success('Equipment listing deleted.');
        }
      } catch (e) {
        toast.error('Error deleting equipment.');
      }
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditData({
      name: item.name,
      category: item.category,
      rentalPrice: item.rentalPrice,
      rentalType: item.rentalType || 'Daily',
      availableQuantity: item.availableQuantity,
      location: item.location
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await fetch(`${API_BASE_URL}/equipment/${editingItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success && data.equipment) {
        setEquipmentList(prev => prev.map(item => item._id === editingItem._id ? data.equipment : item));
        toast.success('Equipment updated!');
        setEditingItem(null);
      }
    } catch (err) {
      toast.error('Failed to update equipment.');
    } finally {
      setSavingEdit(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">Administrator privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          All Equipment Moderation & Catalog
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review submissions, approve new fleet listings, and maintain equipment quality standards.
        </p>
      </div>

      {/* Table (PDF page 11: Actions: Approve, Reject, Update, Delete, Status: Pending, Approved, Rejected) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading equipment listings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Equipment</th>
                  <th className="py-3.5 px-4">Owner Info</th>
                  <th className="py-3.5 px-4">Rate & Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {equipmentList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Equipment Name & Image */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                          <span className="text-[10px] text-slate-400">{item.category} • {item.location}</span>
                        </div>
                      </div>
                    </td>

                    {/* Owner Info */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{item.ownerName || 'Equipment Owner'}</p>
                      <p className="text-[10px] text-slate-500">{item.ownerEmail}</p>
                    </td>

                    {/* Rate & Available Quantity */}
                    <td className="py-4 px-4">
                      <p className="font-black text-slate-900 dark:text-white">${item.rentalPrice} /{item.rentalType}</p>
                      <span className="text-[10px] text-slate-400">Qty: {item.availableQuantity}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] capitalize ${
                        item.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}>
                        {item.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : item.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status || 'Pending'}
                      </span>
                    </td>

                    {/* Actions: Approve, Reject, Update, Delete */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Approve Button */}
                        {item.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item._id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 shadow-sm"
                          >
                            Approve
                          </button>
                        )}

                        {/* Reject Button */}
                        {item.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item._id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 shadow-sm"
                          >
                            Reject
                          </button>
                        )}

                        {/* Update */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* View */}
                        <Link
                          href={`/equipment/${item._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin Edit Equipment</h3>
              <button onClick={() => setEditingItem(null)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editData.rentalPrice}
                    onChange={(e) => setEditData({ ...editData, rentalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={editData.availableQuantity}
                    onChange={(e) => setEditData({ ...editData, availableQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  {savingEdit ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
