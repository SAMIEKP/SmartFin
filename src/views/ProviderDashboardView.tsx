import React, { useState } from "react";
import {
  ViewMode,
  ApplicationItem,
  CriticalVerification,
  UserProfile,
  ApplicationStatus,
} from "../types";

interface ProviderDashboardViewProps {
  userProfile?: UserProfile;
  applications: ApplicationItem[];
  criticalVerifications: CriticalVerification[];
  onNavigate: (view: ViewMode) => void;
  onOpenAddProductModal: () => void;
  onUpdateAppStatus: (
    appId: string,
    status: ApplicationStatus,
    noteText?: string,
  ) => void;
}

export const ProviderDashboardView: React.FC<ProviderDashboardViewProps> = ({
  userProfile,
  applications,
  criticalVerifications,
  onNavigate,
  onOpenAddProductModal,
  onUpdateAppStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reviewingApp, setReviewingApp] = useState<ApplicationItem | null>(
    null,
  );
  const [newNote, setNewNote] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Pending" && app.status === "Pending") ||
      (selectedStatus === "Under Review" && app.status === "Under Review") ||
      (selectedStatus === "Approved" && app.status === "Approved") ||
      (selectedStatus === "Declined" && app.status === "Declined") ||
      (selectedStatus === "Flagged" && app.status === "Verification Red");

    const matchesQuery =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesQuery;
  });

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (!reviewingApp) return;
    onUpdateAppStatus(reviewingApp.id, newStatus, newNote || undefined);

    setReviewingApp((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            notes: newNote ? [...(prev.notes || []), newNote] : prev.notes,
          }
        : null,
    );

    showToast(`Application ${reviewingApp.id} status updated to ${newStatus}`);
    setNewNote("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Pending Verification Banner */}
      {userProfile?.isPendingVerification && (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl flex items-start gap-3 shadow-xs">
          <span className="material-symbols-outlined text-amber-600 mt-0.5">
            verified_user
          </span>
          <div className="text-xs space-y-1">
            <span className="font-extrabold block text-sm text-amber-950">
              Institution Verification Pending
            </span>
            <p>
              Your provider account is currently under regulatory compliance
              review by FinAccess admin. You can configure products and inspect
              applications; final disbursement actions are flagged until
              verified.
            </p>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#00685f] text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-sm">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0b1c30]">
              {userProfile?.institutionName || "FinAccess Institution"} Portal
            </h1>
            <span className="bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {userProfile?.institutionType || "Licensed Lender Portal"}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#3d4947]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#00685f]">
                business
              </span>
              <span className="font-semibold text-[#0b1c30]">
                {userProfile?.institutionName || "FinAccess Institution"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#00685f]">
                location_on
              </span>
              <span>{userProfile?.location || "Blantyre HQ"}</span>
            </div>
          </div>
          <p className="text-xs text-[#3d4947] mt-1 font-medium">
            Logged in as {userProfile?.name || "M. Phiri"} • Registration No.{" "}
            {userProfile?.registrationNumber || "RBM/MFI/2019/088"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate("product-management")}
            className="px-4 py-2.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              inventory_2
            </span>
            <span>Product Catalog</span>
          </button>

          <button
            onClick={onOpenAddProductModal}
            className="px-5 py-2.5 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_box</span>
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* 4 Performance Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#3d4947]">
            <span className="font-semibold">Applications This Month</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                arrow_upward
              </span>
              <span>12.4%</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0b1c30]">1,284</div>
          <p className="text-[11px] text-gray-500">
            {applications.length} active in queue
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#3d4947]">
            <span className="font-semibold">Approved This Month</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                arrow_upward
              </span>
              <span>8.1%</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#00685f]">956</div>
          <p className="text-[11px] text-gray-500">MWK 840,000,000 disbursed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#3d4947]">
            <span className="font-semibold">Approval Rate</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                arrow_upward
              </span>
              <span>3.1%</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#855300]">74.2%</div>
          <p className="text-[11px] text-gray-500">25.8% rejected or flagged</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#3d4947]">
            <span className="font-semibold">Avg Decision Time</span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                arrow_downward
              </span>
              <span>2.1h</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#4648d4]">
            14.5 Hours
          </div>
          <p className="text-[11px] text-gray-500">Target: Under 24.0 hours</p>
        </div>
      </div>

      {/* Grid: Applications Triage Table + Tasks & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Applications Triage Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#bcc9c6]/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
            <h2 className="font-extrabold text-lg text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#855300]">
                inbox
              </span>
              <span>Applications Triage Queue</span>
            </h2>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-[#eff4ff] p-1 rounded-xl text-xs font-bold">
              {[
                "All",
                "Pending",
                "Under Review",
                "Approved",
                "Declined",
                "Flagged",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedStatus === status
                      ? "bg-[#00685f] text-white"
                      : "text-[#3d4947] hover:text-[#00685f]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside triage panel */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search by applicant name, app ID, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] border border-[#bcc9c6]/30 rounded-xl text-xs text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
            />
          </div>

          {/* Table or Empty State */}
          {applications.length === 0 ? (
            <div className="text-center py-10 space-y-3 bg-[#eff4ff]/40 rounded-2xl border border-dashed border-[#bcc9c6]/50 p-6">
              <div className="w-12 h-12 rounded-full bg-[#ffddb8] text-[#855300] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">
                  inbox
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-[#0b1c30]">
                  You have no applications yet
                </h3>
                <p className="text-xs text-[#3d4947] max-w-sm mx-auto">
                  Add products to the FinAccess catalog or share your
                  institution link to receive applications.
                </p>
              </div>
              <button
                onClick={onOpenAddProductModal}
                className="px-5 py-2.5 bg-[#855300] hover:bg-[#653e00] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  add_box
                </span>
                <span>Add Your First Product</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#3d4947] font-bold border-b border-[#bcc9c6]/30">
                    <th className="p-3 rounded-l-xl">Applicant</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Requested Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">
                        No applications found matching your search or status
                        filter.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#e5eeff] text-[#00685f] flex items-center justify-center font-bold text-[10px]">
                              {app.applicantInitials}
                            </div>
                            <div>
                              <span className="font-bold text-[#0b1c30] block">
                                {app.applicantName}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {app.id} • {app.date}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-[#0b1c30]">
                          {app.productName}
                        </td>
                        <td className="p-3 font-bold text-[#00685f]">
                          MWK {app.amount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : app.status === "Verification Red" ||
                                    app.status === "Declined"
                                  ? "bg-red-100 text-red-800"
                                  : app.status === "Under Review" ||
                                      app.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setReviewingApp(app)}
                            className="px-3 py-1 bg-[#00685f] text-white rounded font-bold hover:bg-[#008378] transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1-Col: Tasks & Critical Verifications Alert Panel */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a]">
                  gpp_maybe
                </span>
                <span>Critical Tasks & Flags</span>
              </h3>
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {criticalVerifications.length} High Flag
              </span>
            </div>

            <div className="space-y-3">
              {criticalVerifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/20 rounded-xl space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#ba1a1a]">
                      {item.title}
                    </span>
                    <span className="font-bold text-[#0b1c30]">
                      {item.appNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3d4947]">
                    {item.type === "fingerprint"
                      ? "National Registry biometric discrepancy flagged."
                      : item.type === "tax"
                        ? "Tax PIN validation pending Malawi Revenue Authority check."
                        : "Land survey valuation needs certified manual sign-off."}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        showToast(
                          `Initiated verification override for ${item.appNumber}`,
                        )
                      }
                      className="px-3 py-1 bg-[#ba1a1a] text-white rounded font-bold text-[10px] hover:bg-[#93000a] transition-colors cursor-pointer"
                    >
                      Resolve Flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provider Application Review Modal */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded-full">
                  {reviewingApp.id}
                </span>
                <h2 className="text-lg font-bold text-[#0b1c30] mt-1">
                  {reviewingApp.productName}
                </h2>
                <p className="text-xs text-[#3d4947]">
                  Applicant: {reviewingApp.applicantName}
                </p>
              </div>

              <button
                onClick={() => setReviewingApp(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Applicant Details */}
            <div className="grid grid-cols-2 gap-3 bg-[#eff4ff] p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-gray-500 block">
                  Requested Amount
                </span>
                <span className="font-bold text-[#00685f]">
                  MWK {reviewingApp.amount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">
                  Current Status
                </span>
                <span className="font-bold text-[#0b1c30]">
                  {reviewingApp.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">
                  Contact Phone
                </span>
                <span className="font-bold text-[#0b1c30]">
                  {reviewingApp.applicantPhone || "+265 999 123 456"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">
                  Location
                </span>
                <span className="font-bold text-[#0b1c30]">
                  {reviewingApp.applicantLocation || "Lilongwe"}
                </span>
              </div>
            </div>

            {/* Status Change Controls */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#0b1c30] block">
                Update Application Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("Under Review")}
                  className="py-2.5 px-3 bg-blue-50 border border-blue-200 text-blue-800 font-bold rounded-xl text-center hover:bg-blue-100 cursor-pointer"
                >
                  Under Review
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Approved")}
                  className="py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-center hover:bg-emerald-100 cursor-pointer"
                >
                  Approve Loan
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Action Required")}
                  className="py-2.5 px-3 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded-xl text-center hover:bg-amber-100 cursor-pointer"
                >
                  Request Docs
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Declined")}
                  className="py-2.5 px-3 bg-red-50 border border-red-200 text-red-800 font-bold rounded-xl text-center hover:bg-red-100 cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>

            {/* Add Internal Note */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#0b1c30] block">
                Add Internal Officer Note
              </label>
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write notes regarding bank statements or risk assessment..."
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl outline-none"
              />
            </div>

            {/* Application Notes History */}
            {reviewingApp.notes && reviewingApp.notes.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#0b1c30] block">
                  Officer Notes
                </span>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {reviewingApp.notes.map((n, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-50 rounded-lg text-gray-700 text-[11px]"
                    >
                      • {n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setReviewingApp(null)}
                className="px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
