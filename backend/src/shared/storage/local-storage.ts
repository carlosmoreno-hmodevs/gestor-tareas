import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { storageConfig } from '../../config/storage.config';

export const UPLOADS_ROOT = path.isAbsolute(storageConfig.localRoot)
  ? storageConfig.localRoot
  : path.join(process.cwd(), storageConfig.localRoot);

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime) || mime.startsWith('image/');
}

export function inferMediaType(mime: string): 'image' | 'document' | 'other' {
  if (mime.startsWith('image/')) return 'image';
  if (
    mime === 'application/pdf' ||
    mime.includes('word') ||
    mime.includes('sheet') ||
    mime.includes('excel')
  ) {
    return 'document';
  }
  return 'other';
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

export async function saveUploadFile(
  workspaceId: string,
  commitmentId: string,
  originalFilename: string,
  buffer: Buffer
): Promise<{ storagePath: string; storedFilename: string }> {
  const dir = path.join(UPLOADS_ROOT, workspaceId, commitmentId);
  await fs.mkdir(dir, { recursive: true });
  const storedFilename = `${randomUUID()}-${sanitizeFilename(originalFilename)}`;
  const fullPath = path.join(dir, storedFilename);
  await fs.writeFile(fullPath, buffer);
  const storagePath = path.join(workspaceId, commitmentId, storedFilename).replace(/\\/g, '/');
  return { storagePath, storedFilename };
}

export function resolveStoragePath(storagePath: string): string {
  const normalized = storagePath.replace(/\\/g, '/');
  const full = path.join(UPLOADS_ROOT, normalized);
  if (!full.startsWith(UPLOADS_ROOT)) {
    throw new Error('Ruta de almacenamiento inválida');
  }
  return full;
}
