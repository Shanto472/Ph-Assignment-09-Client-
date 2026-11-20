'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { 
  Truck, 
  Receipt, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OwnerRentalsPage() {
  const { token, isOwner, isAdmin } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwnerRentals() {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/owner`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setRentals(data.bookings);
        }
      } catch (err) {
        console.error('Fetch owner rentals error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchOwnerRentals();
  }, [token]);

  // Update rental status handler (e.g. mark completed/active)
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRentals(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: newStatus } : b));
        toast.success(`Booking status changed to ${newStatus}!`);
      } else {
        toast.error('Failed to update status.');
      }
    } catch (e) {
      toast.error('Error updating status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          My Equipment Rental Orders
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor incoming customer reservations, jobsite deployments, and payout statuses.
        </p>
      </div>

      {/* Table (PDF page 10: Columns: Customer Information, Equipment Information, Rental Duration, Required Quantity, Booking Amount, Payment Status, Booking Status) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading rental reservations...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Truck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Equipment Rentals Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              When customers book your equipment, their orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">Equipment Info</th>
                  <th className="py-3.5 px-4">Rental Duration</th>
                  <th className="py-3.5 px-4">Required Quantity</th>
                  <th className="py-3.5 px-4">Booking Amount</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rentals.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Customer Information */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.customerName}</p>
                        <p className="text-[10px] text-slate-400">{item.customerEmail}</p>
                        <p className="text-[10px] text-slate-500">{item.contactNumber}</p>
                      </div>
                    </td>

                    {/* Equipment Information */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.equipmentImage || 'https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?w=150'}
                          alt={item.equipmentName}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.equipmentName}</p>
                          <span className="text-[10px] text-slate-400">{item.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rental Duration */}
                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">
                      <div>{item.durationDays} day(s)</div>
                      <span className="text-[10px] text-slate-400">{item.startDate} to {item.endDate}</span>
                    </td>

                    {/* Required Quantity */}
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      {item.quantity} unit(s)
                    </td>

                    {/* Booking Amount */}
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ${item.totalAmount}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        item.paymentStatus === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}>
                        {item.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>

                    {/* Booking Status Selector */}
                    <td className="py-4 px-4">
                      <select
                        value={item.bookingStatus || 'confirmed'}
                        onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                        className="py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-900 dark:text-white"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active (On Site)</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
