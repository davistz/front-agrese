import { useState } from "react";
import { Calendario } from "../components/elements/Calendario";
import { Kanban } from "../components/elements/Kanban";
import { Sidebar } from "../components/elements/Sidebar";
import { ViewSwitcher } from "../components/elements/ViewSwitcher";
import { useTheme } from "../contexts/ThemeContext";

export const Dashboard = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [currentView, setCurrentView] = useState<"calendario" | "kanban">(
    "calendario"
  );

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleViewChange = (view: "calendario" | "kanban") => {
    setCurrentView(view);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="flex">
        <Sidebar
          isOpen={isOpen}
          activeView="calendario"
          onToggle={toggleSidebar}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div
            className={`p-4 border-b ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <h1
                className={`text-2xl ml-4 font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {currentView === "calendario" ? "Calendário" : "Quadro Agrese"}
              </h1>
              <ViewSwitcher
                currentView={currentView}
                onViewChange={handleViewChange}
              />
            </div>
          </div>

          <div className="h-[calc(100vh-80px)]">
            {currentView === "calendario" ? (
              <Calendario sidebarOpen={isOpen} />
            ) : (
              <Kanban sidebarOpen={isOpen} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
