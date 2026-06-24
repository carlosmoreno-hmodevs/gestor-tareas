import { Component, inject, signal, computed, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommitmentApiService } from '../../api/commitment-api.service';
import { TaskService } from '../../services/task.service';
import { TenantContextService } from '../../services/tenant-context.service';
import { gamoraStatusLabel } from '../../api/gamora-status-filters';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="global-search" (click)="$event.stopPropagation()">
      <button
        mat-icon-button
        type="button"
        aria-label="Buscar compromisos"
        class="search-trigger"
        (click)="toggleOpen()"
      >
        <mat-icon>search</mat-icon>
      </button>
      @if (open()) {
        <div class="search-panel">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input
              matInput
              type="search"
              placeholder="Buscar compromisos…"
              [ngModel]="query()"
              (ngModelChange)="onQueryChange($event)"
              (keydown.enter)="goToTasksSearch()"
              autofocus
            />
          </mat-form-field>
          @if (loading()) {
            <p class="search-hint">Buscando…</p>
          } @else if (query().trim().length >= 2 && results().length === 0) {
            <p class="search-hint">Sin resultados</p>
          } @else if (results().length) {
            <ul class="search-results">
              @for (item of results(); track item.id) {
                <li>
                  <a class="search-result-item" [routerLink]="['/tareas', item.id]" (click)="close()">
                    <span class="search-result-title">{{ item.title }}</span>
                    <span class="search-result-meta">
                      {{ item.assigneeName ?? 'Sin asignar' }} · {{ statusLabel(item.status) }}
                    </span>
                  </a>
                </li>
              }
            </ul>
            <button type="button" class="search-see-all" (click)="goToTasksSearch()">
              Ver todos en Tareas
            </button>
          } @else {
            <p class="search-hint">Escribe al menos 2 caracteres</p>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .global-search {
        position: relative;
      }
      .search-panel {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: min(360px, 92vw);
        background: var(--surface-card, #fff);
        border: 1px solid var(--border-subtle, #e5e7eb);
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        padding: 12px;
        z-index: 1200;
      }
      .search-field {
        width: 100%;
      }
      .search-hint {
        margin: 8px 4px 0;
        font-size: 0.8125rem;
        color: var(--text-muted, #6b7280);
      }
      .search-results {
        list-style: none;
        margin: 8px 0 0;
        padding: 0;
        max-height: 280px;
        overflow-y: auto;
      }
      .search-result-item {
        display: block;
        padding: 8px 10px;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
      }
      .search-result-item:hover {
        background: var(--surface-hover, #f3f4f6);
      }
      .search-result-title {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .search-result-meta {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted, #6b7280);
        margin-top: 2px;
      }
      .search-see-all {
        width: 100%;
        margin-top: 8px;
        padding: 8px;
        border: none;
        background: transparent;
        color: var(--primary, #2563eb);
        font-size: 0.8125rem;
        cursor: pointer;
        border-radius: 6px;
      }
      .search-see-all:hover {
        background: var(--surface-hover, #f3f4f6);
      }
    `,
  ],
})
export class GlobalSearchComponent implements OnInit {
  private readonly commitmentApi = inject(CommitmentApiService);
  private readonly taskService = inject(TaskService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);

  open = signal(false);
  query = signal('');
  loading = signal(false);
  results = signal<Array<{ id: string; title: string; status: string; assigneeName?: string }>>([]);

  enabled = computed(() => this.taskService.gamoraApiActive());

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q) this.query.set(q);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.open()) this.close();
  }

  toggleOpen(): void {
    if (!this.enabled()) return;
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  statusLabel(status: string): string {
    return gamoraStatusLabel(status);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      this.results.set([]);
      return;
    }
    this.debounceTimer = setTimeout(() => void this.runSearch(trimmed), 280);
  }

  async runSearch(q: string): Promise<void> {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    this.loading.set(true);
    try {
      const page = await this.commitmentApi.listCommitmentsPage(tid, {
        search: q,
        page: 1,
        pageSize: 8,
      });
      this.results.set(
        page.items.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          assigneeName: c.assigneeName ?? undefined,
        }))
      );
    } catch {
      this.results.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  goToTasksSearch(): void {
    const q = this.query().trim();
    if (!q) return;
    void this.router.navigate(['/tareas'], { queryParams: { search: q } });
    this.close();
  }
}
