import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService } from '../../services/theme.service';
import { CurrentUserService } from '../../services/current-user.service';
import { TenantSettingsService } from '../../services/tenant-settings.service';
import { TenantContextService } from '../../services/tenant-context.service';
import { AutomationService } from '../../services/automation.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { OrgContextBarComponent } from '../../../shared/components/org-context-bar/org-context-bar.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { CommonModule } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  shortLabel: string;
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
    MatMenuModule,
    AvatarComponent,
    OrgContextBarComponent,
    OfflineBannerComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly currentUserService = inject(CurrentUserService);
  readonly themeService = inject(ThemeService);
  readonly tenantSettings = inject(TenantSettingsService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly automationService = inject(AutomationService);

  isMobile = signal(true);
  private readonly currentPath = signal('');

  constructor() {
    effect(() => {
      const tid = this.tenantContext.currentTenantId();
      if (tid) this.automationService.runEngine(tid);
    });
  }

  currentUser = this.currentUserService.currentUser;
  availableUsers = this.currentUserService.availableUsers;

  navItems = computed<NavItem[]>(() => [
    { path: '/tablero', label: 'Mi tablero', shortLabel: 'Inicio', icon: 'task_alt' },
    { path: '/tablero-operativo', label: 'Tablero operativo', shortLabel: 'Operativo', icon: 'dashboard' },
    { path: '/tareas', label: 'Tareas', shortLabel: 'Tareas', icon: 'task_alt' },
    { path: '/proyectos', label: 'Proyectos (Iniciativas)', shortLabel: 'Proyectos', icon: 'work' },
    { path: '/documentos', label: 'Documentos', shortLabel: 'Docs', icon: 'folder' },
    { path: '/admin', label: 'Administración', shortLabel: 'Admin', icon: 'settings' },
    { path: '/ia', label: 'Asistente IA', shortLabel: 'IA', icon: 'auto_awesome' }
  ]);

  isDesktop = computed(() => !this.isMobile());
  isMyBoardRoute = computed(() => this.currentPath() === '/tablero');

  ngOnInit(): void {
    this.currentPath.set(this.router.url.split('?')[0] ?? '');
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.currentPath.set(evt.urlAfterRedirects.split('?')[0] ?? '');
      }
    });
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      this.isMobile.set(!r.matches);
    });
  }

  switchUser(userId: string): void {
    this.currentUserService.setCurrentUser(userId);
  }

  formatUserRole(role: string): string {
    const normalized = String(role ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
    // "superadmin" contiene "admin": comprobar antes
    if (normalized.includes('owner') || normalized.includes('superadmin')) return 'Propietario';
    if (normalized.includes('admin')) return 'Admin';
    if (normalized.includes('supervisor')) return 'Supervisor';
    if (normalized.includes('member') || normalized.includes('miembro')) return 'Miembro';
    if (normalized.includes('viewer') || normalized.includes('lectura')) return 'Lector';
    return role?.trim() ? role : '—';
  }

}
