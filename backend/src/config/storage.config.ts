export type StorageProviderKind = 'local' | 's3' | 'r2' | 'azure';

export const storageConfig = {
  provider: (process.env.STORAGE_PROVIDER ?? 'local') as StorageProviderKind,
  localRoot: process.env.STORAGE_LOCAL_ROOT ?? 'uploads',
  /** Extensiones futuras — no usadas en Fase 4 */
  s3Bucket: process.env.STORAGE_S3_BUCKET ?? '',
  s3Region: process.env.STORAGE_S3_REGION ?? '',
  s3AccessKeyId: process.env.STORAGE_S3_ACCESS_KEY_ID ?? '',
  s3SecretAccessKey: process.env.STORAGE_S3_SECRET_ACCESS_KEY ?? '',
  r2AccountId: process.env.STORAGE_R2_ACCOUNT_ID ?? '',
  r2Bucket: process.env.STORAGE_R2_BUCKET ?? '',
  azureConnectionString: process.env.STORAGE_AZURE_CONNECTION_STRING ?? '',
};
