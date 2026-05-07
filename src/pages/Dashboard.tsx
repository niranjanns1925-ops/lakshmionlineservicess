// src/pages/Dashboard.tsx
import { useAuth } from '../hooks/useAuth';
import { useServices, useRequests, useNotifications } from '../hooks/useData';
import { motion } from 'motion/react';
import { Search, Bell, ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useServices();
  const { requests, loading: requestsLoading } = useRequests(user?.uid);
  const notifications = useNotifications(user?.uid || '');

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
  };

  return (
    <div className="space-y-8 pb-32 lg:pb-12">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="lg:hidden flex justify-between items-center bg-linear-to-br from-primary to-primary-light p-8 rounded-[36px] shadow-2xl text-white">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-2xl shadow-lg border border-white/20">
             <Logo size={32} />
          </div>
          <div>
            <h2 className="text-white text-xl mb-0.5 font-serif font-bold">E-Sevai Maiyam</h2>
            <p className="text-[10px] uppercase tracking-widest font-extrabold opacity-70">Lakshmi Hub • {user?.name.split(' ')[0]}</p>
          </div>
        </div>
        <div className="relative p-2 bg-white/10 rounded-xl">
          <Bell size={24} />
          {notifications.some(n => !n.read) && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-primary" />
          )}
        </div>
      </div>

      {/* Desktop Dashboard Summary (Bento Hero) */}
      <div className="hidden lg:block relative bg-linear-to-br from-primary to-primary-light p-14 rounded-[40px] shadow-2xl text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10">
          <h1 className="text-white text-4xl mb-3 leading-tight">Suprabhatam, {user?.name}!</h1>
          <p className="text-white/70 max-w-lg text-lg">Your digital governance portal is up to date. You have {stats.pending} pending requests requiring attention.</p>
          
          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1">Active Wallet</p>
              <p className="text-2xl font-serif font-bold text-accent">₹ 0.00</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1">Profile Level</p>
              <p className="text-2xl font-serif font-bold text-accent">Tier 1 Citizen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="card card-hover group">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">Total Submissions</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{stats.total}</span>
             <Star size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="card card-hover group">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">Awaiting Action</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{stats.pending}</span>
             <Clock size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="card card-hover group hidden lg:block">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted mb-2">Successful Grants</p>
          <div className="flex items-center gap-3">
             <span className="text-3xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{stats.approved}</span>
             <CheckCircle2 size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section>
        <div className="flex items-end justify-between mb-8">
           <div>
              <h3 className="text-2xl mb-1">Public Services</h3>
              <p className="text-muted text-sm font-medium">Select a department to begin your application</p>
           </div>
           <button className="hidden lg:flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors group">
             Search Catalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        {servicesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 card animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/apply/${service.id}`)}
                className="card card-hover flex flex-col items-start gap-4 cursor-pointer group"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-500 shadow-xs"
                  style={{ backgroundColor: `${service.color}15`, color: service.color }}
                >
                  {service.icon || '📜'}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-1">{service.name}</h4>
                  <p className="text-muted text-xs font-medium leading-relaxed line-clamp-2">{service.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border w-full flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-extrabold uppercase text-muted">Fee</span>
                     <span className="text-sm font-bold text-primary">₹ {service.fee}</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                     <ArrowRight size={14} />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
