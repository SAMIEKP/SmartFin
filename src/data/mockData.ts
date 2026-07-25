import { LoanProduct, ApplicationItem, UserProfile, CriticalVerification } from '../types';

export const INITIAL_PRODUCTS: LoanProduct[] = [
  {
    id: 'prod-001',
    code: 'MKW-LN-2024-001',
    name: 'Agri-Business Growth Fund',
    provider: 'Malawi Agricultural Bank',
    providerLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeF9bJU4xUHVKNqllayY9crA5VGXLd1EJmmAe-_dNx8ggwxfy2Gtg0DeRjKRwKmuqb8PRUSpCN9TraWtpBoar5hC-H8x9MqlD6FjGvqr-WHEW5rWAXIgKakhxOmU7u01O5wXHLI6nrjdy7e7NuQQnlFXzWI4xMBeeo-E6V5x5ymvXwRml8OLw5Sc3XZuPu0tVe71ed8NvFY3IyJ5N8yHS3xeqaPA8Mwov_rnGkcZxORNjQ4u2euTcZbS7vaYVA776w4LTXYW-ymfg',
    category: 'agriculture',
    categoryLabel: 'LOAN',
    interestRateMin: 8.5,
    interestRateMax: 12.5,
    rateDisplay: '12.5% p.a.',
    termMaxMonths: 60,
    termDisplay: '60 Mo',
    minAmount: 500000,
    maxAmount: 15000000,
    processingDays: 3,
    collateralRequired: false,
    collateralText: 'None',
    status: 'active',
    applicationsCount: 1248,
    rating: 4.8,
    reviewsCount: 124,
    tags: ['AGRICULTURE', 'SEASONAL PAY', 'EQUIPMENT'],
    isMatch: true,
    description: 'The Agri-Business Growth Fund is specifically designed to support Malawian small-to-medium scale farmers and agricultural processors. This loan facilitates the purchase of modern farming equipment, high-quality seeds, and sustainable irrigation systems to maximize crop yield and promote financial independence within the local agricultural sector.',
    eligibility: [
      'Citizen or Resident of Malawi',
      'Age between 21 and 65 years',
      'Minimum 2 years of farming history',
      'Annual revenue > MWK 5,000,000'
    ],
    documents: [
      'Valid National ID / Passport',
      '3 Months Bank Statements',
      'Land Ownership Documentation',
      'Business Registration (if applicable)'
    ],
    repaymentScheduleSample: [
      { month: 1, principal: 85000, interest: 7200, balance: 4915000 },
      { month: 2, principal: 85000, interest: 7050, balance: 4830000 },
      { month: 3, principal: 85000, interest: 6900, balance: 4745000 }
    ]
  },
  {
    id: 'prod-002',
    code: 'MKW-LN-2024-002',
    name: 'SME Credit Line',
    provider: 'Central Microfinance',
    providerLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqkzbD6NSuZxsIKqwvj7RnD5z5AePFftBJCWv0dsaPQYUn-FKtu4TWTU4HXHDMqXVWY05q8CSY5Cg8d-Y2aeFIwyoKLjMx8MfAFMxn0tdLPCF2VkEW2_vaFQl9xznCZxXn5rH-_Ws4QtG-PGAkTW7-lmOODjN-UIOdycDkA0fj1hdgyYr-GpWM6Wc0PaRhojYac1z9NYMeWCobFyvEkliz7wdQmWU2gxyBbUPxy0eYC_qZLERo8NrTl1lt22dP3qn2zFaJrRxHc8',
    category: 'business',
    categoryLabel: 'LOAN',
    interestRateMin: 14.0,
    interestRateMax: 18.0,
    rateDisplay: '15.0% p.a.',
    termMaxMonths: 24,
    termDisplay: 'Up to 24m',
    minAmount: 1000000,
    maxAmount: 25000000,
    processingDays: 2,
    collateralRequired: true,
    collateralText: 'Business Assets',
    status: 'active',
    applicationsCount: 856,
    rating: 4.6,
    reviewsCount: 89,
    tags: ['BUSINESS ONLY', 'QUICK DISBURSE'],
    isFeatured: true,
    description: 'Flexible revolving working capital loan designed for Malawian SMEs seeking capital expansion, inventory restocking, or operational cashflow buffering.',
    eligibility: [
      'Registered enterprise in Malawi for at least 12 months',
      'Valid Tax Identification Number (TPIN)',
      'Active business bank account with recent cashflow statements'
    ],
    documents: [
      'Certificate of Incorporation / Registration',
      '6 Months Bank Statements',
      'Utility bill of business premises'
    ]
  },
  {
    id: 'prod-003',
    code: 'MKW-SV-2024-005',
    name: 'Woman Entrepreneur Savings',
    provider: 'Malawi Women Trust SACCO',
    category: 'savings',
    categoryLabel: 'SAVINGS',
    interestRateMin: 6.5,
    interestRateMax: 6.5,
    rateDisplay: '6.5% APY',
    termMaxMonths: 12,
    termDisplay: 'Flexi',
    minAmount: 50000,
    maxAmount: 10000000,
    processingDays: 1,
    collateralRequired: false,
    collateralText: 'None',
    status: 'inactive',
    applicationsCount: 3421,
    rating: 4.9,
    reviewsCount: 310,
    tags: ['SAVINGS', 'HIGH YIELD', 'NO FEES'],
    description: 'High-interest specialized savings account tailored for women entrepreneurs looking to build reserve funds for business resilience and emergency safety nets.',
    eligibility: ['Individual woman or female-led business entity in Malawi'],
    documents: ['National Identity Card', 'Proof of Residence']
  },
  {
    id: 'prod-004',
    code: 'MKW-LN-2024-004',
    name: 'Elite Personal Credit',
    provider: 'Malabank Trust',
    providerLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABDTpDKbop4hM0YI-27tXULoNGQ-rpwyV6rNcLp5gyKF2WbqMWI2GkMstFxPoxfqe_mbZAHgnD7vY4mMfD35PY7FS1rHMt2Q85Gv_1SiibQk8g0c0_FfpvmIkcsuiw7cFGnx8b8H-2RrjP3t7ESJWtQL-eXX8vTRjpzDDYZv1RRzawNX2f_QqvYbAUQFgpasn76PC0D_qYx3EysdNHHzdxI-HghqAE48QkxwPZMPJNU0O8MBr6CcUaDvgKabhM4orgp5BUNGNq4qU',
    category: 'loan',
    categoryLabel: 'PERSONAL LOAN',
    interestRateMin: 12.5,
    interestRateMax: 15.0,
    rateDisplay: '12.5% - 15%',
    termMaxMonths: 48,
    termDisplay: 'Up to 48m',
    minAmount: 250000,
    maxAmount: 8000000,
    processingDays: 1,
    collateralRequired: false,
    collateralText: 'NO COLLATERAL',
    status: 'active',
    applicationsCount: 1980,
    rating: 4.7,
    reviewsCount: 142,
    tags: ['NO COLLATERAL', 'FIXED RATE'],
    isMatch: true,
    description: 'Unsecured personal loan for salaried professionals seeking fast, direct-to-account funds for personal projects, home repairs, or debt consolidation.',
    eligibility: [
      'Employed with steady verifiable salary',
      'Minimum monthly income MWK 250,000',
      'Clean credit history'
    ],
    documents: ['Latest 3 Payslips', 'Employer confirmation letter', 'National ID']
  },
  {
    id: 'prod-005',
    code: 'MKW-LN-2024-005',
    name: 'Home-Starter Flex',
    provider: 'Shield Mortgage',
    providerLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDvUnua26_pwshwKp4JUlRWn8-p4MTl3CCw2gl7Fm5S4rFXA3Kc8lk2HUFzOGsNwScU98iFDjr_F81UN3jG38yJIN_8D2OyRJG062bEL6ZE5bDyarDRcr8S8pUolFeEp5SrHqKi1KsdqrRfXvFPYFPD03R7iVJ2PhTgDu8A7z0syhsAhqQ1QUTqrW6e2mwMGl0PDWonUitvn0z8dO6sIbRHTGH2aUw8FzqNzv6jHBas1Nw89CJv4qhRDU3T6BYbHNNRwV0NUssfi8',
    category: 'mortgage',
    categoryLabel: 'MORTGAGE',
    interestRateMin: 8.5,
    interestRateMax: 10.0,
    rateDisplay: '8.5% - 10%',
    termMaxMonths: 300,
    termDisplay: 'Up to 25y',
    minAmount: 5000000,
    maxAmount: 100000000,
    processingDays: 7,
    collateralRequired: true,
    collateralText: 'Property Deed',
    status: 'active',
    applicationsCount: 412,
    rating: 4.8,
    reviewsCount: 56,
    tags: ['MORTGAGE', 'LOW DEPOSIT'],
    isMatch: true,
    description: 'Affordable long-term mortgage designed to help first-time homebuyers construct or acquire property in urban and peri-urban Lilongwe and Blantyre.',
    eligibility: [
      'Malawian citizen over 21 years',
      'Proof of property title or land lease agreement',
      'Minimum 10% downpayment capability'
    ],
    documents: ['Property valuation report', 'Leasehold document', 'Bank statements']
  }
];

export const INITIAL_USER_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'APP-9021',
    applicantName: 'Kwesi Banda',
    applicantInitials: 'KB',
    applicantEmail: 'kwesi.banda@example.mw',
    applicantPhone: '+265 999 123 456',
    applicantLocation: 'Lilongwe',
    productName: 'Home-Starter Flex',
    productId: 'prod-005',
    providerName: 'Shield Mortgage',
    amount: 12000000,
    termMonths: 180,
    status: 'Pending',
    date: 'Oct 24, 2024',
    monthlyRepayment: 108000,
    timeline: [
      { date: 'Oct 24, 2024', title: 'Application Submitted', description: 'Application received via FinAccess digital discovery gateway.', actor: 'Applicant' }
    ],
    notes: ['Applicant provided preliminary salary slip and property valuation report.']
  },
  {
    id: 'APP-8995',
    applicantName: 'Kwesi Banda',
    applicantInitials: 'KB',
    applicantEmail: 'kwesi.banda@example.mw',
    applicantPhone: '+265 999 123 456',
    applicantLocation: 'Lilongwe',
    productName: 'Elite Personal Credit',
    productId: 'prod-004',
    providerName: 'Malabank Trust',
    amount: 4500000,
    termMonths: 36,
    status: 'Approved',
    date: 'Oct 21, 2024',
    monthlyRepayment: 142000,
    timeline: [
      { date: 'Oct 21, 2024', title: 'Funds Disbursed', description: 'MWK 4,500,000 sent via bank wire to applicant account.', actor: 'Malabank Officer' },
      { date: 'Oct 20, 2024', title: 'Application Approved', description: 'Credit Risk team verified payslips and cleared 740 CRB score.', actor: 'Credit Committee' },
      { date: 'Oct 19, 2024', title: 'Application Submitted', description: 'Submitted online.', actor: 'Applicant' }
    ]
  },
  {
    id: 'APP-8950',
    applicantName: 'Kwesi Banda',
    applicantInitials: 'KB',
    applicantEmail: 'kwesi.banda@example.mw',
    applicantPhone: '+265 999 123 456',
    applicantLocation: 'Lilongwe',
    productName: 'Agri-Business Growth Fund',
    productId: 'prod-001',
    providerName: 'Malawi Agricultural Bank',
    amount: 1500000,
    termMonths: 24,
    status: 'Action Required',
    date: 'Oct 18, 2024',
    actionRequiredText: 'Lender requires a copy of your current utility bill for Lilongwe physical residence proof.',
    monthlyRepayment: 68000,
    requestedDocuments: ['Proof of Residence (Utility Bill)'],
    timeline: [
      { date: 'Oct 20, 2024', title: 'Document Requested', description: 'Proof of residence needed before final loan signoff.', actor: 'Risk Desk' },
      { date: 'Oct 18, 2024', title: 'Application Submitted', description: 'Submitted via FinAccess portal.', actor: 'Applicant' }
    ]
  }
];

export const INITIAL_PROVIDER_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'APP-9021',
    applicantName: 'Chikondi Nkhoma',
    applicantInitials: 'CN',
    applicantEmail: 'chikondi.nkhoma@biz.mw',
    applicantPhone: '+265 888 111 222',
    applicantLocation: 'Blantyre',
    productName: 'SME Credit Line',
    productId: 'prod-002',
    providerName: 'FinAccess Institution',
    amount: 8500000,
    termMonths: 24,
    status: 'Under Review',
    date: 'Oct 24, 2024',
    timeline: [
      { date: 'Oct 24, 2024', title: 'Under Review', description: 'Assigned to Senior Risk Officer M. Phiri.', actor: 'System' },
      { date: 'Oct 24, 2024', title: 'Application Submitted', description: 'Submitted with 6 months bank statement.', actor: 'Chikondi Nkhoma' }
    ],
    notes: ['Good cash flow from Blantyre retail business. TPIN is active.']
  },
  {
    id: 'APP-8995',
    applicantName: 'Tiwonge Moyo',
    applicantInitials: 'TM',
    applicantEmail: 'tiwonge.m@school.mw',
    applicantPhone: '+265 999 333 444',
    applicantLocation: 'Zomba',
    productName: 'Elite Personal Credit',
    productId: 'prod-004',
    providerName: 'FinAccess Institution',
    amount: 3200000,
    termMonths: 36,
    status: 'Approved',
    date: 'Oct 23, 2024',
    timeline: [
      { date: 'Oct 23, 2024', title: 'Application Approved', description: 'Approved for MWK 3,200,000 at 12.5% rate.', actor: 'M. Phiri' }
    ]
  },
  {
    id: 'APP-8988',
    applicantName: 'Limbani Banda',
    applicantInitials: 'LB',
    applicantEmail: 'limbani.banda@transport.mw',
    applicantPhone: '+265 888 555 666',
    applicantLocation: 'Mzuzu',
    productName: 'SME Credit Line',
    productId: 'prod-002',
    providerName: 'FinAccess Institution',
    amount: 15000000,
    termMonths: 24,
    status: 'Verification Red',
    date: 'Oct 22, 2024',
    actionRequiredText: 'Biometric discrepancy flagged in National Registry.',
    timeline: [
      { date: 'Oct 22, 2024', title: 'Biometric Flag Raised', description: 'NRIS database check returned mismatched fingerprint scan.', actor: 'Biometric Gate' }
    ]
  },
  {
    id: 'APP-8950',
    applicantName: 'Esme Kumwenda',
    applicantInitials: 'EK',
    applicantEmail: 'esme.k@farms.mw',
    applicantPhone: '+265 999 777 888',
    applicantLocation: 'Lilongwe',
    productName: 'Agri-Business Growth Fund',
    productId: 'prod-001',
    providerName: 'FinAccess Institution',
    amount: 2500000,
    termMonths: 12,
    status: 'Pending',
    date: 'Oct 21, 2024',
    timeline: [
      { date: 'Oct 21, 2024', title: 'Application Submitted', description: 'Awaiting initial triage.', actor: 'Esme Kumwenda' }
    ]
  }
];

export const CRITICAL_VERIFICATIONS: CriticalVerification[] = [
  {
    id: 'ver-1',
    title: 'Biometric Conflict',
    appNumber: '#APP-8988',
    type: 'fingerprint',
    severity: 'high'
  },
  {
    id: 'ver-2',
    title: 'Missing Tax PIN',
    appNumber: '#APP-8950',
    type: 'tax',
    severity: 'medium'
  },
  {
    id: 'ver-3',
    title: 'Collateral Review',
    appNumber: '#APP-9021',
    type: 'collateral',
    severity: 'low'
  }
];

export const USER_PROFILE_KWESI: UserProfile = {
  name: 'Kwesi Banda',
  role: 'user',
  email: 'kwesi.banda@example.mw',
  phone: '+265 999 123 456',
  location: 'Lilongwe, Central Region',
  memberStatus: 'Verified Member',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlvGW0oWUE7Hwq_wNxLjKfeWjyDAJUM0tNF458ZMTx3QaV__CuvNBqLgVBCmiqj5Uk1CR_RDCUcue-LyVNi7rUTul-F60IeqqvWQqD-YdKxgq3Hwovw0XviE9TaeMa-MmlCOLHVXnCLI5JY7CNrAIxAvHI3vHpP2vAjdz23cNt5skJmyJ4rrYK7P_NpXnSm8r4ZA5FNYeP6Ho0yohk4lI7GSFewYEGsc5DUlIlic-7vdXjdYsnsboyJ0IhBtmxSX-f7r_p9trgsNU',
  creditScore: 740,
  bio: 'Agricultural entrepreneur and transport business owner based in Lilongwe. Looking to expand maize processing capacity and secure seasonal farm equipment.',
  financialGoal: 'Expand agricultural seed processing capacity and home starter loan.',
  preferredCategories: ['agriculture', 'business', 'mortgage'],
  twoFactorEnabled: true,
  language: 'en',
  theme: 'light',
  fontSize: 'default'
};

export const PROVIDER_PROFILE_PHIRI: UserProfile = {
  name: 'M. Phiri',
  role: 'provider',
  email: 'm.phiri@finaccess.mw',
  phone: '+265 888 765 432',
  location: 'Blantyre HQ, Southern Region',
  memberStatus: 'Verified Provider',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1-DgLnygrLvxyBWCgjx_45Opdjp8vPojXlVACZm0J2CjwgnPT99BhehtAo3p8n0mSQ3ouOerKIQ42zKvNdW3SOsxgI5yE1uIM1mtL8LY4odFi6iXb6reAyLa8OVzQP4roROSgDBDxRkXx5_o1Jyj5rH4hqhPFMCQWSJiv3MrAq8A0jD6JDGcjZht0hD4k6lJkJemqM9FvjcGbKMuO2p7a0-lssUVXMU5TA93D3LCaRgxue6_f4oQqCQXiAGf_UwpWRXOlfm2_YwQ',
  creditScore: 810,
  bio: 'Senior Credit & Risk Director at FinAccess Microfinance Institution. Overseeing SME credit lines, agricultural financing, and digital loan approvals across Malawi.',
  institutionName: 'FinAccess Microfinance Institution',
  institutionType: 'MFI',
  registrationNumber: 'RBM/MFI/2019/088',
  preferredCategories: ['business', 'agriculture', 'loan'],
  twoFactorEnabled: true,
  language: 'en',
  theme: 'light',
  fontSize: 'default'
};
