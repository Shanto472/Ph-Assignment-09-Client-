'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  ArrowRight, 
  Receipt, 
  AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const { token } = useAuth();

  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verifyTransaction() {
      if (!bookingId) {
        setError('Missing booking reference.');
        setVerifying(false);
        return;
      }

      try {
        const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('equiprent_token') : null);
        const res = await fetch(`${API_BASE_URL}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          body: JSON.stringify({
            sessionId: sessionId || 'simulated_stripe_session',
            bookingId
          })
        });

        const data = await res.json();
        if (data.success) {
          setPaymentData(data);
          toast.success('Payment successfully verified and recorded in payments collection!');
        } else {
          setError(data.message || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Verify error:', err);
        setError('Network error processing payment verification.');
      } finally {
        setVerifying(false);
      }
    }

    verifyTransaction();
  }, [sessionId, bookingId, token]);

  if (verifying) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Stripe Transaction...</h2>
        <p className="text-xs text-slate-500 mt-1">Recording payment record into database collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-red-200 dark:border-red-900/40 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Notice</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{error}</p>
          <Link
            href="/dashboard/my-rentals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm"
          >
            Go to My Rentals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { payment, booking } = paymentData || {};

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Payment Completed & Escrow Protected
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Rental Booking Confirmed!
          </h1>
          <p className="text-xs text-slate-500">
            A confirmation receipt has been sent to your email.
          </p>
        </div>

        {/* Receipt Breakdown Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-left space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500">Equipment:</span>
            <span className="font-bold text-slate-900 dark:text-white">{payment?.equipmentName || booking?.equipmentName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Transaction ID:</span>
            <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
              {payment?.transactionId || 'txn_stripe_success'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Rental Duration:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{booking?.durationDays || 3} day(s)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">Stripe Card Payment</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Total Amount Paid:</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ${payment?.amount || booking?.totalAmount}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/dashboard/my-rentals"
            className="flex-1 py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Receipt className="w-4 h-4" />
            View in My Rentals
          </Link>
          <Link
            href="/equipment"
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center justify-center transition-colors"
          >
            Browse More Equipment
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Verifying transaction...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
