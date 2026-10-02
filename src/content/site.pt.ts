import { packagePaymentUrl, sessionPaymentUrl, strategyPaymentUrl, type Offering } from "./site";

export const recognitionPt = {
  title: "Mentora · turma M12",
  org: "Latin American Leadership Academy",
  date: "LALA 2026 · Remote",
  body: "Selecionada para mentorar jovens líderes latino-americanos pela Latin American Leadership Academy — apoiando acesso, comunidade e tomada de decisão para transformação social na região.",
  url: "https://www.linkedin.com/feed/update/urn:li:activity:7498002602555748353/",
};

export const festivalPt = {
  title: "Festival MDP 2026",
  org: "Mulheres de Produto",
  date: "7 nov 2026 · São Paulo",
  body: "No palco do maior encontro de mulheres em tecnologia e produto do Brasil — no painel “Liderança sem Crachá”, sobre liderança feminina, confiança e influência em decisões.",
  url: "https://festival.mulheresdeproduto.com/",
};


export const bioPt =
  "Product Leader\nMentora · Advisor\nex-Netflix, ex-iFood";

export const certificationPt = {
  label: "“Global Leader Certified” por Deel & Nomad",
};

export const metricsPt = [
  { value: "10+ anos", label: "Liderando squads multifuncionais e distribuídos" },
  { value: "100M+", label: "MAU em produto escalado no Google" },
  { value: "€1,5M+", label: "Meta de GMV em 11 mercados do Reino Unido" },
  { value: "4,95/5", label: "Avaliação como advisor · GrowthMentor" },
];

export const focusAreasPt = [
  "Liderar squads multifuncionais e distribuídos",
  "Influenciar sem autoridade formal entre stakeholders",
  "Comunicação executiva e clareza narrativa",
  "Estratégia, priorização e definição de direção",
  "Desenvolver PMs, fundadores e times em crescimento",
  "Atuar em contextos de LATAM, Reino Unido e EUA",
];

export const careerPt = [
  {
    company: "Quqo",
    role: "Staff Product Manager — SaaS B2B",
    period: "2025 — Hoje",
    place: "11 mercados do Reino Unido · remoto do Rio",
    points: [
      "Parte do time global de um app de procure-to-pay (P2P), em parceria com a liderança executiva.",
      "Viabilizando uma experiência 0→1 para mais de 600 contas compradoras de clínicas (SMBs) e um portfólio de €1,5M+ de GMV / €450 de ticket médio até início de 2027.",
      "Co-lidera a estratégia de produto da plataforma e a transformação operacional de um SaaS de saúde escalando com 89%+ de ativação em 11 mercados do Reino Unido.",
      "Conduz iniciativas com IA: um POC multiagente no WhatsApp para fluxos de CRM no Reino Unido, uma demo de analytics de compras para executivos D-level e automações assistidas por Claude para gestão de time distribuído.",
      "Co-lidera decisões de arquitetura de API/dados entre D365, SAP e mais de 20 integrações de fornecedores.",
      "Gerencia e mentora 4 PMs/BAs, garantindo alinhamento técnico de roadmap e requisitos.",
    ],
  },
  {
    company: "iFood",
    role: "Senior Data Product Manager — B2B",
    period: "2024 — 2025",
    place: "Brasil · BU de Food Delivery",
    points: [
      "Reduziu perda de receita em 10%, cancelamentos de pedidos em 13% e “handshakes” em 7% em um trimestre.",
      "Liderou uma squad de 10 pessoas focada em experiência do parceiro, retenção e redução de churn em uma plataforma 1→N com 350K+ MAU.",
      "Responsável por experimentação (A/B e diff-in-diff) e análise de retenção por cohort com mais de 30 mil usuários.",
      "Entregou um redesign B2B via testes A/B, escalando o alcance para 100 mil+ usuários no Q4.",
      "Atuou com Data Science e Engenharia na arquitetura de pipeline por trás de um dashboard de parceiros em tempo quase real.",
    ],
  },
  {
    company: "Google (via Huge)",
    role: "Senior Product Manager — em nome do Google",
    period: "2020 — 2024",
    place: "Global Strategy Craft org",
    points: [
      "Liderou um time de 10+ pessoas até um aumento anual de 7 dígitos na adoção de um produto Google com 100M+ MAU.",
      "Atuou com a engenharia do Google no pipeline de releases canary → dev → beta → stable.",
      "Conduziu experimentação e discovery, incluindo um teste A/B de homepage que escalou para +50 mil downloads incrementais/mês.",
      "Liderou iniciativas de rollout do Google Search Ads Format Framework e da operação do Design System.",
      "Apoiou a migração para GA4 e a instrumentação de eventos com Analytics e Engenharia.",
    ],
  },
  {
    company: "Netflix",
    role: "Product Marketing, Growth",
    period: "2019 — 2020",
    place: "PMM de consumo · LATAM",
    points: [
      "Apoiou os lançamentos de maior performance na LATAM, que alcançaram os trending charts globais e marcos de engajamento.",
      "Gerenciou iniciativas de plataforma de consumo para IPs globais como La Casa de Papel, The Witcher e O Irlandês.",
      "Liderou iniciativas de aquisição e GTM com Marketing, Editorial Creative, Operações e G11n na LATAM.",
      "Conduziu parcerias SWAT com Google e Meta para mídia e lançamentos de alto impacto.",
      "Gerenciou 15+ stakeholders globais e agências parceiras em Los Angeles, Los Gatos e São Paulo.",
    ],
  },
  {
    company: "Bradesco Next (via R/GA)",
    role: "Product Manager, Fintech",
    period: "2017 — 2019",
    place: "Brasil",
    points: [
      "Co-liderou uma iniciativa de transformação em fintech focada em monetização, onboarding e operação de banco digital.",
      "Liderou uma squad mobile de menos de 10 engenheiros do MVP 0→1 até a escala.",
      "Responsável por aquisição e retenção B2C nas experiências de onboarding e ciclo de vida.",
      "Atuou na arquitetura de core banking e BFF com a CAPCO e engenharia.",
      "Mapeou riscos regulatórios e compliance de um produto de banco digital.",
    ],
  },
  {
    company: "Huge",
    role: "Product Operations, Bancos & Aviação",
    period: "2016 — 2017",
    place: "Brasil · Peru · Colômbia",
    points: [
      "Liderou iniciativas de transformação digital para bancos como Itaú, Banco BV, Banco Popular Dominicano e Interbank, além de GOL e Avianca.",
      "Conduziu sessões de discovery com clientes potenciais para definir escopo de proposta e estratégia de solução.",
      "Melhorou a produtização de soluções, frameworks de pricing e a operação de RFPs.",
    ],
  },
];

export const caseStudiesPt = [
  {
    tag: "SaaS B2B · Quqo · 2025 — Hoje",
    title: "Plataforma de procure-to-pay 0→1 para clínicas",
    result: "600+ contas de clínicas · 11 mercados do Reino Unido · meta de €1,5M+ de GMV",
    body: "Parte do time global de um app de procure-to-pay, em parceria com a liderança executiva. Co-lidera a estratégia de produto e a transformação operacional de um SaaS de saúde com 89%+ de ativação, além da arquitetura de API/dados entre D365, SAP e 20+ integrações de fornecedores.",
  },
  {
    tag: "UX B2B em escala · iFood · 2024 — 2025",
    title: "Escalando um redesign B2B para 100 mil+ usuários",
    result: "100 mil+ usuários alcançados no Q4",
    body: "Entregou um redesign B2B via testes A/B, expandindo a adoção e escalando o alcance para 100 mil+ usuários em um único trimestre, junto de um dashboard de parceiros em tempo quase real iterado com Data Science e Engenharia.",
  },
  {
    tag: "Marketplace · iFood · 2024 — 2025",
    title: "Reduzindo perda de receita e cancelamentos",
    result: "-10% perda de receita · -13% cancelamentos · -7% handshakes",
    body: "Liderou uma squad de 10 pessoas em experiência do parceiro, retenção e redução de churn em uma plataforma 1→N com 350K+ MAU. Responsável por experimentação (A/B e diff-in-diff) e análise de retenção por cohort com mais de 30 mil usuários para apoiar decisões operacionais.",
  },
  {
    tag: "Dados & Experimentação · Google (via Huge) · 2020 — 2024",
    title: "Salto de 7 dígitos em adoção num produto de 100M+ MAU",
    result: "Time de 10+ · +50 mil downloads incrementais/mês",
    body: "Conduziu experimentação e discovery para um produto Google de mercado principal, incluindo um teste A/B de homepage que escalou para +50 mil downloads incrementais/mês, além de apoiar a migração para GA4 e a instrumentação de eventos.",
  },
  {
    tag: "PMM · Netflix · 2019 — 2020",
    title: "Marketing de produto e lançamentos de consumo na LATAM",
    result: "Lançamentos de IPs globais · GTM LATAM",
    body: "Gerenciou iniciativas de plataforma de consumo para IPs globais como La Casa de Papel, The Witcher e O Irlandês; liderou aquisição e GTM com Marketing, Editorial Creative, Operações e G11n na LATAM, e conduziu parcerias SWAT com Google e Meta.",
  },
  {
    tag: "Fintech · Bradesco Next (via R/GA) · 2017 — 2019",
    title: "Lançamento mobile 0→1 e escala de banco digital",
    result: "MVP à escala · aquisição B2C · compliance regulatório",
    body: "Co-liderou uma iniciativa de transformação em fintech, liderando uma squad mobile do MVP 0→1 até a escala. Responsável por aquisição e retenção B2C nas experiências de onboarding e ciclo de vida, além de mapear riscos regulatórios e compliance de um produto de banco digital.",
  },
];

export const offeringsPt: Offering[] = [
  {
    name: "Mentoria Geral 1:1",
    price: "35 USD",
    duration: "60 min · call 1:1",
    summary:
      "Transições de carreira, confiança, decisões difíceis — um espaço humano e sem agenda para organizar o que está te pesando.",
    includes: [
      "Briefing antes da call para pularmos o aquecimento",
      "Revisão ao vivo de CV, LinkedIn ou da sua narrativa de entrevista",
      "Plano de ação por escrito depois da sessão",
    ],
    details: [
      {
        label: "Para quem",
        body: "Qualquer senioridade ou setor. Troca de emprego, entrevistas ou decisão difícil.",
      },
      {
        label: "O que faço",
        body: "Trabalhamos o lado tático e humano: como você se apresenta, conta sua história e escolhe o próximo movimento.",
      },
      {
        label: "Como eu trabalho",
        body: "STAR para histórias de entrevista, narrativa de posicionamento para CV/LinkedIn e um mapa de trade-offs quando dois caminhos competem.",
      },
      {
        label: "Você sai com",
        body: "2–3 próximos passos concretos construídos ao vivo e enviados depois da call para você agir ainda esta semana.",
      },
    ],

    accent: "primary",
    checkoutUrl: sessionPaymentUrl,
  },
  {
    name: "Estratégia de Produto",
    price: "35 USD",
    compareAtPrice: "50 USD",
    discountLabel: "30% OFF",
    duration: "60 min · call 1:1",
    summary:
      "Uma sessão focada em um problema de produto em aberto — estratégia, métricas, case de entrevista ou product sense.",
    includes: [
      "Enquadramento, dimensionamento ou case ao vivo",
      "Árvore de métricas e shortlist de experimentos",
      "Roadmap, GTM ou recomendação de preparação para case",
    ],
    details: [
      {
        label: "Para quem",
        body: "PMs e founders com uma decisão de produto, métrica travada ou case de entrevista ao vivo.",
      },
      {
        label: "O que faço",
        body: "Vamos fundo em um desafio vivo: métrica travada, loop de growth, posicionamento ou case de produto.",
      },
      {
        label: "Como eu trabalho",
        body: "Árvores de métricas, loops de growth, priorização e drills de case — as mesmas ferramentas que uso em escala.",
      },
      {
        label: "Você sai com",
        body: "O problema mapeado ao vivo: árvore de métricas, dimensionamento, shortlist de experimentos e notas do case.",
      },
    ],
    accent: "violet",
    featured: true,
    checkoutUrl: strategyPaymentUrl,
  },
  {
    name: "Sessões de Liderança",
    price: "90 USD",
    compareAtPrice: "130 USD",
    discountLabel: "30% OFF",
    duration: "3 × 60 min · calls 1:1",
    summary:
      "Três sessões para visibilidade, salto de liderança ou mudança internacional — com espaço para construir um plano real.",
    includes: [
      "3 × 60 min para usar em até 90 dias",
      "Confiança, posicionamento e marca pessoal em tech",
      "Vida expat e nômade: nova cultura, novo mercado, novo time",
      "Advisory em transições de carreira entre LATAM e EUA",
      "Sessões em português, inglês ou spanglish",
    ],
    details: [
      {
        label: "Para quem",
        body: "PMs experientes, empreendedores e profissionais de marketing prontos para um papel maior ou atravessar fronteiras.",
      },
      {
        label: "O que faço",
        body: "Trabalhamos ser vista pelo seu trabalho, assumir um papel maior e construir uma carreira entre países e culturas.",
      },
      {
        label: "Como eu trabalho",
        body: "Mapa de stakeholders, práticas de Management 3.0 e narrativa de marca pessoal — aplicados ao longo de três sessões.",
      },
      {
        label: "Você sai com",
        body: "Um plano de 90 dias por escrito para sua meta de visibilidade, liderança ou mudança de país, mais artefatos de apoio depois de cada call.",
      },
    ],
    footnote: "A segunda e a terceira sessão serão agendadas depois da evolução do primeiro encontro.",
    accent: "teal",
    checkoutUrl: packagePaymentUrl,
  },
  {
    name: "Reserva de Teste",
    price: "5 BRL",
    duration: "60 min · call 1:1",
    summary: "Oferta interna de teste para validação do fluxo real de pagamento.",
    includes: ["Transação real de R$5", "Teste de webhook + evento de calendário", "Reembolso após validação"],
    accent: "primary",
    hidden: true,
  },
];


export const testimonialsPt = [
  {
    quote:
      "Rhaissa entendeu o desafio imediatamente e me ajudou a dar estrutura ao que parecia um problema muito abstrato e disperso. Ela me ajudou a focar onde investir energia, o que parar de fazer e o que priorizar em seguida.",
    name: "Emily",
    context: "GrowthMentor",
  },
  {
    quote:
      "Tive uma excelente sessão com a Rhaissa. Ela me ajudou a clarificar como estruturar minha estratégia de advisory board e como oferecer equity de forma inteligente com base na contribuição de cada advisor. Os insights dela sobre como montar um board equilibrado — combinando expertise local e internacional — foram incrivelmente valiosos.",
    name: "Cristian Haro",
    context: "GrowthMentor",
  },
  {
    quote:
      "A Rhaissa é uma especialista com uma energia contagiante! Tive uma ótima sessão de consultoria, em que ela compartilhou muitos insights e recursos e fez perguntas extremamente perspicazes. Não consigo recomendá-la o suficiente.",
    name: "Aaron Marco Arias",
    context: "GrowthMentor",
  },
  {
    quote:
      "A mentoria com a Rhai foi eficaz, pragmática e direta — do jeito que eu gosto! Ela foi transparente com as informações que compartilhou, me dando orientações claras e acionáveis, e fez follow-up depois da sessão. Recomendo muito ela como mentora!",
    name: "Bianca Sonnewend",
    context: "ADPList",
  },
  {
    quote:
      "Conversar com a Rhai me abriu olhos para meus pontos positivos que eu não tinha percebido, precisava de um segundo olhar. Me sinto forte e corajosa, pronta para dar mais um passo na minha carreira! Obrigada Rhai <3",
    name: "Karen Barros",
    context: "ADPList",
  },
  {
    quote:
      "Ela me ajudou a pensar amplamente sobre minha startup, como identificar as personas e como aprofundar para descobrir o valor econômico que minha startup agregará aos clientes. Então, gente, não hesitem em marcar uma sessão com a Rhaissa; ela é uma mentora de primeira e tem experiência de verdade na prática.",
    name: "Hamilton dos Santos",
    context: "GrowthMentor",
  },
];

export const partnerStepsPt = [
  {
    step: "01",
    title: "Reserve uma sessão",
    body: "Escolha o formato que combina com o seu problema e pegue um horário. Sem formulários longos — só me conte no que você está trabalhando.",
  },
  {
    step: "02",
    title: "Vamos ao problema real",
    body: "Em 60 minutos focados, passamos da pergunta de superfície para o que realmente está te travando, e trabalhamos isso juntas.",
  },
  {
    step: "03",
    title: "Você sai com próximos passos",
    body: "Nada de discurso motivacional vago — você sai com uma leitura clara da sua situação e movimentos concretos, escritos e enviados depois da call.",
  },
];


export const educationPt = [
  "Deel & Nomad — Liderança · Global Leader Certified (2026)",
  "Reforge — Product Management · Product Strategy (2025)",
  "Instituto Infnet — MBA Executivo · Marketing Digital (2012–2014)",
  "Universidade Federal Fluminense (UFF) — Bacharelado em Comunicação Social · Publicidade (2007–2011)",
];
