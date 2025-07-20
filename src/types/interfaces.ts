export interface BaseEventFormData {
  titulo: string;
  setorResponsavel: string;
  descricao: string;
  autor: string;
  dataInicio: Date | null;
  dataFim: Date | null;
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
  anexos: File[];
  notificacao: number;
}

export interface AtividadeFormData extends BaseEventFormData {
  dataInicioPrevista: Date | null;
  prazoFinal: Date | null;
  responsavel: string;
  status: "pendente" | "em-andamento" | "concluida" | "atrasada";
  prioridade: "baixa" | "media" | "alta";
  subtarefas: string[];
  comentarios: string;
  anexos: File[];
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
  anexos: File[];
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
  arquivo: File | null;
  observacoes: string;
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
  anexos: File[];
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
  anexos: File[];
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
  anexos: File[];
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
  arquivo: File | null;
  observacoes: string;
}
