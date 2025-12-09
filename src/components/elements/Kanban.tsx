import React, { useState, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useEvents } from "../../contexts/EventsContext";
import { AddEventButton } from "./AddEventButton";
import { EventType } from "./EventTypeModal";
import { FiltroAtividades } from "./FiltroAtividades";
import { ReuniaoModalInfo } from "../modals/ReuniaoInfoModal";
import { AtividadeModalInfo } from "../modals/AtividadeInfoModal";
import { DocumentoModalInfo } from "../modals/DocumentoInfoModal";
import { AtividadeExternaModalInfo } from "../modals/AtividadeExternaInfoModal";
import "./Kanban.css";
import {
  mapMeetingToReuniao,
  mapReuniaoToMeeting,
} from "../../utils/eventMappers";
import {
  convertEventToReuniaoModal,
  convertReuniaoModalToEvent,
  convertEventToAtividadeModal,
  convertAtividadeModalToEvent,
  convertEventToDocumentoModal,
  convertDocumentoModalToEvent,
  convertEventToAtividadeExternaModal,
  convertAtividadeExternaModalToEvent,
} from "../../utils/eventConverters";

interface KanbanProps {
  sidebarOpen?: boolean;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  status: string[];
}

const kanbanColumns: KanbanColumn[] = [
  {
    id: "pendente",
    title: "Pendente",
    color: "bg-gray-100 border-gray-300",
    status: ["pendente", "agendado", "planejado"],
  },
  {
    id: "em-andamento",
    title: "Em Andamento",
    color: "bg-blue-100 border-blue-300",
    status: ["em-andamento", "em-execucao", "em-analise"],
  },
  {
    id: "concluido",
    title: "Concluído",
    color: "bg-green-100 border-green-300",
    status: ["concluido", "finalizado", "assinado", "enviado"],
  },
  {
    id: "cancelado",
    title: "Cancelado",
    color: "bg-red-100 border-red-300",
    status: ["cancelado", "vencido"],
  },
];

export const Kanban = ({ sidebarOpen = true }: KanbanProps) => {
  const { theme } = useTheme();
  const {
    filteredEvents: events,
    setFilteredEvents: setEvents,
    addEvent,
    updateEvent,
  } = useEvents();
  const [eventoSelecionado, setEventoSelecionado] = useState<any>(null);
  const [draggedEvent, setDraggedEvent] = useState<any>(null);

const normalizeStatus = (status: string) => {
  if (!status) return "pendente";
  switch (status.toUpperCase()) {
    case "PENDING":
      return "pendente";
    case "IN_PROGRESS":
      return "em-andamento";
    case "COMPLETED":
      return "concluido";
    case "CANCELLED":
      return "cancelado";
    default:
      return status.toLowerCase();
  }
};

const getEventColumn = (event: any): string => {
  const status = normalizeStatus(event.status);
  for (const column of kanbanColumns) {
    if (column.status.includes(status)) {
      return column.id;
    }
  }
  return "pendente";
};

  const getEventsByColumn = (columnId: string) => {
    return events.filter((event: any) => getEventColumn(event) === columnId);
  };

  const getEventColor = (tipo: string): string => {
    switch (tipo) {
      case "reuniao":
        return "bg-orange-200 border-orange-400 text-orange-800";
      case "reuniao-direx":
        return "bg-red-300 border-red-500 text-red-900";
      case "atividade":
        return "bg-green-200 border-green-400 text-green-800";
      case "documento":
        return "bg-red-200 border-red-400 text-red-800";
      case "atividades-externas":
        return "bg-yellow-200 border-yellow-400 text-yellow-800";
      default:
        return "bg-blue-200 border-blue-400 text-blue-800";
    }
  };

  const handleDragStart = (e: React.DragEvent, event: any) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      const draggedCard = document.getElementById(`card-${event.id}`);
      if (draggedCard) {
        draggedCard.classList.add("dragging");
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, event: any) => {
    const draggedCard = document.getElementById(`card-${event.id}`);
    if (draggedCard) {
      draggedCard.classList.remove("dragging");
    }
    setDraggedEvent(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const column = document.getElementById(`column-${columnId}`);
    if (column) {
      column.classList.add("drag-over");
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const column = document.getElementById(`column-${columnId}`);
    if (column) {
      column.classList.remove("drag-over");
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();

    const column = document.getElementById(`column-${columnId}`);
    if (column) {
      column.classList.remove("drag-over");
    }

    if (!draggedEvent) return;

    let newStatus = "pendente";
    switch (columnId) {
      case "pendente":
        newStatus = "PENDING";
        break;
      case "em-andamento":
        newStatus = "IN_PROGRESS";
        break;
      case "concluido":
        newStatus = "COMPLETED";
        break;
      case "cancelado":
        newStatus = "CANCELLED";
        break;
    }

    updateEvent(draggedEvent.id, { ...draggedEvent, status: newStatus });

    setEvents((prevEvents: any[]) =>
      prevEvents.map((ev) =>
        ev.id === draggedEvent.id ? { ...ev, status: newStatus } : ev
      )
    );

    setDraggedEvent(null);
  };

  const handleSelectEvent = (event: any) => {
    setEventoSelecionado(event);
  };

  const handleSelectClose = () => {
    setEventoSelecionado(null);
  };

  const handleAddEvent = useCallback(
    (type: EventType, eventData: any) => {
      addEvent(type, eventData);
    },
    [addEvent]
  );

  const renderEventModal = () => {
    if (!eventoSelecionado) return null;

    switch (eventoSelecionado.type) {
      case EventType.MEETING:
        return (
          <ReuniaoModalInfo
            evento={convertEventToReuniaoModal(eventoSelecionado)}
            onClose={handleSelectClose}
            onSave={(updatedEvent) => {
              const meetingData = convertReuniaoModalToEvent(updatedEvent);
              updateEvent(eventoSelecionado.id, meetingData);
              handleSelectClose();
            }}
          />
        );

      case EventType.ACTIVITY:
        return (
          <AtividadeModalInfo
            evento={convertEventToAtividadeModal(eventoSelecionado)}
            onClose={handleSelectClose}
            onSave={(updatedEvent) => {
              const convertedEvent = convertAtividadeModalToEvent(updatedEvent);
              const updatedEvents = events.map((event) =>
                event.id === convertedEvent.id ? convertedEvent : event
              );
              setEvents(updatedEvents);
              handleSelectClose();
            }}
          />
        );

      case EventType.EXTERNAL_ACTIVITY:
        return (
          <AtividadeExternaModalInfo
            evento={convertEventToAtividadeExternaModal(eventoSelecionado)}
            onClose={handleSelectClose}
            onSave={(updatedEvent) => {
              const convertedEvent =
                convertAtividadeExternaModalToEvent(updatedEvent);
              const updatedEvents = events.map((event) =>
                event.id === convertedEvent.id ? convertedEvent : event
              );
              setEvents(updatedEvents);
              handleSelectClose();
            }}
          />
        );

      case EventType.DOCUMENT:
        return (
          <DocumentoModalInfo
            evento={convertEventToDocumentoModal(eventoSelecionado)}
            onClose={handleSelectClose}
            onSave={(updatedEvent) => {
              const convertedEvent = convertDocumentoModalToEvent(updatedEvent);
              const updatedEvents = events.map((event) =>
                event.id === convertedEvent.id ? convertedEvent : event
              );
              setEvents(updatedEvents);
              handleSelectClose();
            }}
          />
        );

      default:
        return <h1>teste</h1>;
    }
  };

  const formatEventDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatEventTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex gap-4 p-4 h-screen overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="w-64 flex flex-col gap-4">
        <AddEventButton onAddEvent={handleAddEvent} />

        <div
          className={`shadow-lg rounded-lg h-fit ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-700"
          }`}
        >
          <FiltroAtividades
            atividades={events}
            onSelecionarAtividades={setEvents}
          />
        </div>

        <div
          className={`p-4 rounded-lg shadow-lg ${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <h3 className="font-semibold mb-3">Resumo</h3>
          {kanbanColumns.map((column) => {
            const count = getEventsByColumn(column.id).length;
            return (
              <div
                key={column.id}
                className="flex justify-between items-center mb-2"
              >
                <span className="text-sm">{column.title}</span>
                <span className="font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="kanban-board h-full">
          {kanbanColumns.map((column) => (
            <div
              key={column.id}
              id={`column-${column.id}`}
              className={`kanban-column ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : `${column.color}`
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={(e) => handleDragLeave(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div
                className={`p-4 border-b ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <h3
                  className={`font-semibold text-center ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {column.title}
                  <span className="ml-2 text-sm bg-gray-500 text-white px-2 py-1 rounded-full">
                    {getEventsByColumn(column.id).length}
                  </span>
                </h3>
              </div>

              <div className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-3">
                  {getEventsByColumn(column.id).map((event) => (
                    <div
                      key={event.id}
                      id={`card-${event.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={(e) => handleDragEnd(e, event)}
                      onClick={() => handleSelectEvent(event)}
                      className={`kanban-card kanban-card-enter p-3 rounded-lg border cursor-pointer ${
                        theme === "dark"
                          ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                          : `${getEventColor(event.tipo)} hover:shadow-lg`
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm truncate flex-1">
                          {event.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ml-2 ${
                            theme === "dark"
                              ? "bg-gray-500 text-gray-200"
                              : "bg-white bg-opacity-80"
                          }`}
                        >
                          {event.tipo}
                        </span>
                      </div>

                      {event.desc && (
                        <p className="text-xs mb-2 line-clamp-2 opacity-80">
                          {event.desc}
                        </p>
                      )}

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Início:</span>
                          <span>
                            {formatEventDate(event.start)}{" "}
                            {formatEventTime(event.start)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Fim:</span>
                          <span>
                            {formatEventDate(event.end)}{" "}
                            {formatEventTime(event.end)}
                          </span>
                        </div>
                        {(event.tipo === "reuniao" ||
                          event.tipo === "reuniao-direx") &&
                          event.local === "presencial" &&
                          event.sala && (
                            <div className="flex justify-between text-xs">
                              <span>📍 Sala:</span>
                              <span className="font-medium">
                                {event.sala === "auditorio"
                                  ? "Auditório"
                                  : event.sala === "sala-reuniao"
                                  ? "Sala de Reunião"
                                  : event.sala === "sala-multiuso"
                                  ? "Sala Multiuso"
                                  : event.sala}
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-opacity-30">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{event.autor}</span>
                          <span className="opacity-75">{event.setor}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getEventsByColumn(column.id).length === 0 && (
                    <div
                      className={`text-center py-8 px-4 rounded-lg border-2 border-dashed ${
                        theme === "dark"
                          ? "border-gray-600 text-gray-500"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      <p className="text-sm">Arraste eventos aqui</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {eventoSelecionado && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/10"
          style={{ zIndex: 9999 }}
        >
          {renderEventModal()}
        </div>
      )}
    </div>
  );
};
