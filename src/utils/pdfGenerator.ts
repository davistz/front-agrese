// src/utils/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  RelatorioMensal,
  RelatorioAnual,
  RelatorioIndividualMensal,
  RelatorioIndividualAnual,
  RelatorioSetorMensal,
  RelatorioSetorAnual,
} from "../types/interfaces";

export class PDFGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF();
    this.setupFont();
  }

  private setupFont() {
    this.pdf.setFont("helvetica");
  }

  private addHeader(titulo: string, periodo: string) {
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(88, 28, 135);
    this.pdf.text("AGRESE - Sistema de Gestão", 20, 25);

    this.pdf.setFontSize(16);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(titulo, 20, 40);

    this.pdf.setFontSize(12);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(periodo, 20, 50);

    this.pdf.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
      20,
      60
    );

    this.pdf.setLineWidth(0.5);
    this.pdf.line(20, 70, 190, 70);

    return 80;
  }

  private addFooter() {
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.text("AGRESE © 2024", 20, 290);
    this.pdf.text("Relatório gerado automaticamente", 120, 290);
  }

  private traduzirTipoAtividade(tipo: string): string {
    switch (tipo.toUpperCase()) {
      case "MEETING":
        return "Reunião";
      case "ACTIVITY":
        return "Atividade";
      case "DOCUMENT":
        return "Documento";
      case "EXTERNAL_ACTIVITY":
        return "Atividade Externa";
      default:
        return tipo;
    }
  }

  private traduzirPrioridade(prioridade: string): string {
    switch (prioridade.toUpperCase()) {
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Média";
      case "LOW":
        return "Baixa";
      case "URGENT":
        return "Urgente";
      default:
        return prioridade;
    }
  }

  public gerarPDFRelatorioMensal(relatorio: RelatorioMensal): void {
    const titulo = "Relatório Mensal - Visão Geral";
    const periodo = `${relatorio.mes}/${relatorio.ano}`;

    let yPosition = this.addHeader(titulo, periodo);

    this.pdf.setFontSize(14);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text("Resumo Executivo", 20, yPosition);
    yPosition += 15;

    this.pdf.setFontSize(10);
    const resumo = [
      `Total de Atividades: ${relatorio.totalGeralAtividades}`,
      `Atividades Concluídas: ${
        relatorio.totalAtividadesConcluidas
      } (${relatorio.percentualGeralConclusao.toFixed(1)}%)`,
      `Setores Analisados: ${relatorio.setores.length}`,
    ];

    resumo.forEach((linha) => {
      this.pdf.text(linha, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    this.pdf.setFontSize(12);
    this.pdf.text("Performance por Setor", 20, yPosition);
    yPosition += 10;

    const dadosSetores = relatorio.setores.map((setor, index) => [
      setor.nome,
      setor.totalAtividades.toString(),
      setor.atividadesConcluidas.toString(),
      `${setor.percentualConclusao.toFixed(1)}%`,
      (index + 1).toString(),
    ]);

    autoTable(this.pdf, {
      startY: yPosition,
      head: [["Setor", "Total", "Concluídas", "Taxa (%)", "Ranking"]],
      body: dadosSetores,
      theme: "grid",
      headStyles: { fillColor: [88, 28, 135] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 25, halign: "center" },
      },
    });

    this.addFooter();
  }

  public gerarPDFRelatorioIndividual(
    relatorio: RelatorioIndividualMensal | RelatorioIndividualAnual,
    tipo: "mensal" | "anual"
  ): void {
    const titulo = `Relatório Individual - ${relatorio.pessoa.nome}`;
    const periodo =
      tipo === "mensal" && "mes" in relatorio
        ? `${relatorio.mes}/${relatorio.ano}`
        : relatorio.ano.toString();

    let yPosition = this.addHeader(titulo, periodo);

    this.pdf.setFontSize(12);
    this.pdf.text("Informações Pessoais", 20, yPosition);
    yPosition += 10;

    const infoPessoa = [
      `Nome: ${relatorio.pessoa.nome}`,
      `Cargo: ${relatorio.pessoa.cargo}`,
      `Setor: ${relatorio.pessoa.setor}`,
      `Email: ${relatorio.pessoa.email}`,
    ];

    this.pdf.setFontSize(10);
    infoPessoa.forEach((info) => {
      this.pdf.text(info, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    this.pdf.setFontSize(12);
    this.pdf.text("Performance Individual", 20, yPosition);
    yPosition += 10;

    const dadosPerformance = [
      ["Métrica", "Valor"],
      ["Total de Atividades", relatorio.pessoa.totalAtividades.toString()],
      [
        "Atividades Concluídas",
        relatorio.pessoa.atividadesConcluidas.toString(),
      ],
      [
        "Atividades em Andamento",
        relatorio.pessoa.atividadesEmAndamento.toString(),
      ],
      ["Atividades Pendentes", relatorio.pessoa.atividadesPendentes.toString()],
      ["Atividades Atrasadas", relatorio.pessoa.atividadesAtrasadas.toString()],
      [
        "Taxa de Conclusão",
        `${relatorio.pessoa.percentualConclusao.toFixed(1)}%`,
      ],
    ];

    autoTable(this.pdf, {
      startY: yPosition,
      body: dadosPerformance,
      theme: "grid",
      headStyles: { fillColor: [88, 28, 135] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "bold" },
        1: { cellWidth: 60, halign: "center" },
      },
    });

    yPosition += 120;

    if (relatorio.pessoa.atividades && relatorio.pessoa.atividades.length > 0) {
      if (yPosition > 200) {
        this.pdf.addPage();
        yPosition = 30;
      }

      this.pdf.setFontSize(12);
      this.pdf.text("Detalhamento das Atividades", 20, yPosition);
      yPosition += 10;

      const dadosAtividades = relatorio.pessoa.atividades
        .slice(0, 15)
        .map((atividade) => [
          atividade.titulo,
          this.traduzirTipoAtividade(atividade.tipo),
          this.traduzirPrioridade(atividade.prioridade),
          atividade.status,
          atividade.dataInicio
            ? new Date(atividade.dataInicio).toLocaleDateString("pt-BR")
            : "N/A",
        ]);

      autoTable(this.pdf, {
        startY: yPosition,
        head: [["Título", "Tipo", "Prioridade", "Status", "Data Início"]],
        body: dadosAtividades,
        theme: "grid",
        headStyles: { fillColor: [88, 28, 135] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
        },
      });
    }

    this.addFooter();
  }

  public gerarPDFRelatorioSetor(
    relatorio: RelatorioSetorMensal | RelatorioSetorAnual,
    tipo: "mensal" | "anual"
  ): void {
    const titulo = `Relatório de Setor - ${relatorio.setor.nome}`;
    const periodo =
      tipo === "mensal" && "mes" in relatorio
        ? `${relatorio.mes}/${relatorio.ano}`
        : relatorio.ano.toString();

    let yPosition = this.addHeader(titulo, periodo);

    this.pdf.setFontSize(12);
    this.pdf.text("Informações do Setor", 20, yPosition);
    yPosition += 10;

    const infoSetor = [
      `Setor: ${relatorio.setor.nome}`,
      `Responsável: ${relatorio.setor.responsavel || "N/A"}`,
      `Total de Membros: ${relatorio.setor.membros?.length || 0}`,
    ];

    this.pdf.setFontSize(10);
    infoSetor.forEach((info) => {
      this.pdf.text(info, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    this.pdf.setFontSize(12);
    this.pdf.text("Métricas do Setor", 20, yPosition);
    yPosition += 10;

    const dadosMetricas = [
      ["Métrica", "Valor"],
      ["Total de Atividades", relatorio.setor.totalAtividades.toString()],
      [
        "Atividades Concluídas",
        relatorio.setor.atividadesConcluidas.toString(),
      ],
      [
        "Atividades em Andamento",
        relatorio.setor.atividadesEmAndamento.toString(),
      ],
      ["Atividades Pendentes", relatorio.setor.atividadesPendentes.toString()],
      ["Atividades Atrasadas", relatorio.setor.atividadesAtrasadas.toString()],
      [
        "Taxa de Conclusão",
        `${relatorio.setor.percentualConclusao.toFixed(1)}%`,
      ],
    ];

    autoTable(this.pdf, {
      startY: yPosition,
      body: dadosMetricas,
      theme: "grid",
      headStyles: { fillColor: [88, 28, 135] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "bold" },
        1: { cellWidth: 60, halign: "center" },
      },
    });

    yPosition += 120;

    if (relatorio.setor.membros && relatorio.setor.membros.length > 0) {
      if (yPosition > 200) {
        this.pdf.addPage();
        yPosition = 30;
      }

      this.pdf.setFontSize(12);
      this.pdf.text("Ranking de Membros", 20, yPosition);
      yPosition += 10;

      const dadosMembros = relatorio.setor.membros
        .slice(0, 10)
        .map((membro, index) => [
          (index + 1).toString(),
          membro.nome,
          membro.cargo,
          membro.totalAtividades.toString(),
          membro.atividadesConcluidas.toString(),
          `${membro.percentualConclusao.toFixed(1)}%`,
        ]);

      autoTable(this.pdf, {
        startY: yPosition,
        head: [["#", "Nome", "Cargo", "Total", "Concluídas", "Taxa (%)"]],
        body: dadosMembros,
        theme: "grid",
        headStyles: { fillColor: [88, 28, 135] },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 25, halign: "center" },
          5: { cellWidth: 20, halign: "center" },
        },
      });
    }

    this.addFooter();
  }

  public salvar(nomeArquivo: string): void {
    this.pdf.save(`${nomeArquivo}.pdf`);
  }

  public obterBlob(): Blob {
    return this.pdf.output("blob");
  }
}

export const gerarPDFRelatorio = {
  mensal: (relatorio: RelatorioMensal) => {
    const generator = new PDFGenerator();
    generator.gerarPDFRelatorioMensal(relatorio);
    generator.salvar(
      `relatorio-geral-mensal-${relatorio.mes}-${relatorio.ano}`
    );
  },

  individual: (
    relatorio: RelatorioIndividualMensal | RelatorioIndividualAnual,
    tipo: "mensal" | "anual"
  ) => {
    const generator = new PDFGenerator();
    generator.gerarPDFRelatorioIndividual(relatorio, tipo);
    const nomeArquivo = `relatorio-individual-${relatorio.pessoa.nome.replace(
      /\s+/g,
      "-"
    )}-${tipo}`;
    generator.salvar(nomeArquivo);
  },

  setor: (
    relatorio: RelatorioSetorMensal | RelatorioSetorAnual,
    tipo: "mensal" | "anual"
  ) => {
    const generator = new PDFGenerator();
    generator.gerarPDFRelatorioSetor(relatorio, tipo);
    const nomeArquivo = `relatorio-setor-${relatorio.setor.nome.replace(
      /\s+/g,
      "-"
    )}-${tipo}`;
    generator.salvar(nomeArquivo);
  },
};
