'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Star, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FeaturedEquipment() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`${API_BASE_URL}/equipment/featured`);
        const data = await res.json();
        if (data.success && Array.isArray(data.equipment)) {
          setEquipment(data.equipment);
        }
      } catch (err) {
        console.error('Error fetching featured equipment:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleCardClick = (id) => {
    // If user is not logged in, clicking View Details redirects to Login
    if (!isAuthenticated) {
      toast('Please log in to view equipment details and rental terms.', {
        icon: '🔒'
      });
      router.push(`/login?redirect=/equipment/${id}`);
    } else {
      router.push(`/equipment/${id}`);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              Verified Fleet
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Featured Equipment
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
              Discover top-rated machinery and professional gear maintained to manufacturer specifications and ready for immediate deployment.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Equipment Cards Grid with Framer Motion (Equal height & width cards) */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.map((item, index) => (
              <motion.div
                key={item._id}
                className="group flex flex-col h-full bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Equipment Image with Tag */}
                <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-amber-500 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{item.rating || 5.0}</span>
                  </div>
                </div>

                {/* Card Content (flex-1 for equal height) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        {item.availableQuantity > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {item.availableQuantity} In Stock
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Rented Out
                          </span>
                        )}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer: Price & View Details Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ${item.rentalPrice}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                        / {item.rentalType ? item.rentalType.toLowerCase() : 'day'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCardClick(item._id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20 group-hover:scale-105"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
