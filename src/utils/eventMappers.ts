import {
  ReuniaoFormData,
  AtividadeFormData,
  ReuniaoModalData,
  MeetingFormData,
  ActivityFormData,
  MeetingModalData,
  MeetingStatus,
  ActivityStatus,
  ExternalActivityStatus,
  DocumentStatus,
  DocumentType,
  Priority,
} from "../types/interfaces";

export const mapReuniaoToMeeting = (
  reuniao: ReuniaoFormData
): MeetingFormData => {
  const statusMap: Record<string, MeetingStatus> = {
    agendada: "SCHEDULED",
    realizada: "COMPLETED",
    cancelada: "CANCELLED",
  };

  return {
    title: reuniao.titulo,
    description: reuniao.descricao,
    type: "MEETING",
    priority: "MEDIUM",
    status: "PENDING",
    startDate: reuniao.dataHoraInicio,
    endDate: reuniao.dataHoraTermino,
    isAllDay: false,
    location: reuniao.local === "presencial" ? "Sala de Reunião" : "Virtual",
    sectorId: 1,
    creatorId: 1,
    meetingStatus: statusMap[reuniao.status] || "SCHEDULED",
    meetingType: reuniao.local === "virtual" ? "virtual" : "presencial",
    meetingLink: reuniao.linkReuniao,
    meetingMinutes: reuniao.responsavelAta,
    participants: [],
  };
};

export const mapMeetingToReuniao = (
  meeting: MeetingFormData
): ReuniaoFormData => {
  const statusMap: Record<MeetingStatus, string> = {
    SCHEDULED: "agendada",
    ONGOING: "agendada",
    COMPLETED: "realizada",
    CANCELLED: "cancelada",
  };

  return {
    titulo: meeting.title,
    setorResponsavel: "Setor Padrão",
    descricao: meeting.description || "",
    autor: "Autor Padrão",
    dataHoraInicio: meeting.startDate,
    dataHoraTermino: meeting.endDate || meeting.startDate,
    local: meeting.meetingType === "virtual" ? "virtual" : "presencial",
    participantes: [],
    status: statusMap[meeting.meetingStatus] as any,
    responsavelAta: meeting.meetingMinutes || "",
    linkReuniao: meeting.meetingLink || "",
    notificacao: 30,
  };
};

export const mapAtividadeToActivity = (
  atividade: AtividadeFormData
): ActivityFormData => {
  const statusMap: Record<string, ActivityStatus> = {
    pendente: "PENDING",
    "em-andamento": "IN_PROGRESS",
    concluida: "COMPLETED",
    atrasada: "OVERDUE",
  };

  const priorityMap: Record<string, Priority> = {
    baixa: "LOW",
    media: "MEDIUM",
    alta: "HIGH",
  };

  return {
    title: atividade.titulo,
    description: atividade.descricao,
    type: "ACTIVITY",
    priority: priorityMap[atividade.prioridade] || "MEDIUM",
    status: "PENDING",
    startDate: atividade.dataInicio || new Date(),
    endDate: atividade.dataFim || undefined,
    isAllDay: false,
    sectorId: 1,
    creatorId: 1,
    activityStatus: statusMap[atividade.status],
    completedDate: atividade.dataConclusaoReal || undefined,
    assignees: [],
    subtasks: atividade.subtarefas,
    comments: atividade.comentarios,
  };
};

export const mapReuniaoModalToMeetingModal = (
  reuniao: ReuniaoModalData
): MeetingModalData => {
  const statusMap: Record<string, MeetingStatus> = {
    agendada: "SCHEDULED",
    realizada: "COMPLETED",
    cancelada: "CANCELLED",
  };

  return {
    id: reuniao.id,
    title: reuniao.titulo,
    description: reuniao.descricao,
    type: "MEETING",
    priority: "MEDIUM",
    status: "PENDING",
    startDate: reuniao.dataHoraInicio,
    endDate: reuniao.dataHoraTermino,
    isAllDay: false,
    location: reuniao.local === "presencial" ? "Sala de Reunião" : "Virtual",
    sectorId: 1,
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    meetingStatus: statusMap[reuniao.status] || "SCHEDULED",
    meetingType: reuniao.local === "virtual" ? "virtual" : "presencial",
    meetingLink: reuniao.linkReuniao,
    meetingMinutes: reuniao.responsavelAta,
    participants: reuniao.participantes.map((p, index) => ({
      id: index + 1,
      externalName: p,
      isRequired: false,
      hasConfirmed: false,
    })),
  };
};

export const mapMeetingModalToReuniaoModal = (
  meeting: MeetingModalData
): ReuniaoModalData => {
  const statusMap: Record<MeetingStatus, string> = {
    SCHEDULED: "agendada",
    ONGOING: "agendada",
    COMPLETED: "realizada",
    CANCELLED: "cancelada",
  };

  return {
    id: meeting.id,
    titulo: meeting.title,
    setorResponsavel: "Setor Padrão",
    descricao: meeting.description || "",
    autor: "Autor Padrão",
    dataHoraInicio: meeting.startDate,
    dataHoraTermino: meeting.endDate || meeting.startDate,
    local: meeting.meetingType === "virtual" ? "virtual" : "presencial",
    participantes: meeting.participants.map(
      (p) => p.externalName || `Participante ${p.id}`
    ),
    status: statusMap[meeting.meetingStatus] as any,
    responsavelAta: meeting.meetingMinutes || "",
    linkReuniao: meeting.meetingLink || "",
    notificacao: 30,
  };
};

export const convertLegacyStatus = (
  oldStatus: string,
  type: "meeting" | "activity" | "external" | "document"
) => {
  switch (type) {
    case "meeting":
      const meetingMap: Record<string, MeetingStatus> = {
        agendada: "SCHEDULED",
        realizada: "COMPLETED",
        cancelada: "CANCELLED",
      };
      return meetingMap[oldStatus] || "SCHEDULED";

    case "activity":
      const activityMap: Record<string, ActivityStatus> = {
        pendente: "PENDING",
        "em-andamento": "IN_PROGRESS",
        concluida: "COMPLETED",
        atrasada: "OVERDUE",
      };
      return activityMap[oldStatus] || "PENDING";

    case "external":
      const externalMap: Record<string, ExternalActivityStatus> = {
        planejada: "PLANNED",
        "em-execucao": "IN_EXECUTION",
        realizada: "COMPLETED",
        cancelada: "CANCELLED",
      };
      return externalMap[oldStatus] || "PLANNED";

    case "document":
      const documentMap: Record<string, DocumentStatus> = {
        pendente: "PENDING",
        "em-analise": "UNDER_REVIEW",
        assinado: "SIGNED",
        enviado: "SENT",
        arquivado: "ARCHIVED",
      };
      return documentMap[oldStatus] || "PENDING";

    default:
      return "PENDING";
  }
};

export const convertLegacyPriority = (oldPriority: string): Priority => {
  const priorityMap: Record<string, Priority> = {
    baixa: "LOW",
    media: "MEDIUM",
    alta: "HIGH",
  };
  return priorityMap[oldPriority] || "MEDIUM";
};

export const convertLegacyDocumentType = (oldType: string): DocumentType => {
  const typeMap: Record<string, DocumentType> = {
    oficio: "OFICIO",
    relatorio: "RELATORIO",
    memorando: "MEMORANDO",
    portaria: "PORTARIA",
    decreto: "DECRETO",
    contrato: "CONTRATO",
    ata: "ATA",
    parecer: "PARECER",
  };
  return typeMap[oldType.toLowerCase()] || "OUTROS";
};
