import { useState } from "react";
import { UserData, UserRole } from "../../types/interfaces";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaCalendarAlt,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaUserShield,
  FaUserTie,
  FaClock,
  FaIdBadge,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

interface UserInfoModalProps {
  user: UserData;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export const UserInfoModal = ({
  user,
  onClose,
  onEdit,
  onToggleStatus,
}: UserInfoModalProps) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "info" | "activity" | "permissions"
  >("info");

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return { icon: FaUserShield, color: "text-red-600", bg: "bg-red-100" };
      case "MANAGER":
        return { icon: FaUserTie, color: "text-blue-600", bg: "bg-blue-100" };
      case "COLLABORATOR":
        return { icon: FaUser, color: "text-green-600", bg: "bg-green-100" };
      case "IT_ADMIN":
        return {
          icon: MdAdminPanelSettings,
          color: "text-purple-600",
          bg: "bg-purple-100",
        };
      default:
        return { icon: FaUser, color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-blue-100 text-blue-800",
      COLLABORATOR: "bg-green-100 text-green-800",
      IT_ADMIN: "bg-purple-100 text-purple-800",
    };

    const labels = {
      ADMIN: "Administrador",
      MANAGER: "Gerente",
      COLLABORATOR: "Colaborador",
      IT_ADMIN: "TI Admin",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${styles[role]}`}
      >
        {labels[role]}
      </span>
    );
  };

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      ADMIN:
        "Acesso total ao sistema, pode gerenciar todos os usuários e configurações",
      MANAGER: "Pode gerenciar seu setor e usuários subordinados",
      COLLABORATOR: "Acesso básico às funcionalidades do seu setor",
      IT_ADMIN: "Administrador técnico com acesso a configurações de sistema",
    };
    return descriptions[role];
  };

  const formatDateOnly = (dateString: string | Date) => {
  if (!dateString)
    return ''
  const date = new Date(dateString)

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  })
}

  const { icon: RoleIcon, color, bg } = getRoleIcon(user.role);

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
      >
        <div className="bg-gradient-to-r bg-[linear-gradient(90deg,_#4b6cb7_0%,_#182848_100%)] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center`}
              >
                <RoleIcon className={`w-8 h-8 ${color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getRoleBadge(user.role)}
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-white hover:bg-[rgba(255,255,255,0.1)] hover:bg-opacity-20 rounded-lg transition-colors"
                title="Editar usuário"
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleStatus}
                className="p-2 text-white hover:bg-[rgba(255,255,255,0.1)] hover:bg-opacity-20 rounded-lg transition-colors"
                title={user.isActive ? "Desativar usuário" : "Ativar usuário"}
              >
                {user.isActive ? (
                  <FaToggleOff className="w-5 h-5" />
                ) : (
                  <FaToggleOn className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-[rgba(255,255,255,0.1)] hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          } border-b`}
        >
          <div className="flex">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : `border-transparent ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`
              }`}
            >
              <FaUser className="w-4 h-4 inline mr-2" />
              Informações
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "border-blue-500 text-blue-600"
                  : `border-transparent ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`
              }`}
            >
              <FaClock className="w-4 h-4 inline mr-2" />
              Atividade
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "permissions"
                  ? "border-blue-500 text-blue-600"
                  : `border-transparent ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`
              }`}
            >
              <FaUserShield className="w-4 h-4 inline mr-2" />
              Permissões
            </button>
          </div>
        </div>

        <div
          className={`p-6 max-h-[60vh] overflow-y-auto ${
            theme === "dark"
              ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
              : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
          }`}
        >
          {activeTab === "info" && (
            <div className="space-y-6">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-4 flex items-center gap-2`}
                >
                  <FaIdBadge className="w-5 h-5 text-blue-600" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Nome Completo
                      </span>
                    </div>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {user.name}
                    </p>
                  </div>

                  <div
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaEnvelope
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Email
                      </span>
                    </div>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {user.email}
                    </p>
                  </div>

                  <div
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaBuilding
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Setor
                      </span>
                    </div>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {user.sector?.name}
                    </p>
                    {user.sector?.description && (
                      <p
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        } text-sm mt-1`}
                      >
                        {user.sector.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Status
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <FaToggleOn className="w-5 h-5 text-green-500" />
                      ) : (
                        <FaToggleOff className="w-5 h-5 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          user.isActive ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {user.isActive ? "Usuário Ativo" : "Usuário Inativo"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-4 flex items-center gap-2`}
                >
                  <FaCalendarAlt className="w-5 h-5 text-green-600" />
                  Datas Importantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Data de Criação
                      </span>
                    </div>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {formatDateOnly(user.createdAt)}
                    </p>
                  </div>

                  <div
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Última Atualização
                      </span>
                    </div>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {formatDateOnly(user.updatedAt)}
                    </p>
                  </div>

                  {user.lastLogin && (
                    <div
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      } p-4 rounded-lg`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock
                          className={`w-4 h-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Último Login
                        </span>
                      </div>
                      <p
                        className={`${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        {formatDateOnly(user.lastLogin)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4 flex items-center gap-2`}
              >
                <FaClock className="w-5 h-5 text-blue-600" />
                Histórico de Atividades
              </h3>

              <div className="space-y-4">
                <div
                  className={`flex items-start gap-4 p-4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } rounded-lg`}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Último login realizado
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      } text-sm`}
                    >
                      {user.lastLogin
                        ? formatDateOnly(user.lastLogin)
                        : "Nunca fez login"}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-4 p-4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } rounded-lg`}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Perfil atualizado
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      } text-sm`}
                    >
                      {formatDateOnly(user.updatedAt)}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-4 p-4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } rounded-lg`}
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Usuário criado
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      } text-sm`}
                    >
                      {formatDateOnly(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-6">
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4 flex items-center gap-2`}
              >
                <FaUserShield className="w-5 h-5 text-purple-600" />
                Permissões e Acesso
              </h3>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } p-6 rounded-xl`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}
                  >
                    <RoleIcon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div>
                    <h4
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.role === "ADMIN" && "Administrador"}
                      {user.role === "MANAGER" && "Gerente"}
                      {user.role === "COLLABORATOR" && "Colaborador"}
                      {user.role === "IT_ADMIN" && "Administrador de T.I."}
                    </h4>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-3`}
                  >
                    Permissões:
                  </h5>
                  {user.role === "ADMIN" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Gerenciar todos os usuários
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Configurar sistema
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Acesso a todos os setores
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Relatórios gerenciais
                        </span>
                      </div>
                    </div>
                  )}

                  {user.role === "MANAGER" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Gerenciar usuários do setor
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Aprovar atividades
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Relatórios do setor
                        </span>
                      </div>
                    </div>
                  )}

                  {user.role === "COLLABORATOR" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Criar atividades
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Visualizar calendário
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Acesso ao setor
                        </span>
                      </div>
                    </div>
                  )}

                  {user.role === "IT_ADMIN" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Configurações técnicas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Backup e recuperação
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Logs do sistema
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`${
            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
          } px-6 py-4 flex items-center justify-between`}
        >
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            ID do Usuário: #{user.id}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleStatus}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                user.isActive
                  ? `${
                      theme === "dark"
                        ? "bg-orange-800 text-orange-200 hover:bg-orange-700"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`
                  : `${
                      theme === "dark"
                        ? "bg-green-800 text-green-200 hover:bg-green-700"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`
              }`}
            >
              {user.isActive ? "Desativar" : "Ativar"} Usuário
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Editar Usuário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
