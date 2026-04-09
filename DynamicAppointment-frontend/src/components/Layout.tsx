import { Outlet, Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline text-white">
            <div className="bg-accent p-2 rounded-lg">
              <CalendarCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-wide">Agendamento</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-white/70 hover:text-white transition-colors no-underline text-sm font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/agendar"
              className="bg-white text-primary px-5 py-2 rounded-lg font-semibold text-sm hover:bg-surface-dark transition-colors no-underline"
            >
              Agendar
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-primary text-white/50 text-center py-8 text-sm mt-auto">
        <p>&copy; 2025 Agendamento. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
