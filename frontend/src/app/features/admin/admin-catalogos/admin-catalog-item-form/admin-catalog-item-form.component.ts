import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../core/services/admin.service';
import { ConnectivityService } from '../../../../core/services/connectivity.service';
import { TaskService } from '../../../../core/services/task.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import type { AdminCategory, AdminPriority, AdminTeam } from '../../../../shared/models/admin.model';

export type CatalogType = 'categorias' | 'prioridades' | 'equipos';

@Component({
  selector: 'app-admin-catalog-item-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-catalog-item-form.component.html',
  styleUrl: './admin-catalog-item-form.component.scss'
})
export class AdminCatalogItemFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);
  readonly connectivity = inject(ConnectivityService);

  catalogType = signal<CatalogType | null>(null);
  itemId: string | null = null;
  saving = false;

  readonly labels = computed(() => {
    const t = this.catalogType();
    switch (t) {
      case 'categorias':
        return { singular: 'Categoría', plural: 'Categorías', newPrefix: 'Nueva' as const, icon: 'category' };
      case 'prioridades':
        return { singular: 'Prioridad', plural: 'Prioridades', newPrefix: 'Nueva' as const, icon: 'priority_high' };
      case 'equipos':
        return { singular: 'Equipo', plural: 'Equipos', newPrefix: 'Nuevo' as const, icon: 'groups' };
      default:
        return { singular: 'Elemento', plural: 'Elementos', newPrefix: 'Nuevo' as const, icon: 'list' };
    }
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    color: ['#1976d2'],
    order: [1, [Validators.min(1)]],
    slaHours: [72 as number, [Validators.min(0)]],
    area: ['']
  });

  ngOnInit(): void {
    const type = this.route.snapshot.data['catalogType'] as CatalogType | undefined;
    if (type) this.catalogType.set(type);

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.itemId = id;
      const t = this.catalogType();
      if (t === 'categorias') {
        const item = this.adminService.categories().find((c) => c.id === id) as AdminCategory | undefined;
        if (item) {
          this.form.patchValue({
            name: item.name,
            color: item.color ?? '#1976d2',
            order: item.order
          });
        }
      } else if (t === 'prioridades') {
        const item = this.adminService.priorities().find((p) => p.id === id) as AdminPriority | undefined;
        if (item) {
          this.form.patchValue({
            name: item.name,
            color: item.color ?? '#1976d2',
            order: item.order,
            slaHours: item.slaHours ?? 72
          });
        }
      } else if (t === 'equipos') {
        const item = this.adminService.teams().find((e) => e.id === id) as AdminTeam | undefined;
        if (item) {
          this.form.patchValue({
            name: item.name,
            order: item.order,
            area: item.area
          });
        }
      }
    }
  }

  get isEditMode(): boolean {
    return !!this.itemId;
  }

  get isCategory(): boolean {
    return this.catalogType() === 'categorias';
  }

  get isPriority(): boolean {
    return this.catalogType() === 'prioridades';
  }

  get isTeam(): boolean {
    return this.catalogType() === 'equipos';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.connectivity.isOnline()) return;

    const t = this.catalogType();
    if (!t) return;

    this.saving = true;
    const v = this.form.getRawValue();

    try {
      if (t === 'categorias') {
        const cats = this.adminService.categories();
        const order = this.itemId
          ? (cats.find((c) => c.id === this.itemId)?.order ?? cats.length + 1)
          : (Math.max(0, ...cats.map((c) => c.order)) + 1);
        const payload = {
          name: v.name!,
          color: v.color || undefined,
          order,
          active: true
        };
        if (this.itemId) {
          this.adminService.updateCategory(this.itemId, payload);
          this.snackBar.open('Categoría actualizada', 'Cerrar', { duration: 2000 });
        } else {
          this.adminService.addCategory(payload);
          this.snackBar.open('Categoría creada', 'Cerrar', { duration: 2000 });
        }
      } else if (t === 'prioridades') {
        const pris = this.adminService.priorities();
        const order = this.itemId
          ? (pris.find((p) => p.id === this.itemId)?.order ?? pris.length + 1)
          : (v.order ?? Math.max(0, ...pris.map((p) => p.order)) + 1);
        const payload = {
          name: v.name!,
          value: v.name!,
          color: v.color || undefined,
          slaHours: v.slaHours ?? 72,
          order,
          active: true
        };
        if (this.itemId) {
          this.adminService.updatePriority(this.itemId, payload);
          this.snackBar.open('Prioridad actualizada', 'Cerrar', { duration: 2000 });
        } else {
          this.adminService.addPriority(payload);
          this.snackBar.open('Prioridad creada', 'Cerrar', { duration: 2000 });
        }
      } else if (t === 'equipos') {
        const teams = this.adminService.teams();
        const order = this.itemId
          ? (teams.find((tm) => tm.id === this.itemId)?.order ?? teams.length + 1)
          : (Math.max(0, ...teams.map((tm) => tm.order)) + 1);
        const payload = {
          name: v.name!,
          area: v.area || '',
          order,
          active: true
        };
        if (this.itemId) {
          this.adminService.updateTeam(this.itemId, payload);
          this.snackBar.open('Equipo actualizado', 'Cerrar', { duration: 2000 });
        } else {
          this.adminService.addTeam(payload);
          this.snackBar.open('Equipo creado', 'Cerrar', { duration: 2000 });
        }
      }
      this.router.navigate(['/admin/catalogos']);
    } catch (e) {
      this.saving = false;
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 4000 });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/catalogos']);
  }
}
