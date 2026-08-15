"use client";
import { useState, useEffect, useCallback } from 'react';

// Create a function that also has success/error properties
const toastBase = (message) => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'success' } }));
};

toastBase.success = (message) => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'success' } }));
};
toastBase.error = (message) => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'error' } }));
};
toastBase.info = (message) => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'info' } }));
};
toastBase.warning = (message) => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'warning' } }));
};

export const toast = toastBase;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type } = event.detail;
      addToast(message, type);
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, [addToast]);

  const icons = {
    success: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-in slide-in-from-right-full fade-in duration-300"
          >
            <div className="relative overflow-hidden group">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl py-4 pl-4 pr-6 flex items-center gap-4 min-w-[320px] max-w-md transition-all">
                {/* Status Indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  t.type === 'success' ? 'bg-emerald-50' :
                  t.type === 'error' ? 'bg-rose-50' :
                  t.type === 'warning' ? 'bg-amber-50' :
                  'bg-blue-50'
                }`}>
                  {icons[t.type]}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 italic">
                    {t.message}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  t.type === 'success' ? 'bg-emerald-500' :
                  t.type === 'error' ? 'bg-rose-500' :
                  t.type === 'warning' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
