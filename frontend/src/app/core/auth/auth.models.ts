export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  contactId: string | null;
}

export interface AuthWorkspace {
  id: string;
  name: string;
  slug: string;
  status?: 'active' | 'inactive';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  workspace: AuthWorkspace;
}

export interface LoginResponse {
  data: AuthSession;
}

export interface MeResponse {
  data: {
    user: AuthUser;
    workspace: AuthWorkspace;
  };
}
