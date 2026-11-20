'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { 
  PlusCircle, 
  Tag, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Hash, 
  Sparkles, 
  Image as ImageIcon, 
  UploadCloud, 
  FileText, 
  Building,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const categories = [
  'Construction Equipment',
  'Photography Equipment',
  'Vehicles & Transportation',
  'Agriculture Equipment',
  'Electronics',
  'Event Equipment'
];

export default function AddEquipmentPage() {
  const router = useRouter();
  const { user, token, isOwner, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Construction Equipment',
    location: user?.address || 'Austin, TX',
    rentalPrice: '',
    rentalType: 'Daily',
    availableQuantity: 1,
    condition: 'Excellent',
    brand: '',
    model: '',
    image: '',
    rentalTerms: 'Standard inspection checklist upon handover. Valid operator credentials required for heavy machinery.',
    ownerPhone: user?.phone || '+1 (512) 555-0199'
  });

  const [uploadMode, setUploadMode] = useState('url');
  const [submitting, setSubmitting] = useState(false);

  // Safeguard role
  if (!isOwner && !isAdmin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">Equipment Owner privileges are required to list equipment.</p>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      toast.success('Equipment image loaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.rentalPrice || !formData.image.trim()) {
      toast.error('Please enter equipment name, rental price, and equipment image.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Submitting equipment listing for review...');

    try {
      const res = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit equipment.');
      }

      toast.dismiss(toastId);

      await Swal.fire({
        icon: 'success',
        title: 'Equipment Submitted!',
        text: 'Your equipment has been listed with Status: Pending. An administrator will review and approve it shortly.',
        confirmButtonColor: '#2563eb'
      });

      router.push('/dashboard/my-equipment');
    } catch (err) {
      toast.error(err.message || 'Error adding equipment', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          List New Equipment for Rent
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Provide complete equipment specifications, daily rates, and photos to attract verified contractors.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Equipment Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Equipment Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Caterpillar 320 Hydraulic Excavator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Category (Dropdown) *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description & Capabilities *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail operating capacity, engine hours, included accessories..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Rental Price ($) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.rentalPrice}
                onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                placeholder="450"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Rental Type *
              </label>
              <select
                value={formData.rentalType}
                onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Available Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location, Brand, Model, Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Location (City/State) *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Austin, TX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Caterpillar, Sony, Ford"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="320 GC, FX3, F-350"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
              </select>
            </div>
          </div>

          {/* Equipment Image (Image Upload using imgbb or URL) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Equipment Image *
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`font-semibold ${uploadMode === 'url' ? 'text-blue-600 underline' : 'text-slate-400'}`}
                >
                  Direct Link
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`font-semibold ${uploadMode === 'upload' ? 'text-blue-600 underline' : 'text-slate-400'}`}
                >
                  Upload File / ImgBB
                </button>
              </div>
            </div>

            {uploadMode === 'url' ? (
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <label className="cursor-pointer flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-400 text-xs">
                <UploadCloud className="w-5 h-5 text-blue-500" />
                <span>Upload Equipment Photo (Instant Base64/ImgBB Preview)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {formData.image && (
              <div className="mt-3">
                <p className="text-[11px] text-slate-400 mb-1">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-20 rounded-xl object-cover border border-blue-500 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Rental Terms and Conditions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Rental Terms & Operating Conditions
            </label>
            <textarea
              rows={2}
              value={formData.rentalTerms}
              onChange={(e) => setFormData({ ...formData, rentalTerms: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Indicator */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Listing Initial Status:
            </span>
            <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 uppercase tracking-wide text-[10px]">
              Pending Approval
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {submitting ? 'Submitting Equipment...' : 'Submit Equipment for Approval'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
