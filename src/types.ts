
export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  allowedTypes: string[]; // e.g. ["image/jpeg", "application/pdf"]
  required: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  fee: number;
  gst: number;
  processingDays: string;
  status: 'active' | 'inactive';
  requiredDocs: RequiredDocument[];
  requestCount: number;
  createdAt: any;
}

export interface UploadedDocument {
  docId: string; // matches RequiredDocument.id
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: any;
}

export interface Request {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  documents: UploadedDocument[];
  total: number;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  submittedAt: any;
  updatedAt: any;
  adminRemark?: string;
  timeline: any[];
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'User' | 'Admin';
  phone: string;
  createdAt: any;
}
