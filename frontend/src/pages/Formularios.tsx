import { useEffect, useState } from 'react';
import { formularioService } from '../services/formularioService';
import { eventoService } from '../services/eventoService';
import { useAuthStore } from '../store/authStore';
import type { Formulario, EventoConselho, TipoFormulario } from '../types';
import { notify } from '../services/notify';

const TIPOS: { value: TipoFormulario; label: string; roles: string[] }[] = [
  { value: 'PRE_CONSELHO_TURMA', label: 'Pré-conselho da Turma', roles: ['REPRESENTANTE'] },
  { value: 'PRE_CONSELHO_PROFESSOR', label: 'Pré-conselho dos Professores', roles: ['PROFESSOR'] },
  { value: 'FEEDBACK_FINAL', label: 'Feedback Final', roles: ['PEDAGOGICO'] },
];

const CAMPOS_TURMA = [
  { key: 'pontosFortes', label: 'Pontos Fortes da Turma', tipo: 'textarea' },
  { key: 'oportunidadesMelhoria', label: 'Oportunidades de Melhoria', tipo: 'textarea' },
  { key: 'sugestaoSupervisao', label: 'Sugestão para Supervisão', tipo: 'textarea' },
  { key: 'autoavaliacao', label: 'Autoavaliação da Classe', tipo: 'textarea' },
];

const CAMPOS_PROFESSOR = [
  { key: 'pontosFortesTurma', label: 'Pontos Fortes da Turma', tipo: 'textarea' },
  { key: 'oportunidadesMelhoria', label: 'Oportunidades de Melhoria', tipo: 'textarea' },
  { key: 'avaliacaoGeral', label: 'Avaliação Geral da Turma', tipo: 'textarea' },
  { key: 'observacoes', label: 'Observações por Aluno', tipo: 'textarea' },
];

export default function Formularios() {
  const { perfil } = useAuthStore();
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [eventos, setEventos] = useState<EventoConselho[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoFormulario | ''>('');
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const tiposPermitidos = TIPOS.filter((t) => !perfil || t.roles.includes(perfil));
  const campos = tipoSelecionado === 'PRE_CONSELHO_TURMA' ? CAMPOS_TURMA
    : tipoSelecionado === 'PRE_CONSELHO_PROFESSOR' ? CAMPOS_PROFESSOR
    : CAMPOS_TURMA;

  const load = async () => {
    setLoading(true);
    const ev = await eventoService.listar().catch(() => []);
    setEventos(ev);
    if (ev.length > 0) {
      const fbs = await formularioService.listarPorEvento(ev[0].id).catch(() => []);
      setFormularios(fbs);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventoSelecionado) { notify.error('Selecione um evento de conselho.'); return; }
    if (!tipoSelecionado) { notify.error('Selecione o tipo de formulário.'); return; }
    const campoVazio = campos.find((c) => !respostas[c.key]?.trim());
    if (campoVazio) { notify.error(`Preencha o campo "${campoVazio.label}".`); return; }
    setSaving(true);
    try {
      await formularioService.submeter(tipoSelecionado, Number(eventoSelecionado), JSON.stringify(respostas));
      setShowModal(false);
      setRespostas({});
      setEventoSelecionado('');
      setTipoSelecionado('');
      notify.success('Formulário enviado com sucesso!');
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      notify.error(msg || 'Erro ao enviar formulário. Verifique se a etapa está aberta.');
    } finally { setSaving(false); }
  };

  const tipoLabel = (tipo: TipoFormulario) =>
    TIPOS.find((t) => t.value === tipo)?.label ?? tipo;

  return (
    <div className="page">
      {tiposPermitidos.length > 0 && (
        <div className="mb-6">
          <div className="card" style={{ borderLeft: '4px solid var(--primary)', borderRadius: 'var(--radius)' }}>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Preencher formulário</div>
                  <div className="text-muted text-sm">Você pode preencher os seguintes tipos de formulário</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  + Novo formulário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">Formulários Enviados</span>
        </div>
        {loading ? (
          <div className="empty-state"><p>Carregando...</p></div>
        ) : formularios.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>📋</span>
            <p>Nenhum formulário encontrado para os eventos disponíveis.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Tipo</th><th>Enviado por</th><th>Evento</th><th>Data de envio</th></tr>
              </thead>
              <tbody>
                {formularios.map((f) => (
                  <tr key={f.id}>
                    <td><span className="badge badge-blue">{tipoLabel(f.tipo)}</span></td>
                    <td><strong>{f.usuarioNome}</strong></td>
                    <td>#{f.eventoId}</td>
                    <td className="text-muted text-sm">
                      {new Date(f.dataSubmissao).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Novo Formulário</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Evento de Conselho</label>
                    <select className="form-control" value={eventoSelecionado} onChange={(e) => setEventoSelecionado(e.target.value)}>
                      <option value="">Selecione...</option>
                      {eventos.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.turmaNome} — {new Date(ev.data).toLocaleDateString('pt-BR')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipo de formulário</label>
                    <select className="form-control" value={tipoSelecionado} onChange={(e) => setTipoSelecionado(e.target.value as TipoFormulario)}>
                      <option value="">Selecione...</option>
                      {tiposPermitidos.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {tipoSelecionado && campos.map((campo) => (
                  <div key={campo.key} className="form-group">
                    <label className="form-label">{campo.label}</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder={`Descreva ${campo.label.toLowerCase()}...`}
                      value={respostas[campo.key] ?? ''}
                      onChange={(e) => setRespostas({ ...respostas, [campo.key]: e.target.value })}
                    />
                  </div>
                ))}

                {!tipoSelecionado && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 14 }}>
                    Selecione o evento e o tipo para ver os campos do formulário
                  </div>
                )}

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !tipoSelecionado}>
                  {saving ? 'Enviando...' : 'Enviar formulário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
