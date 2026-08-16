import React, { useState } from "react";
import { ViewMode, LoanProduct } from "../types";

interface ProductManagementViewProps {
  products: LoanProduct[];
  onNavigate: (view: ViewMode) => void;
  onBack?: () => void;
  onOpenAddProductModal: () => void;
  onToggleStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onSelectProduct: (product: LoanProduct) => void;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  products,
  onNavigate,
  onBack,
  onOpenAddProductModal,
  onToggleStatus,
  onDeleteProduct,
  onSelectProduct,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const displayedProducts = products.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.provider.toLowerCase().includes(search.toLowerCase());
        const matchesCat =
          categoryFilter === "all" || p.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesCat && matchesStatus;
      });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0b1c30]">
              Services Catalog Management
            </h1>
            <span className="bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold px-2 py-0.5 rounded-full">
              Provider Dashboard
            </span>
          </div>
          <p className="text-xs text-[#3d4947] mt-1">
            Configure interest rates, borrowing limits, and product visibility
            across Malawi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack || (() => onNavigate("provider-dashboard"))}
            className="px-3 py-2 border border-[#bcc9c6] text-[#3d4947] font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            <span>Back</span>
          </button>

          <button
            onClick={onOpenAddProductModal}
            className="px-5 py-2.5 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_box</span>
            <span>+ Add New Service</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        <div className="flex items-center gap-2 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl px-3 py-2 w-full sm:w-72">
          <span className="material-symbols-outlined text-sm text-[#6d7a77]">
            search
          </span>
          <input
            type="text"
            placeholder="Search code, name, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-[#0b1c30]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-xs font-semibold text-[#0b1c30]"
          >
            <option value="all">All Categories</option>
            <option value="agriculture">Agriculture</option>
            <option value="business">SME / Business</option>
            <option value="loan">Personal Loan</option>
            <option value="mortgage">Mortgage</option>
            <option value="savings">Savings</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-xs font-semibold text-[#0b1c30]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Product Management Table or Empty State */}
      <div className="bg-white rounded-2xl border border-[#bcc9c6]/30 shadow-xs overflow-hidden">
        {displayedProducts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4i3z-rXyJCzpLTsh5rC_VuJwG-f7wGybXr5ceyqPZ_indhmP_Fi2_-EyhGPoUtDehilaywWmQz1DJPTXWS2LOTpi6btMugLeGnOPi0XxZJf5zU-Tt0SD5viPjdydoydRMcoCq4GM-O9OxPiykIPGLYg3bvQDQ4-77nBPBIRVfQtZ0Pn3SCfJ3HYKclKrHB6bSMKcE4Vq9sWJrZms93hJtRYA93B6-8WmtBPixA5bXd2kYCW9tLOHUVWrhsrYcXY7QCsui-HQdOkQ"
              alt="Empty Catalog"
              className="w-28 h-28 mx-auto object-contain opacity-70"
              loading="lazy"
              decoding="async"
            />
            <h3 className="text-lg font-bold text-[#0b1c30]">
              No Services Found
            </h3>
            <p className="text-xs text-[#3d4947] max-w-sm mx-auto">
              {showEmptyState
                ? 'Your financial product catalog is currently empty. Click "+ Add New Product" to publish a new loan facility.'
                : "No products match your search or filter settings."}
            </p>
            <button
              onClick={onOpenAddProductModal}
              className="px-6 py-2.5 bg-[#855300] hover:bg-[#653e00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              + Create First Service
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#eff4ff] text-[#3d4947] font-bold border-b border-[#bcc9c6]/30">
                  <th className="p-4">Code & Service</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Interest Rate</th>
                  <th className="p-4">Term & Limit</th>
                  <th className="p-4">Applicants</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 block font-mono">
                          {p.code}
                        </span>
                        <span className="font-bold text-[#0b1c30] text-sm block mt-0.5">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {p.provider}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded bg-[#e5eeff] text-[#00685f] font-bold uppercase text-[10px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-[#00685f]">
                      {p.rateDisplay}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-[#0b1c30] block">
                        MWK {p.minAmount.toLocaleString()} -{" "}
                        {(p.maxAmount / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {p.termDisplay}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-[#0b1c30]">
                        {p.applicationsCount}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        Submissions
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => onToggleStatus(p.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          p.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.status === "active"
                              ? "bg-emerald-600"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <span>
                          {p.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          onSelectProduct(p);
                          onNavigate("product-details");
                        }}
                        className="p-1.5 text-[#00685f] hover:bg-[#eff4ff] rounded-lg transition-colors"
                        title="View Service Page"
                      >
                        <span className="material-symbols-outlined text-base">
                          visibility
                        </span>
                      </button>

                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Service"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
