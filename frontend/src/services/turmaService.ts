import api from './api';
import type { Turma } from '../types';

export const turmaService = {
  listar: () => api.get<Turma[]>('/turmas').then((r) => r.data),
  buscar: (id: number) => api.get<Turma>(`/turmas/${id}`).then((r) => r.data),
  criar: (data: unknown) => api.post<Turma>('/turmas', data).then((r) => r.data),
  atualizar: (id: number, data: unknown) => api.put<Turma>(`/turmas/${id}`, data).then((r) => r.data),
  deletar: (id: number) => api.delete(`/turmas/${id}`),
};
