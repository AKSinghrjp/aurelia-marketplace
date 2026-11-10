import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  ShieldCheck, 
  Phone, 
  Building2, 
  Search, 
  Filter 
} from 'lucide-react';
import { PlatformQuery } from '../types';

export const QueriesPage: React.FC = () => {
  const { queries, submitQuery, respondToQuery } = useMarketplace();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [showNewQueryModal, setShowNewQueryModal] = useState(false);

  // New query form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<PlatformQuery['category']>('Authentication & Provenance');
  const [message, setMessage] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState('');

  // Admin reply states
  const [replyingQueryId, setReplyingQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handleCreateQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!subject.trim() || !message.trim()) return;

    submitQuery({
      userId: currentUser.id,
      userName: currentUser.businessName || currentUser.name,
      userRole: currentUser.role,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      category,
      subject: subject.trim(),
      message: message.trim(),
    });

    setSubmitFeedback('Your inquiry has been lodged with the curatorial support desk.');
    setSubject('');
    setMessage('');
    setTimeout(() => {
      setSubmitFeedback('');
      setShowNewQueryModal(false);
    }, 1500);
  };

  const handleSendResponse = (queryId: string, status: 'In Progress' | 'Resolved') => {
    if (!replyText.trim()) return;
    respondToQuery(queryId, replyText.trim(), status);
    setReplyText('');
    setReplyingQueryId(null);
  };

  const filteredQueries = queries.filter((q) => {
    if (activeTab === 'open') return q.status === 'Open';
    if (activeTab === 'in_progress') return q.status === 'In Progress';
    if (activeTab === 'resolved') return q.status === 'Resolved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#121824] via-[#161f2e] to-[#0f1420] border border-[#2b3a54] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono tracking-widest uppercase text-sky-300">
              DISPUTE, PROVENANCE & GST INQUIRY PORTAL
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-stone-100">
            Curatorial Queries & Support Desk
          </h1>

          <p className="text-xs text-stone-300 leading-relaxed">
            Direct communication channel between collectors, registered antique merchants, and the Master Curatorial Admin. Submit questions on provenance certificates, statutory GST invoices, delivery schedules, or auction bids.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowNewQueryModal(true)}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-black font-extrabold text-xs transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-black" />
            Lodge New Query
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#212b3d] pb-3 text-xs">
        <div className="flex gap-2">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-sky-500 text-black shadow-md shadow-sky-950 font-bold'
                  : 'bg-[#151c27] text-stone-400 hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-stone-400 text-xs">
          Total Queries: <strong className="text-stone-200">{queries.length}</strong>
        </span>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="text-center py-16 bg-[#111621] rounded-2xl border border-[#263347] p-6 space-y-3">
            <HelpCircle className="w-10 h-10 mx-auto text-stone-600" />
            <p className="text-xs text-stone-400">No queries found in this status category.</p>
          </div>
        ) : (
          filteredQueries.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-[#121822] border border-[#273549] space-y-3 hover:border-sky-500/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2b3c] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {q.id}
                  </span>
                  <span className="bg-[#1b2535] text-[#d6b77c] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#2e3e57]">
                    {q.category}
                  </span>
                  <span className="text-xs text-stone-400">
                    by <strong className="text-stone-200">{q.userName}</strong> ({q.userRole})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                    q.status === 'Resolved'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : q.status === 'In Progress'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800'
                  }`}>
                    {q.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                    {q.status === 'In Progress' && <Clock className="w-3 h-3" />}
                    {q.status === 'Open' && <AlertCircle className="w-3 h-3" />}
                    {q.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Subject & Message */}
              <div>
                <h3 className="font-serif text-sm font-bold text-stone-100">
                  {q.subject}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed bg-[#0b0f16] p-3 rounded-xl border border-[#1e2838]">
                  "{q.message}"
                </p>
                {q.userPhone && (
                  <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 text-amber-400" />
                    Contact: {q.userPhone} • {q.userEmail}
                  </div>
                )}
              </div>

              {/* Existing Response */}
              {q.adminResponse && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#0f1c16] border border-emerald-900/60 text-xs text-stone-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Curatorial Resolution & Response
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed italic">
                    {q.adminResponse}
                  </p>
                </div>
              )}

              {/* Admin Reply Action Box */}
              {isAdmin && (
                <div className="pt-2 border-t border-[#1d2736]">
                  {replyingQueryId === q.id ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type formal admin reply and resolution details..."
                        className="w-full bg-[#0d121a] border border-[#2c3c54] rounded-lg p-2.5 text-xs text-stone-100 focus:border-sky-400"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setReplyingQueryId(null)}
                          className="px-3 py-1 rounded bg-[#1e2838] text-stone-400 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendResponse(q.id, 'In Progress')}
                          className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() => handleSendResponse(q.id, 'Resolved')}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs"
                        >
                          Send & Resolve Query
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyingQueryId(q.id);
                        setReplyText(q.adminResponse || '');
                      }}
                      className="text-xs text-sky-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      {q.adminResponse ? 'Update Official Response' : 'Reply as Curatorial Admin →'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Query Modal */}
      {showNewQueryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111722] border border-[#2e3e57] rounded-2xl p-6 shadow-2xl relative">
            <h3 className="font-serif text-lg font-bold text-stone-100 mb-1">
              Lodge a Curatorial Query
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Our master curator and legal verification desk review all queries within 24 hours.
            </p>

            {submitFeedback && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{submitFeedback}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuery} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Query Classification *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#161e2b] border border-[#2d3e57] rounded-lg p-2 text-xs text-stone-100 focus:border-sky-400"
                >
                  <option value="Authentication & Provenance">Authentication & Provenance</option>
                  <option value="GST & Seller Verification">GST & Seller Verification</option>
                  <option value="Auction Bid Issue">Auction Bid Issue</option>
                  <option value="Order & Shipping">Order & Shipping</option>
                  <option value="General">General Platform Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiring regarding provenance documents for lot #4"
                  className="w-full bg-[#161e2b] border border-[#2d3e57] rounded-lg p-2 text-xs text-stone-100 focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Detailed Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide complete details, lot ID or order reference if applicable..."
                  className="w-full bg-[#161e2b] border border-[#2d3e57] rounded-lg p-2 text-xs text-stone-100 focus:border-sky-400"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewQueryModal(false)}
                  className="flex-1 py-2 rounded-lg bg-[#18212e] text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold shadow-lg shadow-sky-950"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
