
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth, storage, handleFirestoreError, OperationType } from '../firebase-init';
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
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topLevelError, setTopLevelError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'upload' | 'success'>('details');

  useEffect(() => {
    const newPreviews = { ...previews };
    (Object.entries(uploads) as [string, File][]).forEach(([docId, file]) => {
      if (!newPreviews[docId]) {
        newPreviews[docId] = URL.createObjectURL(file);
      }
    });
    setPreviews(newPreviews);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploads]);

  useEffect(() => {
    return () => {
      (Object.values(previews) as string[]).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [docId]: 'File is too large. Maximum size is 10MB.' }));
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
      setTopLevelError("Please upload all mandatory documents correctly.");
      return;
    }

    setTopLevelError(null);
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
            (error) => {
              console.error(`Storage Upload Error [${docId}]:`, error);
              reject(new Error(`Failed to upload ${file.name}: ${error.message}`));
            },
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
        total: Number((service.fee * 1.18).toFixed(2)),
        status: 'Pending',
        adminRemark: '',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        timeline: [
          { status: 'Pending', label: 'Application Submitted', timestamp: new Date().toISOString() }
        ]
      });

      // Send a notification to the administrator
      try {
        await addDoc(collection(db, 'notifications'), {
          userId: 'ADMIN',
          title: 'New Service Request',
          message: `${auth.currentUser.displayName} applied for ${service.name}`,
          type: 'system',
          read: false,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Failed to send admin notification", err);
      }

      setStep('success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'requests');
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

          {step === 'details' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary border-b border-border pb-2">Required Documents</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted">
                  {service.requiredDocs.map(doc => (
                    <li key={doc.id}>
                      <span className="font-bold text-primary">{doc.name}</span>
                      {doc.required && <span className="text-red-500 font-bold ml-1">*</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => setStep('upload')}
                className="w-full btn bg-primary text-white py-6 rounded-[24px] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                Proceed to Upload Documents • Total: ₹{(service.fee * 1.18).toFixed(2)}
              </button>
            </div>
          )}

          {step === 'upload' && (
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
                        ) : uploads[doc.id] && (uploadProgress[doc.id] === undefined || uploadProgress[doc.id] === 100) ? (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex flex-col items-center w-full"
                            >
                              <CheckCircle2 size={32} className="text-success mb-2" />
                              <span className="text-success font-bold text-sm mb-2 text-center w-full truncate px-4">
                                {uploads[doc.id].name}
                              </span>
                              {uploads[doc.id].type.startsWith('image/') ? (
                                <img src={previews[doc.id]} alt="Preview" className="max-h-32 object-contain rounded-lg shadow-sm border border-border" />
                              ) : (
                                <a 
                                  href={previews[doc.id]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary font-bold underline mt-2"
                                  onClick={e => e.stopPropagation()}
                                >
                                  Preview Document
                                </a>
                              )}
                            </motion.div>
                         ) : (
                          <>
                            <FileUp size={24} />
                            <span className="text-sm font-bold truncate max-w-[200px]">
                              Choose file or drag here
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

              <AnimatePresence>
                {topLevelError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-sm flex items-center gap-3"
                  >
                    <AlertCircle size={20} />
                    {topLevelError}
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <>Submit Application • ₹ {(service.fee * 1.18).toFixed(2)}</>
                )}
              </button>
            </form>
          )}

          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-success text-white p-10 rounded-[32px] text-center space-y-6 shadow-xl"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                <p className="text-white/80">Your request has been sent for review. You can track the status in your activity dashboard.</p>
              </div>
              <button 
                onClick={() => navigate('/my-requests')}
                className="px-8 py-4 bg-white text-success font-bold flex items-center justify-center rounded-2xl w-full"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
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
