import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { notify } from '../services/notify';

const stats = [
  { value: '1.240+', label: 'Conselhos realizados' },
  { value: '380+',   label: 'Professores ativos' },
  { value: '8.900+', label: 'Feedbacks gerados' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { notify.error('Informe o e-mail para continuar.'); return; }
    if (!senha.trim()) { notify.error('Informe a senha para continuar.'); return; }
    setLoading(true);
    try {
      const data = await authService.login(email, senha);
      setAuth(data);
      navigate('/dashboard');
    } catch {
      notify.error('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Hero ── */}
      <div className="auth-hero">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />

        <div className="auth-hero-content">
          <div className="auth-logo-wrap">
            <div className="auth-logo-mark">A+</div>
            <div className="auth-brand">AVALIA<span>+</span></div>
          </div>

          <h1 className="auth-headline">
            Conselhos de classe<br />mais inteligentes
          </h1>
          <p className="auth-subtext">
            Centralize, automatize e acompanhe todo o processo de<br />
            pré-conselhos e feedbacks educacionais.
          </p>

          <div className="auth-stats">
            {stats.map((s) => (
              <div key={s.label} className="auth-stat-card">
                <div className="auth-stat-value">{s.value}</div>
                <div className="auth-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-form-brand">
            <div className="logo-icon" style={{ width: 44, height: 44, fontSize: 16 }}>A+</div>
            <span className="auth-form-brand-text">AVALIA<span>+</span></span>
          </div>

          <h2 className="login-title">Bem-vindo de volta</h2>
          <p className="login-subtitle">Acesse sua conta para continuar</p>

          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 28 }}>
            <div className="form-group">
              <label className="form-label">E-mail institucional</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  className="form-control input-with-icon"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="form-control input-with-icon input-with-icon-right"
                  type={showSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowSenha((v) => !v)}
                  tabIndex={-1}
                >
                  {showSenha ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Entrar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="auth-help-text">
            Problemas para acessar? Fale com a equipe pedagógica.
          </p>
        </div>

        <div className="auth-panel-footer">
          AVALIA+ © {new Date().getFullYear()} — Sistema de Gestão de Conselhos
        </div>
      </div>
    </div>
  );
}
