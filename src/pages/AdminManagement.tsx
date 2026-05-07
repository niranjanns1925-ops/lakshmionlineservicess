import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAdmins } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase-init';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserPlus, UserMinus, ShieldCheck, Mail, Loader2, AlertCircle } from 'lucide-react';

export function AdminManagement() {
  const { user } = useAuth();
  const { admins, loading } = useAdmins();
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = user?.email === 'niranjanns1925@gmail.com';

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId || !newAdminEmail || !newAdminName) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await setDoc(doc(db, 'admins', newAdminId), {
        email: newAdminEmail,
        name: newAdminName,
        createdAt: new Date().toISOString(),
        addedBy: user?.email
      });
      setNewAdminId('');
      setNewAdminEmail('');
      setNewAdminName('');
    } catch (err: any) {
      setError(err.message || 'Failed to add admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!window.confirm('Are you sure you want to remove this officer?')) return;

    try {
      await deleteDoc(doc(db, 'admins', adminId));
    } catch (err: any) {
      alert('Failed to remove admin: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-linear-to-br from-[#1e3a8a] to-[#1e1e1e] rounded-[40px] shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.4em] opacity-70 mb-4">Governance Hub</p>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">Officer Management</h1>
          <p className="text-white/70 max-w-xl font-medium leading-relaxed">
            Manage the administrative personnel of Lakshmi E-Sevai Maiyam. Only established officers can grant or revoke portal access.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <ShieldCheck size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add Admin Form */}
        <div className="xl:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm sticky top-28">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
              <UserPlus className="text-accent" /> Appoint Officer
            </h2>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2 ml-1">Officer UID</label>
                <input
                  type="text"
                  placeholder="Firebase UID"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  className="w-full bg-surface-alt border border-border px-5 py-4 rounded-2xl focus:border-primary outline-hidden transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Officer Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full bg-surface-alt border border-border px-5 py-4 rounded-2xl focus:border-primary outline-hidden transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2 ml-1">Official Email</label>
                <input
                  type="email"
                  placeholder="email@lakshmimaiyam.gov.in"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full bg-surface-alt border border-border px-5 py-4 rounded-2xl focus:border-primary outline-hidden transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>

        {/* Admin List */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border bg-surface-alt/30">
              <h2 className="text-2xl font-serif font-bold text-primary">Active Officers</h2>
              <p className="text-sm text-muted font-medium">Currently authorized personnel with portal access.</p>
            </div>

            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-muted gap-4">
                  <Loader2 className="animate-spin" size={40} />
                  <p className="text-xs font-black uppercase tracking-widest">Hydrating Officer Records...</p>
                </div>
              ) : admins.length === 0 ? (
                <div className="p-20 text-center">
                  <p className="text-muted font-medium">No secondary officers appointed yet.</p>
                </div>
              ) : (
                admins.map((admin) => (
                  <div key={admin.id} className="p-8 flex items-center justify-between group hover:bg-surface-alt transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                        {admin.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                          {admin.name}
                          {admin.email === 'niranjanns1925@gmail.com' && (
                            <span className="bg-accent/10 text-accent text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Super Admin</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-muted font-medium flex items-center gap-1.5">
                            <Mail size={12} /> {admin.email}
                          </p>
                          <p className="text-[10px] text-muted font-black uppercase tracking-widest">
                            ID: {admin.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {admin.email !== 'niranjanns1925@gmail.com' && (
                      <button
                        onClick={() => handleRemoveAdmin(admin.id)}
                        className="p-3 text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Revoke Access"
                      >
                        <UserMinus size={20} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-accent/5 rounded-3xl border-2 border-dashed border-accent/20">
             <p className="text-xs text-primary/60 font-bold leading-relaxed">
               <span className="text-accent uppercase mr-2 tracking-widest">Warning:</span> 
               Revoking access is instantaneous. The removed officer will lose all administrative privileges upon their next session revalidation.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
