import React, { useState } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Muli Bwanji! I am the FinAccess Malawi Financial Assistant. How can I help you choose or compare loan options today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setIsReplying(true);
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);

    setTimeout(() => {
      let reply =
        'Thank you for reaching out! In Malawi, commercial interest rates typically range from 8.5% for subsidized agricultural credit up to 18% for unsecured business overdrafts. Would you like me to calculate estimated monthly payments or connect you with a verified loan advisor?';
      if (userMsg.toLowerCase().includes('rate') || userMsg.toLowerCase().includes('interest')) {
        reply =
          'Interest rates in Malawi vary by institution. Agri-Business Growth Fund offers subsidized 8.5% p.a., while standard SME Credit Lines average 14-16% p.a. Check our Loan Calculator tool to test custom interest scenarios!';
      } else if (userMsg.toLowerCase().includes('document') || userMsg.toLowerCase().includes('id')) {
        reply =
          'Standard required documents include your Malawi National Identity Card, 3 to 6 months of bank or mobile money statements, and proof of residence or land title.';
      } else if (userMsg.toLowerCase().includes('application') || userMsg.toLowerCase().includes('status')) {
        reply =
          'You can follow every application from My Applications in your dashboard. Open an application to see its current status, requested documents, and the next action.';
      } else if (userMsg.toLowerCase().includes('branch') || userMsg.toLowerCase().includes('location')) {
        reply =
          'Use the Branch Location Finder in Explore Services to choose a city, view partner branch hours, and open the selected area in Maps.';
      } else if (userMsg.toLowerCase().includes('contact') || userMsg.toLowerCase().includes('human') || userMsg.toLowerCase().includes('advisor')) {
        reply =
          'A support advisor can help with account access, applications, or provider questions. Use the email and phone buttons below to reach the team directly.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: reply, time: 'Just now' },
      ]);
      setIsReplying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#bcc9c6]/40 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="bg-[#00685f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <div>
              <h3 className="font-bold text-base">SmartFin Access Support</h3>
              <p className="text-[11px] text-[#89f5e7] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Advisory Service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Message Chat Body */}
        <div className="flex-1 p-4 bg-[#eff4ff] overflow-y-auto custom-scrollbar space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#00685f] text-white rounded-tr-none'
                    : 'bg-white text-[#0b1c30] border border-[#bcc9c6]/30 shadow-xs rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
          {isReplying && (
            <div className="flex items-center gap-2 text-[11px] text-gray-400"><span className="flex gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00685f]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00685f] [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00685f] [animation-delay:240ms]" /></span>FinAccess assistant is typing...</div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-[#bcc9c6]/20 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInput('What documents do I need for a loan?')}
            className="px-2.5 py-1 bg-[#f4fffc] text-[#00685f] border border-[#008378]/30 rounded-full shrink-0 font-medium hover:bg-[#89f5e7]/30 transition-colors"
          >
            Required Documents
          </button>
          <button
            onClick={() => setInput('What are the lowest interest rates available?')}
            className="px-2.5 py-1 bg-[#f4fffc] text-[#00685f] border border-[#008378]/30 rounded-full shrink-0 font-medium hover:bg-[#89f5e7]/30 transition-colors"
          >
            Lowest Rates
          </button>
          <button
            onClick={() => setInput('How long does loan approval take?')}
            className="px-2.5 py-1 bg-[#f4fffc] text-[#00685f] border border-[#008378]/30 rounded-full shrink-0 font-medium hover:bg-[#89f5e7]/30 transition-colors"
          >
            Approval Speed
          </button>
          <a href="mailto:support@smartfin.mw" className="px-2.5 py-1 bg-[#f4fffc] text-[#00685f] border border-[#008378]/30 rounded-full shrink-0 font-medium hover:bg-[#89f5e7]/30 transition-colors">
            Email support
          </a>
          <a href="tel:+265888000000" className="px-2.5 py-1 bg-[#f4fffc] text-[#00685f] border border-[#008378]/30 rounded-full shrink-0 font-medium hover:bg-[#89f5e7]/30 transition-colors">
            Call support
          </a>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#bcc9c6]/30 flex gap-2">
          <input
            type="text"
            placeholder="Type your message or question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isReplying}
            className="flex-1 px-3 py-2 bg-[#eff4ff] border border-[#bcc9c6]/40 rounded-xl text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00685f]"
          />
          <button
            type="submit"
            disabled={isReplying || !input.trim()}
            className="px-4 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
