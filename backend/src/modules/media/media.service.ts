/** Stub Fase 1 */
export class MediaService {
  async downloadFromMeta(_mediaId: string): Promise<never> {
    throw new Error('MediaService: descarga Meta no implementada en Fase 1');
  }
}

export const mediaService = new MediaService();
