// src/hooks/useData.ts
import { useState, useEffect } from 'react';
import { db } from '../firebase-init';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';

export function useServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { services, loading };
}

export function useRequests(userId?: string, isAdminMode = false) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not in admin mode and no userId, don't attempt broad query (security risk/error)
    if (!isAdminMode && !userId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    let q = query(collection(db, 'requests'), orderBy('submittedAt', 'desc'));
    if (userId) {
      q = query(collection(db, 'requests'), where('userId', '==', userId), orderBy('submittedAt', 'desc'));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore useRequests Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId, isAdminMode]);

  return { requests, loading };
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  return notifications;
}

export function useAdmins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'admins'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore useAdmins Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { admins, loading };
}
