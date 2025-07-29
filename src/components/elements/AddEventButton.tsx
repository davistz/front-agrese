import { useState } from "react";
import { EventType, EventTypeModal } from "./EventTypeModal";
import { ReuniaoForm } from "./forms/ReuniaoForm";
import { AtividadeForm } from "./forms/AtividadeForm";
import { AtividadeExternaForm } from "./forms/AtividadeExterna";
import { DocumentoForm } from "./forms/DocumentoForm";
import { useTheme } from "../../contexts/ThemeContext";

interface AddEventButtonProps {
  onAddEvent: (type: EventType) => void;
}

export const AddEventButton: React.FC<AddEventButtonProps> = ({
  onAddEvent,
}) => {
  const { theme } = useTheme();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);

  const handleTypeSelect = (type: EventType) => {
    setSelectedType(type);
    setShowTypeModal(false);
  };

  const handleFormClose = () => {
    setSelectedType(null);
  };

  const handleFormSubmit = (formData: any) => {
    onAddEvent(selectedType!);
    setSelectedType(null);
  };

  return (
    <>
      <button
        onClick={() => setShowTypeModal(true)}
        className={`w-full mb-2 px-4 py-2 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Adicionar Evento
      </button>

      {showTypeModal && (
        <EventTypeModal
          onSelectType={handleTypeSelect}
          onClose={() => setShowTypeModal(false)}
        />
      )}

      {selectedType === "reuniao" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50">
            <ReuniaoForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {selectedType === "atividade" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50">
            <AtividadeForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
      {selectedType === "atividades-externas" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50">
            <AtividadeExternaForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
      {selectedType === "documento" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50">
            <DocumentoForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </>
  );
};
