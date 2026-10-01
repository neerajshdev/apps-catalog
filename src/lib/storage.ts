import { AppItem, AppFormData, Platform } from '../types/app';
import { INITIAL_APPS } from '../data/initialApps';

const STORAGE_KEY = 'vault_apps_registry_v1';

export function getLocalApps(): AppItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_APPS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPS));
      return INITIAL_APPS;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Validate schema to prevent crashes from old localStorage data
      const isValid = parsed.every((app) => app && app.id && app.stats && app.platforms && app.category);
      if (isValid) {
        return parsed;
      } else {
        console.warn('Old or invalid app schema detected in localStorage. Resetting to defaults.');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPS));
        return INITIAL_APPS;
      }
    }
    return INITIAL_APPS;
  } catch (err) {
    console.error('Failed to load apps from localStorage:', err);
    return INITIAL_APPS;
  }
}

export function saveLocalApps(apps: AppItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save apps to localStorage:', err);
  }
}

export function createNewApp(formData: AppFormData): AppItem {
  const defaultPlatforms: Platform[] = ['windows'];
  const newApp: AppItem = {
    id: 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: formData.name.trim(),
    tagline: formData.tagline.trim(),
    description: formData.description.trim(),
    category: formData.category,
    platforms: formData.platforms.length > 0 ? formData.platforms : defaultPlatforms,
    version: formData.version.trim() || 'v1.0.0',
    releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    fileSize: formData.fileSize.trim() || '25.0 MB',
    archiveFileName: formData.archiveFileName || `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${formData.version || 'v1.0.0'}.zip`,
    downloadUrl: formData.downloadUrl.trim() || '#',
    iconUrl: formData.iconUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: formData.youtubeVideos.filter(v => v.trim().length > 0),
    screenshots: formData.screenshots.filter(s => s.trim().length > 0),
    features: formData.features.filter(f => f.trim().length > 0),
    systemRequirements: {
      os: formData.osRequirement?.trim() || 'Windows 10/11, macOS 12+, Linux',
      processor: formData.cpuRequirement?.trim() || '64-bit multi-core processor',
      memory: formData.ramRequirement?.trim() || '4 GB RAM',
      storage: formData.storageRequirement?.trim() || '500 MB free space'
    },
    developer: {
      name: formData.developerName.trim() || 'Indie Developer',
      website: formData.developerWebsite?.trim(),
      badge: 'Community Creator'
    },
    stats: {
      downloads: 0,
      rating: 5.0,
      ratingCount: 1
    },
    isFeatured: false,
    createdAt: Date.now()
  };

  return newApp;
}

export function updateLocalApp(appId: string, formData: AppFormData): AppItem[] {
  const currentApps = getLocalApps();
  const defaultPlatforms: Platform[] = ['windows'];
  const updated: AppItem[] = currentApps.map((item) => {
    if (item.id === appId) {
      const updatedApp: AppItem = {
        ...item,
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        category: formData.category,
        platforms: formData.platforms.length > 0 ? formData.platforms : defaultPlatforms,
        version: formData.version.trim() || item.version,
        fileSize: formData.fileSize.trim() || item.fileSize,
        archiveFileName: formData.archiveFileName || item.archiveFileName,
        downloadUrl: formData.downloadUrl.trim() || item.downloadUrl,
        iconUrl: formData.iconUrl.trim() || item.iconUrl,
        youtubeVideos: formData.youtubeVideos.filter(v => v.trim().length > 0),
        screenshots: formData.screenshots.filter(s => s.trim().length > 0),
        features: formData.features.filter(f => f.trim().length > 0),
        systemRequirements: {
          os: formData.osRequirement?.trim() || item.systemRequirements?.os,
          processor: formData.cpuRequirement?.trim() || item.systemRequirements?.processor,
          memory: formData.ramRequirement?.trim() || item.systemRequirements?.memory,
          storage: formData.storageRequirement?.trim() || item.systemRequirements?.storage
        },
        developer: {
          name: formData.developerName.trim() || item.developer.name,
          website: formData.developerWebsite?.trim() || item.developer.website,
          badge: item.developer.badge
        }
      };
      return updatedApp;
    }
    return item;
  });

  saveLocalApps(updated);
  return updated;
}

export function deleteLocalApp(appId: string): AppItem[] {
  const currentApps = getLocalApps();
  const updated = currentApps.filter((item) => item.id !== appId);
  saveLocalApps(updated);
  return updated;
}

export function toggleFeaturedApp(appId: string): AppItem[] {
  const currentApps = getLocalApps();
  const target = currentApps.find(a => a.id === appId);
  if (!target) return currentApps;

  const nextFeatured = !target.isFeatured;
  const updated = currentApps.map((item) => {
    if (item.id === appId) {
      return { ...item, isFeatured: nextFeatured };
    }
    return item;
  });

  saveLocalApps(updated);
  return updated;
}
