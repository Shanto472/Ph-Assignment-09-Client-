import React from 'react';
import { ShieldCheck, Target, Users, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 lg:py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            Our Mission & Vision
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            About EquipRent
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            EquipRent is modernizing industrial equipment and professional tool access through a transparent, high-trust peer rental marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Target className="w-8 h-8 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eliminate multi-thousand dollar equipment idle times for machinery owners while providing contractors with affordable on-demand tool access.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stripe Escrow Trust</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every booking is backed by Stripe payment protection and comprehensive inspection protocols before and after rental handovers.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Award className="w-8 h-8 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Certified Standards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equipment listings are moderated and vetted to ensure certified operator safety, clean maintenance records, and immediate jobsite readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
