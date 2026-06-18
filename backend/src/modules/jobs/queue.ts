import {
  processInboundAudioJob,
  type ProcessInboundAudioJobInput,
} from './process-inbound-audio.job';

/** Cola in-process Fase 3 — sustituible por BullMQ/Redis en fases posteriores. */
export class JobQueue {
  async runProcessInboundAudio(input: ProcessInboundAudioJobInput) {
    return processInboundAudioJob.run(input);
  }
}

export const jobQueue = new JobQueue();
