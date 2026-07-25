import React, { useState } from 'react';
import { ViewMode, ApplicationItem, ApplicationStatus } from '../types';

interface MyApplicationsViewProps {
  applications: ApplicationItem[];
  onNavigate: (view: ViewMode) => void;
  onOpenApplyModal: () => void;
  onUpdateAppStatus: (appId: string, status: ApplicationStatus, actionText?: string) => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  applications,
  onNavigate,
  onOpenApplyModal,
  onUpdateAppStatus,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [uploadingDocName, setUploadingDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [withdrawModalApp, setWithdrawModalApp] = useState<ApplicationItem | null>(null);

  const filteredApps = applications.filter((app) => {
    if (selectedStatusFilter === 'All') return true;
    return app.status === selectedStatusFilter;
  });

  const selectedApp = applications.find((a) => a.id === selectedAppId) || filteredApps[0] || applications[0];

  const handleDocumentUpload = (appId: string) => {
    if (!uploadingDocName.trim()) return;
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      onUpdateAppStatus(appId, 'Under Review', `Uploaded document: ${uploadingDocName}`);
      setUploadingDocName('');
    }, 800);
  };

  const handleConfirmWithdraw = () => {
    if (withdrawModalApp) {
      onUpdateAppStatus(withdrawModalApp.id, 'Declined', 'Application withdrawn by applicant.');
      setWithdrawModalApp(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f]">assignment_turned_in</span>
            <span>My Application Tracker</span>
          </h1>
          <p className="text-xs text-[#3d4947] mt-1">
            Track real-time progress, review timeline events, upload requested documents, or manage active requests.
          </p>
        </div>

        <button
          onClick={onOpenApplyModal}
          className="px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Application</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-wrap gap-2 text-xs font-semibold">
        {['All', 'Pending', 'Under Review', 'Approved', 'Action Required', 'Declined'].map((status) => {
          const count = status === 'All' ? applications.length : applications.filter((a) => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedStatusFilter === status
                  ? 'bg-[#00685f] text-white font-bold shadow-xs'
                  : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#d3e4fe]'
              }`}
            >
              <span>{status}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                selectedStatusFilter === status ? 'bg-white/20 text-white' : 'bg-[#bcc9c6]/30 text-[#0b1c30]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout */}
      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#bcc9c6]/30 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#eff4ff] text-[#00685f] rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">assignment_add</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#0b1c30]">You haven't applied for any services yet</h3>
            <p className="text-xs text-[#3d4947]">
              Explore verified loan products, high-yield SACCO savings, and personal credit across Malawi.
            </p>
          </div>
          <button
            onClick={() => onNavigate('loan-products')}
            className="px-6 py-3 bg-[#00685f] hover:bg-[#008378] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Start Discovery</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#bcc9c6]/30 shadow-xs p-4 space-y-3">
            <h2 className="font-extrabold text-sm text-[#0b1c30] pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>Applications ({filteredApps.length})</span>
            </h2>

            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
                No applications match filter "{selectedStatusFilter}".
              </div>
            ) : (
              <div className="space-y-2 max-h-[550px] overflow-y-auto custom-scrollbar">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-4 rounded-xl border text-xs transition-all cursor-pointer space-y-2 ${
                      selectedApp?.id === app.id
                        ? 'border-[#00685f] bg-[#f4fffc] ring-2 ring-[#00685f]/20'
                        : 'border-[#bcc9c6]/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#0b1c30] text-sm">{app.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Action Required'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'Under Review' || app.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#e5eeff] text-[#00685f]'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0b1c30]">{app.productName}</h3>
                      <p className="text-[11px] text-gray-500">{app.providerName}</p>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="font-bold text-[#00685f]">MWK {app.amount.toLocaleString()}</span>
                      <span className="text-gray-400">{app.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Detail Panel */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-6">
            {selectedApp ? (
              <div className="space-y-6">
                {/* Application Summary Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded-full">
                        {selectedApp.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          selectedApp.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedApp.status === 'Action Required'
                            ? 'bg-amber-100 text-amber-800'
                            : selectedApp.status === 'Under Review' || selectedApp.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedApp.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#e5eeff] text-[#00685f]'
                        }`}
                      >
                        {selectedApp.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0b1c30] mt-1">{selectedApp.productName}</h2>
                    <p className="text-xs text-[#3d4947] font-medium">{selectedApp.providerName}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-500 block">Requested Loan Amount</span>
                    <span className="text-2xl font-extrabold text-[#00685f]">
                      MWK {selectedApp.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-[#0b1c30] uppercase">Processing Stage Stepper</h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 rounded-lg bg-[#00685f] text-white">1. Submitted</div>
                    <div
                      className={`p-2 rounded-lg ${
                        selectedApp.status !== 'Pending' ? 'bg-[#00685f] text-white' : 'bg-[#e5eeff] text-[#00685f]'
                      }`}
                    >
                      2. Under Review
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        selectedApp.status === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : selectedApp.status === 'Declined'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      3. Decision
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        selectedApp.status === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      4. Disbursed
                    </div>
                  </div>
                </div>

                {/* Document Upload Box when requested */}
                {(selectedApp.status === 'Action Required' || (selectedApp.requestedDocuments && selectedApp.requestedDocuments.length > 0)) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <span className="material-symbols-outlined text-base text-amber-600">upload_file</span>
                      <span>Lender Requested Supporting Documents</span>
                    </div>
                    <p className="text-xs text-amber-800">
                      {selectedApp.actionRequiredText || 'Please upload residence or tax proof.'}
                    </p>

                    <div className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="e.g. Utility_Bill_Oct2024.pdf"
                        value={uploadingDocName}
                        onChange={(e) => setUploadingDocName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl outline-none"
                      />
                      <button
                        onClick={() => handleDocumentUpload(selectedApp.id)}
                        disabled={isUploading || !uploadingDocName.trim()}
                        className="px-4 py-2 bg-[#855300] hover:bg-[#653e00] text-white font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : 'Submit Doc'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Timeline Events */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-[#0b1c30] uppercase flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#00685f]">history</span>
                    <span>Application History & Events</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    {(selectedApp.timeline || [
                      { date: selectedApp.date, title: 'Application Submitted', description: 'Received via FinAccess portal.', actor: 'Applicant' }
                    ]).map((evt, idx) => (
                      <div key={idx} className="p-3 bg-[#eff4ff]/60 rounded-xl border border-[#bcc9c6]/30 space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-[#0b1c30]">{evt.title}</span>
                          <span className="text-gray-400">{evt.date}</span>
                        </div>
                        <p className="text-gray-600 text-[11px]">{evt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Withdraw Application Action */}
                {(selectedApp.status === 'Pending' || selectedApp.status === 'Under Review' || selectedApp.status === 'In Progress') && (
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setWithdrawModalApp(selectedApp)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
                    >
                      Withdraw Application
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-gray-400">
                Select an application to view live tracking details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
              <span className="material-symbols-outlined">warning</span>
              <span>Withdraw Application {withdrawModalApp.id}?</span>
            </div>
            <p className="text-xs text-[#3d4947]">
              Are you sure you want to withdraw your application for <strong>{withdrawModalApp.productName}</strong>? The lender will be notified and processing will stop.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setWithdrawModalApp(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl cursor-pointer"
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
