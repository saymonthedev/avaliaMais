import api from './api';
import type { LoginResponse } from '../types';

export const authService = {
  login: (email: string, senha: string) =>
    api.post<LoginResponse>('/auth/login', { email, senha }).then((r) => r.data),
};
