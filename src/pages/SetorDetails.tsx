import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  SetorModalData,
  MembroSetor,
  SetorHierarquia,
  SubsetorData,
  convertSubsetorToSector,
  convertSubsetorToSectorModal,
} from "../types/interfaces";
import { useTheme } from "../contexts/ThemeContext";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaEye,
  FaUserPlus,
  FaUserTie,
  FaLaptopCode,
  FaChartLine,
  FaDollarSign,
  FaTools,
  FaShippingFast,
  FaMedkit,
  FaGraduationCap,
  FaArrowLeft,
  FaCrown,
  FaCogs,
  FaBuilding,
} from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { Sidebar } from "../components/elements/Sidebar";
import { SetorForm } from "../components/elements/forms/SetorForm";
import { MembroForm } from "../components/elements/forms/MembroForm";
import { SetorInfoModal } from "../components/modals/SetorInfoModal";
import { sectorServices } from "../services/sectorsServices";

type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};
type ApiSubSector = {
  id: number;
  name: string;
  manager?: { id: number; name: string };
  description?: string;
  createdAt: string;
  users?: ApiUser[];
};

export const SetorDetail = () => {
  const { theme } = useTheme();
  const { setorKey } = useParams<{ setorKey: string }>();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState<
    "calendario" | "setores" | "usuarios"
  >("setores");
  const [subsetores, setSubsetores] = useState<SubsetorData[]>([]);
  const [showSetorForm, setShowSetorForm] = useState(false);
  const [showMembroForm, setShowMembroForm] = useState(false);
  const [showSetorModal, setShowSetorModal] = useState(false);
  const [editingSubsetor, setEditingSubsetor] = useState<SubsetorData | null>(
    null
  );
  const [selectedSubsetor, setSelectedSubsetor] = useState<SubsetorData | null>(
    null
  );
  const [selectedSubsetorForMembro, setSelectedSubsetorForMembro] = useState<
    string | null
  >(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

const [setor, setSetor] = useState<any | null>(null);

  const getSetorPrincipalIcon = (setorKey: string) => {
    switch (setorKey) {
      case "diretortecnico":
        return {
          icon: FaCogs,
          colors: "from-blue-100 to-blue-200",
          iconColor: "text-blue-600",
        };
      case "daf":
        return {
          icon: FaBuilding,
          colors: "from-green-100 to-green-200",
          iconColor: "text-green-600",
        };
      case "presidente":
        return {
          icon: FaCrown,
          colors: "from-purple-100 to-purple-200",
          iconColor: "text-purple-600",
        };
      default:
        return {
          icon: MdGroups2,
          colors: "from-gray-100 to-gray-200",
          iconColor: "text-gray-600",
        };
    }
  };

  const getSubsetorIcon = (nomeSubsetor: string) => {
    const nome = nomeSubsetor.toLowerCase();

    if (nome.includes("t.i") || nome.includes("tecnologia")) {
      return {
        icon: FaLaptopCode,
        colors: "from-purple-100 to-purple-200",
        iconColor: "text-purple-600",
      };
    }
    if (nome.includes("recursos humanos") || nome.includes("rh")) {
      return {
        icon: FaUserTie,
        colors: "from-blue-100 to-blue-200",
        iconColor: "text-blue-600",
      };
    }
    if (nome.includes("contabilidade") || nome.includes("contábil")) {
      return {
        icon: FaDollarSign,
        colors: "from-yellow-100 to-yellow-200",
        iconColor: "text-yellow-600",
      };
    }
    if (nome.includes("compras") || nome.includes("licitação")) {
      return {
        icon: FaShippingFast,
        colors: "from-indigo-100 to-indigo-200",
        iconColor: "text-indigo-600",
      };
    }
    if (nome.includes("controle")) {
      return {
        icon: FaChartLine,
        colors: "from-red-100 to-red-200",
        iconColor: "text-red-600",
      };
    }
    if (nome.includes("almoxarifado")) {
      return {
        icon: FaTools,
        colors: "from-orange-100 to-orange-200",
        iconColor: "text-orange-600",
      };
    }
    if (nome.includes("gabinete") || nome.includes("procuradoria")) {
      return {
        icon: FaGraduationCap,
        colors: "from-teal-100 to-teal-200",
        iconColor: "text-teal-600",
      };
    }
    if (nome.includes("ascom") || nome.includes("ouvidoria")) {
      return {
        icon: FaMedkit,
        colors: "from-pink-100 to-pink-200",
        iconColor: "text-pink-600",
      };
    }
    if (
      nome.includes("saneamento") ||
      nome.includes("energia") ||
      nome.includes("gás") ||
      nome.includes("tarifária")
    ) {
      return {
        icon: FaCogs,
        colors: "from-green-100 to-green-200",
        iconColor: "text-green-600",
      };
    }
    if (nome.includes("loterias") || nome.includes("ct loterias")) {
      return {
        icon: FaDollarSign,
        colors: "from-emerald-100 to-emerald-200",
        iconColor: "text-emerald-600",
      };
    }
    if (nome.includes("conselho superior")) {
      return {
        icon: FaCrown,
        colors: "from-violet-100 to-violet-200",
        iconColor: "text-violet-600",
      };
    }

    return {
      icon: MdGroups2,
      colors: "from-gray-100 to-gray-200",
      iconColor: "text-gray-600",
    };
  };

useEffect(() => {
  const fetchSetor = async () => {
    try {
      if (setorKey) {
        const setorId = Number(setorKey);
        const setorData = await sectorServices.getSectorsbyId(setorId);
        if (setorData) {
          setSetor({
            ...setorData,
            nome: setorData.name, // <- Adiciona o campo 'nome' para uso na UI
          });

          const mappedSubsetores: SubsetorData[] = (setorData.subSectors ?? []).map((sub: ApiSubSector) => ({
            id: sub.id.toString(),
            nome: sub.name,
            setorPai: setorId.toString(),
            responsavel: sub.manager?.name || "",
            descricao: sub.description || "",
            dataCriacao: sub.createdAt,
            membros: (sub.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: sub.users ? sub.users.length : 0,
            membrosAtivos: sub.users ? sub.users.filter((u: ApiUser) => u.isActive).length : 0,
          }));

          const setorPrincipal: SubsetorData = {
            id: setorData.id.toString(),
            nome: setorData.name,
            setorPai: setorData.manager?.id?.toString() || "",
            responsavel: setorData.manager?.name || "",
            descricao: setorData.description || "",
            dataCriacao: setorData.createdAt,
            membros: (setorData.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: setorData.users ? setorData.users.length : 0,
            membrosAtivos: setorData.users ? setorData.users.filter((u: ApiUser) => u.isActive).length : 0,
          };

          setSubsetores([setorPrincipal, ...mappedSubsetores]);
        } else {
          setSetor(null);
        }
      }
    } catch (error) {
      console.error(error);
      setSetor(null);
    }
  };

  fetchSetor();
}, [setorKey]);

  const handleCreateMembro = async (data: any) => {
    if (selectedSubsetorForMembro) {
      try {
        await sectorServices.addMemberToSector(Number(selectedSubsetorForMembro), data);
        // Atualiza os dados do setor após adicionar membro
        if (setorKey) {
          const setorId = Number(setorKey);
          const setorData = await sectorServices.getSectorsbyId(setorId);
          // Repete o mapeamento dos subsetores
          const mappedSubsetores: SubsetorData[] = (setorData.subSectors ?? []).map((sub: ApiSubSector) => ({
            id: sub.id.toString(),
            nome: sub.name,
            setorPai: setorId.toString(),
            responsavel: sub.manager?.name || "",
            descricao: sub.description || "",
            dataCriacao: sub.createdAt,
            membros: (sub.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: sub.users ? sub.users.length : 0,
            membrosAtivos: sub.users ? sub.users.filter((u: ApiUser) => u.isActive).length : 0,
          }));
          const setorPrincipal: SubsetorData = {
            id: setorData.id.toString(),
            nome: setorData.name,
            setorPai: setorData.manager?.id?.toString() || "",
            responsavel: setorData.manager?.name || "",
            descricao: setorData.description || "",
            dataCriacao: setorData.createdAt,
            membros: (setorData.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: setorData.users ? setorData.users.length : 0,
            membrosAtivos: setorData.users ? setorData.users.filter((u: ApiUser) => u.isActive).length : 0,
          };
          setSubsetores([setorPrincipal, ...mappedSubsetores]);
        }
        setShowMembroForm(false);
        setSelectedSubsetorForMembro(null);
      } catch (error) {
        console.error("Erro ao adicionar membro:", error);
      }
    }
  };

  const handleCreateSetor = async (data: any) => {
    try {
      if (setorKey) {
        const setorId = Number(setorKey);
        await sectorServices.postSubSector(setorId, data);
        // Atualiza os dados do setor após criar subsetor
        const setorData = await sectorServices.getSectorsbyId(setorId);
        const mappedSubsetores: SubsetorData[] = (setorData.subSectors ?? []).map((sub: ApiSubSector) => ({
          id: sub.id.toString(),
          nome: sub.name,
          setorPai: setorId.toString(),
          responsavel: sub.manager?.name || "",
          descricao: sub.description || "",
          dataCriacao: sub.createdAt,
          membros: (sub.users ?? []).map((user: ApiUser) => ({
            id: user.id.toString(),
            nome: user.name,
            email: user.email,
            role: user.role,
            status: user.isActive ? "ativo" : "inativo",
            dataIngresso: new Date(),
          })),
          totalMembros: sub.users ? sub.users.length : 0,
          membrosAtivos: sub.users ? sub.users.filter((u: ApiUser) => u.isActive).length : 0,
        }));
        const setorPrincipal: SubsetorData = {
          id: setorData.id.toString(),
          nome: setorData.name,
          setorPai: setorData.manager?.id?.toString() || "",
          responsavel: setorData.manager?.name || "",
          descricao: setorData.description || "",
          dataCriacao: setorData.createdAt,
          membros: (setorData.users ?? []).map((user: ApiUser) => ({
            id: user.id.toString(),
            nome: user.name,
            email: user.email,
            role: user.role,
            status: user.isActive ? "ativo" : "inativo",
            dataIngresso: new Date(),
          })),
          totalMembros: setorData.users ? setorData.users.length : 0,
          membrosAtivos: setorData.users ? setorData.users.filter((u: ApiUser) => u.isActive).length : 0,
        };
        setSubsetores([setorPrincipal, ...mappedSubsetores]);
      }
      setShowSetorForm(false);
      setEditingSubsetor(null);
    } catch (error) {
      console.error("Erro ao criar subsetor:", error);
    }
  };

  const handleEditSetor = async (data: any) => {
    if (editingSubsetor) {
      try {
        await sectorServices.putSector(editingSubsetor.id, data);
        if (setorKey) {
          const setorId = Number(setorKey);
          const setorData = await sectorServices.getSectorsbyId(setorId);
          const mappedSubsetores: SubsetorData[] = (setorData.subSectors ?? []).map((sub: ApiSubSector) => ({
            id: sub.id.toString(),
            nome: sub.name,
            setorPai: setorId.toString(),
            responsavel: sub.manager?.name || "",
            descricao: sub.description || "",
            dataCriacao: sub.createdAt,
            membros: (sub.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: sub.users ? sub.users.length : 0,
            membrosAtivos: sub.users ? sub.users.filter((u: ApiUser) => u.isActive).length : 0,
          }));
          const setorPrincipal: SubsetorData = {
            id: setorData.id.toString(),
            nome: setorData.name,
            setorPai: setorData.manager?.id?.toString() || "",
            responsavel: setorData.manager?.name || "",
            descricao: setorData.description || "",
            dataCriacao: setorData.createdAt,
            membros: (setorData.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: setorData.users ? setorData.users.length : 0,
            membrosAtivos: setorData.users ? setorData.users.filter((u: ApiUser) => u.isActive).length : 0,
          };
          setSubsetores([setorPrincipal, ...mappedSubsetores]);
        }
        setShowSetorForm(false);
        setEditingSubsetor(null);
      } catch (error) {
        console.error("Erro ao editar subsetor:", error);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (selectedSubsetor) {
      try {
        await sectorServices.removeMemberFromSector(Number(selectedSubsetor.id), Number(userId));
        if (setorKey) {
          const setorId = Number(setorKey);
          const setorData = await sectorServices.getSectorsbyId(setorId);
          const mappedSubsetores: SubsetorData[] = (setorData.subSectors ?? []).map((sub: ApiSubSector) => ({
            id: sub.id,
            nome: sub.name,
            setorPai: setorId.toString(),
            responsavel: sub.manager?.name || "",
            descricao: sub.description || "",
            dataCriacao: sub.createdAt,
            membros: (sub.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: sub.users ? sub.users.length : 0,
            membrosAtivos: sub.users ? sub.users.filter((u: ApiUser) => u.isActive).length : 0,
          }));
          const setorPrincipal: SubsetorData = {
            id: setorData.id.toString(),
            nome: setorData.name,
            setorPai: setorData.manager?.id?.toString() || "",
            responsavel: setorData.manager?.name || "",
            descricao: setorData.description || "",
            dataCriacao: setorData.createdAt,
            membros: (setorData.users ?? []).map((user: ApiUser) => ({
              id: user.id.toString(),
              nome: user.name,
              email: user.email,
              role: user.role,
              status: user.isActive ? "ativo" : "inativo",
              dataIngresso: new Date(),
            })),
            totalMembros: setorData.users ? setorData.users.length : 0,
            membrosAtivos: setorData.users ? setorData.users.filter((u: ApiUser) => u.isActive).length : 0,
          };
          setSubsetores([setorPrincipal, ...mappedSubsetores]);
          // Atualizar o selectedSubsetor também
          const updatedSubsetor = [setorPrincipal, ...mappedSubsetores].find(
            (s) => s.id === selectedSubsetor.id
          );
          if (updatedSubsetor) {
            setSelectedSubsetor(updatedSubsetor);
          }
        }
      } catch (error) {
        console.error("Erro ao remover membro:", error);
      }
    }
  };

  if (!setor) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex">
          <Sidebar
            isOpen={isOpen}
            activeView={activeView}
            onToggle={toggleSidebar}
            onViewChange={(view) => {
              if (
                view === "calendario" ||
                view === "setores" ||
                view === "usuarios"
              ) {
                setActiveView(view);
              }
            }}
          />
          <div
            className={`flex-1 transition-all duration-300 ${
              isOpen ? "ml-64" : "ml-16"
            } p-6`}
          >
            <div className="text-center py-16">
              <h1
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Setor não encontrado
              </h1>
              <button
                onClick={() => navigate("/setores")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Voltar aos Setores
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    icon: IconComponent,
    colors,
    iconColor,
  } = getSetorPrincipalIcon(setorKey || "");
  const totalMembros = subsetores.reduce(
    (acc, sub) => acc + sub.totalMembros,
    0
  );
  const membrosAtivos = subsetores.reduce(
    (acc, sub) => acc + sub.membrosAtivos,
    0
  );

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex">
        <Sidebar
          isOpen={isOpen}
          activeView={activeView}
          onToggle={toggleSidebar}
          onViewChange={(view) => {
            if (
              view === "calendario" ||
              view === "setores" ||
              view === "usuarios"
            ) {
              setActiveView(view);
            }
          }}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="mx-auto p-6 pt-6">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => navigate("/setores")}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <FaArrowLeft className="w-4 h-4" />
                </button>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${colors} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                  <h1
                    className={`text-4xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {setor.nome}
                  </h1>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                     {totalMembros}{" "}
                    membro{totalMembros !== 1 ? "s" : ""} • {membrosAtivos}{" "}
                    ativo{membrosAtivos !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
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
                  Subsetores de {setor.nome}
                </h2>
              </div>

              {subsetores.length === 0 ? (
                <div className="text-center py-16">
                  <div
                    className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-gray-700 to-gray-800"
                        : "bg-gradient-to-br from-gray-100 to-gray-200"
                    }`}
                  >
                    <MdGroups2
                      className={`w-12 h-12 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-semibold mb-3 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Nenhum subsetor encontrado
                  </h3>
                  <p
                    className={`mb-6 max-w-md mx-auto ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Crie o primeiro subsetor para {setor.nome} e comece a
                    organizar sua equipe
                  </p>
                  <button
                    onClick={() => setShowSetorForm(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <FaPlus className="w-4 h-4" />
                    Criar Primeiro Subsetor
                  </button>
                </div>
              ) : (
                <ul
                  className={`divide-y ${
                    theme === "dark" ? "divide-gray-700" : "divide-gray-100"
                  }`}
                >
                  {subsetores.map((subsetor) => {
                    const {
                      icon: SubIcon,
                      colors: subColors,
                      iconColor: subIconColor,
                    } = getSubsetorIcon(subsetor.nome);

                    return (
                      <li
                        key={subsetor.id}
                        className={`p-6 transition-colors cursor-pointer group ${
                          theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedSubsetor(subsetor);
                          setShowSetorModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 bg-gradient-to-br ${subColors} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                            >
                              <SubIcon className={`w-6 h-6 ${subIconColor}`} />
                            </div>

                            <div className="flex-1">
                              <h3
                                className={`text-lg font-semibold mb-1 ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {subsetor.nome}
                              </h3>

                              {subsetor.responsavel && (
                                <p
                                  className={`text-sm mb-2 ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Responsável: {subsetor.responsavel}
                                </p>
                              )}

                              <div
                                className={`flex items-center gap-4 text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {subsetor.localizacao && (
                                  <span className="flex items-center gap-1">
                                    <FaBuilding className="w-3 h-3" />
                                    {subsetor.localizacao}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <FaUsers className="w-3 h-3" />
                                  {subsetor.totalMembros} membro
                                  {subsetor.totalMembros !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                              {subsetor.membros
                                .slice(0, 3)
                                .map((membro, index) => (
                                  <div
                                    key={membro.id}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-sm"
                                    style={{ zIndex: 3 - index }}
                                    title={membro.nome}
                                  >
                                    {membro.nome
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)}
                                  </div>
                                ))}
                              {subsetor.membros.length > 3 && (
                                <div
                                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium shadow-sm ${
                                    theme === "dark"
                                      ? "bg-gray-600 text-gray-300"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  +{subsetor.membros.length - 3}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubsetor(subsetor);
                                  setShowSetorModal(true);
                                }}
                                className={`p-2 text-blue-600 hover:text-blue-800 rounded-lg transition-colors ${
                                  theme === "dark"
                                    ? "hover:bg-blue-900/20"
                                    : "hover:bg-blue-50"
                                }`}
                                title="Ver detalhes"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSubsetor(subsetor);
                                  setShowSetorForm(true);
                                }}
                                className={`p-2 text-green-600 hover:text-green-800 rounded-lg transition-colors ${
                                  theme === "dark"
                                    ? "hover:bg-green-900/20"
                                    : "hover:bg-green-50"
                                }`}
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                             
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}

                 
                </ul>
              )}
            </div>
          </div>

          {showSetorForm && (
            <SetorForm
              initialData={
                editingSubsetor
                  ? convertSubsetorToSector(editingSubsetor)
                  : undefined
              }
              onSubmit={editingSubsetor ? handleEditSetor : handleCreateSetor}
              onCancel={() => {
                setShowSetorForm(false);
                setEditingSubsetor(null);
              }}
            />
          )}

          {showMembroForm && selectedSubsetorForMembro && (
            <MembroForm
              setorId={selectedSubsetorForMembro}
              onSubmit={handleCreateMembro}
              onCancel={() => {
                setShowMembroForm(false);
                setSelectedSubsetorForMembro(null);
              }}
            />
          )}

          {showSetorModal && selectedSubsetor && (
            <SetorInfoModal
              setor={convertSubsetorToSectorModal(selectedSubsetor)}
              onClose={() => {
                setShowSetorModal(false);
                setSelectedSubsetor(null);
              }}
              onEdit={() => {
                setEditingSubsetor(selectedSubsetor);
                setShowSetorForm(true);
                setShowSetorModal(false);
                setSelectedSubsetor(null);
              }}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};
