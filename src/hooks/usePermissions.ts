import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/interfaces";
import { getAccessibleSectors } from "../contexts/AuthContext";

export const usePermissions = () => {
  const { user, hasPermission, canAccessSector } = useAuth();

  // Permissões específicas para usuários
  const canCreateUser = () => hasPermission("create_user");
  const canEditUser = (userId?: number) => {
    if (!user) return false;

    if (hasPermission("edit_user")) {
      // ADMIN e IT_ADMIN podem editar qualquer usuário
      if (user.role === "ADMIN" || user.role === "IT_ADMIN") return true;

      // MANAGER pode editar usuários de setores subordinados
      if (user.role === "MANAGER") return true; // Implementar lógica de hierarquia

      // COLLABORATOR pode editar apenas próprio perfil
      if (user.role === "COLLABORATOR" && userId === user.id) return true;
    }

    return false;
  };

  const canDeleteUser = () => hasPermission("delete_user");
  const canViewAllUsers = () => {
    // ADMIN e IT_ADMIN podem ver todos
    if (hasPermission("view_all_users")) return true;
    // MANAGER pode ver usuários do próprio setor
    if (hasPermission("view_own_sector_users")) return true;
    return false;
  };

  // Permissões específicas para calendário e notificações
  const canViewCalendar = () => {
    // Todos podem acessar calendário
    return true;
  };

  const canViewNotifications = () => {
    // COLLABORATOR não pode acessar notificações
    if (user?.role === "COLLABORATOR") return false;
    return true;
  };

  const canFilterBySector = () => {
    // COLLABORATOR não pode filtrar por setor
    if (user?.role === "COLLABORATOR") return false;
    return true;
  };

  // Permissões específicas para setores
  const canCreateSector = () => {
    // IT_ADMIN também pode criar setores
    if (user?.role === "IT_ADMIN") return true;
    return hasPermission("create_sector");
  };
  const canEditSector = (sectorId?: number) => {
    if (!user) return false;

    // ADMIN e IT_ADMIN podem editar qualquer setor
    if (hasPermission("edit_sector")) return true;
    if (user.role === "IT_ADMIN") return true;

    // MANAGER pode editar apenas o próprio setor
    if (hasPermission("edit_own_sector") && sectorId === user.sectorId)
      return true;

    return false;
  };
  const canDeleteSector = () => {
    // IT_ADMIN também pode deletar setores
    if (user?.role === "IT_ADMIN") return true;
    return hasPermission("delete_sector");
  };
  const canViewAllSectors = () => {
    // ADMIN e IT_ADMIN podem ver todos os setores
    if (hasPermission("view_all_sectors")) return true;
    // IT_ADMIN também pode ver todos os setores
    if (user?.role === "IT_ADMIN") return true;
    // MANAGER pode ver próprio setor
    if (hasPermission("view_own_sector")) return true;
    return false;
  };

  // Permissões específicas para eventos
  const canCreateEvent = () => hasPermission("create_event");
  const canEditEvent = (eventSectorId?: number, eventCreatorId?: number) => {
    if (!user) return false;

    // ADMIN pode editar todos os eventos
    if (hasPermission("edit_all_events")) return true;

    // MANAGER pode editar eventos de setores subordinados
    if (hasPermission("edit_subordinate_events") && eventSectorId) {
      return canAccessSector(eventSectorId);
    }

    // COLLABORATOR pode editar apenas próprios eventos
    if (hasPermission("edit_own_events") && eventCreatorId === user.id) {
      return true;
    }

    return false;
  };

  const canDeleteEvent = (eventSectorId?: number, eventCreatorId?: number) => {
    if (!user) return false;

    // ADMIN pode deletar todos os eventos
    if (hasPermission("delete_all_events")) return true;

    // MANAGER e COLLABORATOR seguem mesma lógica do edit
    return canEditEvent(eventSectorId, eventCreatorId);
  };

  const canViewEvent = (eventSectorId?: number) => {
    if (!user) return false;

    // ADMIN pode ver todos os eventos
    if (hasPermission("view_all_events")) return true;

    // MANAGER pode ver eventos de setores subordinados
    if (hasPermission("view_subordinate_events") && eventSectorId) {
      return canAccessSector(eventSectorId);
    }

    // COLLABORATOR pode ver eventos do próprio setor
    if (hasPermission("view_own_sector_events") && eventSectorId) {
      return canAccessSector(eventSectorId);
    }

    return false;
  };

  // Permissões específicas do sistema
  const canManageSystem = () => hasPermission("manage_system");
  const canResetPasswords = () => hasPermission("reset_passwords");
  const canViewLogs = () => hasPermission("view_logs");

  // Utilitários para UI
  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      ADMIN: "Administrador",
      MANAGER: "Gerente",
      COLLABORATOR: "Colaborador",
      IT_ADMIN: "Admin TI",
    };
    return roleNames[role];
  };

  const getRoleColor = (role: UserRole): string => {
    const roleColors: Record<UserRole, string> = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-blue-100 text-blue-800",
      COLLABORATOR: "bg-green-100 text-green-800",
      IT_ADMIN: "bg-purple-100 text-purple-800",
    };
    return roleColors[role];
  };

  const getSectorAccessLevel = () => {
    if (!user) return "none";

    switch (user.role) {
      case "ADMIN":
        return "all";
      case "MANAGER":
        return "subordinate";
      case "COLLABORATOR":
        return "own";
      case "IT_ADMIN":
        return "all";
      default:
        return "none";
    }
  };

  // Utilitários para filtrar dados
  const getAccessibleSectorIds = () => {
    return user ? getAccessibleSectors(user) : [];
  };

  const canManageUser = (targetUser: { sectorId: number; id: number }) => {
    if (!user) return false;

    // ADMIN e IT_ADMIN podem gerenciar qualquer usuário
    if (user.role === "ADMIN" || user.role === "IT_ADMIN") return true;

    // MANAGER pode gerenciar usuários dos setores acessíveis
    if (user.role === "MANAGER") {
      const accessibleSectors = getAccessibleSectorIds();
      return accessibleSectors.includes(targetUser.sectorId);
    }

    // COLLABORATOR pode gerenciar apenas próprio perfil
    if (user.role === "COLLABORATOR") {
      return targetUser.id === user.id;
    }

    return false;
  };

  const canManageSector = (sectorId: number) => {
    if (!user) return false;

    // ADMIN pode gerenciar qualquer setor
    if (user.role === "ADMIN") return true;

    // MANAGER pode gerenciar setores acessíveis
    if (user.role === "MANAGER") {
      const accessibleSectors = getAccessibleSectorIds();
      return accessibleSectors.includes(sectorId);
    }

    return false;
  };

  return {
    // User permissions
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canViewAllUsers,

    // Sector permissions
    canCreateSector,
    canEditSector,
    canDeleteSector,
    canViewAllSectors,

    // Calendar and notifications permissions
    canViewCalendar,
    canViewNotifications,
    canFilterBySector,

    // Event permissions
    canCreateEvent,
    canEditEvent,
    canDeleteEvent,
    canViewEvent,

    // System permissions
    canManageSystem,
    canResetPasswords,
    canViewLogs,

    // Utilities
    getRoleDisplayName,
    getRoleColor,
    getSectorAccessLevel,
    getAccessibleSectorIds,
    canManageUser,
    canManageSector,

    // Direct access to context functions
    hasPermission,
    canAccessSector,
  };
};
