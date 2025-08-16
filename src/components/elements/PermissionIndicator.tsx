import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../contexts/AuthContext";

export const PermissionIndicator: React.FC = () => {
  const { theme } = useTheme();
  const { canCreateDirexMeeting } = usePermissions();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
      className={`p-3 rounded-lg mb-4 ${
        theme === "dark" ? "bg-gray-700" : "bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            canCreateDirexMeeting() ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
        <div>
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {user.name} - {user.role}
          </p>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {canCreateDirexMeeting()
              ? "✅ Autorizado para reuniões Direx"
              : "❌ Sem acesso para reuniões Direx"}
          </p>
        </div>
      </div>
    </div>
  );
};
