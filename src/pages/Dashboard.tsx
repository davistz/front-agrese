import { useState } from "react";
import { Calendario } from "../components/elements/Calendario";
import { Sidebar } from "../components/elements/Sidebar";

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen">
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
