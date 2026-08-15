import api from './api';
import type { Feedback } from '../types';

export const feedbackService = {
  listarPorAluno: (alunoId: number) =>
    api.get<Feedback[]>(`/feedbacks/aluno/${alunoId}`).then((r) => r.data),
  listarPorEvento: (eventoId: number) =>
    api.get<Feedback[]>(`/feedbacks/evento/${eventoId}`).then((r) => r.data),
  consolidar: (data: unknown) => api.post<Feedback>('/feedbacks', data).then((r) => r.data),
};
