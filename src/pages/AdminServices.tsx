
import React, { useState } from 'react';
import { useServices } from '../hooks/useData';
import { db, handleFirestoreError, OperationType } from '../firebase-init';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Save, X, FileText, CheckCircle2 } from 'lucide-react';
import { Service, RequiredDocument } from '../types';

export function AdminServices() {
  const { services, loading } = useServices();
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyService: Partial<Service> = {
    name: '',
    category: 'Registration',
    description: '',
    fee: 0,
    gst: 18,
    processingDays: '15',
    icon: '📜',
    color: '#059669',
    status: 'active',
    requiredDocs: [],
    requestCount: 0
  };

  const handleSave = async () => {
    if (!editingService?.name) return;

    try {
      if (editingService.id) {
        const { id, ...data } = editingService;
        await updateDoc(doc(db, 'services', id), {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'services'), {
          ...editingService,
          createdAt: serverTimestamp(),
          requestCount: 0
        });
      }
      setEditingService(null);
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, editingService.id ? OperationType.UPDATE : OperationType.CREATE, editingService.id ? `services/${editingService.id}` : 'services');
    }
  };

  const addRequiredDoc = () => {
    const newDoc: RequiredDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      allowedTypes: ['application/pdf', 'image/jpeg'],
      required: true
    };
    setEditingService(prev => ({
      ...prev,
      requiredDocs: [...(prev?.requiredDocs || []), newDoc]
    }));
  };

  const removeRequiredDoc = (id: string) => {
    setEditingService(prev => ({
      ...prev,
      requiredDocs: prev?.requiredDocs?.filter(d => d.id !== id)
    }));
  };

  const updateRequiredDoc = (id: string, field: keyof RequiredDocument, value: any) => {
    setEditingService(prev => ({
      ...prev,
      requiredDocs: prev?.requiredDocs?.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  if (loading) return <div>Loading Catalog...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Service Catalog</h1>
          <p className="text-muted font-medium">Define governance services and required citizen documents</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingService(emptyService); }}
          className="btn bg-primary text-white flex items-center gap-2"
        >
          <Plus size={18} /> New Service
        </button>
      </div>

      {(isAdding || editingService) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-primary">
                {editingService?.id ? 'Edit Service' : 'Define New Service'}
              </h2>
              <button onClick={() => { setEditingService(null); setIsAdding(false); }} className="text-muted hover:text-primary">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Service Name</label>
                <input 
                  type="text" 
                  value={editingService?.name} 
                  onChange={e => setEditingService(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Income Certificate"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Category</label>
                <select 
                  value={editingService?.category} 
                  onChange={e => setEditingService(prev => ({ ...prev, category: e.target.value as any }))}
                  className="input-field"
                >
                  <option value="Registration">Registration</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Welfare">Welfare</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Service Fee (₹)</label>
                <input 
                  type="number" 
                  value={editingService?.fee} 
                  onChange={e => setEditingService(prev => ({ ...prev, fee: Number(e.target.value) }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">GST (%)</label>
                <input 
                  type="number" 
                  value={editingService?.gst} 
                  onChange={e => setEditingService(prev => ({ ...prev, gst: Number(e.target.value) }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">SLA (Days)</label>
                <input 
                  type="text" 
                  value={editingService?.processingDays} 
                  onChange={e => setEditingService(prev => ({ ...prev, processingDays: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Status</label>
                <select 
                  value={editingService?.status} 
                  onChange={e => setEditingService(prev => ({ ...prev, status: e.target.value as any }))}
                  className="input-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-muted tracking-widest pl-1">Description</label>
                <textarea 
                  value={editingService?.description} 
                  onChange={e => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <FileText size={18} className="text-accent" /> Required Documents
                </h3>
                <button 
                  onClick={addRequiredDoc}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Requirement
                </button>
              </div>

              <div className="space-y-3">
                {editingService?.requiredDocs?.map((doc, index) => (
                  <div key={doc.id} className="p-4 bg-surface-alt rounded-2xl border border-border space-y-3">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={doc.name}
                        onChange={e => updateRequiredDoc(doc.id, 'name', e.target.value)}
                        placeholder="Document Name (e.g. Aadhaar Card)"
                        className="flex-1 bg-white border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary"
                      />
                      <button onClick={() => removeRequiredDoc(doc.id)} className="text-muted hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-muted cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={doc.allowedTypes?.includes('application/pdf') || false}
                          onChange={e => {
                            const currentTypes = doc.allowedTypes || [];
                            const types = e.target.checked 
                              ? [...currentTypes, 'application/pdf']
                              : currentTypes.filter(t => t !== 'application/pdf');
                            updateRequiredDoc(doc.id, 'allowedTypes', types);
                          }}
                        /> PDF
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-muted cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={doc.allowedTypes?.includes('image/jpeg') || false}
                          onChange={e => {
                            const currentTypes = doc.allowedTypes || [];
                            const types = e.target.checked 
                              ? [...currentTypes, 'image/jpeg']
                              : currentTypes.filter(t => t !== 'image/jpeg');
                            updateRequiredDoc(doc.id, 'allowedTypes', types);
                          }}
                        /> JPEG
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-muted cursor-pointer ml-auto">
                        <input 
                          type="checkbox" 
                          checked={doc.required}
                          onChange={e => updateRequiredDoc(doc.id, 'required', e.target.checked)}
                        /> Mandatory
                      </label>
                    </div>
                  </div>
                ))}
                {(!editingService?.requiredDocs || editingService.requiredDocs.length === 0) && (
                  <p className="text-center py-4 text-xs font-bold text-muted uppercase tracking-widest border-2 border-dashed border-border rounded-2xl">
                    No documents required for this service
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                onClick={handleSave}
                className="flex-1 btn bg-primary text-white flex items-center justify-center gap-2"
              >
                <Save size={18} /> {editingService?.id ? 'Update Service' : 'Create Service'}
              </button>
              <button 
                onClick={() => { setEditingService(null); setIsAdding(false); }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="card card-hover group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${service.color}15`, color: service.color }}
              >
                {service.icon}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest">Service Fee</p>
                <p className="text-lg font-bold text-primary font-serif">₹ {service.fee}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-primary mb-1">{service.name}</h3>
            <p className="text-xs text-muted font-medium mb-4">{service.category}</p>
            <p className="text-xs text-muted font-medium line-clamp-2 mb-6 flex-1">{service.description}</p>
            
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-accent" />
                <span className="text-[10px] font-extrabold text-muted uppercase tracking-widest">
                  {service.requiredDocs?.length || 0} Requirements
                </span>
              </div>
              <button 
                onClick={() => setEditingService(service)}
                className="text-xs font-bold text-primary hover:text-accent transition-colors"
              >
                Edit Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
