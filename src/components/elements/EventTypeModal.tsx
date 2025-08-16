import React from "react";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../../contexts/ThemeContext";
import { usePermissions } from "../../hooks/usePermissions";

export type EventType =
  | "reuniao"
  | "reuniao-direx"
  | "atividade"
  | "atividades-externas"
  | "documento";

interface EventTypeModalProps {
  onSelectType: (type: EventType) => void;
  onClose: () => void;
}

export const EventTypeModal: React.FC<EventTypeModalProps> = ({
  onSelectType,
  onClose,
}) => {
  const { theme } = useTheme();
  const { canCreateDirexMeeting } = usePermissions();

  const eventTypes = [
    {
      type: "reuniao" as EventType,
      title: "Reunião",
      icon: "🤝",
      description:
        "Reuniões internas ou intersetoriais, com participantes definidos.",
      available: true,
    },
    {
      type: "reuniao-direx" as EventType,
      title: "Reunião Direx",
      icon: "👥",
      description:
        "Reuniões da Diretoria Executiva com agenda especial e participantes da alta gestão.",
      available: canCreateDirexMeeting(),
    },
    {
      type: "atividade" as EventType,
      title: "Atividade",
      icon: "📝",
      description: "Tarefas internas atribuídas a um ou mais usuários.",
      available: true,
    },
    {
      type: "atividades-externas" as EventType,
      title: "Atividade Externa",
      icon: "🌐",
      description:
        "Compromissos fora da sede, como visitas técnicas, eventos, inspeções.",
      available: true,
    },
    {
      type: "documento" as EventType,
      title: "Documento",
      icon: "📂",
      description:
        "Envios, recebimentos, revisões ou prazos relacionados a documentos oficiais.",
      available: true,
    },
  ].filter((eventType) => eventType.available);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div
        className={`rounded-lg p-6 max-w-2xl w-full relative z-10 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Selecione o tipo de evento
          </h2>
          <IoMdClose
            onClick={onClose}
            className={`text-2xl cursor-pointer transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {eventTypes.map((eventType) => (
            <button
              key={eventType.type}
              onClick={() => onSelectType(eventType.type)}
              className={`flex flex-col items-start p-4 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "border-gray-600 hover:border-blue-400 hover:bg-gray-700 text-gray-200"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{eventType.icon}</span>
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {eventType.title}
                </h3>
              </div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {eventType.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
