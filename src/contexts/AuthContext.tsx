import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserRole } from "../types/interfaces";

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

  // Carrega dados do usuário do localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simula chamada para API
      const userData = await authenticateUser(email, password);

      if (userData) {
        const authUser: AuthUser = {
          ...userData,
          lastLogin: new Date(),
        };

        setUser(authUser);
        setIsAuthenticated(true);

        // Salva no localStorage
        localStorage.setItem("authUser", JSON.stringify(authUser));

        return true;
      }

      return false;
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
        return true; // Admin tem acesso a todos os setores
      case "MANAGER":
        // Manager pode acessar seu setor e setores subordinados
        return canManagerAccessSector(user.sectorId, sectorId);
      case "COLLABORATOR":
        return user.sectorId === sectorId; // Só pode acessar próprio setor
      case "IT_ADMIN":
        return true; // IT_ADMIN tem acesso especial
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

// Função para autenticar usuário (simulada)
const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthUser | null> => {
  // Dados mocados dos usuários
  const mockUsers: AuthUser[] = [
    {
      id: 1,
      email: "admin@agrese.com",
      name: "Administrador Sistema",
      role: "ADMIN",
      sectorId: 1,
      sectorName: "Presidência",
      isActive: true,
    },
    {
      id: 2,
      email: "daf@agrese.com",
      name: "Diretor Administrativo",
      role: "MANAGER",
      sectorId: 2,
      sectorName: "DAF - Diretoria Administrativa Financeira",
      isActive: true,
    },
    {
      id: 3,
      email: "diretor.tecnico@agrese.com",
      name: "Diretor Técnico",
      role: "MANAGER",
      sectorId: 3,
      sectorName: "Diretoria Técnica",
      isActive: true,
    },
    {
      id: 4,
      email: "colaborador@agrese.com",
      name: "Colaborador Geral",
      role: "COLLABORATOR",
      sectorId: 4,
      sectorName: "Setor Operacional",
      isActive: true,
    },
    {
      id: 5,
      email: "ti@agrese.com",
      name: "Administrador TI",
      role: "IT_ADMIN",
      sectorId: 5,
      sectorName: "Tecnologia da Informação",
      isActive: true,
    },
  ];

  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Para demonstração, qualquer senha é aceita se for "123456"
  // Em produção, aqui você faria a validação real
  if (password !== "123456") {
    return null;
  }

  const user = mockUsers.find((u) => u.email === email && u.isActive);
  return user || null;
};

// Define as permissões por role
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
      "create_user", // Apenas no próprio setor
      "edit_user", // Apenas no próprio setor
      "delete_user", // Apenas no próprio setor
      "view_own_sector_users", // Ver usuários do próprio setor
      "view_own_sector", // Visualizar próprio setor
      "edit_own_sector", // Editar próprio setor
      "manage_own_sector", // Gerenciar próprio setor
      "create_event", // Criar eventos no próprio setor
      "edit_own_events", // Editar eventos do próprio setor
      "view_own_sector_events", // Ver eventos do próprio setor
    ],
    COLLABORATOR: [
      "create_event", // Apenas no próprio setor
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

// Função para verificar se um manager pode acessar um setor
const canManagerAccessSector = (
  managerSectorId: number,
  targetSectorId: number
): boolean => {
  // Hierarquia mocada dos setores
  const sectorHierarchy: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5], // Presidência - acesso a todos
    2: [2, 4], // DAF - acesso ao próprio e setores subordinados
    3: [3], // Diretoria Técnica - apenas próprio setor
  };

  const accessibleSectors = sectorHierarchy[managerSectorId] || [
    managerSectorId,
  ];
  return accessibleSectors.includes(targetSectorId);
};

// Função para filtrar setores que o usuário pode ver
export const getAccessibleSectors = (user: AuthUser): number[] => {
  if (!user) return [];

  switch (user.role) {
    case "ADMIN":
      return [1, 2, 3, 4, 5]; // Todos os setores
    case "MANAGER":
      // Manager pode ver APENAS o próprio setor
      return [user.sectorId];
    case "COLLABORATOR":
      return [user.sectorId]; // Apenas próprio setor
    case "IT_ADMIN":
      return [1, 2, 3, 4, 5]; // Todos os setores para funções técnicas
    default:
      return [];
  }
};
