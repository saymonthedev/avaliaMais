import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/eventos': 'Eventos de Conselho',
  '/feedbacks': 'Feedbacks',
  '/chat': 'Chat',
  '/turmas': 'Turmas',
  '/usuarios': 'Usuários',
};

export default function AppShell() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'avaliaMais';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <header className="header">
          <span className="header-title">{title}</span>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
