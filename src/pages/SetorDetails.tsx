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

export const SetorDetail = () => {
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

  const setoresHierarquia: { [key: string]: SetorHierarquia } = {
    presidente: {
      nome: "Presidência",
      subsetores: [
        "Gabinete",
        "Procuradoria",
        "Conselho Superior",
        "ASCOM",
        "Ouvidoria",
      ],
    },
    diretortecnico: {
      nome: "Diretor Técnico",
      subsetores: ["Câmera de Saneamento", "Energia", "Lotérica", "Gás"],
    },
    daf: {
      nome: "DAF",
      subsetores: [
        "T.I",
        "Controle Interno",
        "Setor Contábil",
        "Setor de Compras",
        "Licitação",
        "Recursos Humanos",
        "Almoxarifado",
      ],
    },
  };

  const setor = setorKey ? setoresHierarquia[setorKey] : null;

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
    if (nome.includes("contábil") || nome.includes("contabilidade")) {
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
      nome.includes("gás")
    ) {
      return {
        icon: FaCogs,
        colors: "from-green-100 to-green-200",
        iconColor: "text-green-600",
      };
    }
    if (nome.includes("lotérica")) {
      return {
        icon: FaDollarSign,
        colors: "from-emerald-100 to-emerald-200",
        iconColor: "text-emerald-600",
      };
    }

    return {
      icon: MdGroups2,
      colors: "from-gray-100 to-gray-200",
      iconColor: "text-gray-600",
    };
  };

  useEffect(() => {
    const mockSubsetores: SubsetorData[] = [
      {
        id: "ti-daf",
        nome: "T.I",
        setorPai: "daf",
        responsavel: "Carlos Oliveira",
        emailSetor: "ti@empresa.com",
        telefoneSetor: "(11) 1234-5679",
        localizacao: "Andar 3 - Sala 301",
        observacoes: "Centro de inovação tecnológica",
        dataCriacao: new Date("2023-02-01"),
        membros: [
          {
            id: 1,
            nome: "Carlos Oliveira",
            email: "carlos.oliveira@empresa.com",
            cargo: "Coordenador de TI",
            telefone: "(11) 9999-3333",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
          {
            id: 2,
            nome: "Ana Costa",
            email: "ana.costa@empresa.com",
            cargo: "Desenvolvedora",
            telefone: "(11) 9999-4444",
            dataIngresso: new Date("2023-04-15"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "rh-daf",
        nome: "Recursos Humanos",
        setorPai: "daf",
        responsavel: "Maria Silva",
        emailSetor: "rh@empresa.com",
        telefoneSetor: "(11) 1234-5678",
        localizacao: "Andar 2 - Sala 201",
        observacoes: "Gestão de pessoas e desenvolvimento",
        dataCriacao: new Date("2023-01-15"),
        membros: [
          {
            id: 3,
            nome: "Maria Silva",
            email: "maria.silva@empresa.com",
            cargo: "Gerente de RH",
            telefone: "(11) 9999-1111",
            dataIngresso: new Date("2023-01-15"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
      {
        id: "contabil-daf",
        nome: "Setor Contábil",
        setorPai: "daf",
        responsavel: "Patricia Rocha",
        emailSetor: "contabil@empresa.com",
        telefoneSetor: "(11) 1234-5681",
        localizacao: "Andar 2 - Sala 205",
        observacoes: "Controle financeiro e contábil",
        dataCriacao: new Date("2023-01-20"),
        membros: [
          {
            id: 4,
            nome: "Patricia Rocha",
            email: "patricia.rocha@empresa.com",
            cargo: "Contador",
            telefone: "(11) 9999-9999",
            dataIngresso: new Date("2023-01-20"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
      {
        id: "saneamento-dt",
        nome: "Câmera de Saneamento",
        setorPai: "diretortecnico",
        responsavel: "Roberto Santos",
        emailSetor: "saneamento@empresa.com",
        localizacao: "Sede Técnica",
        observacoes: "Gestão de saneamento básico",
        dataCriacao: new Date("2023-03-01"),
        membros: [
          {
            id: 5,
            nome: "Roberto Santos",
            email: "roberto.santos@empresa.com",
            cargo: "Coordenador de Saneamento",
            telefone: "(11) 9999-1010",
            dataIngresso: new Date("2023-03-01"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
      {
        id: "gabinete-pres",
        nome: "Gabinete",
        setorPai: "presidente",
        responsavel: "Lucas Fernandes",
        emailSetor: "gabinete@empresa.com",
        telefoneSetor: "(11) 1234-5680",
        localizacao: "Andar Executivo",
        observacoes: "Apoio à presidência",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 6,
            nome: "Lucas Fernandes",
            email: "lucas.fernandes@empresa.com",
            cargo: "Chefe de Gabinete",
            telefone: "(11) 9999-6666",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
    ];

    const subsetoresDoSetor = mockSubsetores.filter(
      (sub) => sub.setorPai === setorKey
    );
    setSubsetores(subsetoresDoSetor);
  }, [setorKey]);

  const handleCreateMembro = (data: any) => {
    if (selectedSubsetorForMembro) {
      const updatedSubsetores = subsetores.map((subsetor) => {
        if (subsetor.id === selectedSubsetorForMembro) {
          const newMembro: MembroSetor = {
            id: Date.now(),
            ...data,
            dataIngresso: new Date(),
            status: "ativo",
          };
          return {
            ...subsetor,
            membros: [...subsetor.membros, newMembro],
            totalMembros: subsetor.totalMembros + 1,
            membrosAtivos: subsetor.membrosAtivos + 1,
          };
        }
        return subsetor;
      });
      setSubsetores(updatedSubsetores);
      setShowMembroForm(false);
      setSelectedSubsetorForMembro(null);
    }
  };

  const handleCreateSetor = (data: any) => {
    const newSubsetor: SubsetorData = {
      id: `novo-${Date.now()}`,
      nome: data.nome,
      setorPai: setorKey || "daf",
      responsavel: data.responsavel,
      emailSetor: data.emailSetor,
      telefoneSetor: data.telefoneSetor,
      localizacao: data.localizacao,
      observacoes: data.observacoes,
      descricao: data.descricao,
      dataCriacao: new Date(),
      membros: [],
      totalMembros: 0,
      membrosAtivos: 0,
    };

    setSubsetores([...subsetores, newSubsetor]);
    setShowSetorForm(false);
    setEditingSubsetor(null);
  };

  const handleEditSetor = (data: any) => {
    if (editingSubsetor) {
      const updatedSubsetores = subsetores.map((subsetor) => {
        if (subsetor.id === editingSubsetor.id) {
          return {
            ...subsetor,
            nome: data.nome,
            responsavel: data.responsavel,
            emailSetor: data.emailSetor,
            telefoneSetor: data.telefoneSetor,
            localizacao: data.localizacao,
            observacoes: data.observacoes,
            descricao: data.descricao,
          };
        }
        return subsetor;
      });

      setSubsetores(updatedSubsetores);
      setShowSetorForm(false);
      setEditingSubsetor(null);
    }
  };

  if (!setor) {
    return (
      <div className="min-h-screen">
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
            } p-6`}
          >
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
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
    <div className="min-h-screen">
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
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => navigate("/setores")}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${colors} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {setor.nome}
                  </h1>
                  <p className="text-gray-600">
                    {subsetores.length} subsetor
                    {subsetores.length !== 1 ? "es" : ""} • {totalMembros}{" "}
                    membro{totalMembros !== 1 ? "s" : ""} • {membrosAtivos}{" "}
                    ativo{membrosAtivos !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowSetorForm(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454] text-white px-6 py-3 rounded-xl  transition-all transform hover:scale-105 shadow-lg"
              >
                <FaPlus className="w-4 h-4" />
                Novo Subsetor
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Subsetores de {setor.nome}
                </h2>
              </div>

              {subsetores.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                    <MdGroups2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Nenhum subsetor encontrado
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
                <ul className="divide-y divide-gray-100">
                  {subsetores.map((subsetor) => {
                    const {
                      icon: SubIcon,
                      colors: subColors,
                      iconColor: subIconColor,
                    } = getSubsetorIcon(subsetor.nome);

                    return (
                      <li
                        key={subsetor.id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
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
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {subsetor.nome}
                              </h3>

                              {subsetor.responsavel && (
                                <p className="text-sm text-gray-500 mb-2">
                                  Responsável: {subsetor.responsavel}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-sm text-gray-600">
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
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium shadow-sm">
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
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
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
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubsetorForMembro(subsetor.id);
                                  setShowMembroForm(true);
                                }}
                                className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Adicionar membro"
                              >
                                <FaUserPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}

                  <li
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group border-2 border-dashed border-gray-200 hover:border-blue-400"
                    onClick={() => setShowSetorForm(true)}
                  >
                    <div className="flex items-center justify-center gap-4 text-gray-500 group-hover:text-blue-600">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-purple-50 rounded-xl flex items-center justify-center transition-all duration-300">
                        <FaPlus className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          Adicionar Novo Subsetor
                        </h3>
                        <p className="text-sm text-gray-500">
                          Clique para criar um novo subsetor
                        </p>
                      </div>
                    </div>
                  </li>
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
              onAddUser={() => {
                setSelectedSubsetorForMembro(selectedSubsetor.id);
                setShowMembroForm(true);
                setShowSetorModal(false);
                setSelectedSubsetorForMembro(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
