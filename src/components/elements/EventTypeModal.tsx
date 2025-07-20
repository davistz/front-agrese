import React from "react";
import { IoMdClose } from "react-icons/io";

export type EventType =
  | "reuniao"
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
  const eventTypes = [
    {
      type: "reuniao" as EventType,
      title: "Reunião",
      icon: "🤝",
      description:
        "Reuniões internas ou intersetoriais, com participantes definidos.",
    },
    {
      type: "atividade" as EventType,
      title: "Atividade",
      icon: "📝",
      description: "Tarefas internas atribuídas a um ou mais usuários.",
    },
    {
      type: "atividades-externas" as EventType,
      title: "Atividade Externa",
      icon: "🌐",
      description:
        "Compromissos fora da sede, como visitas técnicas, eventos, inspeções.",
    },
    {
      type: "documento" as EventType,
      title: "Documento",
      icon: "📂",
      description:
        "Envios, recebimentos, revisões ou prazos relacionados a documentos oficiais.",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Selecione o tipo de evento</h2>
          <IoMdClose
            onClick={onClose}
            className="text-2xl cursor-pointer hover:text-gray-600 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {eventTypes.map((eventType) => (
            <button
              key={eventType.type}
              onClick={() => onSelectType(eventType.type)}
              className="flex flex-col items-start p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{eventType.icon}</span>
                <h3 className="text-lg font-semibold">{eventType.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{eventType.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
