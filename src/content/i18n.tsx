import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as en from "./site";
import * as pt from "./site.pt";

export type Lang = "en" | "pt";

const STORAGE_KEY = "site-lang";

/** Localized content bundle — same shape for both languages. */
function bundle(lang: Lang) {
  const isPt = lang === "pt";
  return {
    bio: isPt ? pt.bioPt : en.bio,
    recognition: isPt ? pt.recognitionPt : en.recognition,
    festival: isPt ? pt.festivalPt : en.festival,
    certification: isPt ? pt.certificationPt : en.certification,
    metrics: isPt ? pt.metricsPt : en.metrics,
    focusAreas: isPt ? pt.focusAreasPt : en.focusAreas,
    career: isPt ? pt.careerPt : en.career,
    caseStudies: isPt ? pt.caseStudiesPt : en.caseStudies,
    offerings: isPt ? pt.offeringsPt : en.offerings,
    testimonials: isPt ? pt.testimonialsPt : en.testimonials,
    partnerSteps: isPt ? pt.partnerStepsPt : en.partnerSteps,
    education: isPt ? pt.educationPt : en.education,
  };
}

const uiEn = {
  nav: {
    home: "Home",
    about: "About",
    career: "Career Path",
    caseStudies: "Case Studies",
    work: "Selected work",
    reviews: "Reviews",
    services: "Services",
    partnership: "GrowthMentor",
    partner: "Get to know my services",
    book: "Book",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    location: "Rio de Janeiro, Brazil · PT / EN fluent · ES advanced",
  },
  legal: {
    notice:
      "Sessions happen only where there is no conflict of interest and no breach of an active NDA with my current partners. Both parties keep shared information confidential and act in good faith. If any incompatibility is found, the session will not take place and payment will be refunded in full via Stripe.",
  },
  home: {
    eyebrow: "Rio de Janeiro · LATAM-based · works globally",
    h1a: "I turn data and ambiguity into ",
    h1b: "business outcomes",
    intro:
      "10+ years across SaaS, fintech, food tech, streaming, and marketplaces — with Netflix, Google, iFood, Bradesco Next, and global consulting environments. I work with product people and founders through mentoring, focused working sessions, and strategic advisory.",
    ctaPartner: "Book a session",
    ctaViewServices: "View services",
    ctaBook: "See selected work",
    leadWith: "What I do best",
    aiBadge: "AI & LLMs in daily product work",
    recognitionEyebrow: "Nomination",
    speakingEyebrow: "Speaking",
    seeEvent: "Event details →",
    metricsEyebrow: "By the numbers",
    seeLinkedIn: "See on LinkedIn →",
    offeringsEyebrow: "Ways to work together",
    offeringsTitle: "Choose the support that fits your challenge",
    fullDetails: "Full details →",
    workEyebrow: "Selected work",
    workLinkedIn: "Follow me on LinkedIn →",
    workTitle: "Outcomes, not slideware",
    workSubtitle: "Curated case studies for you — 2017 to now:",
    workReveal: "View outcome",
    workReturn: "Back to brand",
    menteesEyebrow: "Mentees",
    menteesTitle: "What mentees say",
    growthmentorLink: "4.95/5 on GrowthMentor →",
    adplistLink: "20+ reviews on ADPList →",
    ctaTitle: "Need clarity on a product or business challenge?",
    ctaBody: "Choose a focused session or request strategic advisory — direct, data-driven, and human.",
    ctaStart: "How to partner",
    portraitAlt: "Rhaissa “Ray” V. speaking at Rio Innovation Week",
  },
  mentoring: {
    eyebrow: "Product Management Mentoring",
    title: "Turn product chaos into a clear next move",
    lead: "1:1 mentoring for PMs, founders, and leaders navigating prioritization, stakeholder pressure, strategy, and career transitions. Direct, data-driven, and practical.",
    audienceTitle: "Who it's for",
    audience: [
      "PMs moving from execution to strategy",
      "Founders who need product signal without the noise",
      "Leaders scaling teams across multicultural contexts",
      "Anyone preparing for a career leap or interview loop",
    ],
    topicsTitle: "Typical themes",
    topics: [
      "Influencing without authority",
      "Roadmap clarity and prioritization",
      "Data products, experimentation, and metrics",
      "Executive communication and narrative",
      "AI-assisted product work",
      "Cross-functional leadership",
    ],
    proofTitle: "What mentees say",
    ctaTitle: "Book a mentoring session",
    ctaBody: "35 USD · 60 min · choose your slot and pay to confirm.",
  },
  about: {
    eyebrow: "About me",
    title: "Hi! I’m Rhaissa “Ray” (she/her)",
    lead: "Product leader, mentor and advisor. 10+ years turning messy data into decisions teams can act on.",
    industriesEyebrow: "Where I’ve played",
    industries: [
      "B2B SaaS",
      "Marketplace",
      "Fintech",
      "Streaming",
      "Data Products",
      "Platform scale",
      "Growth & PLG",
      "PMM & GTM",
    ],
    pillarsEyebrow: "In short",
    pillars: [
      { title: "Cross-functional by default", body: "Product, Engineering, Data, Growth and Ops — B2B, B2C and marketplace." },
      { title: "AI in daily practice", body: "Claude & ChatGPT for discovery, prioritization and decisions. Multi-agent WhatsApp POC." },
      { title: "Leader and hands-on IC", body: "I like being on both sides of the table." },
    ],
    mentorEyebrow: "Mentoring",
    mentorStats: [
      { value: "4.95/5", label: "Advisor rating · GrowthMentor" },
      { value: "2,600+", label: "minutes on ADPList" },
      { value: "75+", label: "sessions delivered" },
    ],
    mentorA: "Also mentoring with ",
    mentorB: "",
    placeEyebrow: "Where I am",
    place: [
      { label: "Based in", value: "Rio de Janeiro, Brazil" },
      { label: "Languages", value: "PT · EN fluent · ES advanced" },
      { label: "Worked in", value: "Brazil · Colombia · Mexico · US" },
    ],
    edge: "Leadership edge",
    howEyebrow: "How I work",
    how: [
      "Minimalist: fewer bets, better instrumented.",
      "Direct: the decision comes before the narrative.",
      "Human: teams ship, frameworks don’t.",
      "Multicultural: LATAM, UK and US contexts.",
    ],
  },

  career: {
    eyebrow: "Career path",
    title: "Different roles, one problem",
    lead: "Different companies, same tension: teams swimming in signal but short on clarity. From fintech onboarding to marketplace churn, platform launches to B2B SaaS 0→1, I've usually been called in when the data is messy, the stakeholders are many, and the decision can't wait.",
    education: "Education & certifications",
  },
  cases: {
    eyebrow: "Case studies",
    title: "Accomplishments along the way",
    lead: "A shortlist of problems I’ve owned end to end, with the metric that changed. Happy to go deeper on any of them on a call.",
  },
  partner: {
    eyebrow: "Book a session",
    title: "Pick the theme that fits your problem",
    lead: "Every meeting is a 60-minute working session, typically held after business hours based on availability. Pick a calendar slot, then pay to secure it — unpaid slots are released.",
    mostRequested: "Most requested",
    bookTime: "Book",
    pay: "Pay",
    processEyebrow: "The process",
    processTitle: "How it works",

    talkTitle: "No agenda right now and want to talk?",
    talkBody:
      "Message me on LinkedIn with the problem in one paragraph. If I’m not the right person, I’ll tell you who is.",
    talkCta: "Message on LinkedIn",
    newTab: "opens in a new tab",
  },
  partnership: {
    name: "Tailored Advisory",
    duration: "A few hours a week · companies & founders",
    priceLabel: "Custom scope",
    priceNote: "",
    unavailable: "Currently unavailable",
    unavailableNote: "Paused due to current capacity throughout EOY",
    equityNote: "",
    summary:
      "Support beyond one session: business and product strategy, stronger decisions, and execution. Light-touch by design: a few hours a week.",
    includes: [
      "A few hours a week",
      "Business and product strategy & execution",
      "Executive alignment and decision support",
    ],
    cta: "Submit request",
    sending: "Sending…",
    pageEyebrow: "Advisory",
    pageTitle: "Advisory shaped around your business",
    includesTitle: "What advisory can include",
    formTitle: "Tell me about your business challenge",

    formLead: "Share a few details about your goals, current challenges, and the support you need. I’ll reply with a proposed scope and available capacity.",
    yourDetails: "Your details",
    fieldName: "Full name*",
    fieldEmail: "Email*",
    fieldMessage: "How can I help you?*",
    formNote: "All fields are required. I usually reply within two business days.",
    successTitle: "Request sent",
    successBody: "Thanks — I will get back to you shortly.",
    errorTitle: "Something went wrong",
    errorBody: "Please try again, or message me on LinkedIn.",
  },

  booked: {
    eyebrow: "Session links",
    title: "Book the time, then pay to secure it",
    lead: "Choosing a calendar slot starts the booking — payment on Stripe is what confirms it. Unpaid slots are released.",
    steps: [
      {
        title: "Pick the theme",
        body: "Choose the session card that best matches your problem or message me if it is unclear.",
      },
      {
        title: "Book the time",
        body: "Choose any open time on my calendar and add the problem context in the notes.",
      },
      {
        title: "Pay to secure it",
        body: "The slot is only confirmed once payment goes through on Stripe.",
      },
    ],
    step: "Step",
    ctaTitle: "Book first, then secure with payment",
    ctaBody:
      "Pick a time on the calendar, then complete the payment to secure the booking. Both links open in a new tab.",
    openCalendar: "Open the calendar",
    pay: "Pay to secure",
    helpA: "Need to clarify the right session theme before booking or paying? ",
    helpLinkedIn: "Message me on LinkedIn",
    helpB: " or head back to ",
    helpOfferings: "the offerings",
  },
};

type Ui = typeof uiEn;

const uiPt: Ui = {
  nav: {
    home: "Início",
    about: "Sobre",
    career: "Trajetória",
    caseStudies: "Cases",
    work: "Trabalhos",
    reviews: "Depoimentos",
    services: "Serviços",
    partnership: "GrowthMentor",
    partner: "Conheça meus serviços",
    book: "Agendar",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
  footer: {
    location: "Rio de Janeiro, Brasil · PT / EN fluentes · ES avançado",
  },
  legal: {
    notice:
      "As sessões só serão confirmadas se não houver conflito de interesses nem descumprimento de NDA vigente com meus parceiros atuais. Ambas as partes se comprometem a manter sigilo e boa-fé sobre as informações compartilhadas. Constatada qualquer incompatibilidade, a sessão não será realizada e o valor pago será reembolsado integralmente via Stripe.",
  },
  home: {
    eyebrow: "Rio de Janeiro · remoto da LATAM · atuação global",
    h1a: "Transformo dados\ne ambiguidade",
    h1b: "em resultados\nde negócio",
    intro:
      "10+ anos em SaaS, fintech, food tech, streaming e marketplaces — com Netflix, Google, iFood, Bradesco Next e ambientes globais de consultoria. Trabalho com profissionais de produto e founders por meio de mentoria, sessões práticas e advisory estratégico.",
    ctaPartner: "Agendar sessão",
    ctaViewServices: "Ver serviços",
    ctaBook: "Ver trabalhos selecionados",
    leadWith: "O que faço de melhor",
    aiBadge: "IA e LLMs no trabalho de produto do dia a dia",
    recognitionEyebrow: "Nomeação",
    speakingEyebrow: "No palco",
    seeEvent: "Detalhes do evento →",
    metricsEyebrow: "Os números",
    seeLinkedIn: "Ver no LinkedIn →",
    offeringsEyebrow: "Formas de trabalhar comigo",
    offeringsTitle: "Escolha o modelo ideal para o seu desafio",
    fullDetails: "Ver detalhes →",
    workEyebrow: "Trabalhos selecionados",
    workLinkedIn: "Me siga no LinkedIn →",
    workTitle: "Resultados, não slides",
    workSubtitle: "Cases selecionados para você — 2017 até hoje:",
    workReveal: "Ver resultado",
    workReturn: "Voltar à marca",
    menteesEyebrow: "Mentorados",
    menteesTitle: "O que os mentorados dizem",
    growthmentorLink: "4,95/5 no GrowthMentor →",
    adplistLink: "20+ avaliações no ADPList →",
    ctaTitle: "Precisa de clareza em um desafio de produto ou negócio?",
    ctaBody: "Escolha uma sessão focada ou solicite advisory estratégico — direta, orientada a dados e humana.",
    ctaStart: "Como trabalhar comigo",
    portraitAlt: "Rhaissa “Ray” V. palestrando na Rio Innovation Week",
  },
  mentoring: {
    eyebrow: "Mentoria de Product Management",
    title: "Transforme caos de produto em um próximo passo claro",
    lead: "Mentoria 1:1 para PMs, founders e líderes que precisam navegar priorização, pressão de stakeholders, estratégia e transições de carreira. Direta, orientada a dados e prática.",
    audienceTitle: "Para quem é",
    audience: [
      "PMs fazendo a transição de execução para estratégia",
      "Founders que precisam de sinal de produto sem o ruído",
      "Líderes escalando times em contextos multiculturais",
      "Quem está se preparando para um salto de carreira ou entrevistas",
    ],
    topicsTitle: "Temas comuns",
    topics: [
      "Influenciar sem autoridade",
      "Clareza de roadmap e priorização",
      "Produtos de dados, experimentação e métricas",
      "Comunicação executiva e narrativa",
      "Uso de IA no dia a dia de produto",
      "Liderança cross-functional",
    ],
    proofTitle: "O que os mentorados dizem",
    ctaTitle: "Agendar sessão de mentoria",
    ctaBody: "35 USD · 60 min · escolha seu horário e pague para confirmar.",
  },
  about: {
    eyebrow: "Sobre mim",
    title: "Oi! Eu sou a Rhaissa “Ray” (ela/dela)",
    lead: "Líder de produto, mentora e advisor. 10+ anos transformando dados confusos em decisões acionáveis.",
    industriesEyebrow: "Onde atuei",
    industries: [
      "SaaS B2B",
      "Marketplace",
      "Fintech",
      "Streaming",
      "Produtos de dados",
      "Escala de plataforma",
      "Growth & PLG",
      "PMM & GTM",
    ],
    pillarsEyebrow: "Em resumo",
    pillars: [
      { title: "Multifuncional por natureza", body: "Produto, Engenharia, Dados, Growth e Operações — B2B, B2C e marketplace." },
      { title: "IA na prática diária", body: "Claude e ChatGPT para discovery, priorização e decisões. POC multiagente no WhatsApp." },
      { title: "Líder e IC hands-on", body: "Gosto de estar nos dois lados da mesa." },
    ],
    mentorEyebrow: "Mentoria",
    mentorStats: [
      { value: "4,95/5", label: "Avaliação como advisor · GrowthMentor" },
      { value: "2.600+", label: "minutos no ADPList" },
      { value: "75+", label: "sessões realizadas" },
    ],
    mentorA: "Também mentoro na ",
    mentorB: "",
    placeEyebrow: "Onde eu estou",
    place: [
      { label: "Base", value: "Rio de Janeiro, Brasil" },
      { label: "Idiomas", value: "PT · EN fluentes · ES avançado" },
      { label: "Já trabalhei em", value: "Brasil · Colômbia · México · EUA" },
    ],
    edge: "Diferencial de liderança",
    howEyebrow: "Como eu trabalho",
    how: [
      "Minimalista: menos apostas, melhor instrumentadas.",
      "Direta: a decisão vem antes da narrativa.",
      "Humana: times entregam, frameworks não.",
      "Multicultural: contextos de LATAM, Reino Unido e EUA.",
    ],
  },

  career: {
    eyebrow: "Trajetória",
    title: "Posições diferentes, um problema",
    lead: "Empresas diferentes, mesma tensão: times nadando em sinal, mas com pouca clareza. De onboarding em fintech a churn em marketplace, de lançamentos de plataforma a SaaS B2B 0→1, normalmente me chamam quando os dados estão confusos, os stakeholders são muitos e a decisão não pode esperar.",
    education: "Formação & certificações",
  },
  cases: {
    eyebrow: "Cases",
    title: "Conquistas ao longo do caminho",
    lead: "Uma seleção de problemas que conduzi de ponta a ponta, com a métrica que mudou. Posso me aprofundar em qualquer um deles em uma call.",
  },
  partner: {
    eyebrow: "Agendar sessão",
    title: "Escolha o tema que combina com seu problema",
    lead: "Todo encontro é uma sessão de trabalho de 60 minutos, geralmente realizada fora do horário comercial conforme disponibilidade. Escolha um horário e pague para garantir — horários não pagos são liberados.",
    mostRequested: "Mais procurado",
    bookTime: "Agendar",
    pay: "Pagar",
    processEyebrow: "O processo",
    processTitle: "Como funciona",

    talkTitle: "Estou sem agenda e quer conversar?",
    talkBody:
      "Me manda uma mensagem no LinkedIn com o problema em um parágrafo. Se eu não for a pessoa certa, eu te digo quem é.",
    talkCta: "Falar no LinkedIn",
    newTab: "abre em uma nova aba",
  },
  partnership: {
    name: "Tailored Advisory",
    duration: "Algumas horas por semana · empresas e founders",
    priceLabel: "Escopo sob medida",
    priceNote: "",
    unavailable: "Indisponível no momento",
    unavailableNote: "Suspensas devido à capacidade atual até o fim do ano",
    equityNote: "",
    summary:
      "Advisory para apoio além de uma sessão, conectando estratégia de negócio e produto, decisões mais fortes e execução. Leve por design: algumas horas por semana.",
    includes: [
      "Algumas horas por semana",
      "Estratégia de negócio e produto & execução",
      "Alinhamento executivo e apoio em decisões",
    ],
    cta: "Enviar solicitação",
    sending: "Enviando…",
    pageEyebrow: "Advisory",
    pageTitle: "Advisory desenhado para o seu negócio",
    includesTitle: "O que o advisory pode incluir",

    formTitle: "Conte sobre o desafio do seu negócio",
    formLead: "Compartilhe seus objetivos, desafios atuais e o tipo de apoio que procura. Responderei com uma proposta de escopo e disponibilidade.",
    yourDetails: "Seus dados",
    fieldName: "Nome completo*",
    fieldEmail: "E-mail*",
    fieldMessage: "Como posso ajudar você?*",
    formNote: "Todos os campos são obrigatórios. Costumo responder em até dois dias úteis.",
    successTitle: "Solicitação enviada",
    successBody: "Obrigada — em breve eu retorno o contato.",
    errorTitle: "Algo deu errado",
    errorBody: "Tente novamente ou me chame no LinkedIn.",
  },

  booked: {
    eyebrow: "Links da sessão",
    title: "Reserve o horário e pague para garantir",
    lead: "Escolher um horário inicia a reserva — o pagamento no Stripe é o que confirma. Horários não pagos são liberados.",
    steps: [
      {
        title: "Escolha o tema",
        body: "Escolha o card de sessão que melhor combina com seu problema, ou me escreva se estiver em dúvida.",
      },
      {
        title: "Reserve o horário",
        body: "Escolha qualquer horário livre no meu calendário e escreva o contexto do problema nas notas.",
      },
      {
        title: "Pague para garantir",
        body: "A vaga só é confirmada quando o pagamento é concluído no Stripe.",
      },
    ],
    step: "Passo",
    ctaTitle: "Primeiro reserve, depois garanta com o pagamento",
    ctaBody:
      "Escolha um horário no calendário e conclua o pagamento para garantir a reserva. Os dois links abrem em uma nova aba.",
    openCalendar: "Abrir o calendário",
    pay: "Pagar para garantir",
    helpA: "Precisa esclarecer qual é o tema certo antes de reservar ou pagar? ",
    helpLinkedIn: "Me chame no LinkedIn",
    helpB: " ou volte para ",
    helpOfferings: "as ofertas",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Ui;
  c: ReturnType<typeof bundle>;
};

const defaultCtx: Ctx = {
  lang: "en",
  setLang: () => {},
  t: uiEn,
  c: bundle("en"),
};

const LangContext = createContext<Ctx>(defaultCtx);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "pt" || stored === "en") {
      setLangState(stored);
      return;
    }
    if (navigator.language?.toLowerCase().startsWith("pt")) setLangState("pt");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        window.localStorage.setItem(STORAGE_KEY, l);
      },
      t: lang === "pt" ? uiPt : uiEn,
      c: bundle(lang),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n(): Ctx {
  return useContext(LangContext);
}
