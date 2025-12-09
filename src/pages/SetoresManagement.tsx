import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MembroSetor,
  SectorFormData,
  SectorData,
  SubsetorData,
  convertSubsetorToSectorModal,
} from "../types/interfaces";
import { sectorServices } from "../services/sectorsServices";
import { userServices } from "../services/usersServices";
import { useTheme } from "../contexts/ThemeContext";

import {
  FaPlus,
  FaUsers,
  FaEye,
  FaChevronRight,
  FaCrown,
  FaCogs,
  FaBuilding,
} from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { SetorForm } from "../components/elements/forms/SetorForm";
import { MembroForm } from "../components/elements/forms/MembroForm";
import { SetorInfoModal } from "../components/modals/SetorInfoModal";
import { Sidebar } from "../components/elements/Sidebar";

export const SetoresManagement = () => {
  const { theme } = useTheme();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState<
    "calendario" | "setores" | "usuarios"
  >("setores");

  const [setores, setSetores] = useState<SectorData[]>([]);

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


  useEffect(() => {
    const fetchSectors = async () => {
      const data = await sectorServices.getSectors();
      setSetores(Array.isArray(data) ? data : []);
    };
    fetchSectors();
  }, []);


  const getSetorPrincipalIcon = (setorKey: string) => {
    switch (setorKey) {
      case "DiretorTecnico":
        return {
          icon: FaCogs,
          colors: "from-slate-200 to-slate-300",
          iconColor: "text-slate-600",
        };
      case "DAF":
        return {
          icon: FaBuilding,
          colors: "from-teal-200 to-teal-300",
          iconColor: "text-teal-600",
        };
      case "Presidente":
        return {
          icon: FaCrown,
          colors: "from-violet-200 to-violet-300",
          iconColor: "text-violet-600",
        };
      default:
        return {
          icon: MdGroups2,
          colors: "from-gray-200 to-gray-300",
          iconColor: "text-gray-600",
        };
    }
  };

  const handleCreateMembro = async (data: Record<string, unknown>) => {
    await userServices.postUser(data);
    setShowMembroForm(false);
    setSelectedSubsetorForMembro(null);
    setSelectedSubsetor(null);

    const dataSetores = await sectorServices.getSectors();
    setSetores(Array.isArray(dataSetores) ? dataSetores : []);
  };


  const handleCreateSetor = async (data: SectorFormData) => {
    await sectorServices.putSector("new", data);
    setShowSetorForm(false);
    setEditingSubsetor(null);

    const dataSetores = await sectorServices.getSectors();
    setSetores(Array.isArray(dataSetores) ? dataSetores : []);
  };

  const handleEditSetor = async (data: SectorFormData) => {
    if (editingSubsetor) {
      await sectorServices.putSector(editingSubsetor.id, data);
      setShowSetorForm(false);
      setEditingSubsetor(null);

      const dataSetores = await sectorServices.getSectors();
      setSetores(Array.isArray(dataSetores) ? dataSetores : []);
    }
  };

  const handleDeleteUser = async (userId: number | string) => {
    await userServices.deleteUser(Number(userId));

    const dataSetores = await sectorServices.getSectors();
    setSetores(Array.isArray(dataSetores) ? dataSetores : []);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <div className="flex min-h-screen">
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
          className={`flex-1 mt-10 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="mx-auto p-6 pt-6">
            <div className="mb-12 text-center">
              <h1
                className={`text-[40px] font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-600"
                }`}
              >
                Gestão de Setores
              </h1>
            </div>

            <div className="relative max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {setores.length > 0 ? (
                  setores.map((setor, index) => {
                    const { icon: IconComponent, colors, iconColor } = getSetorPrincipalIcon(setor.name);
                    const totalMembros = setor._count?.users || 0;
                    const membrosAtivos = setor._count?.usersAtivos || 0;

                    const subsetoresDoSetor = setor.subSectors || [];
                    return (
                      <div
                        key={setor.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div
                          className={`relative rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-100"
                          }`}
                          onClick={() => navigate(`/setores/${setor.id}`)}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${colors} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                          ></div>
                          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                          </div>
                          <div className="relative p-8">
                            <div className="flex flex-col items-center text-center">
                              <div className="relative mb-6">
                                <div
                                  className={`w-20 h-20 bg-gradient-to-br ${colors} rounded-3xl flex items-center justify-center shadow-xl mb-2 group-hover:scale-110 transition-all duration-500 ring-4 ring-white ring-opacity-50`}
                                >
                                  <IconComponent className={`w-10 h-10 ${iconColor} drop-shadow-lg`} />
                                </div>
                                <div
                                  className={`absolute inset-0 w-20 h-20 bg-gradient-to-br ${colors} rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`}
                                ></div>
                              </div>
                              <h2
                                className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                                  theme === "dark"
                                    ? "text-white group-hover:text-gray-200"
                                    : "text-gray-900 group-hover:text-gray-700"
                                }`}
                              >
                                {setor.name}
                              </h2>
                              <div className="space-y-3 mb-6 w-full">
                                
                                <div
                                  className={`flex items-center justify-center gap-3 rounded-xl p-3 transition-colors duration-300 ${
                                    theme === "dark"
                                      ? "bg-gray-700 group-hover:bg-gray-600"
                                      : "bg-gray-50 group-hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FaUsers className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {totalMembros} membro{totalMembros !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div
                                  className={`flex items-center justify-center gap-3 rounded-xl p-3 transition-colors duration-300 ${
                                    theme === "dark"
                                      ? "bg-gray-700 group-hover:bg-gray-600"
                                      : "bg-gray-50 group-hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {membrosAtivos} ativo{membrosAtivos !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full">
                                <div
                                  className={`rounded-xl p-4 transition-all duration-300 ${
                                    theme === "dark"
                                      ? "bg-gray-700 hover:bg-gray-600"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center gap-2 ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    <FaEye className="w-4 h-4" />
                                    <span className="font-semibold">Gerenciar Setor</span>
                                    <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full">
                    <div
                      className={`text-center py-20 rounded-3xl shadow-xl border ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="relative mb-8">
                        <div
                          className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-xl ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-gray-700 to-gray-800"
                              : "bg-gradient-to-br from-gray-100 to-gray-200"
                          }`}
                        >
                          <MdGroups2
                            className={`w-16 h-16 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div
                          className={`absolute inset-0 w-32 h-32 mx-auto rounded-3xl opacity-20 blur-xl ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-gray-700 to-gray-800"
                              : "bg-gradient-to-br from-gray-100 to-gray-200"
                          }`}
                        ></div>
                      </div>
                      <h3
                        className={`text-3xl font-bold mb-4 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Crie sua primeira estrutura
                      </h3>
                      <p
                        className={`mb-8 max-w-md mx-auto text-lg ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Organize sua empresa criando setores e subsetores, e
                        adicione membros às equipes
                      </p>
                      <button
                        onClick={() => setShowSetorForm(true)}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-xl font-semibold text-lg"
                      >
                        <FaPlus className="w-5 h-5" />
                        Criar Estrutura
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showSetorForm && (
            <SetorForm
              initialData={editingSubsetor ? (() => {
                const converted = convertSubsetorToSectorModal(editingSubsetor);
                // Remove 'manager' se existir
                const { manager, ...rest } = converted;
                return { ...rest, id: Number(editingSubsetor.id) };
              })() : undefined}
              parentSectors={setores}
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
                setSelectedSubsetor(null);
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
