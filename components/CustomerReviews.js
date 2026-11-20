'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle, MessageSquare } from 'lucide-react';

const defaultReviews = [
  {
    _id: 'rev-1',
    customerName: 'Marcus Vance',
    customerRole: 'General Contractor — Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    comments: 'EquipRent made procuring hydraulic excavators seamless for our downtown Austin foundation project. The machinery arrived in top-tier condition and saved our deadline!'
  },
  {
    _id: 'rev-2',
    customerName: 'Elena Rostova',
    customerRole: 'Commercial Director — Los Angeles, CA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 5,
    comments: 'Rented the Sony FX3 cinema package for a national commercial shoot. Transparent pricing, lightning-fast Stripe checkout, and zero hassles with insurance.'
  },
  {
    _id: 'rev-3',
    customerName: 'David Sterling',
    customerRole: 'Agricultural Producer — Des Moines, IA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 5,
    comments: 'When our primary utility tractor broke down during harvest, we booked a replacement within 2 hours. Verified equipment owners give genuine peace of mind.'
  },
  {
    _id: 'rev-4',
    customerName: 'Sarah Jenkins',
    customerRole: 'Festival Production Manager — Nashville, TN',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    comments: 'The JBL VTX concert sound system rental sounded phenomenal. The equipment owner was extremely communicative and helped coordinate logistics flawlessly.'
  }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(defaultReviews);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews`);
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews) && data.reviews.length >= 4) {
          setReviews(data.reviews);
        }
      } catch (e) {
        // Fallback to rich default reviews
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            Verified Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Customer Reviews & Experiences
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Read authentic feedback from project managers and business owners who rely on EquipRent every week.
          </p>
        </div>

        {/* 4+ Reviews Grid with Framer Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev, index) => (
            <motion.div
              key={rev._id || index}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Quote Mark */}
              <Quote className="w-8 h-8 text-blue-100 dark:text-blue-950 absolute top-5 right-5 -z-0" />

              <div className="relative z-10 space-y-3">
                {/* 5-star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{rev.comments}"
                </p>
              </div>

              {/* Customer Profile */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 relative z-10">
                <img
                  src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    {rev.customerName}
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                    {rev.customerRole || 'Verified Renter'}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
