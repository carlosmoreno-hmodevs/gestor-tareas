import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  GamoraCommitmentWorkflowService,
  GAMORA_CORRECTION_STEPS,
  GAMORA_MAIN_FLOW_STEPS,
} from '../../../core/services/gamora-commitment-workflow.service';

@Component({
  selector: 'app-gamora-operational-flow',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './gamora-operational-flow.component.html',
  styleUrl: './gamora-operational-flow.component.scss',
})
export class GamoraOperationalFlowComponent {
  private readonly workflow = inject(GamoraCommitmentWorkflowService);

  commitmentStatus = input.required<string>();

  readonly mainSteps = GAMORA_MAIN_FLOW_STEPS;
  readonly correctionSteps = GAMORA_CORRECTION_STEPS;

  guidance = computed(() => this.workflow.getStatusGuidance(this.commitmentStatus()));
  showCorrectionBranch = computed(() => this.workflow.isCorrectionBranch(this.commitmentStatus()));

  stepState(stepKey: string): 'completed' | 'current' | 'upcoming' | 'skipped' {
    return this.workflow.getFlowStepState(stepKey, this.commitmentStatus());
  }
}
