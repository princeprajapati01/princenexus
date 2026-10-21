/**
 * Video Helper: Formats arbitrary video links (YouTube, Google Drive, Vimeo, Loom, Streamable, Direct Video)
 * into streamable and embeddable URLs for the Prince Nexus portfolio.
 */

export interface FormattedVideo {
  embedUrl: string;
  externalUrl: string;
  isIframe: boolean;
  type: 'youtube' | 'google-drive' | 'vimeo' | 'loom' | 'streamable' | 'direct' | 'other';
}

export function formatVideoUrl(rawUrl: string): FormattedVideo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { embedUrl: '', externalUrl: '', isIframe: false, type: 'other' };
  }

  const url = rawUrl.trim();

  // 1. YouTube Watch, Shorts, or youtu.be shortlinks
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      externalUrl: `https://www.youtube.com/watch?v=${ytMatch[1]}`,
      isIframe: true,
      type: 'youtube',
    };
  }

  // 2. Google Drive video share links
  const gDriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gDriveMatch = url.match(gDriveRegex);
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      externalUrl: `https://drive.google.com/file/d/${fileId}/view`,
      isIframe: true,
      type: 'google-drive',
    };
  }

  // 3. Vimeo links
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      externalUrl: `https://vimeo.com/${vimeoMatch[1]}`,
      isIframe: true,
      type: 'vimeo',
    };
  }

  // 4. Loom video share links
  const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/;
  const loomMatch = url.match(loomRegex);
  if (loomMatch && loomMatch[1]) {
    return {
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      externalUrl: `https://www.loom.com/share/${loomMatch[1]}`,
      isIframe: true,
      type: 'loom',
    };
  }

  // 5. Streamable links
  const streamableRegex = /streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/;
  const streamableMatch = url.match(streamableRegex);
  if (streamableMatch && streamableMatch[1]) {
    return {
      embedUrl: `https://streamable.com/e/${streamableMatch[1]}`,
      externalUrl: `https://streamable.com/${streamableMatch[1]}`,
      isIframe: true,
      type: 'streamable',
    };
  }

  // 6. Existing iframe embeds (already formatted)
  if (url.includes('/embed/') || url.includes('/preview')) {
    return {
      embedUrl: url,
      externalUrl: url,
      isIframe: true,
      type: 'other',
    };
  }

  // 7. Direct video files or cloud storage URLs (.mp4, .webm, .mov, Cloudinary, S3, etc.)
  return {
    embedUrl: url,
    externalUrl: url,
    isIframe: false,
    type: 'direct',
  };
}
