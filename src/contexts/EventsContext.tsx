import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { EventType } from "../components/elements/EventTypeModal";
import { eventTypeFrontendToBackend } from "../utils/eventTypeFrontendToBackend";
import { eventTypeBackendToFrontend } from "../utils/eventTypeBackendToFrontend";
import { eventservices } from "../services/eventsServices";
import { useAuth } from "./AuthContext";

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  desc: string;
  autor: string;
  setor: string;
  tipo: string;
  status?: string;
  prioridade?: string;
  [key: string]: any;
}

interface EventsContextType {
  events: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (type: EventType, eventData: any) => void;
  updateEvent: (id: number, updatedEvent: Partial<Event>) => void;
  deleteEvent: (id: number) => void;
  filteredEvents: Event[];
  setFilteredEvents: (events: Event[]) => void;
  checkTimeConflict: (
    startDate: Date,
    endDate: Date,
    excludeId?: number
  ) => boolean;
  getConflictingEvents: (
    startDate: Date,
    endDate: Date,
    excludeId?: number
  ) => Event[];
  checkRoomConflict: (
    startDate: Date,
    endDate: Date,
    sala: string,
    excludeId?: number
  ) => boolean;
  getRoomConflictingEvents: (
    startDate: Date,
    endDate: Date,
    sala: string,
    excludeId?: number
  ) => Event[];
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Buscar eventos do backend ao carregar
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let data = await eventservices.getEvents();
        console.log('[EventsContext] Eventos recebidos do backend:', data);
        const eventosArray = Array.isArray(data.events) ? data.events : [];
        const parsed = eventosArray.map((ev: any) => ({
          ...ev,
          start: ev.start ? new Date(ev.start) : (ev.startDate ? new Date(ev.startDate) : undefined),
          end: ev.end ? new Date(ev.end) : (ev.endDate ? new Date(ev.endDate) : undefined),
          tipo: eventTypeBackendToFrontend[ev.type] || ev.type,
        }));
        setEvents(parsed);
        setFilteredEvents(parsed);
      } catch (error) {
        console.error("Erro ao buscar eventos do backend:", error);
      }
    };
    fetchEvents();
  }, []);

  // Adicionar evento no backend
  const addEvent = useCallback(async (type: EventType, eventData: any) => {
    try {
      let sectorId = eventData.setorId || eventData.sectorId || eventData.setorResponsavel;
      if (typeof sectorId === "string" && !isNaN(Number(sectorId))) {
        sectorId = Number(sectorId);
      }
      if (typeof sectorId !== "number" || isNaN(sectorId)) {
        console.error("[ADD EVENT] sectorId inválido:", sectorId);
        alert("Selecione um setor válido!");
        return;
      }
      const backendType = eventTypeFrontendToBackend[type] || type;
      let payload;
      if (backendType === "EXTERNAL_ACTIVITY") {
        // Mapeamento correto dos campos do formulário
        const statusMap: { [key: string]: string } = {
          'planejada': 'PLANNED',
          'em-execucao': 'IN_EXECUTION',
          'realizada': 'COMPLETED',
          'cancelada': 'CANCELLED'
        };
        payload = {
          title: eventData.titulo || eventData.title,
          description: eventData.descricao || eventData.description || "",
          type: backendType,
          priority: eventData.prioridade || eventData.priority || "MEDIUM",
          startDate: eventData.dataHoraSaida || eventData.startDate,
          endDate: eventData.dataHoraRetorno || eventData.endDate,
          sectorId: Number(eventData.setorResponsavel),
          externalStatus: statusMap[String(eventData.status)] || "PLANNED",
          destination: eventData.destino,
          departureTime: eventData.dataHoraSaida,
          returnTime: eventData.dataHoraRetorno,
          transportMode: eventData.meioTransporte,
          activityReason: eventData.motivoAtividade,
          assignees: eventData.assigneeIds || eventData.responsaveis || [],
        };
      } else {
        const priorityMap = { baixa: "LOW", media: "MEDIUM", alta: "HIGH" };
        payload = {
          title: eventData.titulo || eventData.title,
          description: eventData.descricao || eventData.description || "",
          type: backendType,
          priority: priorityMap[eventData.prioridade] || eventData.priority || "MEDIUM",
          startDate: eventData.dataHoraInicio || eventData.startDate,
          endDate: eventData.dataHoraTermino || eventData.endDate,
          isAllDay: eventData.isAllDay || false,
          location: eventData.local || eventData.location || "",
          sectorId,
          assigneeIds: eventData.assigneeIds || eventData.responsaveis || [],
        };
      }
  console.log('[addEvent] Payload enviado:', payload);
  const created = await eventservices.postEvents(payload);
      if (created) {
        const parsed = {
          ...created,
          start: created.startDate ? new Date(created.startDate) : undefined,
          end: created.endDate ? new Date(created.endDate) : undefined,
          tipo: eventTypeBackendToFrontend[created.type] || created.type,
        };
        setEvents((prev) => [...prev, parsed]);
        setFilteredEvents((prev) => [...prev, parsed]);
      }
    } catch (error) {
      console.error("[ADD EVENT] Erro ao adicionar evento:", error);
    }
  }, []);

  // Editar evento no backend
  const updateEvent = useCallback(
    async (id: number, updatedEvent: Partial<Event>) => {
      try {
        const updated = await eventservices.putEvents(String(id), updatedEvent);
        if (updated) {
          setEvents((prev) =>
            prev.map((event) => (event.id === id ? { ...event, ...updated } : event))
          );
          setFilteredEvents((prev) =>
            prev.map((event) => (event.id === id ? { ...event, ...updated } : event))
);
        }
      } catch (error) {
        console.error("Erro ao editar evento:", error);
      }
    },
    []
  );

  // Excluir evento no backend
  const deleteEvent = useCallback(async (id: number) => {
    try {
      await eventservices.deleteEvents(String(id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
      setFilteredEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  }, []);

  const checkTimeConflict = useCallback(
    (startDate: Date, endDate: Date, excludeId?: number): boolean => {
      return events.some((event) => {
        if (excludeId && event.id === excludeId) {
          return false;
        }

        if (!["reuniao", "reuniao-direx"].includes(event.tipo)) {
          return false;
        }

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        return (
          (newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd)
        );
      });
    },
    [events]
  );

  const getConflictingEvents = useCallback(
    (startDate: Date, endDate: Date, excludeId?: number): Event[] => {
      return events.filter((event) => {
        if (excludeId && event.id === excludeId) {
          return false;
        }

        if (!["reuniao", "reuniao-direx"].includes(event.tipo)) {
          return false;
        }

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        return (
          (newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd)
        );
      });
    },
    [events]
  );

  const checkRoomConflict = useCallback(
    (
      startDate: Date,
      endDate: Date,
      sala: string,
      excludeId?: number
    ): boolean => {
      if (!sala || sala.trim() === "") {
        return false;
      }

      return events.some((event) => {
        if (excludeId && event.id === excludeId) {
          return false;
        }

        if (!["reuniao", "reuniao-direx"].includes(event.tipo)) {
          return false;
        }

        if (
          event.local !== "presencial" ||
          !event.sala ||
          event.sala.trim() === ""
        ) {
          return false;
        }

        if (event.sala !== sala) {
          return false;
        }

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        return (
          (newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd)
        );
      });
    },
    [events]
  );

  const getRoomConflictingEvents = useCallback(
    (
      startDate: Date,
      endDate: Date,
      sala: string,
      excludeId?: number
    ): Event[] => {
      if (!sala || sala.trim() === "") {
        return [];
      }

      return events.filter((event) => {
        if (excludeId && event.id === excludeId) {
          return false;
        }

        if (!["reuniao", "reuniao-direx"].includes(event.tipo)) {
          return false;
        }

        if (
          event.local !== "presencial" ||
          !event.sala ||
          event.sala.trim() === ""
        ) {
          return false;
        }

        if (event.sala !== sala) {
          return false;
        }

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        return (
          (newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd)
        );
      });
    },
    [events]
  );

  const value: EventsContextType = {
    events,
    setEvents: (newEvents) => {
      setEvents(newEvents);
      setFilteredEvents(newEvents);
    },
    addEvent,
    updateEvent,
    deleteEvent,
    filteredEvents,
    setFilteredEvents,
    checkTimeConflict,
    getConflictingEvents,
    checkRoomConflict,
    getRoomConflictingEvents,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
