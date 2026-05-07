// src/pages/Profile.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { User, Mail, Phone, Shield, Camera, LogOut } from 'lucide-react';

export function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 lg:pb-12">
      <div className="card relative p-0 overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-40 bg-linear-to-br from-primary to-primary-light relative">
           <div className="absolute inset-0 opacity-10 bg-grid-white/10"></div>
        </div>
        
        <div className="px-10 pb-10 -mt-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-end gap-6 mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[24px] bg-white p-1 shadow-2xl overflow-hidden border-4 border-white">
                <div className="w-full h-full bg-surface-alt rounded-[20px] flex items-center justify-center text-4xl font-serif font-bold text-primary">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-accent text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 pb-4 text-center lg:text-left">
              <h1 className="text-3xl mb-1">{user.name}</h1>
              <p className="text-muted font-bold text-xs uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2">
                <Shield size={12} className="text-accent" /> {user.role === 'Admin' ? 'Government Officer' : 'Verified Citizen'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Unique Identifier</label>
              <div className="p-5 bg-surface-alt rounded-[20px] border border-border flex items-center gap-4">
                <User size={18} className="text-primary opacity-40" />
                <span className="font-mono font-bold text-sm text-primary">{user.uid}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Digital Mail</label>
              <div className="p-5 bg-surface-alt rounded-[20px] border border-border flex items-center gap-4">
                <Mail size={18} className="text-primary opacity-40" />
                <span className="font-bold text-sm text-primary">{user.email}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Communication</label>
              <div className="p-5 bg-surface-alt rounded-[20px] border border-border flex items-center gap-4">
                <Phone size={18} className="text-primary opacity-40" />
                <span className="font-bold text-sm text-primary">{user.phone || 'Not provided'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Account Verified</label>
              <div className="p-5 bg-surface-alt rounded-[20px] border border-border flex items-center gap-4">
                <Shield size={18} className="text-success opacity-40" />
                <span className="font-bold text-sm text-success">e-KYC Authenticated</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-border">
            <button className="btn btn-ghost hover:border-danger hover:text-danger">
              Update Security Details
            </button>
            <button onClick={logout} className="btn bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 px-8">
              <LogOut size={16} /> Secure Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 opacity-30 select-none">
        <div className="w-8 h-px bg-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">End to End Encrypted</p>
        <div className="w-8 h-px bg-primary" />
      </div>
    </div>
  );
}
