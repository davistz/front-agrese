import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { eventosPadrao } from "../components/elements/eventosPadrao";
import { EventType } from "../components/elements/EventTypeModal";

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
  const [events, setEvents] = useState<Event[]>(eventosPadrao);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(eventosPadrao);

  const addEvent = useCallback(
    (type: EventType, eventData: any) => {
      if (
        (type === "reuniao" || type === "reuniao-direx") &&
        eventData.local === "presencial" &&
        eventData.sala
      ) {
        const hasConflict = events.some((event) => {
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

          if (event.sala !== eventData.sala) {
            return false;
          }

          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          const newStart = new Date(eventData.dataHoraInicio);
          const newEnd = new Date(eventData.dataHoraTermino);

          return (
            (newStart >= eventStart && newStart < eventEnd) ||
            (newEnd > eventStart && newEnd <= eventEnd) ||
            (newStart <= eventStart && newEnd >= eventEnd)
          );
        });

        if (hasConflict) {
          console.error("Conflito de sala detectado!");
          throw new Error("A sala já está ocupada neste horário!");
        }
      }

      let novoEvento: Event;
      const newId = Math.max(...events.map((e) => e.id || 0), 0) + 1;

      switch (type) {
        case "reuniao":
          novoEvento = {
            id: newId,
            title: eventData.titulo || "Nova Reunião",
            start: eventData.dataHoraInicio || new Date(),
            end:
              eventData.dataHoraTermino ||
              new Date(new Date().setHours(new Date().getHours() + 1)),
            desc: eventData.descricao || "",
            autor: eventData.autor || "Usuário",
            setor: eventData.setorResponsavel || "",
            tipo: type,
            status: "pendente",
            ...eventData,
          };
          break;
        case "reuniao-direx":
          novoEvento = {
            id: newId,
            title: eventData.titulo || "Nova Reunião Direx",
            start: eventData.dataHoraInicio || new Date(),
            end:
              eventData.dataHoraTermino ||
              new Date(new Date().setHours(new Date().getHours() + 1)),
            desc: eventData.descricao || "",
            autor: eventData.autor || "Usuário",
            setor: eventData.setorResponsavel || "Diretoria Executiva",
            tipo: type,
            status: "pendente",
            prioridade: "alta",
            ...eventData,
          };
          break;
        case "atividade":
          novoEvento = {
            id: newId,
            title: eventData.titulo || "Nova Atividade",
            start: eventData.dataInicio || new Date(),
            end:
              eventData.dataFim ||
              new Date(new Date().setHours(new Date().getHours() + 1)),
            desc: eventData.descricao || "",
            autor: eventData.autor || "Usuário",
            setor: eventData.setorResponsavel || "",
            tipo: type,
            status: "pendente",
            ...eventData,
          };
          break;
        case "atividades-externas":
          novoEvento = {
            id: events.length + 1,
            title: eventData.titulo || "Nova Atividade Externa",
            start: eventData.dataHoraSaida || new Date(),
            end:
              eventData.dataHoraRetorno ||
              new Date(new Date().setHours(new Date().getHours() + 1)),
            desc: eventData.descricao || "",
            autor: eventData.autor || "Usuário",
            setor: eventData.setorResponsavel || "",
            tipo: type,
            status: "pendente",
            ...eventData,
          };
          break;
        case "documento":
          novoEvento = {
            id: events.length + 1,
            title: eventData.titulo || "Novo Documento",
            start: eventData.prazoAnalise || new Date(),
            end:
              eventData.prazoAnalise ||
              new Date(new Date().setHours(new Date().getHours() + 1)),
            desc: eventData.descricao || "",
            autor: eventData.autor || "Usuário",
            setor: eventData.setorResponsavel || "",
            tipo: type,
            status: "pendente",
            ...eventData,
          };
          break;
        default:
          novoEvento = {
            id: events.length + 1,
            title: "Novo Evento",
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
            desc: "",
            autor: "Usuário",
            setor: "",
            tipo: type,
            status: "pendente",
          };
      }

      const newEvents = [...events, novoEvento];
      setEvents(newEvents);
      setFilteredEvents(newEvents);
    },
    [events]
  );

  const updateEvent = useCallback(
    (id: number, updatedEvent: Partial<Event>) => {
      const newEvents = events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      );
      setEvents(newEvents);
      setFilteredEvents(newEvents);
    },
    [events]
  );

  const deleteEvent = useCallback(
    (id: number) => {
      const newEvents = events.filter((event) => event.id !== id);
      setEvents(newEvents);
      setFilteredEvents(newEvents);
    },
    [events]
  );

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
