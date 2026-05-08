// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navigation } from './components/Navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Logo } from './components/Logo';

// Real Page Imports
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminServices } from './pages/AdminServices';
import { AdminRequests } from './pages/AdminRequests';
import { Activity } from './pages/Activity';
import { ApplyService } from './pages/ApplyService';
import { Profile } from './pages/Profile';
import { Guidelines } from './pages/Guidelines';
import { AdminManagement } from './pages/AdminManagement';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="content-inner w-full min-h-screen lg:pl-72 pt-24 lg:pt-8"
    >
      {children}
    </motion.div>
  );
}

import { useNotifications } from './hooks/useData';
import { Bell } from 'lucide-react';

function TopBar({ user }: { user: any }) {
  const adminNotifications = useNotifications(user.role === 'Admin' ? 'ADMIN' : '');

  return (
    <div className="hidden lg:flex fixed top-0 left-72 right-0 h-24 bg-white/80 backdrop-blur-3xl border-b border-border z-40 items-center justify-between px-10 shadow-sm">
       <div className="flex items-center gap-5">
         <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
            <Logo size={32} />
         </div>
         <div>
           <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-accent">Lakshmi E-Sevai Maiyam</p>
           <h2 className="text-xl font-bold font-serif text-primary">Regional Citizen Portal</h2>
         </div>
       </div>
       <div className="flex items-center gap-6">
          <div className="hidden xl:flex flex-col items-end">
            <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest">Village Unit</p>
            <p className="text-xs font-bold text-primary">TN-67-WEST-01</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex items-center gap-4">
             {user.role === 'Admin' && (
               <div className="relative p-2 bg-surface-alt rounded-full mr-2">
                  <Bell size={20} className="text-muted" />
                  {adminNotifications.some((n: any) => !n.read) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
               </div>
             )}
             <div className="text-right">
               <p className="text-sm font-bold text-primary">{user.name}</p>
               <p className="text-[10px] font-medium text-muted">{user.email}</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-surface-alt border-2 border-white shadow-lg flex items-center justify-center font-bold text-primary">
                {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
             </div>
          </div>
       </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fdfdfb]">
        <div className="flex flex-col items-center gap-8">
           <motion.div
             animate={{ 
               scale: [1, 1.1, 1],
               rotate: [0, 5, -5, 0]
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="relative"
           >
             <Logo size={80} />
             <div className="absolute inset-0 bg-primary/20 blur-2xl -z-10 rounded-full" />
           </motion.div>
           <div className="flex flex-col items-center gap-3">
             <div className="loader-spinner"></div>
             <p className="text-[10px] font-extrabold uppercase tracking-[0.5em] text-primary/60 animate-pulse">Establishing Secure Session</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#fdfdfb]">
        {user && <Navigation />}
        
        <main className="flex-1 overflow-x-hidden">
          {/* Desktop Top Bar (Only if logged in) */}
          {user && <TopBar user={user} />}

          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} />} />

              {/* Citizen Routes */}
              <Route path="/dashboard" element={user && user.role === 'User' ? <PageWrapper><Dashboard /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/apply/:serviceId" element={user && user.role === 'User' ? <PageWrapper><ApplyService /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/my-requests" element={user && user.role === 'User' ? <PageWrapper><Activity /></PageWrapper> : <Navigate to="/login" />} />

              {/* Admin Routes */}
              <Route path="/admin" element={user && user.role === 'Admin' ? <PageWrapper><AdminDashboard /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/admin/services" element={user && user.role === 'Admin' ? <PageWrapper><AdminServices /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/admin/requests" element={user && user.role === 'Admin' ? <PageWrapper><AdminRequests /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/admin/management" element={user && user.role === 'Admin' ? <PageWrapper><AdminManagement /></PageWrapper> : <Navigate to="/login" />} />

              {/* Shared Routes */}
              <Route path="/profile" element={user ? <PageWrapper><Profile /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/guidelines" element={user ? <PageWrapper><Guidelines /></PageWrapper> : <PageWrapper><Guidelines /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
