export type EventType =
  | "MEETING"
  | "ACTIVITY"
  | "EXTERNAL_ACTIVITY"
  | "DOCUMENT"
  | "TASK"
  | "APPOINTMENT";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type EventStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";
export type MeetingStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type ActivityStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUE";
export type ExternalActivityStatus =
  | "PLANNED"
  | "IN_EXECUTION"
  | "COMPLETED"
  | "CANCELLED";
export type DocumentStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "SIGNED"
  | "SENT"
  | "ARCHIVED";
export type DocumentType =
  | "OFICIO"
  | "RELATORIO"
  | "MEMORANDO"
  | "PORTARIA"
  | "DECRETO"
  | "CONTRATO"
  | "ATA"
  | "PARECER"
  | "OUTROS";

export interface EventFormData {
  title: string;
  description?: string;
  type: EventType;
  priority: Priority;
  status: EventStatus;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  location?: string;
  sectorId: number;
  creatorId: number;
  comments?: string;
}

export interface MeetingFormData extends EventFormData {
  type: "MEETING";
  meetingStatus: MeetingStatus;
  meetingLink?: string;
  meetingType: "presencial" | "virtual" | "hibrida";
  meetingMinutes?: string;
  meetingAgenda?: string;
  participants: number[];
}

export interface ActivityFormData extends EventFormData {
  type: "ACTIVITY";
  activityStatus?: ActivityStatus;
  completedDate?: Date;
  assignees: number[];
  subtasks: string[];
}

export interface ExternalActivityFormData extends EventFormData {
  type: "EXTERNAL_ACTIVITY";
  externalStatus: ExternalActivityStatus;
  destination: string;
  departureTime: Date;
  returnTime: Date;
  transportMode?: string;
  activityReason: string;
  assignees: number[];
}

export interface DocumentFormData extends EventFormData {
  type: "DOCUMENT";
  documentStatus: DocumentStatus;
  documentType: DocumentType;
  documentOrigin?: string;
  documentNumber?: string;
  analysisDeadline?: Date;
  sentDate?: Date;
  receivedDate?: Date;
  assignees: number[];
}

export interface ReuniaoFormData {
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataHoraInicio: Date;
  dataHoraTermino: Date;
  local: "presencial" | "virtual";
  participantes: string[];
  status: "agendada" | "realizada" | "cancelada";
  responsavelAta: string;
  linkReuniao: string;
  notificacao: number;
}

export interface AtividadeFormData {
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataInicio: Date | null;
  dataFim: Date | null;
  dataInicioPrevista: Date | null;
  prazoFinal: Date | null;
  responsavel: string;
  status: "pendente" | "em-andamento" | "concluida" | "atrasada";
  prioridade: "baixa" | "media" | "alta";
  subtarefas: string[];
  comentarios: string;
  dataConclusaoReal: Date | null;
}

export interface AtividadeExternaFormData {
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataHoraSaida: Date;
  dataHoraRetorno: Date;
  destino: string;
  responsavel: string;
  equipeEnvolvida: string[];
  status: "planejada" | "em-execucao" | "realizada" | "cancelada";
  motivoAtividade: string;
  meioTransporte?: string;
}

export interface DocumentoFormData {
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  tipoDocumento: string;
  status: "pendente" | "em-analise" | "assinado" | "enviado" | "arquivado";
  responsavel: string;
  dataCriacao: Date;
  prazoAnalise: Date;
  dataEnvioRecebimento: Date | null;
  observacoes: string;
}

export interface EventModalData {
  id: number;
  title: string;
  description?: string;
  type: EventType;
  priority: Priority;
  status: EventStatus;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  location?: string;
  sectorId: number;
  creatorId: number;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingModalData extends EventModalData {
  type: "MEETING";
  meetingStatus: MeetingStatus;
  meetingLink?: string;
  meetingType: "presencial" | "virtual" | "hibrida";
  meetingMinutes?: string;
  meetingAgenda?: string;
  participants: Array<{
    id: number;
    userId?: number;
    sectorId?: number;
    externalName?: string;
    externalEmail?: string;
    isRequired: boolean;
    hasConfirmed: boolean;
  }>;
}

export interface ActivityModalData extends EventModalData {
  type: "ACTIVITY";
  activityStatus?: ActivityStatus;
  completedDate?: Date;
  assignees: Array<{
    id: number;
    userId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  subtasks: Array<{
    id: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    order: number;
  }>;
}

export interface ExternalActivityModalData extends EventModalData {
  type: "EXTERNAL_ACTIVITY";
  externalStatus: ExternalActivityStatus;
  destination: string;
  departureTime: Date;
  returnTime: Date;
  transportMode?: string;
  activityReason: string;
  assignees: Array<{
    id: number;
    userId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}

export interface DocumentModalData extends EventModalData {
  type: "DOCUMENT";
  documentStatus: DocumentStatus;
  documentType: DocumentType;
  documentOrigin?: string;
  documentNumber?: string;
  analysisDeadline?: Date;
  sentDate?: Date;
  receivedDate?: Date;
  assignees: Array<{
    id: number;
    userId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}

export interface ReuniaoModalData {
  id: number;
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataHoraInicio: Date;
  dataHoraTermino: Date;
  local: "presencial" | "virtual";
  participantes: string[];
  status: "agendada" | "realizada" | "cancelada";
  responsavelAta: string;
  linkReuniao: string;
  notificacao: number;
}

export interface AtividadeModalData {
  id: number;
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataInicioPrevista: Date;
  prazoFinal: Date;
  responsavel: string;
  status: "pendente" | "em-andamento" | "concluida" | "atrasada";
  prioridade: "baixa" | "media" | "alta";
  subtarefas: string[];
  comentarios: string;
  dataConclusaoReal: Date | null;
}

export interface AtividadeExternaModalData {
  id: number;
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataHoraSaida: Date;
  dataHoraRetorno: Date;
  destino: string;
  responsavel: string;
  equipeEnvolvida: string[];
  status: "planejada" | "em-execucao" | "realizada" | "cancelada";
  motivoAtividade: string;
  meioTransporte: string;
}

export interface DocumentoModalData {
  id: number;
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  tipoDocumento: string;
  status: "pendente" | "em-analise" | "assinado" | "enviado" | "arquivado";
  responsavel: string;
  dataCriacao: Date;
  prazoAnalise: Date;
  dataEnvioRecebimento: Date | null;
  observacoes: string;
}

export type UserRole = "ADMIN" | "MANAGER" | "COLLABORATOR" | "IT_ADMIN";

export interface SectorData {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  manager?: SectorData;
  subSectors?: SectorData[];
  users: UserData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SectorFormData {
  name: string;
  description?: string;
  managerId?: number;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  sectorId: number;
  sector?: SectorData;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFormData {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  sectorId: number;
  isActive: boolean;
}

export interface SectorModalData {
  id: string;
  name: string;
  description?: string;
  managerId?: number;
  manager?: {
    id: number;
    name: string;
  };
  subSectors: Array<{
    id: number;
    name: string;
    description?: string;
    _count: {
      users: number;
    };
  }>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  }>;
  _count: {
    users: number;
    subSectors: number;
    events: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function convertSubsetorToSector(subsetor: SubsetorData): SectorData {
  return {
    id: parseInt(subsetor.id.replace(/\D/g, "")) || Date.now(),
    name: subsetor.nome,
    description: subsetor.descricao || subsetor.observacoes,
    managerId: undefined,
    users: subsetor.membros.map((membro) => ({
      id: membro.id,
      email: membro.email,
      name: membro.nome,
      role: "COLLABORATOR" as UserRole,
      sectorId: parseInt(subsetor.id.replace(/\D/g, "")) || Date.now(),
      isActive: membro.status === "ativo",
      createdAt: membro.dataIngresso,
      updatedAt: membro.dataIngresso,
    })),
    createdAt: subsetor.dataCriacao,
    updatedAt: subsetor.dataCriacao,
  };
}

export function convertSubsetorToSectorModal(
  subsetor: SubsetorData
): SectorModalData {
  return {
    id: String(parseInt(subsetor.id.replace(/\D/g, "")) || Date.now()),
    name: subsetor.nome,
    description: subsetor.descricao || subsetor.observacoes,
    managerId: undefined,
    manager: undefined,
    subSectors: [],
    users: subsetor.membros.map((membro) => ({
      id: membro.id,
      name: membro.nome,
      email: membro.email,
      role: "COLLABORATOR" as UserRole,
      isActive: membro.status === "ativo",
    })),
    _count: {
      users: subsetor.totalMembros,
      subSectors: 0,
      events: 0,
    },
    createdAt: subsetor.dataCriacao,
    updatedAt: subsetor.dataCriacao,
  };
}

export interface SetorFormData {
  nome: string;
  descricao: string;
  responsavel: string;
  emailSetor?: string;
  telefoneSetor?: string;
  localizacao?: string;
  orcamento?: number;
  observacoes?: string;
}

export interface MembroFormData {
  nome: string;
  email: string;
  cargo: string;
  telefone: string;
  setorId: string;
}

export interface MembroSetor {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  telefone: string;
  dataIngresso: Date;
  status: "ativo" | "inativo" | "licenca";
}

export interface MembroFormProps {
  setorId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export interface SetorModalData {
  id: string;
  nome: string;
  responsavel?: string;
  observacoes?: string;
  orcamento?: number;
  emailSetor?: string;
  telefoneSetor?: string;
  localizacao?: string;
  descricao: string;
  dataCriacao: Date;
  membros: MembroSetor[];
  totalMembros: number;
  membrosAtivos: number;
}

export interface SetorHierarquia {
  nome: string;
  subsetores: string[];
}

export interface SubsetorData {
  id: string;
  nome: string;
  setorPai: string;
  responsavel?: string;
  emailSetor?: string;
  orcamento?: number;
  telefoneSetor?: string;
  localizacao?: string;
  observacoes?: string;
  descricao?: string;
  dataCriacao: Date;
  membros: MembroSetor[];
  totalMembros: number;
  membrosAtivos: number;
}
