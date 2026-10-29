import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ResumePdf from './ResumePdf';

self.onmessage = async (event) => {
  try {
    const { userData, currentLang } = event.data;
    const blob = await pdf(<ResumePdf userData={userData} currentLang={currentLang} />).toBlob();
    self.postMessage({ success: true, blob });
  } catch (error) {
    console.error('PDF Worker Error:', error);
    self.postMessage({ success: false, error: error?.message || String(error) });
  }
};

