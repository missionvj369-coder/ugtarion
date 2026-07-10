

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

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          dob: string;
          email: string;
          phone: string;
          pincode: string;
          city: string;
          district: string;
          state: string;
          nation: string;
          registered_at: string;
          order: number;
          universe_rank: number;
          nation_rank: number;
          state_rank: number;
          district_rank: number;
          city_rank: number;
          pincode_rank: number;
        };
        Insert: {
          id?: string;
          name: string;
          dob: string;
          email: string;
          phone: string;
          pincode: string;
          city: string;
          district: string;
          state: string;
          nation: string;
          registered_at?: string;
          order?: number;
          universe_rank?: number;
          nation_rank?: number;
          state_rank?: number;
          district_rank?: number;
          city_rank?: number;
          pincode_rank?: number;
        };
        Update: {
          id?: string;
          name?: string;
          dob?: string;
          email?: string;
          phone?: string;
          pincode?: string;
          city?: string;
          district?: string;
          state?: string;
          nation?: string;
          registered_at?: string;
          order?: number;
          universe_rank?: number;
          nation_rank?: number;
          state_rank?: number;
          district_rank?: number;
          city_rank?: number;
          pincode_rank?: number;
        };
      };
      standings: {
        Row: {
          id: string;
          profile_id: string;
          scope: string;
          scope_value: string;
          rank: number;
        };
        Insert: {
          id?: string;
          profile_id: string;
          scope: string;
          scope_value: string;
          rank: number;
        };
        Update: {
          id?: string;
          profile_id?: string;
          scope?: string;
          scope_value?: string;
          rank?: number;
        };
      };
    };
    Functions: {
      register_user_atomic: {
        Args: {
          p_name: string;
          p_dob: string;
          p_email: string;
          p_phone: string;
          p_pincode: string;
          p_city: string;
          p_district: string;
          p_state: string;
          p_nation: string;
        };
        Returns: {
          universal_id: string;
          name: string;
          dob: string;
          email: string;
          phone: string;
          pincode: string;
          city: string;
          district: string;
          state: string;
          nation: string;
          created_at: string;
          global_order: number;
          universe_rank: number;
          nation_rank: number;
          state_rank: number;
          district_rank: number;
          city_rank: number;
          pincode_rank: number;
        }[];
      };
      login_user_atomic: {
        Args: {
          p_identifier: string;
        };
        Returns: {
          universal_id: string;
          name: string;
          dob: string;
          email: string;
          phone: string;
          pincode: string;
          city: string;
          district: string;
          state: string;
          nation: string;
          created_at: string;
          global_order: number;
          universe_rank: number;
          nation_rank: number;
          state_rank: number;
          district_rank: number;
          city_rank: number;
          pincode_rank: number;
        }[];
      };
    };
  };
}

