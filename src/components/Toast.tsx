'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconInfo, IconClose } from './Icons';
import toastStyles from '@/components/Toast.module.css';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={toastStyles.toastContainer} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={toastStyles.toast}>
            {t.type === 'error' ? (
              <div style={{ color: 'var(--accent-rose)', display: 'flex' }}>
                <IconInfo size={20} />
              </div>
            ) : (
              <div style={{ color: 'var(--accent-emerald)', display: 'flex' }}>
                <IconCheck size={20} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
              {t.message && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{t.message}</div>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <IconClose size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

