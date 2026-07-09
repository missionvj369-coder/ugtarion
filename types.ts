

import React from 'react';

export interface Pillar {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export interface FounderCoFounderDataEntry {
  title: string;
  text: string;
}

export interface Supporter {
  message: string;
  avatar: string;
  name: string;
  // Removed title as per user request
}

export interface ContactSectionData {
  title: string;
  subtitle: string;
}

export interface SupportersSectionData {
  title: string;
  subtitle: string;
}

export interface UniversalIdRecord {
  id: string; // generated order wise, e.g. UGT-00000101
  name: string;
  dob: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  nation: string;
  registeredAt: string;
  order: number; // 1-indexed order
  universeRank: number;
  nationRank: number;
  stateRank: number;
  districtRank: number;
  cityRank: number;
  pincodeRank: number;
}

