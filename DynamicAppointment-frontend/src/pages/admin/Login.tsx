import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { login } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      signin(res.token);
      toast('success', 'Login realizado com sucesso!');
      navigate('/admin');
    } catch {
      setError('Credenciais invalidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(30,136,229,0.2)' }}
          >
            <Lock className="w-8 h-8" style={{ color: '#1e88e5' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#fff' }}>Painel Admin</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Faca login para continuar</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Usuario</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.username || !form.password}
            className="w-full py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1e88e5', color: '#fff' }}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</> : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-sm no-underline" style={{ color: '#6b7280' }}>
            Voltar ao agendamento
          </a>
        </p>
      </div>
    </div>
  );
}
