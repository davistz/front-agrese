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
import { notificationServices } from "../services/notificationsServices";
import { userServices } from "../services/usersServices";

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

  const createEventNotification = useCallback(async (event: any, tipo: string) => {
    try {
      console.log('[NOTIFICATION] Criando notificação para evento:', event.title);

      const tipoEventoMap: { [key: string]: string } = {
        'MEETING': 'Reunião',
        'ACTIVITY': 'Atividade',
        'EXTERNAL_ACTIVITY': 'Atividade Externa',
        'DOCUMENT': 'Documento'
      };

      const tipoEvento = tipoEventoMap[event.type] || 'Evento';

      let title = "";
      let message = "";

      if (tipo === 'criado') {
        title = `📅 Nova ${tipoEvento} Criada`;
        message = `${tipoEvento} "${event.title}" foi criada para ${new Date(event.startDate).toLocaleDateString('pt-BR')} às ${new Date(event.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        if (event.type === 'MEETING') {
          const sectorName = event.sector?.name || 'Setor não informado';
          message += `\n\n📍 Setor: ${sectorName}`;

          if (event.location) {
            message += `\n🏢 Local: ${event.location}`;
          }

          if (event.description) {
            message += `\n📝 Descrição: ${event.description}`;
          }

          if (event.participants && event.participants.length > 0) {
            message += `\n👥 Participantes: ${event.participants.length} pessoas`;
          }
        }
      }

      let usersToNotify = [];
      try {

        if (event.assignees && Array.isArray(event.assignees) && event.assignees.length > 0) {
          console.log(`[NOTIFICATION] Notificando usuários atribuídos ao evento (assignees)`);

          const allUsersResponse = await userServices.getUsers();

          if (allUsersResponse && allUsersResponse.users && Array.isArray(allUsersResponse.users)) {

            const assigneeIds = event.assignees.map((a: any) => a.userId || a.id || a);

            const assignedUsers = allUsersResponse.users.filter((u: any) => {
              return assigneeIds.includes(u.id) && u.isActive !== false;
            });

            usersToNotify = assignedUsers.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email
            }));

            console.log(`[NOTIFICATION] ${usersToNotify.length} usuários atribuídos serão notificados:`,
              usersToNotify.map((u: any) => u.name).join(', '));
          }
        } else {

          console.log(`[NOTIFICATION] Nenhum assignee específico, notificando usuários do setor ${event.sectorId}`);
          const allUsersResponse = await userServices.getUsers();

          if (allUsersResponse && allUsersResponse.users && Array.isArray(allUsersResponse.users)) {
            const sectorUsers = allUsersResponse.users.filter((u: any) => {
              return u.sectorId === event.sectorId && u.isActive !== false;
            });

            usersToNotify = sectorUsers.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email
            }));

            console.log(`[NOTIFICATION] ${usersToNotify.length} usuários do setor serão notificados:`,
              usersToNotify.map((u: any) => u.name).join(', '));
          }
        }

        if (usersToNotify.length === 0 && user?.id) {
          usersToNotify = [{ id: user.id, name: user.name, email: user.email }];
          console.log(`[NOTIFICATION] Fallback: notificando apenas o criador ${user.name}`);
        }
      } catch (error) {
        console.error('[NOTIFICATION] Erro ao buscar usuários:', error);

        if (user?.id) {
          usersToNotify = [{ id: user.id, name: user.name, email: user.email }];
        }
      }

      let notificationsCreated = 0;
      for (const targetUser of usersToNotify) {
        try {
          const notificationData = {
            title,
            message,
            type: 'EVENT_CREATED',
            priority: 'MEDIUM',
            eventId: event.id,
            sectorId: event.sectorId,
            userId: targetUser.id,
            recipientId: targetUser.id,
            metadata: {
              eventTitle: event.title,
              eventType: event.type,
              eventDate: event.startDate,
              sectorName: event.sector?.name || `Setor ${event.sectorId}`,
              authorName: user?.name || 'Sistema',
              createdBy: user?.id,
              recipientName: targetUser.name,
              totalRecipients: usersToNotify.length
            }
          };

          await notificationServices.createNotification(notificationData);
          notificationsCreated++;
          console.log(`[NOTIFICATION] ✅ Notificação criada para ${targetUser.name} (${targetUser.email})`);
        } catch (error) {
          console.error(`[NOTIFICATION] ❌ Erro ao criar notificação para ${targetUser.name}:`, error);
        }
      }

      console.log(`[NOTIFICATION] 🎉 ${notificationsCreated}/${usersToNotify.length} notificações criadas com sucesso para o setor`);

    } catch (error) {
      console.error('[NOTIFICATION] Erro ao criar notificação:', error);
    }
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let data = await eventservices.getEvents();
        console.log('[EventsContext] Eventos recebidos do backend:', data);
        const eventosArray = Array.isArray(data.events) ? data.events : [];
        const parsed = eventosArray
          .map((ev: any) => {
            const start = ev.startDate ? new Date(ev.startDate) : (ev.start ? new Date(ev.start) : null);
            const end = ev.endDate ? new Date(ev.endDate) : (ev.end ? new Date(ev.end) : null);
            return {
              ...ev,
              start,
              end,
              tipo: eventTypeBackendToFrontend[ev.type] || ev.type,
            };
          })
          .filter((ev: any) =>
            ev.start instanceof Date && !isNaN(ev.start.getTime()) &&
            ev.end instanceof Date && !isNaN(ev.end.getTime())
          );
        setEvents(parsed);
        setFilteredEvents(parsed);
      } catch (error) {
        console.error("Erro ao buscar eventos do backend:", error);
      }
    };
    fetchEvents();
  }, []);

  const addEvent = useCallback(async (type: EventType, eventData: any) => {
    try {
      let sectorId = eventData.setorId || eventData.sectorId || eventData.setorResponsavel;

      if (Array.isArray(sectorId) && sectorId.length > 0) {
        sectorId = sectorId[0];
      }
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
        const priorityMap: { [key: string]: string } = { baixa: "LOW", media: "MEDIUM", alta: "HIGH" };
        payload = {
          title: eventData.titulo || eventData.title,
          description: eventData.descricao || eventData.description || "",
          type: backendType,
          priority: priorityMap[eventData.prioridade] || eventData.priority || "MEDIUM",
          startDate: eventData.dataHoraInicio || eventData.dataInicio || eventData.dataInicioPrevista || eventData.dataCriacao || eventData.startDate,
          endDate: eventData.dataHoraTermino || eventData.dataFim || eventData.prazoFinal || eventData.prazoAnalise || eventData.endDate,
          isAllDay: eventData.isAllDay || false,
          location: eventData.local || eventData.location || "",
          sectorId,
          assigneeIds: eventData.assigneeIds || eventData.responsaveis || [],
        };
      }
  console.log('[addEvent] Payload enviado:', payload);
  const response = await eventservices.postEvents(payload);
  console.log('[addEvent] Resposta completa:', response);

  const created = response?.event || response;

      if (created && created.id) {
        const parsed = {
          ...created,
          start: created.startDate ? new Date(created.startDate) : (created.start ? new Date(created.start) : new Date()),
          end: created.endDate ? new Date(created.endDate) : (created.end ? new Date(created.end) : new Date()),
          tipo: eventTypeBackendToFrontend[created.type] || created.type,
        };
        console.log('[addEvent] Evento parseado:', parsed);
        setEvents((prev) => [...prev, parsed]);
        setFilteredEvents((prev) => [...prev, parsed]);

        await createEventNotification(created, 'criado');
      } else {
        console.error('[addEvent] Resposta sem evento válido:', response);
      }
    } catch (error: any) {
      console.error("[ADD EVENT] Erro ao adicionar evento:", error);

      if (error?.response?.status === 401) {
        alert("❌ Erro de Autenticação!\n\nSua sessão expirou ou você não está logado.\nPor favor, faça login novamente.");

        window.location.href = '/login';
      } else if (error?.response?.status === 403) {
        alert("❌ Acesso Negado!\n\nVocê não tem permissão para criar eventos.");
      } else {
        alert("❌ Erro ao criar evento!\n\nVerifique sua conexão e tente novamente.");
      }
    }
  }, []);

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
