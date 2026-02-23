import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserRole } from "../types/interfaces";
import api from "../services/api";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  sectorId: number;
  sectorName: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessSector: (sectorId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("authUser");
      const token = localStorage.getItem("authToken");

      if (token && savedUser) {
        try {
          const response = await api.get("/auth/me");
          if (response.status === 200) {
            const userData = response.data;
            const authUser: AuthUser = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              sectorId: userData.sector?.id || userData.sectorId,
              sectorName: userData.sector?.name || "",
              isActive: userData.isActive,
              lastLogin: userData.lastLogin
                ? new Date(userData.lastLogin)
                : undefined,
            };
            setUser(authUser);
            setIsAuthenticated(true);
            localStorage.setItem("authUser", JSON.stringify(authUser));
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const { token, user: userData } = data;

      localStorage.setItem("authToken", token);

      const authUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        sectorId: userData.sector?.id || userData.sectorId,
        sectorName: userData.sector?.name || "",
        isActive: userData.isActive,
        lastLogin: userData.lastLogin
          ? new Date(userData.lastLogin)
          : undefined,
      };

      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem("authUser", JSON.stringify(authUser));
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authUser");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions = getRolePermissions(user.role);
    return permissions.includes(permission);
  };

  const canAccessSector = (sectorId: number): boolean => {
    if (!user) return false;

    switch (user.role) {
      case "ADMIN":
        return true;
      case "MANAGER":

        return canManagerAccessSector(user.sectorId, sectorId);
      case "COLLABORATOR":
        return user.sectorId === sectorId;
      case "IT_ADMIN":
        return true;
      default:
        return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    canAccessSector,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const getRolePermissions = (role: UserRole): string[] => {
  const permissions: Record<UserRole, string[]> = {
    ADMIN: [
      "create_user",
      "edit_user",
      "delete_user",
      "view_all_users",
      "create_sector",
      "edit_sector",
      "delete_sector",
      "view_all_sectors",
      "create_event",
      "edit_all_events",
      "delete_all_events",
      "view_all_events",
      "manage_system",
    ],
    MANAGER: [
      "create_user",
      "edit_user",
      "delete_user",
      "view_own_sector_users",
      "view_own_sector",
      "edit_own_sector",
      "manage_own_sector",
      "create_event",
      "edit_own_events",
      "view_own_sector_events",
    ],
    COLLABORATOR: [
      "create_event",
      "edit_own_events",
      "view_own_sector_events",
      "view_own_profile",
    ],
    IT_ADMIN: [
      "create_user",
      "edit_user",
      "view_all_users",
      "create_sector",
      "edit_sector",
      "delete_sector",
      "view_all_sectors",
      "reset_passwords",
      "manage_system_settings",
      "view_logs",
    ],
  };

  return permissions[role] || [];
};

const canManagerAccessSector = (
  managerSectorId: number,
  targetSectorId: number
): boolean => {

  const sectorHierarchy: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5],
    2: [2, 4],
    3: [3],
  };

  const accessibleSectors = sectorHierarchy[managerSectorId] || [
    managerSectorId,
  ];
  return accessibleSectors.includes(targetSectorId);
};

export const getAccessibleSectors = (user: AuthUser): number[] => {
  if (!user) return [];

  switch (user.role) {
    case "ADMIN":
      return [1, 2, 3, 4, 5];
    case "MANAGER":

      return [user.sectorId];
    case "COLLABORATOR":
      return [user.sectorId];
    case "IT_ADMIN":
      return [1, 2, 3, 4, 5];
    default:
      return [];
  }
};
