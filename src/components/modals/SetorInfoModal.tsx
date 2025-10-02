import { useState } from "react";
import { SectorModalData, UserRole } from "../../types/interfaces";
import { useTheme } from "../../contexts/ThemeContext";
import { IoMdClose } from "react-icons/io";
import {
  FaEdit,
  FaUserPlus,
  FaUsers,
  FaTrash,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDollarSign,
  FaBuilding,
  FaCalendarAlt,
  FaTasks,
} from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { formatDate } from "../../utils/formatDate";

export interface SetorInfoModalProps {
  setor: SectorModalData;
  onClose: () => void;
  onEdit: () => void;
  onDeleteUser: (userId: string) => void;
}

export const SetorInfoModal: React.FC<SetorInfoModalProps> = ({
  setor,
  onClose,
  onEdit,
  onDeleteUser,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"info" | "users" | "subsectors">(
    "info"
  );
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.toString());
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      ADMIN:
        theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800",
      MANAGER:
        theme === "dark"
          ? "bg-blue-900 text-blue-300"
          : "bg-blue-100 text-blue-800",
      COLLABORATOR:
        theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800",
      IT_ADMIN:
        theme === "dark"
          ? "bg-purple-900 text-purple-300"
          : "bg-purple-100 text-purple-800",
    };

    const labels = {
      ADMIN: "Administrador",
      MANAGER: "Gerente",
      COLLABORATOR: "Colaborador",
      IT_ADMIN: "TI Admin",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}
      >
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isActive
            ? theme === "dark"
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-800"
            : theme === "dark"
            ? "bg-red-900 text-red-300"
            : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Ativo" : "Inativo"}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } ${
          theme === "dark"
            ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
            : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
        }`}
      >
        <div className="bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454] p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MdGroups2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{setor.name}</h2>
                {setor.manager && (
                  <p className="text-blue-100">
                    Subordinado a: {setor.manager.name}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          className={`border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : theme === "dark"
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaBuilding className="w-4 h-4" />
                Informações
              </div>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : theme === "dark"
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaUsers className="w-4 h-4" />
                Usuários ({setor._count.users})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("subsectors")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "subsectors"
                  ? "border-blue-500 text-blue-600"
                  : theme === "dark"
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <MdGroups2 className="w-4 h-4" />
                Subsetores ({setor._count.subSectors})
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <div className="space-y-6">
              {setor.description && (
                <div
                  className={`rounded-xl p-4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Descrição
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {setor.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`rounded-xl p-4 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-900 to-blue-800"
                      : "bg-gradient-to-br from-blue-50 to-blue-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FaUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        {setor._count.users}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-blue-400" : "text-blue-700"
                        }`}
                      >
                        Usuários
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-xl p-4 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-green-900 to-green-800"
                      : "bg-gradient-to-br from-green-50 to-green-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <MdGroups2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-green-300" : "text-green-600"
                        }`}
                      >
                        {setor._count.subSectors}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-green-400" : "text-green-700"
                        }`}
                      >
                        Subsetores
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-xl p-4 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-purple-900 to-purple-800"
                      : "bg-gradient-to-br from-purple-50 to-purple-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <FaTasks className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark"
                            ? "text-purple-300"
                            : "text-purple-600"
                        }`}
                      >
                        {setor._count.events}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark"
                            ? "text-purple-400"
                            : "text-purple-700"
                        }`}
                      >
                        Eventos
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-xl p-4 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Detalhes
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Criado em:
                    </span>
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatDate(setor.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Atualizado em:
                    </span>
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatDate(setor.updatedAt)}
                    </span>
                  </div>
                  {setor.managerId && (
                    <div className="flex items-center gap-3">
                      <FaBuilding
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Setor pai:
                      </span>
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {setor.manager?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Usuários do setor
                </h3>
              </div>

              {setor.users.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <FaUsers
                      className={`w-8 h-8 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Nenhum usuário encontrado
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Este setor não possui usuários cadastrados
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {setor.users.map((user) => (
                    <div
                      key={user.id}
                      className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-gradient-to-br from-blue-900 to-purple-900"
                                : "bg-gradient-to-br from-blue-100 to-purple-100"
                            }`}
                          >
                            <span
                              className={`font-semibold ${
                                theme === "dark"
                                  ? "text-blue-300"
                                  : "text-blue-600"
                              }`}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4
                              className={`font-semibold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {user.name}
                            </h4>
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.isActive)}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "subsectors" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Subsetores
                </h3>
              </div>

              {setor.subSectors.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <MdGroups2
                      className={`w-8 h-8 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Nenhum subsetor encontrado
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Este setor não possui subsetores
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {setor.subSectors.map((subsetor) => (
                    <div
                      key={subsetor.id}
                      className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {subsetor.name}
                          </h4>
                          {subsetor.description && (
                            <p
                              className={`text-sm mt-1 ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {subsetor.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <FaUsers
                                className={`w-3 h-3 ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-400"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {subsetor._count.users} usuários
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              theme === "dark"
                                ? "bg-blue-900 hover:bg-blue-800"
                                : "bg-blue-100 hover:bg-blue-200"
                            }`}
                          >
                            <FaEdit
                              className={`w-4 h-4 ${
                                theme === "dark"
                                  ? "text-blue-300"
                                  : "text-blue-600"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`border-t p-6 rounded-b-2xl ${
            theme === "dark"
              ? "border-gray-600 bg-gray-700"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ID: {setor.id} • Criado em {formatDate(setor.createdAt)}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 bg-gray-600 hover:bg-gray-500"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Fechar
              </button>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454] text-white px-4 py-2 rounded-lg hover:from-[#34448C] hover:to-[#049454] transition-all"
              >
                <FaEdit className="w-4 h-4" />
                Editar Setor
              </button>
            </div>
          </div>
        </div>
      </div>

      {userToDelete && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-60">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-red-900" : "bg-red-100"
                }`}
              >
                <FaTrash
                  className={`w-8 h-8 ${
                    theme === "dark" ? "text-red-300" : "text-red-600"
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Excluir usuário
              </h3>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tem certeza de que deseja excluir este usuário? Esta ação não
                pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDeleteUser}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "text-gray-300 bg-gray-600 hover:bg-gray-500"
                      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
