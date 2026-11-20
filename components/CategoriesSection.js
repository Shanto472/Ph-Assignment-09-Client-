'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HardHat, 
  Camera, 
  Truck, 
  Tractor, 
  Cpu, 
  Sparkles,
  ArrowUpRight 
} from 'lucide-react';

const categories = [
  {
    name: 'Construction Equipment',
    slug: 'Construction+Equipment',
    icon: HardHat,
    description: 'Excavators, loaders, compaction rollers, and concrete mixers for heavy worksites.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?w=500&auto=format&fit=crop&q=80',
    color: 'from-amber-500/20 to-orange-500/20',
    accent: 'text-amber-600 dark:text-amber-400',
    count: '150+ Units'
  },
  {
    name: 'Photography Equipment',
    slug: 'Photography+Equipment',
    icon: Camera,
    description: 'Cinema cameras, prime lenses, drone kits, and studio lighting rigs for film & photo.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    color: 'from-blue-500/20 to-cyan-500/20',
    accent: 'text-blue-600 dark:text-blue-400',
    count: '240+ Units'
  },
  {
    name: 'Vehicles & Transportation',
    slug: 'Vehicles+%26+Transportation',
    icon: Truck,
    description: 'Heavy dually trucks, flatbed trailers, cargo vans, and transport haulers.',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&auto=format&fit=crop&q=80',
    color: 'from-emerald-500/20 to-teal-500/20',
    accent: 'text-emerald-600 dark:text-emerald-400',
    count: '95+ Units'
  },
  {
    name: 'Agriculture Equipment',
    slug: 'Agriculture+Equipment',
    icon: Tractor,
    description: 'High-power utility tractors, harvesters, seeders, and irrigation equipment.',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=80',
    color: 'from-green-500/20 to-lime-500/20',
    accent: 'text-green-600 dark:text-green-400',
    count: '80+ Units'
  },
  {
    name: 'Electronics',
    slug: 'Electronics',
    icon: Cpu,
    description: 'Cinematic aerial drones, 3D laser scanners, thermal cameras, and power stations.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=80',
    color: 'from-indigo-500/20 to-purple-500/20',
    accent: 'text-indigo-600 dark:text-indigo-400',
    count: '110+ Units'
  },
  {
    name: 'Event Equipment',
    slug: 'Event+Equipment',
    icon: Sparkles,
    description: 'Concert line arrays, stage trussing, LED video walls, and heavy power generators.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    color: 'from-pink-500/20 to-rose-500/20',
    accent: 'text-pink-600 dark:text-pink-400',
    count: '135+ Units'
  }
];

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            Explore By Industry
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Popular Equipment Categories
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Browse high-grade equipment curated across 6 key rental sectors with transparent rates.
          </p>
        </motion.div>

        {/* Categories Grid with Framer Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={`/equipment?category=${cat.slug}`}
                  className="group relative flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-500/50"
                >
                  {/* Subtle Top Image Thumbnail */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-center shadow-md">
                      <IconComponent className={`w-5 h-5 ${cat.accent}`} />
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-[11px] font-semibold text-white">
                      {cat.count}
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cat.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      View Listings →
                    </div>
                  </div>

                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
