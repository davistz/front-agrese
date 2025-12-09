import React from "react";
import { useTheme } from "../contexts/ThemeContext";

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  sala?: string;
  autor?: string;
}

interface RoomConflictWarningProps {
  conflictingEvents: Event[];
  sala: string;
}

export const RoomConflictWarning: React.FC<RoomConflictWarningProps> = ({
  conflictingEvents,
  sala,
}) => {
  const { theme } = useTheme();

  if (conflictingEvents.length === 0) {
    return null;
  }

  const getSalaDisplayName = (sala: string) => {
    switch (sala) {
      case "auditorio":
        return "Auditório";
      case "sala-reuniao":
        return "Sala de Reunião";
      case "sala-multiuso":
        return "Sala Multiuso";
      default:
        return sala;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div
      className={`mt-3 p-4 rounded-lg border-l-4 border-red-500 ${
        theme === "dark" ? "bg-red-900/20 border-red-400" : "bg-red-50"
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3
            className={`text-sm font-medium ${
              theme === "dark" ? "text-red-300" : "text-red-800"
            }`}
          >
            ⚠️ Conflito de Sala Detectado
          </h3>
          <div
            className={`mt-2 text-sm ${
              theme === "dark" ? "text-red-200" : "text-red-700"
            }`}
          >
            <p className="mb-3">
              A <strong>{getSalaDisplayName(sala)}</strong> já está ocupada
              neste horário.
            </p>

            <div className="space-y-2">
              <p className="font-medium">Eventos conflitantes:</p>
              <div className="space-y-1">
                {conflictingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-md text-xs ${
                      theme === "dark" ? "bg-red-800/30" : "bg-red-100"
                    }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="opacity-75">
                      {formatDateTime(event.start)} às{" "}
                      {formatDateTime(event.end)}
                      {event.autor && <span> • Por: {event.autor}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p
              className={`mt-3 text-xs font-medium ${
                theme === "dark" ? "text-red-200" : "text-red-800"
              }`}
            >
              💡 Escolha outro horário ou outra sala para prosseguir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
