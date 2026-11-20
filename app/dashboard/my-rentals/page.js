'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { 
  Receipt, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyRentalsPage() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyRentals() {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setRentals(data.bookings);
        }
      } catch (err) {
        console.error('Fetch rentals error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchMyRentals();
  }, [token]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            My Rental Bookings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track active rentals, payment records, and return deadlines.
          </p>
        </div>
        <Link
          href="/equipment"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
        >
          Book New Equipment
        </Link>
      </div>

      {/* Rentals Table (PDF Requirement page 8: Equipment Name, Rental Start Date, Rental End Date, Booking Date, Total Amount, Payment Status, Booking Status) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading rental history...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Rental Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              You haven't reserved any equipment yet. Explore our fleet to get started.
            </p>
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Browse Equipment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Equipment</th>
                  <th className="py-3.5 px-4">Rental Duration</th>
                  <th className="py-3.5 px-4">Booking Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Equipment Name & Image */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rental.equipmentImage || 'https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?w=150'}
                          alt={rental.equipmentName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {rental.equipmentName}
                          </p>
                          <span className="text-[10px] text-slate-400">Qty: {rental.quantity || 1} unit(s)</span>
                        </div>
                      </div>
                    </td>

                    {/* Rental Start Date to End Date */}
                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">
                      <div>{rental.startDate}</div>
                      <div className="text-[10px] text-slate-400">to {rental.endDate}</div>
                    </td>

                    {/* Booking Date */}
                    <td className="py-4 px-4 text-slate-500">
                      {rental.createdAt ? new Date(rental.createdAt).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ${rental.totalAmount}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      {rental.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Paid (Stripe)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Booking Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] capitalize ${
                        rental.bookingStatus === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : rental.bookingStatus === 'active'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {rental.bookingStatus || 'Confirmed'}
                      </span>
                    </td>

                    {/* View Details Action */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/equipment/${rental.equipmentId}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-block"
                        title="View Equipment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
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
