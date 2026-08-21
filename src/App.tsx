import React, { useState, useEffect } from "react";
import {
  ViewMode,
  Role,
  LoanProduct,
  ApplicationItem,
  UserProfile,
} from "./types";
import { UserNotification, ApprovedLoan } from "./types";
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
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const savedView = localStorage.getItem("currentView");
    return (savedView as ViewMode) || "landing";
  });
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

  // Save current view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  // Restore the session from the backend on mount.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Check for activity timeout before restoring session
    const lastActivity = localStorage.getItem("lastActivity");
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
      if (timeSinceLastActivity > fiveDaysInMs) {
        // Auto logout due to inactivity
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("currentView");
        setCurrentView("login");
        setDataError("Your session has expired due to inactivity. Please sign in again.");
        return;
      }
    }

    authAPI.getProfile()
      .then(({ user }) => {
        const profile = mapApiUser(user);
        setIsAuthenticated(true);
        setRole(user.role);
        setUserProfile(profile);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userProfile", JSON.stringify(profile));
        // Update last activity on successful session restore
        localStorage.setItem("lastActivity", Date.now().toString());
        // Preserve the current view instead of defaulting to dashboard
        const savedView = localStorage.getItem("currentView") as ViewMode;
        if (savedView && savedView !== "landing" && savedView !== "login" && savedView !== "register") {
          setCurrentView(savedView);
        } else {
          setCurrentView(user.role === "provider" ? "provider-dashboard" : "user-dashboard");
        }
      })
      .catch(() => {
        // Clear all session data on authentication failure
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("currentView");
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
        setCurrentView("login");
        setDataError("Your session is no longer valid. Please sign in again.");
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
      localStorage.removeItem("currentView");
      localStorage.removeItem("lastActivity");
      setDataError("Your session is no longer valid. Please sign in again.");
    };

    window.addEventListener("finaccess:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("finaccess:unauthorized", handleUnauthorized);
  }, []);

  // App Data State
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [userApplications, setUserApplications] = useState<ApplicationItem[]>([]);
  const [providerApplications, setProviderApplications] = useState<ApplicationItem[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [approvedLoans, setApprovedLoans] = useState<ApprovedLoan[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [productBeingEdited, setProductBeingEdited] = useState<LoanProduct | null>(null);

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
          const [{ products }, { applications }, { notifications: accountNotifications }, { loans }] = await Promise.all([
            userAPI.getProducts(),
            userAPI.getApplications(),
            userAPI.getNotifications(),
            userAPI.getLoans(),
          ]);
          setProducts(products.map(mapApiProduct));
          setUserApplications(applications.map(mapApiApplication));
          setNotifications(accountNotifications);
          setApprovedLoans(loans);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
        if (error instanceof Error && "status" in error && (error as { status: number }).status === 403) {
          window.dispatchEvent(new Event("finaccess:unauthorized"));
          return;
        }
        // Provide more specific error message
        const errorMessage = error instanceof Error ? error.message : "Unable to load account data.";
        if (errorMessage.includes('connect to the backend API')) {
          setDataError("Unable to connect to the backend server. Please ensure the backend is running on port 5000.");
        } else {
          setDataError(errorMessage);
        }
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
          ...(newApp.answers || {}),
        },
        documents: newApp.uploadedDocuments || [],
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
        applicationQuestions: newProd.applicationQuestions,
      });
      setProducts((prev) => [mapApiProduct(product), ...prev]);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to publish product.");
    }
  };

  const handleUpdateProduct = async (updatedProduct: LoanProduct) => {
    try {
      const { product } = await productAPI.updateProduct(updatedProduct.id, {
        name: updatedProduct.name,
        category: updatedProduct.category,
        minAmount: updatedProduct.minAmount,
        maxAmount: updatedProduct.maxAmount,
        interestRate: updatedProduct.interestRateMin,
        tenure: updatedProduct.termDisplay,
        description: updatedProduct.description,
        eligibilityCriteria: updatedProduct.eligibility,
        requiredDocuments: updatedProduct.documents,
        applicationQuestions: updatedProduct.applicationQuestions,
        isActive: updatedProduct.status === "active",
      });
      setProducts((prev) => prev.map((item) => item.id === updatedProduct.id ? mapApiProduct(product) : item));
      setProductBeingEdited(null);
      setIsAddProductModalOpen(false);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to update product.");
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
      if (updated.language) localStorage.setItem('finaccess:language', updated.language);
      // Apply optimistic local update so avatar and profile changes show immediately
      setUserProfile((prev) => {
        const merged = { ...prev, ...updated } as UserProfile;
        localStorage.setItem("userProfile", JSON.stringify(merged));
        return merged;
      });

      // Send update to backend (include avatarUrl if present)
      const payload: Record<string, unknown> = {
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
        location: updated.location,
        income_range: updated.incomeRange,
        institutionName: updated.institutionName,
        institutionType: updated.institutionType,
        registrationNumber: updated.registrationNumber,
        segment: updated.segment,
        district: updated.district,
        cityVillage: updated.cityVillage,
        needs: updated.needs,
        language: updated.language,
        lendingPolicy: updated.lendingPolicy,
        interestPolicy: updated.interestPolicy,
        latePaymentPolicy: updated.latePaymentPolicy,
        dataPrivacyStatement: updated.dataPrivacyStatement,
        notificationPreferences: updated.notificationPreferences,
        twoFactorEnabled: updated.twoFactorEnabled,
      };
      if (updated.avatarUrl !== undefined) payload.avatar_url = updated.avatarUrl;

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

  const isRegistrationFlow =
    currentView === 'register' ||
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
    localStorage.setItem("lastActivity", Date.now().toString());
    setCurrentView(newRole === "provider" ? "provider-dashboard" : "user-dashboard");
  };

  const handleRegistrationSuccess = (profile: UserProfile, newRole: Role, token?: string) => {
    setUserProfile(profile);
    setRole(newRole);
    setIsAuthenticated(true);
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  // Handle logout
  const handleLogout = (redirectTo: "landing" | "login" = "landing") => {
    // Call logout API to invalidate server-side session (fire and forget)
    authAPI.logout().catch(error => {
      console.error('Logout API call failed:', error);
    });
    
    // Clear all local storage and state
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("currentView");
    localStorage.removeItem("lastActivity");
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
    setCurrentView(redirectTo);
  };

  // Track user activity for auto-logout after 5 days
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateLastActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // Update last activity timestamp on mount
    updateLastActivity();

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Set up interval to check for inactivity
    const checkInactivity = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivity");
      const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
      
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        if (timeSinceLastActivity > fiveDaysInMs) {
          // Auto logout due to inactivity
          setDataError("Your session has expired due to inactivity. Please sign in again.");
          // Perform direct logout to avoid dependency issues
          authAPI.logout().catch(error => {
            console.error('Logout API call failed:', error);
          });
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userProfile");
          localStorage.removeItem("lastActivity");
          localStorage.removeItem("currentView");
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
        }
      }
    }, 60000); // Check every minute

    // Clean up event listeners and interval
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(checkInactivity);
    };
  }, [isAuthenticated]);

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
        {!isRegistrationFlow && currentView !== 'login' && (
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            role={role}
            userProfile={userProfile}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
            onNavigateToRegister={(registerRole) => {
              setLoginDefaultRole(registerRole);
              setCurrentView('register');
            }}
          />
        )}

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
              notifications={notifications}
              loans={approvedLoans}
              onNavigateToRegister={(role) => {
                setLoginDefaultRole(role);
                setCurrentView('register');
              }}
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
              defaultRole={loginDefaultRole}
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
              onOpenAddProductModal={() => { setProductBeingEdited(null); setIsAddProductModalOpen(true); }}
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
              onOpenAddProductModal={() => { setProductBeingEdited(null); setIsAddProductModalOpen(true); }}
              onEditProduct={(product) => { setProductBeingEdited(product); setIsAddProductModalOpen(true); }}
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
              canApply={role !== "provider"}
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
        onClose={() => { setIsAddProductModalOpen(false); setProductBeingEdited(null); }}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        userProfile={userProfile}
        existingProducts={products}
        productToEdit={productBeingEdited}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}

export default App;
