import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, CalendarDays, ArrowRight, Loader2 } from 'lucide-react';
import { getProfessionals, getServices } from '../../services/api';

export default function Dashboard() {
  const [profCount, setProfCount] = useState<number | null>(null);
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfessionals(), getServices()])
      .then(([profs, svcs]) => {
        setProfCount(profs.length);
        setServiceCount(svcs.length);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando...
      </div>
    );
  }

  const cards = [
    {
      label: 'Profissionais',
      count: profCount ?? 0,
      icon: Users,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      link: '/admin/profissionais',
    },
    {
      label: 'Servicos',
      count: serviceCount ?? 0,
      icon: Briefcase,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      link: '/admin/servicos',
    },
    {
      label: 'Agendamentos',
      count: null,
      icon: CalendarDays,
      color: 'bg-violet-500',
      bg: 'bg-violet-50',
      link: '/admin/agendamentos',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visao geral do sistema</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all no-underline group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${c.bg} p-3 rounded-xl`}>
                <c.icon className={`w-5 h-5 ${c.color.replace('bg-', 'text-')}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
            </div>
            {c.count !== null ? (
              <p className="text-3xl font-bold text-gray-900">{c.count}</p>
            ) : (
              <p className="text-3xl font-bold text-gray-900">—</p>
            )}
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
