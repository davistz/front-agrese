import { useState } from "react";
import { Calendario } from "../components/elements/Calendario";
import { Sidebar } from "../components/elements/Sidebar";
import { useTheme } from "../contexts/ThemeContext";

export const Dashboard = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
          className={`flex-1 mt-10 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Calendario sidebarOpen={isOpen} />
        </div>
      </div>
    </div>
  );
};
