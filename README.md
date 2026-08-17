# FinAccess Connect

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**FinAccess Connect** is a discovery platform designed to connect individuals (students, farmers, households, small traders, and micro-businesses) with loan and financial service providers across Malawi and beyond.

The platform simplifies financial access by letting users discover, compare, and apply for savings, loan, and payment products. Simultaneously, it equips financial institutions with an analytics-driven dashboard to manage service offerings, process dynamic applications, and track portfolio KPIs.

---

## Key Features

### User (Individual) Experience
* **Guided Onboarding:** Tailored setup questionnaire mapping user segments, financial needs, and geographical location.
* **Targeted Discovery:** Categorized exploration for student loans, agricultural financing, household credit, and small business support.
* **Transparent Comparison:** Clear breakdowns of interest rate structures, tenure options, fee schedules, and repayment models.
* **Dynamic Application Flow:** Multi-step intake forms featuring service-specific custom questions and secure document upload workflows.
* **Real-time Application & Repayment Tracking:** Direct visibility into application pipelines (Applied, Approved, Pending, Rejected) and upcoming repayment schedules.
* **Localized Alerts:** Integrated notification center supported by optional SMS and email reminders.
* **Persistent Localization:** Multi-language support (English / Chichewa) that retains state across user sessions.

### Loan Provider Management
* **Verified Onboarding:** Multi-step registration including institution details, licensing verification, and policy declarations.
* **Executive KPI Dashboard:** Real-time metrics covering incoming application volume, monthly approval rates, and pending reviews.
* **Interactive Analytics:** Time-series charts for application trends and demographic segmentation (Farmer, Student, Household, Small Business).
* **Service Builder:** Multi-step setup tool for publishing loan products with custom eligibility criteria, interest structures, and custom dynamic application questions.
* **Application Processing Engine:** Comprehensive table view featuring state filtering, detailed submission audits, and rapid approval/rejection actions.

### Core Infrastructure & Security
* **Role-Based Access Control (RBAC):** Strict view and route isolation preventing cross-domain access between `USER` and `PROVIDER` roles.
* **Language Persistence:** Seamless i18n synchronization connected to user profiles and local guest sessions.
* **Fintech-Grade Security:** Data handling protocols optimized for sensitive user documents and financial declarations.

---

## Tech Stack

### Frontend
* **Framework:** Next.js (App Router) & React
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui (Radix UI primitives)
* **Icons:** Lucide React

### Backend & Database
* **API Layer:** Next.js API Routes / Node.js
* **Database & Auth:** Supabase (PostgreSQL) with Row Level Security (RLS)
* **Authentication:** JWT & Session-based Auth with RBAC middleware

### Integrations
* **Email:** SendGrid / Mailgun (Transactional messaging)
* **SMS Gateway:** Twilio / Local Regional SMS Providers

---

## Project Structure

```text
FinAccess-Connect/
├── README.md
├── FinAccess_Connect_UI_Spec.md
├── public/
│   └── locales/             # i18n translation dictionaries (en, ny)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Authentication routes (/login, /signup)
│   │   ├── onboarding/      # User guided setup
│   │   ├── dashboard/       # Role-aware dashboards
│   │   │   ├── user/        # Individual borrower dashboard
│   │   │   └── provider/    # Lender management dashboard
│   │   ├── loan/            # Loan application pipelines
│   │   └── settings/        # Account, security & notification settings
│   ├── components/
│   │   ├── layout/          # Navigation, Sidebars, Shells
│   │   ├── auth/            # Auth forms & Role selectors
│   │   ├── user-dashboard/   # Borrower widgets & application lists
│   │   ├── provider-dashboard/ # Lender KPIs & analytics charts
│   │   └── ui/              # Reusable shadcn/ui components
│   ├── lib/
│   │   ├── auth.ts          # Auth helpers & token handlers
│   │   ├── rbac.ts          # Route guard & access rules
│   │   ├── i18n.ts          # Localization setup
│   │   └── supabase.ts      # Database client configuration
│   └── types/               # TypeScript interfaces & models
│       ├── user.ts
│       ├── provider.ts
│       ├── service.ts
│       └── application.ts
```

---

## Getting Started

### Prerequisites
* **Node.js:** `18.x` or higher
* **Package Manager:** `npm`, `pnpm`, or `yarn`
* **Database:** Active Supabase project or PostgreSQL instance

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/finaccess-connect.git
   cd finaccess-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the template file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.


## UI & Architecture Specification

For a complete breakdown of component structures, user journey maps, settings views, and language persistence rules, read the full specification:

  **[FinAccess Connect UI Specification](./FinAccess_Connect_UI_Spec.md)**

---

## Development Roadmap

- [x] UI & Architectural Specification
- [ ] Authentication & Role-Based Access Control (`USER` vs `PROVIDER`)
- [ ] Onboarding & Discovery Workflows
- [ ] Provider Service Setup & Dynamic Form Builder
- [ ] Multi-Step Loan Application Pipeline
- [ ] Interactive Dashboards & Analytics Widgets
- [ ] SMS / Email Transactional Notifications
- [ ] Hardened Security & Multi-Factor Authentication (MFA)

---

## Contributors

1. Samuel Kapalamula
2. Tayamika Msambati
3. Isaac Manda
4. Mwiza Mvula
5. Louis Mahobe

### Live Demo Link: [SmartFin Access Connect](https://smartfinaccess.netlify.app/)