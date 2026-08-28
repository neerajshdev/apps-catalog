export type Platform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web';

export type Category = 
  | 'All'
  | 'Productivity'
  | 'Developer Tools'
  | 'Games'
  | 'Design & Creative'
  | 'AI & Machine Learning'
  | 'Utilities'
  | 'Audio & Video';

export interface SystemRequirements {
  os?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  graphics?: string;
}

export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  platforms: Platform[];
  version: string;
  releaseDate: string;
  fileSize: string;
  archiveFileName?: string;
  downloadUrl: string;
  iconUrl: string;
  youtubeVideos: string[];
  screenshots: string[];
  features: string[];
  systemRequirements?: SystemRequirements;
  developer: {
    name: string;
    website?: string;
    badge?: string;
  };
  stats: {
    downloads: number;
    rating: number;
    ratingCount: number;
  };
  isFeatured?: boolean;
  createdAt: number;
}

export interface AppFormData {
  name: string;
  tagline: string;
  description: string;
  category: Category;
  platforms: Platform[];
  version: string;
  fileSize: string;
  archiveFileName?: string;
  downloadUrl: string;
  iconUrl: string;
  youtubeVideos: string[];
  screenshots: string[];
  features: string[];
  developerName: string;
  developerWebsite?: string;
  osRequirement?: string;
  ramRequirement?: string;
  storageRequirement?: string;
  cpuRequirement?: string;
}

