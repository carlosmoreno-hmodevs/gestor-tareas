import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService } from '../../services/theme.service';
import { CurrentUserService } from '../../services/current-user.service';
import { AuthService } from '../../auth/auth.service';
import { PermissionService } from '../../auth/permission.service';
import { TenantSettingsService } from '../../services/tenant-settings.service';
import { TenantContextService } from '../../services/tenant-context.service';
import { AutomationService } from '../../services/automation.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { OrgContextBarComponent } from '../../../shared/components/org-context-bar/org-context-bar.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { CommonModule } from '@angular/common';
import { TaskPageLayoutService } from '../../services/task-page-layout.service';
import { GlobalSearchComponent } from './global-search.component';
import { HeaderNotificationsComponent } from './header-notifications.component';
import { TaskService } from '../../services/task.service';

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
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AvatarComponent,
    OrgContextBarComponent,
    OfflineBannerComponent,
    GlobalSearchComponent,
    HeaderNotificationsComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly authService = inject(AuthService);
  private readonly permissions = inject(PermissionService);
  readonly themeService = inject(ThemeService);
  readonly tenantSettings = inject(TenantSettingsService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly automationService = inject(AutomationService);
  private readonly taskPageLayout = inject(TaskPageLayoutService);
  readonly taskService = inject(TaskService);

  isMobile = signal(true);
  private readonly currentPath = signal('');

  constructor() {
    effect(() => {
      const tid = this.tenantContext.currentTenantId();
      if (tid) this.automationService.runEngine(tid);
    });
  }

  currentUser = this.currentUserService.currentUser;
  useRealAuth = this.currentUserService.useRealAuth;
  availableUsers = this.currentUserService.availableUsers;

  navItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
      { path: '/tablero-operativo', label: 'Tablero operativo', shortLabel: 'Inicio', icon: 'dashboard' },
      { path: '/tareas', label: 'Tareas', shortLabel: 'Tareas', icon: 'task_alt' },
      { path: '/proyectos', label: 'Proyectos (Iniciativas)', shortLabel: 'Proyectos', icon: 'work' },
      { path: '/documentos', label: 'Documentos', shortLabel: 'Docs', icon: 'folder' },
      { path: '/ia', label: 'Asistente IA', shortLabel: 'IA', icon: 'auto_awesome' },
    ];
    if (this.permissions.canManageContacts() && !this.permissions.canAccessAdmin()) {
      items.splice(4, 0, {
        path: '/admin/responsables',
        label: 'Responsables',
        shortLabel: 'Responsables',
        icon: 'badge',
      });
    }
    if (this.permissions.canAccessAdmin()) {
      items.splice(4, 0, {
        path: '/admin',
        label: 'Administración',
        shortLabel: 'Admin',
        icon: 'settings',
      });
    }
    return items;
  });

  isDesktop = computed(() => !this.isMobile());

  /** Ancho completo del main cuando /tareas está en vista Tablero. */
  fullBleedTasks = computed(() => {
    const path = this.currentPath();
    if (path !== '/tareas') return false;
    return this.taskPageLayout.tasksFullBleed();
  });

  /** Ocultar selectores legacy cuando la API Gamora está activa */
  showLegacyOrgBar = computed(() => !this.taskService.gamoraApiActive());

  ngOnInit(): void {
    const url = this.router.url;
    this.currentPath.set(url.split('?')[0]?.split('#')[0] ?? '');
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const u = evt.urlAfterRedirects;
        this.currentPath.set(u.split('?')[0]?.split('#')[0] ?? '');
      }
    });
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      this.isMobile.set(!r.matches);
    });
  }

  switchUser(userId: string): void {
    this.currentUserService.setCurrentUser(userId);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  isNavActive(item: NavItem): boolean {
    return this.currentPath() === item.path;
  }

  formatUserRole(role: string): string {
    const normalized = String(role ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
    // "superadmin" contiene "admin": comprobar antes
    if (normalized.includes('coordinator') || normalized.includes('coordinador')) return 'Coordinador';
    if (normalized.includes('assignee') || normalized.includes('responsable')) return 'Responsable';
    if (normalized.includes('owner') || normalized.includes('superadmin')) return 'Propietario';
    if (normalized.includes('admin')) return 'Admin';
    if (normalized.includes('supervisor')) return 'Supervisor';
    if (normalized.includes('member') || normalized.includes('miembro')) return 'Miembro';
    if (normalized.includes('viewer') || normalized.includes('lectura')) return 'Lector';
    return role?.trim() ? role : '—';
  }

}
