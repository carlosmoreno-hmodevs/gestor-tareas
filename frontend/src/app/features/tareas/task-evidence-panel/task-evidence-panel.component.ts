import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { TaskAttachment } from '../../../shared/models';

@Component({
  selector: 'app-task-evidence-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-evidence-panel.component.html',
  styleUrl: './task-evidence-panel.component.scss'
})
export class TaskEvidencePanelComponent {
  attachments = input<TaskAttachment[]>([]);
  isOnline = input(true);
  taskId = input.required<string>();

  filesSelected = output<File[]>();
  downloadRequested = output<{ attachment: TaskAttachment }>();
  removeRequested = output<{ attachment: TaskAttachment }>();

  attachmentsList = computed(() => this.attachments() ?? []);

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getFileIcon(name: string, type?: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (type?.includes('pdf') || ext === 'pdf') return 'picture_as_pdf';
    if (['xlsx', 'xls', 'csv'].includes(ext) || type?.includes('sheet')) return 'table_chart';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) || type?.includes('image')) return 'image';
    if (['doc', 'docx'].includes(ext) || type?.includes('word')) return 'description';
    return 'attach_file';
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length) {
      this.filesSelected.emit(files);
      input.value = '';
    }
  }

  onDropzoneClick(): void {
    if (!this.isOnline()) return;
    document.getElementById(`file-input-${this.taskId()}`)?.click();
  }

  onDragOver(event: DragEvent): void {
    if (this.isOnline()) event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (!this.isOnline()) return;
    const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
    if (files.length) this.filesSelected.emit(files);
  }

  onDownload(att: TaskAttachment): void {
    this.downloadRequested.emit({ attachment: att });
  }

  onRemove(att: TaskAttachment): void {
    this.removeRequested.emit({ attachment: att });
  }
}
