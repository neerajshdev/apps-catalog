'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppFormData, AppItem } from '@/types/app';
import { getLocalApps, updateLocalApp } from '@/lib/storage';
import { useToast } from '@/components/Toast';
import PublisherAppForm from '@/components/PublisherAppForm';
import ParticleBackground from '@/components/ParticleBackground';
import { IconArrowLeft } from '@/components/Icons';
import layoutStyles from '@/components/SharedLayout.module.css';
import buttonStyles from '@/components/Button.module.css';

export default function PublisherEditPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { showToast } = useToast();

    const [app, setApp] = useState<AppItem | null>(null);

    useEffect(() => {
        if (id) {
            const apps = getLocalApps();
            const found = apps.find(a => a.id === id);
            if (found) {
                setApp(found);
            } else {
                router.push('/publisher');
            }
        }
    }, [id, router]);

    const handleSaveApp = async (formData: AppFormData, appId?: string) => {
        if (!appId) return;

        const updatedList = updateLocalApp(appId, formData);

        const updatedApp = updatedList.find((a) => a.id === appId);
        if (updatedApp) {
            try {
                await fetch('/api/apps', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify(updatedApp)
                });
            } catch (err) {
                console.warn('API sync failed:', err);
            }
        }

        showToast({
            type: 'success',
            title: 'Application Updated',
            message: `Changes to "${formData.name}" have been saved.`
        });

        router.push('/publisher');
    };

    if (!app) return null;

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
                        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Edit Application</h1>
                    </div>
                </div>

                <PublisherAppForm
                    initialApp={app}
                    onCancel={() => router.push('/publisher')}
                    onSubmit={handleSaveApp}
                />
            </div>
        </div>
    );
}

