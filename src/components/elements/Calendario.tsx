import moment from "moment";

import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./Components-Calendario-css.css";
import { useState } from "react";
import { eventosPadrao } from "./eventosPadrao";
import { EventModal } from "../EventModal";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

export const Calendario = () => {
  const [events, setEvents] = useState(eventosPadrao);

  type Evento = (typeof eventosPadrao)[number];
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
    const updatedEvents = events.map((event) => {
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
    const updatedEvents = events.map((event) => {
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

  return (
    <>
      <div className="">
        <DragAndDropCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={events}
          localizer={localizer}
          resizable
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          onSelectEvent={handleSelectEvent}
          className="calendar"
        />
      </div>

      {eventoSelecionado && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/10"
          style={{ zIndex: 9999 }}
        >
          <EventModal evento={eventoSelecionado} onClose={handleSelectClose} />
        </div>
      )}
    </>
  );
};
