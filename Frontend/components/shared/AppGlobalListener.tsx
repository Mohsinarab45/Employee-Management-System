'use client';

import { useEffect } from 'react';
import { useUI } from '@/context/UIContext';

export function AppGlobalListener() {
  const { showToast } = useUI();

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvt = event as CustomEvent<{ message: string }>;
      if (customEvt.detail?.message) {
        showToast(customEvt.detail.message, 'error');
      }
    };

    window.addEventListener('ems_api_error', handleApiError);
    return () => {
      window.removeEventListener('ems_api_error', handleApiError);
    };
  }, [showToast]);

  return null;
}

export default AppGlobalListener;
