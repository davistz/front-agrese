import {
  AtividadeModalData,
  ReuniaoModalData,
  DocumentoModalData,
} from "../types/interfaces";

export const convertEventToReuniaoModal = (event: any): ReuniaoModalData => {
  console.log('[convertEventToReuniaoModal] Evento recebido:', event);
  return {
    id: event.id,
    titulo: event.title || event.titulo || "",
    setorResponsavel: event.sector?.name || event.setor || "",
    descricao: event.description || event.desc || "",
    autor: event.creator?.name || event.autor || "",
    dataHoraInicio: event.start ? new Date(event.start) : (event.startDate ? new Date(event.startDate) : new Date()),
    dataHoraTermino: event.end ? new Date(event.end) : (event.endDate ? new Date(event.endDate) : new Date()),
    local: event.location || event.local || "presencial",
    sala: event.sala || "",
    participantes: event.assignees || event.participantes || [],
    status: event.status || "PENDING",
    responsavelAta: event.responsavelAta || "",
    linkReuniao: event.meetingLink || event.linkReuniao || "",
    notificacao: event.notificacao || 30,
  };
};

export const convertReuniaoModalToEvent = (reuniao: ReuniaoModalData): any => {
  return {
    id: reuniao.id,
    title: reuniao.titulo,
    start: reuniao.dataHoraInicio,
    end: reuniao.dataHoraTermino,
    desc: reuniao.descricao,
    autor: reuniao.autor,
    setor: reuniao.setorResponsavel,
    tipo: "reuniao",
    local: reuniao.local,
    sala: reuniao.sala,
    participantes: reuniao.participantes,
    status: reuniao.status,
    responsavelAta: reuniao.responsavelAta,
    linkReuniao: reuniao.linkReuniao,
    notificacao: reuniao.notificacao,
  };
};

export const convertEventToAtividadeModal = (
  event: any
): AtividadeModalData => {
  return {
    id: event.id,
    titulo: event.title || event.titulo || "",
    setorResponsavel: event.sector?.name || event.setor || "",
    descricao: event.description || event.desc || "",
    autor: event.creator?.name || event.autor || "",
    dataInicioPrevista: event.startDate ? new Date(event.startDate) : (event.start ? new Date(event.start) : new Date()),
    prazoFinal: event.endDate ? new Date(event.endDate) : (event.end ? new Date(event.end) : new Date()),
    responsavel: event.responsavel || "",
    status: event.status || "pendente",
    prioridade: event.priority || event.prioridade || "media",
    subtarefas: event.subtarefas || [],
    comentarios: event.comentarios || event.comments || "",
    dataConclusaoReal: event.dataConclusaoReal || null,
  };
};

export const convertAtividadeModalToEvent = (
  atividade: AtividadeModalData
): any => {
  return {
    id: atividade.id,
    title: atividade.titulo,
    start: atividade.dataInicioPrevista,
    end: atividade.prazoFinal,
    desc: atividade.descricao,
    autor: atividade.autor,
    setor: atividade.setorResponsavel,
    tipo: "atividade",
    responsavel: atividade.responsavel,
    status: atividade.status,
    prioridade: atividade.prioridade,
    subtarefas: atividade.subtarefas,
    comentarios: atividade.comentarios,
    dataConclusaoReal: atividade.dataConclusaoReal,
  };
};

export const convertEventToDocumentoModal = (
  event: any
): DocumentoModalData => {
  return {
    id: event.id,
    titulo: event.title || event.titulo || "",
    setorResponsavel: event.sector?.name || event.setor || "",
    descricao: event.description || event.desc || "",
    autor: event.creator?.name || event.autor || "",
    tipoDocumento: event.documentType || event.tipoDocumento || "",
    status: event.documentStatus || event.status || "pendente",
    responsavel: event.responsavel || "",
    dataCriacao: event.startDate ? new Date(event.startDate) : (event.dataCriacao ? new Date(event.dataCriacao) : new Date()),
    prazoAnalise: event.endDate ? new Date(event.endDate) : (event.prazoAnalise ? new Date(event.prazoAnalise) : new Date()),
    dataEnvioRecebimento: event.dataEnvioRecebimento || null,
    observacoes: event.observacoes || "",
  };
};

export const convertDocumentoModalToEvent = (
  documento: DocumentoModalData
): any => {
  return {
    id: documento.id,
    title: documento.titulo,
    start: documento.dataCriacao,
    end: documento.prazoAnalise,
    desc: documento.descricao,
    autor: documento.autor,
    setor: documento.setorResponsavel,
    tipo: "documento",
    tipoDocumento: documento.tipoDocumento,
    status: documento.status,
    responsavel: documento.responsavel,
    dataCriacao: documento.dataCriacao,
    prazoAnalise: documento.prazoAnalise,
    dataEnvioRecebimento: documento.dataEnvioRecebimento,
    observacoes: documento.observacoes,
  };
};

import { AtividadeExternaModalData } from "../types/interfaces";

export const convertEventToAtividadeExternaModal = (
  event: any
): AtividadeExternaModalData => {
  return {
    id: event.id,
    titulo: event.title || "",
    setorResponsavel: event.sector?.name || "",
    descricao: event.description || "",
    autor: event.creator?.name || "",
    dataHoraSaida: event.departureTime ? new Date(event.departureTime) : new Date(),
    dataHoraRetorno: event.returnTime ? new Date(event.returnTime) : new Date(),
    destino: event.destination || "",
  equipeEnvolvida: event.equipeEnvolvida || event.teamInvolved || [],
  status: event.externalStatus || "planejada",
    meioTransporte: event.transportMode || "",
  };
};

export const convertAtividadeExternaModalToEvent = (
  atividade: AtividadeExternaModalData
): any => {
  return {
    id: atividade.id,
    title: atividade.titulo,
    start: atividade.dataHoraSaida,
    end: atividade.dataHoraRetorno,
    desc: atividade.descricao,
    autor: atividade.autor,
    setor: atividade.setorResponsavel,
    tipo: "atividades-externas",
    destino: atividade.destino,
    equipeEnvolvida: atividade.equipeEnvolvida,
    status: atividade.status,
    meioTransporte: atividade.meioTransporte,
  };
};
