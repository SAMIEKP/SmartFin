import React, { useMemo, useState } from "react";
import { ApplicationItem, ApplicationStatus, ViewMode } from "../types";

interface ApplicationManagementViewProps {
  applications: ApplicationItem[];
  onNavigate: (view: ViewMode) => void;
  onBack?: () => void;
  onUpdateAppStatus: (
    appId: string,
    status: ApplicationStatus,
    noteText?: string,
  ) => void;
}

const getServiceLabel = (app: ApplicationItem) => {
  const text = `${app.productName} ${app.applicantName}`.toLowerCase();

  if (/farm|agri|crop|garden/.test(text)) return "Agriculture";
  if (/student|education|school|scholar/.test(text)) return "Education";
  if (/business|enterprise|trade|shop|market|trader/.test(text))
    return "Business";
  if (/home|household|family|personal/.test(text)) return "Personal";
  return "General";
};

const getCategoryLabel = (app: ApplicationItem) => {
  const text = `${app.productName} ${app.applicantName}`.toLowerCase();

  if (/farmer|agri|farm|crop/.test(text)) return "Farmer";
  if (/student|education|school|scholar/.test(text)) return "Student";
  if (/household|home|family|personal/.test(text)) return "Household";
  if (/business|enterprise|trade|shop|market|trader/.test(text))
    return "Small Business";
  return "Other";
};

export const ApplicationManagementView: React.FC<
  ApplicationManagementViewProps
> = ({ applications, onNavigate, onUpdateAppStatus }) => {
  const [selectedService, setSelectedService] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const serviceOptions = useMemo(() => {
    const services = Array.from(new Set(applications.map(getServiceLabel)));
    return ["All", ...services];
  }, [applications]);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(applications.map(getCategoryLabel)));
    return ["All", ...categories];
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const serviceMatches =
        selectedService === "All" || getServiceLabel(app) === selectedService;
      const categoryMatches =
        selectedCategory === "All" ||
        getCategoryLabel(app) === selectedCategory;
      const query = searchQuery.toLowerCase();
      const searchMatches =
        !query ||
        app.applicantName.toLowerCase().includes(query) ||
        app.productName.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query);

      return serviceMatches && categoryMatches && searchMatches;
    });
  }, [applications, searchQuery, selectedCategory, selectedService]);

  const pendingCount = filteredApplications.filter(
    (app) => app.status === "Pending",
  ).length;
  const reviewCount = filteredApplications.filter(
    (app) => app.status === "Under Review",
  ).length;
  const approvedCount = filteredApplications.filter(
    (app) => app.status === "Approved",
  ).length;

  const selectedApplication = applications.find(
    (app) => app.id === selectedApplicationId,
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-[#bcc9c6]/30 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1c30]">
              Application Management
            </h1>
            <p className="text-sm text-[#3d4947] mt-1">
              Review incoming applications by service and borrower category
              before you approve them.
            </p>
          </div>
          <button
            onClick={onBack || (() => onNavigate("provider-dashboard"))}
            className="px-4 py-2.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#eff4ff] p-4 rounded-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
              Pending
            </p>
            <p className="text-2xl font-extrabold text-[#0b1c30]">
              {pendingCount}
            </p>
          </div>
          <div className="bg-[#eff4ff] p-4 rounded-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
              Under Review
            </p>
            <p className="text-2xl font-extrabold text-[#0b1c30]">
              {reviewCount}
            </p>
          </div>
          <div className="bg-[#eff4ff] p-4 rounded-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
              Approved
            </p>
            <p className="text-2xl font-extrabold text-[#0b1c30]">
              {approvedCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#bcc9c6]/30 shadow-xs p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search by applicant, product, or app ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#eff4ff] border border-[#bcc9c6]/30 rounded-xl text-sm text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    selectedService === service
                      ? "bg-[#00685f] text-white"
                      : "bg-[#eff4ff] text-[#3d4947]"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === category
                  ? "bg-[#855300] text-white"
                  : "bg-[#ffddb8] text-[#2a1700]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-dashed border-[#bcc9c6]/50 bg-[#eff4ff]/40">
              <p className="text-sm font-semibold text-[#3d4947]">
                No applications match the current filters.
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const serviceLabel = getServiceLabel(app);
              const categoryLabel = getCategoryLabel(app);
              return (
                <div
                  key={app.id}
                  className="rounded-2xl border border-[#bcc9c6]/30 p-4 space-y-3 bg-[#f8f9ff]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-extrabold text-[#0b1c30]">
                          {app.applicantName}
                        </h2>
                        <span className="text-[11px] font-bold text-[#00685f] bg-[#eff4ff] px-2.5 py-1 rounded-full">
                          {app.id}
                        </span>
                      </div>
                      <p className="text-sm text-[#3d4947] mt-1">
                        {app.productName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <span className="bg-[#d3e4fe] text-[#00685f] px-2.5 py-1 rounded-full font-semibold">
                          {serviceLabel}
                        </span>
                        <span className="bg-[#ffddb8] text-[#855300] px-2.5 py-1 rounded-full font-semibold">
                          {categoryLabel}
                        </span>
                        <span className="text-[#3d4947]">
                          {new Date(app.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-lg font-extrabold text-[#0b1c30]">
                        MWK {app.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#3d4947] mt-1">
                        {app.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedApplicationId(app.id)}
                      className="px-3 py-2 bg-[#d3e4fe] text-[#00685f] text-xs font-bold rounded-xl hover:bg-[#c3dafc] transition-colors cursor-pointer"
                    >
                      Open Details
                    </button>
                    <button
                      onClick={() => onUpdateAppStatus(app.id, "Under Review")}
                      className="px-3 py-2 bg-[#eff4ff] text-[#00685f] text-xs font-bold rounded-xl hover:bg-[#d3e4fe] transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => onUpdateAppStatus(app.id, "Approved")}
                      className="px-3 py-2 bg-[#00685f] text-white text-xs font-bold rounded-xl hover:bg-[#00564e] transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onUpdateAppStatus(app.id, "Declined")}
                      className="px-3 py-2 bg-[#855300] text-white text-xs font-bold rounded-xl hover:bg-[#653e00] transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedApplication && (
        <div className="bg-white rounded-2xl border border-[#bcc9c6]/30 shadow-xs p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#0b1c30]">
                {selectedApplication.applicantName} — Application Details
              </h2>
              <p className="text-sm text-[#3d4947] mt-1">
                Review answers and documents before making a decision.
              </p>
            </div>
            <button
              onClick={() => setSelectedApplicationId(null)}
              className="px-4 py-2.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0b1c30] mb-2">
                  Applicant Answers
                </h3>
                <div className="rounded-2xl bg-[#f8f9ff] border border-[#bcc9c6]/30 p-4 space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
                      Loan Purpose
                    </p>
                    <p className="text-sm text-[#0b1c30] mt-1">
                      {selectedApplication.productName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
                      Requested Amount
                    </p>
                    <p className="text-sm text-[#0b1c30] mt-1">
                      MWK {selectedApplication.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
                      Applicant Location
                    </p>
                    <p className="text-sm text-[#0b1c30] mt-1">
                      {selectedApplication.applicantLocation || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d4947]">
                      Contact Details
                    </p>
                    <p className="text-sm text-[#0b1c30] mt-1">
                      {selectedApplication.applicantEmail || "Not provided"}
                    </p>
                    <p className="text-sm text-[#0b1c30] mt-1">
                      {selectedApplication.applicantPhone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0b1c30] mb-2">
                  Uploaded Documents
                </h3>
                <div className="rounded-2xl bg-[#f8f9ff] border border-[#bcc9c6]/30 p-4 space-y-3">
                  {(selectedApplication.requestedDocuments?.length || 0) > 0 ? (
                    selectedApplication.requestedDocuments?.map(
                      (document, index) => (
                        <div
                          key={`${document}-${index}`}
                          className="flex items-center justify-between rounded-xl bg-white p-3 border border-[#bcc9c6]/20"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#0b1c30]">
                              {document}
                            </p>
                            <p className="text-xs text-[#3d4947] mt-1">
                              Required document
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-[#00685f]">
                            description
                          </span>
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-[#3d4947]">
                      No documents have been uploaded yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
