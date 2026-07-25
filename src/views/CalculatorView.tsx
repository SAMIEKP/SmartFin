import React, { useState } from 'react';
import { ViewMode } from '../types';

interface CalculatorViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenApplyModal: () => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ onNavigate, onOpenApplyModal }) => {
  const [principal, setPrincipal] = useState<number>(5000000);
  const [rateAnnual, setRateAnnual] = useState<number>(12.5);
  const [termMonths, setTermMonths] = useState<number>(36);

  const monthlyRate = rateAnnual / 100 / 12;
  const monthlyPayment = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  );

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalRepayment - principal);
  const interestPercentage = Math.round((totalInterest / totalRepayment) * 100);

  // Generate amortization sample
  const schedule = [];
  let balance = principal;
  for (let i = 1; i <= Math.min(12, termMonths); i++) {
    const interestForMonth = Math.round(balance * monthlyRate);
    const principalForMonth = monthlyPayment - interestForMonth;
    balance = Math.max(0, balance - principalForMonth);
    schedule.push({
      month: i,
      payment: monthlyPayment,
      principalPaid: principalForMonth,
      interestPaid: interestForMonth,
      balance,
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f]">calculate</span>
            <span>Malawi Financial Loan Calculator</span>
          </h1>
          <p className="text-xs text-[#3d4947] mt-1">
            Simulate principal amounts, interest rates, and loan terms to project accurate monthly repayments.
          </p>
        </div>

        <button
          onClick={() => onNavigate('loan-products')}
          className="px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Compare Real Products
        </button>
      </div>

      {/* Main Grid: Controls + Visual Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-6">
          <h2 className="font-extrabold text-base text-[#0b1c30]">Adjust Loan Parameters</h2>

          {/* Principal Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#0b1c30]">Loan Principal Amount</span>
              <span className="text-[#00685f] text-sm">MWK {principal.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={250000}
              max={50000000}
              step={250000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-[#00685f] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>MWK 250,000</span>
              <span>MWK 50,000,000</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#0b1c30]">Interest Rate (p.a.)</span>
              <span className="text-[#00685f] text-sm">{rateAnnual}%</span>
            </div>
            <input
              type="range"
              min={5.0}
              max={30.0}
              step={0.5}
              value={rateAnnual}
              onChange={(e) => setRateAnnual(Number(e.target.value))}
              className="w-full accent-[#00685f] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>5.0% (Subsidized)</span>
              <span>30.0% (Standard)</span>
            </div>
          </div>

          {/* Loan Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#0b1c30]">Loan Tenure</span>
              <span className="text-[#00685f] text-sm">
                {termMonths} Months ({Math.round(termMonths / 12 * 10) / 10} Years)
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={240}
              step={6}
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="w-full accent-[#00685f] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>6 Months</span>
              <span>20 Years (240 Months)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-bold text-[#0b1c30] uppercase block">Popular Presets</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setPrincipal(2500000);
                  setRateAnnual(8.5);
                  setTermMonths(24);
                }}
                className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold rounded-lg transition-colors"
              >
                Agri Crop Loan (8.5%)
              </button>
              <button
                onClick={() => {
                  setPrincipal(10000000);
                  setRateAnnual(15.0);
                  setTermMonths(36);
                }}
                className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold rounded-lg transition-colors"
              >
                SME Capital (15.0%)
              </button>
              <button
                onClick={() => {
                  setPrincipal(15000000);
                  setRateAnnual(9.5);
                  setTermMonths(120);
                }}
                className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#00685f] font-bold rounded-lg transition-colors"
              >
                Housing Loan (9.5%)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Amortization */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Calculation Summary Card */}
          <div className="bg-[#00685f] text-white p-6 rounded-2xl shadow-md space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded-full">
                Estimated Monthly Cost
              </span>
              <div className="text-3xl md:text-4xl font-extrabold mt-2 text-[#f4fffc]">
                MWK {monthlyPayment.toLocaleString()} <span className="text-sm font-normal text-[#89f5e7]">/ month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20 text-xs">
              <div>
                <span className="text-white/80 block">Total Principal</span>
                <span className="font-bold text-base">MWK {principal.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/80 block">Total Interest Cost</span>
                <span className="font-bold text-base text-[#89f5e7]">
                  MWK {totalInterest.toLocaleString()} ({interestPercentage}%)
                </span>
              </div>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-white/80">
                <span>Principal ({100 - interestPercentage}%)</span>
                <span>Interest ({interestPercentage}%)</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden flex">
                <div
                  className="bg-white h-full"
                  style={{ width: `${100 - interestPercentage}%` }}
                ></div>
                <div
                  className="bg-[#89f5e7] h-full"
                  style={{ width: `${interestPercentage}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={onOpenApplyModal}
              className="w-full py-3 bg-[#89f5e7] hover:bg-white text-[#00201d] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Apply With These Calculated Parameters
            </button>
          </div>

          {/* First 12 Months Amortization Schedule Preview */}
          <div className="bg-white p-5 rounded-2xl border border-[#bcc9c6]/30 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#0b1c30]">Year 1 Repayment Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#3d4947] font-bold">
                    <th className="p-2.5">Month</th>
                    <th className="p-2.5">Principal</th>
                    <th className="p-2.5">Interest</th>
                    <th className="p-2.5">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="p-2.5 font-bold text-[#0b1c30]">Mo {row.month}</td>
                      <td className="p-2.5 text-[#0b1c30]">MWK {row.principalPaid.toLocaleString()}</td>
                      <td className="p-2.5 text-[#00685f]">MWK {row.interestPaid.toLocaleString()}</td>
                      <td className="p-2.5 font-bold text-[#0b1c30]">
                        MWK {row.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
