'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Layers, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Calendar,
  Truck,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OwnerAnalyticsPage() {
  const { token, isOwner, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOwnerAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      if (resData.success && resData.analytics) {
        setData(resData.analytics);
      }
    } catch (err) {
      console.error('Fetch owner analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOwnerAnalytics();
  }, [token]);

  if (!isOwner && !isAdmin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">Equipment Owner privileges required.</p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading owner revenue & fleet performance...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Listed Equipment', value: data.totalListedEquipment, icon: Layers, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60' },
    { label: 'Approved & Active', value: data.approvedEquipment, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60' },
    { label: 'Pending Approvals', value: data.pendingEquipment, icon: Clock, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60' },
    { label: 'Completed Rentals', value: data.completedRentals, icon: Truck, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/60' },
    { label: 'Total Earnings (USD)', value: `$${data.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60' },
    { label: 'Total Customer Orders', value: data.totalBookings, icon: Calendar, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Owner Business Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Equipment Fleet Analytics & Earnings
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOwnerAnalytics}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/dashboard/add-equipment"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Add Equipment
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{card.label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Owner Earnings Chart (PDF Challenge 3) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Earnings Overview ($)</h3>
            <p className="text-xs text-slate-500">Net revenue earned from completed and active equipment bookings</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
            Direct Stripe Deposits
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyEarnings || []}>
              <defs>
                <linearGradient id="ownerEarningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#ownerEarningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
