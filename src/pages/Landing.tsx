import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MousePointer2, 
  Smartphone, 
  FileCheck, 
  Award,
  Globe
} from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  const servicesPreview = [
    { name: 'Income Certificate', icon: '📜', color: '#059669' },
    { name: 'Birth Certificate', icon: '👶', color: '#0284c7' },
    { name: 'Aadhaar Services', icon: '🆔', color: '#7c3aed' },
    { name: 'Smart Card', icon: '💳', color: '#db2777' },
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfb]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="text-lg font-serif font-bold text-primary leading-none">Lakshmi</h1>
              <p className="text-[10px] text-accent font-extrabold uppercase tracking-widest mt-1">E-Sevai Maiyam</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-bold text-muted hover:text-primary transition-colors">Services</a>
            <a href="#how-it-works" className="text-sm font-bold text-muted hover:text-primary transition-colors">How it Works</a>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
          {/* Mobile Menu Trigger */}
          <button onClick={() => navigate('/login')} className="md:hidden p-2 bg-primary/5 rounded-xl text-primary">
            <User size={20} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-bold text-xs uppercase tracking-widest mb-6">
              <Globe size={14} /> Digital India Initiative
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-primary leading-[1.1] mb-8">
              Governance Meets <br />
              <span className="text-accent italic">Digital Elegance.</span>
            </h1>
            <p className="text-xl text-muted font-medium leading-relaxed mb-10 max-w-lg">
              Lakshmi E-Sevai Maiyam provides a prestigious, secure gateway to public services for every citizen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="btn bg-primary text-white px-10 py-5 text-lg flex items-center justify-center gap-3 group"
              >
                Get Started Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#services" className="btn border-2 border-border text-primary px-10 py-5 text-lg hover:bg-surface-alt transition-colors inline-flex items-center justify-center">
                Explore Services
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-alt flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-muted">
                Trusted by <span className="text-primary">10k+ Citizens</span> across the region
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-2 rounded-[48px] shadow-2xl border border-white/50">
               <div className="bg-[#1a1a1a] rounded-[40px] overflow-hidden aspect-[4/3] relative">
                  {/* Mock Dashboard Preview */}
                  <div className="absolute inset-x-0 top-0 h-12 bg-white/5 backdrop-blur-md flex items-center px-6 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="p-8 mt-12 grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-24 rounded-2xl bg-white/10 animate-pulse shadow-inner" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="p-6 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
                       <Logo size={64} />
                       <div className="mt-4 text-center">
                          <p className="font-bold text-primary">Regional Portal</p>
                          <p className="text-xs text-muted">Powered by Lakshmi Maiyam</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            {/* Floating Accents */}
            <div className="absolute -top-10 -right-10 p-6 bg-white rounded-3xl shadow-xl flex items-center gap-4 z-20 border border-border">
               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                 <ShieldCheck size={24} />
               </div>
               <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-muted">Security</p>
                  <p className="font-bold text-primary">ISO 27001 Certified</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl lg:text-6xl font-serif font-black text-accent mb-2">150+</p>
            <p className="text-xs uppercase tracking-[0.2em] font-extrabold opacity-60">Digital Services</p>
          </div>
          <div>
            <p className="text-4xl lg:text-6xl font-serif font-black text-accent mb-2">48h</p>
            <p className="text-xs uppercase tracking-[0.2em] font-extrabold opacity-60">Avg. Processing</p>
          </div>
          <div>
            <p className="text-4xl lg:text-6xl font-serif font-black text-accent mb-2">12M+</p>
            <p className="text-xs uppercase tracking-[0.2em] font-extrabold opacity-60">Requests Served</p>
          </div>
          <div>
            <p className="text-4xl lg:text-6xl font-serif font-black text-accent mb-2">99.8%</p>
            <p className="text-xs uppercase tracking-[0.2em] font-extrabold opacity-60">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-32 px-6 bg-surface">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <p className="text-accent font-extrabold uppercase tracking-[0.3em] mb-4">Our Service Catalog</p>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary">Popular Citizen Services</h2>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesPreview.map((service, idx) => (
            <motion.div
              whileHover={{ y: -10 }}
              key={idx}
              className="card bg-white p-10 flex flex-col items-center text-center group cursor-pointer border-transparent hover:border-primary/20"
            >
              <div 
                className="w-20 h-20 rounded-[28px] flex items-center justify-center text-4xl mb-8 shadow-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${service.color}15`, color: service.color }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{service.name}</h3>
              <p className="text-sm text-muted font-medium leading-relaxed mb-6">
                Fast and digital processing with real-time tracking for all residents.
              </p>
              <div className="mt-auto text-primary font-bold text-sm underline-offset-4 decoration-accent/30 flex items-center gap-2 group-hover:underline">
                Learn More <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
               <h3 className="text-sm font-black text-accent uppercase tracking-[0.3em]">Modern Governance</h3>
               <h2 className="text-4xl font-serif font-bold text-primary leading-tight">Digital First <br />Infrastructure</h2>
               <p className="text-muted leading-relaxed">
                 We've redesigned the traditional government office experience to fit in your pocket, without compromising on security or dignity.
               </p>
               <button onClick={() => navigate('/login')} className="btn bg-primary text-white px-8 py-4">Explore More Features</button>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Smartphone, title: 'Mobile Friendly', desc: 'Apply from any device, anywhere in the world.' },
                { icon: Clock, title: '24/7 Access', desc: 'Our digital doors never close. Submit at your convenience.' },
                { icon: ShieldCheck, title: 'Vault Security', desc: 'Your documents are encrypted and protected at all times.' },
                { icon: FileCheck, title: 'Instant Verification', desc: 'Automated checks for faster processing cycles.' }
              ].map((feature, idx) => (
                <div key={idx} className="p-8 rounded-[32px] bg-white border border-border hover:border-accent transition-colors shadow-sm">
                   <feature.icon className="text-accent mb-6" size={32} />
                   <h4 className="text-lg font-bold text-primary mb-2">{feature.title}</h4>
                   <p className="text-sm text-muted font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
               <div className="flex items-center gap-3">
                 <Logo size={40} variant="light" />
                 <div>
                    <h1 className="text-lg font-serif font-bold leading-none">Lakshmi</h1>
                    <p className="text-[10px] text-accent font-extrabold tracking-[0.2em] mt-1 uppercase">E-Sevai Maiyam</p>
                 </div>
               </div>
               <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                 The official regional digital hub for citizen services. Empowering communities through technology and transparency since 2012.
               </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-accent transition-colors">Catalog</a></li>
                <li><button onClick={() => navigate('/guidelines')} className="hover:text-accent transition-colors">Citizen Charter</button></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Support Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li className="flex flex-col">
                  <span className="text-[10px] uppercase font-black opacity-40">Helpline</span>
                  <span className="font-bold text-white">1800-425-4567</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-[10px] uppercase font-black opacity-40">Email</span>
                  <span className="font-bold text-white">support@lakshmimaiyam.gov.in</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
             <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
               © 2026 Lakshmi E-Sevai Maiyam • All Rights Reserved
             </p>
             <div className="flex items-center gap-8">
               <div className="h-8 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black opacity-30">DIGITAL INDIA</span>
               </div>
               <div className="h-8 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black opacity-30">NIC CLOUD</span>
               </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icons
function User({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
