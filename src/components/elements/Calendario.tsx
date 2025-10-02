import moment from "moment";
import {
  Calendar,
  momentLocalizer,
  NavigateAction,
  View,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./Components-Calendario-css.css";
import { useCallback, useState } from "react";
import "moment/locale/pt-br";
import { useTheme } from "../../contexts/ThemeContext";
import { useEvents } from "../../contexts/EventsContext";
import { CustomToolbar } from "./CustomToolbarProps";
import { FiltroAtividades } from "./FiltroAtividades";
import { AddEventButton } from "./AddEventButton";
import { EventType } from "./EventTypeModal";
import { eventTypeBackendToFrontend } from "../../utils/eventTypeBackendToFrontend";
import { ReuniaoModalInfo } from "../modals/ReuniaoInfoModal";
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
import { AtividadeModalInfo } from "../modals/AtividadeInfoModal";
import { DocumentoModalInfo } from "../modals/DocumentoInfoModal";
import { AtividadeExternaModalInfo } from "../modals/AtividadeExternaInfoModal";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

moment.locale("pt-br");

interface CalendarioProps {
  sidebarOpen?: boolean;
}

export const Calendario = ({ sidebarOpen = true }: CalendarioProps) => {
  const { theme } = useTheme();
  const {
    filteredEvents: events,
    setFilteredEvents: setEvents,
    addEvent,
    updateEvent,
  } = useEvents();
  const [currentView, setCurrentView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = useCallback(
    (action: NavigateAction) => {
      const newDate = new Date(currentDate);

      switch (action) {
        case "PREV":
          newDate.setMonth(currentDate.getMonth() - 1);
          break;
        case "NEXT":
          newDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "TODAY":
          newDate.setTime(new Date().getTime());
          break;
        case "DATE":
          break;
      }

      setCurrentDate(newDate);
    },
    [currentDate]
  );

  const handleView = useCallback((newView: View) => {
    setCurrentView(newView);
  }, []);

  const messages = {
    allDay: "Dia inteiro",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Não há eventos neste período.",
    showMore: (total: number) => `+ (${total}) eventos`,
    week: "Semana",
    work_week: "Semana de Trabalho",
    day: "Dia",
    month: "Mês",
    previous: "Anterior",
    next: "Próximo",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    today: "Hoje",
    agenda: "Agenda",

    sunday: "Domingo",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",

    Sun: "Dom",
    Mon: "Seg",
    Tue: "Ter",
    Wed: "Qua",
    Thu: "Qui",
    Fri: "Sex",
    Sat: "Sáb",

    January: "Janeiro",
    February: "Fevereiro",
    March: "Março",
    April: "Abril",
    May: "Maio",
    June: "Junho",
    July: "Julho",
    August: "Agosto",
    September: "Setembro",
    October: "Outubro",
    November: "Novembro",
    December: "Dezembro",
  };

  type Evento = any;
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null
  );

  const handleSelectEvent = (event: any) => {
    setEventoSelecionado(event);
    console.log("Evento selecionado:", event);
  };

  const handleSelectClose = () => {
    setEventoSelecionado(null);
  };

  const onEventDrop = (data: any) => {
    const { start, end } = data;
    const updatedEvents = events.map((event: any) => {
      if (event.id === data.event.id) {
        return {
          ...event,
          start: start,
          end: end,
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  const onEventResize = (data: any) => {
    const { start, end } = data;
    const updatedEvents = events.map((event: any) => {
      if (event.id === data.event.id) {
        return {
          ...event,
          start: start,
          end: end,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const eventStyleProp = (event: any) => {
    let backgroundColor = "#3174ad";

    switch (event.type) {
      case EventType.MEETING:
        backgroundColor = "#d0923a";
        break;
      case EventType.ACTIVITY:
        backgroundColor = "#3ca13c";
        break;
      case EventType.DOCUMENT:
        backgroundColor = "#990a0a";
        break;
      case EventType.EXTERNAL_ACTIVITY:
        backgroundColor = "#8B4513";
        break;
    }
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        opacity: 0.8,
        display: "block",
      },
    };
  };

  const handleCalendarNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      setCurrentDate(newDate);
    },
    []
  );

  const handleAddEvent = useCallback(
    (type: EventType, eventData: any) => {
      addEvent(type, eventData);
    },
    [addEvent]
  );

  const renderEventModal = () => {
    if (!eventoSelecionado) return null;
    const tipoFrontend = eventTypeBackendToFrontend[eventoSelecionado.type] || eventoSelecionado.type;
                console.log(eventoSelecionado)
    switch (tipoFrontend) {
      case EventType.MEETING:
        return (
          <ReuniaoModalInfo
            evento={convertEventToReuniaoModal(eventoSelecionado)}
            onClose={handleSelectClose}
            onSave={(updatedEvent) => {
              const convertedEvent = convertReuniaoModalToEvent(updatedEvent);
              updateEvent(convertedEvent.id, convertedEvent);
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
              updateEvent(convertedEvent.id, convertedEvent);
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
              const convertedEvent = convertAtividadeExternaModalToEvent(updatedEvent);
              updateEvent(convertedEvent.id, convertedEvent);
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
              updateEvent(convertedEvent.id, convertedEvent);
              handleSelectClose();
            }}
          />
        );
      default:
        return <h1>calendario</h1>;
    }
  };

  return (
    <div
      className={`flex gap-4 p-4 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="w-64">
        <div className="">
          <CustomToolbar
            date={currentDate}
            onNavigate={handleNavigate}
            view={currentView}
            onView={handleView}
            eventos={events}
            onFiltroChange={setEvents}
            label={currentDate.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
            views={["month", "week", "day"] as View[]}
          />
        </div>

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
      </div>

      <div className="flex-1">
        <DragAndDropCalendar
          date={currentDate}
          onNavigate={handleCalendarNavigate}
          view={currentView}
          onView={handleView}
          events={events}
          localizer={localizer}
          formats={{
            weekdayFormat: (date: Date) => {
              const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
              return dias[date.getDay()];
            },
          }}
          messages={messages}
          resizable
          components={{
            toolbar: () => null,
          }}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          eventPropGetter={eventStyleProp}
          onSelectEvent={handleSelectEvent}
          className={`calendar ${
            sidebarOpen ? "calendar-expanded" : "calendar-collapsed"
          } ${theme === "dark" ? "calendar-dark" : "calendar-light"}`}
        />
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
