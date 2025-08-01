const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const day = today.getDate();

export const eventosPadrao = [
  {
    id: 1,
    title: "Atividade",
    start: new Date(year, month, day, 10, 0),
    end: new Date(year, month, day, 12, 0),
    desc: "Primeiro evento",
    autor: "Pedro Silva",
    setor: "DiretorTecnico",
    tipo: "atividade",
  },
  {
    id: 2,
    title: "Reunião",
    start: new Date(year, month, day, 14, 0),
    end: new Date(year, month, day, 16, 0),
    desc: "Segundo evento",
    setor: "DAF",
    autor: "João Melo",
    tipo: "reuniao",
  },
  {
    id: 3,
    title: "Documento",
    start: new Date(year, month, day, 14, 0),
    end: new Date(year, month, day, 16, 0),
    desc: "Terceiro evento",
    setor: "Presidente",
    autor: "João Melo",
    tipo: "documento",
  },
  {
    id: 4,
    title: "Atividade Externa",
    start: new Date(year, month, day, 14, 0),
    end: new Date(year, month, day, 16, 0),
    desc: "Quarto evento",
    setor: "DAF",
    autor: "João Melo",
    tipo: "atividades-externas",
  },
];
