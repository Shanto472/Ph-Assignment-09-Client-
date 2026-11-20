'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { 
  Heart, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  ArrowLeft,
  Share2,
  BookmarkCheck,
  Zap,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookingModal from '../../../components/BookingModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EquipmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user, token, loading: authLoading, isAuthenticated } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Safeguard: Check authentication once auth is done loading
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast('Please sign in to access equipment details & rental booking.', { icon: '🔒' });
      router.push(`/login?redirect=/equipment/${id}`);
    }
  }, [authLoading, isAuthenticated, router, id]);

  // Fetch equipment details
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/equipment/${id}`);
        const data = await res.json();
        if (data.success && data.equipment) {
          setEquipment(data.equipment);
        } else {
          toast.error('Equipment not found');
        }
      } catch (err) {
        console.error('Fetch equipment detail error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  // Check if item is in favorites
  useEffect(() => {
    async function checkFav() {
      if (!id || !token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/favorites/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setIsFavorite(data.isFavorite);
        }
      } catch (e) {
        // quiet
      }
    }
    if (token) checkFav();
  }, [id, token]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites.');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const res = await fetch(`${API_BASE_URL}/favorites/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setIsFavorite(false);
          toast.success('Removed from your favorites.');
        }
      } else {
        // Add to favorites
        const res = await fetch(`${API_BASE_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ equipmentId: id })
        });
        const data = await res.json();
        if (data.success) {
          setIsFavorite(true);
          toast.success('Equipment added to your favorites!');
        } else {
          toast.error(data.message || 'Could not add to favorites.');
        }
      }
    } catch (err) {
      toast.error('Favorites update error.');
    } finally {
      setFavLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading equipment specifications...</p>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Equipment Listing Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">This equipment may have been removed or is pending approval.</p>
        <Link href="/equipment" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Return to Equipment Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Add to Favorites Toggle */}
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* High-res Equipment Image */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
              <img
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                  {equipment.category}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-blue-600/90 backdrop-blur-md text-white">
                  {equipment.condition || 'Certified Good'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Equipment Description & Specifications
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {equipment.description}
              </p>

              {/* Specs tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">Brand</span>
                  <span className="font-bold text-slate-900 dark:text-white">{equipment.brand || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">Model</span>
                  <span className="font-bold text-slate-900 dark:text-white">{equipment.model || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">Condition</span>
                  <span className="font-bold text-slate-900 dark:text-white">{equipment.condition || 'Excellent'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">Rate Base</span>
                  <span className="font-bold text-slate-900 dark:text-white">{equipment.rentalType || 'Daily'}</span>
                </div>
              </div>
            </div>

            {/* Rental Terms and Conditions */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Rental Terms & Operating Conditions
              </h2>
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                {equipment.rentalTerms || 'All equipment must be operated by certified personnel. Pre-departure and return inspection checklist will be executed upon delivery.'}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing, Booking Card & Owner Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Booking Action Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6 sticky top-24">
              
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Rental Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    ${equipment.rentalPrice}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / {equipment.rentalType ? equipment.rentalType.toLowerCase() : 'day'}
                  </span>
                </div>
              </div>

              {/* Title & Location */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {equipment.name}
                </h1>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {equipment.location}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    {equipment.rating || 5.0} ({equipment.reviewsCount || 12} reviews)
                  </span>
                </div>
              </div>

              {/* Stock status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">Available Inventory:</span>
                {equipment.availableQuantity > 0 ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {equipment.availableQuantity} units ready
                  </span>
                ) : (
                  <span className="font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Out of stock
                  </span>
                )}
              </div>

              {/* Book Now Button */}
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                disabled={equipment.availableQuantity < 1}
                className="w-full py-4 px-6 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 font-black text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                {equipment.availableQuantity > 0 ? 'Book Equipment Now' : 'Currently Unavailable'}
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Protected by Stripe Escrow & Instant Confirmation</span>
              </div>

              {/* Owner Information Section */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Listed By Verified Equipment Owner
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-base">
                    {equipment.ownerName ? equipment.ownerName[0].toUpperCase() : 'O'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {equipment.ownerName || 'Verified Fleet Owner'}
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </h4>
                    <p className="text-xs text-slate-500">Fleet Supplier Member</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{equipment.ownerEmail}</span>
                  </div>
                  {equipment.ownerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{equipment.ownerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Booking Modal */}
        {isBookingOpen && (
          <BookingModal
            equipment={equipment}
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        )}

      </div>
    </div>
  );
}
