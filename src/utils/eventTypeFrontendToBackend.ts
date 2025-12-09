// Mapeamento dos tipos do frontend para o enum do backend
export const eventTypeFrontendToBackend: Record<string, string> = {
  reuniao: "MEETING",
  "reuniao-direx": "MEETING",
  atividade: "ACTIVITY",
  "atividades-externas": "EXTERNAL_ACTIVITY",
  documento: "DOCUMENT",
};
