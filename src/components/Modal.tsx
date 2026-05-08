
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl pointer-events-auto border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-serif text-primary">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-surface-alt rounded-full transition-colors"
                >
                  <X size={20} className="text-muted" />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
