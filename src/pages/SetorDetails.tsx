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

  const setoresHierarquia: { [key: string]: SetorHierarquia } = {
    presidente: {
      nome: "Presidência",
      subsetores: [
        "Procuradoria",
        "Conselho Superior",
        "Gabinete",
        "Ouvidoria",
        "ASCOM",
      ],
    },
    daf: {
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
    diretortecnico: {
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
    const mockSubsetores: SubsetorData[] = [
      // Subsetores da Presidência
      {
        id: "procuradoria-pres",
        nome: "Procuradoria",
        setorPai: "presidente",
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
        setorPai: "presidente",
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
        setorPai: "presidente",
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
        setorPai: "presidente",
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
      // Subsetores do DAF
      {
        id: "ti-daf",
        nome: "T.I",
        setorPai: "daf",
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
        setorPai: "daf",
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
        setorPai: "daf",
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
        setorPai: "daf",
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
        setorPai: "daf",
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
        setorPai: "daf",
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
      // Subsetores da Diretoria Técnica
      {
        id: "ctgas-dt",
        nome: "CT Gás",
        setorPai: "diretortecnico",
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
        setorPai: "diretortecnico",
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
        setorPai: "diretortecnico",
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
        setorPai: "diretortecnico",
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
        setorPai: "diretortecnico",
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

  const handleDeleteUser = (userId: string) => {
    // Encontrar o usuário no subsetor atual
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

      // Atualizar o selectedSubsetor também
      const updatedSubsetor = updatedSubsetores.find(
        (s) => s.id === selectedSubsetor.id
      );
      if (updatedSubsetor) {
        setSelectedSubsetor(updatedSubsetor);
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubsetorForMembro(subsetor.id);
                                  setShowMembroForm(true);
                                }}
                                className={`p-2 text-purple-600 hover:text-purple-800 rounded-lg transition-colors ${
                                  theme === "dark"
                                    ? "hover:bg-purple-900/20"
                                    : "hover:bg-purple-50"
                                }`}
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
                    className={`p-6 transition-colors cursor-pointer group border-2 border-dashed hover:border-blue-400 ${
                      theme === "dark"
                        ? "hover:bg-gray-700 border-gray-600"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => setShowSetorForm(true)}
                  >
                    <div
                      className={`flex items-center justify-center gap-4 group-hover:text-blue-600 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-blue-900/20 group-hover:to-purple-900/20"
                            : "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-purple-50"
                        }`}
                      >
                        <FaPlus
                          className={`w-6 h-6 group-hover:text-blue-600 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          Adicionar Novo Subsetor
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
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
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};
