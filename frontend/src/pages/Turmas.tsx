import { useEffect, useState } from 'react';
import { turmaService } from '../services/turmaService';
import { notify } from '../services/notify';
import type { Turma } from '../types';

export default function Turmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', ano: new Date().getFullYear().toString(), curso: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    turmaService.listar().then(setTurmas).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { notify.error('Informe o nome da turma.'); return; }
    if (!form.curso.trim()) { notify.error('Informe o curso.'); return; }
    if (!form.ano) { notify.error('Informe o ano letivo.'); return; }
    setSaving(true);
    try {
      await turmaService.criar({ ...form, ano: Number(form.ano) });
      setShowModal(false);
      setForm({ nome: '', ano: new Date().getFullYear().toString(), curso: '' });
      notify.success('Turma criada com sucesso!');
      load();
    } catch {
      notify.error('Erro ao criar turma. Tente novamente.');
    } finally { setSaving(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Turmas</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Nova turma</button>
        </div>
        {loading ? (
          <div className="empty-state"><p>Carregando...</p></div>
        ) : turmas.length === 0 ? (
          <div className="empty-state"><span style={{ fontSize: 40 }}>🏫</span><p>Nenhuma turma cadastrada.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nome</th><th>Curso</th><th>Ano</th><th>Criada em</th></tr></thead>
              <tbody>
                {turmas.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.nome}</strong></td>
                    <td>{t.curso}</td>
                    <td>{t.ano}</td>
                    <td className="text-muted text-sm">{new Date(t.dataCriacao).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Nova Turma</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} noValidate>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome da turma</label>
                  <input className="form-control" placeholder="Ex: 3º Ano A" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Curso</label>
                    <input className="form-control" placeholder="Ex: Técnico em Informática" value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ano letivo</label>
                    <input className="form-control" type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Criar turma'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
