import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  RelatorioIndividualMensal,
  RelatorioIndividualAnual,
} from "../../types/interfaces";
import {
  FaUser,
  FaCalendar,
  FaTrophy,
  FaTasks,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaChartLine,
} from "react-icons/fa";

interface RelatorioIndividualProps {
  relatorio: RelatorioIndividualMensal | RelatorioIndividualAnual;
  tipoRelatorio: "mensal" | "anual";
}

const RelatorioIndividualComponent: React.FC<RelatorioIndividualProps> = ({
  relatorio,
  tipoRelatorio,
}) => {
  const { theme } = useTheme();

  const isMensal = (
    rel: RelatorioIndividualMensal | RelatorioIndividualAnual
  ): rel is RelatorioIndividualMensal => {
    return "mes" in rel;
  };

  const isAnual = (
    rel: RelatorioIndividualMensal | RelatorioIndividualAnual
  ): rel is RelatorioIndividualAnual => {
    return "evolucaoMensal" in rel;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluída":
      case "concluído":
        return "text-green-600";
      case "em andamento":
        return "text-yellow-600";
      case "pendente":
        return "text-orange-600";
      case "atrasado":
      case "atrasada":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPerformanceColor = (avaliacao?: string) => {
    switch (avaliacao?.toLowerCase()) {
      case "excelente":
        return "bg-green-100 text-green-800 border-green-200";
      case "bom":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "precisa_melhorar":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatAvaliacao = (avaliacao?: string) => {
    switch (avaliacao) {
      case "precisa_melhorar":
        return "Precisa Melhorar";
      default:
        return avaliacao || "Não Avaliado";
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-xl border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaUser
              className={`text-2xl ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <div>
              <h2 className="text-2xl font-bold">{relatorio.pessoa.nome}</h2>
              <p className="text-gray-500">
                {relatorio.pessoa.cargo} - {relatorio.pessoa.setor}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <FaCalendar className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {isMensal(relatorio)
                  ? `${relatorio.mes}/${relatorio.ano}`
                  : relatorio.ano}
              </span>
            </div>
            {relatorio.pessoa.avaliacaoDesempenho && (
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(
                  relatorio.pessoa.avaliacaoDesempenho
                )}`}
              >
                <FaTrophy className="mr-1" />
                {formatAvaliacao(relatorio.pessoa.avaliacaoDesempenho)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FaTasks className="text-blue-500 text-xl" />
          </div>
          <h3 className="text-2xl font-bold">
            {relatorio.pessoa.totalAtividades}
          </h3>
          <p className="text-sm text-gray-500">Atividades Totais</p>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold text-green-600">
            {relatorio.pessoa.atividadesConcluidas}
          </h3>
          <p className="text-sm text-gray-500">Concluídas</p>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold text-yellow-600">
            {relatorio.pessoa.atividadesEmAndamento}
          </h3>
          <p className="text-sm text-gray-500">Em Andamento</p>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-orange-500 text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-red-600">
            {relatorio.pessoa.atividadesAtrasadas}
          </h3>
          <p className="text-sm text-gray-500">Atrasadas</p>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaChartLine className="text-purple-500" />
            Taxa de Conclusão
          </h3>
          <span className="text-2xl font-bold text-purple-600">
            {relatorio.pessoa.percentualConclusao.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${relatorio.pessoa.percentualConclusao}%` }}
          ></div>
        </div>
      </div>

      {isMensal(relatorio) && (
        <div
          className={`p-6 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Comparativo com o Setor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">Posição no Ranking</h4>
              <div className="text-2xl font-bold text-purple-600">
                {relatorio.comparativoSetor.posicaoRanking}º
              </div>
              <div className="text-xs text-gray-500">
                de {relatorio.comparativoSetor.totalPessoasSetor} pessoas
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">Média do Setor</h4>
              <div className="text-2xl font-bold text-blue-600">
                {relatorio.comparativoSetor.mediaSetorAtividades}
              </div>
              <div className="text-xs text-gray-500">atividades/mês</div>
            </div>

            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">Taxa Setor</h4>
              <div className="text-2xl font-bold text-green-600">
                {relatorio.comparativoSetor.mediaSetorConclusao.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">conclusão</div>
            </div>

            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">Performance</h4>
              <div
                className={`text-lg font-bold ${
                  relatorio.pessoa.percentualConclusao >
                  relatorio.comparativoSetor.mediaSetorConclusao
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {relatorio.pessoa.percentualConclusao >
                relatorio.comparativoSetor.mediaSetorConclusao
                  ? "Acima"
                  : "Abaixo"}
              </div>
              <div className="text-xs text-gray-500">da média</div>
            </div>
          </div>
        </div>
      )}

      {isAnual(relatorio) && relatorio.evolucaoMensal && (
        <div
          className={`p-6 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendar className="text-purple-500" />
            Evolução Mensal
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatorio.evolucaoMensal.map((mes, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4 className="font-medium text-sm mb-2">
                  {new Date(2024, mes.mes - 1).toLocaleDateString("pt-BR", {
                    month: "short",
                  })}
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{mes.totalAtividades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concluídas:</span>
                    <span className="text-green-600 font-medium">
                      {mes.atividadesConcluidas}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa:</span>
                    <span className="font-medium">
                      {mes.percentualConclusao.toFixed(1)}%
                    </span>
                  </div>
                  {mes.horasTrabalhadas && (
                    <div className="flex justify-between">
                      <span>Horas:</span>
                      <span className="font-medium">
                        {mes.horasTrabalhadas}h
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`p-6 rounded-xl border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaTasks className="text-purple-500" />
          Atividades {tipoRelatorio === "mensal" ? "do Mês" : "do Ano"}
        </h3>

        <div className="space-y-3">
          {relatorio.pessoa.atividades.slice(0, 10).map((atividade, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{atividade.titulo}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>Tipo: {atividade.tipo}</span>
                    <span>Prioridade: {atividade.prioridade}</span>
                    <span>Responsável: {atividade.responsavel}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {atividade.dataInicio && (
                      <span>
                        Início:{" "}
                        {new Date(atividade.dataInicio).toLocaleDateString()}
                      </span>
                    )}
                    {atividade.dataFim && (
                      <span>
                        Prazo:{" "}
                        {new Date(atividade.dataFim).toLocaleDateString()}
                      </span>
                    )}
                    {atividade.dataConclusao && (
                      <span>
                        Concluída em:{" "}
                        {new Date(atividade.dataConclusao).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                      atividade.status
                    )}`}
                  >
                    {atividade.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {relatorio.pessoa.atividades.length > 10 && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Mostrando 10 de {relatorio.pessoa.atividades.length} atividades
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioIndividualComponent;
