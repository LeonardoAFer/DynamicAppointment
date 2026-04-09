import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, Star, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <CalendarCheck className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Praticidade e qualidade</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Agende seu
            <span className="text-surface-dark block">horario agora</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Escolha o profissional, o servico e o melhor horario para voce.
            Simples, rapido e sem complicacao.
          </p>
          <Link
            to="/agendar"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-dark transition-all duration-300 no-underline shadow-lg shadow-white/20 hover:shadow-white/40 hover:-translate-y-0.5"
          >
            <CalendarCheck className="w-5 h-5" />
            Agendar Horario
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-primary text-center mb-4">
          Por que nos escolher?
        </h2>
        <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
          Oferecemos a melhor experiencia em agendamento e atendimento
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Clock className="w-7 h-7" />}
            title="Agendamento Online"
            description="Escolha o melhor horario sem precisar ligar. Agende de qualquer lugar, a qualquer momento."
          />
          <FeatureCard
            icon={<Star className="w-7 h-7" />}
            title="Profissionais Qualificados"
            description="Nossa equipe e formada por profissionais experientes e apaixonados pelo que fazem."
          />
          <FeatureCard
            icon={<Briefcase className="w-7 h-7" />}
            title="Servicos Variados"
            description="Diversos servicos disponiveis para voce. Tudo em um so lugar, com praticidade."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary mx-6 md:mx-auto max-w-5xl rounded-2xl p-12 md:p-16 text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Pronto para agendar?
        </h2>
        <p className="text-white/60 mb-8 text-lg">
          Faca seu agendamento agora e garanta seu horario.
        </p>
        <Link
          to="/agendar"
          className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface-dark transition-all no-underline"
        >
          Agendar Agora
        </Link>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
      <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
