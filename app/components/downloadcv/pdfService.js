import React from 'react';

/**
 * Downloads the user's CV as PDF.
 * Tries Web Worker first for non-blocking UI; falls back to direct client dynamic import if needed.
 */
export async function downloadCvPdf(userData, currentLang = 'en') {
  if (!userData) throw new Error('No user data provided');

  const triggerDownload = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = (userData?.fullname || userData?.username || 'Resume').trim();
    const cleanSpec = (userData?.specialization || '').trim();
    const fileBase = cleanSpec ? `${cleanName} — ${cleanSpec}` : `${cleanName} — CV`;
    const safeFileName = fileBase.replace(/[\\/:*?"<>|]/g, '').trim();
    link.download = `${safeFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 1. Try Web Worker
  try {
    const blob = await new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./pdfWorker.js', import.meta.url));
      const timeout = setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timed out'));
      }, 15000);

      worker.onmessage = (e) => {
        clearTimeout(timeout);
        worker.terminate();
        if (e.data?.success && e.data?.blob) {
          resolve(e.data.blob);
        } else {
          reject(new Error(e.data?.error || 'Worker generation failed'));
        }
      };

      worker.onerror = (err) => {
        clearTimeout(timeout);
        worker.terminate();
        reject(err);
      };

      worker.postMessage({ userData, currentLang });
    });

    triggerDownload(blob);
    return;
  } catch (workerErr) {
    console.warn('Web Worker PDF failed, falling back to direct client generation:', workerErr);
  }

  // 2. Direct client fallback with dynamic imports (lazy-loaded)
  const { pdf } = await import('@react-pdf/renderer');
  const ResumePdf = (await import('./ResumePdf')).default;
  const blob = await pdf(<ResumePdf userData={userData} currentLang={currentLang} />).toBlob();
  triggerDownload(blob);
}

