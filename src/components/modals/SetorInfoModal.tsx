import { useState } from "react";
import { SectorModalData, UserRole } from "../../types/interfaces";
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

export interface SetorInfoModalProps {
  setor: SectorModalData;
  onClose: () => void;
  onEdit: () => void;
  onAddUser: () => void;
}

export const SetorInfoModal: React.FC<SetorInfoModalProps> = ({
  setor,
  onClose,
  onEdit,
  onAddUser,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "users" | "subsectors">(
    "info"
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Ativo" : "Inativo"}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
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
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Descrição
                  </h3>
                  <p className="text-gray-700">{setor.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FaUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-600 font-semibold text-lg">
                        {setor._count.users}
                      </p>
                      <p className="text-blue-700 text-sm">Usuários</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <MdGroups2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-green-600 font-semibold text-lg">
                        {setor._count.subSectors}
                      </p>
                      <p className="text-green-700 text-sm">Subsetores</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <FaTasks className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-600 font-semibold text-lg">
                        {setor._count.events}
                      </p>
                      <p className="text-purple-700 text-sm">Eventos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Detalhes</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Criado em:</span>
                    <span className="font-medium">
                      {formatDate(setor.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Atualizado em:</span>
                    <span className="font-medium">
                      {formatDate(setor.updatedAt)}
                    </span>
                  </div>
                  {setor.managerId && (
                    <div className="flex items-center gap-3">
                      <FaBuilding className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Setor pai:</span>
                      <span className="font-medium">{setor.manager?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Usuários do setor
                </h3>
                <button
                  onClick={onAddUser}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454] text-white px-4 py-2 rounded-lg hover:from-[#34448C] hover:to-[#049454] transition-all transform hover:scale-105"
                >
                  <FaUserPlus className="w-4 h-4" />
                  Adicionar Usuário
                </button>
              </div>

              {setor.users.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaUsers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Adicione o primeiro usuário a este setor
                  </p>
                  <button
                    onClick={onAddUser}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Adicionar Usuário
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {setor.users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {user.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.isActive)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                            <FaEdit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors">
                            <FaTrash className="w-4 h-4 text-red-600" />
                          </button>
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Subsetores
                </h3>
              </div>

              {setor.subSectors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <MdGroups2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum subsetor encontrado
                  </h3>
                  <p className="text-gray-600">
                    Este setor não possui subsetores
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {setor.subSectors.map((subsetor) => (
                    <div
                      key={subsetor.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {subsetor.name}
                          </h4>
                          {subsetor.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {subsetor.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <FaUsers className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {subsetor._count.users} usuários
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                            <FaEdit className="w-4 h-4 text-blue-600" />
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

        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              ID: {setor.id} • Criado em {formatDate(setor.createdAt)}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
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
    </div>
  );
};
