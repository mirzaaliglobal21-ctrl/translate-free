import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Users,
  Eye,
  Languages,
  Activity,
  RefreshCw,
  Trash2,
  LogOut,
  Clock,
  ShieldAlert,
  Globe,
  TrendingUp,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  totalTranslations: number;
  popularPairs: { pair: string; count: number }[];
  recentVisits: {
    id: string;
    ip: string;
    path: string;
    userAgent: string;
    timestamp: number;
  }[];
  recentTranslations: {
    source: string;
    target: string;
    length: number;
    timestamp: number;
  }[];
  uptimeSeconds: number;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('urdu_admin_token');
  });

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch analytics if logged in
  const fetchAnalytics = async (activeToken?: string) => {
    const currentToken = activeToken || token;
    if (!currentToken) return;

    setIsLoadingData(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.status === 401) {
        setToken(null);
        localStorage.removeItem('urdu_admin_token');
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) {
        throw new Error('Failed to load analytics data.');
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (err: any) {
      setFetchError(err?.message || 'Error fetching analytics.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchAnalytics(token);
    }
  }, [isOpen, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Incorrect password.');
      }

      setToken(data.token);
      localStorage.setItem('urdu_admin_token', data.token);
      setPassword('');
      fetchAnalytics(data.token);
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('urdu_admin_token');
    setAnalytics(null);
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all visitor analytics?')) return;
    try {
      await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAnalytics();
    } catch {
      // Ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#135d52] border border-[#2fa08f] rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-[#237c6f] flex items-center justify-between bg-[#0f4f45]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8b950] to-[#c9942a] flex items-center justify-center text-[#061e1c] font-black text-sm">
              R
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Admin & Visitor Dashboard</h2>
              <p className="text-[11px] text-emerald-300/60 font-mono">Urdu Translate Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <>
                <button
                  onClick={() => fetchAnalytics()}
                  disabled={isLoadingData}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#0c3a34] transition-colors"
                  title="Refresh stats"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#f0c25a]' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-red-400 hover:bg-[#0c3a34] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#0c3a34] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!token ? (
            /* Login Form */
            <div className="max-w-sm mx-auto py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0a3530] text-[#f0c25a] flex items-center justify-center mx-auto mb-4 border border-[#164e45]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">Enter Admin Password</h3>
              <p className="text-xs text-emerald-200/70 mb-6">
                Protected area to view real-time visitors and translation activity.
              </p>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#041a17] border border-[#12423b] text-white placeholder:text-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-[#e8b950]"
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn || !password}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#e8b950] to-[#c9942a] text-[#061e1c] font-bold text-sm shadow-md hover:from-[#f0c45d] hover:to-[#d7a133] transition-all flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Analytics View */
            <>
              {fetchError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center justify-between">
                  <span>{fetchError}</span>
                  <button onClick={() => fetchAnalytics()} className="underline text-white font-bold ml-2">
                    Retry
                  </button>
                </div>
              )}

              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#041a17]/90 border border-[#12423b] shadow-xs">
                  <div className="flex items-center justify-between text-emerald-300/60 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Visits</span>
                    <Eye className="w-4 h-4 text-[#f0c25a]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analytics?.totalVisits ?? '—'}
                  </div>
                  <span className="text-[11px] text-emerald-400/50 mt-1 block">Page views recorded</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#041a17]/90 border border-[#12423b] shadow-xs">
                  <div className="flex items-center justify-between text-emerald-300/60 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analytics?.uniqueVisitors ?? '—'}
                  </div>
                  <span className="text-[11px] text-emerald-400/50 mt-1 block">Distinct visitors</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#041a17]/90 border border-[#12423b] shadow-xs">
                  <div className="flex items-center justify-between text-emerald-300/60 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Visits (24h)</span>
                    <TrendingUp className="w-4 h-4 text-[#f0c25a]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analytics?.visitsToday ?? '—'}
                  </div>
                  <span className="text-[11px] text-emerald-400/50 mt-1 block">Active today</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#041a17]/90 border border-[#12423b] shadow-xs">
                  <div className="flex items-center justify-between text-emerald-300/60 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Translations</span>
                    <Languages className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analytics?.totalTranslations ?? '—'}
                  </div>
                  <span className="text-[11px] text-emerald-400/50 mt-1 block">AI requests served</span>
                </div>
              </div>

              {/* Popular Language Pairs Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#041a17]/90 border border-[#12423b]">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#f0c25a]">
                  <Activity className="w-4 h-4" />
                  <span>Top Translated Language Pairs</span>
                </div>

                {analytics?.popularPairs && analytics.popularPairs.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.popularPairs.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#0d3631]">
                        <span className="font-semibold text-emerald-100">{item.pair}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#093530] text-[#f0c25a] font-mono text-[11px]">
                            {item.count} {item.count === 1 ? 'translation' : 'translations'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400/50 py-3">
                    No translations recorded yet in this session. Try translating some text!
                  </p>
                )}
              </div>

              {/* Recent Visitor Sessions Log */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#041a17]/90 border border-[#12423b]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                    <Globe className="w-4 h-4 text-[#f0c25a]" />
                    <span>Recent Visitor Activity Log</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/50 font-mono">
                    Showing latest {analytics?.recentVisits?.length || 0} visits
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#0e3a35] text-emerald-300/60 font-mono text-[11px]">
                        <th className="pb-2 font-semibold">Time</th>
                        <th className="pb-2 font-semibold">Page / Route</th>
                        <th className="pb-2 font-semibold">Visitor IP</th>
                        <th className="pb-2 font-semibold">Browser / Device</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0c302b]">
                      {analytics?.recentVisits && analytics.recentVisits.length > 0 ? (
                        analytics.recentVisits.map((visit) => {
                          const timeStr = new Date(visit.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          });
                          return (
                            <tr key={visit.id} className="hover:bg-[#072b27] transition-colors">
                              <td className="py-2 font-mono text-emerald-300/70 whitespace-nowrap">
                                {timeStr}
                              </td>
                              <td className="py-2 font-semibold text-[#f0c25a] max-w-[150px] truncate">
                                {visit.path}
                              </td>
                              <td className="py-2 font-mono text-emerald-400/60 whitespace-nowrap">
                                {visit.ip}
                              </td>
                              <td className="py-2 text-emerald-200/60 max-w-[200px] truncate" title={visit.userAgent}>
                                {visit.userAgent}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-emerald-400/40">
                            No visits logged yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between text-xs text-emerald-300/50">
                <span>Server Uptime: {analytics?.uptimeSeconds ? `${Math.floor(analytics.uptimeSeconds / 60)}m ${analytics.uptimeSeconds % 60}s` : 'Active'}</span>
                <button
                  onClick={handleReset}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Analytics</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
