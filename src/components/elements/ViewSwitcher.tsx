import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface ViewSwitcherProps {
  currentView: "calendario" | "kanban";
  onViewChange: (view: "calendario" | "kanban") => void;
}

export const ViewSwitcher = ({
  currentView,
  onViewChange,
}: ViewSwitcherProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg shadow-md ${
        theme === "dark" ? "bg-gray-700" : "bg-white"
      }`}
    >
      <span
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Visualização:
      </span>

      <div
        className={`flex rounded-lg border ${
          theme === "dark"
            ? "border-gray-600 bg-gray-800"
            : "border-gray-300 bg-gray-100"
        }`}
      >
        <button
          onClick={() => onViewChange("calendario")}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-200 flex items-center gap-2 ${
            currentView === "calendario"
              ? theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          Calendário
        </button>

        <button
          onClick={() => onViewChange("kanban")}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-200 flex items-center gap-2 ${
            currentView === "kanban"
              ? theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white"
              : theme === "dark"
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Kanban
        </button>
      </div>
    </div>
  );
};
