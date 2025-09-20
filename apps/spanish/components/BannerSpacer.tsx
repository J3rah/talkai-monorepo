"use client";

import { useState, useEffect } from 'react';

interface BannerSpacerProps {
  bannerId: string;
  delay: number;
}

const BannerSpacer: React.FC<BannerSpacerProps> = ({ bannerId, delay }) => {
  // Since the banner is now floating, we don't need spacing
  // This component can be left empty or removed entirely
  return null;
};

export default BannerSpacer; 