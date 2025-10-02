import { useState, useEffect } from "react";
import { setorNomeParaId } from "../../../../src/utils/setorNomeParaId";
import { useRef } from "react";
import { sectorServices } from "../../../services/sectorsServices";
import { ReuniaoFormData } from "../../../types/interfaces";
import { useTheme } from "../../../contexts/ThemeContext";
import { useEvents } from "../../../contexts/EventsContext";
import { RoomConflictWarning } from "../../RoomConflictWarning";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUserCircle } from "react-icons/fa";

interface ReuniaoFormProps {
  initialData?: any;
  onSubmit: (data: ReuniaoFormData) => void;
  onCancel: () => void;
  isDirex?: boolean;
}

export const ReuniaoForm: React.FC<ReuniaoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isDirex = false,
}) => {
  const { theme } = useTheme();
  const { checkRoomConflict, getRoomConflictingEvents } = useEvents();
  const [formData, setFormData] = useState<ReuniaoFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.sector?.id || "",
    descricao: initialData?.description  || "",
    autor: initialData?.local  || "",
    dataHoraInicio: initialData?.startDate  || new Date(),
    dataHoraTermino: initialData?.endtDate  || new Date(),
    local: initialData?.local || "presencial",
    sala: initialData?.sala || "",
    participantes: initialData?.participantes || [],
    status: initialData?.status || "agendada",
    responsavelAta: initialData?.responsavelAta || "",
    linkReuniao: initialData?.meetingLink  || "",
    notificacao: initialData?.notificacao || 30,
  });

  const [novoParticipante, setNovoParticipante] = useState("");
  const [roomConflictingEvents, setRoomConflictingEvents] = useState<any[]>([]);
  const [setores, setSetores] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await sectorServices.getSectors();
        if (Array.isArray(data)) {
          setSetores(data.map((s: any) => ({ id: s.id, name: s.name })));
        }
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setSetores([]);
      }
    };
    fetchSectors();
  }, []);

  useEffect(() => {
    if (
      formData.local === "presencial" &&
      formData.sala &&
      formData.dataHoraInicio &&
      formData.dataHoraTermino
    ) {
      const conflictingEvents = getRoomConflictingEvents(
        formData.dataHoraInicio,
        formData.dataHoraTermino,
        formData.sala,
        initialData?.id
      );
      setRoomConflictingEvents(conflictingEvents);
    } else {
      setRoomConflictingEvents([]);
    }
  }, [
    formData.local,
    formData.sala,
    formData.dataHoraInicio,
    formData.dataHoraTermino,
    getRoomConflictingEvents,
    initialData?.id,
  ]);

  const handleAddParticipante = () => {
    if (novoParticipante.trim()) {
      setFormData((prev) => ({
        ...prev,
        participantes: [...prev.participantes, novoParticipante.trim()],
      }));
      setNovoParticipante("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.local === "presencial" &&
      formData.sala &&
      formData.sala.trim() !== ""
    ) {
      const hasRoomConflict = checkRoomConflict(
        formData.dataHoraInicio,
        formData.dataHoraTermino,
        formData.sala,
        initialData?.id
      );

      console.log("Verificando conflito de sala:", {
        sala: formData.sala,
        inicio: formData.dataHoraInicio,
        fim: formData.dataHoraTermino,
        conflito: hasRoomConflict,
      });

      if (hasRoomConflict) {
        alert(
          "⚠️ CONFLITO DE SALA DETECTADO!\n\n" +
            "A sala selecionada já está ocupada neste horário. " +
            "Por favor, escolha outro horário ou outra sala.\n\n" +
            "Consulte os eventos conflitantes abaixo do formulário."
        );
        return;
      }
    }

    let setorId = formData.setorResponsavel;
    if (typeof setorId === "string" && isNaN(Number(setorId))) {
      const mapped = setorNomeParaId[setorId.toLowerCase()] || "";
      setorId = mapped !== "" ? String(mapped) : "";
    }
    const dataToSend = {
      ...formData,
      setorResponsavel: setorId,
    };

    onSubmit(dataToSend);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/25" onClick={onCancel}></div>

        <section
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {isDirex ? "Nova Reunião Direx" : "Nova Reunião"}
                </h2>
                {isDirex && (
                  <div className="mt-2 px-3 py-2 bg-red-100 border border-red-300 rounded-md">
                    <p className="text-sm text-red-800 font-medium">
                      🏛️ Reunião da Diretoria Executiva - Acesso Restrito
                    </p>
                  </div>
                )}
                <p
                  className={`mt-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {isDirex
                    ? "Preencha os detalhes da reunião da Diretoria Executiva"
                    : "Preencha os detalhes da reunião"}
                </p>
              </div>

              <button
                onClick={onCancel}
                className={`ml-4 p-2 rounded-lg hover:bg-opacity-80 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Título da Reunião
                    </label>
                    <input
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          titulo: e.target.value,
                        }))
                      }
                      placeholder="Título da Reunião"
                      type="text"
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Setor Responsável
                    </label>
                    <select
                      value={formData.setorResponsavel}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          setorResponsavel: e.target.value,
                        }));
                      }}
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Selecione o setor</option>
                      {setores.map((setor) => (
                        <option key={setor.id} value={setor.id}>{setor.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    placeholder="Descrição da reunião"
                    className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Local
                    </label>
                    <select
                      value={formData.local}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          local: e.target.value as "presencial" | "virtual",
                        }))
                      }
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as
                            | "agendada"
                            | "realizada"
                            | "cancelada",
                        }))
                      }
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="PENDING">Agendada</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="COMPLETED">Realizada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Data/Hora Início
                    </label>
                    <DatePicker
                      selected={formData.dataHoraInicio}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dataHoraInicio: date || new Date(),
                        }))
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Data/Hora Término
                    </label>
                    <DatePicker
                      selected={formData.dataHoraTermino}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dataHoraTermino: date || new Date(),
                        }))
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Participantes
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        value={novoParticipante}
                        onChange={(e) => setNovoParticipante(e.target.value)}
                        placeholder="Adicionar participante"
                        className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddParticipante}
                        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                          theme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        Adicionar
                      </button>
                    </div>

                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {formData.participantes.map((participante, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-md mb-1 ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-[#eaeaea] text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FaUserCircle
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            />
                            <span className="text-[15px]">{participante}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                participantes: prev.participantes.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                            className="text-[13px] text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {formData.local === "virtual" && (
                  <div>
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Link da Reunião
                    </label>
                    <input
                      value={formData.linkReuniao}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          linkReuniao: e.target.value,
                        }))
                      }
                      placeholder="Link da reunião virtual"
                      type="url"
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                )}

                {formData.local === "presencial" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Sala de Reunião
                    </label>
                    <select
                      value={formData.sala || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sala: e.target.value,
                        }))
                      }
                      className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Selecione uma sala</option>
                      <option value="auditorio">🎭 Auditório</option>
                      <option value="sala-reuniao">🏢 Sala de Reunião</option>
                      <option value="sala-multiuso">🎯 Sala Multiuso</option>
                    </select>

                    {formData.sala && (
                      <div
                        className={`mt-2 p-3 rounded-lg ${
                          theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-blue-800"
                          }`}
                        >
                          📍 Local selecionado:{" "}
                          {formData.sala === "auditorio"
                            ? "Auditório"
                            : formData.sala === "sala-reuniao"
                            ? "Sala de Reunião"
                            : formData.sala === "sala-multiuso"
                            ? "Sala Multiuso"
                            : ""}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-blue-600"
                          }`}
                        >
                          {formData.sala === "auditorio" &&
                            "Capacidade: até 100 pessoas | Equipamentos: projetor, som, microfone"}
                          {formData.sala === "sala-reuniao" &&
                            "Capacidade: até 20 pessoas | Equipamentos: TV, quadro branco"}
                          {formData.sala === "sala-multiuso" &&
                            "Capacidade: até 50 pessoas | Equipamentos: flexível conforme necessidade"}
                        </p>
                      </div>
                    )}

                    {formData.local === "presencial" &&
                      formData.sala &&
                      roomConflictingEvents.length > 0 && (
                        <RoomConflictWarning
                          conflictingEvents={roomConflictingEvents}
                          sala={formData.sala}
                        />
                      )}
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onCancel}
                    className={`flex-1 h-12 rounded-lg font-medium transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={
                      formData.local === "presencial" &&
                      Boolean(formData.sala) &&
                      roomConflictingEvents.length > 0
                    }
                    className={`flex-1 h-12 rounded-lg font-medium transition-all duration-200 ${
                      formData.local === "presencial" &&
                      Boolean(formData.sala) &&
                      roomConflictingEvents.length > 0
                        ? "bg-red-500 cursor-not-allowed opacity-60 text-white"
                        : "text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    }`}
                    type="button"
                  >
                    {formData.local === "presencial" &&
                    Boolean(formData.sala) &&
                    roomConflictingEvents.length > 0
                      ? "🚫 Conflito de Sala"
                      : "Salvar Reunião"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
