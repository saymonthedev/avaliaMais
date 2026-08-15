import api from './api';
import type { MensagemChat } from '../types';

export const chatService = {
  enviar: (destinatarioId: number, mensagem: string) =>
    api.post<MensagemChat>('/chat/enviar', { destinatarioId, mensagem }).then((r) => r.data),
  conversa: (outroId: number) =>
    api.get<MensagemChat[]>(`/chat/conversa/${outroId}`).then((r) => r.data),
  marcarLido: (outroId: number) => api.patch(`/chat/conversa/${outroId}/lido`),
  naoLidas: () => api.get<{ total: number }>('/chat/nao-lidas').then((r) => r.data.total),
};
