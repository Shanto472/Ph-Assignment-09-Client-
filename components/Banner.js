'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 transition-colors">
      
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column with Framer Motion */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Trust badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Next-Generation Peer-to-Peer Equipment Network</span>
            </motion.div>

            {/* Main Attractive Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Rent Heavy Machinery & Pro Tools{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                On Demand.
              </span>
            </motion.h1>

            {/* Short Description */}
            <motion.p 
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              EquipRent connects construction teams, photographers, farmers, and event organizers with verified equipment owners. Flexible daily, weekly, or monthly rentals backed by secure Stripe escrow payments.
            </motion.p>

            {/* Key Value Points */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Verified Owners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Stripe Escrow Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Availability</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link
                href="/equipment"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Browse All Equipment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm bg-white dark:bg-slate-900 transition-colors flex items-center justify-center shadow-sm"
              >
                List Your Equipment
              </Link>
            </motion.div>

          </motion.div>

          {/* Right Image Column with Framer Motion */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Visual Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?w=1000&auto=format&fit=crop&q=80"
                  alt="High quality excavator and construction equipment"
                  className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Floating caption on image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-800 shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Featured Heavy Equipment</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Caterpillar 320 Hydraulic</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                    $450/day
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
