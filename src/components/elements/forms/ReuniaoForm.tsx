import { useState, useEffect } from "react";
import { setorNomeParaId } from "../../../../src/utils/setorNomeParaId";
import { useRef } from "react";
import { sectorServices } from "../../../services/sectorsServices";
import { userServices } from "../../../services/usersServices";
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
    status: initialData?.status || "PENDING",
    responsavelAta: initialData?.responsavelAta || "",
    linkReuniao: initialData?.meetingLink  || "",
    notificacao: initialData?.notificacao || 30,
  });

  const [novoParticipante, setNovoParticipante] = useState("");
  const [roomConflictingEvents, setRoomConflictingEvents] = useState<any[]>([]);
  const [setores, setSetores] = useState<{ id: number; name: string }[]>([]);
  const [loadingSetores, setLoadingSetores] = useState(true);
  const [usuarios, setUsuarios] = useState<{ id: number; name: string; email: string; sectorId: number }[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchSectors = async () => {
  setLoadingSetores(true);
      
      const mockSetores = [
        { id: 1, name: "Presidência" },
        { id: 2, name: "Diretoria Administrativa" },
        { id: 3, name: "Diretoria Técnica" },
        { id: 4, name: "Recursos Humanos" },
        { id: 5, name: "Tecnologia da Informação" },
        { id: 6, name: "Financeiro" },
        { id: 7, name: "Jurídico" },
        { id: 8, name: "Comunicação" }
      ];
      
      try {
    const response = await sectorServices.getSectors();
        
        let sectorsData = response;
        if (response?.sectors) {
          sectorsData = response.sectors;
          
        } else if (response?.data) {
          sectorsData = response.data;
          
        } else if (Array.isArray(response)) {
          sectorsData = response;
          
        }

        if (Array.isArray(sectorsData) && sectorsData.length > 0) {
          const formattedSectors = sectorsData.map((s: any) => ({
            id: s.id,
            name: s.name || s.nome || `Setor ${s.id}`
          }));
          setSetores(formattedSectors);
        } else {
          console.warn('[ReuniaoForm] API retornou dados inválidos, usando mock');
          setSetores(mockSetores);
        }
    } catch (error) {
    console.error("Erro ao buscar setores da API:", error);
    setSetores(mockSetores);
      } finally {
        setLoadingSetores(false);
        
      }
    };

    const fetchUsuarios = async () => {
  setLoadingUsuarios(true);
      
      try {
        const response = await userServices.getUsers();
        
        let usersData = response;
        if (response?.users) {
          usersData = response.users;
        } else if (response?.data) {
          usersData = response.data;
        } else if (Array.isArray(response)) {
          usersData = response;
        }

        if (Array.isArray(usersData) && usersData.length > 0) {
          const formattedUsers = usersData.map((u: any) => ({
            id: u.id,
            name: u.name || u.nome || `Usuário ${u.id}`,
            email: u.email,
            sectorId: u.sectorId
          }));
          setUsuarios(formattedUsers);
        } else {
          console.warn('[ReuniaoForm] Nenhum usuário encontrado');
          setUsuarios([]);
        }
      } catch (error) {
  console.error("Erro ao buscar usuários:", error);
        setUsuarios([]);
      } finally {
    setLoadingUsuarios(false);
      }
    };

    fetchSectors();
    fetchUsuarios();
  }, []);  useEffect(() => {
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

    if (!formData.titulo.trim()) {
      alert("⚠️ Por favor, informe o título da reunião.");
      return;
    }

    if (!formData.setorResponsavel) {
      alert("⚠️ Por favor, selecione o setor responsável.");
      return;
    }

    if (!formData.dataHoraInicio || !formData.dataHoraTermino) {
      alert("⚠️ Por favor, defina as datas de início e término.");
      return;
    }

    if (formData.dataHoraInicio >= formData.dataHoraTermino) {
      alert("⚠️ A data de término deve ser posterior à data de início.");
      return;
    }

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

    if (formData.local === "virtual" && !formData.linkReuniao.trim()) {
      alert("⚠️ Para reuniões virtuais, é necessário informar o link da reunião.");
      return;
    }

    let setorId = formData.setorResponsavel;
    if (typeof setorId === "string" && isNaN(Number(setorId))) {
      const mapped = setorNomeParaId[setorId.toLowerCase()] || "";
      setorId = mapped !== "" ? String(mapped) : "";
    }
    
    const dataToSend = {
      ...formData,
      setorResponsavel: setorId,
  assigneeIds: usuariosSelecionados,
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
                      {loadingSetores && (
                        <span className="text-xs text-yellow-500 ml-2">
                          (Carregando setores...)
                        </span>
                      )}
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
                      required
                      disabled={loadingSetores}
                    >
                      <option value="">
                        {loadingSetores 
                          ? "Carregando setores..." 
                          : setores.length === 0 
                            ? "Nenhum setor encontrado" 
                            : "Selecione o setor responsável"
                        }
                      </option>
                      {!loadingSetores && setores.map((setor) => (
                        <option key={setor.id} value={setor.id}>
                          {setor.name}
                        </option>
                      ))}
                    </select>
                    {!loadingSetores && setores.length > 0 && (
                      <p className={`text-xs mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {setores.length} setores disponíveis
                      </p>
                    )}
                    {!loadingSetores && setores.length === 0 && (
                      <p className={`text-xs mt-1 text-red-500`}>
                        ⚠️ Erro ao carregar setores. Verifique sua conexão.
                      </p>
                    )}
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
                            | "PENDING"
                            | "IN_PROGRESS"
                            | "COMPLETED"
                            | "CANCELLED",
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
                    🔔 Usuários que Receberão Notificação
                  </label>
                  
                  {loadingUsuarios ? (
                    <div className={`p-4 rounded-md text-center ${
                      theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}>
                      Carregando usuários...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-md border ${
                        theme === "dark" 
                          ? "bg-blue-900/20 border-blue-700" 
                          : "bg-blue-50 border-blue-200"
                      }`}>
                        <p className={`text-xs ${
                          theme === "dark" ? "text-blue-300" : "text-blue-700"
                        }`}>
                          💡 <strong>Dica:</strong> Selecione os usuários que devem ser notificados automaticamente quando esta reunião for criada.
                        </p>
                      </div>

                      <select
                        onChange={(e) => {
                          const userId = parseInt(e.target.value);
                          if (userId && !usuariosSelecionados.includes(userId)) {
                            setUsuariosSelecionados(prev => [...prev, userId]);
                          }
                          e.target.value = "";
                        }}
                        className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="">➕ Adicionar usuário para notificar</option>
                        {usuarios
                          .filter(u => !usuariosSelecionados.includes(u.id))
                          .map(usuario => (
                            <option key={usuario.id} value={usuario.id}>
                              {usuario.name} ({usuario.email})
                            </option>
                          ))
                        }
                      </select>

                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {usuariosSelecionados.length === 0 ? (
                          <div className={`p-3 rounded-md text-center text-sm ${
                            theme === "dark" 
                              ? "bg-gray-700/50 text-gray-400" 
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            Nenhum usuário selecionado. Selecione acima para notificar.
                          </div>
                        ) : (
                          usuariosSelecionados.map(userId => {
                            const usuario = usuarios.find(u => u.id === userId);
                            if (!usuario) return null;
                            
                            return (
                              <div
                                key={userId}
                                className={`flex items-center justify-between p-3 rounded-md ${
                                  theme === "dark"
                                    ? "bg-gray-700 text-gray-200"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <FaUserCircle className={`text-lg ${
                                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                                  }`} />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{usuario.name}</div>
                                    <div className={`text-xs ${
                                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                      {usuario.email}
                                    </div>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    theme === "dark"
                                      ? "bg-blue-900/30 text-blue-300"
                                      : "bg-blue-100 text-blue-700"
                                  }`}>
                                    🔔 Será notificado
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUsuariosSelecionados(prev => 
                                      prev.filter(id => id !== userId)
                                    );
                                  }}
                                  className={`ml-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                    theme === "dark"
                                      ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                                      : "bg-red-100 text-red-600 hover:bg-red-200"
                                  }`}
                                >
                                  ✕ Remover
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {usuariosSelecionados.length > 0 && (
                        <div className={`p-2 rounded-md text-xs text-center font-medium ${
                          theme === "dark"
                            ? "bg-green-900/20 text-green-300"
                            : "bg-green-50 text-green-700"
                        }`}>
                          ✅ {usuariosSelecionados.length} usuário(s) será(ão) notificado(s) automaticamente
                        </div>
                      )}
                    </div>
                  )}
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
