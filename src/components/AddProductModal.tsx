import React, { useEffect, useState } from "react";
import { LoanProduct, UserProfile } from "../types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: LoanProduct) => void;
  onUpdateProduct?: (product: LoanProduct) => void;
  userProfile?: UserProfile;
  existingProducts?: LoanProduct[];
  productToEdit?: LoanProduct | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onUpdateProduct,
  userProfile,
  existingProducts = [],
  productToEdit,
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
  const [isDraggingQuestionFile, setIsDraggingQuestionFile] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setMinAmount(productToEdit.minAmount);
      setMaxAmount(productToEdit.maxAmount);
      setInterestRateMin(productToEdit.interestRateMin);
      setInterestRateMax(productToEdit.interestRateMax);
      setTermMaxMonths(productToEdit.termMaxMonths);
      setCollateralRequired(productToEdit.collateralRequired);
      setCollateralText(productToEdit.collateralText);
      setDescription(productToEdit.description);
      setEligibilityText(productToEdit.eligibility.join("; "));
      setRequiredDocuments(productToEdit.documents);
      setApplicationQuestions(productToEdit.applicationQuestions || []);
      setQuestionFileName(productToEdit.applicationQuestions?.length ? "Existing questionnaire" : "");
    } else {
      setName("");
      setCategory("loan");
      setMinAmount(500000);
      setMaxAmount(10000000);
      setInterestRateMin(12);
      setInterestRateMax(16);
      setTermMaxMonths(36);
      setCollateralRequired(false);
      setCollateralText("None");
      setDescription("");
      setEligibilityText("Malawian Citizen; Age 21-65; Verifiable Cashflow");
      setRequiredDocuments([]);
      setApplicationQuestions([]);
      setQuestionFileName("");
    }
    setFormError("");
  }, [isOpen, productToEdit]);

  const handleQuestionFile = (file?: File) => {
    if (!file) return;
    const isSupported = /\.(md|txt)$/i.test(file.name);
    if (!isSupported) {
      window.alert("Please upload a Markdown (.md) or text (.txt) file.");
      return;
    }
    if (file.size > 1024 * 1024) {
      window.alert("Please upload a questionnaire smaller than 1 MB.");
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
    if (!normalizedName || !description.trim()) {
      setFormError("Service name and requirements description are required.");
      return;
    }
    if (requiredDocuments.length === 0) {
      setFormError("Select at least one required document.");
      return;
    }
    if (applicationQuestions.length === 0) {
      setFormError("Upload a questionnaire with at least one question.");
      return;
    }
    if (existingProducts.some((product) => product.id !== productToEdit?.id && product.name.trim().toLowerCase() === normalizedName)) {
      setFormError("A service with this name already exists. Please choose a unique service name.");
      return;
    }
    setFormError("");
    const newProd: LoanProduct = {
      id: productToEdit?.id || `prod-${Date.now().toString().slice(-4)}`,
      code: productToEdit?.code || `MKW-LN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
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

    if (productToEdit && onUpdateProduct) onUpdateProduct(newProd);
    else onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#bcc9c6]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#00685f] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded-full">
              Provider Dashboard
            </span>
            <h2 className="text-xl font-bold mt-1">
              {productToEdit ? "Edit Financial Service" : "Publish New Financial Product"}
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
              <span>Collateral Security Required? <span className="font-normal text-[#6d7a77]">(Optional)</span></span>
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
              Required Documents <span className="text-red-600">*</span>
            </label>
            <p className="mb-2 text-[11px] text-[#6d7a77]">Select at least one document the applicant must provide.</p>
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
              required
              placeholder="Describe product terms, target demographics, and key advantages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl text-xs text-[#0b1c30] font-medium"
            />
          </div>

          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase">
                  Application Questions
                </label>
                <p className="mt-1 text-[11px] text-[#6d7a77]">
                  Upload a Markdown or text file with one required question per line.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#e5eeff] px-2 py-1 text-[10px] font-bold text-[#31527d]">
                .md / .txt
              </span>
            </div>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
                setIsDraggingQuestionFile(true);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsDraggingQuestionFile(false);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingQuestionFile(false);
                handleQuestionFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-colors ${
                isDraggingQuestionFile
                  ? "border-[#00685f] bg-[#d9f8f2]"
                  : "border-[#008378]/40 bg-[#f4fffc] hover:border-[#00685f] hover:bg-[#e9faf7]"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00685f] text-white">
                <span className="material-symbols-outlined">upload_file</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-[#00685f]">
                  {isDraggingQuestionFile ? "Drop questionnaire here" : questionFileName || "Choose questionnaire file"}
                </span>
                <span className="mt-1 block text-[11px] text-[#3d4947]">
                  {questionFileName
                    ? `${applicationQuestions.length} question${applicationQuestions.length === 1 ? "" : "s"} loaded`
                    : "Click to browse · Maximum size 1 MB"}
                </span>
              </span>
              <span className="shrink-0 rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-[#00685f] shadow-xs">
                Browse
              </span>
              <input
                type="file"
                accept=".md,.txt,text/markdown,text/plain"
                onChange={(e) => handleQuestionFile(e.target.files?.[0])}
                className="sr-only"
              />
            </label>
            <p className="mt-2 text-[11px] text-[#6d7a77]">
              These questions will appear as required fields when an individual applies for this service.
            </p>
          </div>

          {formError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700" role="alert">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{formError}</span>
            </div>
          )}

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
              {productToEdit ? "Save Changes" : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
