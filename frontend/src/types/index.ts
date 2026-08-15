export type PerfilUsuario = 'ALUNO' | 'REPRESENTANTE' | 'PROFESSOR' | 'PEDAGOGICO' | 'SUPERVISAO' | 'ADMINISTRADOR';
export type TipoFormulario = 'PRE_CONSELHO_TURMA' | 'PRE_CONSELHO_PROFESSOR' | 'FEEDBACK_FINAL';
export type StatusEtapa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  turmaId: number | null;
  turmaNome: string | null;
  isRepresentante: boolean;
  ativo: boolean;
  dataCriacao: string;
}

export interface Turma {
  id: number;
  nome: string;
  ano: number;
  curso: string;
  dataCriacao: string;
}

export interface EventoConselho {
  id: number;
  data: string;
  turmaId: number;
  turmaNome: string;
  metaPreenchimento: number;
  statusPreConselhoTurma: StatusEtapa;
  statusPreConselhoProfessores: StatusEtapa;
  statusFeedbackFinal: StatusEtapa;
  feedbackLiberado: boolean;
  disciplinas: string[];
  totalFormulariosPreenchidos: number;
  dataCriacao: string;
}

export interface Formulario {
  id: number;
  tipo: TipoFormulario;
  usuarioId: number;
  usuarioNome: string;
  eventoId: number;
  respostasJson: string;
  dataSubmissao: string;
}

export interface Feedback {
  id: number;
  eventoId: number;
  alunoId: number;
  alunoNome: string;
  feedbackFinal: string;
  pontosFortes: string;
  oportunidadesMelhoria: string;
  data: string;
}

export interface MensagemChat {
  id: number;
  remetenteId: number;
  remetenteNome: string;
  destinatarioId: number;
  destinatarioNome: string;
  mensagem: string;
  lido: boolean;
  dataEnvio: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  turmaId: number | null;
  isRepresentante: boolean;
}
