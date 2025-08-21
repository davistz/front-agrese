import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  RelatorioMensal,
  RelatorioAnual,
  FiltrosRelatorio,
  RelatorioSetor,
  RelatorioIndividualMensal,
  RelatorioIndividualAnual,
  RelatorioSetorMensal,
  RelatorioSetorAnual,
  RelatorioPessoa,
} from "../types/interfaces";
import { FaFilter, FaChartLine } from "react-icons/fa";
import { MdPictureAsPdf } from "react-icons/md";
import { gerarPDFRelatorio } from "../utils/pdfGenerator";
import { RelatorioGraficos } from "../components/relatorios/RelatorioGraficos";
import { RelatorioAnualComponent } from "../components/relatorios/RelatorioAnualComponent";
import { RelatorioMensalComponent } from "../components/relatorios/RelatorioMensalComponent";
import RelatorioIndividualComponent from "../components/relatorios/RelatorioIndividualComponent";
import RelatorioSetorDetalhadoComponent from "../components/relatorios/RelatorioSetorDetalhadoComponent";
import { Sidebar } from "../components/elements/Sidebar";

export const RelatoriosPage = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [tipoRelatorio, setTipoRelatorio] = useState<"mensal" | "anual">(
    "mensal"
  );
  const [tipoVisualizacao, setTipoVisualizacao] = useState<
    "geral" | "setor" | "individual"
  >("geral");
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    tipoRelatorio: "geral",
  });
  const [relatorioMensal, setRelatorioMensal] =
    useState<RelatorioMensal | null>(null);
  const [relatorioAnual, setRelatorioAnual] = useState<RelatorioAnual | null>(
    null
  );
  const [relatorioIndividualMensal, setRelatorioIndividualMensal] =
    useState<RelatorioIndividualMensal | null>(null);
  const [relatorioIndividualAnual, setRelatorioIndividualAnual] =
    useState<RelatorioIndividualAnual | null>(null);
  const [relatorioSetorMensal, setRelatorioSetorMensal] =
    useState<RelatorioSetorMensal | null>(null);
  const [relatorioSetorAnual, setRelatorioSetorAnual] =
    useState<RelatorioSetorAnual | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    gerarRelatorio();
  }, [filtros, tipoRelatorio, tipoVisualizacao]);

  const gerarRelatorio = async () => {
    if (tipoVisualizacao === "setor" && !filtros.setorId) {
      alert(
        "Por favor, selecione um setor específico para visualizar o relatório por setor."
      );
      return;
    }

    if (tipoVisualizacao === "individual" && !filtros.usuarioId) {
      alert(
        "Por favor, selecione uma pessoa específica para visualizar o relatório individual."
      );
      return;
    }

    setLoading(true);
    try {
      setRelatorioMensal(null);
      setRelatorioAnual(null);
      setRelatorioIndividualMensal(null);
      setRelatorioIndividualAnual(null);
      setRelatorioSetorMensal(null);
      setRelatorioSetorAnual(null);

      if (tipoVisualizacao === "geral") {
        if (tipoRelatorio === "mensal") {
          const relatorio = await gerarRelatorioMensal(filtros);
          setRelatorioMensal(relatorio);
        } else {
          const relatorio = await gerarRelatorioAnual(filtros);
          setRelatorioAnual(relatorio);
        }
      } else if (tipoVisualizacao === "individual") {
        if (tipoRelatorio === "mensal") {
          const relatorio = await gerarRelatorioIndividualMensal(filtros);
          setRelatorioIndividualMensal(relatorio);
        } else {
          const relatorio = await gerarRelatorioIndividualAnual(filtros);
          setRelatorioIndividualAnual(relatorio);
        }
      } else if (tipoVisualizacao === "setor") {
        if (tipoRelatorio === "mensal") {
          const relatorio = await gerarRelatorioSetorMensal(filtros);
          setRelatorioSetorMensal(relatorio);
        } else {
          const relatorio = await gerarRelatorioSetorAnual(filtros);
          setRelatorioSetorAnual(relatorio);
        }
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao gerar relatório. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioMensal = async (
    filtros: FiltrosRelatorio
  ): Promise<RelatorioMensal> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mesAtual = filtros.mes || new Date().getMonth() + 1;
    const anoAtual = filtros.ano;

    const setoresMock: RelatorioSetor[] = [
      {
        id: "1",
        nome: "Recursos Humanos",
        responsavel: "João Silva",
        totalAtividades: Math.floor(Math.random() * 15) + 20,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 8,
        percentualConclusao: 0,
      },
      {
        id: "2",
        nome: "Tecnologia da Informação",
        responsavel: "Maria Santos",
        totalAtividades: Math.floor(Math.random() * 20) + 30,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 12,
        percentualConclusao: 0,
      },
      {
        id: "3",
        nome: "Financeiro",
        responsavel: "Pedro Costa",
        totalAtividades: Math.floor(Math.random() * 10) + 15,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 5,
        percentualConclusao: 0,
      },
      {
        id: "4",
        nome: "Marketing",
        responsavel: "Ana Paula",
        totalAtividades: Math.floor(Math.random() * 12) + 18,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 6,
        percentualConclusao: 0,
      },
      {
        id: "5",
        nome: "Jurídico",
        responsavel: "Carlos Mendes",
        totalAtividades: Math.floor(Math.random() * 8) + 10,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 3,
        percentualConclusao: 0,
      },
    ];

    setoresMock.forEach((setor) => {
      const total = setor.totalAtividades;
      const taxaConclusao = Math.random() * 0.4 + 0.6;

      setor.atividadesConcluidas = Math.floor(total * taxaConclusao);
      const restantes = total - setor.atividadesConcluidas;

      setor.atividadesEmAndamento = Math.floor(restantes * 0.6);
      setor.atividadesPendentes = Math.floor(restantes * 0.3);
      setor.atividadesAtrasadas =
        restantes - setor.atividadesEmAndamento - setor.atividadesPendentes;

      setor.percentualConclusao = (setor.atividadesConcluidas / total) * 100;
    });

    let setoresFiltrados = setoresMock;
    if (filtros.setorId) {
      setoresFiltrados = setoresMock.filter(
        (setor) => setor.id === filtros.setorId
      );
    }

    const totalAtividades = setoresFiltrados.reduce(
      (acc, setor) => acc + setor.totalAtividades,
      0
    );
    const totalConcluidas = setoresFiltrados.reduce(
      (acc, setor) => acc + setor.atividadesConcluidas,
      0
    );

    return {
      mes: mesAtual,
      ano: anoAtual,
      dataGeracao: new Date(),
      setores: setoresFiltrados,
      totalGeralAtividades: totalAtividades,
      totalAtividadesConcluidas: totalConcluidas,
      percentualGeralConclusao:
        totalAtividades > 0 ? (totalConcluidas / totalAtividades) * 100 : 0,
    };
  };

  const gerarRelatorioAnual = async (
    filtros: FiltrosRelatorio
  ): Promise<RelatorioAnual> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const anoAtual = filtros.ano;

    const evolucaoMensal = Array.from({ length: 12 }, (_, index) => {
      const mes = index + 1;
      let baseAtividades = 40;
      if (mes === 1 || mes === 12) baseAtividades = 25;
      if (mes >= 3 && mes <= 6) baseAtividades = 50;
      if (mes >= 9 && mes <= 11) baseAtividades = 45;

      const totalAtividades = baseAtividades + Math.floor(Math.random() * 15);
      const percentualConclusao = Math.random() * 25 + 70;
      const atividadesConcluidas = Math.floor(
        totalAtividades * (percentualConclusao / 100)
      );

      return {
        mes,
        totalAtividades,
        atividadesConcluidas,
        percentualConclusao: Math.round(percentualConclusao * 10) / 10,
      };
    });

    const setoresAnuais: RelatorioSetor[] = [
      {
        id: "1",
        nome: "Recursos Humanos",
        responsavel: "João Silva",
        totalAtividades: 0,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 8,
        percentualConclusao: 0,
      },
      {
        id: "2",
        nome: "Tecnologia da Informação",
        responsavel: "Maria Santos",
        totalAtividades: 0,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 12,
        percentualConclusao: 0,
      },
      {
        id: "3",
        nome: "Financeiro",
        responsavel: "Pedro Costa",
        totalAtividades: 0,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 5,
        percentualConclusao: 0,
      },
      {
        id: "4",
        nome: "Marketing",
        responsavel: "Ana Paula",
        totalAtividades: 0,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 6,
        percentualConclusao: 0,
      },
      {
        id: "5",
        nome: "Jurídico",
        responsavel: "Carlos Mendes",
        totalAtividades: 0,
        atividadesConcluidas: 0,
        atividadesPendentes: 0,
        atividadesEmAndamento: 0,
        atividadesAtrasadas: 0,
        atividades: [],
        membrosAtivos: 3,
        percentualConclusao: 0,
      },
    ];

    setoresAnuais.forEach((setor) => {
      const fatorSetor = setor.membrosAtivos / 8;
      const totalAnual = Math.floor(
        evolucaoMensal.reduce((acc, mes) => acc + mes.totalAtividades, 0) *
          fatorSetor
      );
      const taxaConclusaoSetor = Math.random() * 0.2 + 0.75;

      setor.totalAtividades = totalAnual;
      setor.atividadesConcluidas = Math.floor(totalAnual * taxaConclusaoSetor);

      const restantes = totalAnual - setor.atividadesConcluidas;
      setor.atividadesEmAndamento = Math.floor(restantes * 0.5);
      setor.atividadesPendentes = Math.floor(restantes * 0.4);
      setor.atividadesAtrasadas =
        restantes - setor.atividadesEmAndamento - setor.atividadesPendentes;

      setor.percentualConclusao =
        (setor.atividadesConcluidas / setor.totalAtividades) * 100;
    });

    let setoresFiltrados = setoresAnuais;
    if (filtros.setorId) {
      setoresFiltrados = setoresAnuais.filter(
        (setor) => setor.id === filtros.setorId
      );
    }

    const totalGeralAtividades = setoresFiltrados.reduce(
      (acc, setor) => acc + setor.totalAtividades,
      0
    );
    const totalAtividadesConcluidas = setoresFiltrados.reduce(
      (acc, setor) => acc + setor.atividadesConcluidas,
      0
    );

    return {
      ano: anoAtual,
      dataGeracao: new Date(),
      setores: setoresFiltrados,
      relatoriosMensais: [],
      totalGeralAtividades,
      totalAtividadesConcluidas,
      percentualGeralConclusao:
        totalGeralAtividades > 0
          ? (totalAtividadesConcluidas / totalGeralAtividades) * 100
          : 0,
      evolucaoMensal,
    };
  };

  const gerarRelatorioIndividualMensal = async (
    filtros: FiltrosRelatorio
  ): Promise<RelatorioIndividualMensal> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const pessoas = [
      {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        cargo: "Gerente de RH",
        setor: "Recursos Humanos",
      },
      {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        cargo: "Desenvolvedora Senior",
        setor: "TI",
      },
      {
        id: "3",
        nome: "Pedro Costa",
        email: "pedro@email.com",
        cargo: "Analista Financeiro",
        setor: "Financeiro",
      },
      {
        id: "4",
        nome: "Ana Paula",
        email: "ana@email.com",
        cargo: "Coordenadora de Marketing",
        setor: "Marketing",
      },
      {
        id: "5",
        nome: "Carlos Mendes",
        email: "carlos@email.com",
        cargo: "Advogado",
        setor: "Jurídico",
      },
    ];

    const pessoaSelecionada = filtros.usuarioId
      ? pessoas.find((p) => p.id === filtros.usuarioId)
      : pessoas[0];

    if (!pessoaSelecionada) throw new Error("Pessoa não encontrada");

    const totalAtividades = Math.floor(Math.random() * 15) + 10;
    const taxaConclusao = Math.random() * 0.3 + 0.65;
    const atividadesConcluidas = Math.floor(totalAtividades * taxaConclusao);
    const restantes = totalAtividades - atividadesConcluidas;

    const pessoa: RelatorioPessoa = {
      ...pessoaSelecionada,
      totalAtividades,
      atividadesConcluidas,
      atividadesEmAndamento: Math.floor(restantes * 0.6),
      atividadesPendentes: Math.floor(restantes * 0.3),
      atividadesAtrasadas: Math.floor(restantes * 0.1),
      percentualConclusao: (atividadesConcluidas / totalAtividades) * 100,
      atividades: [],
      horasTrabalhadas: Math.floor(Math.random() * 40) + 120,
      avaliacaoDesempenho:
        taxaConclusao > 0.9
          ? "excelente"
          : taxaConclusao > 0.8
          ? "bom"
          : taxaConclusao > 0.7
          ? "regular"
          : "precisa_melhorar",
    };

    return {
      mes: filtros.mes || new Date().getMonth() + 1,
      ano: filtros.ano,
      dataGeracao: new Date(),
      pessoa,
      comparativoSetor: {
        mediaSetorAtividades: Math.floor(Math.random() * 10) + 15,
        mediaSetorConclusao: Math.floor(Math.random() * 20) + 75,
        posicaoRanking: Math.floor(Math.random() * 8) + 1,
        totalPessoasSetor: Math.floor(Math.random() * 5) + 8,
      },
      evolucaoSemanal: Array.from({ length: 4 }, (_, index) => ({
        semana: index + 1,
        totalAtividades: Math.floor(Math.random() * 8) + 2,
        atividadesConcluidas: Math.floor(Math.random() * 6) + 1,
        percentualConclusao: Math.floor(Math.random() * 30) + 70,
      })),
    };
  };

  const gerarRelatorioIndividualAnual = async (
    filtros: FiltrosRelatorio
  ): Promise<RelatorioIndividualAnual> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const relatorioMensal = await gerarRelatorioIndividualMensal(filtros);

    const evolucaoMensal = Array.from({ length: 12 }, (_, index) => ({
      mes: index + 1,
      totalAtividades: Math.floor(Math.random() * 20) + 10,
      atividadesConcluidas: Math.floor(Math.random() * 15) + 8,
      percentualConclusao: Math.floor(Math.random() * 25) + 70,
      horasTrabalhadas: Math.floor(Math.random() * 40) + 120,
    }));

    const totalAnual = evolucaoMensal.reduce(
      (acc, mes) => acc + mes.totalAtividades,
      0
    );
    const concluidasAnual = evolucaoMensal.reduce(
      (acc, mes) => acc + mes.atividadesConcluidas,
      0
    );

    return {
      ano: filtros.ano,
      dataGeracao: new Date(),
      pessoa: {
        ...relatorioMensal.pessoa,
        totalAtividades: totalAnual,
        atividadesConcluidas: concluidasAnual,
        percentualConclusao: (concluidasAnual / totalAnual) * 100,
      },
      evolucaoMensal,
      comparativoAnual: {
        mediaSetorAtividades: Math.floor(Math.random() * 50) + 150,
        mediaSetorConclusao: Math.floor(Math.random() * 15) + 80,
        posicaoRankingAnual: Math.floor(Math.random() * 8) + 1,
        melhorMes: evolucaoMensal.reduce((prev, current) =>
          prev.percentualConclusao > current.percentualConclusao
            ? prev
            : current
        ).mes,
        piorMes: evolucaoMensal.reduce((prev, current) =>
          prev.percentualConclusao < current.percentualConclusao
            ? prev
            : current
        ).mes,
      },
      metas: {
        metaAtividadesMensais: 20,
        metaConclusaoPercentual: 85,
        metaAlcancada: (concluidasAnual / totalAnual) * 100 >= 85,
      },
    };
  };

  const gerarRelatorioSetorMensal = async (
    filtros: FiltrosRelatorio
  ): Promise<RelatorioSetorMensal> => {
    await new Promise((resolve) => setTimeout(resolve, 1300));

    const setores = [
      {
        id: "1",
        nome: "Recursos Humanos",
        responsavel: "João Silva",
        membros: 8,
      },
      {
        id: "2",
        nome: "Tecnologia da Informação",
        responsavel: "Maria Santos",
        membros: 12,
      },
      { id: "3", nome: "Financeiro", responsavel: "Pedro Costa", membros: 5 },
      { id: "4", nome: "Marketing", responsavel: "Ana Paula", membros: 6 },
      { id: "5", nome: "Jurídico", responsavel: "Carlos Mendes", membros: 3 },
    ];

    const setorInfo = filtros.setorId
      ? setores.find((s) => s.id === filtros.setorId)
      : setores[0];

    if (!setorInfo) throw new Error("Setor não encontrado");

    const totalAtividades = Math.floor(Math.random() * 30) + 50;
    const taxaConclusao = Math.random() * 0.2 + 0.75;
    const atividadesConcluidas = Math.floor(totalAtividades * taxaConclusao);

    const membrosSetor: RelatorioPessoa[] = Array.from(
      { length: setorInfo.membros },
      (_, index) => {
        const ativPessoa = Math.floor(Math.random() * 8) + 5;
        const conclPessoa = Math.floor(
          ativPessoa * (Math.random() * 0.3 + 0.7)
        );

        return {
          id: `${setorInfo.id}-${index + 1}`,
          nome: `Funcionário ${index + 1}`,
          email: `funcionario${index + 1}@email.com`,
          cargo: `Cargo ${index + 1}`,
          setor: setorInfo.nome,
          totalAtividades: ativPessoa,
          atividadesConcluidas: conclPessoa,
          atividadesPendentes: Math.floor((ativPessoa - conclPessoa) * 0.6),
          atividadesEmAndamento: Math.floor((ativPessoa - conclPessoa) * 0.3),
          atividadesAtrasadas: Math.floor((ativPessoa - conclPessoa) * 0.1),
          percentualConclusao: (conclPessoa / ativPessoa) * 100,
          atividades: [],
        };
      }
    );

    return {
      mes: filtros.mes || new Date().getMonth() + 1,
      ano: filtros.ano,
      dataGeracao: new Date(),
      setor: {
        id: setorInfo.id,
        nome: setorInfo.nome,
        responsavel: setorInfo.responsavel,
        descricao: `Setor responsável por ${setorInfo.nome.toLowerCase()}`,
        totalAtividades,
        atividadesConcluidas,
        atividadesPendentes: Math.floor(
          (totalAtividades - atividadesConcluidas) * 0.5
        ),
        atividadesEmAndamento: Math.floor(
          (totalAtividades - atividadesConcluidas) * 0.4
        ),
        atividadesAtrasadas: Math.floor(
          (totalAtividades - atividadesConcluidas) * 0.1
        ),
        percentualConclusao: (atividadesConcluidas / totalAtividades) * 100,
        membros: membrosSetor,
        distribuicaoTipoAtividade: [
          {
            tipo: "MEETING",
            quantidade: Math.floor(totalAtividades * 0.3),
            percentual: 30,
          },
          {
            tipo: "ACTIVITY",
            quantidade: Math.floor(totalAtividades * 0.4),
            percentual: 40,
          },
          {
            tipo: "DOCUMENT",
            quantidade: Math.floor(totalAtividades * 0.2),
            percentual: 20,
          },
          {
            tipo: "EXTERNAL_ACTIVITY",
            quantidade: Math.floor(totalAtividades * 0.1),
            percentual: 10,
          },
        ],
        distribuicaoPrioridade: [
          {
            prioridade: "HIGH",
            quantidade: Math.floor(totalAtividades * 0.2),
            percentual: 20,
          },
          {
            prioridade: "MEDIUM",
            quantidade: Math.floor(totalAtividades * 0.5),
            percentual: 50,
          },
          {
            prioridade: "LOW",
            quantidade: Math.floor(totalAtividades * 0.3),
            percentual: 30,
          },
        ],
      },
      comparativoGeral: {
        posicaoRanking: Math.floor(Math.random() * 5) + 1,
        totalSetores: 5,
        mediaGeralConclusao: Math.floor(Math.random() * 10) + 80,
      },
    };
  };

  const gerarRelatorioSetorAnual = async (
    filtros: FiltrosRelatorio
  ): Promise<RelatorioSetorAnual> => {
    await new Promise((resolve) => setTimeout(resolve, 1600));

    const relatorioMensal = await gerarRelatorioSetorMensal(filtros);

    const evolucaoMensal = Array.from({ length: 12 }, (_, index) => ({
      mes: index + 1,
      totalAtividades: Math.floor(Math.random() * 40) + 30,
      atividadesConcluidas: Math.floor(Math.random() * 30) + 25,
      percentualConclusao: Math.floor(Math.random() * 20) + 75,
      totalMembrosAtivos:
        relatorioMensal.setor.membros.length +
        Math.floor(Math.random() * 3) -
        1,
    }));

    const totalAnual = evolucaoMensal.reduce(
      (acc, mes) => acc + mes.totalAtividades,
      0
    );
    const concluidasAnual = evolucaoMensal.reduce(
      (acc, mes) => acc + mes.atividadesConcluidas,
      0
    );

    return {
      ano: filtros.ano,
      dataGeracao: new Date(),
      setor: {
        ...relatorioMensal.setor,
        totalAtividades: totalAnual,
        atividadesConcluidas: concluidasAnual,
        percentualConclusao: (concluidasAnual / totalAnual) * 100,
      },
      evolucaoMensal,
      rankingMembros: relatorioMensal.setor.membros.sort(
        (a, b) => b.percentualConclusao - a.percentualConclusao
      ),
      metasSetor: {
        metaAtividadesMensais: 60,
        metaConclusaoPercentual: 85,
        metaAlcancada: (concluidasAnual / totalAnual) * 100 >= 85,
        mesesComMetaAlcancada: evolucaoMensal.filter(
          (mes) => mes.percentualConclusao >= 85
        ).length,
      },
    };
  };

  const exportarPDF = () => {
    const dadosRelatorio =
      tipoVisualizacao === "geral"
        ? tipoRelatorio === "mensal"
          ? relatorioMensal
          : relatorioAnual
        : tipoVisualizacao === "individual"
        ? tipoRelatorio === "mensal"
          ? relatorioIndividualMensal
          : relatorioIndividualAnual
        : tipoRelatorio === "mensal"
        ? relatorioSetorMensal
        : relatorioSetorAnual;

    if (!dadosRelatorio) {
      alert("Nenhum relatório disponível para exportação");
      return;
    }

    try {
      if (tipoVisualizacao === "geral" && tipoRelatorio === "mensal") {
        gerarPDFRelatorio.mensal(dadosRelatorio as RelatorioMensal);
      } else if (tipoVisualizacao === "individual") {
        gerarPDFRelatorio.individual(
          dadosRelatorio as
            | RelatorioIndividualMensal
            | RelatorioIndividualAnual,
          tipoRelatorio === "mensal" ? "mensal" : "anual"
        );
      } else if (tipoVisualizacao === "setor") {
        gerarPDFRelatorio.setor(
          dadosRelatorio as RelatorioSetorMensal | RelatorioSetorAnual,
          tipoRelatorio === "mensal" ? "mensal" : "anual"
        );
      } else {
        alert(
          "Geração de PDF para relatórios anuais gerais ainda não implementada"
        );
        return;
      }

      alert("PDF gerado e baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
    }
  };

  const exportarExcel = () => {
    const dadosRelatorio =
      tipoVisualizacao === "geral"
        ? tipoRelatorio === "mensal"
          ? relatorioMensal
          : relatorioAnual
        : tipoVisualizacao === "individual"
        ? tipoRelatorio === "mensal"
          ? relatorioIndividualMensal
          : relatorioIndividualAnual
        : tipoRelatorio === "mensal"
        ? relatorioSetorMensal
        : relatorioSetorAnual;

    if (!dadosRelatorio) {
      alert("Nenhum relatório disponível para exportação");
      return;
    }

    let nomeArquivo = "";
    let infoAdicional = "";

    if (tipoVisualizacao === "individual") {
      const pessoa = (dadosRelatorio as any).pessoa?.nome || "usuario";
      nomeArquivo = `relatorio-individual-${pessoa.replace(
        /\s+/g,
        "-"
      )}-${tipoRelatorio}-${dadosRelatorio.ano}`;
      infoAdicional = `${
        (dadosRelatorio as any).pessoa?.totalAtividades || 0
      } atividades`;
    } else if (tipoVisualizacao === "setor") {
      const setor = (dadosRelatorio as any).setor?.nome || "setor";
      nomeArquivo = `relatorio-setor-${setor.replace(
        /\s+/g,
        "-"
      )}-${tipoRelatorio}-${dadosRelatorio.ano}`;
      infoAdicional = `${
        (dadosRelatorio as any).setor?.membros?.length || 0
      } membros`;
    } else {
      nomeArquivo = `relatorio-geral-${tipoRelatorio}-${dadosRelatorio.ano}`;
      infoAdicional = `${(dadosRelatorio as any).setores?.length || 0} setores`;
    }

    if (tipoRelatorio === "mensal") {
      nomeArquivo += `-${(dadosRelatorio as any).mes || "todos"}`;
    }
    nomeArquivo += ".xlsx";

    console.log(`Gerando Excel: ${nomeArquivo}`);
    console.log("Dados do relatório:", dadosRelatorio);

    alert(`Excel "${nomeArquivo}" seria gerado com dados de ${infoAdicional}`);
  };

  const atualizarRelatorio = () => {
    gerarRelatorio();
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="flex">
        <Sidebar
          isOpen={isOpen}
          activeView="relatorios"
          onToggle={toggleSidebar}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div
            className={`p-6 ${
              theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-900"
            }`}
          >
            <div
              className={`mb-6 p-4 rounded-lg shadow ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    Relatórios de Atividades
                  </h1>
                  {(relatorioMensal || relatorioAnual) && (
                    <p
                      className={`text-sm mt-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Última atualização: {new Date().toLocaleString("pt-BR")} |
                      Tipo: {tipoRelatorio === "mensal" ? "Mensal" : "Anual"} |
                      {tipoRelatorio === "mensal" &&
                        relatorioMensal &&
                        ` Mês: ${relatorioMensal.mes}/${relatorioMensal.ano}`}
                      {tipoRelatorio === "anual" &&
                        relatorioAnual &&
                        ` Ano: ${relatorioAnual.ano}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFiltros(!showFiltros)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <FaFilter />
                    Filtros
                  </button>
                  <button
                    onClick={exportarPDF}
                    disabled={!relatorioMensal && !relatorioAnual}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === "dark"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    <MdPictureAsPdf />
                    PDF
                  </button>
                </div>
              </div>

              {showFiltros && (
                <div
                  className={`p-6 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-center">
                          Tipo de Visualização
                        </label>
                        <select
                          value={tipoVisualizacao}
                          onChange={(e) => {
                            const novoTipo = e.target.value as
                              | "geral"
                              | "setor"
                              | "individual";
                            setTipoVisualizacao(novoTipo);
                            if (novoTipo === "geral") {
                              setFiltros({
                                ...filtros,
                                setorId: "",
                                usuarioId: "",
                              });
                            } else if (novoTipo === "setor") {
                              setFiltros({ ...filtros, usuarioId: "" });
                            } else if (novoTipo === "individual") {
                            }
                          }}
                          className={`w-full p-3 rounded-lg border-2 text-center font-medium ${
                            theme === "dark"
                              ? "bg-gray-600 border-gray-500 text-white hover:border-purple-400"
                              : "bg-white border-gray-300 hover:border-purple-400"
                          } transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-200`}
                        >
                          <option value="geral"> Relatório Geral</option>
                          <option value="setor"> Por Setor Específico</option>
                          <option value="individual"> Individual</option>
                        </select>
                        <div className="text-xs text-gray-500 mt-2 text-center px-2">
                          {tipoVisualizacao === "geral" &&
                            "Visão geral de todos os setores"}
                          {tipoVisualizacao === "setor" &&
                            "Dados detalhados de um setor específico"}
                          {tipoVisualizacao === "individual" &&
                            "Dados detalhados de uma pessoa específica"}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-center">
                          Período
                        </label>
                        <select
                          value={tipoRelatorio}
                          onChange={(e) =>
                            setTipoRelatorio(
                              e.target.value as "mensal" | "anual"
                            )
                          }
                          className={`w-full p-3 rounded-lg border-2 text-center font-medium ${
                            theme === "dark"
                              ? "bg-gray-600 border-gray-500 text-white hover:border-blue-400"
                              : "bg-white border-gray-300 hover:border-blue-400"
                          } transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                        >
                          <option value="mensal"> Mensal</option>
                          <option value="anual"> Anual</option>
                        </select>
                      </div>
                    </div>

                    <div
                      className={`grid gap-4 mb-4 ${
                        tipoRelatorio === "mensal"
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      <div
                        className={
                          tipoRelatorio === "anual" ? "max-w-xs mx-auto" : ""
                        }
                      >
                        <label className="block text-sm font-semibold mb-2 text-center">
                          Ano
                        </label>
                        <input
                          type="number"
                          min="2020"
                          max="2030"
                          value={filtros.ano}
                          onChange={(e) =>
                            setFiltros({
                              ...filtros,
                              ano: parseInt(e.target.value),
                            })
                          }
                          className={`w-full p-3 rounded-lg border-2 text-center font-medium ${
                            theme === "dark"
                              ? "bg-gray-600 border-gray-500 text-white hover:border-green-400"
                              : "bg-white border-gray-300 hover:border-green-400"
                          } transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                        />
                      </div>

                      {tipoRelatorio === "mensal" && (
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-center">
                            Mês
                          </label>
                          <select
                            value={filtros.mes || ""}
                            onChange={(e) =>
                              setFiltros({
                                ...filtros,
                                mes: parseInt(e.target.value),
                              })
                            }
                            className={`w-full p-3 rounded-lg border-2 text-center font-medium ${
                              theme === "dark"
                                ? "bg-gray-600 border-gray-500 text-white hover:border-green-400"
                                : "bg-white border-gray-300 hover:border-green-400"
                            } transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                          >
                            <option value="">Todos os meses</option>
                            <option value={1}>Janeiro</option>
                            <option value={2}>Fevereiro</option>
                            <option value={3}>Março</option>
                            <option value={4}>Abril</option>
                            <option value={5}>Maio</option>
                            <option value={6}>Junho</option>
                            <option value={7}>Julho</option>
                            <option value={8}>Agosto</option>
                            <option value={9}>Setembro</option>
                            <option value={10}>Outubro</option>
                            <option value={11}>Novembro</option>
                            <option value={12}>Dezembro</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {(tipoVisualizacao === "setor" ||
                      tipoVisualizacao === "individual") && (
                      <div
                        className={`grid gap-4 mb-6 ${
                          tipoVisualizacao === "individual"
                            ? "grid-cols-1 md:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                      >
                        <div
                          className={
                            tipoVisualizacao === "setor"
                              ? "max-w-md mx-auto"
                              : ""
                          }
                        >
                          <label className="block text-sm font-semibold mb-2 text-center">
                            {tipoVisualizacao === "setor"
                              ? "Setor Específico"
                              : "Setor da Pessoa"}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            value={filtros.setorId || ""}
                            onChange={(e) =>
                              setFiltros({
                                ...filtros,
                                setorId: e.target.value,
                              })
                            }
                            className={`w-full p-3 rounded-lg border-2 text-center font-medium ${
                              theme === "dark"
                                ? "bg-gray-600 border-gray-500 text-white hover:border-orange-400"
                                : "bg-white border-gray-300 hover:border-orange-400"
                            } transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200 ${
                              !filtros.setorId ? "border-red-400" : ""
                            }`}
                          >
                            <option value="">
                              {tipoVisualizacao === "setor"
                                ? "Selecione um setor específico"
                                : "Selecione o setor da pessoa"}
                            </option>
                            <option value="1">Recursos Humanos</option>
                            <option value="2">Tecnologia da Informação</option>
                            <option value="3">Financeiro</option>
                            <option value="4">Marketing</option>
                            <option value="5">Jurídico</option>
                          </select>
                          {!filtros.setorId && (
                            <p className="text-red-500 text-xs mt-1 text-center">
                              ⚠️ Campo obrigatório
                            </p>
                          )}
                        </div>

                        {tipoVisualizacao === "individual" && (
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-center">
                              Pessoa Específica
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                              value={filtros.usuarioId || ""}
                              onChange={(e) =>
                                setFiltros({
                                  ...filtros,
                                  usuarioId: e.target.value,
                                })
                              }
                              className={`w-full p-3 rounded-lg border-2 text-center font-medium ${
                                theme === "dark"
                                  ? "bg-gray-600 border-gray-500 text-white hover:border-pink-400"
                                  : "bg-white border-gray-300 hover:border-pink-400"
                              } transition-colors focus:border-pink-500 focus:ring-2 focus:ring-pink-200 ${
                                !filtros.usuarioId ? "border-red-400" : ""
                              }`}
                            >
                              <option value="">
                                Selecione uma pessoa específica
                              </option>
                              <option value="1">João Silva (RH)</option>
                              <option value="2">Maria Santos (TI)</option>
                              <option value="3">
                                Pedro Costa (Financeiro)
                              </option>
                              <option value="4">Ana Paula (Marketing)</option>
                              <option value="5">
                                Carlos Mendes (Jurídico)
                              </option>
                            </select>
                            {!filtros.usuarioId && (
                              <p className="text-red-500 text-xs mt-1 text-center">
                                ⚠️ Campo obrigatório
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-center">
                      <button
                        onClick={atualizarRelatorio}
                        disabled={
                          (tipoVisualizacao === "setor" && !filtros.setorId) ||
                          (tipoVisualizacao === "individual" &&
                            !filtros.usuarioId)
                        }
                        className={`px-8 py-3 rounded-lg flex items-center gap-3 font-semibold text-lg transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white disabled:from-gray-600 disabled:to-gray-700"
                            : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white disabled:from-gray-400 disabled:to-gray-500"
                        }`}
                        title={
                          tipoVisualizacao === "setor" && !filtros.setorId
                            ? "Selecione um setor específico"
                            : tipoVisualizacao === "individual" &&
                              !filtros.usuarioId
                            ? "Selecione uma pessoa específica"
                            : "Gerar Relatório"
                        }
                      >
                        <FaFilter className="text-xl" />✨ Gerar Relatório
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div>
                {tipoVisualizacao === "geral" && (
                  <>
                    {tipoRelatorio === "mensal" && relatorioMensal && (
                      <>
                        <RelatorioMensalComponent relatorio={relatorioMensal} />
                        <RelatorioGraficos
                          relatorio={relatorioMensal}
                          tipo="mensal"
                        />
                      </>
                    )}
                    {tipoRelatorio === "anual" && relatorioAnual && (
                      <>
                        <RelatorioAnualComponent relatorio={relatorioAnual} />
                        <RelatorioGraficos
                          relatorio={relatorioAnual}
                          tipo="anual"
                        />
                      </>
                    )}
                  </>
                )}

                {tipoVisualizacao === "setor" && (
                  <>
                    {tipoRelatorio === "mensal" && relatorioSetorMensal && (
                      <RelatorioSetorDetalhadoComponent
                        relatorio={relatorioSetorMensal}
                        tipoRelatorio="mensal"
                      />
                    )}
                    {tipoRelatorio === "anual" && relatorioSetorAnual && (
                      <RelatorioSetorDetalhadoComponent
                        relatorio={relatorioSetorAnual}
                        tipoRelatorio="anual"
                      />
                    )}
                  </>
                )}

                {tipoVisualizacao === "individual" && (
                  <>
                    {tipoRelatorio === "mensal" &&
                      relatorioIndividualMensal && (
                        <RelatorioIndividualComponent
                          relatorio={relatorioIndividualMensal}
                          tipoRelatorio="mensal"
                        />
                      )}
                    {tipoRelatorio === "anual" && relatorioIndividualAnual && (
                      <RelatorioIndividualComponent
                        relatorio={relatorioIndividualAnual}
                        tipoRelatorio="anual"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
