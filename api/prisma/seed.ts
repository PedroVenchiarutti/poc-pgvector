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
