import { useEffect, useState } from 'react';
import {
  Loader2, CalendarDays, Trash2, X, User, Briefcase, Calendar, Mail, Phone,
} from 'lucide-react';
import { getProfessionals, getAppointments, deleteAppointment } from '../../services/api';
import type { Professional, AppointmentResponse, Slot } from '../../types';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente', CONFIRMED: 'Confirmado', CANCELLED: 'Cancelado', COMPLETED: 'Concluido',
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-blue-50 text-blue-700',
};

export default function Appointments() {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfId, setSelectedProfId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const start = today.toISOString().slice(0, 10);
    const end = new Date(today.getTime() + 30 * 86400000).toISOString().slice(0, 10);
    return { start, end };
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [viewAppointment, setViewAppointment] = useState<AppointmentResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProfessionals()
      .then((p) => {
        setProfessionals(p);
        if (p.length > 0) setSelectedProfId(p[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProfId) return;
    setLoadingSlots(true);
    getAppointments(selectedProfId, `${dateRange.start}T00:00:00`, `${dateRange.end}T23:59:59`)
      .then(setSlots)
      .finally(() => setLoadingSlots(false));
  }, [selectedProfId, dateRange]);

  async function handleDelete() {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await deleteAppointment(deleteTarget);
      toast('success', 'Agendamento excluido com sucesso!');
      setDeleteTarget(null);
      setViewAppointment(null);
      if (selectedProfId) {
        const updated = await getAppointments(selectedProfId, `${dateRange.start}T00:00:00`, `${dateRange.end}T23:59:59`);
        setSlots(updated);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast('error', msg || 'Erro ao excluir agendamento.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <p className="text-gray-500 text-sm mt-1">Visualize e gerencie os agendamentos</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Profissional</label>
            <select value={selectedProfId ?? ''} onChange={(e) => setSelectedProfId(+e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              {professionals.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">De</label>
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Ate</label>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        </div>
      </div>

      {loadingSlots ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Buscando agendamentos...
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum agendamento encontrado neste periodo.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Horario</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fim</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">{slot.startTime}</td>
                    <td className="px-6 py-4 text-gray-600">{slot.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget !== null && (
        <ConfirmDialog
          title="Excluir agendamento"
          message="Tem certeza que deseja excluir este agendamento? Esta acao nao pode ser desfeita."
          confirmLabel="Excluir"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {viewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setViewAppointment(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Detalhes do Agendamento</h2>
              <button onClick={() => setViewAppointment(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[viewAppointment.status] || 'bg-gray-100 text-gray-500'}`}>
                {STATUS_LABELS[viewAppointment.status] || viewAppointment.status}
              </span>
              <DetailRow icon={<User className="w-4 h-4 text-primary" />} label="Cliente" value={viewAppointment.guestName} />
              <DetailRow icon={<Mail className="w-4 h-4 text-primary" />} label="Email" value={viewAppointment.guestEmail} />
              <DetailRow icon={<Phone className="w-4 h-4 text-primary" />} label="Telefone" value={viewAppointment.guestPhone} />
              <DetailRow icon={<Briefcase className="w-4 h-4 text-primary" />} label="Servico" value={viewAppointment.service.name} />
              <DetailRow icon={<Calendar className="w-4 h-4 text-primary" />} label="Data/Hora" value={new Date(viewAppointment.scheduledAt).toLocaleString('pt-BR')} />
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { setDeleteTarget(viewAppointment.id); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
