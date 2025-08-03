import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MembroSetor,
  SetorHierarquia,
  SubsetorData,
  SectorFormData,
  SectorData,
  convertSubsetorToSector,
  convertSubsetorToSectorModal,
} from "../types/interfaces";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import {
  FaPlus,
  FaUsers,
  FaEye,
  FaUserTie,
  FaLaptopCode,
  FaChartLine,
  FaDollarSign,
  FaTools,
  FaShippingFast,
  FaMedkit,
  FaGraduationCap,
  FaChevronRight,
  FaChevronLeft,
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
  const { user, canAccessSector } = useAuth();
  const { canCreateSector, canEditSector, canDeleteSector } = usePermissions();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState<
    "calendario" | "setores" | "usuarios"
  >("setores");
  const [expandedSetores, setExpandedSetores] = useState<Set<string>>(
    new Set()
  );
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "ativos" | "inativos"
  >("todos");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getFilteredSetores = () => {
    if (!user) return {};

    if (user.role === "ADMIN" || user.role === "IT_ADMIN") {
      return setoresHierarquia;
    }

    if (user.role === "MANAGER") {
      const sectorMapping: { [key: number]: string } = {
        1: "Presidente",
        2: "DAF",
        3: "DiretorTecnico",
      };

      const userSectorKey = sectorMapping[user.sectorId];
      if (userSectorKey && setoresHierarquia[userSectorKey]) {
        return { [userSectorKey]: setoresHierarquia[userSectorKey] };
      }
    }

    return {};
  };

  const setoresHierarquia: { [key: string]: SetorHierarquia } = {
    Presidente: {
      nome: "Presidência",
      subsetores: [
        "Procuradoria",
        "Conselho Superior",
        "Gabinete",
        "Ouvidoria",
        "ASCOM",
      ],
    },
    DAF: {
      nome: "DAF",
      subsetores: [
        "Contabilidade",
        "Recursos Humanos",
        "Compras",
        "Licitação",
        "T.I",
        "Almoxarifado",
      ],
    },
    DiretorTecnico: {
      nome: "Diretoria Técnica",
      subsetores: [
        "CT Loterias",
        "CT Gás",
        "CT Energia",
        "CT Tarifária",
        "CT Saneamento",
      ],
    },
  };

  const filteredSetores = getFilteredSetores();
  const setoresArray = Object.entries(filteredSetores);
  const totalSetores = setoresArray.length;

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());
  const maxSlides = Math.max(0, totalSetores - itemsPerSlide);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
      setCurrentSlide(0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maxSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    }
    if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

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

  const mockSectorsData: SectorData[] = [
    {
      id: 1,
      name: "Presidência",
      description: "Órgão máximo da AGRESE",
      users: [],
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
    {
      id: 2,
      name: "DAF",
      description: "Diretoria Administrativa e Financeira",
      users: [],
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
    {
      id: 3,
      name: "Diretoria Técnica",
      description: "Responsável pelas Câmaras Técnicas",
      users: [],
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
  ];

  useEffect(() => {
    const mockSubsetores: SubsetorData[] = [
      {
        id: "procuradoria-pres",
        nome: "Procuradoria",
        setorPai: "Presidente",
        responsavel: "Danielle Fantim",
        emailSetor: "procuradoria@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8800",
        localizacao: "Presidência - Procuradoria",
        observacoes: "Procuradoria Jurídica da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 1,
            nome: "Danielle Fantim",
            email: "danielle.fantim@agrese.se.gov.br",
            cargo: "Procuradora Chefe",
            telefone: "(79) 99999-0001",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 2,
            nome: "Bruna Mariana",
            email: "bruna.mariana@agrese.se.gov.br",
            cargo: "Procuradora",
            telefone: "(79) 99999-0002",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
          {
            id: 3,
            nome: "Luanna Ramos",
            email: "luanna.ramos@agrese.se.gov.br",
            cargo: "Procuradora",
            telefone: "(79) 99999-0003",
            dataIngresso: new Date("2023-03-01"),
            status: "ativo",
          },
          {
            id: 4,
            nome: "James Charles",
            email: "james.charles@agrese.se.gov.br",
            cargo: "Procurador",
            telefone: "(79) 99999-0004",
            dataIngresso: new Date("2023-04-01"),
            status: "ativo",
          },
        ],
        totalMembros: 4,
        membrosAtivos: 4,
      },
      {
        id: "gabinete-pres",
        nome: "Gabinete",
        setorPai: "Presidente",
        responsavel: "Aline Souza",
        emailSetor: "gabinete@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8801",
        localizacao: "Presidência - Gabinete",
        observacoes: "Chefia de Gabinete",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 5,
            nome: "Aline Souza",
            email: "aline.souza@agrese.se.gov.br",
            cargo: "Chefe de Gabinete",
            telefone: "(79) 99999-0005",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 6,
            nome: "Isabela Grossi",
            email: "isabela.grossi@agrese.se.gov.br",
            cargo: "Assessora de Gabinete",
            telefone: "(79) 99999-0006",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "ouvidoria-pres",
        nome: "Ouvidoria",
        setorPai: "Presidente",
        responsavel: "Juliana Costa",
        emailSetor: "ouvidoria@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8802",
        localizacao: "Presidência - Ouvidoria",
        observacoes: "Ouvidoria Geral da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 7,
            nome: "Juliana Costa",
            email: "juliana.costa@agrese.se.gov.br",
            cargo: "Ouvidora",
            telefone: "(79) 99999-0007",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 8,
            nome: "Amanda Guimarães Santana",
            email: "amandaguimaraes.santana@agrese.se.gov.br",
            cargo: "Atendente Call Center",
            telefone: "(79) 99999-0008",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
          {
            id: 9,
            nome: "Evelyn Bispo",
            email: "evelyn.bispo@agrese.se.gov.br",
            cargo: "Atendente Call Center",
            telefone: "(79) 99999-0009",
            dataIngresso: new Date("2023-03-01"),
            status: "ativo",
          },
        ],
        totalMembros: 3,
        membrosAtivos: 3,
      },
      {
        id: "ascom-pres",
        nome: "ASCOM",
        setorPai: "Presidente",
        responsavel: "Ingrid Ferreira",
        emailSetor: "ascom@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8803",
        localizacao: "Presidência - ASCOM",
        observacoes: "Assessoria de Comunicação",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 10,
            nome: "Ingrid Ferreira",
            email: "ingrid.ferreira@agrese.se.gov.br",
            cargo: "Assessora de Comunicação",
            telefone: "(79) 99999-0010",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
      {
        id: "ti-daf",
        nome: "T.I",
        setorPai: "DAF",
        responsavel: "Pablo Cortes",
        emailSetor: "ti@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8810",
        localizacao: "DAF - Tecnologia da Informação",
        observacoes: "Coordenação de TI da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 11,
            nome: "Pablo Cortes",
            email: "pablo.cortes@agrese.se.gov.br",
            cargo: "Coordenador de T.I",
            telefone: "(79) 99999-0011",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 12,
            nome: "Marcelino Souza",
            email: "marcelino.souza@agrese.se.gov.br",
            cargo: "Técnico em T.I",
            telefone: "(79) 99999-0012",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "rh-daf",
        nome: "Recursos Humanos",
        setorPai: "DAF",
        responsavel: "Lady Diana",
        emailSetor: "rh@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8811",
        localizacao: "DAF - Recursos Humanos",
        observacoes: "Gestão de Pessoas da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 13,
            nome: "Lady Diana",
            email: "lady.diana@agrese.se.gov.br",
            cargo: "Gestora de RH",
            telefone: "(79) 99999-0013",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
      {
        id: "contabilidade-daf",
        nome: "Contabilidade",
        setorPai: "DAF",
        responsavel: "Maria Lúcia dos Santos",
        emailSetor: "contabilidade@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8812",
        localizacao: "DAF - Contabilidade",
        observacoes: "Setor Contábil da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 14,
            nome: "Maria Lúcia dos Santos",
            email: "marialucia.dossantos@agrese.se.gov.br",
            cargo: "Contadora",
            telefone: "(79) 99999-0014",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 15,
            nome: "André Santos Oliveira",
            email: "andre.santosoliveira@agrese.se.gov.br",
            cargo: "Auxiliar Contábil",
            telefone: "(79) 99999-0015",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "compras-daf",
        nome: "Compras",
        setorPai: "DAF",
        responsavel: "Marcelo Ribeiro",
        emailSetor: "compras@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8813",
        localizacao: "DAF - Compras",
        observacoes: "Setor de Compras da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 16,
            nome: "Marcelo Ribeiro",
            email: "marcelo.ribeiro@agrese.se.gov.br",
            cargo: "Responsável por Compras",
            telefone: "(79) 99999-0016",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 17,
            nome: "Aderaldo Barroso",
            email: "aderaldo.barroso@agrese.se.gov.br",
            cargo: "Auxiliar de Compras",
            telefone: "(79) 99999-0017",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "licitacao-daf",
        nome: "Licitação",
        setorPai: "DAF",
        responsavel: "Ayanne Iris Santana",
        emailSetor: "licitacao@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8814",
        localizacao: "DAF - Licitação",
        observacoes: "Setor de Licitações da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 18,
            nome: "Ayanne Iris Santana",
            email: "ayanneiris.santana@agrese.se.gov.br",
            cargo: "Responsável por Licitação",
            telefone: "(79) 99999-0018",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 19,
            nome: "Muriel Augusta",
            email: "muriel.augusta@agrese.se.gov.br",
            cargo: "Auxiliar de Licitação",
            telefone: "(79) 99999-0019",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "almoxarifado-daf",
        nome: "Almoxarifado",
        setorPai: "DAF",
        responsavel: "Júlio César Melo",
        emailSetor: "almoxarifado@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8815",
        localizacao: "DAF - Almoxarifado",
        observacoes: "Controle de Estoque da AGRESE",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 20,
            nome: "Júlio César Melo",
            email: "juliocesar.melo@agrese.se.gov.br",
            cargo: "Responsável pelo Almoxarifado",
            telefone: "(79) 99999-0020",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 21,
            nome: "Márcio Silveira",
            email: "marcio.silveira@agrese.se.gov.br",
            cargo: "Auxiliar de Almoxarifado",
            telefone: "(79) 99999-0021",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
          {
            id: 22,
            nome: "Flávia Danielle",
            email: "flavia.danielle@agrese.se.gov.br",
            cargo: "Auxiliar de Almoxarifado",
            telefone: "(79) 99999-0022",
            dataIngresso: new Date("2023-03-01"),
            status: "ativo",
          },
        ],
        totalMembros: 3,
        membrosAtivos: 3,
      },
      {
        id: "ctgas-dt",
        nome: "CT Gás",
        setorPai: "DiretorTecnico",
        responsavel: "Douglas Santos",
        emailSetor: "ctgas@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8820",
        localizacao: "Diretoria Técnica - CT Gás",
        observacoes: "Câmara Técnica de Gás",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 23,
            nome: "Douglas Santos",
            email: "douglas.santos@agrese.se.gov.br",
            cargo: "Diretor CT Gás",
            telefone: "(79) 99999-0023",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 24,
            nome: "Fernanda Figueiredo",
            email: "fernanda.figueiredo@agrese.se.gov.br",
            cargo: "Técnica CT Gás",
            telefone: "(79) 99999-0024",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "ctsaneamento-dt",
        nome: "CT Saneamento",
        setorPai: "DiretorTecnico",
        responsavel: "José Wellington Leite",
        emailSetor: "ctsaneamento@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8821",
        localizacao: "Diretoria Técnica - CT Saneamento",
        observacoes: "Câmara Técnica de Saneamento",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 25,
            nome: "José Wellington Leite",
            email: "josewellington.leite@agrese.se.gov.br",
            cargo: "Diretor CT Saneamento",
            telefone: "(79) 99999-0025",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 26,
            nome: "Carla Pinheiro",
            email: "carla.pinheiro@agrese.se.gov.br",
            cargo: "Técnica CT Saneamento",
            telefone: "(79) 99999-0026",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
          {
            id: 27,
            nome: "Eryson Vieira",
            email: "eryson.viera@agrese.se.gov.br",
            cargo: "Técnico CT Saneamento",
            telefone: "(79) 99999-0027",
            dataIngresso: new Date("2023-03-01"),
            status: "ativo",
          },
          {
            id: 28,
            nome: "Matheus Silva",
            email: "matheus.silva@agrese.se.gov.br",
            cargo: "Técnico CT Saneamento",
            telefone: "(79) 99999-0028",
            dataIngresso: new Date("2023-04-01"),
            status: "ativo",
          },
        ],
        totalMembros: 4,
        membrosAtivos: 4,
      },
      {
        id: "ctenergia-dt",
        nome: "CT Energia",
        setorPai: "DiretorTecnico",
        responsavel: "Tércio Brito",
        emailSetor: "ctenergia@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8822",
        localizacao: "Diretoria Técnica - CT Energia",
        observacoes: "Câmara Técnica de Energia",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 29,
            nome: "Tércio Brito",
            email: "tercio.brito@agrese.se.gov.br",
            cargo: "Técnico CT Energia",
            telefone: "(79) 99999-0029",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
          {
            id: 30,
            nome: "Elisson Santos",
            email: "elisson.santos@agrese.se.gov.br",
            cargo: "Técnico CT Energia",
            telefone: "(79) 99999-0030",
            dataIngresso: new Date("2023-02-01"),
            status: "ativo",
          },
        ],
        totalMembros: 2,
        membrosAtivos: 2,
      },
      {
        id: "ctloterias-dt",
        nome: "CT Loterias",
        setorPai: "DiretorTecnico",
        responsavel: "Kelly Menendez",
        emailSetor: "ctloterias@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8823",
        localizacao: "Diretoria Técnica - CT Loterias",
        observacoes: "Câmara Técnica de Loterias",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 31,
            nome: "Kelly Menendez",
            email: "kelly.menendez@agrese.se.gov.br",
            cargo: "Técnica CT Loterias",
            telefone: "(79) 99999-0031",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
      {
        id: "cttarifaria-dt",
        nome: "CT Tarifária",
        setorPai: "DiretorTecnico",
        responsavel: "Francisco Pedro Filho",
        emailSetor: "cttarifaria@agrese.se.gov.br",
        telefoneSetor: "(79) 3198-8824",
        localizacao: "Diretoria Técnica - CT Tarifária",
        observacoes: "Câmara Técnica Tarifária",
        dataCriacao: new Date("2023-01-01"),
        membros: [
          {
            id: 32,
            nome: "Francisco Pedro Filho",
            email: "franciscopedro.filho@agrese.se.gov.br",
            cargo: "Diretor CT Tarifária",
            telefone: "(79) 99999-0032",
            dataIngresso: new Date("2023-01-01"),
            status: "ativo",
          },
        ],
        totalMembros: 1,
        membrosAtivos: 1,
      },
    ];
    setSubsetores(mockSubsetores);
  }, []);

  const toggleSetorExpansion = (setorKey: string) => {
    const newExpanded = new Set(expandedSetores);
    if (newExpanded.has(setorKey)) {
      newExpanded.delete(setorKey);
    } else {
      newExpanded.add(setorKey);
    }
    setExpandedSetores(newExpanded);
  };

  const getSubsetoresForSetor = (setorKey: string) => {
    return subsetores.filter((sub) => sub.setorPai === setorKey);
  };

  const filteredSubsetores = subsetores.filter((subsetor) => {
    const matchesSearch =
      subsetor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subsetor.responsavel &&
        subsetor.responsavel.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = true;
    if (filterStatus === "ativos") {
      matchesFilter = subsetor.membrosAtivos > 0;
    } else if (filterStatus === "inativos") {
      matchesFilter = subsetor.membrosAtivos === 0;
    }

    return matchesSearch && matchesFilter;
  });

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
      setSelectedSubsetor(null);
    }
  };

  const handleCreateSetor = (data: SectorFormData) => {
    const newSubsetor: SubsetorData = {
      id: `novo-${Date.now()}`,
      nome: data.name,
      setorPai: "DAF",
      responsavel: "Responsável Padrão",
      emailSetor: "",
      telefoneSetor: "",
      localizacao: "",
      observacoes: "",
      descricao: data.description || "",
      dataCriacao: new Date(),
      membros: [],
      totalMembros: 0,
      membrosAtivos: 0,
    };

    setSubsetores([...subsetores, newSubsetor]);
    setShowSetorForm(false);
    setEditingSubsetor(null);
  };

  const handleEditSetor = (data: SectorFormData) => {
    if (editingSubsetor) {
      const updatedSubsetores = subsetores.map((subsetor) => {
        if (subsetor.id === editingSubsetor.id) {
          return {
            ...subsetor,
            nome: data.name,
            descricao: data.description || "",
          };
        }
        return subsetor;
      });

      setSubsetores(updatedSubsetores);
      setShowSetorForm(false);
      setEditingSubsetor(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (selectedSubsetor) {
      const updatedSubsetores = subsetores.map((subsetor) => {
        if (subsetor.id === selectedSubsetor.id) {
          const filteredMembros = subsetor.membros.filter(
            (user) => user.id.toString() !== userId
          );
          return {
            ...subsetor,
            membros: filteredMembros,
            totalMembros: filteredMembros.length,
            membrosAtivos: filteredMembros.filter(
              (user) => user.status === "ativo"
            ).length,
          };
        }
        return subsetor;
      });

      setSubsetores(updatedSubsetores);

      const updatedSubsetor = updatedSubsetores.find(
        (s) => s.id === selectedSubsetor.id
      );
      if (updatedSubsetor) {
        setSelectedSubsetor(updatedSubsetor);
      }
    }
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
              {totalSetores <= itemsPerSlide ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {setoresArray.map(([setorKey, setor], index) => {
                    const {
                      icon: IconComponent,
                      colors,
                      iconColor,
                    } = getSetorPrincipalIcon(setorKey);
                    const subsetoresDoSetor = getSubsetoresForSetor(setorKey);
                    const totalMembros = subsetoresDoSetor.reduce(
                      (acc, sub) => acc + sub.totalMembros,
                      0
                    );
                    const membrosAtivos = subsetoresDoSetor.reduce(
                      (acc, sub) => acc + sub.membrosAtivos,
                      0
                    );

                    return (
                      <div
                        key={setorKey}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div
                          className={`relative rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-100"
                          }`}
                          onClick={() =>
                            navigate(`/setores/${setorKey.toLowerCase()}`)
                          }
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
                                  <IconComponent
                                    className={`w-10 h-10 ${iconColor} drop-shadow-lg`}
                                  />
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
                                {setor.nome}
                              </h2>

                              <div className="space-y-3 mb-6 w-full">
                                <div
                                  className={`flex items-center justify-center gap-3 rounded-xl p-3 transition-colors duration-300 ${
                                    theme === "dark"
                                      ? "bg-gray-700 group-hover:bg-gray-600"
                                      : "bg-gray-50 group-hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaBuilding className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {subsetoresDoSetor.length} subsetor
                                    {subsetoresDoSetor.length !== 1 ? "es" : ""}
                                  </span>
                                </div>

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
                                    {totalMembros} membro
                                    {totalMembros !== 1 ? "s" : ""}
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
                                    {membrosAtivos} ativo
                                    {membrosAtivos !== 1 ? "s" : ""}
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
                                    <span className="font-semibold">
                                      Gerenciar Setor
                                    </span>
                                    <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {Object.keys(setoresHierarquia).length === 0 && (
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
              ) : (
                <>
                  <button
                    onClick={prevSlide}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 backdrop-blur-sm rounded-full shadow-lg border flex items-center justify-center hover:scale-110 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800/90 border-gray-600 hover:bg-gray-800 text-gray-300"
                        : "bg-white/90 border-gray-200 hover:bg-white text-gray-600"
                    }`}
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 backdrop-blur-sm rounded-full shadow-lg border flex items-center justify-center hover:scale-110 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800/90 border-gray-600 hover:bg-gray-800 text-gray-300"
                        : "bg-white/90 border-gray-200 hover:bg-white text-gray-600"
                    }`}
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>

                  <div
                    className="overflow-hidden rounded-3xl"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${
                          currentSlide * (100 / itemsPerSlide)
                        }%)`,
                        width: `${(totalSetores / itemsPerSlide) * 100}%`,
                      }}
                    >
                      {setoresArray.map(([setorKey, setor], index) => {
                        const {
                          icon: IconComponent,
                          colors,
                          iconColor,
                        } = getSetorPrincipalIcon(setorKey);
                        const subsetoresDoSetor =
                          getSubsetoresForSetor(setorKey);
                        const totalMembros = subsetoresDoSetor.reduce(
                          (acc, sub) => acc + sub.totalMembros,
                          0
                        );
                        const membrosAtivos = subsetoresDoSetor.reduce(
                          (acc, sub) => acc + sub.membrosAtivos,
                          0
                        );

                        return (
                          <div
                            key={setorKey}
                            className="flex-none w-full md:w-1/2 xl:w-1/3 px-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                          >
                            <div
                              className={`relative rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 ${
                                theme === "dark"
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-white border-gray-100"
                              }`}
                              onClick={() =>
                                navigate(`/setores/${setorKey.toLowerCase()}`)
                              }
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
                                      <IconComponent
                                        className={`w-10 h-10 ${iconColor} drop-shadow-lg`}
                                      />
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
                                    {setor.nome}
                                  </h2>

                                  <div className="space-y-3 mb-6 w-full">
                                    <div
                                      className={`flex items-center justify-center gap-3 rounded-xl p-3 transition-colors duration-300 ${
                                        theme === "dark"
                                          ? "bg-gray-700 group-hover:bg-gray-600"
                                          : "bg-gray-50 group-hover:bg-gray-100"
                                      }`}
                                    >
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FaBuilding className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <span
                                        className={`text-sm font-medium ${
                                          theme === "dark"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {subsetoresDoSetor.length} subsetor
                                        {subsetoresDoSetor.length !== 1
                                          ? "es"
                                          : ""}
                                      </span>
                                    </div>

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
                                        {totalMembros} membro
                                        {totalMembros !== 1 ? "s" : ""}
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
                                        {membrosAtivos} ativo
                                        {membrosAtivos !== 1 ? "s" : ""}
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
                                        <span className="font-semibold">
                                          Gerenciar Setor
                                        </span>
                                        <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div
                      className={`w-full rounded-full h-2 mx-auto max-w-xs ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="bg-gradient-to-r from-gray-600 to-gray-700 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            ((currentSlide + 1) / (maxSlides + 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-center space-x-2">
                      {Array.from({ length: maxSlides + 1 }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === index
                              ? "bg-gray-600 scale-125"
                              : theme === "dark"
                              ? "bg-gray-600 hover:bg-gray-500"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>

                    <p
                      className={`text-center text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {currentSlide + 1} de {maxSlides + 1} • Use as setas do
                      teclado ou deslize para navegar
                    </p>
                  </div>
                </>
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
              parentSectors={mockSectorsData}
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
