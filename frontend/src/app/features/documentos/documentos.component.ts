import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../core/services/data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    PageHeaderComponent,
    DateFormatPipe
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent {
  private readonly dataService = inject(DataService);

  taskFilter = signal('');
  documents = this.dataService.getDocuments();
  displayedColumns = ['name', 'size', 'taskId', 'uploadedAt', 'uploadedBy', 'actions'];

  filteredDocuments = computed(() => {
    const filter = this.taskFilter().toLowerCase().trim();
    if (!filter) return this.documents;
    return this.documents.filter(
      (d) =>
        d.taskId?.toLowerCase().includes(filter) ||
        d.name.toLowerCase().includes(filter) ||
        d.uploadedBy.toLowerCase().includes(filter)
    );
  });

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatTaskId(taskId?: string): string {
    if (!taskId) return '—';
    return taskId.replace(/^task-/i, '');
  }

  getFileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      default:
        return 'insert_drive_file';
    }
  }

  getFileType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    return ext ?? 'file';
  }
}
