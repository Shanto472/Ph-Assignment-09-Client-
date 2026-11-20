import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-12 lg:py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Contact EquipRent Support
          </h1>
          <p className="text-sm text-slate-500">
            Have questions about equipment listings, escrow payments, or operator certifications? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Contact Information</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Main Office</p>
                  <p className="text-slate-500">San Francisco, CA & Austin, TX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Phone Support</p>
                  <p className="text-slate-500">+1 (800) 555-EQUIP</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Address</p>
                  <p className="text-slate-500">support@equiprent.com</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Message sent to EquipRent support team!'); }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Your Name</label>
              <input type="text" required placeholder="Alex Rivera" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Your Email</label>
              <input type="email" required placeholder="alex@company.com" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Message</label>
              <textarea rows={3} required placeholder="How can we help your rental inquiry?" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
