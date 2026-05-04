import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Clock,
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
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mr-3" /> Carregando...
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <section className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Agendamento nao encontrado</h1>
        <p className="text-gray-500 mb-8 text-sm">O link pode estar invalido ou expirado.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm no-underline hover:bg-primary-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao inicio
        </Link>
      </section>
    );
  }

  const isCancelled = appointment.status === 'CANCELLED';
  const date = new Date(appointment.scheduledAt);
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit' });
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const firstName = appointment.guestName.trim().split(' ')[0];
  const code = `#${appointment.id.toString().padStart(5, '0')}`;

  return (
    <section className="max-w-xl mx-auto px-6 py-12 sm:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors no-underline text-sm mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Inicio
      </Link>

      <div className="bg-white rounded-3xl shadow-[0_4px_24px_-8px_rgba(30,136,229,0.12)] border border-gray-100 overflow-hidden">
        <div
          className={
            isCancelled
              ? 'px-8 py-4 bg-red-50/70 border-b border-red-100'
              : 'px-8 py-4 bg-gradient-to-r from-primary to-primary-light'
          }
        >
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold ${
                isCancelled ? 'text-red-600' : 'text-white'
              }`}
            >
              {isCancelled ? (
                <XCircle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isCancelled ? 'Cancelado' : 'Confirmado'}
            </div>
            <span
              className={`text-xs font-mono tracking-wider ${
                isCancelled ? 'text-red-400' : 'text-white/70'
              }`}
            >
              {code}
            </span>
          </div>
        </div>

        <div className="px-8 pt-10 pb-8 text-center border-b border-gray-100">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-4">
            {weekday}
          </p>
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-7xl font-bold text-primary leading-none tabular-nums">
              {day}
            </span>
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-700 capitalize leading-tight">
                {month}
              </p>
              <p className="text-sm text-gray-400 leading-tight">{year}</p>
            </div>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 bg-surface-dark px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary text-sm tabular-nums">
              {time}
            </span>
          </div>
        </div>

        <div className="px-8 py-7">
          <p className="text-gray-500 text-sm mb-5">
            Ola, <span className="font-semibold text-gray-900">{firstName}</span>. Aqui
            estao os detalhes da sua reserva.
          </p>
          <dl className="grid grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden">
            <Cell label="Profissional" value={appointment.professional.name} />
            <Cell label="Servico" value={appointment.service.name} />
            <Cell
              label="Duracao"
              value={`${appointment.service.durationMinutes} min`}
            />
            <Cell
              label="Valor"
              value={`R$ ${appointment.service.price.toFixed(2).replace('.', ',')}`}
            />
          </dl>
        </div>

        {!isCancelled && (
          <div className="px-8 pb-8">
            {showConfirmCancel ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700 text-sm">
                      Cancelar este agendamento?
                    </p>
                    <p className="text-red-600/70 text-sm mt-0.5">
                      Esta acao nao pode ser desfeita.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Cancelando
                      </>
                    ) : (
                      'Sim, cancelar'
                    )}
                  </button>
                  <button
                    onClick={() => setShowConfirmCancel(false)}
                    className="flex-1 bg-white text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Manter
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="w-full text-gray-500 hover:text-red-600 font-medium text-sm py-3 border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50/40 transition-all cursor-pointer"
              >
                Cancelar agendamento
              </button>
            )}
          </div>
        )}
      </div>

      {!isCancelled && (
        <p className="text-center text-xs text-gray-400 mt-6">
          Recomendamos chegar 5 minutos antes do horario marcado.
        </p>
      )}
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
        {label}
      </p>
      <p className="font-semibold text-gray-900 text-sm leading-snug">{value}</p>
    </div>
  );
}
