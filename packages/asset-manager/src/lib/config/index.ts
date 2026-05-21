import path from 'node:path';
import type { FileCategory } from '../types/index.js';

/**
 * ASSETS_ROOT can be overridden via the ASSETS_ROOT env var.
 *
 * Default (production / NX monorepo):
 *   <repo-root>/apps/api/src/assets
 *
 * The env var is resolved at module load time, so set it before
 * importing this package (e.g. at the top of main.ts via dotenv or
 * an explicit `process.env.ASSETS_ROOT = ...` assignment).
 */
export const ASSETS_ROOT: string = process.env['ASSETS_ROOT']
  ? path.resolve(process.env['ASSETS_ROOT'])
  : path.resolve(process.cwd(), 'apps', 'api', 'src', 'assets');

export const TRASH_ROOT = path.join(ASSETS_ROOT, '.trash');

export const TOKEN_TTL_MS = 15 * 60 * 1_000;

export const PRESIGNED_PATH_PREFIX = '/presigned';

const MIME_TO_CATEGORY: Record<string, FileCategory> = {
  'image/jpeg':    'images',
  'image/png':     'images',
  'image/gif':     'images',
  'image/webp':    'images',
  'image/svg+xml': 'images',
  'image/avif':    'images',
  'image/bmp':     'images',
  'image/tiff':    'images',

  'font/ttf':                   'fonts',
  'font/otf':                   'fonts',
  'font/woff':                  'fonts',
  'font/woff2':                 'fonts',
  'application/font-woff':      'fonts',
  'application/font-woff2':     'fonts',
  'application/x-font-ttf':     'fonts',
  'application/x-font-opentype':'fonts',

  'audio/mpeg': 'audio',
  'audio/ogg':  'audio',
  'audio/wav':  'audio',
  'audio/webm': 'audio',
  'audio/flac': 'audio',
  'audio/aac':  'audio',

  'video/mp4':  'videos',
  'video/webm': 'videos',
  'video/ogg':  'videos',

  'application/pdf':                                                       'documents',
  'text/plain':                                                            'documents',
  'application/msword':                                                    'documents',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'documents',
  'application/vnd.ms-excel':                                              'documents',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':     'documents',
};

const FILE_CATEGORY_TO_SCHEMA: Record<FileCategory, string> = {
  images:    'image',
  fonts:     'font',
  audio:     'audio',
  videos:    'other',
  documents: 'document',
  misc:      'other',
};

export const resolveCategory = (mimeType: string): FileCategory =>
  MIME_TO_CATEGORY[mimeType] ?? 'misc';

export const toSchemaCategory = (category: FileCategory): string =>
  FILE_CATEGORY_TO_SCHEMA[category];

export const categoryDir = (category: FileCategory): string =>
  path.join(ASSETS_ROOT, category);

export const trashDir = (category: FileCategory): string =>
  path.join(TRASH_ROOT, category);

export const buildAbsolutePath = (category: FileCategory, storageKey: string): string =>
  path.join(categoryDir(category), storageKey);

export const buildTrashPath = (category: FileCategory, storageKey: string): string =>
  path.join(trashDir(category), storageKey);
