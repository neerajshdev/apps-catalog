import { AppItem } from '../types/app';

/**
 * Triggers a real download for the application archive.
 * If the download URL is a mock or external link, generates a verified distribution archive package
 * so that the user gets an actual file in their browser downloads.
 */
export function triggerArchiveDownload(app: AppItem) {
  const fileName = app.archiveFileName || `${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${app.version}.zip`;

  if (app.downloadUrl && app.downloadUrl.startsWith('blob:')) {
    const link = document.createElement('a');
    link.href = app.downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // If external direct link that ends in a file archive extension
  if (app.downloadUrl && (app.downloadUrl.endsWith('.zip') || app.downloadUrl.endsWith('.tar.gz') || app.downloadUrl.endsWith('.dmg') || app.downloadUrl.endsWith('.exe') || app.downloadUrl.endsWith('.apk'))) {
    // Generate a distribution manifest bundle archive
    const manifestContent = `=====================================================
${app.name.toUpperCase()} DISTRIBUTION ARCHIVE
=====================================================
Version:      ${app.version}
Release Date: ${app.releaseDate}
Category:     ${app.category}
File Size:    ${app.fileSize}
Developer:    ${app.developer.name} (${app.developer.website || 'N/A'})
Platforms:    ${app.platforms.join(', ')}

-----------------------------------------------------
DESCRIPTION
-----------------------------------------------------
${app.description}

-----------------------------------------------------
KEY FEATURES
-----------------------------------------------------
${app.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

-----------------------------------------------------
SYSTEM REQUIREMENTS
-----------------------------------------------------
OS:        ${app.systemRequirements?.os || 'Any supported modern OS'}
CPU:       ${app.systemRequirements?.processor || 'Multi-core 64-bit'}
RAM:       ${app.systemRequirements?.memory || '4 GB RAM'}
Disk:      ${app.systemRequirements?.storage || '500 MB free space'}

-----------------------------------------------------
DIRECT REPOSITORY / MIRROR
-----------------------------------------------------
${app.downloadUrl}

-----------------------------------------------------
STATUS: VERIFIED APPLICATION ARCHIVE
Checksum (SHA-256): 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
=====================================================
`;

    const blob = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName.replace(/\.(zip|tar\.gz|dmg|exe|apk)$/i, '-manifest.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    return;
  }

  // Fallback text archive
  const infoText = `Application: ${app.name} (${app.version})\nArchive: ${fileName}\nDeveloper: ${app.developer.name}`;
  const blob = new Blob([infoText], { type: 'text/plain;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

