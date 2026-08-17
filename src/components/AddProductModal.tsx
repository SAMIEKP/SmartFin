import React, { useState } from "react";
import { LoanProduct, UserProfile } from "../types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: LoanProduct) => void;
  userProfile?: UserProfile;
  existingProducts?: LoanProduct[];
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  userProfile,
  existingProducts = [],
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<
    "loan" | "student" | "savings" | "mortgage" | "business" | "insurance" | "agriculture"
  >("loan");
  const provider = userProfile?.institutionName || "FinAccess Partner Institution";
  const [minAmount, setMinAmount] = useState<number>(500000);
  const [maxAmount, setMaxAmount] = useState<number>(10000000);
  const [interestRateMin, setInterestRateMin] = useState<number>(12.0);
  const [interestRateMax, setInterestRateMax] = useState<number>(16.0);
  const [termMaxMonths, setTermMaxMonths] = useState<number>(36);
  const [collateralRequired, setCollateralRequired] = useState(false);
  const [collateralText, setCollateralText] = useState("None");
  const [description, setDescription] = useState("");
  const [eligibilityText, setEligibilityText] = useState(
    "Malawian Citizen; Age 21-65; Verifiable Cashflow",
  );
  const documentOptions = [
    "National ID",
    "Student ID",
    "Driving Licence",
    "Passport",
    "ID Photo",
  ];
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
  const [applicationQuestions, setApplicationQuestions] = useState<string[]>([]);
  const [questionFileName, setQuestionFileName] = useState("");

  const handleQuestionFile = (file?: File) => {
    if (!file) return;
    const isSupported = /\.(md|txt)$/i.test(file.name);
    if (!isSupported) {
      window.alert("Please upload a Markdown (.md) or text (.txt) file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const questions = String(reader.result || "")
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+|#+\s*)/, "").trim())
        .filter(Boolean);
      setApplicationQuestions(questions);
      setQuestionFileName(file.name);
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = name.trim().toLowerCase();
    if (!normalizedName) return;
    if (existingProducts.some((product) => product.name.trim().toLowerCase() === normalizedName)) {
      window.alert("A service with this name already exists. Please choose a unique service name.");
      return;
    }
    const newProd: LoanProduct = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      code: `MKW-LN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name || "New Credit Facility",
      provider: provider,
      category: category,
      categoryLabel: category.toUpperCase(),
      interestRateMin,
      interestRateMax,
      rateDisplay: `${interestRateMin}% - ${interestRateMax}% p.a.`,
      termMaxMonths,
      termDisplay: `Up to ${termMaxMonths}m`,
      minAmount,
      maxAmount,
      processingDays: 2,
      collateralRequired,
      collateralText: collateralRequired ? collateralText : "None",
      status: "active",
      applicationsCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      tags: [
        category.toUpperCase(),
        collateralRequired ? "COLLATERAL" : "NO COLLATERAL",
      ],
      description:
        description || "New financial product offered by institution.",
      eligibility: eligibilityText.split(";").map((s) => s.trim()),
      documents: requiredDocuments,
      applicationQuestions,
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#bcc9c6]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#00685f] text-white p-5 flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-2">
              Application Questions (.md or .txt)
            </label>
            <input
              type="file"
              accept=".md,.txt,text/markdown,text/plain"
              onChange={(e) => handleQuestionFile(e.target.files?.[0])}
              className="w-full p-2 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30]"
            />
            <p className="mt-1 text-[11px] text-[#6d7a77]">
              Add one question per line. These questions will be required when an individual applies.
            </p>
            {questionFileName && (
              <div className="mt-2 rounded-xl bg-[#f4fffc] border border-[#008378]/30 p-3 text-xs text-[#00201d]">
                <p className="font-bold">{questionFileName}</p>
                <p className="mt-1">{applicationQuestions.length} question{applicationQuestions.length === 1 ? "" : "s"} loaded</p>
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded-full">
              Provider Dashboard
            </span>
            <h2 className="text-xl font-bold mt-1">
              Publish New Financial Product
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto custom-scrollbar space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
              Product Title / Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solar Energy Equipment Credit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
              >
                <option value="loan">Personal Loan</option>
                <option value="student">Student Loan</option>
                <option value="business">SME / Business Loan</option>
                <option value="agriculture">Agriculture Loan</option>
                <option value="mortgage">Mortgage / Property</option>
                <option value="savings">Savings Account</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Provider Name
              </label>
              <input
                type="text"
                required
                value={provider}
                readOnly
                aria-readonly="true"
                className="w-full p-2.5 bg-[#e3ebe9] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#3d4947] font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Min Amount (MWK)
              </label>
              <input
                type="number"
                required
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Max Amount (MWK)
              </label>
              <input
                type="number"
                required
                value={maxAmount}
                onChange={(e) => setMaxAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Interest Rate Min (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={interestRateMin}
                onChange={(e) => setInterestRateMin(Number(e.target.value))}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Interest Rate Max (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={interestRateMax}
                onChange={(e) => setInterestRateMax(Number(e.target.value))}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
                Max Term (Months)
              </label>
              <input
                type="number"
                required
                value={termMaxMonths}
                onChange={(e) => setTermMaxMonths(Number(e.target.value))}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0b1c30]">
              <input
                type="checkbox"
                checked={collateralRequired}
                onChange={(e) => {
                  setCollateralRequired(e.target.checked);
                  if (e.target.checked && collateralText === "None")
                    setCollateralText("Land or Vehicle deed");
                }}
                className="accent-[#00685f] w-4 h-4 rounded"
              />
              <span>Collateral Security Required?</span>
            </label>
            {collateralRequired && (
              <input
                type="text"
                placeholder="Collateral specification (e.g., Land Title / Motor Vehicle)"
                value={collateralText}
                onChange={(e) => setCollateralText(e.target.value)}
                className="w-full p-2 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-lg text-xs text-[#0b1c30]"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-2">
              Required Documents
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-[#bcc9c6]/50 bg-[#f8fbfa] p-3">
              {documentOptions.map((document) => (
                <label key={document} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#0b1c30]">
                  <input
                    type="checkbox"
                    checked={requiredDocuments.includes(document)}
                    onChange={(e) => setRequiredDocuments((current) => e.target.checked
                      ? [...current, document]
                      : current.filter((item) => item !== document))}
                    className="accent-[#00685f] w-4 h-4 rounded"
                  />
                  <span>{document}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe product terms, target demographics, and key advantages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#bcc9c6] text-[#3d4947] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
