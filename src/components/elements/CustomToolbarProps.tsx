import { View, ViewsProps, NavigateAction } from "react-big-calendar";
import { eventosPadrao } from "./eventosPadrao";
import { useCallback, useMemo } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCalendar3, BsCalendarWeek, BsCalendarDay } from "react-icons/bs";

interface CustomToolbarProps {
  label: string;
  onView: (view: View) => void;
  onNavigate: (action: NavigateAction) => void;
  views: View[];
  view: View;
  eventos?: Evento[];
  onFiltroChange?: (eventos: Evento[]) => void;
  date: Date;
}

type Evento = (typeof eventosPadrao)[number];

export const CustomToolbar: React.FC<CustomToolbarProps> = ({
  label,
  onView,
  onNavigate,
  views,
  view,
  date,
  eventos = eventosPadrao,
  onFiltroChange,
}) => {
  const formatLabel = useCallback((date: Date) => {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    return `${meses[date.getMonth()]} ${date.getFullYear()}`;
  }, []);

  const labelTraduzido = useMemo(() => formatLabel(date), [date, formatLabel]);

  const getViewName = (viewType: View) => {
    switch (viewType) {
      case "month":
        return "Mês";
      case "week":
        return "Semana";
      case "day":
        return "Dia";
      case "agenda":
        return "Agenda";
      default:
        return "Mês";
    }
  };

  const getViewIcon = (viewType: View) => {
    switch (viewType) {
      case "month":
        return <BsCalendar3 className="text-sm" />;
      case "week":
        return <BsCalendarWeek className="text-sm" />;
      case "day":
        return <BsCalendarDay className="text-sm" />;
      default:
        return <BsCalendar3 className="text-sm" />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-1">
        <h2 className="text-3xl font-bold text-black">{labelTraduzido}</h2>
      </div>

      <div className="channel mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
            className="text-[13px] flex items-center gap-1 hover:font-semibold cursor-pointer"
          >
            <FaArrowAltCircleLeft className="text-xs mt-[1px] text-[#808080]" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => onNavigate("TODAY")}
            className="text-[13px] flex items-center gap-1 hover:font-semibold cursor-pointer"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
            className="text-[13px] flex items-center gap-1 hover:font-semibold cursor-pointer"
          >
            Próximo
            <FaArrowAltCircleRight className="text-xs mt-[1px] text-[#808080]" />
          </button>
        </div>
      </div>

      <div className="mb-1">
        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
          {["month", "week", "day"].map((viewType) => (
            <button
              key={viewType}
              type="button"
              onClick={() => onView(viewType as View)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === viewType
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {getViewIcon(viewType as View)}
              {getViewName(viewType as View)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <span className="text-sm text-gray-600">
          Visualização: <span className="font-medium">{getViewName(view)}</span>
        </span>
      </div>
    </div>
  );
};
