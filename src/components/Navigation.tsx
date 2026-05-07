// src/components/Navigation.tsx
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, User, ShieldCheck, LogOut, Gavel, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

export function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'Admin';

  const userLinks = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/my-requests', label: 'Activity', icon: ClipboardList },
    { to: '/guidelines', label: 'Rules', icon: Gavel },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
    { to: '/admin/services', label: 'Catalog', icon: Home },
    { to: '/admin/requests', label: 'Queue', icon: ClipboardList },
    { to: '/admin/management', label: 'Officers', icon: Users },
    { to: '/guidelines', label: 'Rules', icon: Gavel },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-screen w-72 bg-primary text-white border-r border-white/5 shadow-xl z-100 hidden lg:flex flex-col">
        <div className="p-8 pb-4 flex items-center gap-4">
          <div className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
             <Logo size={40} variant="light" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-white tracking-tight leading-none">Lakshmi</h1>
            <p className="text-[10px] text-accent font-extrabold tracking-[0.2em] mt-1 uppercase">E-Sevai Maiyam</p>
          </div>
        </div>

        <div className="flex-1 px-8 py-8 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 font-semibold text-[15px] rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-accent/15 text-white ring-inset ring-1 ring-accent/30 shadow-[inset_3px_0_0_var(--color-accent)]'
                    : 'text-white/50 hover:text-white hover:bg-white/10 hover:translate-x-1'
                }`
              }
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-8 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-4 px-5 py-4 font-semibold text-[15px] text-white/50 hover:text-red-400 w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Floating Mobile Nav - "Island" Style */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-4 right-4 h-18 bg-white/95 backdrop-blur-2xl border border-border rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex items-center justify-around px-4 z-50 lg:hidden"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-2xl transition-colors ${isActive ? 'bg-surface-alt' : ''}`}>
                  <link.icon size={22} />
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none">
                  {link.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="bubble"
                    className="absolute -top-1 w-1 h-1 bg-accent rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 flex-1 text-muted"
        >
          <div className="p-2">
            <LogOut size={22} />
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none">Exit</span>
        </button>
      </motion.nav>
    </>
  );
}
