import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService } from '../../services/theme.service';
import { DataService } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { CurrentUserService } from '../../services/current-user.service';
import { TenantSettingsService } from '../../services/tenant-settings.service';
import { TenantContextService } from '../../services/tenant-context.service';
import { AutomationService } from '../../services/automation.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { OrgContextBarComponent } from '../../../shared/components/org-context-bar/org-context-bar.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { CommonModule } from '@angular/common';
import type { User } from '../../../shared/models';

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
    AvatarComponent,
    OrgContextBarComponent,
    OfflineBannerComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly dataService = inject(DataService);
  private readonly adminService = inject(AdminService);
  private readonly currentUserService = inject(CurrentUserService);
  readonly themeService = inject(ThemeService);
  readonly tenantSettings = inject(TenantSettingsService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly automationService = inject(AutomationService);

  isMobile = signal(true);

  constructor() {
    effect(() => {
      const tid = this.tenantContext.currentTenantId();
      if (tid) this.automationService.runEngine(tid);
    });
  }

  currentUser = signal<User>({ id: 'guest', name: 'Usuario', email: '', role: '', team: '' });

  navItems = computed<NavItem[]>(() => [
    { path: '/tablero', label: 'Tablero', shortLabel: 'Inicio', icon: 'dashboard' },
    { path: '/tareas', label: 'Tareas', shortLabel: 'Tareas', icon: 'task_alt' },
    { path: '/proyectos', label: 'Proyectos', shortLabel: 'Proyectos', icon: 'work' },
    { path: '/documentos', label: 'Documentos', shortLabel: 'Docs', icon: 'folder' },
    { path: '/admin', label: 'Administración', shortLabel: 'Admin', icon: 'settings' },
    { path: '/ia', label: 'Asistente IA', shortLabel: 'IA', icon: 'auto_awesome' }
  ]);

  isDesktop = computed(() => !this.isMobile());

  ngOnInit(): void {
    const users = this.dataService.getUsers();
    if (users.length > 0) this.currentUser.set(users[0]);
    this.breakpoint.observe('(min-width: 1024px)').subscribe((r) => {
      this.isMobile.set(!r.matches);
    });
  }

}
