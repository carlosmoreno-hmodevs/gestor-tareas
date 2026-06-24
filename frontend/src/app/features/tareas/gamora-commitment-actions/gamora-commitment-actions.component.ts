import { Component, input, output, computed, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';

import { GamoraCommitmentWorkflowService, type GamoraWorkflowAction } from '../../../core/services/gamora-commitment-workflow.service';

import { PermissionService } from '../../../core/auth/permission.service';



@Component({

  selector: 'app-gamora-commitment-actions',

  standalone: true,

  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule],

  templateUrl: './gamora-commitment-actions.component.html',

  styleUrl: './gamora-commitment-actions.component.scss',

})

export class GamoraCommitmentActionsComponent {
  private readonly workflow = inject(GamoraCommitmentWorkflowService);
  readonly permissions = inject(PermissionService);



  commitmentStatus = input.required<string>();

  assigneeContactId = input<string | null>(null);

  isOnline = input(true);

  busy = input(false);



  actionClicked = output<GamoraWorkflowAction>();



  statusLabel = computed(() => this.workflow.getStatusLabel(this.commitmentStatus()));

  guidance = computed(() => this.workflow.getStatusGuidance(this.commitmentStatus()));



  private allActions = computed(() =>

    this.workflow.getAvailableActions(this.commitmentStatus()).filter((a) => a.key !== 'upload_hint')

  );



  actions = computed(() =>

    this.permissions.filterWorkflowActions(this.allActions(), this.assigneeContactId())

  );



  blockedActions = computed(() =>

    this.allActions()

      .filter((a) => !this.permissions.canPerformAction(a, this.assigneeContactId()))

      .map((a) => ({

        action: a,

        reason: this.permissions.actionDisabledReason(a, this.assigneeContactId()) ?? '',

      }))

  );



  uploadHint = computed(() => {

    const hint = this.workflow

      .getAvailableActions(this.commitmentStatus())

      .find((a) => a.key === 'upload_hint');

    if (!hint) return undefined;

    if (this.permissions.isReadOnly()) return undefined;

    if (

      this.permissions.role() === 'assignee' &&

      !this.permissions.isAssignedToMe(this.assigneeContactId())

    ) {

      return undefined;

    }

    if (this.permissions.role() === 'coordinator') return undefined;

    return hint;

  });



  evidencePolicy = computed(() =>

    this.permissions.getEvidenceUploadPolicy(

      this.workflow.getEvidenceUploadPolicy(this.commitmentStatus()),

      this.commitmentStatus(),

      this.assigneeContactId()

    )

  );



  onAction(action: GamoraWorkflowAction): void {

    if (!this.isOnline() || this.busy()) return;

    if (action.key === 'upload_hint') return;

    if (!this.permissions.canPerformAction(action, this.assigneeContactId())) return;

    this.actionClicked.emit(action);

  }

}


