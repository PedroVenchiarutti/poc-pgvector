import { createIdea, countIdeas, truncateIdeas } from "../src/models/idea.model.js";
import { generateEmbedding, warmup } from "../src/services/embedding.service.js";
import { prisma } from "../src/lib/prisma.js";

const IDEAS = [
  {
    title: "Automação de Processos com Robôs Colaborativos",
    description:
      "Introdução de robôs colaborativos (cobots) na linha de produção para automatizar tarefas repetitivas e fisicamente exigentes, permitindo que os funcionários se concentrem em atividades de maior valor agregado.",
  },
  {
    title: "Drones para Monitoramento e Pulverização de Culturas",
    description:
      "Utilização de drones para monitorar as culturas e realizar pulverização direcionada de pesticidas e fertilizantes. Os drones equipados com câmeras de alta resolução e sensores podem identificar áreas que necessitam de tratamento e realizar a pulverização de forma precisa.",
  },
  {
    title: "Agricultura de Precisão com Sensores IoT",
    description:
      "Desenvolvimento e implementação de uma plataforma de agricultura de precisão que utiliza sensores IoT para monitorar a umidade do solo, níveis de nutrientes, condições climáticas e outros fatores críticos em tempo real. Os dados coletados serão analisados para otimizar o uso de recursos como água e fertilizantes.",
  },
  {
    title: "Implementação de Inteligência Artificial para Manutenção Preditiva",
    description:
      "A implementação de um sistema de manutenção preditiva utilizando inteligência artificial (IA) e aprendizado de máquina para monitorar o estado das máquinas e prever falhas antes que elas ocorram. Sensores IoT (Internet das Coisas) serão instalados em equipamentos críticos para coletar dados em tempo real, que serão analisados por algoritmos de IA.",
  },
  {
    title: "Gestão Inteligente de Energia com IA",
    description:
      "Implementação de um sistema inteligente de gestão de energia utilizando IA para monitorar e otimizar o consumo de energia em instalações industriais, reduzindo custos e emissões de carbono.",
  },
  {
    title: "Blockchain para Rastreabilidade de Produtos",
    description:
      "Utilização da tecnologia blockchain para garantir a rastreabilidade de produtos ao longo da cadeia de suprimentos, aumentando a transparência e a confiança dos consumidores.",
  },
  {
    title: "Realidade Aumentada para Treinamento de Funcionários",
    description:
      "Desenvolvimento de uma plataforma de realidade aumentada para treinamento imersivo de funcionários, melhorando a eficiência e a retenção de conhecimento.",
  },
  {
    title: "Implementação de IoT (Internet das Coisas) e sensores inteligentes",
    description:
      "Consiste na instalação de sensores em máquinas e equipamentos para monitorar em tempo real o desempenho e identificar padrões de falha.",
  },
  {
    title: "Sistema de Gestão de Resíduos com IoT",
    description:
      "Implementação de sensores IoT para monitorar e otimizar a gestão de resíduos em instalações industriais, melhorando a eficiência e a sustentabilidade.",
  },
  {
    title: "Plataforma de Telemetria para Veículos Industriais",
    description:
      "Desenvolvimento de uma plataforma de telemetria para monitorar o desempenho e a manutenção de veículos industriais em tempo real, aumentando a segurança e a eficiência operacional.",
  },
  {
    title: "Aplicação de Machine Learning em Controle de Qualidade",
    description:
      "Utilização de técnicas de machine learning para melhorar o controle de qualidade na produção, identificando e corrigindo defeitos de maneira mais eficiente.",
  },
  {
    title: "Integração de Big Data para Análise de Mercado",
    description:
      "Implementação de uma solução de big data para coletar e analisar dados de mercado, ajudando a identificar tendências e oportunidades de negócio.",
  },
  {
    title: "Sistema de Previsão de Demanda com IA",
    description:
      "Desenvolvimento de um sistema de previsão de demanda utilizando IA, permitindo uma melhor gestão de estoque e planejamento de produção.",
  },
  {
    title: "Desenvolvimento de Wearables para Monitoramento de Saúde Ocupacional",
    description:
      "Criação de wearables que monitoram a saúde dos trabalhadores em tempo real, ajudando a prevenir acidentes e melhorar a segurança no ambiente de trabalho.",
  },
  {
    title: "Manufatura aditiva (impressão 3D) para produção sob demanda",
    description:
      "Permite a produção de componentes e produtos de forma sob demanda, utilizando tecnologias de impressão 3D.",
  },
  {
    title: "Otimização de cadeia de suprimentos com algoritmos de otimização",
    description:
      "Aplica algoritmos de otimização para identificar as rotas mais eficientes, pontos de estoque ideais e estratégias de transporte mais econômicas na cadeia de suprimentos.",
  },
  {
    title: "Desenvolvimento de Nanofiltros para Purificação de Água de Irrigação",
    description:
      "Esta iniciativa propõe o desenvolvimento de nanofiltros para purificação de água de irrigação, removendo contaminantes como pesticidas, metais pesados e microrganismos patogênicos. Os filtros serão integrados aos sistemas de irrigação, garantindo que apenas água limpa seja fornecida às plantas, o que pode melhorar a saúde das culturas e reduzir a contaminação de alimentos.",
  },
  {
    title: "Automação de Atendimento ao Cliente com Chatbots",
    description:
      "Implementação de chatbots para automatizar o atendimento ao cliente, melhorando a eficiência e a satisfação do cliente.",
  },
  {
    title: "Desenvolvimento de Plataforma de E-commerce Personalizada",
    description:
      "Criação de uma plataforma de e-commerce personalizada para melhorar a experiência do cliente e aumentar as vendas online.",
  },
  {
    title: "Sistema de Gestão de Documentos com Blockchain",
    description:
      "Implementação de um sistema de gestão de documentos utilizando blockchain, garantindo a segurança e a integridade dos dados.",
  },
  {
    title: "Automação de processos industriais com robótica",
    description:
      "Utiliza sistemas robóticos para automatizar tarefas de montagem, embalagem, transporte e inspeção, reduzindo a dependência de trabalho manual.",
  },
  {
    title: "Implementação de Sistema de Otimização Industrial Inteligente",
    description:
      "A iniciativa propõe a implementação de um sistema de otimização industrial inteligente, que utiliza tecnologias como Internet das Coisas (IoT), machine learning e análise de dados para maximizar a eficiência operacional em ambientes industriais. O sistema seria capaz de monitorar em tempo real o desempenho de máquinas, processos e fluxos de produção, identificar gargalos e oportunidades de melhoria, e recomendar ajustes para otimizar o uso de recursos, reduzir desperdícios e aumentar a produtividade.",
  },

  // ============ FINTECH ============
  {
    title: "Carteira digital com Pix instantâneo",
    description:
      "Aplicativo de carteira digital integrado ao Pix, com transferências instantâneas, divisão de contas e gestão de gastos compartilhados entre amigos e família.",
  },
  {
    title: "Plataforma de investimento automatizado",
    description:
      "Robô-investidor que aloca recursos em renda fixa, ações e fundos imobiliários com base no perfil de risco e objetivos do usuário, com rebalanceamento mensal.",
  },
  {
    title: "Cartão de crédito gamificado para jovens",
    description:
      "Cartão pré-pago com app que ensina educação financeira através de missões, metas de poupança e cashback em categorias selecionadas pelo usuário.",
  },
  {
    title: "Análise de crédito alternativa por IA",
    description:
      "Sistema de score de crédito baseado em dados alternativos como histórico de pagamentos de contas, comportamento digital e renda autônoma, expandindo acesso ao crédito.",
  },
  {
    title: "Open Finance dashboard unificado",
    description:
      "Painel que centraliza contas bancárias, investimentos, cartões e dívidas de múltiplas instituições em uma única visão consolidada do patrimônio.",
  },

  // ============ SAÚDE ============
  {
    title: "Telemedicina especializada com IA triagem",
    description:
      "Plataforma de consultas médicas online com pré-triagem por inteligência artificial que classifica urgência e encaminha para o especialista correto.",
  },
  {
    title: "Prontuário eletrônico interoperável",
    description:
      "Sistema de prontuário médico digital integrado entre hospitais, clínicas e laboratórios, permitindo histórico completo do paciente em qualquer atendimento.",
  },
  {
    title: "Wearable de monitoramento cardíaco contínuo",
    description:
      "Dispositivo vestível que mede ECG, pressão arterial e oxigenação 24/7, alertando médicos sobre arritmias e eventos cardiovasculares em tempo real.",
  },
  {
    title: "App de adesão a tratamento crônico",
    description:
      "Aplicativo que lembra pacientes de tomar medicação, registra sintomas e envia relatórios automáticos ao médico para acompanhamento de doenças crônicas.",
  },
  {
    title: "Diagnóstico por imagem com deep learning",
    description:
      "Software que analisa exames de raio-X, tomografia e ressonância usando deep learning para detectar precocemente câncer, fraturas e anomalias cardíacas.",
  },

  // ============ EDUCAÇÃO ============
  {
    title: "Tutor de matemática personalizado com IA",
    description:
      "Plataforma que adapta exercícios de matemática ao nível e estilo de aprendizagem de cada aluno, oferecendo feedback imediato e trilhas personalizadas.",
  },
  {
    title: "Plataforma de cursos de programação com mentoria",
    description:
      "Cursos online de desenvolvimento de software com projetos práticos, code review automatizado e mentoria semanal com profissionais sêniores do mercado.",
  },
  {
    title: "App de aprendizado de idiomas conversacional",
    description:
      "Aplicativo que ensina inglês, espanhol e francês através de conversas com IA simulando situações reais como entrevistas de emprego, viagens e negócios.",
  },
  {
    title: "Gamificação para escolas públicas",
    description:
      "Sistema de gamificação que transforma o currículo escolar em missões, conquistas e rankings, aumentando engajamento e retenção em escolas públicas.",
  },
  {
    title: "Biblioteca digital colaborativa de TCCs",
    description:
      "Repositório aberto de trabalhos de conclusão de curso de universidades brasileiras, indexado e pesquisável por área, palavras-chave e instituição.",
  },

  // ============ AGRONEGÓCIO ============
  {
    title: "Sistema de irrigação inteligente por satélite",
    description:
      "Solução que combina imagens de satélite e sensores de solo para determinar quando e quanto irrigar cada talhão, economizando água e aumentando produtividade.",
  },
  {
    title: "Marketplace direto do produtor rural ao consumidor",
    description:
      "Plataforma de e-commerce que conecta agricultores familiares diretamente aos consumidores urbanos, eliminando atravessadores e oferecendo produtos frescos.",
  },
  {
    title: "Rastreamento blockchain de origem alimentar",
    description:
      "Sistema que usa blockchain para rastrear toda a jornada de alimentos do campo à mesa, garantindo transparência sobre origem, produção e práticas sustentáveis.",
  },
  {
    title: "Identificação de pragas por foto com IA",
    description:
      "Aplicativo móvel onde produtor fotografa folha doente e IA identifica praga ou fungo específico, recomendando tratamento personalizado e ecológico.",
  },
  {
    title: "Gestão financeira para pequeno produtor",
    description:
      "Plataforma simples de gestão financeira voltada ao pequeno agricultor com controle de safra, custos, vendas e simulação de financiamento agrícola.",
  },

  // ============ SUSTENTABILIDADE / ENERGIA ============
  {
    title: "Marketplace de créditos de carbono verificados",
    description:
      "Plataforma B2B para compra e venda de créditos de carbono auditados, conectando projetos de reflorestamento e empresas que precisam compensar emissões.",
  },
  {
    title: "Solução de energia solar compartilhada",
    description:
      "Modelo de geração distribuída onde usinas solares são compartilhadas entre múltiplos consumidores via cooperativa, reduzindo conta de luz em até 20%.",
  },
  {
    title: "App de reciclagem com recompensa",
    description:
      "Aplicativo que conecta usuários a pontos de coleta de recicláveis e oferece cashback e cupons de descontos em supermercados parceiros por kg reciclado.",
  },
  {
    title: "Plataforma de carona corporativa elétrica",
    description:
      "Sistema interno em empresas para incentivar caronas em carros elétricos entre colaboradores, com rotas otimizadas e gamificação para reduzir CO2.",
  },
  {
    title: "Smart grid para condomínios residenciais",
    description:
      "Solução de gestão inteligente de energia em condomínios que integra solar, baterias e consumo individual, otimizando custo e reduzindo desperdício.",
  },

  // ============ VAREJO / E-COMMERCE ============
  {
    title: "Provador virtual com realidade aumentada",
    description:
      "Tecnologia AR que permite ao consumidor experimentar roupas, óculos e maquiagem virtualmente pelo celular antes de comprar, reduzindo trocas e devoluções.",
  },
  {
    title: "Recomendação personalizada por comportamento",
    description:
      "Engine de recomendação para e-commerce que analisa navegação, compras anteriores e perfil para sugerir produtos com alta probabilidade de conversão.",
  },
  {
    title: "Live commerce com influenciadores nichados",
    description:
      "Plataforma de transmissões ao vivo onde influenciadores apresentam e vendem produtos em tempo real, com chat interativo e compra direta sem sair da live.",
  },
  {
    title: "Programa de fidelidade unificado entre marcas",
    description:
      "Programa que unifica pontos de diversas marcas parceiras em uma única carteira digital, permitindo trocar em qualquer loja da rede.",
  },
  {
    title: "Reposição automática de produtos recorrentes",
    description:
      "Serviço de assinatura que detecta quando o consumidor precisa repor itens como ração, fralda ou suplemento, enviando automaticamente antes de acabar.",
  },

  // ============ LOGÍSTICA / MOBILIDADE ============
  {
    title: "Otimização de rotas de entrega com machine learning",
    description:
      "Algoritmo que calcula a melhor rota para frotas de delivery considerando trânsito em tempo real, janelas de entrega e capacidade dos veículos.",
  },
  {
    title: "Crowdshipping para entregas urbanas",
    description:
      "Marketplace que conecta pessoas que precisam enviar encomendas com viajantes que já fariam o trajeto, reduzindo custo e impacto ambiental.",
  },
  {
    title: "Last-mile com motos elétricas compartilhadas",
    description:
      "Serviço de entrega de última milha usando frota de motos elétricas compartilhadas entre entregadores parceiros, reduzindo emissão e custo operacional.",
  },
  {
    title: "Rastreamento de carga em tempo real com IoT",
    description:
      "Sistema de sensores IoT em containers e caminhões que monitora localização, temperatura, umidade e impactos da carga durante todo o transporte.",
  },
  {
    title: "Marketplace de fretes para caminhoneiros autônomos",
    description:
      "Plataforma que conecta embarcadores de carga diretamente a caminhoneiros autônomos, eliminando atravessadores e oferecendo cargas de volta.",
  },

  // ============ RH / GESTÃO DE PESSOAS ============
  {
    title: "Plataforma de recrutamento com triagem por IA",
    description:
      "Sistema de RH que faz triagem inicial de currículos usando IA para identificar candidatos mais aderentes à vaga, reduzindo tempo de contratação em 60%.",
  },
  {
    title: "App de pesquisa de clima organizacional contínua",
    description:
      "Aplicativo que envia pulse surveys semanais aos colaboradores para medir engajamento, identificar problemas e gerar planos de ação para gestores.",
  },
  {
    title: "Universidade corporativa com microlearning",
    description:
      "Plataforma de educação corporativa baseada em microlearning, com aulas de 5 minutos personalizadas ao cargo e trilhas de carreira de cada colaborador.",
  },
  {
    title: "Benefícios flexíveis em carteira digital",
    description:
      "Cartão multibenefícios onde colaborador escolhe como gastar o valor entre alimentação, transporte, saúde, educação e cultura conforme prioridade pessoal.",
  },

  // ============ INDÚSTRIA EXTRA ============
  {
    title: "Digital twin para fábrica inteligente",
    description:
      "Gêmeo digital de planta industrial que simula em tempo real cada máquina e processo, permitindo testar mudanças sem parar a produção física.",
  },
  {
    title: "Manutenção 4.0 com óculos AR",
    description:
      "Solução de manutenção industrial usando óculos de realidade aumentada que mostram instruções passo a passo e permitem consulta remota com especialistas.",
  },
  {
    title: "Otimização de consumo elétrico fabril",
    description:
      "Plataforma que monitora consumo elétrico por máquina e processo, identifica desperdícios e sugere ações para reduzir conta de luz industrial.",
  },

  // ============ FOOD TECH ============
  {
    title: "Marketplace de food trucks por região",
    description:
      "App que mostra food trucks ativos próximos ao usuário em tempo real, com cardápio, avaliações e pedido antecipado para retirar sem fila.",
  },
  {
    title: "Geladeira inteligente com lista de compras",
    description:
      "Geladeira conectada que monitora estoque interno por câmera e sensores, sugere receitas com o que tem e gera lista de compras automática.",
  },
  {
    title: "Plataforma anti-desperdício de alimentos",
    description:
      "App que conecta supermercados e restaurantes com excesso de produção a consumidores que compram esses alimentos com 50-70% de desconto.",
  },

  // ============ PETS ============
  {
    title: "App de saúde pet com prontuário digital",
    description:
      "Aplicativo para tutores acompanharem vacinas, consultas, peso e medicamentos de cães e gatos com lembretes automáticos e histórico veterinário.",
  },
  {
    title: "Marketplace de pet sitters verificados",
    description:
      "Plataforma que conecta tutores a cuidadores de pets verificados para passeios, hospedagem e visitas, com avaliações e seguro contra acidentes.",
  },

  // ============ IMÓVEIS ============
  {
    title: "Tour virtual 3D para imóveis à venda",
    description:
      "Tecnologia de captura 3D que cria tours virtuais imersivos de imóveis, permitindo visitas remotas e reduzindo deslocamento de corretores e clientes.",
  },
  {
    title: "Aluguel sem fiador via análise de dados",
    description:
      "Imobiliária digital que aprova aluguel sem fiador ou caução com base em análise de dados financeiros e comportamentais do inquilino.",
  },
];

async function main() {
  console.log("[seed] warming up embedding model...");
  await warmup();

  console.log("[seed] limpando tabela ideas...");
  await truncateIdeas();

  for (const [i, idea] of IDEAS.entries()) {
    const text = `${idea.title}. ${idea.description}`;
    const embedding = await generateEmbedding(text);
    await createIdea(idea.title, idea.description, embedding);
    console.log(`[seed] (${i + 1}/${IDEAS.length}) ${idea.title}`);
  }

  const total = await countIdeas();
  console.log(`[seed] done. total ideas: ${total}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
