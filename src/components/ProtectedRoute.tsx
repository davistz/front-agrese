import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/interfaces";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requiredSectorAccess?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  requiredPermissions,
  requiredSectorAccess,
}) => {
  const { isAuthenticated, user, hasPermission, canAccessSector } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Removido: bloqueio de usuário inativo

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Role necessário: {requiredRole}
          </p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Permissão necessária: {requiredPermission}
          </p>
        </div>
      </div>
    );
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAnyPermission = requiredPermissions.some((permission) =>
      hasPermission(permission)
    );
    if (!hasAnyPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Acesso Negado
            </h2>
            <p className="text-gray-600">
              Você não tem permissão para acessar esta página.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Necessária uma das permissões: {requiredPermissions.join(", ")}
            </p>
          </div>
        </div>
      );
    }
  }

  if (requiredSectorAccess && !canAccessSector(requiredSectorAccess)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600">Você não tem acesso a este setor.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
