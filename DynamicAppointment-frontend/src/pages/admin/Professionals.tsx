import { useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Loader2, Search, User,
} from 'lucide-react';
import {
  getProfessionals, getServices, createProfessional, updateProfessional, deleteProfessional,
} from '../../services/api';
import type { Professional, BusinessService, ProfessionalRequest } from '../../types';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUSES = ['ACTIVE', 'INACTIVE', 'ON_VACATION', 'SUSPENDED'] as const;
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  ON_VACATION: 'Ferias',
  SUSPENDED: 'Suspenso',
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
  ON_VACATION: 'bg-amber-50 text-amber-700',
  SUSPENDED: 'bg-red-50 text-red-600',
};

const emptyForm: ProfessionalRequest = {
  name: '', email: '', status: 'ACTIVE', startTime: '08:00', endTime: '18:00', serviceIds: [],
};

export default function Professionals() {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProfessionalRequest>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Professional | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [p, s] = await Promise.all([getProfessionals(), getServices()]);
    setProfessionals(p);
    setServices(s);
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError('');
    setShowModal(true);
  }

  function openEdit(p: Professional) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      email: p.email,
      status: p.status,
      startTime: p.startTime?.slice(0, 5) || '08:00',
      endTime: p.endTime?.slice(0, 5) || '18:00',
      serviceIds: p.services.map((s) => s.id),
    });
    setFormError('');
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await updateProfessional(editingId, form);
        toast('success', 'Profissional atualizado com sucesso!');
      } else {
        await createProfessional(form);
        toast('success', 'Profissional criado com sucesso!');
      }
      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Erro ao salvar profissional.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProfessional(deleteTarget.id);
      toast('success', 'Profissional excluido com sucesso!');
      setDeleteTarget(null);
      await loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast('error', msg || 'Erro ao excluir profissional.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function toggleService(id: number) {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id],
    }));
  }

  const filtered = professionals.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
          <p className="text-gray-500 text-sm mt-1">{professionals.length} cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-light transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Profissional
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full sm:w-80 bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum profissional encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Profissional</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Horario</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400 md:hidden">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{p.email}</td>
                    <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">
                      {p.startTime?.slice(0, 5)} - {p.endTime?.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_LABELS[p.status] || p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir profissional"
          message={`Tem certeza que deseja excluir "${deleteTarget.name}"? Esta acao nao pode ser desfeita.`}
          confirmLabel="Excluir"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showModal && (
        <Modal title={editingId ? 'Editar Profissional' : 'Novo Profissional'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Nome">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="form-input" placeholder="Nome do profissional" />
            </FormField>
            <FormField label="Email">
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="form-input" placeholder="email@exemplo.com" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Inicio">
                <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="form-input" />
              </FormField>
              <FormField label="Fim">
                <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required className="form-input" />
              </FormField>
            </div>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-input">
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </FormField>
            {services.length > 0 && (
              <FormField label="Servicos">
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <button
                      key={s.id} type="button" onClick={() => toggleService(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        form.serviceIds.includes(s.id) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </FormField>
            )}
            {formError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{formError}</div>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">Cancelar</button>
              <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-light disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
