'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Heart, 
  User, 
  PlusCircle, 
  FolderKanban, 
  Truck, 
  Users, 
  Layers, 
  BarChart3, 
  LogOut,
  Shield,
  Briefcase
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isAdmin, isOwner, logout } = useAuth();

  // Navigation Links based on Role
  const customerLinks = [
    { name: 'My Rentals', href: '/dashboard/my-rentals', icon: Receipt },
    { name: 'Saved Favorites', href: '/dashboard/favorites', icon: Heart },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User }
  ];

  const ownerLinks = [
    { name: 'Owner Analytics', href: '/dashboard/owner-analytics', icon: BarChart3 },
    { name: 'Add Equipment', href: '/dashboard/add-equipment', icon: PlusCircle },
    { name: 'My Equipment', href: '/dashboard/my-equipment', icon: FolderKanban },
    { name: 'Equipment Rentals', href: '/dashboard/owner-rentals', icon: Truck },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User }
  ];

  const adminLinks = [
    { name: 'Platform Analytics', href: '/dashboard/admin-analytics', icon: BarChart3 },
    { name: 'All Users', href: '/dashboard/all-users', icon: Users },
    { name: 'All Equipment', href: '/dashboard/all-equipment', icon: Layers },
    { name: 'All Rentals', href: '/dashboard/all-rentals', icon: Receipt },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User }
  ];

  let currentLinks = customerLinks;
  let roleBadge = 'Customer';
  let badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';

  if (isAdmin) {
    currentLinks = adminLinks;
    roleBadge = 'Admin';
    badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
  } else if (isOwner) {
    currentLinks = ownerLinks;
    roleBadge = 'Owner';
    badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  }

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 lg:p-6 transition-colors">
      
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
          <img
            src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover border border-blue-500"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <span className={`inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold rounded-full ${badgeColor}`}>
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-1">
            Dashboard Navigation
          </p>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
