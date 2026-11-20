'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  CalendarCheck, 
  CreditCard, 
  KeyRound, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Find Your Equipment',
    description: 'Search hundreds of machinery and creator gear across your location with category & availability filters.',
    icon: Search
  },
  {
    step: '02',
    title: 'Choose Rental Dates',
    description: 'Select start & end dates. Our real-time calculator computes transparent rates with zero hidden charges.',
    icon: CalendarCheck
  },
  {
    step: '03',
    title: 'Pay with Stripe Escrow',
    description: 'Check out securely via Stripe. Funds remain protected in escrow until equipment is handed over.',
    icon: CreditCard
  },
  {
    step: '04',
    title: 'Pick-Up or Delivery',
    description: 'Coordinate directly with the verified owner for jobsite delivery or convenient depot collection.',
    icon: KeyRound
  }
];

const stats = [
  { label: 'Verified Machinery Listed', value: '1,500+', icon: TrendingUp },
  { label: 'Active Business Renters', value: '8,400+', icon: Users },
  { label: 'Successful Completed Rentals', value: '12,200+', icon: ShieldCheck },
  { label: 'Escrow Protection Rate', value: '100%', icon: Sparkles }
];

export function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How Renting On EquipRent Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            From initial search to on-site operation in four frictionless steps.
          </p>
        </div>

        {/* Steps Grid with Framer Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step Pill */}
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm mb-5 shadow-md shadow-blue-500/25">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
                  Step {item.step}
                </span>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export function PlatformStatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-blue-200 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Banner CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-900 font-bold text-sm shadow-xl hover:bg-blue-50 transition-all hover:scale-105"
          >
            Explore Equipment Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
