import { FILE_CATEGORIES } from './fileType.js';

type Category =
  'audio' | 'video' | 'image' | 'document' | 'archive' | 'folder' | 'unknown';

export function analyzePath(path: string): {
  extension: string | null;
  category: Category;
} {
  const normalizePath = path.trim();

  const fileExtRegex = /\.([a-z0-9]+)(?:[\?#].*)?$/i;
  const isTrailingSlash = /[/\\]$/.test(normalizePath);

  const match = normalizePath.match(fileExtRegex);

  if (!match || isTrailingSlash) {
    return {
      extension: null,
      category: 'folder',
    };
  }

  const ext = match[1].toLowerCase();

  let matchedCategory: Category = 'unknown';
  let categoryData = {
    label: 'Неизвестный файл',
    tool: 'Download Link',
  };

  for (const [catName, catDetails] of Object.entries(FILE_CATEGORIES)) {
    if (catDetails.extensions.includes(ext)) {
      matchedCategory = catName as Category;
      categoryData = catDetails;
      break;
    }
  }

  return {
    extension: ext,
    category: matchedCategory,
  };
}
