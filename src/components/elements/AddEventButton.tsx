import { useState } from "react";
import { EventType, EventTypeModal } from "./EventTypeModal";
import { ReuniaoForm } from "./forms/ReuniaoForm";
import { AtividadeForm } from "./forms/AtividadeForm";
import { AtividadeExternaForm } from "./forms/AtividadeExterna";
import { DocumentoForm } from "./forms/DocumentoForm";
import { ConflictWarning } from "./ConflictWarning";
import { useTheme } from "../../contexts/ThemeContext";
import { useEvents } from "../../contexts/EventsContext";

interface AddEventButtonProps {
  onAddEvent: (type: EventType, eventData: any) => void;
}

export const AddEventButton: React.FC<AddEventButtonProps> = ({
  onAddEvent,
}) => {
  const { theme } = useTheme();
  const {
    checkTimeConflict,
    getConflictingEvents,
    checkRoomConflict,
    getRoomConflictingEvents,
  } = useEvents();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [conflictingEvents, setConflictingEvents] = useState<any[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [pendingEventData, setPendingEventData] = useState<any>(null);

  const handleTypeSelect = (type: EventType) => {
    console.log("Selected event type:", type);
    setSelectedType(type);
    setShowTypeModal(false);
  };

  const handleFormClose = () => {
    setSelectedType(null);
    setShowConflictWarning(false);
    setConflictingEvents([]);
    setPendingEventData(null);
  };

  const handleFormSubmit = (formData: any) => {
    if (selectedType === EventType.MEETING) {
      const startDate = formData.dataHoraInicio;
      const endDate = formData.dataHoraTermino;

      if (checkTimeConflict(startDate, endDate)) {
        const conflicts = getConflictingEvents(startDate, endDate);
        setConflictingEvents(conflicts);
        setPendingEventData(formData);
        setShowConflictWarning(true);
        return;
      }

      if (
        formData.local === "presencial" &&
        formData.sala &&
        formData.sala.trim() !== ""
      ) {
        const hasRoomConflict = checkRoomConflict(
          startDate,
          endDate,
          formData.sala
        );

        if (hasRoomConflict) {
          const roomConflicts = getRoomConflictingEvents(
            startDate,
            endDate,
            formData.sala
          );

          alert(
            `⚠️ CONFLITO DE SALA DETECTADO!\n\n` +
              `A sala "${
                formData.sala === "auditorio"
                  ? "Auditório"
                  : formData.sala === "sala-reuniao"
                  ? "Sala de Reunião"
                  : formData.sala === "sala-multiuso"
                  ? "Sala Multiuso"
                  : formData.sala
              }" já está ocupada neste horário.\n\n` +
              `Eventos conflitantes:\n` +
              roomConflicts
                .map(
                  (event: any) =>
                    `• ${event.title} (${new Date(event.start).toLocaleString(
                      "pt-BR"
                    )} - ${new Date(event.end).toLocaleString("pt-BR")})`
                )
                .join("\n") +
              `\n\nPor favor, escolha outro horário ou outra sala.`
          );
          return;
        }
      }
    }

    onAddEvent(selectedType!, formData);
    setSelectedType(null);
  };

  const handleProceedWithConflict = () => {
    onAddEvent(selectedType!, pendingEventData);
    handleFormClose();
  };

  return (
    <>
      <button
        onClick={() => setShowTypeModal(true)}
        className={`w-full mb-2 px-4 py-2 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
          theme === "dark"
            ? "bg-[#006BA6] hover:bg-[#005A8A] text-white"
            : "bg-[#0092DA] hover:bg-[#007BB8] text-white"
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

      {(selectedType === EventType.MEETING) && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50">
            <ReuniaoForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
              isDirex={selectedType === EventType.MEETING}
            />
          </div>
        </div>
      )}

      {selectedType === EventType.ACTIVITY && (
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
      {selectedType === EventType.EXTERNAL_ACTIVITY && (
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
      {selectedType === EventType.DOCUMENT && (
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

      {showConflictWarning && (
        <ConflictWarning
          conflictingEvents={conflictingEvents}
          onProceed={handleProceedWithConflict}
          onCancel={() => setShowConflictWarning(false)}
        />
      )}
    </>
  );
};
