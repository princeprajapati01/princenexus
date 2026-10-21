/**
 * Video Helper: Formats arbitrary video links (YouTube, Google Drive, Vimeo, Loom, Direct Video)
 * into streamable and embeddable URLs for the Prince Nexus portfolio.
 */

export interface FormattedVideo {
  embedUrl: string;
  isIframe: boolean;
  type: 'youtube' | 'google-drive' | 'vimeo' | 'loom' | 'direct' | 'other';
}

export function formatVideoUrl(rawUrl: string): FormattedVideo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { embedUrl: '', isIframe: false, type: 'other' };
  }

  const url = rawUrl.trim();

  // 1. YouTube Watch, Shorts, or youtu.be shortlinks
  // Examples:
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://www.youtube.com/shorts/dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      isIframe: true,
      type: 'youtube',
    };
  }

  // 2. Google Drive video share links
  // Example: https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing
  const gDriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gDriveMatch = url.match(gDriveRegex);
  if (gDriveMatch && gDriveMatch[1]) {
    return {
      embedUrl: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`,
      isIframe: true,
      type: 'google-drive',
    };
  }

  // 3. Vimeo links
  // Examples: https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isIframe: true,
      type: 'vimeo',
    };
  }

  // 4. Loom video share links
  // Example: https://www.loom.com/share/abc12345
  const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/;
  const loomMatch = url.match(loomRegex);
  if (loomMatch && loomMatch[1]) {
    return {
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      isIframe: true,
      type: 'loom',
    };
  }

  // 5. Existing iframe embeds (already formatted)
  if (url.includes('/embed/') || url.includes('/preview')) {
    return {
      embedUrl: url,
      isIframe: true,
      type: 'other',
    };
  }

  // 6. Direct video files or cloud storage URLs (.mp4, .webm, .mov, Cloudinary, S3, etc.)
  return {
    embedUrl: url,
    isIframe: false,
    type: 'direct',
  };
}
