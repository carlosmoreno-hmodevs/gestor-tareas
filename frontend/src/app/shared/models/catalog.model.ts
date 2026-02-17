import type { TaskStatus, Priority } from './task.model';

export interface CatalogItem {
  id: string;
  name: string;
  order?: number;
}

export interface Category extends CatalogItem {
  color?: string;
}

export interface StatusConfig extends CatalogItem {
  value: TaskStatus;
}

export interface PriorityConfig extends CatalogItem {
  value: Priority;
}

export interface Team extends CatalogItem {
  area: string;
}
