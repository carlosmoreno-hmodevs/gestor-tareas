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
    { path: '/admin/usuarios', label: 'Usuarios', icon: 'people' },
    { path: '/admin/roles', label: 'Roles y permisos', icon: 'admin_panel_settings' },
    { path: '/admin/catalogos', label: 'Catálogos', icon: 'category' },
    { path: '/admin/reglas', label: 'Reglas y notificaciones', icon: 'rule' },
    { path: '/admin/flujos', label: 'Flujos', icon: 'account_tree' },
    { path: '/admin/campos', label: 'Campos personalizados', icon: 'tune' }
  ];

  constructor() {
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      const desktop = r.matches;
      this.isDesktop.set(desktop);
      this.sidenavOpened.set(desktop);
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((v) => !v);
  }

  closeIfOverlay(): void {
    if (!this.isDesktop()) this.sidenavOpened.set(false);
  }
}
