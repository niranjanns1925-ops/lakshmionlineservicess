
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../firebase-init';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { FileUp, CheckCircle2, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Service, UploadedDocument } from '../types';

export function ApplyService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploads, setUploads] = useState<Record<string, File>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchService() {
      if (!serviceId) return;
      const docRef = doc(db, 'services', serviceId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setService({ id: snap.id, ...snap.data() } as Service);
      }
      setLoading(false);
    }
    fetchService();
  }, [serviceId]);

  const handleFileChange = (docId: string, file: File) => {
    const requirement = service?.requiredDocs.find(d => d.id === docId);
    if (!requirement) return;

    if (!requirement.allowedTypes?.includes(file.type)) {
      setErrors(prev => ({ ...prev, [docId]: `Invalid file type. Allowed: ${requirement.allowedTypes?.join(', ') || 'N/A'}` }));
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[docId];
      return newErrors;
    });
    setUploads(prev => ({ ...prev, [docId]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !auth.currentUser) return;

    // Validate mandatory docs
    const newErrors: Record<string, string> = {};
    service.requiredDocs.forEach(doc => {
      if (doc.required && !uploads[doc.id]) {
        newErrors[doc.id] = 'This document is mandatory';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const uploadedDocs: UploadedDocument[] = [];
      const uploadPromises = Object.entries(uploads).map(([docId, file]: [string, File]) => {
        return new Promise<UploadedDocument>((resolve, reject) => {
          const storageRef = ref(storage, `requests/${auth.currentUser?.uid}/${Date.now()}_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(prev => ({ ...prev, [docId]: progress }));
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                docId,
                fileUrl: url,
                fileName: file.name,
                fileType: file.type,
                uploadedAt: new Date().toISOString()
              });
            }
          );
        });
      });

      const uploadedResults = await Promise.all(uploadPromises);
      uploadedDocs.push(...uploadedResults);


      await addDoc(collection(db, 'requests'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Citizen',
        serviceId: service.id,
        serviceName: service.name,
        documents: uploadedDocs,
        total: service.fee,
        status: 'Pending',
        adminRemark: '',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        timeline: [
          { status: 'Pending', label: 'Application Submitted', timestamp: new Date().toISOString() }
        ]
      });

      navigate('/my-requests');
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!service) return <div>Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-muted hover:text-primary font-bold text-sm mb-8 transition-colors"
      >
        <ChevronLeft size={18} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <header>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-border" style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                 {service.icon}
               </div>
               <div>
                  <h1 className="text-3xl font-serif font-bold text-primary">{service.name}</h1>
                  <p className="text-muted font-medium">{service.category}</p>
               </div>
            </div>
            <p className="text-muted leading-relaxed">{service.description}</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <FileUp size={20} className="text-accent" /> Document Uploads
              </h3>

              <div className="space-y-4">
                {service.requiredDocs.map(doc => (
                  <div key={doc.id} className="card bg-white p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2">
                          {doc.name}
                          {doc.required && <span className="text-red-500 text-xs font-black">*</span>}
                        </h4>
                        <p className="text-muted text-xs font-medium">{doc.description || `Required format: ${doc.allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`}</p>
                      </div>
                      {uploads[doc.id] && (
                        <CheckCircle2 className="text-success animate-in zoom-in" size={24} />
                      )}
                    </div>

                    <div 
                      className="relative"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) handleFileChange(doc.id, e.dataTransfer.files[0]);
                      }}
                    >
                      <input 
                        type="file" 
                        accept={doc.allowedTypes?.join(',') || ''}
                        onChange={e => e.target.files?.[0] && handleFileChange(doc.id, e.target.files[0])}
                        className="hidden" 
                        id={`file-${doc.id}`}
                      />
                      <label 
                        htmlFor={`file-${doc.id}`}
                        className={`w-full flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-[20px] cursor-pointer transition-all ${uploads[doc.id] ? 'bg-success/5 border-success text-success' : 'border-border hover:border-primary hover:bg-surface-alt text-muted'}`}
                      >
                        {uploadProgress[doc.id] !== undefined && uploadProgress[doc.id] < 100 ? (
                            <div className="w-full">
                                <div className="text-center font-bold text-xs mb-1">{Math.round(uploadProgress[doc.id])}%</div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-success transition-all" style={{ width: `${uploadProgress[doc.id]}%` }}></div>
                                </div>
                            </div>
                        ) : uploadProgress[doc.id] === 100 ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-center"
                          >
                            <CheckCircle2 size={32} className="text-success mb-2" />
                            <span className="text-success font-bold text-sm">Uploaded</span>
                          </motion.div>
                        ) : (
                          <>
                            <FileUp size={24} />
                            <span className="text-sm font-bold truncate max-w-[200px]">
                              {uploads[doc.id] ? uploads[doc.id].name : 'Choose file or drag here'}
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    <AnimatePresence>
                      {errors[doc.id] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors[doc.id]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full btn bg-primary text-white py-6 rounded-[24px] shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing Application...
                </>
              ) : (
                <>Submit Application • ₹ {service.fee}</>
              )}
            </button>
          </form>
        </div>

        <aside className="space-y-6">
           <div className="card bg-surface-alt border-accent/20">
              <h3 className="font-bold text-primary mb-4">Application Summary</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted">Service Fee</span>
                    <span className="font-bold text-primary">₹ {service.fee}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted">GST (18%)</span>
                    <span className="font-bold text-primary">₹ {(service.fee * 0.18).toFixed(2)}</span>
                 </div>
                 <div className="pt-4 border-t border-border flex justify-between">
                    <span className="font-bold text-primary">Total Payable</span>
                    <span className="font-serif font-black text-xl text-accent">₹ {(service.fee * 1.18).toFixed(2)}</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 italic text-xs text-blue-700 leading-relaxed">
             Important: Please ensure all uploaded documents are clear and legible. Blurred images or incorrect formats may result in application rejection.
           </div>
        </aside>
      </div>
    </div>
  );
}
