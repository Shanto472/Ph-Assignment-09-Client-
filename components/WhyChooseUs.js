'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BadgePercent, 
  UserCheck2, 
  CalendarClock, 
  ShieldCheck, 
  CheckCircle,
  Clock,
  Coins,
  Headphones
} from 'lucide-react';

const benefits = [
  {
    icon: BadgePercent,
    title: 'Affordable Rental Prices',
    description: 'Direct owner-to-renter rates eliminate costly middleman markups. Transparent daily, weekly, and monthly packages with zero surprise fees.',
    badge: 'Save up to 35%'
  },
  {
    icon: UserCheck2,
    title: 'Verified Equipment Owners',
    description: 'Every equipment listing undergoes serial verification and routine maintenance audits so you receive job-ready machines every time.',
    badge: '100% Inspected'
  },
  {
    icon: CalendarClock,
    title: 'Flexible Rental Periods',
    description: 'Adapt to jobsite changes with seamless daily extensions, long-term contractor rates, and scheduled contactless delivery and pick-up.',
    badge: 'On-Demand Terms'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Stripe Escrow',
    description: 'Funds are securely held in Stripe escrow until equipment handover and inspection are verified, ensuring mutual peace of mind.',
    badge: 'Encrypted & Safe'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            The EquipRent Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why Contractors & Creators Choose Us
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            We built a smarter equipment marketplace engineered for reliability, safety, and business speed.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-500/50 shadow-sm hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Guaranteed Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
