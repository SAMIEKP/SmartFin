import { ApplicationItem, ApplicationStatus, LoanProduct, Role, UserProfile, UserNotification, ApprovedLoan } from '../types';

// In development, use Vite's same-origin proxy so localhost/127.0.0.1 mismatches
// do not cause browser fetch failures. Set VITE_API_BASE_URL for production.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://finaccess-backend.onrender.com/api')).replace(/\/$/, '');

// Debug: Log the API URL being used
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');

export interface ApiUser {
  id: string;
  email: string;
  role: Role;
  name?: string;
  phone?: string;
  location?: string;
  income_range?: string;
  institution_name?: string;
  contact_person?: string;
  institution_type?: string;
  registration_number?: string;
  segment?: string;
  district?: string;
  city_village?: string;
  language?: string;
  needs?: string[];
  profile_status?: string;
  provider_status?: string;
  lending_policy?: string;
  interest_policy?: string;
  late_payment_policy?: string;
  data_privacy_statement?: string;
  notification_preferences?: { sms?: boolean; email?: boolean; in_app?: boolean };
  is_verified?: boolean;
  created_at?: string;
}

export interface ApiLoanProduct {
  id: string;
  provider_id: string;
  provider_name?: string;
  name: string;
  category: LoanProduct['category'];
  min_amount?: number | string;
  max_amount?: number | string;
  interest_rate?: number | string;
  tenure?: string;
  description?: string;
  eligibility_criteria?: string[] | string;
  required_documents?: string[] | string;
  media?: { id: string; name: string; mimeType: string; sizeBytes: number; url: string }[];
  application_questions?: string[] | string;
  interest_type?: 'fixed' | 'variable';
  repayment_schedule?: 'monthly' | 'weekly';
  fees?: string[] | string;
  is_active: boolean;
  created_at?: string;
}

export interface ApiApplication {
  id: string;
  user_id: string;
  product_id: string;
  answers?: Record<string, unknown>;
  documents?: unknown;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  location?: string;
  product_name?: string;
  product_category?: string;
  institution_name?: string;
  provider_name?: string;
  required_documents?: string[] | string;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}, includeAuth = true): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (includeAuth && token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    console.log(`API Request: ${API_BASE_URL}${endpoint}`, options);
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    console.log(`API Response status: ${response.status}`);
  } catch (error) {
    console.error('API Request failed:', error);
    throw new Error(
      'Unable to connect to the backend API. Start it with "cd backend && npm run dev", then try again.',
    );
  }
  const raw = await response.text();
  console.log('API Response raw:', raw);
  let data: { message?: string; error?: string } & T;
  try {
    data = raw ? JSON.parse(raw) : ({} as T);
  } catch {
    data = {} as T;
  }

  if (!response.ok) {
    console.error('API Error:', data);
    if (includeAuth && (response.status === 401 || response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userProfile');
      window.dispatchEvent(new Event('finaccess:unauthorized'));
    }
    throw new ApiError(data.message || data.error || `Request failed (${response.status})`, response.status);
  }
  return data;
}

const numberValue = (value: number | string | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const listValue = (value: string[] | string | undefined, fallback: string[] = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : value.split(';').map((item) => item.trim()).filter(Boolean);
    } catch {
      return value.split(';').map((item) => item.trim()).filter(Boolean);
    }
  }
  return fallback;
};

export const mapApiUser = (user: ApiUser): UserProfile => {
  if (user.language) localStorage.setItem('finaccess:language', user.language);
  return ({
  id: user.id,
  name: user.name || user.contact_person || user.institution_name || 'FinAccess member',
  role: user.role,
  email: user.email,
  phone: user.phone || '',
  location: user.location || '',
  incomeRange: user.income_range || '',
  institutionName: user.institution_name,
  institutionType: user.institution_type,
    registrationNumber: user.registration_number,
    language: user.language || localStorage.getItem('finaccess:language') || 'en',
    segment: user.segment,
    district: user.district,
    cityVillage: user.city_village,
    needs: user.needs || [],
    profileStatus: user.profile_status,
    providerStatus: user.provider_status,
    lendingPolicy: user.lending_policy,
    interestPolicy: user.interest_policy,
    latePaymentPolicy: user.late_payment_policy,
    dataPrivacyStatement: user.data_privacy_statement,
    notificationPreferences: user.notification_preferences,
  memberStatus: user.is_verified ? 'Verified member' : 'Pending verification',
  isPendingVerification: user.is_verified === false,
  creditScore: 0,
  });
};

export const mapApiProduct = (product: ApiLoanProduct): LoanProduct => {
  const minRate = numberValue(product.interest_rate);
  const eligibility = listValue(product.eligibility_criteria);
  const documents = listValue(product.required_documents);
  const applicationQuestions = listValue(product.application_questions);
  const term = product.tenure || 'Flexible';
  return {
    id: product.id,
    code: product.id.slice(0, 8).toUpperCase(),
    name: product.name,
    provider: product.provider_name || 'Financial provider',
    category: product.category,
    categoryLabel: product.category.toUpperCase(),
    interestRateMin: minRate,
    interestRateMax: minRate,
    rateDisplay: minRate ? `${minRate}% p.a.` : 'Contact provider',
    termMaxMonths: numberValue(term.replace(/\D/g, ''), 12),
    termDisplay: term,
    minAmount: numberValue(product.min_amount),
    maxAmount: numberValue(product.max_amount),
    processingDays: 0,
    collateralRequired: false,
    collateralText: 'Contact provider',
    status: product.is_active ? 'active' : 'inactive',
    applicationsCount: 0,
    tags: [product.category.toUpperCase()],
    description: product.description || '',
    eligibility,
    documents,
    applicationQuestions,
    interestType: product.interest_type,
    repaymentSchedule: product.repayment_schedule,
    fees: listValue(product.fees),
  };
};

const statusMap: Record<ApiApplication['status'], ApplicationStatus> = {
  pending: 'Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Declined',
};

export const mapApiApplication = (application: ApiApplication): ApplicationItem => {
  const applicantName = application.user_name || 'Applicant';
  return {
    id: application.id,
    applicantName,
    applicantInitials: applicantName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    applicantEmail: application.user_email,
    applicantPhone: application.user_phone,
    applicantLocation: application.location,
    productName: application.product_name || 'Financial product',
    productId: application.product_id,
    providerName: application.provider_name || application.institution_name || 'Financial provider',
    amount: numberValue(application.answers?.amount as number | string | undefined),
    status: statusMap[application.status],
    date: application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Recently',
    notes: application.notes ? [application.notes] : undefined,
    uploadedDocuments: application.media?.map((media) => ({ name: media.name, url: media.url, date: application.created_at || new Date().toISOString() })) || (Array.isArray(application.documents) ? application.documents as { name: string; url: string; date: string }[] : undefined),
    requestedDocuments: listValue(application.required_documents),
    answers: application.answers,
  };
};

export const authAPI = {
  register: (userData: Record<string, unknown>) => apiRequest<{ verificationId: string; message: string; verificationCode?: string }>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }, false),
  verifyRegistration: (verificationId: string, code: string) => apiRequest<{ token: string; user: ApiUser; message: string }>('/auth/verify-registration', { method: 'POST', body: JSON.stringify({ verificationId, code }) }, false),
  login: (credentials: { email: string; password: string }) => apiRequest<{ token: string; user: ApiUser }>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, false),
  getProfile: () => apiRequest<{ user: ApiUser }>('/auth/profile'),
};

export const userAPI = {
  updateProfile: (profileData: Record<string, unknown>) => apiRequest<{ user: ApiUser }>('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getApplications: () => apiRequest<{ applications: ApiApplication[] }>('/users/applications'),
  getProducts: (params?: { category?: string; minAmount?: number; maxAmount?: number }) => {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => value !== undefined && search.set(key, String(value)));
    return apiRequest<{ products: ApiLoanProduct[] }>(`/users/products${search.toString() ? `?${search}` : ''}`);
  },
  getNotifications: () => apiRequest<{ notifications: UserNotification[] }>('/applications/user/notifications'),
  markNotificationRead: (id: string) => apiRequest<{ message: string }>(`/applications/user/notifications/${id}/read`, { method: 'PUT' }),
  getLoans: () => apiRequest<{ loans: ApprovedLoan[] }>('/applications/user/loans'),
};

export const productAPI = {
  createProduct: (productData: Record<string, unknown>) => apiRequest<{ product: ApiLoanProduct }>('/products', { method: 'POST', body: JSON.stringify(productData) }),
  getProviderProducts: () => apiRequest<{ products: ApiLoanProduct[] }>('/products'),
  updateProduct: (productId: string, productData: Record<string, unknown>) => apiRequest<{ product: ApiLoanProduct }>(`/products/${productId}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (productId: string) => apiRequest<{ message: string }>(`/products/${productId}`, { method: 'DELETE' }),
};

export const applicationAPI = {
  createApplication: (applicationData: Record<string, unknown>) => apiRequest<{ application: ApiApplication }>('/applications', { method: 'POST', body: JSON.stringify(applicationData) }),
  getApplicationDetails: (applicationId: string) => apiRequest<{ application: ApiApplication }>(`/applications/${applicationId}`),
  getProviderApplications: (status?: string) => apiRequest<{ applications: ApiApplication[] }>(`/applications/provider/all${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  updateApplicationStatus: (applicationId: string, statusData: Record<string, unknown>) => apiRequest<{ application: ApiApplication }>(`/applications/${applicationId}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
};

export const healthCheck = () => fetch(`${API_BASE_URL.replace(/\/api$/, '')}/health`).then((response) => response.json());
