import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TenantContextService } from '../services/tenant-context.service';
import { tenantForWorkspaceSlug } from '../config/gamora.config';
import type { AuthSession, LoginResponse, MeResponse } from './auth.models';

const STORAGE_KEY = 'gamora.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tenantContext = inject(TenantContextService);
  private readonly baseUrl = environment.gamoraApiUrl;

  private readonly _session = signal<AuthSession | null>(this.loadStoredSession());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => !!this._session()?.token);
  readonly user = computed(() => this._session()?.user ?? null);
  readonly workspace = computed(() => this._session()?.workspace ?? null);
  readonly contactId = computed(() => this._session()?.user.contactId ?? null);

  token(): string | null {
    return this._session()?.token ?? null;
  }

  async initFromStorage(): Promise<void> {
    if (!this._session()?.token) return;
    try {
      await this.loadMe();
    } catch {
      this.clearSession();
    }
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, { email, password })
    );
    this.applySession(res.data);
  }

  async loadMe(): Promise<void> {
    const res = await firstValueFrom(this.http.get<MeResponse>(`${this.baseUrl}/api/auth/me`));
    const current = this._session();
    if (!current?.token) {
      throw new Error('Sin token de sesión');
    }
    this.applySession({
      token: current.token,
      user: res.data.user,
      workspace: res.data.workspace,
    });
  }

  async logout(): Promise<void> {
    const token = this.token();
    if (token) {
      try {
        await firstValueFrom(this.http.post(`${this.baseUrl}/api/auth/logout`, {}));
      } catch {
        /* stateless — limpiar sesión local de todos modos */
      }
    }
    this.clearSession();
  }

  clearSession(): void {
    this._session.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    this.tenantContext.setCurrentTenant(null);
  }

  private applySession(session: AuthSession): void {
    this._session.set(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* ignore */
    }
    const tenantId = tenantForWorkspaceSlug(session.workspace.slug);
    if (tenantId) {
      this.tenantContext.setCurrentTenant(tenantId);
    }
  }

  private loadStoredSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.token || !parsed?.user || !parsed?.workspace) return null;
      const tenantId = tenantForWorkspaceSlug(parsed.workspace.slug);
      if (tenantId) {
        this.tenantContext.setCurrentTenant(tenantId);
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
