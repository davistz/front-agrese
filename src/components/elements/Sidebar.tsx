import { FaRegCalendarAlt, FaUserCircle, FaChevronLeft } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { TbHierarchy3, TbLogout } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo1 } from "../../assets";

interface SidebarProps {
  isOpen: boolean;
  activeView?: "calendario" | "setores" | "usuarios";
  onToggle: () => void;
  onViewChange?: (view: "calendario" | "setores" | "usuarios") => void;
}

export const Sidebar = ({
  isOpen,
  activeView,
  onToggle,
  onViewChange,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (
    path: string,
    view?: "calendario" | "setores" | "usuarios"
  ) => {
    if (path !== location.pathname) {
      navigate(path);
    } else if (onViewChange && view) {
      onViewChange(view);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isCalendarioActive =
    activeView === "calendario" || isActiveRoute("/dashboard");
  const isSetoresActive = activeView === "setores" || isActiveRoute("/setores");
  const isUsuariosActive =
    activeView === "usuarios" || isActiveRoute("/usuarios");

  return (
    <div
      className={`fixed left-0 top-0 flex flex-col justify-between bg-gray-800 text-white h-screen z-40 ${
        isOpen ? "w-64" : "w-16"
      } duration-300 shadow-lg`}
    >
      <div className="p-4 border-b border-gray-700 relative">
        <div className="flex items-center">
          <div
            className={`flex items-center ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <Logo1 className="w-8 h-8 text-blue-500 flex-shrink-0" />
            {isOpen && (
              <span className="text-xl font-semibold text-white">Agrese</span>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300 border-2 border-gray-600 flex items-center justify-center shadow-lg z-50"
        >
          <FaChevronLeft
            className={`w-2 h-2 text-white transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>

      <div className="flex-1">
        <div className="px-2">
          <ul className="space-y-3 pt-4">
            <li>
              <button
                onClick={() => handleNavigation("/dashboard", "calendario")}
                className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                  isCalendarioActive
                    ? "bg-blue-50 text-[#34448C]"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
              >
                <FaRegCalendarAlt className="w-6 h-6" />
                {isOpen && (
                  <h1 className="font-bold text-[15px]">Calendário</h1>
                )}
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
                  Calendário
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigation("/setores", "setores")}
                className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                  isSetoresActive
                    ? "bg-blue-50 text-[#34448C]"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
              >
                <TbHierarchy3 className="group-hover:scale-[1.05] w-6 h-6" />
                {isOpen && <h1 className="font-bold text-[15px]">Setores</h1>}
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
                  Setores
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigation("/usuarios", "usuarios")}
                className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                  isUsuariosActive
                    ? "bg-blue-50 text-[#34448C]"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
              >
                <MdGroups2 className="w-6 h-6 group-hover:scale-[1.03] duration-300" />
                {isOpen && <h1 className="font-bold text-[15px]">Usuários</h1>}
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
                  Usuários
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="p-4">
          {isOpen ? (
            <div className="bg-gray-700 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-3">
                <FaUserCircle className="w-10 h-10 text-blue-400 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">
                    Davi Souza
                  </span>
                  <span className="text-xs text-red-400 truncate">
                    Diretor Geral
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <FaUserCircle className="w-8 h-8 text-blue-400" />
            </div>
          )}
        </div>

        <div className="px-2 pb-4 space-y-2">
          <a
            href="#"
            className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700 ${
              isOpen ? "justify-start gap-4 pl-4" : "justify-center"
            }`}
          >
            <TbLogout className="w-5 h-5" />
            {isOpen && <h1 className="font-bold text-[15px]">Sair</h1>}
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
              Sair
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
