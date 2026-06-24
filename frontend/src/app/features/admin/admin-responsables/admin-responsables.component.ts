import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  ContactsApiService,
  CONTACT_STATUS_LABELS,
  type ContactDto,
  type ContactStatus,
} from '../../../core/api/contacts-api.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { mapGamoraApiError } from '../../../core/api/gamora-api-error.mapper';

@Component({
  selector: 'app-admin-responsables',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      title="Responsables"
      subtitle="Contactos operativos usados en compromisos Gamora"
      icon="badge"
    />

    <mat-card>
      <mat-card-header class="card-header-row">
        <mat-card-title>Lista de responsables</mat-card-title>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Estado</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="onStatusFilter($event.value)">
              <mat-option value="all">Todos</mat-option>
              <mat-option value="active">Activos</mat-option>
              <mat-option value="inactive">Inactivos</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" [disabled]="!connectivity.isOnline() || loading()" (click)="openCreate()">
            <mat-icon>add</mat-icon>
            Agregar responsable
          </button>
        </div>
      </mat-card-header>
      <mat-card-content>
        @if (loading()) {
          <p>Cargando...</p>
        } @else if (!filteredContacts().length) {
          <p>No hay responsables con el filtro seleccionado.</p>
        } @else {
          <table mat-table [dataSource]="filteredContacts()" class="full-width">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let c">{{ c.displayName }}</td>
            </ng-container>
            <ng-container matColumnDef="team">
              <th mat-header-cell *matHeaderCellDef>Área / equipo</th>
              <td mat-cell *matCellDef="let c">{{ c.team || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef>Puesto</th>
              <td mat-cell *matCellDef="let c">{{ c.position || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>Usuario vinculado</th>
              <td mat-cell *matCellDef="let c">
                @if (c.userId) {
                  {{ c.userDisplayName }} ({{ c.userEmail }})
                } @else {
                  —
                }
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let c">
                <span class="status-chip" [class.inactive]="c.status !== 'active'">
                  {{ statusLabel(c.status) }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let c">
                <button mat-icon-button [matMenuTriggerFor]="menu" (click)="menuContact.set(c)">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
        }
      </mat-card-content>
    </mat-card>

    <mat-menu #menu="matMenu">
      @if (menuContact(); as c) {
        <button mat-menu-item (click)="openEdit(c)">
          <mat-icon>edit</mat-icon>
          <span>Editar</span>
        </button>
        <button mat-menu-item (click)="toggleStatus(c)">
          <mat-icon>{{ c.status === 'active' ? 'person_off' : 'person_add' }}</mat-icon>
          <span>{{ c.status === 'active' ? 'Desactivar' : 'Activar' }}</span>
        </button>
      }
    </mat-menu>
  `,
  styles: [
    `
      .card-header-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .header-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }
      .filter-field {
        width: 160px;
        margin: 0;
      }
      .full-width {
        width: 100%;
      }
      .status-chip {
        display: inline-block;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        font-size: 0.8rem;
        background: #e8f5e9;
        color: #2e7d32;
      }
      .status-chip.inactive {
        background: #ffebee;
        color: #c62828;
      }
    `,
  ],
})
export class AdminResponsablesComponent implements OnInit {
  private readonly contactsApi = inject(ContactsApiService);
  private readonly router = inject(Router);
  readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  readonly contacts = signal<ContactDto[]>([]);
  readonly loading = signal(true);
  readonly statusFilter = signal<'all' | ContactStatus>('all');
  readonly menuContact = signal<ContactDto | null>(null);

  readonly columns = ['name', 'team', 'position', 'user', 'status', 'actions'];

  readonly filteredContacts = computed(() => {
    const f = this.statusFilter();
    const list = this.contacts();
    if (f === 'all') return list;
    return list.filter((c) => c.status === f);
  });

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.contacts.set(await this.contactsApi.list());
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.loading.set(false);
    }
  }

  statusLabel(status: ContactStatus): string {
    return CONTACT_STATUS_LABELS[status] ?? status;
  }

  onStatusFilter(value: 'all' | ContactStatus): void {
    this.statusFilter.set(value);
  }

  openCreate(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Se requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/responsables/nueva']);
  }

  openEdit(c: ContactDto): void {
    if (!this.connectivity.isOnline()) return;
    this.router.navigate(['/admin/responsables', c.id, 'editar']);
  }

  async toggleStatus(c: ContactDto): Promise<void> {
    if (!this.connectivity.isOnline()) return;
    const next: ContactStatus = c.status === 'active' ? 'inactive' : 'active';
    try {
      await this.contactsApi.updateStatus(c.id, next);
      await this.load();
      this.snackBar.open(next === 'active' ? 'Responsable activado' : 'Responsable desactivado', 'Cerrar', {
        duration: 2500,
      });
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    }
  }
}
