'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { 
  Heart, 
  Trash2, 
  Eye, 
  MapPin, 
  Tag, 
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FavoritesPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error('Fetch favorites error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFavorites();
  }, [token]);

  // Remove Favorite handler (PDF Requirement: Customers can remove items from favorites)
  const handleRemoveFavorite = async (equipmentId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/favorites/${equipmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFavorites(prev => prev.filter(f => f.equipmentId !== equipmentId));
        toast.success('Removed from favorites.');
      } else {
        toast.error('Failed to remove.');
      }
    } catch (e) {
      toast.error('Error removing favorite.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Saved Favorites
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your bookmarked machinery and equipment for quick booking and reference.
        </p>
      </div>

      {/* Favorites Table (PDF Page 8 Requirement: Display all currently logged-in customer's favorite equipment in a table format with Actions: View Details, Remove Favorite) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Favorite Equipment Saved</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Click the "Add to Favorites" heart button on any equipment details page to save items here.
            </p>
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Equipment</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Rental Rate</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {favorites.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Equipment Name & Image */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.equipmentName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.equipmentName}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                        {item.category}
                      </span>
                    </td>

                    {/* Rental Price */}
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ${item.rentalPrice} <span className="text-[10px] font-normal text-slate-400">/{item.rentalType}</span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {item.location}
                      </span>
                    </td>

                    {/* Actions: View Details, Remove Favorite */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/equipment/${item.equipmentId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveFavorite(item.equipmentId)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
