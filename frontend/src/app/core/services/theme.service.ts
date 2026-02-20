import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'gestor-tareas-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.loadStoredTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    this.applyTheme(this._theme());
  }

  toggle(): void {
    const next = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  private loadStoredTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');

    let darkLink = document.getElementById('material-dark-theme') as HTMLLinkElement | null;
    if (theme === 'dark') {
      if (!darkLink) {
        darkLink = document.createElement('link');
        darkLink.id = 'material-dark-theme';
        darkLink.rel = 'stylesheet';
        darkLink.href = '/themes/pink-bluegrey.css';
        document.head.appendChild(darkLink);
      }
    } else if (darkLink) {
      darkLink.remove();
    }
  }
}
