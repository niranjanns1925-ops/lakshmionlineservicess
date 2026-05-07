// src/pages/AdminDashboard.tsx
import { useAuth } from '../hooks/useAuth';
import { useServices, useRequests } from '../hooks/useData';
import { motion } from 'motion/react';
import { Users, FileText, Settings, BadgeCheck, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function AdminDashboard() {
  const { user } = useAuth();
  const { services } = useServices();
  const { requests, loading: requestsLoading } = useRequests(undefined, true);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    review: requests.filter(r => r.status === 'Under Review').length,
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending').slice(0, 5);

  return (
    <div className="space-y-8 pb-32 lg:pb-12">
      {/* Mobile Government Branding */}
      <div className="lg:hidden flex justify-between items-center bg-linear-to-br from-[#1e3a8a] to-[#1e1e1e] p-8 rounded-[36px] shadow-2xl text-white">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-2xl shadow-lg border border-white/20">
             <Logo size={32} />
          </div>
          <div>
            <h2 className="text-white text-xl mb-0.5 font-serif font-bold">Officer Portal</h2>
            <p className="text-[10px] uppercase tracking-widest font-extrabold opacity-70">Lakshmi E-Sevai Maiyam • {user?.name}</p>
          </div>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
           <ShieldCheck className="text-blue-400" />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl mb-1">Regional Administration</h1>
          <p className="text-muted font-medium text-sm">Monitoring real-time service request pipelines</p>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100">
           <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
           <span className="text-[10px] font-extrabold uppercase tracking-widest">System Operational</span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <div className="card card-hover">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">Total Queue</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary">{stats.total}</span>
             <FileText size={16} className="text-primary opacity-20" />
          </div>
        </div>
        <div className="card card-hover border-l-4 border-amber-400">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">Pending</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary">{stats.pending}</span>
             <Clock size={16} className="text-amber-500 opacity-20" />
          </div>
        </div>
        <div className="card card-hover border-l-4 border-blue-400">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">In Review</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary">{stats.review}</span>
             <TrendingUp size={16} className="text-blue-500 opacity-20" />
          </div>
        </div>
        <div className="card card-hover border-l-4 border-green-500">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">Granted</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary">{stats.approved}</span>
             <BadgeCheck size={16} className="text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Services Summary */}
        <div className="lg:col-span-2 space-y-6">
           <div className="card">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl">Service Performance</h3>
                <Link to="/admin/services" className="text-xs font-bold text-primary hover:text-accent">Manage Catalog →</Link>
              </div>
              <div className="space-y-5">
                 {services.slice(0, 4).map(s => (
                   <div key={s.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-primary">{s.name}</p>
                         <p className="text-[10px] uppercase font-bold text-muted">{s.category}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-primary">{s.requestCount || 0}</p>
                         <p className="text-[10px] uppercase font-bold text-muted">Hits</p>
                      </div>
                      <div className="w-24 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${Math.min(100, (s.requestCount || 0) * 10)}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Action Queue */}
        <div className="space-y-6">
          <div className="card">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg">Action Queue</h3>
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                   <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                   <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-800">Live</span>
                </div>
             </div>

             <div className="space-y-3">
                {requestsLoading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-surface-alt animate-pulse rounded-2xl" />)
                ) : pendingRequests.length === 0 ? (
                  <div className="py-8 text-center text-muted text-sm font-medium">All caught up!</div>
                ) : (
                  pendingRequests.map((r, idx) => (
                    <motion.div
                       key={r.id}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: idx * 0.05 }}
                       className="p-3 bg-surface-alt border border-border rounded-2xl flex items-center gap-3 group hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center font-bold text-xs text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        {r.userName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-primary truncate">{r.userName}</p>
                         <p className="text-[9px] font-bold text-muted uppercase truncate">{r.serviceName}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-white group-hover:bg-accent group-hover:text-white transition-colors">
                        <ChevronRight size={14} />
                      </div>
                    </motion.div>
                  ))
                )}
             </div>

             <Link to="/admin/requests" className="mt-6 w-full btn btn-ghost border-dashed border-2 text-[10px] uppercase font-extrabold tracking-widest">
               Expand Waiting Pool
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
      className={props.className}
      width="24"
      height="24"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
