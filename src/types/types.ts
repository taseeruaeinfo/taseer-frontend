// Common types shared across the application

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  stage: string;
  budget: string;
  applications?: number;
  selected?: number;
  description: string;
  platform: string;
  createdAt?: string;
  appliedAt: string;
  duration?: string;
  contractSigned: boolean;
  contractDetails?: string;
  analyticsSubmitted: boolean;
}

export interface Applicant {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorImage: string;
  status: string;
  stage?: string;
  appliedAt: string;
  proposal: string;
  contractSigned?: boolean;
  analyticsSubmitted?: boolean;
  paymentStatus?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderType: 'brand' | 'creator';
  message: string;
  timestamp: string;
}

export interface Analytics {
  impressions: number;
  engagement: string;
  clicks?: number;
  conversions?: number;
  screenshot: string;
  submittedAt: string;
}

export interface Contract {
  id: string;
  campaignId: string;
  creatorId: string;
  brandId: string;
  content: string;
  signedAt?: string;
  status: 'pending' | 'signed' | 'rejected';
}