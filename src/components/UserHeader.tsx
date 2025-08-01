import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";

export const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { getRoleDisplayName, getRoleColor } = usePermissions();

  if (!user) return null;

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                user.role
              )}`}
            >
              {getRoleDisplayName(user.role)}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{user.sectorName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user.lastLogin && (
            <span className="text-xs text-gray-500">
              Último acesso: {new Date(user.lastLogin).toLocaleString("pt-BR")}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <FiLogOut className="text-lg" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
