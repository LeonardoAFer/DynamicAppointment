import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 font-sans bg-gray-900"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(30,136,229,0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(66,165,245,0.08), transparent 70%)',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.22em]">
            Admin Panel
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-white/5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] p-8 sm:p-10">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Acesse o painel para gerenciar seu negocio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-11 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="group w-full bg-primary text-white py-2.5 mt-2 rounded-xl font-semibold text-sm hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_14px_-2px_rgba(30,136,229,0.5)] hover:shadow-[0_8px_20px_-2px_rgba(30,136,229,0.6)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Entrando
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-300 transition-colors no-underline"
          >
            &larr; Voltar ao agendamento
          </a>
        </p>
      </div>
    </div>
  );
}
