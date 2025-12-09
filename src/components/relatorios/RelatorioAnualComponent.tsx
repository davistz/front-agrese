import { RelatorioAnual } from "../../types/interfaces";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface RelatorioAnualComponentProps {
  relatorio: RelatorioAnual;
}

export const RelatorioAnualComponent = ({
  relatorio,
}: RelatorioAnualComponentProps) => {
  const { theme } = useTheme();

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const getStatusColor = (percentual: number) => {
    if (percentual >= 90) return "text-green-500";
    if (percentual >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBg = (percentual: number) => {
    if (percentual >= 90) return "bg-green-100 border-green-300";
    if (percentual >= 70) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  const calcularTendencia = () => {
    if (relatorio.evolucaoMensal.length < 2) return 0;
    const ultimoTrimestre = relatorio.evolucaoMensal.slice(-3);
    const primeiroTrimestre = relatorio.evolucaoMensal.slice(0, 3);

    const mediaUltimo =
      ultimoTrimestre.reduce((acc, mes) => acc + mes.percentualConclusao, 0) /
      ultimoTrimestre.length;
    const mediaPrimeiro =
      primeiroTrimestre.reduce((acc, mes) => acc + mes.percentualConclusao, 0) /
      primeiroTrimestre.length;

    return mediaUltimo - mediaPrimeiro;
  };

  const tendencia = calcularTendencia();

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              Relatório Anual - {relatorio.ano}
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Gerado em:{" "}
              {new Date(relatorio.dataGeracao).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-500">
              {relatorio.percentualGeralConclusao.toFixed(1)}%
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Taxa de Conclusão Anual
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${
                tendencia >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {tendencia >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {tendencia >= 0 ? "+" : ""}
              {tendencia.toFixed(1)}% vs início do ano
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaTasks className="text-blue-500 text-2xl" />
              <div>
                <div className="text-2xl font-bold">
                  {relatorio.totalGeralAtividades}
                </div>
                <div className="text-sm text-gray-600">Total de Atividades</div>
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-green-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-2xl" />
              <div>
                <div className="text-2xl font-bold">
                  {relatorio.totalAtividadesConcluidas}
                </div>
                <div className="text-sm text-gray-600">Concluídas</div>
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-yellow-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaClock className="text-yellow-500 text-2xl" />
              <div>
                <div className="text-2xl font-bold">
                  {relatorio.setores.reduce(
                    (acc, setor) => acc + setor.atividadesEmAndamento,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Em Andamento</div>
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-red-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <div>
                <div className="text-2xl font-bold">
                  {relatorio.setores.reduce(
                    (acc, setor) => acc + setor.atividadesAtrasadas,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Atrasadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Evolução Mensal</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-12 gap-2">
              {relatorio.evolucaoMensal.map((mes, index) => (
                <div
                  key={mes.mes}
                  className={`p-3 rounded-lg text-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-medium mb-2">{meses[index]}</div>
                  <div className="text-lg font-bold">{mes.totalAtividades}</div>
                  <div className="text-xs text-gray-600">Atividades</div>
                  <div
                    className={`text-sm font-bold mt-1 ${getStatusColor(
                      mes.percentualConclusao
                    )}`}
                  >
                    {mes.percentualConclusao}%
                  </div>
                  <div
                    className={`w-full bg-gray-200 rounded-full h-1 mt-2 ${
                      theme === "dark" ? "bg-gray-600" : ""
                    }`}
                  >
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${mes.percentualConclusao}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Desempenho Anual por Setor</h3>
        <div className="space-y-4">
          {relatorio.setores.map((setor) => (
            <div
              key={setor.id}
              className={`p-4 rounded-lg border-2 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : getStatusBg(setor.percentualConclusao)
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold">{setor.nome}</h4>
                  {setor.responsavel && (
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Responsável: {setor.responsavel}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${getStatusColor(
                      setor.percentualConclusao
                    )}`}
                  >
                    {setor.percentualConclusao.toFixed(1)}%
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaUsers className="text-gray-500" />
                    {setor.membrosAtivos} membros
                  </div>
                </div>
              </div>

              <div
                className={`w-full bg-gray-200 rounded-full h-3 mb-3 ${
                  theme === "dark" ? "bg-gray-600" : ""
                }`}
              >
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${setor.percentualConclusao}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {setor.totalAtividades}
                  </div>
                  <div
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Total Anual
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-500">
                    {setor.atividadesConcluidas}
                  </div>
                  <div
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Concluídas
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-500">
                    {setor.atividadesEmAndamento}
                  </div>
                  <div
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Em Andamento
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-500">
                    {setor.atividadesPendentes}
                  </div>
                  <div
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Pendentes
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-red-500">
                    {setor.atividadesAtrasadas}
                  </div>
                  <div
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Atrasadas
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="text-sm text-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Média mensal: {(setor.totalAtividades / 12).toFixed(1)}{" "}
                    atividades | Pico de produtividade:{" "}
                    {Math.max(
                      ...relatorio.evolucaoMensal.map((m) => m.totalAtividades)
                    )}{" "}
                    atividades em{" "}
                    {
                      meses[
                        relatorio.evolucaoMensal.findIndex(
                          (m) =>
                            m.totalAtividades ===
                            Math.max(
                              ...relatorio.evolucaoMensal.map(
                                (m) => m.totalAtividades
                              )
                            )
                        )
                      ]
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">
          Análise Comparativa - {relatorio.ano}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-green-900/20 border-green-500"
                : "bg-green-50 border-green-300"
            } border`}
          >
            <h4 className="font-semibold text-green-600 mb-2">
              Melhor Trimestre
            </h4>
            <div className="text-2xl font-bold text-green-600">
              3º Trimestre
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              85% de conclusão média
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-blue-900/20 border-blue-500"
                : "bg-blue-50 border-blue-300"
            } border`}
          >
            <h4 className="font-semibold text-blue-600 mb-2">Setor Destaque</h4>
            <div className="text-lg font-bold text-blue-600">
              {
                relatorio.setores.reduce((prev, current) =>
                  prev.percentualConclusao > current.percentualConclusao
                    ? prev
                    : current
                ).nome
              }
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {relatorio.setores
                .reduce((prev, current) =>
                  prev.percentualConclusao > current.percentualConclusao
                    ? prev
                    : current
                )
                .percentualConclusao.toFixed(1)}
              % de conclusão
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-purple-900/20 border-purple-500"
                : "bg-purple-50 border-purple-300"
            } border`}
          >
            <h4 className="font-semibold text-purple-600 mb-2">
              Força de Trabalho
            </h4>
            <div className="text-2xl font-bold text-purple-600">
              {relatorio.setores.reduce(
                (acc, setor) => acc + setor.membrosAtivos,
                0
              )}
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Colaboradores ativos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
