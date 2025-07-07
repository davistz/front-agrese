const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const day = today.getDate();

export const eventosPadrao = [
  {
    id: 1,
    title: "Teste",
    start: new Date(year, month, day, 10, 0),
    end: new Date(year, month, day, 12, 0),
    desc: "Primeiro evento",
    autor: "Pedro Silva",
    setor: "Diretoria",
    tipo: "Atividade",
  },
  {
    id: 2,
    title: "Teste 2",
    start: new Date(year, month, day, 14, 0),
    end: new Date(year, month, day, 16, 0),
    desc: "Segundo evento",
    setor: "Tecnologia",
    autor: "João Melo",
    tipo: "Reunião",
  },
];
