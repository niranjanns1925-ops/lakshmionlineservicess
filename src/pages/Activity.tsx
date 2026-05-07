// src/pages/Activity.tsx
import { useAuth } from '../hooks/useAuth';
import { useRequests } from '../hooks/useData';
import { motion } from 'motion/react';
import { Search, Filter, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function Activity() {
  const { user } = useAuth();
  const { requests, loading } = useRequests(user?.uid);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle };
      case 'Rejected': return { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle };
      case 'Pending': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock };
      default: return { bg: 'bg-blue-50', text: 'text-blue-700', icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-8 pb-32 lg:pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h1 className="text-3xl mb-1">My Activity</h1>
          <p className="text-muted font-medium text-sm">Track your ongoing and past service applications</p>
        </div>
        <div className="flex w-full lg:w-auto gap-3">
           <div className="relative flex-1 lg:w-64">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
             <input type="text" placeholder="Search requests..." className="w-full bg-white border border-border rounded-2xl py-3 pl-12 pr-6 font-bold text-sm outline-none focus:border-primary transition-colors" />
           </div>
           <button className="p-3 bg-white border border-border rounded-2xl text-muted hover:text-primary transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-24 card animate-pulse" />)
        ) : requests.length === 0 ? (
          <div className="py-20 text-center card bg-white">
             <div className="w-20 h-20 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📭</div>
             <h3 className="text-xl mb-2">No Requests Found</h3>
             <p className="text-muted text-sm max-w-xs mx-auto">You haven't submitted any service requests yet. Head to the dashboard to start.</p>
          </div>
        ) : (
          requests.map((r, idx) => {
            const style = getStatusStyle(r.status);
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card card-hover flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center font-serif font-bold text-lg text-primary border border-border">
                  #{r.id.substring(0, 4)}
                </div>
                
                <div className="flex-1 text-center lg:text-left min-w-0">
                  <h4 className="text-lg font-bold text-primary mb-1 truncate">{r.serviceName}</h4>
                  <p className="text-xs text-muted font-bold tracking-wider uppercase mb-1">ID: {r.id}</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-muted font-medium">
                     <Clock size={12} /> {r.submittedAt?.toDate ? new Date(r.submittedAt.toDate()).toLocaleDateString() : 'Today'}
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-end gap-2">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${style.bg} ${style.text} text-[10px] font-extrabold uppercase tracking-widest`}>
                    <style.icon size={12} /> {r.status}
                  </div>
                  <button className="text-primary text-xs font-bold hover:text-accent flex items-center gap-1 group">
                    View Logic <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
