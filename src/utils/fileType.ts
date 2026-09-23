export const FILE_CATEGORIES = {
  audio: {
    label: 'Аудио',
    tool: 'HTML5 Audio Player / Web Audio API',
    extensions: ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'],
  },
  video: {
    label: 'Видео',
    tool: 'HTML5 Video Player / Video.js',
    extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'],
  },
  image: {
    label: 'Изображение',
    tool: 'HTML5 Image Tag / Canvas / Lightbox',
    extensions: [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'svg',
      'webp',
      'bmp',
      'ico',
      'avif',
    ],
  },
  document: {
    label: 'Документ / Текст',
    tool: 'PDF.js / Monaco Editor / Markdown Viewer / Text Reader',
    extensions: [
      'pdf',
      'txt',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'csv',
      'json',
      'xml',
      'md',
      'html',
      'css',
      'js',
    ],
  },
  archive: {
    label: 'Архив',
    tool: 'JSZip / Download Link',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
  },
};

export const mimeTypes: Record<string, string> = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',

  // Video
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.m4v': 'video/x-m4v',

  // Audio
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.opus': 'audio/opus',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.weba': 'audio/webm',
};
