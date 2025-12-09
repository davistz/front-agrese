import { RelatorioMensal, RelatorioAnual } from "../../types/interfaces";
import { useTheme } from "../../contexts/ThemeContext";
import { FaChartBar, FaChartPie, FaChartLine } from "react-icons/fa";

interface RelatorioGraficosProps {
  relatorio: RelatorioMensal | RelatorioAnual;
  tipo: "mensal" | "anual";
}

export const RelatorioGraficos = ({
  relatorio,
  tipo,
}: RelatorioGraficosProps) => {
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

  const GraficoBarras = () => {
    const maxAtividades = Math.max(
      ...relatorio.setores.map((s) => s.totalAtividades)
    );

    return (
      <div className="space-y-4">
        {relatorio.setores.map((setor) => (
          <div key={setor.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{setor.nome}</span>
              <span className="text-sm font-bold">{setor.totalAtividades}</span>
            </div>
            <div
              className={`w-full bg-gray-200 rounded-full h-4 ${
                theme === "dark" ? "bg-gray-600" : ""
              }`}
            >
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full flex items-center justify-end pr-2"
                style={{
                  width: `${(setor.totalAtividades / maxAtividades) * 100}%`,
                }}
              >
                <span className="text-xs text-white font-medium">
                  {setor.percentualConclusao.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const GraficoPizza = () => {
    const total = relatorio.totalGeralAtividades;
    const concluidas = relatorio.totalAtividadesConcluidas;
    const pendentes = relatorio.setores.reduce(
      (acc, setor) => acc + setor.atividadesPendentes,
      0
    );
    const emAndamento = relatorio.setores.reduce(
      (acc, setor) => acc + setor.atividadesEmAndamento,
      0
    );
    const atrasadas = relatorio.setores.reduce(
      (acc, setor) => acc + setor.atividadesAtrasadas,
      0
    );

    const percentConcluidas = (concluidas / total) * 100;
    const percentPendentes = (pendentes / total) * 100;
    const percentEmAndamento = (emAndamento / total) * 100;
    const percentAtrasadas = (atrasadas / total) * 100;

    return (
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(
                #10b981 0deg ${percentConcluidas * 3.6}deg,
                #3b82f6 ${percentConcluidas * 3.6}deg ${
                (percentConcluidas + percentEmAndamento) * 3.6
              }deg,
                #6b7280 ${(percentConcluidas + percentEmAndamento) * 3.6}deg ${
                (percentConcluidas + percentEmAndamento + percentPendentes) *
                3.6
              }deg,
                #ef4444 ${
                  (percentConcluidas + percentEmAndamento + percentPendentes) *
                  3.6
                }deg 360deg
              )`,
            }}
          />

          <div
            className={`absolute inset-6 rounded-full flex items-center justify-center ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">
                {relatorio.percentualGeralConclusao.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Conclusão</div>
            </div>
          </div>
        </div>

        <div className="ml-8 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Concluídas ({concluidas})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Em Andamento ({emAndamento})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-sm">Pendentes ({pendentes})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Atrasadas ({atrasadas})</span>
          </div>
        </div>
      </div>
    );
  };

  const GraficoLinha = () => {
    if (tipo === "mensal" || !("evolucaoMensal" in relatorio)) return null;

    const maxValue = Math.max(
      ...relatorio.evolucaoMensal.map((m) => m.totalAtividades)
    );
    const minValue = Math.min(
      ...relatorio.evolucaoMensal.map((m) => m.totalAtividades)
    );
    const range = maxValue - minValue || 1;

    return (
      <div className="space-y-4">
        <div className="relative h-48">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="50"
                y1={40 + i * 32}
                x2="750"
                y2={40 + i * 32}
                stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                strokeWidth="1"
              />
            ))}

            {relatorio.evolucaoMensal.map((_, index) => (
              <line
                key={index}
                x1={50 + index * 58.33}
                y1="40"
                x2={50 + index * 58.33}
                y2="168"
                stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                strokeWidth="1"
              />
            ))}

            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={relatorio.evolucaoMensal
                .map((mes, index) => {
                  const x = 50 + index * 58.33;
                  const y =
                    168 - ((mes.totalAtividades - minValue) / range) * 128;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {relatorio.evolucaoMensal.map((mes, index) => {
              const x = 50 + index * 58.33;
              const y = 168 - ((mes.totalAtividades - minValue) / range) * 128;
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                  <text
                    x={x}
                    y="188"
                    textAnchor="middle"
                    className={`text-xs ${
                      theme === "dark" ? "fill-gray-300" : "fill-gray-600"
                    }`}
                  >
                    {meses[index]}
                  </text>
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className={`text-xs font-bold ${
                      theme === "dark" ? "fill-white" : "fill-gray-900"
                    }`}
                  >
                    {mes.totalAtividades}
                  </text>
                </g>
              );
            })}

            {[0, 1, 2, 3, 4].map((i) => {
              const value = Math.round(minValue + (range / 4) * (4 - i));
              return (
                <text
                  key={i}
                  x="40"
                  y={44 + i * 32}
                  textAnchor="end"
                  className={`text-xs ${
                    theme === "dark" ? "fill-gray-300" : "fill-gray-600"
                  }`}
                >
                  {value}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 800 120">
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="50"
                y1={20 + i * 20}
                x2="750"
                y2={20 + i * 20}
                stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={relatorio.evolucaoMensal
                .map((mes, index) => {
                  const x = 50 + index * 58.33;
                  const y = 100 - (mes.percentualConclusao / 100) * 80;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {relatorio.evolucaoMensal.map((mes, index) => {
              const x = 50 + index * 58.33;
              const y = 100 - (mes.percentualConclusao / 100) * 80;
              return <circle key={index} cx={x} cy={y} r="2" fill="#10b981" />;
            })}

            {[0, 1, 2, 3, 4].map((i) => {
              const value = 100 - i * 25;
              return (
                <text
                  key={i}
                  x="40"
                  y={24 + i * 20}
                  textAnchor="end"
                  className={`text-xs ${
                    theme === "dark" ? "fill-gray-300" : "fill-gray-600"
                  }`}
                >
                  {value}%
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-500" />
          Atividades por Setor
        </h3>
        <GraficoBarras />
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaChartPie className="text-green-500" />
          Distribuição por Status
        </h3>
        <GraficoPizza />
      </div>

      {tipo === "anual" && "evolucaoMensal" in relatorio && (
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaChartLine className="text-purple-500" />
            Evolução Mensal do Ano
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-blue-500 mb-2">
                Total de Atividades
              </h4>
              <GraficoLinha />
            </div>
            <div className="text-sm text-center space-x-6">
              <span className="inline-flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500"></div>
                Atividades Totais
              </span>
              <span className="inline-flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                Taxa de Conclusão
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
