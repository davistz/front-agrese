import { useState, useEffect } from "react";
import {
  UserData,
  UserRole,
  SectorData,
  UserFormData,
} from "../types/interfaces";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
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
  const { user, canAccessSector } = useAuth();
  const { canCreateUser, canEditUser, canDeleteUser } = usePermissions();
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
      // Presidência
      {
        id: 1,
        email: "luizhamilton.oliveira@agrese.se.gov.br",
        name: "Luiz Hamilton Oliveira",
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
        id: 5,
        email: "roberta.antunes@agrese.se.gov.br",
        name: "Roberta Antunes",
        role: "COLLABORATOR",
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
        lastLogin: new Date("2024-01-14T14:20:00"),
        createdAt: new Date("2023-01-15T08:00:00"),
        updatedAt: new Date("2024-01-14T14:20:00"),
      },
      // TI
      {
        id: 2,
        email: "pablo.cortes@agrese.se.gov.br",
        name: "Pablo Cortes",
        role: "IT_ADMIN",
        sectorId: 2,
        sector: {
          id: 2,
          name: "Tecnologia da Informação",
          description: "Coordenação de TI",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-15T09:45:00"),
        createdAt: new Date("2023-02-01T09:00:00"),
        updatedAt: new Date("2024-01-15T09:45:00"),
      },
      {
        id: 3,
        email: "marcelino.souza@agrese.se.gov.br",
        name: "Marcelino Souza",
        role: "IT_ADMIN",
        sectorId: 2,
        sector: {
          id: 2,
          name: "Tecnologia da Informação",
          description: "Coordenação de TI",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T16:30:00"),
        createdAt: new Date("2023-02-15T10:00:00"),
        updatedAt: new Date("2024-01-14T16:30:00"),
      },
      // Gabinete
      {
        id: 4,
        email: "aline.souza@agrese.se.gov.br",
        name: "Aline Souza",
        role: "MANAGER",
        sectorId: 3,
        sector: {
          id: 3,
          name: "Gabinete",
          description: "Chefia de Gabinete",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T11:15:00"),
        createdAt: new Date("2023-03-01T10:00:00"),
        updatedAt: new Date("2024-01-14T11:15:00"),
      },
      {
        id: 6,
        email: "isabela.grossi@agrese.se.gov.br",
        name: "Isabela Grossi",
        role: "COLLABORATOR",
        sectorId: 3,
        sector: {
          id: 3,
          name: "Gabinete",
          description: "Chefia de Gabinete",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T15:20:00"),
        createdAt: new Date("2023-03-15T11:00:00"),
        updatedAt: new Date("2024-01-13T15:20:00"),
      },
      // Procuradoria
      {
        id: 7,
        email: "danielle.fantim@agrese.se.gov.br",
        name: "Danielle Fantim",
        role: "MANAGER",
        sectorId: 4,
        sector: {
          id: 4,
          name: "Procuradoria",
          description: "Procuradoria Jurídica",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T10:30:00"),
        createdAt: new Date("2023-04-01T12:00:00"),
        updatedAt: new Date("2024-01-14T10:30:00"),
      },
      {
        id: 8,
        email: "bruna.mariana@agrese.se.gov.br",
        name: "Bruna Mariana",
        role: "COLLABORATOR",
        sectorId: 4,
        sector: {
          id: 4,
          name: "Procuradoria",
          description: "Procuradoria Jurídica",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T14:45:00"),
        createdAt: new Date("2023-04-15T13:00:00"),
        updatedAt: new Date("2024-01-13T14:45:00"),
      },
      {
        id: 9,
        email: "luanna.ramos@agrese.se.gov.br",
        name: "Luanna Ramos",
        role: "COLLABORATOR",
        sectorId: 4,
        sector: {
          id: 4,
          name: "Procuradoria",
          description: "Procuradoria Jurídica",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T16:10:00"),
        createdAt: new Date("2023-05-01T14:00:00"),
        updatedAt: new Date("2024-01-12T16:10:00"),
      },
      {
        id: 10,
        email: "james.charles@agrese.se.gov.br",
        name: "James Charles",
        role: "COLLABORATOR",
        sectorId: 4,
        sector: {
          id: 4,
          name: "Procuradoria",
          description: "Procuradoria Jurídica",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-11T13:25:00"),
        createdAt: new Date("2023-05-15T15:00:00"),
        updatedAt: new Date("2024-01-11T13:25:00"),
      },
      // CT Gás
      {
        id: 11,
        email: "douglas.santos@agrese.se.gov.br",
        name: "Douglas Santos",
        role: "MANAGER",
        sectorId: 5,
        sector: {
          id: 5,
          name: "CT Gás",
          description: "Câmara Técnica de Gás",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T09:15:00"),
        createdAt: new Date("2023-06-01T08:00:00"),
        updatedAt: new Date("2024-01-14T09:15:00"),
      },
      {
        id: 12,
        email: "fernanda.figueiredo@agrese.se.gov.br",
        name: "Fernanda Figueiredo",
        role: "COLLABORATOR",
        sectorId: 5,
        sector: {
          id: 5,
          name: "CT Gás",
          description: "Câmara Técnica de Gás",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T11:40:00"),
        createdAt: new Date("2023-06-15T09:00:00"),
        updatedAt: new Date("2024-01-13T11:40:00"),
      },
      // CT Saneamento
      {
        id: 13,
        email: "josewellington.leite@agrese.se.gov.br",
        name: "José Wellington Leite",
        role: "MANAGER",
        sectorId: 6,
        sector: {
          id: 6,
          name: "CT Saneamento",
          description: "Câmara Técnica de Saneamento",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T08:30:00"),
        createdAt: new Date("2023-07-01T10:00:00"),
        updatedAt: new Date("2024-01-14T08:30:00"),
      },
      {
        id: 14,
        email: "carla.pinheiro@agrese.se.gov.br",
        name: "Carla Pinheiro",
        role: "COLLABORATOR",
        sectorId: 6,
        sector: {
          id: 6,
          name: "CT Saneamento",
          description: "Câmara Técnica de Saneamento",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T14:15:00"),
        createdAt: new Date("2023-07-15T11:00:00"),
        updatedAt: new Date("2024-01-13T14:15:00"),
      },
      {
        id: 15,
        email: "eryson.viera@agrese.se.gov.br",
        name: "Eryson Vieira",
        role: "COLLABORATOR",
        sectorId: 6,
        sector: {
          id: 6,
          name: "CT Saneamento",
          description: "Câmara Técnica de Saneamento",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T15:50:00"),
        createdAt: new Date("2023-08-01T12:00:00"),
        updatedAt: new Date("2024-01-12T15:50:00"),
      },
      {
        id: 16,
        email: "matheus.silva@agrese.se.gov.br",
        name: "Matheus Silva",
        role: "COLLABORATOR",
        sectorId: 6,
        sector: {
          id: 6,
          name: "CT Saneamento",
          description: "Câmara Técnica de Saneamento",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-11T10:20:00"),
        createdAt: new Date("2023-08-15T13:00:00"),
        updatedAt: new Date("2024-01-11T10:20:00"),
      },
      // Recursos Humanos
      {
        id: 17,
        email: "lady.diana@agrese.se.gov.br",
        name: "Lady Diana",
        role: "COLLABORATOR",
        sectorId: 7,
        sector: {
          id: 7,
          name: "Recursos Humanos",
          description: "Gestão de Pessoas",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T12:45:00"),
        createdAt: new Date("2023-09-01T14:00:00"),
        updatedAt: new Date("2024-01-14T12:45:00"),
      },
      // Almoxarifado
      {
        id: 18,
        email: "juliocesar.melo@agrese.se.gov.br",
        name: "Júlio César Melo",
        role: "COLLABORATOR",
        sectorId: 8,
        sector: {
          id: 8,
          name: "Almoxarifado",
          description: "Controle de Estoque",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T16:30:00"),
        createdAt: new Date("2023-09-15T15:00:00"),
        updatedAt: new Date("2024-01-13T16:30:00"),
      },
      {
        id: 19,
        email: "marcio.silveira@agrese.se.gov.br",
        name: "Márcio Silveira",
        role: "COLLABORATOR",
        sectorId: 8,
        sector: {
          id: 8,
          name: "Almoxarifado",
          description: "Controle de Estoque",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T09:15:00"),
        createdAt: new Date("2023-10-01T08:00:00"),
        updatedAt: new Date("2024-01-12T09:15:00"),
      },
      {
        id: 20,
        email: "flavia.danielle@agrese.se.gov.br",
        name: "Flávia Danielle",
        role: "COLLABORATOR",
        sectorId: 8,
        sector: {
          id: 8,
          name: "Almoxarifado",
          description: "Controle de Estoque",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-11T14:45:00"),
        createdAt: new Date("2023-10-15T09:00:00"),
        updatedAt: new Date("2024-01-11T14:45:00"),
      },
      // ASCOM
      {
        id: 21,
        email: "ingrid.ferreira@agrese.se.gov.br",
        name: "Ingrid Ferreira",
        role: "COLLABORATOR",
        sectorId: 9,
        sector: {
          id: 9,
          name: "ASCOM",
          description: "Assessoria de Comunicação",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T13:20:00"),
        createdAt: new Date("2023-11-01T10:00:00"),
        updatedAt: new Date("2024-01-14T13:20:00"),
      },
      // CT Energia
      {
        id: 22,
        email: "tercio.brito@agrese.se.gov.br",
        name: "Tércio Brito",
        role: "COLLABORATOR",
        sectorId: 10,
        sector: {
          id: 10,
          name: "CT Energia",
          description: "Câmara Técnica de Energia",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T10:30:00"),
        createdAt: new Date("2023-11-15T11:00:00"),
        updatedAt: new Date("2024-01-13T10:30:00"),
      },
      {
        id: 23,
        email: "elisson.santos@agrese.se.gov.br",
        name: "Elisson Santos",
        role: "COLLABORATOR",
        sectorId: 10,
        sector: {
          id: 10,
          name: "CT Energia",
          description: "Câmara Técnica de Energia",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T15:45:00"),
        createdAt: new Date("2023-12-01T12:00:00"),
        updatedAt: new Date("2024-01-12T15:45:00"),
      },
      // CT Loterias
      {
        id: 24,
        email: "kelly.menendez@agrese.se.gov.br",
        name: "Kelly Menendez",
        role: "COLLABORATOR",
        sectorId: 11,
        sector: {
          id: 11,
          name: "CT Loterias",
          description: "Câmara Técnica de Loterias",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-11T11:15:00"),
        createdAt: new Date("2023-12-15T13:00:00"),
        updatedAt: new Date("2024-01-11T11:15:00"),
      },
      // CT Tarifária
      {
        id: 25,
        email: "franciscopedro.filho@agrese.se.gov.br",
        name: "Francisco Pedro Filho",
        role: "MANAGER",
        sectorId: 12,
        sector: {
          id: 12,
          name: "CT Tarifária",
          description: "Câmara Técnica Tarifária",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T14:30:00"),
        createdAt: new Date("2024-01-01T08:00:00"),
        updatedAt: new Date("2024-01-14T14:30:00"),
      },
      // DAF
      {
        id: 26,
        email: "alexandre.sobral@agrese.se.gov.br",
        name: "Alexandre Sobral",
        role: "MANAGER",
        sectorId: 13,
        sector: {
          id: 13,
          name: "DAF - Diretoria Administrativa Financeira",
          description: "Diretoria Administrativa e Financeira",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T16:45:00"),
        createdAt: new Date("2024-01-15T09:00:00"),
        updatedAt: new Date("2024-01-14T16:45:00"),
      },
      {
        id: 27,
        email: "mariaconceicao.albuquerque@agrese.se.gov.br",
        name: "Maria Conceição Albuquerque",
        role: "COLLABORATOR",
        sectorId: 13,
        sector: {
          id: 13,
          name: "DAF - Diretoria Administrativa Financeira",
          description: "Diretoria Administrativa e Financeira",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T12:20:00"),
        createdAt: new Date("2024-02-01T10:00:00"),
        updatedAt: new Date("2024-01-13T12:20:00"),
      },
      // Diretoria Técnica
      {
        id: 28,
        email: "michaelangel.arcieri@agrese.se.gov.br",
        name: "Michael Angel Arcieri",
        role: "MANAGER",
        sectorId: 14,
        sector: {
          id: 14,
          name: "Diretoria Técnica",
          description: "Área técnica e operacional",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T13:15:00"),
        createdAt: new Date("2024-02-15T11:00:00"),
        updatedAt: new Date("2024-01-14T13:15:00"),
      },
      // Ouvidoria
      {
        id: 29,
        email: "juliana.costa@agrese.se.gov.br",
        name: "Juliana Costa",
        role: "MANAGER",
        sectorId: 15,
        sector: {
          id: 15,
          name: "Ouvidoria",
          description: "Ouvidoria Geral",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T15:30:00"),
        createdAt: new Date("2024-03-01T12:00:00"),
        updatedAt: new Date("2024-01-13T15:30:00"),
      },
      {
        id: 30,
        email: "amandaguimaraes.santana@agrese.se.gov.br",
        name: "Amanda Guimarães Santana",
        role: "COLLABORATOR",
        sectorId: 15,
        sector: {
          id: 15,
          name: "Ouvidoria",
          description: "Ouvidoria Geral",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T10:45:00"),
        createdAt: new Date("2024-03-15T13:00:00"),
        updatedAt: new Date("2024-01-12T10:45:00"),
      },
      {
        id: 31,
        email: "evelyn.bispo@agrese.se.gov.br",
        name: "Evelyn Bispo",
        role: "COLLABORATOR",
        sectorId: 15,
        sector: {
          id: 15,
          name: "Ouvidoria",
          description: "Ouvidoria Geral",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-11T16:20:00"),
        createdAt: new Date("2024-04-01T14:00:00"),
        updatedAt: new Date("2024-01-11T16:20:00"),
      },
      // Licitação
      {
        id: 32,
        email: "ayanneiris.santana@agrese.se.gov.br",
        name: "Ayanne Iris Santana",
        role: "COLLABORATOR",
        sectorId: 16,
        sector: {
          id: 16,
          name: "Licitação",
          description: "Setor de Licitações",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T11:30:00"),
        createdAt: new Date("2024-04-15T15:00:00"),
        updatedAt: new Date("2024-01-14T11:30:00"),
      },
      {
        id: 33,
        email: "muriel.augusta@agrese.se.gov.br",
        name: "Muriel Augusta",
        role: "COLLABORATOR",
        sectorId: 16,
        sector: {
          id: 16,
          name: "Licitação",
          description: "Setor de Licitações",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T09:15:00"),
        createdAt: new Date("2024-05-01T08:00:00"),
        updatedAt: new Date("2024-01-13T09:15:00"),
      },
      // Contabilidade
      {
        id: 34,
        email: "marialucia.dossantos@agrese.se.gov.br",
        name: "Maria Lúcia dos Santos",
        role: "COLLABORATOR",
        sectorId: 17,
        sector: {
          id: 17,
          name: "Contabilidade",
          description: "Setor Contábil",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T14:45:00"),
        createdAt: new Date("2024-05-15T09:00:00"),
        updatedAt: new Date("2024-01-12T14:45:00"),
      },
      {
        id: 35,
        email: "andre.santosoliveira@agrese.se.gov.br",
        name: "André Santos Oliveira",
        role: "COLLABORATOR",
        sectorId: 17,
        sector: {
          id: 17,
          name: "Contabilidade",
          description: "Setor Contábil",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-11T13:20:00"),
        createdAt: new Date("2024-06-01T10:00:00"),
        updatedAt: new Date("2024-01-11T13:20:00"),
      },
      // Compras
      {
        id: 36,
        email: "marcelo.ribeiro@agrese.se.gov.br",
        name: "Marcelo Ribeiro",
        role: "COLLABORATOR",
        sectorId: 18,
        sector: {
          id: 18,
          name: "Compras",
          description: "Setor de Compras",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-14T10:15:00"),
        createdAt: new Date("2024-06-15T11:00:00"),
        updatedAt: new Date("2024-01-14T10:15:00"),
      },
      {
        id: 38,
        email: "aderaldo.barroso@agrese.se.gov.br",
        name: "Aderaldo Barroso",
        role: "COLLABORATOR",
        sectorId: 18,
        sector: {
          id: 18,
          name: "Compras",
          description: "Setor de Compras",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-12T16:40:00"),
        createdAt: new Date("2024-07-15T13:00:00"),
        updatedAt: new Date("2024-01-12T16:40:00"),
      },
      // Controle Interno
      {
        id: 37,
        email: "fatima.luane@agrese.se.gov.br",
        name: "Fátima Luane",
        role: "COLLABORATOR",
        sectorId: 19,
        sector: {
          id: 19,
          name: "Controle Interno",
          description: "Auditoria Interna",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        lastLogin: new Date("2024-01-13T12:30:00"),
        createdAt: new Date("2024-07-01T12:00:00"),
        updatedAt: new Date("2024-01-13T12:30:00"),
      },
    ];

    let filteredUsers = mockUsers;

    if (user?.role === "MANAGER") {
      filteredUsers = mockUsers.filter((u) => u.sectorId === user.sectorId);
    }

    setUsers(filteredUsers);

    const mockSectors: SectorData[] = [
      {
        id: 1,
        name: "Presidência",
        description: "Setor principal da empresa",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Tecnologia da Informação",
        description: "Coordenação de TI",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Gabinete",
        description: "Chefia de Gabinete",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Procuradoria",
        description: "Procuradoria Jurídica",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "CT Gás",
        description: "Câmara Técnica de Gás",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "CT Saneamento",
        description: "Câmara Técnica de Saneamento",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: "Recursos Humanos",
        description: "Gestão de Pessoas",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "Almoxarifado",
        description: "Controle de Estoque",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: "ASCOM",
        description: "Assessoria de Comunicação",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: "CT Energia",
        description: "Câmara Técnica de Energia",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: "CT Loterias",
        description: "Câmara Técnica de Loterias",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        name: "CT Tarifária",
        description: "Câmara Técnica Tarifária",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 13,
        name: "DAF - Diretoria Administrativa Financeira",
        description: "Diretoria Administrativa e Financeira",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 14,
        name: "Diretoria Técnica",
        description: "Área técnica e operacional",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 15,
        name: "Ouvidoria",
        description: "Ouvidoria Geral",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 16,
        name: "Licitação",
        description: "Setor de Licitações",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 17,
        name: "Contabilidade",
        description: "Setor Contábil",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 18,
        name: "Compras",
        description: "Setor de Compras",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 19,
        name: "Controle Interno",
        description: "Auditoria Interna",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setSectors(mockSectors);
  }, [user]);

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
