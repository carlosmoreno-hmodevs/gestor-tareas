import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService } from '../../services/theme.service';
import { DataService } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { CurrentUserService } from '../../services/current-user.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { CommonModule } from '@angular/common';
import type { User } from '../../../shared/models';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    AvatarComponent,
    OfflineBannerComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly dataService = inject(DataService);
  private readonly adminService = inject(AdminService);
  private readonly currentUserService = inject(CurrentUserService);
  readonly themeService = inject(ThemeService);

  sidenavOpened = signal(false);
  sidenavMode = signal<MatDrawerMode>('over');
  isMobile = signal(true);

  currentUser = signal<User>({ id: 'guest', name: 'Usuario', email: '', role: '', team: '' });

  navItems = computed<NavItem[]>(() => [
    { path: '/tablero', label: 'Tablero', icon: 'dashboard' },
    { path: '/tareas', label: 'Tareas', icon: 'task_alt' },
    { path: '/proyectos', label: 'Proyectos', icon: 'work' },
    { path: '/documentos', label: 'Documentos', icon: 'folder' },
    { path: '/admin', label: 'Administración', icon: 'settings' },
    { path: '/ia', label: 'Asistente IA', icon: 'auto_awesome' }
  ]);

  constructor() {
    const users = this.dataService.getUsers();
    if (users.length > 0) this.currentUser.set(users[0]);
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      const desktop = r.matches;
      this.isMobile.set(!desktop);
      if (desktop) {
        this.sidenavOpened.set(false);
      }
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((v) => !v);
  }

  closeSidenavIfOverlay(): void {
    if (this.sidenavMode() === 'over') {
      this.sidenavOpened.set(false);
    }
  }
}
