import React, { useState, useMemo } from 'react';
import { ViewMode, LoanProduct } from '../types';

interface LoanProductsViewProps {
  products: LoanProduct[];
  onNavigate: (view: ViewMode) => void;
  onSelectProduct: (product: LoanProduct) => void;
  onOpenApplyModal: () => void;
}

export const LoanProductsView: React.FC<LoanProductsViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onOpenApplyModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxAmountFilter, setMaxAmountFilter] = useState<number>(30000000);
  const [maxInterestFilter, setMaxInterestFilter] = useState<number>(20);
  const [collateralOnly, setCollateralOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Lilongwe');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const matchesAmount = p.minAmount <= maxAmountFilter;
      const matchesInterest = p.interestRateMin <= maxInterestFilter;
      const matchesCollateral = collateralOnly ? p.collateralRequired : true;

      return matchesSearch && matchesCategory && matchesAmount && matchesInterest && matchesCollateral;
    });
  }, [products, searchQuery, selectedCategory, maxAmountFilter, maxInterestFilter, collateralOnly]);

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1c30]">
              Malawian Financial Product Directory
            </h1>
            <p className="text-xs text-[#3d4947] mt-1">
              Compare interest rates, loan terms, and eligibility requirements from verified lenders.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl px-3 py-2 w-full md:w-80">
            <span className="material-symbols-outlined text-sm text-[#6d7a77]">search</span>
            <input
              type="text"
              placeholder="Search by loan name, provider, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-[#0b1c30]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-gray-400">
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'loan', label: 'Personal Loans' },
            { id: 'business', label: 'SME & Business' },
            { id: 'agriculture', label: 'Agriculture & Seasonal' },
            { id: 'mortgage', label: 'Mortgage & Housing' },
            { id: 'savings', label: 'Savings Accounts' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00685f] text-white font-bold shadow-xs'
                  : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#d3e4fe]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Filter Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00685f] text-base">filter_list</span>
                <span>Filters & Options</span>
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setMaxAmountFilter(30000000);
                  setMaxInterestFilter(20);
                  setCollateralOnly(false);
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#00685f] font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Max Requested Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#0b1c30]">Max Loan Limit</span>
                <span className="text-[#00685f] font-bold">MWK {(maxAmountFilter / 1000000).toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min={500000}
                max={50000000}
                step={500000}
                value={maxAmountFilter}
                onChange={(e) => setMaxAmountFilter(Number(e.target.value))}
                className="w-full accent-[#00685f] cursor-pointer"
              />
            </div>

            {/* Max Interest Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#0b1c30]">Max Interest Rate</span>
                <span className="text-[#00685f] font-bold">{maxInterestFilter}% p.a.</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={0.5}
                value={maxInterestFilter}
                onChange={(e) => setMaxInterestFilter(Number(e.target.value))}
                className="w-full accent-[#00685f] cursor-pointer"
              />
            </div>

            {/* Collateral Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30] cursor-pointer">
              <input
                type="checkbox"
                checked={collateralOnly}
                onChange={(e) => setCollateralOnly(e.target.checked)}
                className="accent-[#00685f] w-4 h-4 rounded"
              />
              <span>Require Collateral Security</span>
            </label>

            {/* District Location Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#0b1c30] uppercase">District / Branch</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-xs font-semibold text-[#0b1c30]"
              >
                <option value="Lilongwe">Lilongwe (Central Region)</option>
                <option value="Blantyre">Blantyre (Southern Region)</option>
                <option value="Mzuzu">Mzuzu (Northern Region)</option>
                <option value="Zomba">Zomba (Eastern Region)</option>
              </select>
            </div>
          </div>

          {/* Map Location Bento Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-[#bcc9c6]/30 bg-white p-5 space-y-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKplEO2YoAgroSm7eHh_UphL2keEPO-QGl_cyKtSPtROyLyjzFLEWkrYsPsvbPWoFzGMpJavVsufzm4aPBUsAePYfwqncHEvb7Et2FHNTWMRS2vSxcuRM1VFwEbPaMvWGK2ZvmBgRoVszrlexnz_kXTKZXYMYXOrcSXhTLm7sjUOFaip8vEt3v1cYo6_s232AJR2tC_Ljv-aMk4BSTnI10f6eo39G9P2GOXt2n3A7jdf-M-1n4Y8DBGxfLmG4RcV7Z1ZkQyGKIl0c"
              alt="Malawi Map Branches"
              className="w-full h-32 object-cover rounded-xl"
            />
            <div className="space-y-1">
              <span className="font-bold text-xs text-[#0b1c30] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#00685f] text-base">location_on</span>
                <span>Branch Location Finder</span>
              </span>
              <p className="text-[11px] text-[#3d4947]">
                12 Partner branches active in {selectedCity}. Walk in for biometric verification or paper document submission.
              </p>
            </div>
          </div>
        </div>

        {/* Right 3-Cols: Product Bento Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-[#3d4947]">
            <span>Showing {filteredProducts.length} verified products</span>
            <span>Sorted by Match Relevance</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#bcc9c6]/30 text-center space-y-4">
              <div className="w-16 h-16 bg-[#eff4ff] text-[#00685f] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">search_off</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#0b1c30]">No services found with current filters</h3>
                <p className="text-xs text-[#3d4947] max-w-sm mx-auto">
                  Try adjusting your search keywords, interest rate threshold, or institution type to see available products.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setMaxAmountFilter(50000000);
                  setMaxInterestFilter(25);
                  setCollateralOnly(false);
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded-full">
                            {p.categoryLabel}
                          </span>
                          {p.isMatch && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">auto_awesome</span>
                              <span>Good Match</span>
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-[#0b1c30] mt-1.5">{p.name}</h3>
                        <p className="text-xs text-[#3d4947] font-medium">{p.provider}</p>
                      </div>

                      {p.providerLogo && (
                        <img
                          src={p.providerLogo}
                          alt={p.provider}
                          className="w-10 h-10 object-contain rounded-lg border border-gray-100 p-0.5 shrink-0"
                        />
                      )}
                    </div>

                    <p className="text-xs text-[#3d4947] line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-[#eff4ff] rounded-xl text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Interest Rate</span>
                        <span className="font-bold text-[#00685f]">{p.rateDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Max Term</span>
                        <span className="font-bold text-[#0b1c30]">{p.termDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Min Amount</span>
                        <span className="font-semibold text-[#0b1c30]">MWK {p.minAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Collateral</span>
                        <span className="font-semibold text-[#0b1c30]">{p.collateralText}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-[#e5eeff] text-[#00685f] px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        onSelectProduct(p);
                        onNavigate('product-details');
                      }}
                      className="flex-1 py-2.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(p);
                        onOpenApplyModal();
                      }}
                      className="flex-1 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
