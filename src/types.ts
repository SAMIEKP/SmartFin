export type Role = 'user' | 'provider' | 'guest';

export type ViewMode = 
  | 'landing'
  | 'login'
  | 'register'
  | 'user-onboarding'
  | 'provider-onboarding'
  | 'user-dashboard'
  | 'provider-dashboard'
  | 'loan-products'
  | 'product-management'
  | 'application-management'
  | 'product-details'
  | 'calculator'
  | 'my-applications'
  | 'credit-score'
  | 'support'
  | 'settings'
  | 'user-profile';

export interface LoanProduct {
  id: string;
  code: string;
  name: string;
  provider: string;
  providerLogo?: string;
  category: 'loan' | 'savings' | 'mortgage' | 'business' | 'insurance' | 'agriculture';
  categoryLabel: string;
  interestRateMin: number;
  interestRateMax: number;
  rateDisplay: string;
  termMaxMonths: number;
  termDisplay: string;
  minAmount: number;
  maxAmount: number;
  processingDays: number;
  collateralRequired: boolean;
  collateralText: string;
  status: 'active' | 'inactive' | 'draft';
  applicationsCount: number;
  rating?: number;
  reviewsCount?: number;
  tags: string[];
  isMatch?: boolean;
  isFeatured?: boolean;
  description: string;
  eligibility: string[];
  documents: string[];
  repaymentScheduleSample?: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export type ApplicationStatus = 
  | 'Pending' 
  | 'Under Review' 
  | 'In Progress' 
  | 'Approved' 
  | 'Verification Red' 
  | 'Action Required' 
  | 'Declined';

export interface ApplicationTimelineEvent {
  date: string;
  title: string;
  description: string;
  actor?: string;
}

export interface ApplicationItem {
  id: string;
  applicantName: string;
  applicantInitials: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantLocation?: string;
  productName: string;
  productId: string;
  providerName: string;
  amount: number;
  termMonths?: number;
  status: ApplicationStatus;
  date: string;
  actionRequiredText?: string;
  monthlyRepayment?: number;
  notes?: string[];
  timeline?: ApplicationTimelineEvent[];
  requestedDocuments?: string[];
  uploadedDocuments?: { name: string; url: string; date: string }[];
}

export interface UserProfile {
  id?: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  location: string;
  memberStatus: string;
  avatarUrl?: string;
  creditScore: number;
  bio?: string;
  financialGoal?: string;
  incomeRange?: string;
  employmentType?: string;
  channelPreference?: 'mobile_money' | 'bank' | 'sacco' | 'any';
  institutionName?: string;
  institutionType?: string;
  registrationNumber?: string;
  isPendingVerification?: boolean;
  preferredCategories?: string[];
  twoFactorEnabled?: boolean;
  language?: string;
  theme?: 'light' | 'dark';
  fontSize?: 'small' | 'default' | 'large';
}

export interface CriticalVerification {
  id: string;
  title: string;
  appNumber: string;
  type: 'fingerprint' | 'tax' | 'collateral';
  severity: 'high' | 'medium' | 'low';
}
