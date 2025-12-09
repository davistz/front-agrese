import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface ConflictWarningProps {
  conflictingEvents: any[];
  onProceed: () => void;
  onCancel: () => void;
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({
  conflictingEvents,
  onProceed,
  onCancel,
}) => {
  const { theme } = useTheme();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onCancel}
      ></div>
      <div
        className={`rounded-lg p-6 max-w-md w-full relative z-10 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center mb-4">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Conflito de Horário Detectado
          </h3>
        </div>

        <p
          className={`mb-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Já existe(m) {conflictingEvents.length} reunião(ões) agendada(s) no
          mesmo horário:
        </p>

        <div className="space-y-3 mb-6 max-h-32 overflow-y-auto">
          {conflictingEvents.map((event, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {event.title}
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatDate(event.start)} • {formatTime(event.start)} às{" "}
                {formatTime(event.end)}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Tipo:{" "}
                {event.tipo === "reuniao-direx" ? "Reunião Direx" : "Reunião"} •
                Setor: {event.setor}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`p-3 rounded mb-4 ${
            theme === "dark"
              ? "bg-yellow-900 border-yellow-700"
              : "bg-yellow-50 border-yellow-200"
          } border`}
        >
          <p
            className={`text-sm ${
              theme === "dark" ? "text-yellow-200" : "text-yellow-800"
            }`}
          >
            ⚠️ Agendar este evento pode causar conflitos de agenda. Deseja
            continuar mesmo assim?
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded border transition-colors ${
              theme === "dark"
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Agendar Mesmo Assim
          </button>
        </div>
      </div>
    </div>
  );
};
