import { storageConfig } from '../../config/storage.config';
import {
  resolveStoragePath as resolveLocalPath,
  saveUploadFile,
  UPLOADS_ROOT,
} from './local-storage';
import type { StorageProvider, StoredFileResult } from './storage-provider.interface';

export { UPLOADS_ROOT };

export class LocalStorageProvider implements StorageProvider {
  readonly kind = 'local';

  async saveCommitmentEvidence(
    workspaceId: string,
    commitmentId: string,
    originalFilename: string,
    buffer: Buffer
  ): Promise<StoredFileResult> {
    return saveUploadFile(workspaceId, commitmentId, originalFilename, buffer);
  }

  resolvePath(storagePath: string): string {
    return resolveLocalPath(storagePath);
  }
}

export function createStorageProvider(): StorageProvider {
  switch (storageConfig.provider) {
    case 's3':
    case 'r2':
    case 'azure':
      console.warn(
        `[Storage] Provider "${storageConfig.provider}" no implementado — usando local (${storageConfig.localRoot})`
      );
      return new LocalStorageProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}

export const storageProvider = createStorageProvider();
