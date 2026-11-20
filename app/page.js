'use client';

import React from 'react';
import Banner from '../components/Banner';
import FeaturedEquipment from '../components/FeaturedEquipment';
import CategoriesSection from '../components/CategoriesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import { HowItWorksSection, PlatformStatsSection } from '../components/ExtraSections';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Banner Section (Framer Motion) */}
      <Banner />

      {/* 2. Featured Equipment Section (6 items with limit, Framer Motion) */}
      <FeaturedEquipment />

      {/* 3. Categories Section (Framer Motion) */}
      <CategoriesSection />

      {/* 4. Extra Section 1: How It Works */}
      <HowItWorksSection />

      {/* 5. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 6. Customer Reviews Section (4+ reviews, Framer Motion) */}
      <CustomerReviews />

      {/* 7. Extra Section 2: Platform Stats */}
      <PlatformStatsSection />
    </div>
  );
}
