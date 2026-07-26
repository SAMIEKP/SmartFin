import React, { useState } from "react";
import { ViewMode, LoanProduct } from "../types";

interface ProductDetailsViewProps {
  product: LoanProduct | null;
  onNavigate: (view: ViewMode) => void;
  onBack?: () => void;
  onOpenApplyModal: () => void;
  onOpenSupport: () => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  onNavigate,
  onBack,
  onOpenApplyModal,
  onOpenSupport,
}) => {
  if (!product) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-[#bcc9c6]/30">
        <h2 className="text-xl font-bold text-[#0b1c30]">
          No Product Selected
        </h2>
        <button
          onClick={() => onNavigate("loan-products")}
          className="mt-4 px-6 py-2 bg-[#00685f] text-white font-bold rounded-xl text-xs"
        >
          Return to Product Directory
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    "overview" | "eligibility" | "documents" | "repayment"
  >("overview");
  const [calcAmount, setCalcAmount] = useState<number>(
    product.minAmount || 2000000,
  );
  const [calcMonths, setCalcMonths] = useState<number>(24);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Simple amortization math
  const monthlyRate = product.interestRateMin / 100 / 12;
  const monthlyRepayment = Math.round(
    (calcAmount * monthlyRate * Math.pow(1 + monthlyRate, calcMonths)) /
      (Math.pow(1 + monthlyRate, calcMonths) - 1),
  );

  const faqs = [
    {
      q: "What happens if my seasonal crop harvest is delayed by rain?",
      a: "This product includes a grace period option of up to 90 days for agricultural clients. You can request a temporary repayment freeze through your loan officer.",
    },
    {
      q: "Can I pay off the loan early without early termination penalties?",
      a: "Yes, early settlement is 100% penalty-free under Malawi Reserve Bank financial consumer protection regulations.",
    },
    {
      q: "Do I need physical land title deeds as collateral?",
      a: "No, this product does not require physical land title collateral. Verifiable farming revenue history or SACCO guarantor sign-off is accepted.",
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#3d4947]">
        <button
          onClick={onBack || (() => onNavigate("loan-products"))}
          className="hover:text-[#00685f] flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back</span>
        </button>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <button
          onClick={() => onNavigate("loan-products")}
          className="hover:text-[#00685f]"
        >
          Loan Products
        </button>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="capitalize">{product.category}</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#00685f] font-bold">{product.name}</span>
      </nav>

      {/* Product Hero Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-3 py-1 rounded-full">
              {product.categoryLabel}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              ★ {product.rating || 4.8} ({product.reviewsCount || 124} verified
              reviews)
            </span>
            <span className="text-[10px] font-bold text-[#00685f] bg-[#e5eeff] px-2.5 py-0.5 rounded-full">
              Reserve Bank Standards Compliant
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#0b1c30]">
            {product.name}
          </h1>
          <p className="text-sm font-semibold text-[#3d4947]">
            Offered by {product.provider}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {product.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#eff4ff] text-[#00685f] px-2.5 py-1 rounded-md font-semibold"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Provider logo & CTA */}
        <div className="bg-[#f4fffc] p-5 rounded-2xl border border-[#008378]/30 text-center space-y-3 w-full md:w-64 shrink-0">
          {product.providerLogo && (
            <img
              src={product.providerLogo}
              alt={product.provider}
              className="w-12 h-12 object-contain mx-auto rounded-xl bg-white p-1 border border-gray-100"
            />
          )}
          <div>
            <span className="text-[10px] text-gray-500 uppercase block">
              Interest Rate
            </span>
            <span className="text-2xl font-extrabold text-[#00685f]">
              {product.rateDisplay}
            </span>
          </div>
          <button
            onClick={onOpenApplyModal}
            className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Main Content Grid: Tabs + Right Rail Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Tabs & Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation Header */}
          <div className="bg-white rounded-2xl border border-[#bcc9c6]/30 shadow-xs p-2 flex gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#00685f] text-white"
                  : "text-[#3d4947] hover:bg-[#eff4ff]"
              }`}
            >
              Overview & Terms
            </button>
            <button
              onClick={() => setActiveTab("eligibility")}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "eligibility"
                  ? "bg-[#00685f] text-white"
                  : "text-[#3d4947] hover:bg-[#eff4ff]"
              }`}
            >
              Eligibility Checklist
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-[#00685f] text-white"
                  : "text-[#3d4947] hover:bg-[#eff4ff]"
              }`}
            >
              Required Documents
            </button>
            <button
              onClick={() => setActiveTab("repayment")}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "repayment"
                  ? "bg-[#00685f] text-white"
                  : "text-[#3d4947] hover:bg-[#eff4ff]"
              }`}
            >
              Repayment Schedule
            </button>
          </div>

          {/* Tab Panels */}
          <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-4">
            {activeTab === "overview" && (
              <div className="space-y-4 text-xs text-[#3d4947] leading-relaxed">
                <h3 className="text-base font-extrabold text-[#0b1c30]">
                  About {product.name}
                </h3>
                <p>{product.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                  <div className="p-3 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-gray-500 block">
                      Min Amount
                    </span>
                    <span className="font-bold text-[#0b1c30] text-sm">
                      MWK {product.minAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-gray-500 block">
                      Max Limit
                    </span>
                    <span className="font-bold text-[#0b1c30] text-sm">
                      MWK {(product.maxAmount / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div className="p-3 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-gray-500 block">
                      Interest Rate
                    </span>
                    <span className="font-bold text-[#00685f] text-sm">
                      {product.rateDisplay}
                    </span>
                  </div>

                  <div className="p-3 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-gray-500 block">
                      Max Term
                    </span>
                    <span className="font-bold text-[#0b1c30] text-sm">
                      {product.termDisplay}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "eligibility" && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-[#0b1c30]">
                  Eligibility Criteria
                </h3>
                <ul className="space-y-3">
                  {product.eligibility.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs text-[#0b1c30]"
                    >
                      <span className="material-symbols-outlined text-[#00685f] text-base shrink-0">
                        check_circle
                      </span>
                      <span className="font-medium pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-[#0b1c30]">
                  Required Verification Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/30 flex items-center gap-3 text-xs text-[#0b1c30] font-semibold"
                    >
                      <span className="material-symbols-outlined text-[#00685f]">
                        description
                      </span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "repayment" && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-[#0b1c30]">
                  Sample Repayment Amortization
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#eff4ff] text-[#3d4947] font-bold">
                        <th className="p-3">Month</th>
                        <th className="p-3">Principal (MWK)</th>
                        <th className="p-3">Interest (MWK)</th>
                        <th className="p-3">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(
                        product.repaymentScheduleSample || [
                          {
                            month: 1,
                            principal: 150000,
                            interest: 18000,
                            balance: 4850000,
                          },
                          {
                            month: 2,
                            principal: 150000,
                            interest: 17500,
                            balance: 4700000,
                          },
                          {
                            month: 3,
                            principal: 150000,
                            interest: 17000,
                            balance: 4550000,
                          },
                        ]
                      ).map((row) => (
                        <tr key={row.month} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-[#0b1c30]">
                            Month {row.month}
                          </td>
                          <td className="p-3 text-[#0b1c30]">
                            MWK {row.principal.toLocaleString()}
                          </td>
                          <td className="p-3 text-[#00685f]">
                            MWK {row.interest.toLocaleString()}
                          </td>
                          <td className="p-3 font-bold text-[#0b1c30]">
                            MWK {row.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0b1c30]">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[#bcc9c6]/30 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                    }
                    className="w-full p-4 bg-[#eff4ff]/60 hover:bg-[#eff4ff] text-left font-bold text-xs text-[#0b1c30] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-sm">
                      {openFaqIndex === idx
                        ? "keyboard_arrow_up"
                        : "keyboard_arrow_down"}
                    </span>
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-4 bg-white text-xs text-[#3d4947] border-t border-[#bcc9c6]/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail: Interactive Loan Repayment Estimator */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-5 sticky top-20">
            <h3 className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f]">
                calculate
              </span>
              <span>Live Monthly Repayment Estimator</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#0b1c30] mb-1">
                <span>Amount:</span>
                <span className="text-[#00685f]">
                  MWK {calcAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={product.minAmount}
                max={product.maxAmount}
                step={100000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full accent-[#00685f] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#0b1c30] mb-1">
                <span>Term:</span>
                <span className="text-[#00685f]">{calcMonths} Months</span>
              </div>
              <input
                type="range"
                min={6}
                max={product.termMaxMonths || 60}
                step={6}
                value={calcMonths}
                onChange={(e) => setCalcMonths(Number(e.target.value))}
                className="w-full accent-[#00685f] cursor-pointer"
              />
            </div>

            <div className="p-4 bg-[#89f5e7]/30 border border-[#008378]/30 rounded-xl space-y-1 text-center">
              <span className="text-[10px] text-[#005049] uppercase font-bold block">
                Estimated Repayment
              </span>
              <span className="text-2xl font-extrabold text-[#00201d]">
                MWK {monthlyRepayment.toLocaleString()} / mo
              </span>
            </div>

            <button
              onClick={onOpenApplyModal}
              className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Apply for this Loan
            </button>

            {/* SSL Encryption Security Badge */}
            <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 text-xs text-[#3d4947]">
              <span className="material-symbols-outlined text-emerald-600 text-2xl shrink-0">
                lock
              </span>
              <div>
                <span className="font-bold block text-[#0b1c30]">
                  256-Bit SSL Encrypted
                </span>
                <span className="text-[10px]">
                  Your personal data is transmitted securely to the lender.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
