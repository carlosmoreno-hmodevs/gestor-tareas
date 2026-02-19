import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import type { ProjectTemplateBuilderItem } from '../../../shared/models/project-template-builder.model';
import type { ProjectTemplate } from '../../../shared/models/project-template.model';
import type { TaskTemplate } from '../../../shared/models/task-template.model';
import type { User } from '../../../shared/models';
import { normalizeDateToNoonLocal } from '../../../shared/utils/date.utils';

@Component({
  selector: 'app-project-template-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    DateFormatPipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-template-builder.component.html',
  styleUrl: './project-template-builder.component.scss'
})
export class ProjectTemplateBuilderComponent {
  items = input.required<ProjectTemplateBuilderItem[]>();
  projectTemplate = input.required<ProjectTemplate | null>();
  taskTemplates = input.required<TaskTemplate[]>();
  users = input.required<User[]>();
  categories = input<{ id: string; name: string }[]>([]);
  priorities = input<{ id: string; name: string; value: string }[]>([]);
  defaultOwnerId = input<string>('');
  defaultDueDate = input<Date | null>(null);

  itemsChange = output<ProjectTemplateBuilderItem[]>();

  expandedKey = signal<string | null>(null);

  includedCount = computed(() => this.items().filter((i) => i.included).length);

  updateItem(key: string, patch: Partial<ProjectTemplateBuilderItem>): void {
    const next = this.items().map((i) => (i.key === key ? { ...i, ...patch } : i));
    this.itemsChange.emit(next);
  }

  toggleInclude(key: string): void {
    const item = this.items().find((i) => i.key === key);
    if (!item) return;
    this.updateItem(key, { included: !item.included });
  }

  onDueDateChange(key: string, value: string | null): void {
    this.updateItem(key, { dueDate: value ? normalizeDateToNoonLocal(value) : undefined });
  }

  /** Fecha mínima para fecha límite (hoy) en formato YYYY-MM-DD */
  get minDueDateStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  addFromTaskTemplate(templateId: string): void {
    const tt = this.taskTemplates().find((t) => t.id === templateId);
    if (!tt) return;
    const key = `tpl-${Date.now()}-${templateId}`;
    const ownerId = this.defaultOwnerId() || '';
    const owner = this.users().find((u) => u.id === ownerId);
    const newItem: ProjectTemplateBuilderItem = {
      key,
      taskTemplateId: templateId,
      included: true,
      title: tt.titleTemplate,
      categoryId: tt.categoryId ?? '',
      priority: 'Media',
      assigneeId: ownerId,
      dueDate: this.defaultDueDate() ?? undefined,
      description: [tt.descriptionText, tt.evidenceHint ? 'Evidencia: ' + tt.evidenceHint : '', tt.controlNotes ? 'Nota: ' + tt.controlNotes : ''].filter(Boolean).join('\n\n'),
      checklistItems: [...(tt.checklistItems ?? [])]
    };
    this.itemsChange.emit([...this.items(), newItem]);
  }

  addFreeTask(): void {
    const key = `free-${Date.now()}`;
    const ownerId = this.defaultOwnerId() || '';
    const newItem: ProjectTemplateBuilderItem = {
      key,
      included: true,
      title: 'Nueva tarea',
      categoryId: '',
      priority: 'Media',
      assigneeId: ownerId,
      dueDate: this.defaultDueDate() ?? undefined,
      checklistItems: []
    };
    this.itemsChange.emit([...this.items(), newItem]);
  }

  removeItem(key: string): void {
    this.itemsChange.emit(this.items().filter((i) => i.key !== key));
    if (this.expandedKey() === key) this.expandedKey.set(null);
  }

  addChecklistItem(key: string): void {
    const item = this.items().find((i) => i.key === key);
    if (!item) return;
    const next = [...item.checklistItems, 'Nuevo item'];
    this.updateItem(key, { checklistItems: next });
  }

  updateChecklistItem(key: string, idx: number, text: string): void {
    const item = this.items().find((i) => i.key === key);
    if (!item) return;
    const next = [...item.checklistItems];
    next[idx] = text;
    this.updateItem(key, { checklistItems: next });
  }

  removeChecklistItem(key: string, idx: number): void {
    const item = this.items().find((i) => i.key === key);
    if (!item) return;
    const next = item.checklistItems.filter((_, i) => i !== idx);
    this.updateItem(key, { checklistItems: next });
  }

  toggleExpand(key: string): void {
    this.expandedKey.set(this.expandedKey() === key ? null : key);
  }

  getUserName(id: string): string {
    return this.users().find((u) => u.id === id)?.name ?? 'Sin asignar';
  }
}
