import { Injectable } from '@angular/core';
import type { ProjectStatus, ProjectPriority } from '../../shared/models';

export interface CatalogItem {
  id: string;
  name: string;
  value: string;
  order: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectCatalogService {
  private readonly PROJECT_STATUSES: CatalogItem[] = [
    { id: 'ps-1', name: 'Activo', value: 'Activo', order: 1 },
    { id: 'ps-2', name: 'En curso', value: 'En curso', order: 2 },
    { id: 'ps-3', name: 'En pausa', value: 'En pausa', order: 3 },
    { id: 'ps-4', name: 'Cerrado', value: 'Cerrado', order: 4 }
  ];

  private readonly PROJECT_PRIORITIES: CatalogItem[] = [
    { id: 'pp-1', name: 'Alta', value: 'Alta', order: 1 },
    { id: 'pp-2', name: 'Media', value: 'Media', order: 2 },
    { id: 'pp-3', name: 'Baja', value: 'Baja', order: 3 }
  ];

  getStatuses(): CatalogItem[] {
    return [...this.PROJECT_STATUSES];
  }

  getPriorities(): CatalogItem[] {
    return [...this.PROJECT_PRIORITIES];
  }
}
