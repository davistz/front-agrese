import { useState, useEffect } from "react";
import {
  UserData,
  UserRole,
  SectorData,
  UserFormData,
} from "../types/interfaces";
import { useTheme } from "../contexts/ThemeContext";
import { Sidebar } from "../components/elements/Sidebar";
import { UserForm } from "../components/elements/forms/UserForm";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaEye,
  FaSearch,
  FaFilter,
  FaUserShield,
  FaUserTie,
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
  FaChevronDown,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { UserInfoModal } from "../components/modals/UserInfoModal";

export const UserPage = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState<
    "calendario" | "setores" | "usuarios"
  >("usuarios");
  const [users, setUsers] = useState<UserData[]>([]);
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "ALL">("ALL");
  const [filterSector, setFilterSector] = useState<number | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<
    "ACTIVE" | "INACTIVE" | "ALL"
  >("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const mockUsers: UserData[] = [
      {
        id: 1,
        email: "admin@empresa.com",
        name: "Administrador Geral",
        role: "ADMIN",
        sectorId: 1,
        sector: {
          id: 1,
          name: "Presidência",
          description: "Setor principal",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-15T10:30:00"),
        createdAt: new Date("2023-01-01T08:00:00"),
        updatedAt: new Date("2024-01-15T10:30:00"),
      },
      {
        id: 2,
        email: "carlos.oliveira@empresa.com",
        name: "Carlos Oliveira",
        role: "MANAGER",
        sectorId: 2,
        sector: {
          id: 2,
          name: "T.I",
          description: "Tecnologia da Informação",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T16:45:00"),
        createdAt: new Date("2023-02-01T09:00:00"),
        updatedAt: new Date("2024-01-14T16:45:00"),
      },
      {
        id: 3,
        email: "ana.costa@empresa.com",
        name: "Ana Costa",
        role: "COLLABORATOR",
        sectorId: 2,
        sector: {
          id: 2,
          name: "T.I",
          description: "Tecnologia da Informação",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T17:20:00"),
        createdAt: new Date("2023-04-15T10:30:00"),
        updatedAt: new Date("2024-01-14T17:20:00"),
      },
      {
        id: 4,
        email: "maria.silva@empresa.com",
        name: "Maria Silva",
        role: "MANAGER",
        sectorId: 3,
        sector: {
          id: 3,
          name: "Recursos Humanos",
          description: "Gestão de pessoas",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T14:15:00"),
        createdAt: new Date("2023-01-15T11:00:00"),
        updatedAt: new Date("2024-01-13T14:15:00"),
      },
      {
        id: 5,
        email: "pedro.santos@empresa.com",
        name: "Pedro Santos",
        role: "IT_ADMIN",
        sectorId: 2,
        sector: {
          id: 2,
          name: "T.I",
          description: "Tecnologia da Informação",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: false,
        lastLogin: new Date("2023-12-20T09:30:00"),
        createdAt: new Date("2023-03-10T08:15:00"),
        updatedAt: new Date("2023-12-21T10:00:00"),
      },
      {
        id: 6,
        email: "patricia.rocha@empresa.com",
        name: "Patricia Rocha",
        role: "COLLABORATOR",
        sectorId: 4,
        sector: {
          id: 4,
          name: "Setor Contábil",
          description: "Controle financeiro",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T11:00:00"),
        createdAt: new Date("2023-01-20T09:45:00"),
        updatedAt: new Date("2024-01-12T11:00:00"),
      },
    ];

    const mockSectors: SectorData[] = [
      {
        id: 1,
        name: "Presidência",
        description: "Setor principal",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "T.I",
        description: "Tecnologia da Informação",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Recursos Humanos",
        description: "Gestão de pessoas",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Setor Contábil",
        description: "Controle financeiro",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setUsers(mockUsers);
    setSectors(mockSectors);
  }, []);

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
          bg: "bg-purple-300",
        };
      default:
        return { icon: FaUser, color: "text-gray-600", bg: "bg-gray-100" };
    }
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sector?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    const matchesSector =
      filterSector === "ALL" || user.sectorId === filterSector;
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && user.isActive) ||
      (filterStatus === "INACTIVE" && !user.isActive);

    return matchesSearch && matchesRole && matchesSector && matchesStatus;
  });

  const handleCreateUser = (data: UserFormData) => {
    const newUser: UserData = {
      id: Date.now(),
      email: data.email,
      name: data.name,
      role: data.role,
      sectorId: data.sectorId,
      sector: sectors.find((s) => s.id === data.sectorId),
      isActive: data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUsers([...users, newUser]);
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleEditUser = (data: UserFormData) => {
    if (editingUser) {
      const updatedUsers = users.map((user) => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            email: data.email,
            name: data.name,
            role: data.role,
            sectorId: data.sectorId,
            sector: sectors.find((s) => s.id === data.sectorId),
            isActive: data.isActive,
            updatedAt: new Date(),
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setShowUserForm(false);
      setEditingUser(null);
    }
  };

  const handleToggleUserStatus = (userId: number) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          isActive: !user.isActive,
          updatedAt: new Date(),
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;
  const managerUsers = users.filter((u) => u.role === "MANAGER").length;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-50"
      } scrollbar scrollbar-track-transparent ${
        theme === "dark"
          ? "scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          : "scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
      } scrollbar-thumb-rounded-full scrollbar-w-2`}
    >
      <div className="flex">
        <Sidebar
          isOpen={isOpen}
          activeView={activeView}
          onToggle={toggleSidebar}
          onViewChange={setActiveView}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="mx-auto p-6 pt-6">
            <div className="ml-2 mb-8">
              <h1
                className={`text-4xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Gestão de Usuários
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Gerencie usuários, permissões e acessos do sistema
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-blue-900 to-blue-900"
                    : "bg-gradient-to-br from-blue-50 to-blue-100"
                } rounded-xl p-6`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-blue-600 to-blue-900"
                        : "bg-gradient-to-br from-blue-400 to-blue-500"
                    } bg-blue-500 rounded-lg flex items-center justify-center`}
                  >
                    <FaUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p
                      className={`${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      } font-semibold text-2xl`}
                    >
                      {totalUsers}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-blue-200" : "text-blue-700"
                      } text-sm`}
                    >
                      Total de Usuários
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-green-900 to-green-900"
                    : "bg-gradient-to-br from-green-50 to-green-100"
                } rounded-xl p-6`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-green-700 to-green-800"
                        : "bg-gradient-to-br from-green-400 to-green-500"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <FaToggleOn className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p
                      className={`${
                        theme === "dark" ? "text-green-300" : "text-green-600"
                      } font-semibold text-2xl`}
                    >
                      {activeUsers}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-green-200" : "text-green-700"
                      } text-sm`}
                    >
                      Usuários Ativos
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-red-900 to-red-900"
                    : "bg-gradient-to-br from-red-50 to-red-100"
                } rounded-xl p-6`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-red-700 to-red-800"
                        : "bg-gradient-to-br from-red-400 to-red-400"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <FaUserShield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p
                      className={`${
                        theme === "dark" ? "text-red-300" : "text-red-600"
                      } font-semibold text-2xl`}
                    >
                      {adminUsers}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-red-200" : "text-red-700"
                      } text-sm`}
                    >
                      Administradores
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-purple-900 to-purple-900"
                    : "bg-gradient-to-br from-purple-50 to-purple-100"
                } rounded-xl p-6`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-purple-700 to-purple-800"
                        : "bg-gradient-to-br from-purple-400 to-purple-500"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <FaUserTie className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p
                      className={`${
                        theme === "dark" ? "text-purple-300" : "text-purple-600"
                      } font-semibold text-2xl`}
                    >
                      {managerUsers}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-purple-200" : "text-purple-700"
                      } text-sm`}
                    >
                      Gerentes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-xl shadow-md border p-6 mb-6`}
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <FaSearch
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Buscar por nome, email ou setor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters
                        ? theme === "dark"
                          ? "bg-blue-900 border-blue-700 text-blue-300"
                          : "bg-blue-50 border-blue-300 text-blue-700"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaFilter className="w-4 h-4" />
                    Filtros
                    <FaChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setShowUserForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454] text-white px-6 py-2 rounded-lg  transition-all transform hover:scale-105 shadow-lg"
                  >
                    <FaPlus className="w-4 h-4" />
                    Novo Usuário
                  </button>
                </div>
              </div>

              {showFilters && (
                <div
                  className={`mt-4 pt-4 border-t ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Tipo de Usuário
                      </label>
                      <select
                        value={filterRole}
                        onChange={(e) =>
                          setFilterRole(e.target.value as UserRole | "ALL")
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="ALL">Todos os tipos</option>
                        <option value="ADMIN">Administradores</option>
                        <option value="MANAGER">Gerentes</option>
                        <option value="COLLABORATOR">Colaboradores</option>
                        <option value="IT_ADMIN">TI Admin</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Setor
                      </label>
                      <select
                        value={filterSector}
                        onChange={(e) =>
                          setFilterSector(
                            e.target.value === "ALL"
                              ? "ALL"
                              : Number(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="ALL">Todos os setores</option>
                        {sectors.map((sector) => (
                          <option key={sector.id} value={sector.id}>
                            {sector.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) =>
                          setFilterStatus(
                            e.target.value as "ACTIVE" | "INACTIVE" | "ALL"
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="ALL">Todos os status</option>
                        <option value="ACTIVE">Ativos</option>
                        <option value="INACTIVE">Inativos</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`rounded-xl shadow-md border overflow-hidden ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`p-6 border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Usuários ({filteredUsers.length})
                </h2>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div
                    className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-gray-700 to-gray-800"
                        : "bg-gradient-to-br from-gray-100 to-gray-200"
                    }`}
                  >
                    <FaUsers
                      className={`w-12 h-12 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-semibold mb-3 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Nenhum usuário encontrado
                  </h3>
                  <p
                    className={`mb-6 max-w-md mx-auto ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {searchTerm ||
                    filterRole !== "ALL" ||
                    filterSector !== "ALL" ||
                    filterStatus !== "ALL"
                      ? "Ajuste os filtros para encontrar usuários"
                      : "Crie o primeiro usuário do sistema"}
                  </p>
                  {!searchTerm &&
                    filterRole === "ALL" &&
                    filterSector === "ALL" &&
                    filterStatus === "ALL" && (
                      <button
                        onClick={() => setShowUserForm(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <FaPlus className="w-4 h-4" />
                        Criar Primeiro Usuário
                      </button>
                    )}
                </div>
              ) : (
                <div
                  className={`max-h-[calc(100vh-400px)] overflow-y-auto divide-y ${
                    theme === "dark" ? "divide-gray-700" : "divide-gray-100"
                  } scrollbar scrollbar-track-transparent ${
                    theme === "dark"
                      ? "scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                      : "scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
                  } scrollbar-thumb-rounded-full scrollbar-w-2`}
                >
                  {filteredUsers.map((user) => {
                    const {
                      icon: RoleIcon,
                      color,
                      bg,
                    } = getRoleIcon(user.role);

                    return (
                      <div
                        key={user.id}
                        className={`p-6 transition-colors cursor-pointer group ${
                          theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            >
                              <RoleIcon className={`w-6 h-6 ${color}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3
                                  className={`text-lg font-semibold ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {user.name}
                                </h3>
                                {getRoleBadge(user.role)}
                                {getStatusBadge(user.isActive)}
                              </div>

                              <div
                                className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                <span className="flex items-center gap-1">
                                  <FaEnvelope className="w-3 h-3" />
                                  {user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaBuilding className="w-3 h-3" />
                                  {user.sector?.name}
                                </span>
                                {user.lastLogin && (
                                  <span className="flex items-center gap-1">
                                    <FaCalendarAlt className="w-3 h-3" />
                                    Último login: {formatDate(user.lastLogin)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalhes"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUser(user);
                                setShowUserForm(true);
                              }}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleUserStatus(user.id);
                              }}
                              className={`p-2 hover:bg-gray-50 rounded-lg transition-colors ${
                                user.isActive
                                  ? "text-orange-600 hover:text-orange-800"
                                  : "text-green-600 hover:text-green-800"
                              }`}
                              title={user.isActive ? "Desativar" : "Ativar"}
                            >
                              {user.isActive ? (
                                <FaToggleOff className="w-4 h-4" />
                              ) : (
                                <FaToggleOn className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                              }}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {showUserForm && (
            <UserForm
              initialData={
                editingUser
                  ? {
                      email: editingUser.email,
                      password: "",
                      name: editingUser.name,
                      role: editingUser.role,
                      sectorId: editingUser.sectorId,
                      isActive: editingUser.isActive,
                      id: editingUser.id,
                    }
                  : undefined
              }
              sectors={sectors}
              onSubmit={editingUser ? handleEditUser : handleCreateUser}
              onCancel={() => {
                setShowUserForm(false);
                setEditingUser(null);
              }}
            />
          )}

          {showUserModal && selectedUser && (
            <UserInfoModal
              user={selectedUser}
              onClose={() => {
                setShowUserModal(false);
                setSelectedUser(null);
              }}
              onEdit={() => {
                setEditingUser(selectedUser);
                setShowUserForm(true);
                setShowUserModal(false);
                setSelectedUser(null);
              }}
              onToggleStatus={() => {
                handleToggleUserStatus(selectedUser.id);
                setShowUserModal(false);
                setSelectedUser(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
