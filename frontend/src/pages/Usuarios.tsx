import { useEffect, useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import { turmaService } from '../services/turmaService';
import type { Usuario, Turma, PerfilUsuario } from '../types';

const PERFIS: PerfilUsuario[] = ['ALUNO', 'REPRESENTANTE', 'PROFESSOR', 'PEDAGOGICO', 'SUPERVISAO', 'ADMINISTRADOR'];

const perfilLabel: Record<PerfilUsuario, string> = {
  ALUNO: 'Aluno', REPRESENTANTE: 'Representante', PROFESSOR: 'Professor',
  PEDAGOGICO: 'Pedagógico', SUPERVISAO: 'Supervisão', ADMINISTRADOR: 'Administrador',
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'ALUNO' as PerfilUsuario, turmaId: '', isRepresentante: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([usuarioService.listar(), turmaService.listar()])
      .then(([u, t]) => { setUsuarios(u); setTurmas(t); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await usuarioService.criar({ ...form, turmaId: form.turmaId ? Number(form.turmaId) : null });
      setShowModal(false);
      setForm({ nome: '', email: '', senha: '', perfil: 'ALUNO', turmaId: '', isRepresentante: false });
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Erro ao criar usuário');
    } finally { setSaving(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Usuários</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Novo usuário</button>
        </div>
        {loading ? (
          <div className="empty-state"><p>Carregando...</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Turma</th><th>Status</th></tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.nome}</strong>{u.isRepresentante && <span className="badge badge-blue" style={{ marginLeft: 8, fontSize: 10 }}>Rep.</span>}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td><span className="badge badge-blue">{perfilLabel[u.perfil]}</span></td>
                    <td>{u.turmaNome ?? <span className="text-muted">—</span>}</td>
                    <td><span className={`badge ${u.ativo ? 'badge-green' : 'badge-red'}`}>{u.ativo ? 'Ativo' : 'Inativo'}</span></td>
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
              <span className="modal-title">Novo Usuário</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nome completo</label>
                    <input className="form-control" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input className="form-control" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input className="form-control" type="password" required minLength={6} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Perfil</label>
                    <select className="form-control" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value as PerfilUsuario })}>
                      {PERFIS.map((p) => <option key={p} value={p}>{perfilLabel[p]}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Turma (opcional)</label>
                    <select className="form-control" value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })}>
                      <option value="">— Sem turma —</option>
                      {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
                    <input type="checkbox" id="rep" checked={form.isRepresentante} onChange={(e) => setForm({ ...form, isRepresentante: e.target.checked })} />
                    <label htmlFor="rep" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>É representante de turma</label>
                  </div>
                </div>
                {error && <div className="form-error">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Criar usuário'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
