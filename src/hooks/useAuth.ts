// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { auth as firebaseAuth, googleProvider, db } from '../firebase-init';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  phone?: string;
  createdAt?: any;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
        
        const isBootstrapped = firebaseUser.email === 'admin@lakshmi.gov.in' || firebaseUser.email === 'niranjanns1925@gmail.com';
        const isAdmin = adminDoc.exists() || isBootstrapped;

        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          // If role changed (e.g. promoted to admin), update state
          if (isAdmin && data.role !== 'Admin') {
             const updated = { ...data, role: 'Admin' as const };
             setUser(updated);
             await setDoc(doc(db, 'users', firebaseUser.uid), updated);
          } else {
             setUser(data);
          }
        } else {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Citizen User',
            email: firebaseUser.email!,
            role: isAdmin ? 'Admin' : 'User',
            phone: '',
            createdAt: serverTimestamp()
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          if (isBootstrapped && !adminDoc.exists()) {
            await setDoc(doc(db, 'admins', firebaseUser.uid), { 
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'Super Admin',
              role: 'Admin',
              createdAt: serverTimestamp()
            });
          }
          setUser(profile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (role: 'Admin' | 'User' = 'User') => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
  };

  return { user, loading, login, logout };
}
