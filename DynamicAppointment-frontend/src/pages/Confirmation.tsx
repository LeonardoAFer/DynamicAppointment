import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Briefcase, Copy } from 'lucide-react';
import { useState } from 'react';
import type { AppointmentResponse } from '../types';

export default function Confirmation() {
  const location = useLocation();
  const appointment = location.state?.appointment as AppointmentResponse | undefined;
  const [copied, setCopied] = useState(false);

  if (!appointment) return <Navigate to="/agendar" replace />;

  const date = new Date(appointment.scheduledAt);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const guestLink = `${window.location.origin}/meu-agendamento/${appointment.accessToken}`;

  function copyLink() {
    navigator.clipboard.writeText(guestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-primary mb-2">Agendamento Confirmado!</h1>
      <p className="text-gray-500 mb-10">
        Um e-mail de confirmacao foi enviado para{' '}
        <strong className="text-primary">{appointment.guestEmail}</strong>
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-left">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
          Detalhes do Agendamento
        </h2>
        <div className="space-y-5">
          <DetailRow
            icon={<User className="w-5 h-5 text-primary" />}
            label="Profissional"
            value={appointment.professional.name}
          />
          <DetailRow
            icon={<Briefcase className="w-5 h-5 text-primary" />}
            label="Servico"
            value={`${appointment.service.name} (${appointment.service.durationMinutes} min)`}
          />
          <DetailRow
            icon={<Calendar className="w-5 h-5 text-primary" />}
            label="Data"
            value={formattedDate}
          />
          <DetailRow
            icon={<Clock className="w-5 h-5 text-primary" />}
            label="Horario"
            value={formattedTime}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">
            Link para visualizar ou cancelar seu agendamento:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-surface-dark text-xs text-primary px-4 py-3 rounded-lg overflow-hidden text-ellipsis">
              {guestLink}
            </code>
            <button
              onClick={copyLink}
              className="bg-primary text-white p-3 rounded-lg hover:bg-primary-light transition-colors cursor-pointer shrink-0"
              title="Copiar link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-500 mt-2">Link copiado!</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Link
          to={`/meu-agendamento/${appointment.accessToken}`}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-light transition-colors no-underline"
        >
          Ver Agendamento
        </Link>
        <Link
          to="/"
          className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors no-underline"
        >
          Voltar ao Inicio
        </Link>
      </div>
    </section>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 p-2.5 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-primary font-semibold">{value}</p>
      </div>
    </div>
  );
}
