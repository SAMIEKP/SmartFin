import React, { useState } from "react";
import {
  ViewMode,
  Role,
  LoanProduct,
  ApplicationItem,
  UserProfile,
} from "./types";
import {
  INITIAL_PRODUCTS,
  INITIAL_USER_APPLICATIONS,
  INITIAL_PROVIDER_APPLICATIONS,
  CRITICAL_VERIFICATIONS,
  USER_PROFILE_KWESI,
  PROVIDER_PROFILE_PHIRI,
} from "./data/mockData";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ApplicationModal } from "./components/ApplicationModal";
import { AddProductModal } from "./components/AddProductModal";
import { SupportModal } from "./components/SupportModal";

import { LandingView } from "./views/LandingView";
import { RegisterView } from "./views/RegisterView";
import { UserDashboardView } from "./views/UserDashboardView";
import { ProviderDashboardView } from "./views/ProviderDashboardView";
import { LoanProductsView } from "./views/LoanProductsView";
import { ProductManagementView } from "./views/ProductManagementView";
import { ApplicationManagementView } from "./views/ApplicationManagementView";
import { ProductDetailsView } from "./views/ProductDetailsView";
import { CalculatorView } from "./views/CalculatorView";
import { MyApplicationsView } from "./views/MyApplicationsView";
import { CreditScoreView } from "./views/CreditScoreView";
import { SettingsView } from "./views/SettingsView";
import { UserProfileView } from "./views/UserProfileView";
import { LoginView } from "./views/LoginView";

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("landing");
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]);
  const [role, setRole] = useState<Role>("user");
  const [userProfile, setUserProfile] =
    useState<UserProfile>(USER_PROFILE_KWESI);
  const [loginRedirectTarget, setLoginRedirectTarget] =
    useState<ViewMode | null>(null);
  const [loginInfoMessage, setLoginInfoMessage] = useState<string | null>(null);

  // App Data State
  const [products, setProducts] = useState<LoanProduct[]>(INITIAL_PRODUCTS);
  const [userApplications, setUserApplications] = useState<ApplicationItem[]>(
    INITIAL_USER_APPLICATIONS,
  );
  const [providerApplications, setProviderApplications] = useState<
    ApplicationItem[]
  >(INITIAL_PROVIDER_APPLICATIONS);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(
    INITIAL_PRODUCTS[0],
  );

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Login default role (pre-select Member or Provider tab)
  const [loginDefaultRole, setLoginDefaultRole] = useState<Role>("user");

  const handleNavigateHistory = (nextView: ViewMode) => {
    if (currentView !== nextView) {
      setViewHistory((prev) => [...prev, currentView]);
      setCurrentView(nextView);
    }
  };

  const handleGoBack = () => {
    const previousView = viewHistory[viewHistory.length - 1];

    if (previousView) {
      setViewHistory((prev) => prev.slice(0, -1));
      setCurrentView(previousView);
      return;
    }

    setCurrentView(
      role === "provider" ? "provider-dashboard" : "user-dashboard",
    );
  };

  // Navigate to login with a pre-selected role
  const handleNavigateLogin = (defaultRole: Role) => {
    setLoginDefaultRole(defaultRole);
    setViewHistory([]);
    setCurrentView("login");
  };

  // Switch role handler
  const handleSwitchRole = (newRole: Role) => {
    setRole(newRole);
    setViewHistory([]);
    if (newRole === "provider") {
      setUserProfile(PROVIDER_PROFILE_PHIRI);
      if (currentView === "landing") {
        setLoginDefaultRole("provider");
        setCurrentView("login");
      } else if (currentView === "user-dashboard") {
        setCurrentView("provider-dashboard");
      }
    } else {
      setUserProfile(USER_PROFILE_KWESI);
      if (currentView === "landing") {
        setLoginDefaultRole("user");
        setCurrentView("login");
      } else if (currentView === "provider-dashboard") {
        setCurrentView("user-dashboard");
      }
    }
  };

  const handleNavigate = (view: ViewMode) => {
    if (view === "provider-dashboard" && role !== "provider") {
      setLoginRedirectTarget("provider-dashboard");
      setLoginInfoMessage(
        "Please sign in with your provider account to access the Provider Portal.",
      );
      setCurrentView("login");
      return;
    }

    setCurrentView(view);
  };

  const handleLoginSuccess = (profile: UserProfile, roleType: Role) => {
    setUserProfile(profile);
    setRole(roleType);
    setViewHistory([]);
    let nextView: ViewMode =
      loginRedirectTarget ??
      (roleType === "provider" ? "provider-dashboard" : "user-dashboard");
    if (nextView === "provider-dashboard" && roleType !== "provider") {
      nextView = "user-dashboard";
    }
    setCurrentView(nextView);
    setLoginRedirectTarget(null);
    setLoginInfoMessage(null);
  };

  // Submit new application
  const handleAddApplication = (newApp: ApplicationItem) => {
    setUserApplications((prev) => [newApp, ...prev]);
    setProviderApplications((prev) => [newApp, ...prev]);
  };

  // Add new provider product
  const handleAddProduct = (newProd: LoanProduct) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Toggle active product status
  const handleToggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p,
      ),
    );
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Update application status
  const handleUpdateAppStatus = (
    appId: string,
    status: ApplicationItem["status"],
    actionText?: string,
  ) => {
    const updater = (prev: ApplicationItem[]) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status, actionRequiredText: actionText } : a,
      );
    setUserApplications(updater);
    setProviderApplications(updater);
  };

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Determine if full-screen layout (without sidebar)
  const isFullScreenLayout =
    currentView === "landing" ||
    currentView === "register" ||
    currentView === "login";

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#008378] selection:text-[#f4fffc]">
      {/* Sidebar for internal views */}
      {!isFullScreenLayout && (
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          role={role}
          userProfile={userProfile}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          onSwitchRole={handleSwitchRole}
        />
      )}

      {/* Main Page Area */}
      <div
        className={`flex-1 flex flex-col ${!isFullScreenLayout ? "lg:pl-64" : ""}`}
      >
        {/* Top Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          role={role}
          userProfile={userProfile}
          onOpenApplyModal={() => setIsApplyModalOpen(true)}
          onSwitchRole={handleSwitchRole}
          onNavigateLogin={handleNavigateLogin}
        />

        {/* View Content Renderer */}
        <main
          className={`flex-1 ${!isFullScreenLayout ? "p-4 md:p-8 max-w-7xl mx-auto w-full" : ""}`}
        >
          {currentView === "landing" && (
            <LandingView
              onNavigate={handleNavigate}
              products={products}
              onSelectProduct={setSelectedProduct}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
            />
          )}

          {currentView === "login" && (
            <LoginView
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              defaultRole={loginDefaultRole}
              infoMessage={loginInfoMessage}
            />
          )}

          {currentView === "register" && (
            <RegisterView
              onNavigate={handleNavigate}
              onSelectUser={(u) => {
                setUserProfile(u);
                setRole(u.role);
              }}
            />
          )}

          {currentView === "user-dashboard" && (
            <UserDashboardView
              userProfile={userProfile}
              applications={userApplications}
              products={products}
              onNavigate={handleNavigate}
              onSelectProduct={setSelectedProduct}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
            />
          )}

          {currentView === "provider-dashboard" && (
            <ProviderDashboardView
              applications={providerApplications}
              criticalVerifications={CRITICAL_VERIFICATIONS}
              onNavigate={handleNavigate}
              onBack={handleGoBack}
              onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
              onUpdateAppStatus={handleUpdateAppStatus}
            />
          )}

          {currentView === "loan-products" && (
            <LoanProductsView
              products={products}
              onNavigate={handleNavigate}
              onSelectProduct={setSelectedProduct}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
            />
          )}

          {currentView === "product-management" && (
            <ProductManagementView
              products={products}
              onNavigate={handleNavigate}
              onBack={handleGoBack}
              onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
              onToggleStatus={handleToggleProductStatus}
              onDeleteProduct={handleDeleteProduct}
              onSelectProduct={setSelectedProduct}
            />
          )}

          {currentView === "application-management" && (
            <ApplicationManagementView
              applications={providerApplications}
              onNavigate={handleNavigate}
              onBack={handleGoBack}
              onUpdateAppStatus={handleUpdateAppStatus}
            />
          )}
            <ProductDetailsView
              product={selectedProduct}
              onNavigate={handleNavigate}
              onBack={handleGoBack}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
              onOpenSupport={() => setIsSupportModalOpen(true)}
            />
          )}

          {currentView === "calculator" && (
            <CalculatorView
              onNavigate={handleNavigate}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
            />
          )}

          {currentView === "my-applications" && (
            <MyApplicationsView
              applications={userApplications}
              onNavigate={handleNavigate}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
              onUpdateAppStatus={handleUpdateAppStatus}
            />
          )}

          {currentView === "credit-score" && (
            <CreditScoreView
              userProfile={userProfile}
              onNavigate={handleNavigate}
              onOpenApplyModal={() => setIsApplyModalOpen(true)}
            />
          )}

          {currentView === "settings" && (
            <SettingsView
              userProfile={userProfile}
              role={role}
              onNavigate={handleNavigate}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentView === "user-profile" && (
            <UserProfileView
              userProfile={userProfile}
              role={role}
              applications={userApplications}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        products={products}
        selectedProduct={selectedProduct}
        onSubmitApplication={handleAddApplication}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}

export default App;
