import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  FileText,
  Fingerprint,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Mountain,
  Route,
  Smartphone,
  Sprout,
  Users,
} from 'lucide-react';

const logoSrc = '/brand/atc-logo-official.png';
const appIconSrc = '/brand/atc-app-icon-official.png';

const navLinks = [
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Dores do campo', href: '#dores' },
  { label: 'Fluxo', href: '#fluxo' },
  { label: 'Módulos', href: '#modulos' },
  { label: 'Produto', href: '#produto' },
];

const portabilityPillars = [
  {
    icon: Fingerprint,
    eyebrow: '§ 01',
    title: 'A carteira é sua.',
    body:
      'Cada produtor cadastrado, cada visita registrada e cada anotação técnica fica sob o seu nome — não no servidor de uma empresa que pode bloquear o acesso amanhã.',
  },
  {
    icon: Briefcase,
    eyebrow: '§ 02',
    title: 'O histórico te acompanha.',
    body:
      'Mudou de revenda, cooperativa, região ou de companhia? O relacionamento construído com cada produtor continua na sua mão. Sem perder visitas, fotos ou follow-ups.',
  },
  {
    icon: Smartphone,
    eyebrow: '§ 03',
    title: 'Base portátil no campo.',
    body:
      'O ATC vive no celular do representante. Sem terminal corporativo, sem caderno esquecido na gaveta, sem planilha que ninguém lê depois do final do mês.',
  },
];

const pains = [
  {
    icon: ClipboardList,
    title: 'Anotações soltas',
    body:
      'Cadernos de campo, papéis avulsos e fotos no rolo do celular, sem ligação com o cliente. No final do dia, ninguém recupera o que foi dito na lavoura.',
  },
  {
    icon: AlertTriangle,
    title: 'Follow-ups perdidos',
    body:
      'A promessa de voltar com uma recomendação desaparece na agenda. O produtor cobra antes do representante lembrar de retomar a conversa.',
  },
  {
    icon: CalendarDays,
    title: 'Agenda dispersa',
    body:
      'Visitas em um app, lembretes em outro, rota improvisada na estrada. A semana acaba sem clareza do que rendeu de fato.',
  },
  {
    icon: Compass,
    title: 'Pouca visão de carteira',
    body:
      'É difícil enxergar quem está sem visita há tempo, qual fazenda exige prioridade e onde a próxima janela de safra vai apertar.',
  },
];

const flowSteps = [
  {
    icon: Route,
    title: 'Planejar a rota',
    body: 'Antes de sair, o representante revê a carteira, identifica clientes em atraso e organiza a sequência de visitas do dia.',
  },
  {
    icon: Users,
    title: 'Visitar o cliente',
    body: 'Em campo, abre o histórico do produtor, das fazendas e das culturas em acompanhamento para entrar preparado na conversa.',
  },
  {
    icon: ClipboardCheck,
    title: 'Registrar evidências',
    body: 'Anota observações técnicas, anexa fotos da lavoura e marca a visita como concluída — tudo amarrado ao cliente certo.',
  },
  {
    icon: CalendarDays,
    title: 'Agendar próxima ação',
    body: 'Cria o follow-up imediatamente: nova visita, retorno técnico ou tarefa de acompanhamento, com data definida.',
  },
  {
    icon: FileText,
    title: 'Gerar relatório',
    body: 'Exporta o relatório de visita ou o panorama da carteira para apresentar ao gestor e ao próprio produtor.',
  },
];

const modules = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    body: 'KPIs da operação, agenda do dia, alertas de carteira e atalhos para as ações mais comuns do representante.',
  },
  {
    icon: Users,
    title: 'Clientes',
    body: 'Cadastro completo do produtor, com contato, observações de relacionamento e linha do tempo de visitas.',
  },
  {
    icon: Mountain,
    title: 'Fazendas',
    body: 'Cada propriedade vinculada ao cliente, com área, localização e cultivos em acompanhamento.',
  },
  {
    icon: ClipboardCheck,
    title: 'Visitas',
    body: 'Registro estruturado de cada ida ao campo, com anotações, anexos e status de conclusão.',
  },
  {
    icon: CalendarDays,
    title: 'Agenda',
    body: 'Visão semanal e mensal de visitas e follow-ups, com foco no que precisa acontecer hoje.',
  },
  {
    icon: Bell,
    title: 'Alertas',
    body: 'Avisos de clientes sem visita recente, follow-ups pendentes e tarefas que pedem atenção.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    body: 'Atalho direto para falar com o produtor a partir do cadastro, sem perder tempo digitando contato.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios',
    body: 'Relatório de visita e panorama de carteira prontos para exportar e compartilhar com a gestão.',
  },
];

const heroSignals = [
  { label: 'Sua carteira', value: '128 produtores ativos' },
  { label: 'Sua semana', value: '12 visitas planejadas' },
  { label: 'Seu retorno', value: '4 follow-ups hoje' },
];

const portfolioRows = [
  { name: 'Fazenda São Lourenço', owner: 'Marcos Andrade', status: 'Visita hoje', state: 'on' },
  { name: 'Sítio Boa Vista', owner: 'Ana Reis', status: 'Em atraso · 18 dias', state: 'late' },
  { name: 'Agropecuária Três Rios', owner: 'Helena Castro', status: 'Follow-up amanhã', state: 'soon' },
  { name: 'Fazenda Capão Alto', owner: 'João Pereira', status: 'OK · visita há 6 dias', state: 'ok' },
];

const agendaItems = [
  { time: '07h30', title: 'Fazenda São Lourenço', detail: 'Soja · monitoramento de pragas', tone: 'primary' },
  { time: '10h15', title: 'Sítio Boa Vista', detail: 'Retorno técnico · adubação', tone: 'accent' },
  { time: '14h00', title: 'Agropecuária Três Rios', detail: 'Apresentação de proposta', tone: 'neutral' },
];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#111111]">
      <SiteHeader />
      <main>
        <HeroSection />
        <PortabilitySection />
        <PainsSection />
        <FlowSection />
        <ModulesSection />
        <ProductSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1E3A2F]/12 bg-[#F8F9F7]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/site" className="inline-flex items-center" aria-label="ATC CRM">
          <img src={logoSrc} alt="ATC CRM" className="h-10 w-auto max-w-[10rem] object-contain sm:h-12" />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Seções da página">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#1E3A2F]/70 transition-colors hover:text-[#1E3A2F]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#1E3A2F] underline-offset-4 hover:underline sm:inline"
          >
            Entrar no painel
          </Link>
          <Link
            to="/signup"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#1E3A2F] px-4 text-[0.7rem] font-black uppercase tracking-[0.18em] text-white shadow-[0_1px_0_rgba(17,17,17,0.12)] transition-colors hover:bg-[#2d6a4f] sm:px-5"
          >
            Criar carteira
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#C8A951]/25 bg-[#1E3A2F] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(135deg,rgba(248,249,247,.4)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute -top-40 right-[-6rem] h-96 w-96 rounded-full border border-[#C8A951]/25" />
      <div className="pointer-events-none absolute -bottom-44 -left-24 h-[28rem] w-[28rem] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1 bg-gradient-to-b from-[#C8A951] via-[#C8A951]/30 to-transparent lg:block" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/40 bg-white/5 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.24em] text-[#C8A951]">
              <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
              Assistente Técnico do Campo
            </span>
            <span className="hidden text-[0.6rem] font-black uppercase tracking-[0.24em] text-white/45 sm:inline">
              CRM field-first · para RTV, AT e consultor
            </span>
          </div>

          <h1 className="mt-7 text-[2.4rem] font-black uppercase leading-[0.95] tracking-[0.005em] sm:text-5xl lg:text-[3.85rem]">
            Sua carteira de campo.
            <br />
            <span className="text-[#C8A951]">Seus dados.</span>
            <br />
            Seu próximo movimento.
          </h1>

          <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/80 sm:text-lg">
            ATC CRM é a base portátil de relacionamento de quem trabalha o campo. Carteira, fazendas, visitas, fotos e
            follow-ups pertencem ao representante — e seguem com ele para onde a operação for.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#C8A951] px-6 text-xs font-black uppercase tracking-[0.2em] text-[#1E3A2F] shadow-[0_1px_0_rgba(17,17,17,0.2)] transition-colors hover:bg-[#d8bd6d]"
            >
              Começar minha carteira
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#fluxo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-white/30 px-6 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-[#C8A951] hover:text-[#C8A951]"
            >
              Ver fluxo de campo
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/15 bg-white/10 sm:grid-cols-3">
            {heroSignals.map((item) => (
              <div key={item.label} className="bg-[#1E3A2F] px-4 py-4">
                <dt className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#C8A951]/85">{item.label}</dt>
                <dd className="mt-2 text-sm font-bold leading-snug text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 -translate-x-3 translate-y-6 rounded-[1.75rem] border border-[#C8A951]/35 bg-[#C8A951]/10"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#F8F9F7] text-[#111111] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-[#1E3A2F]/10 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={appIconSrc} alt="" aria-hidden="true" className="h-9 w-9 rounded-xl object-contain" />
            <div>
              <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#1E3A2F]/55">
                Painel · Field log
              </p>
              <p className="text-sm font-black uppercase tracking-[0.04em] text-[#1E3A2F]">Quarta · 13 mai 2026</p>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-[#2E7D32]/30 bg-[#2E7D32]/10 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#2E7D32] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" aria-hidden="true" />
            Em rota
          </span>
        </div>

        <div className="grid gap-px bg-[#1E3A2F]/10 sm:grid-cols-3">
          {[
            { label: 'Visitas hoje', value: '04', tone: 'primary' as const },
            { label: 'Follow-ups', value: '02', tone: 'accent' as const },
            { label: 'Alertas', value: '03', tone: 'warn' as const },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white px-5 py-4">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#1E3A2F]/55">{kpi.label}</p>
              <p
                className={classNames(
                  'mt-2 text-3xl font-black leading-none tracking-tight',
                  kpi.tone === 'primary' && 'text-[#1E3A2F]',
                  kpi.tone === 'accent' && 'text-[#9A7E2B]',
                  kpi.tone === 'warn' && 'text-[#C2410C]',
                )}
              >
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1E3A2F]/10 bg-[#F8F9F7] px-5 py-5">
          <div className="flex items-center justify-between">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#1E3A2F]/55">Agenda do dia</p>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#1E3A2F]/35">−15.78° / −47.93°</p>
          </div>
          <ul className="mt-3 space-y-2">
            {agendaItems.map((item) => (
              <li
                key={item.time}
                className="flex items-center gap-3 rounded-lg border border-[#1E3A2F]/10 bg-white px-3 py-3"
              >
                <span
                  className={classNames(
                    'inline-flex h-10 w-12 shrink-0 items-center justify-center rounded-md text-[0.65rem] font-black uppercase tracking-[0.12em]',
                    item.tone === 'primary' && 'bg-[#1E3A2F] text-white',
                    item.tone === 'accent' && 'bg-[#C8A951]/20 text-[#9A7E2B]',
                    item.tone === 'neutral' && 'bg-[#1E3A2F]/10 text-[#1E3A2F]',
                  )}
                >
                  {item.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#1E3A2F]">{item.title}</p>
                  <p className="truncate text-xs font-medium text-[#1E3A2F]/60">{item.detail}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#1E3A2F]/40" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PortabilitySection() {
  return (
    <section id="manifesto" className="relative border-b border-[#1E3A2F]/10 bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A951]/60 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#9A7E2B]">Manifesto · Field-first</p>
            <h2 className="mt-4 text-3xl font-black uppercase leading-[1.04] tracking-[0.005em] text-[#1E3A2F] sm:text-[2.6rem]">
              Os dados acompanham o representante.
            </h2>
            <p className="mt-5 max-w-md text-base font-medium leading-7 text-[#1E3A2F]/75">
              O ATC CRM nasceu de uma regra simples: o relacionamento com o produtor é construído por quem está no
              campo. Logo, ele pertence a quem está no campo.
            </p>
            <p className="mt-4 max-w-md text-base font-medium leading-7 text-[#1E3A2F]/75">
              Aqui, a ferramenta é do representante. A empresa não segura. A planilha não substitui. E a saída de uma
              companhia não apaga anos de operação.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 border-l-2 border-[#C8A951] pl-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1E3A2F]">
                Base portátil · Decisão rápida · Execução no campo
              </p>
            </div>
          </div>

          <ol className="relative border-l-2 border-[#1E3A2F]/10 pl-6 sm:pl-8">
            {portabilityPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li key={pillar.eyebrow} className="relative pb-10 last:pb-0">
                  <span
                    className="absolute -left-[1.85rem] top-1 inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#1E3A2F] bg-[#1E3A2F] text-[#C8A951] shadow-[0_4px_18px_-10px_rgba(15,23,42,0.45)] sm:-left-[2.35rem]"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#9A7E2B]">
                    {pillar.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-black uppercase leading-snug tracking-[0.01em] text-[#1E3A2F] sm:text-2xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#1E3A2F]/72 sm:text-base">
                    {pillar.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PainsSection() {
  return (
    <section id="dores" className="border-b border-[#1E3A2F]/10 bg-[#F8F9F7]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="max-w-3xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#9A7E2B]">Por que existe o ATC</p>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[0.005em] text-[#1E3A2F] sm:text-4xl">
            O campo cobra resposta rápida.
            <br className="hidden sm:inline" />
            A ferramenta precisa acompanhar o passo.
          </h2>
          <p className="mt-5 text-base font-medium leading-7 text-[#1E3A2F]/75">
            A rotina do representante técnico não cabe em planilha. Sem um instrumento próprio, informação valiosa fica
            espalhada — e a relação com o produtor sofre antes de qualquer indicador comercial.
          </p>
        </header>

        <ul className="mt-12 divide-y divide-[#1E3A2F]/15 border-y border-[#1E3A2F]/15 bg-white">
          {pains.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <li key={pain.title} className="grid gap-4 px-5 py-7 sm:grid-cols-[auto_1fr_2fr] sm:items-start sm:gap-8 sm:px-8">
                <div className="flex items-center gap-4">
                  <span className="font-black text-[2.6rem] leading-none tracking-tight text-[#1E3A2F]/15 sm:text-5xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#1E3A2F] text-[#C8A951] sm:hidden">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="hidden sm:flex sm:items-start sm:gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#1E3A2F] text-[#C8A951]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-black uppercase leading-snug tracking-[0.04em] text-[#1E3A2F] sm:text-lg">
                    {pain.title}
                  </h3>
                </div>
                <div className="sm:pt-1">
                  <h3 className="text-base font-black uppercase tracking-[0.04em] text-[#1E3A2F] sm:hidden">
                    {pain.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#1E3A2F]/72 sm:mt-0 sm:text-[0.95rem] sm:leading-7">
                    {pain.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FlowSection() {
  return (
    <section id="fluxo" className="relative overflow-hidden border-b border-[#C8A951]/25 bg-[#1E3A2F] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(135deg,rgba(248,249,247,.4)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="max-w-3xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#C8A951]">Fluxo de campo</p>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[0.005em] sm:text-4xl">
            Da rota da manhã ao relatório do fim do dia.
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/80">
            Cinco passos contínuos, desenhados em torno da operação real do representante. Sem etapas decorativas, sem
            preenchimento à toa.
          </p>
        </header>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/15 bg-white/10 lg:grid-cols-5">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative flex h-full flex-col bg-[#1E3A2F] p-6 sm:p-7">
                <span className="absolute left-0 top-0 h-1 w-12 bg-[#C8A951]" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C8A951]/40 bg-white/5 text-[#C8A951]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-[0.6rem] font-black uppercase tracking-[0.24em] text-white/45">
                    Passo · {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 text-base font-black uppercase leading-snug tracking-[0.04em] text-white sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/75">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section id="modulos" className="border-b border-[#1E3A2F]/10 bg-[#F8F9F7]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="max-w-3xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#9A7E2B]">Módulos do ATC</p>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[0.005em] text-[#1E3A2F] sm:text-4xl">
            Tudo o que o representante usa todos os dias — em um só app.
          </h2>
          <p className="mt-5 text-base font-medium leading-7 text-[#1E3A2F]/75">
            Cada módulo cobre uma parte concreta da rotina técnico-comercial. Sem distrações, sem caminhos paralelos,
            sem feature que não conversa com a próxima visita.
          </p>
        </header>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-[#1E3A2F]/15 bg-[#1E3A2F]/15 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <article key={mod.title} className="relative flex h-full flex-col bg-white p-6 transition-colors hover:bg-[#F8F9F7]">
                <span className="absolute left-0 top-0 h-1 w-10 bg-[#C8A951]" aria-hidden="true" />
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#1E3A2F] text-[#C8A951]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-black uppercase tracking-[0.04em] text-[#1E3A2F]">{mod.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#1E3A2F]/70">{mod.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section id="produto" className="border-b border-[#1E3A2F]/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="max-w-3xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#9A7E2B]">Por dentro do app</p>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[0.005em] text-[#1E3A2F] sm:text-4xl">
            Visão de carteira e registro de visita, lado a lado.
          </h2>
          <p className="mt-5 text-base font-medium leading-7 text-[#1E3A2F]/75">
            Telas ilustrativas, com dados de exemplo, para mostrar como o ATC organiza a carteira de produtores e o
            registro de cada ida ao campo.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PortfolioMockup />
          <VisitMockup />
        </div>
      </div>
    </section>
  );
}

function PortfolioMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1E3A2F]/12 bg-[#F8F9F7] shadow-[0_30px_80px_-50px_rgba(15,23,42,0.55)]">
      <div className="flex items-center justify-between border-b border-[#1E3A2F]/10 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#C8A951]" aria-hidden="true" />
          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#1E3A2F]/55">Carteira · ATC #00248</p>
            <p className="text-sm font-black uppercase tracking-[0.04em] text-[#1E3A2F]">Produtores ativos</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#1E3A2F]/15 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#1E3A2F]/70">
          128 clientes
        </span>
      </div>

      <ul className="divide-y divide-[#1E3A2F]/10">
        {portfolioRows.map((row) => (
          <li key={row.name} className="flex items-center gap-4 px-5 py-4">
            <span
              className={classNames(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
                row.state === 'on' && 'bg-[#1E3A2F] text-[#C8A951]',
                row.state === 'late' && 'bg-[#C2410C]/12 text-[#C2410C]',
                row.state === 'soon' && 'bg-[#C8A951]/20 text-[#9A7E2B]',
                row.state === 'ok' && 'bg-[#2E7D32]/12 text-[#2E7D32]',
              )}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1E3A2F]">{row.name}</p>
              <p className="truncate text-xs font-medium text-[#1E3A2F]/60">{row.owner}</p>
            </div>
            <span
              className={classNames(
                'inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.16em]',
                row.state === 'on' && 'border-[#1E3A2F]/30 bg-[#1E3A2F]/8 text-[#1E3A2F]',
                row.state === 'late' && 'border-[#C2410C]/30 bg-[#C2410C]/10 text-[#C2410C]',
                row.state === 'soon' && 'border-[#9A7E2B]/30 bg-[#C8A951]/10 text-[#9A7E2B]',
                row.state === 'ok' && 'border-[#2E7D32]/30 bg-[#2E7D32]/10 text-[#2E7D32]',
              )}
            >
              {row.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VisitMockup() {
  const fields = [
    { label: 'Cliente', value: 'Marcos Andrade' },
    { label: 'Fazenda', value: 'São Lourenço · Talhão 04' },
    { label: 'Cultura', value: 'Soja · estádio R3' },
  ];

  const checklist = [
    'Monitoramento de percevejo concluído',
    'Recomendação de fungicida registrada',
    'Foto da bordadura anexada ao registro',
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1E3A2F]/30 bg-[#1E3A2F] text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.65)]">
      <span className="absolute left-0 top-0 h-1 w-20 bg-[#C8A951]" aria-hidden="true" />
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/55">Visita · Field log #00248</p>
          <p className="text-sm font-black uppercase tracking-[0.04em] text-white">Registro em campo</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/40 bg-[#C8A951]/10 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.22em] text-[#C8A951]">
          Concluída
        </span>
      </div>

      <dl className="divide-y divide-white/10">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/55">{field.label}</dt>
            <dd className="truncate text-sm font-bold text-white">{field.value}</dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-white/10 px-5 py-5">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/55">Checklist da visita</p>
        <ul className="mt-3 space-y-2">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A951]" aria-hidden="true" />
              <span className="text-sm font-medium leading-6 text-white/85">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/5 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/55">Próxima ação</p>
          <p className="truncate text-sm font-bold text-white">Retorno técnico em 7 dias</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#C8A951] px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#1E3A2F]">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Agendado
        </span>
      </div>
    </div>
  );
}

function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#1E3A2F] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(135deg,rgba(248,249,247,.38)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full border border-[#C8A951]/30" />
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1 bg-gradient-to-b from-[#C8A951] via-[#C8A951]/30 to-transparent lg:block" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#C8A951]">Pronto para campo</p>
          <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[0.005em] sm:text-[2.6rem]">
            Comece hoje a operar a sua carteira pelo ATC CRM.
          </h2>
          <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/80">
            Crie sua conta e teste o fluxo completo: cadastre produtores, abra fazendas, registre visitas, organize a
            agenda do dia e mantenha o histórico sob o seu controle.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
          <Link
            to="/signup"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#C8A951] px-6 text-xs font-black uppercase tracking-[0.2em] text-[#1E3A2F] shadow-[0_1px_0_rgba(17,17,17,0.2)] transition-colors hover:bg-[#d8bd6d]"
          >
            Começar minha carteira
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/login"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-white/30 px-6 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-[#C8A951] hover:text-[#C8A951]"
          >
            Entrar no painel
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[#1E3A2F]/10 bg-[#F8F9F7]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <img src={appIconSrc} alt="" aria-hidden="true" className="h-10 w-10 rounded-xl object-contain" />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.04em] text-[#1E3A2F]">ATC CRM</p>
            <p className="text-xs font-medium text-[#1E3A2F]/65">Assistente Técnico do Campo</p>
          </div>
        </div>
        <p className="max-w-md text-xs font-medium leading-5 text-[#1E3A2F]/60 sm:text-right">
          Base portátil de relacionamento de quem trabalha o campo.
          <br />
          © {new Date().getFullYear()} ATC CRM · Todos os direitos do representante reservados.
        </p>
      </div>
    </footer>
  );
}
