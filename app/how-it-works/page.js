import React from 'react';
import { HowItWorksSection, PlatformStatsSection } from '../../components/ExtraSections';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 flex flex-col">
      <HowItWorksSection />
      <PlatformStatsSection />
    </div>
  );
}
