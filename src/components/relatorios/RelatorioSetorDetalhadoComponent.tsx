import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  RelatorioSetorMensal,
  RelatorioSetorAnual,
} from "../../types/interfaces";
import {
  FaBuilding,
  FaCalendar,
  FaTrophy,
  FaTasks,
  FaClock,
  FaUsers,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";

interface RelatorioSetorDetalhadoProps {
  relatorio: RelatorioSetorMensal | RelatorioSetorAnual;
  tipoRelatorio: "mensal" | "anual";
}

const RelatorioSetorDetalhadoComponent: React.FC<
  RelatorioSetorDetalhadoProps
> = ({ relatorio, tipoRelatorio }) => {
  const { theme } = useTheme();

  const isMensal = (
    rel: RelatorioSetorMensal | RelatorioSetorAnual
  ): rel is RelatorioSetorMensal => {
    return "mes" in rel;
  };

  const isAnual = (
    rel: RelatorioSetorMensal | RelatorioSetorAnual
  ): rel is RelatorioSetorAnual => {
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

  const getPerformanceColor = (percentual: number) => {
    if (percentual >= 90) return "text-green-600";
    if (percentual >= 70) return "text-blue-600";
    if (percentual >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBg = (percentual: number) => {
    if (percentual >= 90) return "bg-green-100 border-green-200";
    if (percentual >= 70) return "bg-blue-100 border-blue-200";
    if (percentual >= 50) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  const traduzirTipoAtividade = (tipo: string): string => {
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
            <FaBuilding
              className={`text-2xl ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <div>
              <h2 className="text-2xl font-bold">{relatorio.setor.nome}</h2>
              {relatorio.setor.responsavel && (
                <p className="text-gray-500">
                  Responsável: {relatorio.setor.responsavel}
                </p>
              )}
              {relatorio.setor.descricao && (
                <p className="text-sm text-gray-400 mt-1">
                  {relatorio.setor.descricao}
                </p>
              )}
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
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceBg(
                relatorio.setor.percentualConclusao
              )}`}
            >
              <FaTrophy className="mr-1" />
              {relatorio.setor.percentualConclusao.toFixed(1)}% de Eficiência
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            {relatorio.setor.totalAtividades}
          </h3>
          <p className="text-sm text-gray-500">Total de Atividades</p>
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
            {relatorio.setor.atividadesConcluidas}
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
            {relatorio.setor.atividadesEmAndamento}
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
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold text-orange-600">
            {relatorio.setor.atividadesPendentes}
          </h3>
          <p className="text-sm text-gray-500">Pendentes</p>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-red-500 text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-red-600">
            {relatorio.setor.atividadesAtrasadas}
          </h3>
          <p className="text-sm text-gray-500">Atrasadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartPie className="text-purple-500" />
            Distribuição por Tipo
          </h3>

          <div className="space-y-3">
            {relatorio.setor.distribuicaoTipoAtividade?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full bg-${
                      ["blue", "green", "yellow", "purple", "red"][index % 5]
                    }-500`}
                  ></div>
                  <span className="text-sm font-medium">
                    {traduzirTipoAtividade(item.tipo)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {item.quantidade}
                  </span>
                  <span className="text-sm font-medium">
                    {item.percentual.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-6 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartLine className="text-orange-500" />
            Distribuição por Prioridade
          </h3>

          <div className="space-y-3">
            {relatorio.setor.distribuicaoPrioridade?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.prioridade === "HIGH" || item.prioridade === "URGENT"
                        ? "bg-red-500"
                        : item.prioridade === "MEDIUM"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {item.prioridade === "HIGH"
                      ? "Alta"
                      : item.prioridade === "MEDIUM"
                      ? "Média"
                      : item.prioridade === "LOW"
                      ? "Baixa"
                      : "Urgente"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {item.quantidade}
                  </span>
                  <span className="text-sm font-medium">
                    {item.percentual.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUsers className="text-blue-500" />
          Performance dos Membros
        </h3>

        <div className="space-y-3">
          {relatorio.setor.membros?.slice(0, 10).map((membro, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{membro.nome}</h4>
                    <p className="text-sm text-gray-500">{membro.cargo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">
                        {membro.totalAtividades}
                      </div>
                      <div className="text-gray-500">Total</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">
                        {membro.atividadesConcluidas}
                      </div>
                      <div className="text-gray-500">Concluídas</div>
                    </div>
                    <div>
                      <div
                        className={`font-medium ${getPerformanceColor(
                          membro.percentualConclusao
                        )}`}
                      >
                        {membro.percentualConclusao.toFixed(1)}%
                      </div>
                      <div className="text-gray-500">Taxa</div>
                    </div>
                  </div>
                  <div className="mt-2 w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        membro.percentualConclusao >= 90
                          ? "bg-green-500"
                          : membro.percentualConclusao >= 70
                          ? "bg-blue-500"
                          : membro.percentualConclusao >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${membro.percentualConclusao}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(relatorio.setor.membros?.length || 0) > 10 && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Mostrando 10 de {relatorio.setor.membros?.length} membros
            </span>
          </div>
        )}
      </div>

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
            Evolução Mensal do Setor
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
                  <div className="flex justify-between">
                    <span>Membros:</span>
                    <span className="font-medium">
                      {mes.totalMembrosAtivos}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAnual(relatorio) && relatorio.metasSetor && (
        <div
          className={`p-6 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Metas do Setor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">
                Meta Atividades/Mês
              </h4>
              <div className="text-2xl font-bold text-blue-600">
                {relatorio.metasSetor.metaAtividadesMensais}
              </div>
              <div className="text-xs text-gray-500">atividades por mês</div>
            </div>

            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">Meta de Conclusão</h4>
              <div className="text-2xl font-bold text-green-600">
                {relatorio.metasSetor.metaConclusaoPercentual.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">taxa de conclusão</div>
            </div>

            <div className="text-center">
              <h4 className="text-sm text-gray-500 mb-1">Status da Meta</h4>
              <div
                className={`text-lg font-bold ${
                  relatorio.metasSetor.metaAlcancada
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {relatorio.metasSetor.metaAlcancada
                  ? "Alcançada"
                  : "Não Alcançada"}
              </div>
              <div className="text-xs text-gray-500">
                {relatorio.metasSetor.mesesComMetaAlcancada} de 12 meses
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioSetorDetalhadoComponent;
