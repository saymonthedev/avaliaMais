import api from './api';
import type { EventoConselho, StatusEtapa } from '../types';

export const eventoService = {
  listar: () => api.get<EventoConselho[]>('/eventos').then((r) => r.data),
  buscar: (id: number) => api.get<EventoConselho>(`/eventos/${id}`).then((r) => r.data),
  criar: (data: unknown) => api.post<EventoConselho>('/eventos', data).then((r) => r.data),
  atualizarEtapa: (id: number, etapa: string, status: StatusEtapa) =>
    api.patch<EventoConselho>(`/eventos/${id}/etapa/${etapa}?status=${status}`).then((r) => r.data),
};
