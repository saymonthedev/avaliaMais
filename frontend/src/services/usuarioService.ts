import api from './api';
import type { Usuario } from '../types';

export const usuarioService = {
  listar: () => api.get<Usuario[]>('/usuarios').then((r) => r.data),
  buscar: (id: number) => api.get<Usuario>(`/usuarios/${id}`).then((r) => r.data),
  criar: (data: unknown) => api.post<Usuario>('/usuarios', data).then((r) => r.data),
  atualizar: (id: number, data: unknown) => api.put<Usuario>(`/usuarios/${id}`, data).then((r) => r.data),
  desativar: (id: number) => api.delete(`/usuarios/${id}`),
};
