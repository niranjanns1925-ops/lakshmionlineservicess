import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info, FileText, AlertCircle, CheckCircle2, Scale } from 'lucide-react';

export function Guidelines() {
  const rules = [
    {
      title: 'Documentation Validity',
      content: 'All documents uploaded must be original scans or digitally signed copies. Blurred or photocopied documents may lead to immediate rejection.',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Information Accuracy',
      content: 'Citizens are responsible for the accuracy of information provided. Providing false information is a punishable offense under the Digital Services Act.',
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      title: 'Single Application Rule',
      content: 'Do not submit multiple applications for the same service while one is still pending. Duplicate applications will be automatically archived.',
      icon: AlertCircle,
      color: 'amber'
    },
    {
      title: 'Identity Verification',
      content: 'Aadhaar-based E-KYC is mandatory for high-priority services. Ensure your mobile number is linked to your Aadhaar for OTP verification.',
      icon: ShieldCheck,
      color: 'primary'
    },
    {
      title: 'Timelines & SLAs',
      content: 'Processing times vary by service. Standard Service Level Agreements (SLAs) are between 3 to 15 working days.',
      icon: Info,
      color: 'purple'
    },
    {
      title: 'Legal Compliance',
      content: 'Users must adhere to the IT Act 2000 and subsequent amendments while using this portal.',
      icon: Scale,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-linear-to-br from-primary to-primary-light rounded-[40px] shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.4em] opacity-70 mb-4">Regulatory Framework</p>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">Citizen Charter & Rules</h1>
          <p className="text-white/70 max-w-xl font-medium leading-relaxed">
            Please review these guidelines to ensure a smooth and successful service delivery experience.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Scale size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rules.map((rule, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-8 bg-white border border-border rounded-[32px] hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl bg-surface-alt flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <rule.icon className="text-primary" size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-4">{rule.title}</h3>
            <p className="text-sm text-muted font-medium leading-relaxed">
              {rule.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-white border border-border rounded-[40px] shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
        <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
          <AlertCircle className="text-primary" size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-2xl font-serif font-bold text-primary mb-2">
            Need Clarification?
          </h4>
          <p className="text-sm text-muted font-medium max-w-xl leading-relaxed">
            While we strive for transparency, governance can be complex. If you are unsure about any rule, requirement, or the status of your application, our dedicated support team is here to assist you.
          </p>
        </div>
        <div className="shrink-0">
          <button className="px-10 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Contact Support
          </button>
        </div>
        {/* Subtle background pattern */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      </div>
    </div>
  );
}
