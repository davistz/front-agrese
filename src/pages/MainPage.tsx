import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { Dashboard } from "./Dashboard";
import { SetoresManagement } from "./SetoresManagement";
import { SetorDetail } from "./SetorDetails";
import { UserPage } from "./UserPage";
import { NotificacoesPage } from "./NotificacoesPage";
import { RelatoriosPage } from "./RelatoriosPage";
import { PermissionsTest } from "./PermissionsTest";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

export const MainPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notificacoes"
        element={
          <ProtectedRoute>
            <NotificacoesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/permissions-test"
        element={
          <ProtectedRoute>
            <PermissionsTest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setores"
        element={
          <ProtectedRoute
            requiredPermissions={["view_all_sectors", "view_own_sector"]}
          >
            <SetoresManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setores/:setorKey"
        element={
          <ProtectedRoute>
            <SetorDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute
            requiredPermissions={["view_all_users", "view_own_sector_users"]}
          >
            <UserPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <ProtectedRoute>
            <RelatoriosPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
