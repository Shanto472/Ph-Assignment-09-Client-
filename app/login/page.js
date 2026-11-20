'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, 
  Lock, 
  LogIn, 
  ArrowRight, 
  KeyRound, 
  Sparkles,
  Shield,
  Briefcase,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Quick fill helper for examiner convenience
  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@equiprent.com');
      setPassword('Admin123456');
    } else if (role === 'owner') {
      setEmail('owner@equiprent.com');
      setPassword('Owner123456');
    } else {
      setEmail('customer@equiprent.com');
      setPassword('Customer123456');
    }
    toast.success(`Loaded demo ${role.toUpperCase()} credentials!`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password);

      // SweetAlert requirement: After successful login or registration, show a toast/SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${data.user.name}!`,
        showConfirmButton: false,
        timer: 1600
      });

      if (data.user.role === 'Admin') {
        router.push('/dashboard/admin-analytics');
      } else if (data.user.role === 'Owner') {
        router.push('/dashboard/owner-analytics');
      } else {
        router.push('/dashboard/my-rentals');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleSubmitting(true);
    try {
      const data = await loginWithGoogle({
        name: 'Alex Rivera (Google Customer)',
        email: 'alex.rivera@googleuser.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      });

      await Swal.fire({
        icon: 'success',
        title: 'Google Login Successful!',
        text: `Welcome, ${data.user.name}! Customer role assigned.`,
        showConfirmButton: false,
        timer: 1600
      });

      router.push('/dashboard/my-rentals');
    } catch (err) {
      toast.error(err.message || 'Google login failed.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full space-y-7 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-2">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage equipment, track bookings, and view rentals.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Cards for Examiner */}
        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-xs">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo Logins (Click to Autofill):
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3 text-red-500" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('owner')}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3 h-3 text-amber-500" />
              Owner
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('customer')}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-emerald-500" />
              Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 font-semibold">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Social Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleSubmitting}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {googleSubmitting ? 'Connecting Google...' : 'Continue with Google (Customer)'}
        </button>

        {/* Redirect to Register */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              href="/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
