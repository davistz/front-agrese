import {
  FaRegCalendarAlt,
  FaUserCircle,
  FaChevronLeft,
  FaBell,
} from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { TbHierarchy3, TbLogout } from "react-icons/tb";
import { HiSun, HiMoon } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import { useNotifications } from "../../hooks/useNotifications";
import { Logo1 } from "../../assets";

interface SidebarProps {
  isOpen: boolean;
  activeView?: "calendario" | "setores" | "usuarios" | "notificacoes";
  onToggle: () => void;
  onViewChange?: (
    view: "calendario" | "setores" | "usuarios" | "notificacoes"
  ) => void;
}

export const Sidebar = ({
  isOpen,
  activeView,
  onToggle,
  onViewChange,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const {
    canViewAllSectors,
    canViewAllUsers,
    canViewCalendar,
    canViewNotifications,
  } = usePermissions();
  const { notificacoesNaoLidas, contadorAtualizado } = useNotifications();

  const [contadorKey, setContadorKey] = useState(0);

  useEffect(() => {
    setContadorKey((prev) => prev + 1);
  }, [notificacoesNaoLidas, contadorAtualizado]);

  useEffect(() => {
    const interval = setInterval(() => {
      setContadorKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (
    path: string,
    view?: "calendario" | "setores" | "usuarios" | "notificacoes"
  ) => {
    if (path !== location.pathname) {
      navigate(path);
    } else if (onViewChange && view) {
      onViewChange(view);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
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
  const isNotificacoesActive =
    activeView === "notificacoes" || isActiveRoute("/notificacoes");

  return (
    <div
      className={`fixed left-0 top-0 flex flex-col justify-between text-white h-screen z-40 ${
        isOpen ? "w-64" : "w-16"
      } duration-300 shadow-lg ${
        theme === "dark" ? "bg-[#006BA6]" : "bg-[#0092DA]"
      }`}
    >
      <div
        className={`p-4 border-b relative ${
          theme === "dark" ? "border-[#005A8A]" : "border-[#007BB8]"
        }`}
      >
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
          className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-300 border-2 flex items-center justify-center shadow-lg z-50 ${
            theme === "dark"
              ? "bg-[#005A8A] hover:bg-[#004A7A] border-[#004A7A]"
              : "bg-[#007BB8] hover:bg-[#006AA0] border-[#006AA0]"
          }`}
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
            {canViewCalendar() && (
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard", "calendario")}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                    isCalendarioActive
                      ? theme === "dark"
                        ? "bg-[#005A8A] text-white"
                        : "bg-white text-[#0092DA]"
                      : theme === "dark"
                      ? "text-gray-200 hover:bg-[#005A8A]/50 hover:text-white"
                      : "text-gray-200 hover:bg-[#007BB8]/50 hover:text-white"
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
            )}

            {canViewNotifications() && (
              <li>
                <button
                  onClick={() =>
                    handleNavigation("/notificacoes", "notificacoes")
                  }
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                    isNotificacoesActive
                      ? theme === "dark"
                        ? "bg-[#005A8A] text-white"
                        : "bg-white text-[#0092DA]"
                      : theme === "dark"
                      ? "text-gray-200 hover:bg-[#005A8A]/50 hover:text-white"
                      : "text-gray-200 hover:bg-[#007BB8]/50 hover:text-white"
                  } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
                >
                  <div className="relative">
                    <FaBell className="w-6 h-6" />
                  </div>
                  {isOpen && (
                    <h1 className="font-bold text-[15px]">Notificações</h1>
                  )}
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
                    Notificações
                  </span>
                </button>
              </li>
            )}

            {canViewAllSectors() && (
              <li>
                <button
                  onClick={() => handleNavigation("/setores", "setores")}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                    isSetoresActive
                      ? theme === "dark"
                        ? "bg-[#005A8A] text-white"
                        : "bg-white text-[#0092DA]"
                      : theme === "dark"
                      ? "text-gray-200 hover:bg-[#005A8A]/50 hover:text-white"
                      : "text-gray-200 hover:bg-[#007BB8]/50 hover:text-white"
                  } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
                >
                  <TbHierarchy3 className="group-hover:scale-[1.05] w-6 h-6" />
                  {isOpen && <h1 className="font-bold text-[15px]">Setores</h1>}
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
                    Setores
                  </span>
                </button>
              </li>
            )}

            {canViewAllUsers() && (
              <li>
                <button
                  onClick={() => handleNavigation("/usuarios", "usuarios")}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
                    isUsuariosActive
                      ? theme === "dark"
                        ? "bg-[#005A8A] text-white"
                        : "bg-white text-[#0092DA]"
                      : theme === "dark"
                      ? "text-gray-200 hover:bg-[#005A8A]/50 hover:text-white"
                      : "text-gray-200 hover:bg-[#007BB8]/50 hover:text-white"
                  } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
                >
                  <MdGroups2 className="w-6 h-6 group-hover:scale-[1.03] duration-300" />
                  {isOpen && (
                    <h1 className="font-bold text-[15px]">Usuários</h1>
                  )}
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
                    Usuários
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div
        className={`border-t ${
          theme === "dark" ? "border-[#005A8A]" : "border-[#007BB8]"
        }`}
      >
        <div className="p-4">
          {isOpen ? (
            <div
              className={`rounded-lg p-3 mb-3 ${
                theme === "dark" ? "bg-[#005A8A]" : "bg-[#007BB8]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaUserCircle className="w-10 h-10 text-[#00B4E6] flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">
                    {user?.name || "Usuário"}
                  </span>
                  <span className="text-xs text-[#00B4E6] truncate">
                    {user?.sectorName || "Setor"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <FaUserCircle className="w-8 h-8 text-[#00B4E6]" />
            </div>
          )}
        </div>

        <div className="px-2 pb-4 space-y-2">
          <button
            onClick={toggleTheme}
            className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full text-left ${
              theme === "dark"
                ? "text-gray-200 hover:bg-[#005A8A]/50 hover:text-white"
                : "text-gray-200 hover:bg-[#007BB8]/50 hover:text-white"
            } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
          >
            {theme === "dark" ? (
              <HiSun className="w-5 h-5" />
            ) : (
              <HiMoon className="w-5 h-5" />
            )}
            {isOpen && (
              <h1 className="font-bold text-[15px]">
                {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              </h1>
            )}
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
              {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className={`group relative flex items-center rounded-sm px-2 py-1.5 w-full ${
              theme === "dark"
                ? "text-gray-200 hover:bg-[#005A8A]/50 hover:text-white"
                : "text-gray-200 hover:bg-[#007BB8]/50 hover:text-white"
            } ${isOpen ? "justify-start gap-4 pl-4" : "justify-center"}`}
          >
            <TbLogout className="w-5 h-5" />
            {isOpen && <h1 className="font-bold text-[15px]">Sair</h1>}
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible z-50">
              Sair
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
