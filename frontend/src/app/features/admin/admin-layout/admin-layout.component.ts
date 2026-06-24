import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PermissionService } from '../../../core/auth/permission.service';

interface AdminNavItem {
  path: string;
  label: string;
  shortLabel: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly permissions = inject(PermissionService);

  sidenavOpened = signal(true);
  isDesktop = signal(true);

  private readonly allNavItems: AdminNavItem[] = [
    { path: '/admin/empresa', label: 'Empresa', shortLabel: 'Empresa', icon: 'business', adminOnly: true },
    { path: '/admin/responsables', label: 'Responsables', shortLabel: 'Responsables', icon: 'badge' },
    { path: '/admin/usuarios', label: 'Usuarios', shortLabel: 'Usuarios', icon: 'people', adminOnly: true },
    { path: '/admin/roles', label: 'Roles y permisos', shortLabel: 'Roles', icon: 'admin_panel_settings', adminOnly: true },
    { path: '/admin/catalogos', label: 'Catálogos', shortLabel: 'Catálogos', icon: 'category', adminOnly: true },
    { path: '/admin/organization', label: 'Organización', shortLabel: 'Org.', icon: 'account_tree', adminOnly: true },
    { path: '/admin/reglas', label: 'Reglas y notificaciones', shortLabel: 'Reglas', icon: 'rule', adminOnly: true },
    { path: '/admin/flujos', label: 'Flujos', shortLabel: 'Flujos', icon: 'account_tree', adminOnly: true },
    { path: '/admin/campos', label: 'Campos personalizados', shortLabel: 'Campos', icon: 'tune', adminOnly: true },
    { path: '/admin/automatizaciones', label: 'Automatizaciones', shortLabel: 'Automatiz.', icon: 'schedule', adminOnly: true },
    { path: '/admin/sistema', label: 'Sistema', shortLabel: 'Sistema', icon: 'settings_applications', adminOnly: true }
  ];

  navItems = () =>
    this.allNavItems.filter((item) => {
      if (item.adminOnly && !this.permissions.canAccessAdmin()) return false;
      if (item.path === '/admin/responsables' && !this.permissions.canManageContacts()) return false;
      return true;
    });

  constructor() {
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      this.isDesktop.set(r.matches);
      this.sidenavOpened.set(r.matches);
    });
  }
}
