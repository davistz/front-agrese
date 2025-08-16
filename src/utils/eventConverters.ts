import {
  AtividadeModalData,
  ReuniaoModalData,
  DocumentoModalData,
} from "../types/interfaces";

export const convertEventToReuniaoModal = (event: any): ReuniaoModalData => {
  return {
    id: event.id,
    titulo: event.title || "",
    setorResponsavel: event.setor || "",
    descricao: event.desc || "",
    autor: event.autor || "",
    dataHoraInicio: event.start || new Date(),
    dataHoraTermino: event.end || new Date(),
    local: event.local || "presencial",
    sala: event.sala || "",
    participantes: event.participantes || [],
    status: event.status || "agendada",
    responsavelAta: event.responsavelAta || "",
    linkReuniao: event.linkReuniao || "",
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
    titulo: event.title || "",
    setorResponsavel: event.setor || "",
    descricao: event.desc || "",
    autor: event.autor || "",
    dataInicioPrevista: event.start || new Date(),
    prazoFinal: event.end || new Date(),
    responsavel: event.responsavel || "",
    status: event.status || "pendente",
    prioridade: event.prioridade || "media",
    subtarefas: event.subtarefas || [],
    comentarios: event.comentarios || "",
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
    titulo: event.title || "",
    setorResponsavel: event.setor || "",
    descricao: event.desc || "",
    autor: event.autor || "",
    tipoDocumento: event.tipoDocumento || "",
    status: event.status || "pendente",
    responsavel: event.responsavel || "",
    dataCriacao: event.dataCriacao || new Date(),
    prazoAnalise: event.prazoAnalise || new Date(),
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
    setorResponsavel: event.setor || "",
    descricao: event.desc || "",
    autor: event.autor || "",
    dataHoraSaida: event.start || new Date(),
    dataHoraRetorno: event.end || new Date(),
    destino: event.destino || "",
    responsavel: event.responsavel || "",
    equipeEnvolvida: event.equipeEnvolvida || [],
    status: event.status || "planejada",
    motivoAtividade: event.motivoAtividade || "",
    meioTransporte: event.meioTransporte || "",
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
    responsavel: atividade.responsavel,
    equipeEnvolvida: atividade.equipeEnvolvida,
    status: atividade.status,
    motivoAtividade: atividade.motivoAtividade,
    meioTransporte: atividade.meioTransporte,
  };
};
