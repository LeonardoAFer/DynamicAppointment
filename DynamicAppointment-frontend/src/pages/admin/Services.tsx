import { useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Loader2, Search, Briefcase,
} from 'lucide-react';
import {
  getServices, getProfessionals, createService, updateService, deleteService,
} from '../../services/api';
import type { BusinessService, Professional, BusinessServiceRequest } from '../../types';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

const CATEGORIES = ['HAIR', 'BEARD', 'COMBO', 'GROOMING', 'BATH'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  HAIR: 'Cabelo', BEARD: 'Barba', COMBO: 'Combo', GROOMING: 'Cuidados', BATH: 'Banho',
};
const SERVICE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
const STATUS_LABELS: Record<string, string> = { ACTIVE: 'Ativo', INACTIVE: 'Inativo' };
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700', INACTIVE: 'bg-gray-100 text-gray-500',
};

const emptyForm: BusinessServiceRequest = {
  name: '', description: '', category: 'HAIR', durationMinutes: 30,
  cleanupMinutes: 10, price: 0, status: 'ACTIVE', professionalIds: [],
};

export default function Services() {
  const { toast } = useToast();
  const [services, setServices] = useState<BusinessService[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BusinessServiceRequest>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BusinessService | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [s, p] = await Promise.all([getServices(), getProfessionals()]);
    setServices(s);
    setProfessionals(p);
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError('');
    setShowModal(true);
  }

  function openEdit(s: BusinessService) {
    setEditingId(s.id);
    setForm({
      name: s.name, description: s.description || '', category: s.category,
      durationMinutes: s.durationMinutes, cleanupMinutes: s.cleanupMinutes,
      price: s.price, status: s.status, professionalIds: s.professionals.map((p) => p.id),
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
        await updateService(editingId, form);
        toast('success', 'Servico atualizado com sucesso!');
      } else {
        await createService(form);
        toast('success', 'Servico criado com sucesso!');
      }
      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Erro ao salvar servico.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteService(deleteTarget.id);
      toast('success', 'Servico excluido com sucesso!');
      setDeleteTarget(null);
      await loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast('error', msg || 'Erro ao excluir servico.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function toggleProfessional(id: number) {
    setForm((prev) => ({
      ...prev,
      professionalIds: prev.professionalIds.includes(id)
        ? prev.professionalIds.filter((p) => p !== id)
        : [...prev.professionalIds, id],
    }));
  }

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="text-2xl font-bold text-gray-900">Servicos</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} cadastrados</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-light transition-all cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> Novo Servico
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome..."
          className="w-full sm:w-80 bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum servico encontrado.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                    {CATEGORY_LABELS[s.category] || s.category}
                  </span>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>
              {s.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex gap-3 text-gray-500">
                  <span>{s.durationMinutes} min</span>
                  {s.cleanupMinutes > 0 && <span className="text-gray-300">+{s.cleanupMinutes} limpeza</span>}
                </div>
                <span className="font-bold text-primary">R$ {Number(s.price).toFixed(2)}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(s)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => setDeleteTarget(s)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir servico"
          message={`Tem certeza que deseja excluir "${deleteTarget.name}"? Esta acao nao pode ser desfeita.`}
          confirmLabel="Excluir"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showModal && (
        <Modal title={editingId ? 'Editar Servico' : 'Novo Servico'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Nome">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="form-input" placeholder="Nome do servico" />
            </FormField>
            <FormField label="Descricao">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input min-h-[80px] resize-none" placeholder="Descricao opcional..." />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Categoria">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </FormField>
              <FormField label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-input">
                  {SERVICE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </FormField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Duracao (min)">
                <input type="number" min={1} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })} required className="form-input" />
              </FormField>
              <FormField label="Limpeza (min)">
                <input type="number" min={0} value={form.cleanupMinutes} onChange={(e) => setForm({ ...form, cleanupMinutes: +e.target.value })} className="form-input" />
              </FormField>
              <FormField label="Preco (R$)">
                <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} required className="form-input" />
              </FormField>
            </div>
            {professionals.length > 0 && (
              <FormField label="Profissionais">
                <div className="flex flex-wrap gap-2">
                  {professionals.map((p) => (
                    <button key={p.id} type="button" onClick={() => toggleProfessional(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        form.professionalIds.includes(p.id) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
                      }`}>
                      {p.name}
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
