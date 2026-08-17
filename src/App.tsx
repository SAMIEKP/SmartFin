import React, { useState, useEffect } from "react";
import {
  ViewMode,
  Role,
  LoanProduct,
  ApplicationItem,
  UserProfile,
} from "./types";
import {
  applicationAPI,
  authAPI,
  mapApiApplication,
  mapApiProduct,
  mapApiUser,
  productAPI,
  userAPI,
} from "./services/api";
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ApplicationModal } from './components/ApplicationModal';
import { AddProductModal } from './components/AddProductModal';
import { SupportModal } from './components/SupportModal';

import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { UserDashboardView } from './views/UserDashboardView';
import { ProviderDashboardView } from './views/ProviderDashboardView';
import { LoanProductsView } from './views/LoanProductsView';
import { ProductManagementView } from './views/ProductManagementView';
import { ApplicationManagementView } from './views/ApplicationManagementView';
import { ProductDetailsView } from './views/ProductDetailsView';
import { CalculatorView } from './views/CalculatorView';
import { MyApplicationsView } from './views/MyApplicationsView';
import { CreditScoreView } from './views/CreditScoreView';
import { SettingsView } from './views/SettingsView';
import { UserProfileView } from './views/UserProfileView';
import { UserOnboardingView } from './views/UserOnboardingView';
import { ProviderOnboardingView } from './views/ProviderOnboardingView';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("landing");
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]);
  const [role, setRole] = useState<Role>("user");
  const [userProfile, setUserProfile] =
    useState<UserProfile>({
      id: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      role: 'user',
      memberStatus: 'Pending verification',
      creditScore: 0,
    });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dataError, setDataError] = useState("");

  // Restore the session from the backend on mount.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    authAPI.getProfile()
      .then(({ user }) => {
        const profile = mapApiUser(user);
        setIsAuthenticated(true);
        setRole(user.role);
        setUserProfile(profile);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setCurrentView(user.role === "provider" ? "provider-dashboard" : "user-dashboard");
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userProfile");
      });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setRole("user");
      setUserProfile({
        id: '',
        name: '',
        email: '',
        phone: '',
        location: '',
        role: 'user',
        memberStatus: 'Pending verification',
        creditScore: 0,
      });
      setViewHistory([]);
      setCurrentView("login");
      setDataError("Your session is no longer valid. Please sign in again.");
    };

    window.addEventListener("finaccess:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("finaccess:unauthorized", handleUnauthorized);
  }, []);

  // App Data State
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [userApplications, setUserApplications] = useState<ApplicationItem[]>([]);
  const [providerApplications, setProviderApplications] = useState<ApplicationItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    setDataError("");
    const loadData = async () => {
      try {
        if (role === "provider") {
          const [{ products }, { applications }] = await Promise.all([
            productAPI.getProviderProducts(),
            applicationAPI.getProviderApplications(),
          ]);
          setProducts(products.map(mapApiProduct));
          setProviderApplications(applications.map(mapApiApplication));
        } else {
          const [{ products }, { applications }] = await Promise.all([
            userAPI.getProducts(),
            userAPI.getApplications(),
          ]);
          setProducts(products.map(mapApiProduct));
          setUserApplications(applications.map(mapApiApplication));
        }
      } catch (error) {
        if (error instanceof Error && "status" in error && (error as { status: number }).status === 403) {
          window.dispatchEvent(new Event("finaccess:unauthorized"));
          return;
        }
        setDataError(error instanceof Error ? error.message : "Unable to load account data.");
      }
    };

    void loadData();
  }, [isAuthenticated, role]);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Login default role (pre-select Member or Provider tab)
  const [loginDefaultRole, setLoginDefaultRole] = useState<Role>("user");
  const [loginRedirectTarget, setLoginRedirectTarget] = useState<ViewMode | null>(null);
  const [loginInfoMessage, setLoginInfoMessage] = useState<string | null>(null);

  const handleNavigate = (nextView: ViewMode) => {
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

  // Submit new application
  const handleAddApplication = async (newApp: ApplicationItem) => {
    try {
      const { application } = await applicationAPI.createApplication({
        productId: newApp.productId,
        answers: {
          amount: newApp.amount,
          applicantName: newApp.applicantName,
          phone: newApp.applicantPhone,
          location: newApp.applicantLocation,
        },
        documents: [],
      });
      setUserApplications((prev) => [mapApiApplication(application), ...prev]);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to submit application.");
    }
  };

  // Add new provider product
  const handleAddProduct = async (newProd: LoanProduct) => {
    try {
      const { product } = await productAPI.createProduct({
        name: newProd.name,
        category: newProd.category,
        minAmount: newProd.minAmount,
        maxAmount: newProd.maxAmount,
        interestRate: newProd.interestRateMin,
        tenure: newProd.termDisplay,
        description: newProd.description,
        eligibilityCriteria: newProd.eligibility,
        requiredDocuments: newProd.documents,
      });
      setProducts((prev) => [mapApiProduct(product), ...prev]);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to publish product.");
    }
  };

  // Toggle active product status
  const handleToggleProductStatus = async (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    try {
      const { product: updated } = await productAPI.updateProduct(id, { isActive: product.status !== "active" });
      setProducts((prev) => prev.map((item) => item.id === id ? mapApiProduct(updated) : item));
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to update product.");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      await productAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to delete product.");
    }
  };

  // Update application status
  const handleUpdateAppStatus = async (
    appId: string,
    status: ApplicationItem["status"],
    actionText?: string,
  ) => {
    const backendStatus = {
      "Pending": "pending",
      "Under Review": "under_review",
      "In Progress": "under_review",
      "Approved": "approved",
      "Declined": "rejected",
      "Verification Red": "under_review",
      "Action Required": "under_review",
    }[status];
    try {
      const { application } = await applicationAPI.updateApplicationStatus(appId, {
        status: backendStatus,
        notes: actionText,
      });
      const updated = mapApiApplication(application);
      setUserApplications((prev) => prev.map((a) => a.id === appId ? { ...updated, actionRequiredText: actionText } : a));
      setProviderApplications((prev) => prev.map((a) => a.id === appId ? { ...updated, actionRequiredText: actionText } : a));
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to update application.");
    }
  };

  // Profile update handler
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    try {
      // Apply optimistic local update so avatar and profile changes show immediately
      setUserProfile((prev) => {
        const merged = { ...prev, ...updated } as UserProfile;
        localStorage.setItem("userProfile", JSON.stringify(merged));
        return merged;
      });

      // Send update to backend (include avatarUrl if present)
      const payload: Record<string, unknown> = {
        name: updated.name,
        phone: updated.phone,
        location: updated.location,
        income_range: updated.incomeRange,
      };
      if (updated.avatarUrl) payload.avatar_url = updated.avatarUrl;

      const { user } = await userAPI.updateProfile(payload);
      const profileFromServer = mapApiUser(user);
      // Preserve client-side avatarUrl if backend doesn't return it
      const finalProfile = { ...profileFromServer, avatarUrl: updated.avatarUrl || (userProfile && userProfile.avatarUrl) } as UserProfile;
      setUserProfile(finalProfile);
      localStorage.setItem("userProfile", JSON.stringify(finalProfile));
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to update profile.");
    }
  };

  // Determine if full-screen layout (without sidebar)
  const isFullScreenLayout =
    currentView === 'landing' ||
    currentView === 'register' ||
    currentView === 'login' ||
    currentView === 'user-onboarding' ||
    currentView === 'provider-onboarding';

  // Handle login success
  const handleLoginSuccess = (profile: UserProfile, newRole: Role, token?: string) => {
    setUserProfile(profile);
    setRole(newRole);
    setIsAuthenticated(true);
    setViewHistory([]);
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setCurrentView(newRole === "provider" ? "provider-dashboard" : "user-dashboard");
  };

  const handleRegistrationSuccess = (profile: UserProfile, newRole: Role, token?: string) => {
    setUserProfile(profile);
    setRole(newRole);
    setIsAuthenticated(true);
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userProfile", JSON.stringify(profile));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setRole("user");
    setUserProfile({
      id: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      role: 'user',
      memberStatus: 'Pending verification',
      creditScore: 0,
    });
    setViewHistory([]);
    setCurrentView("landing");
  };

  return (
    <div className="flex h-screen">
      {!isFullScreenLayout && (
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          role={role}
          userProfile={userProfile}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          onLogout={handleLogout}
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
        />

        {/* View Content Renderer */}
        <main
          className={`flex-1 ${!isFullScreenLayout ? "p-4 md:p-8 max-w-7xl mx-auto w-full" : ""}`}
        >
          {dataError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {dataError}
            </div>
          )}
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
              onSelectUser={(u, newRole, token) => {
                handleRegistrationSuccess(u, newRole, token);
              }}
            />
          )}

          {currentView === 'user-onboarding' && (
            <UserOnboardingView
              userProfile={userProfile}
              onNavigate={setCurrentView}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentView === 'provider-onboarding' && (
            <ProviderOnboardingView
              userProfile={userProfile}
              onNavigate={setCurrentView}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentView === 'user-dashboard' && (
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
              userProfile={userProfile}
              applications={providerApplications}
              criticalVerifications={[]}
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

          {currentView === "product-details" && (
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
        userProfile={userProfile}
        existingProducts={products}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}

export default App;
