import { create } from 'zustand';
import type { PerfilUsuario } from '../types';

interface AuthState {
  token: string | null;
  nome: string | null;
  email: string | null;
  perfil: PerfilUsuario | null;
  turmaId: number | null;
  isRepresentante: boolean;
  setAuth: (data: { token: string; nome: string; email: string; perfil: PerfilUsuario; turmaId: number | null; isRepresentante: boolean }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  can: (...perfis: PerfilUsuario[]) => boolean;
}

const stored = () => {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  ...(stored() ?? { nome: null, email: null, perfil: null, turmaId: null, isRepresentante: false }),

  setAuth(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      nome: data.nome, email: data.email, perfil: data.perfil,
      turmaId: data.turmaId, isRepresentante: data.isRepresentante,
    }));
    set({ token: data.token, nome: data.nome, email: data.email, perfil: data.perfil, turmaId: data.turmaId, isRepresentante: data.isRepresentante });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, nome: null, email: null, perfil: null, turmaId: null, isRepresentante: false });
  },

  isAuthenticated: () => !!get().token,

  can: (...perfis) => perfis.includes(get().perfil as PerfilUsuario),
}));
