import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';
import { adminGuard } from './core/guards/admin.guard';
import { tenantGuard } from './core/guards/tenant.guard';

export const routes: Routes = [
  {
    path: 'select-tenant',
    loadComponent: () => import('./features/tenant-select/tenant-select.component').then((m) => m.TenantSelectComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [tenantGuard],
    children: [
      { path: '', redirectTo: 'tablero', pathMatch: 'full' },
      { path: 'tablero', loadComponent: () => import('./features/tablero/tablero.component').then((m) => m.TableroComponent) },
      { path: 'tareas', loadComponent: () => import('./features/tareas/task-list/task-list.component').then((m) => m.TaskListComponent) },
      { path: 'tareas/nueva', loadComponent: () => import('./features/tareas/task-create/task-create.component').then((m) => m.TaskCreateComponent) },
      { path: 'tareas/:id', loadComponent: () => import('./features/tareas/task-detail/task-detail.component').then((m) => m.TaskDetailComponent) },
      { path: 'alertas', redirectTo: 'admin/reglas', pathMatch: 'full' },
      { path: 'documentos', loadComponent: () => import('./features/documentos/documentos.component').then((m) => m.DocumentosComponent) },
      {
        path: 'admin',
        children: [
          { path: 'denied', loadComponent: () => import('./features/admin/admin-denied/admin-denied.component').then((m) => m.AdminDeniedComponent) },
          {
            path: '',
            loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
            canActivate: [adminGuard],
            children: [
              { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
              { path: 'usuarios', loadComponent: () => import('./features/admin/admin-users/admin-users.component').then((m) => m.AdminUsersComponent) },
              { path: 'usuarios/nueva', loadComponent: () => import('./features/admin/admin-users/admin-user-form/admin-user-form.component').then((m) => m.AdminUserFormComponent) },
              { path: 'usuarios/:id/editar', loadComponent: () => import('./features/admin/admin-users/admin-user-form/admin-user-form.component').then((m) => m.AdminUserFormComponent) },
              { path: 'roles', loadComponent: () => import('./features/admin/admin-roles/admin-roles.component').then((m) => m.AdminRolesComponent) },
              { path: 'catalogos/categorias/nueva', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalog-item-form/admin-catalog-item-form.component').then((m) => m.AdminCatalogItemFormComponent), data: { catalogType: 'categorias' } },
              { path: 'catalogos/categorias/:id/editar', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalog-item-form/admin-catalog-item-form.component').then((m) => m.AdminCatalogItemFormComponent), data: { catalogType: 'categorias' } },
              { path: 'catalogos/prioridades/nueva', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalog-item-form/admin-catalog-item-form.component').then((m) => m.AdminCatalogItemFormComponent), data: { catalogType: 'prioridades' } },
              { path: 'catalogos/prioridades/:id/editar', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalog-item-form/admin-catalog-item-form.component').then((m) => m.AdminCatalogItemFormComponent), data: { catalogType: 'prioridades' } },
              { path: 'catalogos/equipos/nueva', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalog-item-form/admin-catalog-item-form.component').then((m) => m.AdminCatalogItemFormComponent), data: { catalogType: 'equipos' } },
              { path: 'catalogos/equipos/:id/editar', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalog-item-form/admin-catalog-item-form.component').then((m) => m.AdminCatalogItemFormComponent), data: { catalogType: 'equipos' } },
              { path: 'catalogos', loadComponent: () => import('./features/admin/admin-catalogos/admin-catalogos.component').then((m) => m.AdminCatalogosComponent) },
              { path: 'organization', loadComponent: () => import('./features/admin/admin-organization/admin-organization.component').then((m) => m.AdminOrganizationComponent) },
              { path: 'reglas', loadComponent: () => import('./features/admin/admin-reglas/admin-reglas.component').then((m) => m.AdminReglasComponent) },
              { path: 'flujos', loadComponent: () => import('./features/admin/admin-flujos/admin-flujos.component').then((m) => m.AdminFlujosComponent) },
              { path: 'campos', loadComponent: () => import('./features/admin/admin-campos/admin-campos.component').then((m) => m.AdminCamposComponent) },
              { path: 'sistema', loadComponent: () => import('./features/admin/admin-sistema/admin-sistema.component').then((m) => m.AdminSistemaComponent) }
            ]
          }
        ]
      },
      { path: 'ia', loadComponent: () => import('./features/ia/ia.component').then((m) => m.IaComponent) },
      { path: 'proyectos', loadComponent: () => import('./features/proyectos/proyectos.component').then((m) => m.ProyectosComponent) },
      { path: 'proyectos/nueva', loadComponent: () => import('./features/proyectos/project-create/project-create.component').then((m) => m.ProjectCreateComponent) },
      { path: 'proyectos/:id', loadComponent: () => import('./features/proyectos/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent) },
      { path: 'offline', loadComponent: () => import('./features/offline/offline.component').then((m) => m.OfflineComponent) }
    ]
  },
  { path: '**', redirectTo: 'tablero' }
];
