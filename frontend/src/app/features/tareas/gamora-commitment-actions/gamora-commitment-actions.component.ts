import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GamoraCommitmentWorkflowService, type GamoraWorkflowAction } from '../../../core/services/gamora-commitment-workflow.service';

@Component({
  selector: 'app-gamora-commitment-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './gamora-commitment-actions.component.html',
  styleUrl: './gamora-commitment-actions.component.scss',
})
export class GamoraCommitmentActionsComponent {
  private readonly workflow = inject(GamoraCommitmentWorkflowService);

  commitmentStatus = input.required<string>();
  isOnline = input(true);
  busy = input(false);

  actionClicked = output<GamoraWorkflowAction>();

  statusLabel = computed(() => this.workflow.getStatusLabel(this.commitmentStatus()));
  guidance = computed(() => this.workflow.getStatusGuidance(this.commitmentStatus()));
  actions = computed(() =>
    this.workflow.getAvailableActions(this.commitmentStatus()).filter((a) => a.key !== 'upload_hint')
  );
  uploadHint = computed(() =>
    this.workflow.getAvailableActions(this.commitmentStatus()).find((a) => a.key === 'upload_hint')
  );
  evidencePolicy = computed(() => this.workflow.getEvidenceUploadPolicy(this.commitmentStatus()));

  onAction(action: GamoraWorkflowAction): void {
    if (!this.isOnline() || this.busy()) return;
    if (action.key === 'upload_hint') return;
    this.actionClicked.emit(action);
  }
}
