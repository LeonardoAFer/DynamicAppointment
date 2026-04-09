import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { getAppointmentByToken, cancelAppointmentByToken } from '../services/api';
import type { AppointmentResponse } from '../types';

export default function GuestView() {
  const { token } = useParams<{ token: string }>();
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getAppointmentByToken(token)
      .then(setAppointment)
      .catch(() => setError('Agendamento nao encontrado.'))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCancel() {
    if (!token) return;
    setCancelling(true);
    try {
      const updated = await cancelAppointmentByToken(token);
      setAppointment(updated);
      setShowConfirmCancel(false);
    } catch {
      setError('Erro ao cancelar agendamento.');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mr-3" /> Carregando agendamento...
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <section className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Agendamento nao encontrado</h1>
        <p className="text-gray-500 mb-8">O link pode estar invalido ou expirado.</p>
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm no-underline hover:bg-primary-light transition-colors"
        >
          Voltar ao Inicio
        </Link>
      </section>
    );
  }

  const isCancelled = appointment.status === 'CANCELLED';
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

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      {/* Status Badge */}
      <div className="text-center mb-8">
        {isCancelled ? (
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" /> Agendamento Cancelado
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" /> Agendamento Confirmado
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Meu Agendamento</h1>
        <p className="text-gray-400 text-sm mb-8">
          Ola, <strong className="text-primary">{appointment.guestName}</strong>
        </p>

        <div className="space-y-5 mb-8">
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

        {!isCancelled && (
          <div className="border-t border-gray-100 pt-6">
            {showConfirmCancel ? (
              <div className="bg-red-50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700">Tem certeza que deseja cancelar?</p>
                    <p className="text-red-600/70 text-sm mt-1">
                      Esta acao nao pode ser desfeita.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {cancelling ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Cancelando...
                      </span>
                    ) : (
                      'Sim, cancelar'
                    )}
                  </button>
                  <button
                    onClick={() => setShowConfirmCancel(false)}
                    className="bg-white text-gray-600 px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Nao, manter
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="text-red-500 font-semibold text-sm hover:text-red-700 transition-colors cursor-pointer"
              >
                Cancelar agendamento
              </button>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/"
          className="text-gray-400 hover:text-primary transition-colors no-underline text-sm"
        >
          Voltar ao inicio
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
