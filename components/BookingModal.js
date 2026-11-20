'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  Hash,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BookingModal({ equipment, isOpen, onClose }) {
  const router = useRouter();
  const { user, token } = useAuth();

  // Tomorrow as default start date
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const fourDaysStr = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(fourDaysStr);
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState(user?.phone || '+1 (555) 019-2834');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '1204 Industrial Way, Ste 3');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic duration calculation
  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [startDate, endDate]);

  // Dynamic total amount calculation
  const totalAmount = useMemo(() => {
    const rate = equipment?.rentalPrice || 0;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const rType = equipment?.rentalType || 'Daily';

    if (rType === 'Weekly') {
      const weeks = Math.ceil(durationDays / 7);
      return rate * weeks * qty;
    } else if (rType === 'Monthly') {
      const months = Math.ceil(durationDays / 30);
      return rate * months * qty;
    }
    return rate * durationDays * qty;
  }, [equipment, durationDays, quantity]);

  if (!isOpen) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !contactNumber.trim() || !deliveryAddress.trim()) {
      toast.error('Please fill in all required booking details.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('Rental End Date cannot be earlier than Start Date.');
      return;
    }

    if (quantity > equipment.availableQuantity) {
      toast.error(`Only ${equipment.availableQuantity} units available.`);
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Reserving equipment and preparing Stripe checkout...');

    try {
      // 1. Create booking record in backend
      const bookingRes = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          equipmentId: equipment._id,
          startDate,
          endDate,
          quantity: parseInt(quantity, 10),
          contactNumber,
          deliveryAddress,
          additionalNotes
        })
      });

      const bookingData = await bookingRes.json();
      if (!bookingData.success || !bookingData.booking) {
        throw new Error(bookingData.message || 'Failed to initiate booking.');
      }

      const bookingId = bookingData.booking._id;

      // 2. Generate Stripe checkout session
      const checkoutRes = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId })
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutData.success || !checkoutData.url) {
        throw new Error('Failed to create checkout session.');
      }

      toast.success('Booking initiated! Redirecting to Stripe...', { id: toastId });

      // Redirect customer to Stripe Checkout URL (per PDF page 6)
      window.location.href = checkoutData.url;
    } catch (err) {
      toast.error(err.message || 'Booking process error', { id: toastId });
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Confirm Rental Reservation
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {equipment.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
          
          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Rental Start Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Rental End Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quantity & Contact Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Required Quantity *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="1"
                  max={equipment.availableQuantity || 1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Max available: {equipment.availableQuantity} units
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Delivery / Jobsite Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Jobsite or delivery address..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Gate access code, site contact person, trailer requirements..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price Summary Calculation Card */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Rental Duration:</span>
              <span className="font-bold text-slate-900 dark:text-white">{durationDays} day(s)</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Rate Base:</span>
              <span className="font-bold text-slate-900 dark:text-white">${equipment.rentalPrice} / {equipment.rentalType}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Selected Quantity:</span>
              <span className="font-bold text-slate-900 dark:text-white">{quantity} unit(s)</span>
            </div>
            <div className="pt-2 border-t border-blue-200 dark:border-blue-900/60 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900 dark:text-white">Total Estimated Amount:</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400">${totalAmount}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {submitting ? 'Redirecting to Stripe...' : `Confirm & Pay with Stripe ($${totalAmount})`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
