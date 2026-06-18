export interface StoredFileResult {
  storagePath: string;
  storedFilename: string;
}

export interface StorageProvider {
  readonly kind: string;
  saveCommitmentEvidence(
    workspaceId: string,
    commitmentId: string,
    originalFilename: string,
    buffer: Buffer
  ): Promise<StoredFileResult>;
  resolvePath(storagePath: string): string;
}
