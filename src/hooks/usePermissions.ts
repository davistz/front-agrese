import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/interfaces";
import { getAccessibleSectors } from "../contexts/AuthContext";

export const usePermissions = () => {
  const { user, hasPermission, canAccessSector } = useAuth();

  const canCreateUser = () => hasPermission("create_user");
  const canEditUser = (userId?: number) => {
    if (!user) return false;

    if (hasPermission("edit_user")) {
      if (user.role === "ADMIN" || user.role === "IT_ADMIN") return true;

      if (user.role === "MANAGER") return true;

      if (user.role === "COLLABORATOR" && userId === user.id) return true;
    }

    return false;
  };

  const canDeleteUser = () => hasPermission("delete_user");
  const canViewAllUsers = () => {
    if (hasPermission("view_all_users")) return true;
    if (hasPermission("view_own_sector_users")) return true;
    return false;
  };

  const canViewCalendar = () => {
    return true;
  };

  const canViewNotifications = () => {
    // NOTIFICAÇÕES SÃO PÚBLICAS - TODOS OS USUÁRIOS PODEM VER
    return true;
  };

  const canViewReports = () => {
    if (!user) return false;

    if (user.role === "ADMIN" || user.role === "IT_ADMIN") return true;

    if (user.role === "COLLABORATOR") return false;
    return true;
  };

  const canFilterBySector = () => {
    if (user?.role === "COLLABORATOR") return false;
    return true;
  };

  const canCreateSector = () => {
    if (user?.role === "IT_ADMIN") return true;
    return hasPermission("create_sector");
  };
  const canEditSector = (sectorId?: number) => {
    if (!user) return false;

    if (hasPermission("edit_sector")) return true;
    if (user.role === "IT_ADMIN") return true;

    if (hasPermission("edit_own_sector") && sectorId === user.sectorId)
      return true;

    return false;
  };
  const canDeleteSector = () => {
    if (user?.role === "IT_ADMIN") return true;
    return hasPermission("delete_sector");
  };
  const canViewAllSectors = () => {
    if (hasPermission("view_all_sectors")) return true;
    if (user?.role === "IT_ADMIN") return true;
    if (hasPermission("view_own_sector")) return true;
    return false;
  };

  const canCreateEvent = () => hasPermission("create_event");

  const canCreateDirexMeeting = () => {
    if (!user) return false;

    if (user.role === "ADMIN") return true;

    if (
      user.sectorName === "Diretoria Executiva" ||
      user.sectorName === "Presidente"
    ) {
      return true;
    }

    return hasPermission("create_direx_meeting");
  };

  const canEditEvent = (eventSectorId?: number, eventCreatorId?: number) => {
    if (!user) return false;

    if (hasPermission("edit_all_events")) return true;

    if (hasPermission("edit_subordinate_events") && eventSectorId) {
      return canAccessSector(eventSectorId);
    }

    if (hasPermission("edit_own_events") && eventCreatorId === user.id) {
      return true;
    }

    return false;
  };

  const canDeleteEvent = (eventSectorId?: number, eventCreatorId?: number) => {
    if (!user) return false;

    if (hasPermission("delete_all_events")) return true;

    return canEditEvent(eventSectorId, eventCreatorId);
  };

  const canViewEvent = (eventSectorId?: number) => {
    if (!user) return false;

    if (hasPermission("view_all_events")) return true;

    if (hasPermission("view_subordinate_events") && eventSectorId) {
      return canAccessSector(eventSectorId);
    }

    if (hasPermission("view_own_sector_events") && eventSectorId) {
      return canAccessSector(eventSectorId);
    }

    return false;
  };

  const canManageSystem = () => hasPermission("manage_system");
  const canResetPasswords = () => hasPermission("reset_passwords");
  const canViewLogs = () => hasPermission("view_logs");

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

  const getAccessibleSectorIds = () => {
    return user ? getAccessibleSectors(user) : [];
  };

  const canManageUser = (targetUser: { sectorId: number; id: number }) => {
    if (!user) return false;

    if (user.role === "ADMIN" || user.role === "IT_ADMIN") return true;

    if (user.role === "MANAGER") {
      const accessibleSectors = getAccessibleSectorIds();
      return accessibleSectors.includes(targetUser.sectorId);
    }

    if (user.role === "COLLABORATOR") {
      return targetUser.id === user.id;
    }

    return false;
  };

  const canManageSector = (sectorId: number) => {
    if (!user) return false;

    if (user.role === "ADMIN") return true;

    if (user.role === "MANAGER") {
      const accessibleSectors = getAccessibleSectorIds();
      return accessibleSectors.includes(sectorId);
    }

    return false;
  };

  return {
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canViewAllUsers,

    canCreateSector,
    canEditSector,
    canDeleteSector,
    canViewAllSectors,

    canViewCalendar,
    canViewNotifications,
    canViewReports,
    canFilterBySector,

    canCreateEvent,
    canCreateDirexMeeting,
    canEditEvent,
    canDeleteEvent,
    canViewEvent,

    canManageSystem,
    canResetPasswords,
    canViewLogs,

    getRoleDisplayName,
    getRoleColor,
    getSectorAccessLevel,
    getAccessibleSectorIds,
    canManageUser,
    canManageSector,

    hasPermission,
    canAccessSector,
  };
};
