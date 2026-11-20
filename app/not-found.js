import React from 'react';
import Link from 'next/link';
import { Wrench, Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto shadow-md">
          <span className="text-3xl font-black">404</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Page Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The equipment listing, dashboard view, or URL you requested does not exist or has been relocated.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/equipment"
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Browse Fleet
          </Link>
        </div>
      </div>
    </div>
  );
}
