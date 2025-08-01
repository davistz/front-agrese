import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

export const PermissionsDemo: React.FC = () => {
  const { user, canAccessSector } = useAuth();
  const {
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canViewAllUsers,
    canCreateSector,
    canEditSector,
    canDeleteSector,
    canViewAllSectors,
    canCreateEvent,
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
  } = usePermissions();

  if (!user) return null;

  const permissions = [
    { name: "Criar Usuário", can: canCreateUser() },
    { name: "Editar Usuário", can: canEditUser() },
    { name: "Deletar Usuário", can: canDeleteUser() },
    { name: "Ver Todos Usuários", can: canViewAllUsers() },
    { name: "Criar Setor", can: canCreateSector() },
    { name: "Editar Setor", can: canEditSector() },
    { name: "Deletar Setor", can: canDeleteSector() },
    { name: "Ver Todos Setores", can: canViewAllSectors() },
    { name: "Criar Evento", can: canCreateEvent() },
    { name: "Editar Eventos", can: canEditEvent() },
    { name: "Deletar Eventos", can: canDeleteEvent() },
    { name: "Ver Eventos", can: canViewEvent() },
    { name: "Gerenciar Sistema", can: canManageSystem() },
    { name: "Resetar Senhas", can: canResetPasswords() },
    { name: "Ver Logs", can: canViewLogs() },
  ];

  const accessibleSectors = getAccessibleSectorIds();
  const sectorNames: Record<number, string> = {
    1: "Presidência",
    2: "DAF - Diretoria Administrativa Financeira",
    3: "Diretoria Técnica",
    4: "Setor Operacional",
    5: "Tecnologia da Informação",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4">
      <h2 className="text-2xl font-bold mb-4">Demonstração de Permissões</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Informações do Usuário</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Nome:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong>{" "}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                user.role
              )}`}
            >
              {getRoleDisplayName(user.role)}
            </span>
          </div>
          <div>
            <strong>Setor:</strong> {user.sectorName}
          </div>
          <div>
            <strong>Nível de Acesso:</strong> {getSectorAccessLevel()}
          </div>
          <div>
            <strong>Status:</strong> {user.isActive ? "Ativo" : "Inativo"}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Permissões Atuais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissions.map((permission, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                permission.can
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <span className="text-sm font-medium">{permission.name}</span>
              <span className="text-xs">
                {permission.can ? "✅ Permitido" : "❌ Negado"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Setores Acessíveis</h4>
        <div className="text-sm text-blue-700">
          <p className="mb-2">
            <strong>Setores que você pode acessar:</strong>
          </p>
          {accessibleSectors.length > 0 ? (
            <ul className="space-y-1">
              {accessibleSectors.map((sectorId) => (
                <li key={sectorId} className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>{sectorNames[sectorId] || `Setor ${sectorId}`}</span>
                  {sectorId === user.sectorId && (
                    <span className="ml-2 text-xs bg-blue-200 px-2 py-1 rounded">
                      (Seu setor)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum setor acessível</p>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">
          Capacidades de Gerenciamento
        </h4>
        <div className="text-sm text-green-700 space-y-2">
          <div>
            <strong>Pode gerenciar usuários:</strong>{" "}
            {canViewAllUsers() ? "✅ Sim" : "❌ Não"}
            {user.role === "MANAGER" && (
              <span className="block text-xs mt-1">
                (Limitado aos setores acessíveis)
              </span>
            )}
          </div>
          <div>
            <strong>Pode gerenciar setores:</strong>{" "}
            {canViewAllSectors() ? "✅ Sim" : "❌ Não"}
            {user.role === "MANAGER" && (
              <span className="block text-xs mt-1">
                (Limitado aos setores acessíveis)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">
          Teste de Acesso Individual
        </h4>
        <div className="text-sm text-yellow-700">
          <p>Setor 1 (Presidência): {canAccessSector(1) ? "✅" : "❌"}</p>
          <p>Setor 2 (DAF): {canAccessSector(2) ? "✅" : "❌"}</p>
          <p>Setor 3 (Diretoria Técnica): {canAccessSector(3) ? "✅" : "❌"}</p>
          <p>Setor 4 (Operacional): {canAccessSector(4) ? "✅" : "❌"}</p>
          <p>Setor 5 (TI): {canAccessSector(5) ? "✅" : "❌"}</p>
        </div>
      </div>
    </div>
  );
};
