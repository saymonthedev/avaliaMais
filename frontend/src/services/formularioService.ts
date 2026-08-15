import api from './api';
import type { Formulario, TipoFormulario } from '../types';

export const formularioService = {
  listarPorEvento: (eventoId: number) =>
    api.get<Formulario[]>(`/formularios/evento/${eventoId}`).then((r) => r.data),
  listarPorUsuario: (usuarioId: number) =>
    api.get<Formulario[]>(`/formularios/usuario/${usuarioId}`).then((r) => r.data),
  submeter: (tipo: TipoFormulario, eventoId: number, respostasJson: string) =>
    api.post<Formulario>('/formularios', { tipo, eventoId, respostasJson }).then((r) => r.data),
};
