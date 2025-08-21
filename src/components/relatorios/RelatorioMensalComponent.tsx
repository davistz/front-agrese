import { RelatorioMensal } from "../../types/interfaces";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

interface RelatorioMensalComponentProps {
  relatorio: RelatorioMensal;
}

export const RelatorioMensalComponent = ({
  relatorio,
}: RelatorioMensalComponentProps) => {
  const { theme } = useTheme();

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
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
              Relatório Mensal - {meses[relatorio.mes - 1]} {relatorio.ano}
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
              Taxa de Conclusão Geral
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
        <h3 className="text-xl font-bold mb-4">Desempenho por Setor</h3>
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
                    Total
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
          Ranking de Setores por Desempenho
        </h3>
        <div className="space-y-3">
          {relatorio.setores
            .sort((a, b) => b.percentualConclusao - a.percentualConclusao)
            .map((setor, index) => (
              <div
                key={setor.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-white"
                        : index === 1
                        ? "bg-gray-400 text-white"
                        : index === 2
                        ? "bg-yellow-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-600 text-gray-300"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{setor.nome}</div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {setor.atividadesConcluidas} de {setor.totalAtividades}{" "}
                      atividades
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${getStatusColor(
                      setor.percentualConclusao
                    )}`}
                  >
                    {setor.percentualConclusao.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
