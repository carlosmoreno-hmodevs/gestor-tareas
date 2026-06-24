import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-page">
      <div class="login-container">
        <header class="login-header">
          <div class="header-icon">
            <mat-icon>lock</mat-icon>
          </div>
          <h1 class="title">Iniciar sesión</h1>
          <p class="subtitle">Gestor de Tareas — Ferretería Luisito (demo)</p>
        </header>

        <form class="login-form" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Correo electrónico</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="username" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" />
          </mat-form-field>

          @if (errorMessage()) {
            <p class="error-banner" role="alert">{{ errorMessage() }}</p>
          }

          <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="loading() || form.invalid">
            @if (loading()) {
              <mat-spinner diameter="22" />
            } @else {
              Entrar
            }
          </button>
        </form>

        <footer class="login-hint">
          <p>Demo local (contraseña <code>GamoraDemo123!</code>):</p>
          <p><strong>admin@luisito.test</strong> · administrador</p>
          <p><strong>coordinator@luisito.test</strong> · coordinador</p>
          <p><strong>panchito@luisito.test</strong> · responsable</p>
          <p><strong>viewer@luisito.test</strong> · solo lectura</p>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
      }
      .login-container {
        width: 100%;
        max-width: 420px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        padding: 2rem 1.75rem;
      }
      .login-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .header-icon {
        width: 56px;
        height: 56px;
        margin: 0 auto 1rem;
        border-radius: 50%;
        background: #e3f2fd;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1565c0;
      }
      .title {
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
        font-weight: 600;
      }
      .subtitle {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .full-width {
        width: 100%;
      }
      .error-banner {
        margin: 0.5rem 0;
        padding: 0.75rem;
        border-radius: 8px;
        background: #ffebee;
        color: #c62828;
        font-size: 0.9rem;
      }
      .submit-btn {
        margin-top: 0.5rem;
        height: 44px;
      }
      .login-hint {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
        font-size: 0.8rem;
        color: #666;
        text-align: center;
      }
      .login-hint code {
        background: #f5f5f5;
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['admin@luisito.test', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');
    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.login(email, password);
      await this.router.navigate(['/tablero-operativo']);
    } catch (err: unknown) {
      const body = (err as { error?: { error?: string } })?.error;
      this.errorMessage.set(body?.error ?? 'No pudimos iniciar sesión. Verifica tus datos.');
    } finally {
      this.loading.set(false);
    }
  }
}
