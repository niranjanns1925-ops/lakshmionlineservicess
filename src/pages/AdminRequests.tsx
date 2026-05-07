
import React, { useState } from 'react';
import { useRequests } from '../hooks/useData';
import { db } from '../firebase-init';
import { updateDoc, doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Clock, Eye, Download, MessageSquare, ChevronRight, Filter } from 'lucide-react';
import { Request } from '../types';

export function AdminRequests() {
  const { requests, loading } = useRequests(undefined, true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [remark, setRemark] = useState('');
  const [filter, setFilter] = useState('All');
  const [previewDoc, setPreviewDoc] = useState<{ url: string, name: string, type: string } | null>(null);

  const handleStatusUpdate = async (id: string, status: Request['status']) => {
    if (!remark && status === 'Rejected') {
      alert("Please provide a remark for rejection");
      return;
    }

    try {
      await updateDoc(doc(db, 'requests', id), {
        status,
        adminRemark: remark,
        updatedAt: serverTimestamp(),
        timeline: arrayUnion({
          status,
          label: `Status updated to ${status}`,
          remark: remark || 'No additional comments',
          timestamp: new Date().toISOString()
        })
      });
      setSelectedRequest(null);
      setRemark('');
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const filteredRequests = requests.filter(r => filter === 'All' || r.status === filter);

  if (loading) return <div className="p-10 text-center font-bold text-muted animate-pulse">Loading Queue...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Regional Queue</h1>
          <p className="text-muted font-medium">Manage and review incoming citizen service applications</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-border shadow-sm">
          {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Request List */}
        <div className="xl:col-span-2 space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="card text-center py-20">
               <div className="text-4xl mb-4">✨</div>
               <p className="font-bold text-muted">Queue is empty for this filter</p>
            </div>
          ) : (
            filteredRequests.map(req => (
              <div 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`card card-hover flex items-center justify-between p-6 cursor-pointer border-2 transition-all ${selectedRequest?.id === req.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center font-bold text-primary shadow-sm">
                    {req.userName ? req.userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '??'}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-0.5">{req.userName}</h4>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider">{req.serviceName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-1">Fee Paid</p>
                    <p className="text-sm font-bold text-primary">₹ {req.total}</p>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 ${
                    req.status === 'Approved' ? 'bg-green-50 text-green-700' :
                    req.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                    req.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {req.status === 'Pending' && <Clock size={12} />}
                    {req.status === 'Approved' && <CheckCircle2 size={12} />}
                    {req.status === 'Rejected' && <XCircle size={12} />}
                    {req.status}
                  </div>
                  
                  <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Request Details Sidebar */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="card sticky top-24 border-primary/20 shadow-2xl space-y-8"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-extrabold text-accent uppercase tracking-widest mb-1">Request Details</p>
                    <h3 className="text-xl font-bold text-primary">{selectedRequest.userName}</h3>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="text-muted hover:text-primary p-2">
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-muted uppercase tracking-widest flex items-center gap-2">
                    <Eye size={14} /> Uploaded Documents
                  </h4>
                  <div className="space-y-2">
                    {selectedRequest.documents?.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-surface-alt rounded-2xl border border-border flex items-center justify-between group hover:border-accent transition-colors">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-primary truncate max-w-[150px]">{doc.fileName}</p>
                          <p className="text-[10px] text-muted font-medium uppercase">{doc.fileType?.split('/')[1] || 'FILE'}</p>
                        </div>
                        <button 
                          onClick={() => setPreviewDoc({ url: doc.fileUrl, name: doc.fileName, type: doc.fileType || '' })}
                          className="p-2 bg-white rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={14} />
                        </button>
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-white rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    )) || (
                      <div className="p-4 text-center text-xs font-bold text-muted border-2 border-dashed border-border rounded-2xl italic">
                        No documents uploaded for this request
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {previewDoc && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                      onClick={() => setPreviewDoc(null)}
                    >
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-primary">{previewDoc.name}</h4>
                          <button onClick={() => setPreviewDoc(null)} className="text-muted hover:text-primary p-2">
                             <XCircle size={20} />
                          </button>
                        </div>
                        {previewDoc.type.includes('image') ? (
                          <img src={previewDoc.url} alt="Preview" className="w-full h-auto rounded-xl" />
                        ) : (
                          <iframe src={previewDoc.url} className="w-full h-[60vh] rounded-xl" title="PDF Preview" />
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-muted uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={14} /> Officer Remarks
                  </h4>
                  <textarea 
                    value={remark}
                    onChange={e => setRemark(e.target.value)}
                    placeholder="Enter process status or rejection reason..."
                    className="w-full bg-surface-alt border border-border rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'Approved')}
                    className="btn bg-success text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'Rejected')}
                    className="btn bg-red-50 text-red-600 border border-red-100 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'Under Review')}
                    className="col-span-2 btn btn-ghost text-xs font-bold"
                  >
                    Mark Under Review
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="card h-[400px] flex flex-col items-center justify-center text-center p-10 border-dashed border-2 opacity-50 select-none">
                 <div className="w-20 h-20 bg-surface-alt rounded-full flex items-center justify-center text-3xl mb-6">🖱️</div>
                 <p className="font-bold text-muted">Select an application from the queue to review documents</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
