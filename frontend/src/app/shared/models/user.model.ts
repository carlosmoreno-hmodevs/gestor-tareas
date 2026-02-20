export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  /** Puesto o rol funcional (ej. Jefe de área, Responsable de Abasto). */
  position?: string;
  avatarUrl?: string | null;
}
