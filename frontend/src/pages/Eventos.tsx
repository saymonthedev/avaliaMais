import { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { eventoService } from '../services/eventoService';
import { turmaService } from '../services/turmaService';
import type { EventoConselho, Turma, StatusEtapa } from '../types';
import { notify } from '../services/notify';
import { DatePicker } from '../components/DatePicker';

const ETAPAS = [
  { key: 'pre-conselho-turma', label: 'Pré-conselho Turma' },
  { key: 'pre-conselho-professores', label: 'Pré-conselho Professores' },
  { key: 'feedback-final', label: 'Feedback Final' },
  { key: 'liberar-feedback', label: 'Liberar Feedback' },
];

const STATUS_OPTIONS = [
  { value: 'PENDENTE',     label: 'Pendente' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDO',    label: 'Concluído' },
  { value: 'CANCELADO',    label: 'Cancelado' },
];

const LIBERAR_OPTIONS = [
  { value: 'PENDENTE',  label: 'Bloquear' },
  { value: 'CONCLUIDO', label: 'Liberar' },
];

function StatusPicker({ value, onChange, options }: {
  value: string;
  onChange: (v: StatusEtapa) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="status-picker">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`status-btn status-btn-${opt.value.toLowerCase().replace('_', '-')}${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value as StatusEtapa)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Eventos() {
  const [eventos, setEventos] = useState<EventoConselho[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ data: '', turmaId: '', metaPreenchimento: '', disciplinas: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([eventoService.listar(), turmaService.listar()])
      .then(([ev, tu]) => { setEventos(ev); setTurmas(tu); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.data) { notify.error('Informe a data do evento.'); return; }
    if (!form.turmaId) { notify.error('Selecione uma turma.'); return; }
    setSaving(true);
    try {
      await eventoService.criar({
        data: form.data,
        turmaId: Number(form.turmaId),
        metaPreenchimento: form.metaPreenchimento ? Number(form.metaPreenchimento) : null,
        disciplinas: form.disciplinas ? form.disciplinas.split(',').map((d) => d.trim()) : [],
      });
      setShowModal(false);
      setForm({ data: '', turmaId: '', metaPreenchimento: '', disciplinas: '' });
      notify.success('Evento criado com sucesso!');
      load();
    } catch {
      notify.error('Erro ao criar evento. Tente novamente.');
    } finally { setSaving(false); }
  };

  const handleEtapa = async (eventoId: number, etapa: string, status: StatusEtapa) => {
    await eventoService.atualizarEtapa(eventoId, etapa, status);
    load();
  };

  return (
    <div className="page">
      <div className="card mb-4">
        <div className="card-header">
          <span className="card-title">Eventos de Conselho</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Novo evento</button>
        </div>
        {loading ? (
          <div className="empty-state"><p>Carregando...</p></div>
        ) : eventos.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={40} strokeWidth={1.2} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <p>Nenhum evento cadastrado ainda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {eventos.map((ev) => (
              <div key={ev.id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>{ev.turmaNome}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarDays size={13} />
                        {new Date(ev.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                      {ev.metaPreenchimento != null && (
                        <span className="badge badge-blue">Meta: {ev.metaPreenchimento}%</span>
                      )}
                    </div>
                  </div>
                  <span className={`badge ${ev.feedbackLiberado ? 'badge-green' : 'badge-gray'}`} style={{ flexShrink: 0 }}>
                    {ev.feedbackLiberado ? 'Feedback liberado' : 'Feedback pendente'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {ETAPAS.map((et) => {
                    const statusKey = {
                      'pre-conselho-turma': ev.statusPreConselhoTurma,
                      'pre-conselho-professores': ev.statusPreConselhoProfessores,
                      'feedback-final': ev.statusFeedbackFinal,
                      'liberar-feedback': ev.feedbackLiberado ? 'CONCLUIDO' : 'PENDENTE',
                    }[et.key] as StatusEtapa;
                    return (
                      <div key={et.key} className="etapa-card">
                        <div className="etapa-card-label">{et.label}</div>
                        <StatusPicker
                          value={statusKey}
                          onChange={(v) => handleEtapa(ev.id, et.key, v)}
                          options={et.key === 'liberar-feedback' ? LIBERAR_OPTIONS : STATUS_OPTIONS}
                        />
                      </div>
                    );
                  })}
                </div>

                {ev.disciplinas?.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {ev.disciplinas.map((d) => (
                      <span key={d} className="badge badge-blue" style={{ fontSize: 11 }}>{d}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Novo Evento de Conselho</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            </div>
            <form onSubmit={handleCreate} noValidate>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Data do conselho</label>
                    <DatePicker value={form.data} onChange={(v) => setForm({ ...form, data: v })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Turma</label>
                    <select className="form-control" value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })}>
                      <option value="">Selecione...</option>
                      {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Meta de preenchimento (%)</label>
                  <input className="form-control" type="number" min="0" max="100" value={form.metaPreenchimento} onChange={(e) => setForm({ ...form, metaPreenchimento: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Disciplinas (separadas por vírgula)</label>
                  <input className="form-control" value={form.disciplinas} onChange={(e) => setForm({ ...form, disciplinas: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Criando...' : 'Criar evento'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
