'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
        
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Payment Cancelled
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Checkout Was Not Completed
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your card has not been charged. The equipment reservation remains on hold. You can retry the checkout at any time.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {bookingId && (
            <Link
              href={`/equipment`}
              className="w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Return to Catalog & Retry
            </Link>
          )}
          <Link
            href="/dashboard/my-rentals"
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center justify-center transition-colors"
          >
            Check My Rentals
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
