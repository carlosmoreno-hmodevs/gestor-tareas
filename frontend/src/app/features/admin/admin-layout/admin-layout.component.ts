import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';

interface AdminNavItem {
  path: string;
  label: string;
  shortLabel: string;
  icon: string;
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

  sidenavOpened = signal(true);
  isDesktop = signal(true);

  navItems: AdminNavItem[] = [
    { path: '/admin/usuarios', label: 'Usuarios', shortLabel: 'Usuarios', icon: 'people' },
    { path: '/admin/roles', label: 'Roles y permisos', shortLabel: 'Roles', icon: 'admin_panel_settings' },
    { path: '/admin/catalogos', label: 'Catálogos', shortLabel: 'Catálogos', icon: 'category' },
    { path: '/admin/organization', label: 'Organización', shortLabel: 'Org.', icon: 'account_tree' },
    { path: '/admin/reglas', label: 'Reglas y notificaciones', shortLabel: 'Reglas', icon: 'rule' },
    { path: '/admin/flujos', label: 'Flujos', shortLabel: 'Flujos', icon: 'account_tree' },
    { path: '/admin/campos', label: 'Campos personalizados', shortLabel: 'Campos', icon: 'tune' },
    { path: '/admin/automatizaciones', label: 'Automatizaciones', shortLabel: 'Automatiz.', icon: 'schedule' },
    { path: '/admin/sistema', label: 'Sistema', shortLabel: 'Sistema', icon: 'settings_applications' }
  ];

  constructor() {
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      this.isDesktop.set(r.matches);
      this.sidenavOpened.set(r.matches);
    });
  }
}
