import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  User,
  Briefcase,
  CalendarDays,
  UserCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  Loader2,
  CalendarCheck,
  Shield,
} from 'lucide-react';
import { getProfessionals, getAvailableSlots, createAppointment } from '../services/api';
import type { Professional, ServiceSummary } from '../types';

type Step = 'professional' | 'service' | 'datetime' | 'info';

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: 'professional', label: 'Profissional', icon: <User className="w-4 h-4" /> },
  { key: 'service', label: 'Servico', icon: <Briefcase className="w-4 h-4" /> },
  { key: 'datetime', label: 'Data & Hora', icon: <CalendarDays className="w-4 h-4" /> },
  { key: 'info', label: 'Seus Dados', icon: <UserCircle className="w-4 h-4" /> },
];

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('professional');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ guestName: '', guestEmail: '', guestPhone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    getProfessionals()
      .then(setProfessionals)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProfessional && selectedService && selectedDate) {
      setLoadingSlots(true);
      setSelectedTime('');
      getAvailableSlots(selectedDate, selectedProfessional.id, selectedService.id)
        .then(setSlots)
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedProfessional, selectedService, selectedDate]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  function canNext(): boolean {
    switch (step) {
      case 'professional': return !!selectedProfessional;
      case 'service': return !!selectedService;
      case 'datetime': return !!selectedDate && !!selectedTime;
      case 'info': return !!(form.guestName && form.guestEmail && form.guestPhone);
    }
  }

  function goNext() { if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].key); }
  function goBack() { if (stepIndex > 0) setStep(STEPS[stepIndex - 1].key); }

  async function handleSubmit() {
    if (!selectedProfessional || !selectedService) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await createAppointment({
        ...form,
        professionalId: selectedProfessional.id,
        serviceId: selectedService.id,
        scheduledAt: `${selectedDate}T${selectedTime}:00`,
      });
      navigate('/confirmacao', { state: { appointment: response } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Erro ao criar agendamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Admin link */}
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors no-underline"
        >
          <Shield className="w-3.5 h-3.5" />
          Painel Admin
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <CalendarCheck className="w-4 h-4" />
          Agendamento Online
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Agende seu horario</h1>
        <p className="text-gray-500 text-sm mt-1">Escolha o profissional, servico e melhor horario</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <div
              className={`flex items-center gap-1.5 justify-center w-full py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                i === stepIndex
                  ? 'bg-primary text-white shadow-sm'
                  : i < stepIndex
                  ? 'bg-primary/15 text-primary'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[320px]">

        {/* Step: Professional */}
        {step === 'professional' && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-5">Escolha o profissional</h2>
            {loading ? (
              <Loading text="Carregando profissionais..." />
            ) : professionals.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">Nenhum profissional encontrado.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {professionals.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProfessional(p); setSelectedService(null); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedProfessional?.id === p.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-100 hover:border-primary/30 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedProfessional?.id === p.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {p.startTime?.slice(0, 5)} - {p.endTime?.slice(0, 5)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Service */}
        {step === 'service' && selectedProfessional && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-5">Escolha o servico</h2>
            {selectedProfessional.services.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">Nenhum servico disponivel para este profissional.</p>
            ) : (
              <div className="space-y-3">
                {selectedProfessional.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedService?.id === s.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-100 hover:border-primary/30 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {s.durationMinutes} min
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.category}</span>
                      </div>
                    </div>
                    <span className="text-primary font-bold text-sm">R$ {Number(s.price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: DateTime */}
        {step === 'datetime' && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-5">Escolha data e horario</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Data</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Horario</label>
                {loadingSlots ? (
                  <Loading text="Buscando horarios..." />
                ) : slots.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">Nenhum horario disponivel nesta data.</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {slots.map((slot) => {
                        const t = slot.startTime.slice(0, 5);
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                              selectedTime === t
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step: Info */}
        {step === 'info' && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-5">Seus dados</h2>
            <div className="space-y-4 max-w-sm">
              <Field label="Nome completo" value={form.guestName} onChange={(v) => setForm({ ...form, guestName: v })} placeholder="Seu nome" />
              <Field label="E-mail" type="email" value={form.guestEmail} onChange={(v) => setForm({ ...form, guestEmail: v })} placeholder="seu@email.com" />
              <Field label="Telefone" type="tel" value={form.guestPhone} onChange={(v) => setForm({ ...form, guestPhone: v })} placeholder="(00) 00000-0000" />
            </div>

            {/* Resumo */}
            {selectedProfessional && selectedService && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resumo</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
                  <p className="text-gray-600"><span className="text-gray-900 font-medium">Profissional:</span> {selectedProfessional.name}</p>
                  <p className="text-gray-600"><span className="text-gray-900 font-medium">Servico:</span> {selectedService.name}</p>
                  <p className="text-gray-600"><span className="text-gray-900 font-medium">Data:</span> {selectedDate.split('-').reverse().join('/')}</p>
                  <p className="text-gray-600"><span className="text-gray-900 font-medium">Horario:</span> {selectedTime}</p>
                  <p className="text-gray-600"><span className="text-gray-900 font-medium">Valor:</span> R$ {Number(selectedService.price).toFixed(2)}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-0 disabled:cursor-default transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        {step === 'info' ? (
          <button
            onClick={handleSubmit}
            disabled={!canNext() || submitting}
            className="flex items-center gap-2 bg-primary text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Agendando...</> : 'Confirmar'}
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!canNext()}
            className="flex items-center gap-1.5 bg-primary text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            Proximo <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> {text}
    </div>
  );
}
