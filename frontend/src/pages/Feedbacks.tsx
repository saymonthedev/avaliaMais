import { useEffect, useState } from 'react';
import { feedbackService } from '../services/feedbackService';
import { usuarioService } from '../services/usuarioService';
import { eventoService } from '../services/eventoService';
import { useAuthStore } from '../store/authStore';
import type { Feedback, Usuario, EventoConselho } from '../types';

export default function Feedbacks() {
  const { perfil } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [eventos, setEventos] = useState<EventoConselho[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ alunoId: '', eventoId: '', feedbackFinal: '', pontosFortes: '', oportunidadesMelhoria: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [us, ev] = await Promise.all([usuarioService.listar(), eventoService.listar()]);
      setUsuarios(us.filter((u) => u.perfil === 'ALUNO' || u.perfil === 'REPRESENTANTE'));
      setEventos(ev);
      if (us.length > 0 && (perfil === 'PEDAGOGICO' || perfil === 'SUPERVISAO')) {
        const fbs = await feedbackService.listarPorEvento(ev[0]?.id ?? 0).catch(() => []);
        setFeedbacks(fbs);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await feedbackService.consolidar({ ...form, alunoId: Number(form.alunoId), eventoId: Number(form.eventoId) });
      setShowModal(false);
      setForm({ alunoId: '', eventoId: '', feedbackFinal: '', pontosFortes: '', oportunidadesMelhoria: '' });
      load();
    } finally { setSaving(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Feedbacks Consolidados</span>
          {perfil === 'PEDAGOGICO' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Novo feedback</button>
          )}
        </div>
        {loading ? (
          <div className="empty-state"><p>Carregando...</p></div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>📝</span>
            <p>Nenhum feedback consolidado encontrado.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Aluno</th><th>Evento</th><th>Feedback Final</th><th>Data</th></tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td><strong>{f.alunoNome}</strong></td>
                    <td>#{f.eventoId}</td>
                    <td style={{ maxWidth: 300 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>{f.feedbackFinal}</div>
                    </td>
                    <td className="text-muted text-sm">{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Consolidar Feedback</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Aluno</label>
                    <select className="form-control" required value={form.alunoId} onChange={(e) => setForm({ ...form, alunoId: e.target.value })}>
                      <option value="">Selecione...</option>
                      {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Evento de Conselho</label>
                    <select className="form-control" required value={form.eventoId} onChange={(e) => setForm({ ...form, eventoId: e.target.value })}>
                      <option value="">Selecione...</option>
                      {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.turmaNome} — {new Date(ev.data).toLocaleDateString('pt-BR')}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Feedback Final</label>
                  <textarea className="form-control" rows={3} required value={form.feedbackFinal} onChange={(e) => setForm({ ...form, feedbackFinal: e.target.value })} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Pontos Fortes</label>
                    <textarea className="form-control" rows={2} value={form.pontosFortes} onChange={(e) => setForm({ ...form, pontosFortes: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Oportunidades de Melhoria</label>
                    <textarea className="form-control" rows={2} value={form.oportunidadesMelhoria} onChange={(e) => setForm({ ...form, oportunidadesMelhoria: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Consolidar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
