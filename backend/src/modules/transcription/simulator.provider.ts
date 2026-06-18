export interface SimulatorTranscriptionInput {
  simulatedTranscript?: string;
  simulateTranscriptionFailure?: boolean;
}

export interface SimulatorTranscriptionOutput {
  status: 'completed' | 'failed';
  transcriptText?: string;
  errorMessage?: string;
}

/** Proveedor STT simulado — usa transcripción manual del payload (Fase 3). */
export class SimulatorTranscriptionProvider {
  transcribe(input: SimulatorTranscriptionInput): SimulatorTranscriptionOutput {
    if (input.simulateTranscriptionFailure) {
      return {
        status: 'failed',
        errorMessage: 'Fallo simulado de transcripción',
      };
    }

    const text = input.simulatedTranscript?.trim();
    if (!text) {
      return {
        status: 'failed',
        errorMessage: 'No se proporcionó transcripción simulada',
      };
    }

    return {
      status: 'completed',
      transcriptText: text,
    };
  }
}

export const simulatorTranscriptionProvider = new SimulatorTranscriptionProvider();
