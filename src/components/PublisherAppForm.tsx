'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppFormData, AppItem, Category, Platform } from '../types/app';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../lib/youtube';
import { CATEGORIES } from './CategoryFilter';
import styles from './PublisherAppForm.module.css';
import buttonStyles from '@/components/Button.module.css';
import {
  IconClose,
  IconUpload,
  IconPlus,
  IconTrash,
  IconVideo,
  IconImage,
  IconBox,
  IconCheck,
  IconSparkles,
  IconWindows,
  IconApple,
  IconLinux,
  IconAndroid,
  IconWeb,
  IconEdit
} from './Icons';

interface PublisherAppFormProps {
  initialApp?: AppItem | null;
  onCancel: () => void;
  onSubmit: (formData: AppFormData, appId?: string) => void;
}

export default function PublisherAppForm({
  initialApp = null,
  onCancel,
  onSubmit
}: PublisherAppFormProps) {
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);
  const archiveInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<AppFormData>({
    name: '',
    tagline: '',
    description: '',
    category: 'Productivity',
    platforms: ['windows', 'macos'],
    version: 'v1.0.0',
    fileSize: '45.0 MB',
    archiveFileName: '',
    downloadUrl: '',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [],
    screenshots: [],
    features: [],
    developerName: '',
    developerWebsite: '',
    osRequirement: 'Windows 10/11, macOS 12+, Linux',
    ramRequirement: '4 GB RAM',
    storageRequirement: '500 MB free disk space',
    cpuRequirement: '64-bit multi-core CPU'
  });

  const [videoInput, setVideoInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [screenshotUrlInput, setScreenshotUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialApp) {
      setFormData({
        name: initialApp.name,
        tagline: initialApp.tagline,
        description: initialApp.description,
        category: initialApp.category,
        platforms: initialApp.platforms,
        version: initialApp.version,
        fileSize: initialApp.fileSize,
        archiveFileName: initialApp.archiveFileName || '',
        downloadUrl: initialApp.downloadUrl,
        iconUrl: initialApp.iconUrl,
        youtubeVideos: [...initialApp.youtubeVideos],
        screenshots: [...initialApp.screenshots],
        features: [...initialApp.features],
        developerName: initialApp.developer.name,
        developerWebsite: initialApp.developer.website || '',
        osRequirement: initialApp.systemRequirements?.os || '',
        ramRequirement: initialApp.systemRequirements?.memory || '',
        storageRequirement: initialApp.systemRequirements?.storage || '',
        cpuRequirement: initialApp.systemRequirements?.processor || ''
      });
    }
  }, [initialApp]);

  const isEditMode = !!initialApp;

  const togglePlatform = (p: Platform) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(p);
      const updated = exists
        ? prev.platforms.filter((item) => item !== p)
        : [...prev.platforms, p];
      return { ...prev, platforms: updated };
    });
  };

  const handleIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setFormData((prev) => ({
            ...prev,
            iconUrl: loadEvent.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (loadEvent.target?.result) {
            setFormData((prev) => ({
              ...prev,
              screenshots: [...prev.screenshots, loadEvent.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddScreenshotUrl = () => {
    if (screenshotUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, screenshotUrlInput.trim()]
      }));
      setScreenshotUrlInput('');
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleArchiveFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFormData((prev) => ({
        ...prev,
        archiveFileName: file.name,
        fileSize: `${sizeMb} MB`,
        downloadUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleAddVideo = () => {
    if (videoInput.trim()) {
      const id = extractYouTubeId(videoInput.trim());
      if (!id) {
        setErrors((prev) => ({ ...prev, video: 'Please enter a valid YouTube video link or ID' }));
        return;
      }
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.video;
        return copy;
      });
      setFormData((prev) => ({
        ...prev,
        youtubeVideos: [...prev.youtubeVideos.filter((v) => v.trim()), videoInput.trim()]
      }));
      setVideoInput('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      youtubeVideos: prev.youtubeVideos.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features.filter((f) => f.trim()), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Application Name is required';
    if (!formData.tagline.trim()) newErrors.tagline = 'A short tagline is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.platforms.length === 0) newErrors.platforms = 'Select at least one supported platform';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const finalFormData = {
      ...formData,
      developerName: formData.developerName.trim() || 'Indie Developer',
      archiveFileName:
        formData.archiveFileName ||
        `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${formData.version}.zip`,
      screenshots:
        formData.screenshots.length > 0
          ? formData.screenshots
          : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=675&q=80'],
      youtubeVideos: formData.youtubeVideos.filter((v) => v.trim().length > 0)
    };

    onSubmit(finalFormData, initialApp?.id);
    setIsSubmitting(false);
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            {isEditMode ? <IconEdit size={18} /> : <IconBox size={18} />}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              {isEditMode ? `Edit Application: ${initialApp.name}` : 'Post Application Archive'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
              {isEditMode
                ? 'Update metadata, YouTube trailers, screenshots, and version packages'
                : 'Publish and distribute your application with screenshots and YouTube trailers'}
            </p>
          </div>
        </div>
      </div>

      {/* Body Form */}
      <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* SECTION 1: App Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, margin: 0 }}>
            1. Application Identity & Info
          </h4>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>
                Application Name *
                {errors.name && <span style={{ color: 'var(--accent-rose)', fontSize: '11px', marginLeft: '8px' }}>{errors.name}</span>}
              </label>
              <input
                type="text"
                className={styles["form-input"]}
                placeholder="e.g. Nova Studio, CyberStrike RPG"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Category</label>
              <select
                className={styles["form-select"]}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Short Tagline / Catchphrase *
              {errors.tagline && <span style={{ color: 'var(--accent-rose)', fontSize: '11px', marginLeft: '8px' }}>{errors.tagline}</span>}
            </label>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="e.g. High-performance GPU accelerated 3D canvas and editor"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Target Operating Systems *
              {errors.platforms && <span style={{ color: 'var(--accent-rose)', fontSize: '11px', marginLeft: '8px' }}>{errors.platforms}</span>}
            </label>
            <div className={styles["form-checkbox-group"]}>
              {[
                { id: 'windows', label: 'Windows', icon: <IconWindows size={14} /> },
                { id: 'macos', label: 'macOS', icon: <IconApple size={14} /> },
                { id: 'linux', label: 'Linux', icon: <IconLinux size={14} /> },
                { id: 'android', label: 'Android', icon: <IconAndroid size={14} /> },
                { id: 'web', label: 'Web / Browser', icon: <IconWeb size={14} /> }
              ].map((p) => {
                const checked = formData.platforms.includes(p.id as Platform);
                return (
                  <div
                    key={p.id}
                    className={`checkbox-chip ${checked ? 'checked' : ''}`}
                    onClick={() => togglePlatform(p.id as Platform)}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                    {checked && <IconCheck size={14} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

        {/* SECTION 2: App Icon & Archive Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, margin: 0 }}>
            2. App Icon & Archive File
          </h4>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>App Icon Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={formData.iconUrl}
                  alt="Icon Preview"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                    border: '1px solid var(--border-subtle)',
                    background: '#1e293b'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  <button
                    type="button"
                    className={buttonStyles.btnSecondary}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => iconInputRef.current?.click()}
                  >
                    <IconUpload size={14} />
                    Upload Icon File
                  </button>
                  <input ref={iconInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIconFileUpload} />
                  <input
                    type="text"
                    className={styles["form-input"]}
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                    placeholder="Or paste Icon Image URL"
                    value={formData.iconUrl.startsWith('data:') ? 'Image uploaded from file' : formData.iconUrl}
                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className={styles["form-group"]}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className={styles["form-label"]}>Version</label>
                  <input type="text" className={styles["form-input"]} placeholder="v1.0.0" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} />
                </div>
                <div>
                  <label className={styles["form-label"]}>Archive Size</label>
                  <input type="text" className={styles["form-input"]} placeholder="45.0 MB" value={formData.fileSize} onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Application Archive File (.zip, .exe, .dmg, .apk, .tar.gz)
              <span className={styles["form-label-hint"]}>Upload archive or specify download link</span>
            </label>
            <div className={styles["file-dropzone"]} onClick={() => archiveInputRef.current?.click()}>
              <IconBox size={28} color="var(--accent-cyan)" />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formData.archiveFileName ? (
                  <span style={{ color: 'var(--accent-emerald)' }}>Selected: {formData.archiveFileName} ({formData.fileSize})</span>
                ) : 'Click to select application archive file from disk'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Supports .zip, .exe, .dmg, .apk, .tar.gz, .app, .AppImage</div>
            </div>
            <input ref={archiveInputRef} type="file" style={{ display: 'none' }} onChange={handleArchiveFileUpload} />
            <div style={{ marginTop: '8px' }}>
              <input type="text" className={styles["form-input"]} placeholder="Or provide direct Download URL" value={formData.downloadUrl.startsWith('blob:') ? '' : formData.downloadUrl} onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })} />
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

        {/* SECTION 3: Videos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, margin: 0 }}>
              3. Video Trailers (YouTube Embedded)
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVideo(); } }}
            />
            <button type="button" className={buttonStyles.btnSecondary} onClick={handleAddVideo} style={{ flexShrink: 0 }}>
              <IconPlus size={16} /> Add Video
            </button>
          </div>
          {errors.video && <span style={{ color: 'var(--accent-rose)', fontSize: '11px' }}>{errors.video}</span>}

          {formData.youtubeVideos.filter((v) => v.trim()).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.youtubeVideos.filter((v) => v.trim()).map((videoUrl, idx) => {
                const thumb = getYouTubeThumbnailUrl(videoUrl);
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      {thumb ? <img src={thumb} alt="Thumbnail" style={{ width: '60px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} /> : <IconVideo size={20} color="#f43f5e" />}
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{videoUrl}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveVideo(idx)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}><IconTrash size={16} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

        {/* SECTION 4: Screenshots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, margin: 0 }}>
            4. Screenshots & App Images
          </h4>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" className={buttonStyles.btnSecondary} onClick={() => screenshotInputRef.current?.click()}>
              <IconUpload size={16} /> Upload Screenshot Files
            </button>
            <input ref={screenshotInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleScreenshotFileUpload} />

            <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
              <input type="text" className={styles["form-input"]} placeholder="Or paste screenshot image URL" value={screenshotUrlInput} onChange={(e) => setScreenshotUrlInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddScreenshotUrl(); } }} />
              <button type="button" className={buttonStyles.btnSecondary} onClick={handleAddScreenshotUrl}><IconPlus size={16} /></button>
            </div>
          </div>

          {formData.screenshots.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {formData.screenshots.map((src, index) => (
                <div key={index} style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', aspectRatio: '16 / 9', border: '1px solid var(--border-subtle)' }}>
                  <img src={src} alt="Upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => handleRemoveScreenshot(index)} style={{ position: 'absolute', top: '4px', right: '4px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.75)', border: 'none', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><IconClose size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

        {/* SECTION 5: Description & Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, margin: 0 }}>
            5. Description & Key Capabilities
          </h4>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Detailed Application Description *
              {errors.description && <span style={{ color: 'var(--accent-rose)', fontSize: '11px', marginLeft: '8px' }}>{errors.description}</span>}
            </label>
            <textarea className={styles["form-textarea"]} rows={4} placeholder="Write a rich description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Key Features / Highlights</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className={styles["form-input"]} placeholder="e.g. Ultra-fast GPU vector rendering engine" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }} />
              <button type="button" className={buttonStyles.btnSecondary} onClick={handleAddFeature}><IconPlus size={16} /> Add</button>
            </div>

            {formData.features.filter((f) => f.trim()).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {formData.features.filter((f) => f.trim()).map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCheck size={14} color="var(--accent-emerald)" /><span>{feat}</span></div>
                    <button type="button" onClick={() => handleRemoveFeature(idx)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IconClose size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Developer / Studio Name</label>
              <input type="text" className={styles["form-input"]} placeholder="e.g. Indie Dev" value={formData.developerName} onChange={(e) => setFormData({ ...formData, developerName: e.target.value })} />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Website / Repository URL</label>
              <input type="text" className={styles["form-input"]} placeholder="https://..." value={formData.developerWebsite || ''} onChange={(e) => setFormData({ ...formData, developerWebsite: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
          <button type="button" className={buttonStyles.btnSecondary} onClick={onCancel}>Cancel</button>
          <button type="submit" className={buttonStyles.btnPrimary} disabled={isSubmitting}>
            {isEditMode ? <IconEdit size={16} /> : <IconSparkles size={16} />}
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Application Archive'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

