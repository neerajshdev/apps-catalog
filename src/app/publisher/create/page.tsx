'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppFormData } from '@/types/app';
import { createNewApp, saveLocalApps, getLocalApps } from '@/lib/storage';
import { useToast } from '@/components/Toast';
import PublisherAppForm from '@/components/PublisherAppForm';
import ParticleBackground from '@/components/ParticleBackground';
import { IconBox, IconArrowLeft } from '@/components/Icons';
import layoutStyles from '@/components/SharedLayout.module.css';
import buttonStyles from '@/components/Button.module.css';

export default function PublisherCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSaveApp = async (formData: AppFormData) => {
    const apps = getLocalApps();
    const newApp = createNewApp(formData);
    const updatedList = [newApp, ...apps];
    saveLocalApps(updatedList);

    try {
      await fetch('/api/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(newApp)
      });
    } catch (err) {
      console.warn('API sync failed:', err);
    }

    showToast({
      type: 'success',
      title: 'Application Published',
      message: `"${newApp.name}" is now live in the store.`
    });

    router.push('/publisher');
  };

  return (
    <div className={layoutStyles.appViewport}>
      <ParticleBackground />
      <div className={layoutStyles.mainContent} style={{ maxWidth: '1000px', paddingTop: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => router.push('/publisher')} className={buttonStyles.btnSecondary} style={{ marginBottom: '20px', border: 'none', background: 'transparent' }}>
            <IconArrowLeft size={18} />
            Back to Publisher Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Create New Application</h1>
          </div>
        </div>
        
        <PublisherAppForm 
          onCancel={() => router.push('/publisher')} 
          onSubmit={handleSaveApp} 
        />
      </div>
    </div>
  );
}

