'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Receipt, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  RotateCw,
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AllRentalsAdminPage() {
  const { token, isAdmin } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRentals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setRentals(data.bookings);
      }
    } catch (err) {
      console.error('Fetch admin rentals error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllRentals();
  }, [token]);

  // Update rental status
  const handleUpdateStatus = async (id, bookingStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRentals(prev => prev.map(b => b._id === id ? { ...b, bookingStatus } : b));
        toast.success(`Booking status changed to ${bookingStatus}!`);
      }
    } catch (e) {
      toast.error('Error updating booking status.');
    }
  };

  // Delete/Cancel booking
  const handleDeleteBooking = async (id) => {
    const confirm = await Swal.fire({
      title: 'Remove Rental Booking Record?',
      text: 'This will remove the booking entry from platform records.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Remove'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setRentals(prev => prev.filter(b => b._id !== id));
          toast.success('Rental record removed.');
        }
      } catch (e) {
        toast.error('Error removing rental record.');
      }
    }
  };

  // Trigger manual node-cron expiry check
  const handleSyncExpiry = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/sync-expired`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Cron sync complete!');
        fetchAllRentals();
      }
    } catch (e) {
      toast.error('Sync failed.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            All Platform Rental Bookings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Oversee all ongoing, completed, and pending customer equipment rentals across the marketplace.
          </p>
        </div>
        <button
          onClick={handleSyncExpiry}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
          title="Run node-cron check to mark expired rentals completed"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Sync Expired Bookings (Cron)
        </button>
      </div>

      {/* Table (PDF page 11: Information: Customer Information, Owner Information, Equipment Name, Rental Duration, Booking Amount, Payment Status, Booking Status) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading all rental bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">Owner Info</th>
                  <th className="py-3.5 px-4">Equipment Name</th>
                  <th className="py-3.5 px-4">Rental Duration</th>
                  <th className="py-3.5 px-4">Booking Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Booking Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rentals.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Customer Info */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{b.customerName}</p>
                      <p className="text-[10px] text-slate-400">{b.customerEmail}</p>
                      <p className="text-[10px] text-slate-500">{b.contactNumber}</p>
                    </td>

                    {/* Owner Info */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{b.ownerName || 'Fleet Owner'}</p>
                      <p className="text-[10px] text-slate-500">{b.ownerEmail}</p>
                    </td>

                    {/* Equipment Name */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.equipmentName}</p>
                      <span className="text-[10px] text-slate-400">Qty: {b.quantity}</span>
                    </td>

                    {/* Rental Duration */}
                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">
                      <div>{b.durationDays} day(s)</div>
                      <span className="text-[10px] text-slate-400">{b.startDate} to {b.endDate}</span>
                    </td>

                    {/* Booking Amount */}
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ${b.totalAmount}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        b.paymentStatus === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}>
                        {b.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {b.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>

                    {/* Booking Status Select */}
                    <td className="py-4 px-4">
                      <select
                        value={b.bookingStatus || 'confirmed'}
                        onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                        className="py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-900 dark:text-white"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteBooking(b._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete rental record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
