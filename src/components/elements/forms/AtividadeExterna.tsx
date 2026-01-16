import { useEffect, useState } from "react";
import { AtividadeExternaFormData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdGroups } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";
import { sectorServices } from "../../../services/sectorsServices";
import { userServices } from "../../../services/usersServices";

interface AtividadeExternaFormProps {
  initialData?: Partial<AtividadeExternaFormData>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AtividadeExternaForm: React.FC<AtividadeExternaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<AtividadeExternaFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || "",
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    dataHoraSaida: initialData?.dataHoraSaida || new Date(),
    dataHoraRetorno: initialData?.dataHoraRetorno || new Date(),
    destino: initialData?.destino || "",
    equipeEnvolvida: initialData?.equipeEnvolvida || [],
    status: initialData?.status || "planejada",
    meioTransporte: initialData?.meioTransporte || "",
  });

  const [novoMembro, setNovoMembro] = useState("");
  const [setores, setSetores] = useState<{ id: number; name: string }[]>([]);
  const [loadingSetores, setLoadingSetores] = useState(true);
  const [usuarios, setUsuarios] = useState<{ id: number; name: string; email: string; sectorId: number }[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchSectors = async () => {
      console.log('[AtividadeExternaForm] Iniciando busca de setores...');
      setLoadingSetores(true);
      
      // Setores mock como fallback
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
        console.log('[AtividadeExternaForm] Resposta completa da API:', response);
        
        // Tratar diferentes formatos de resposta da API
        let sectorsData = response;
        if (response?.sectors) {
          sectorsData = response.sectors;
          console.log('[AtividadeExternaForm] Usando response.sectors:', sectorsData);
        } else if (response?.data) {
          sectorsData = response.data;
          console.log('[AtividadeExternaForm] Usando response.data:', sectorsData);
        } else if (Array.isArray(response)) {
          sectorsData = response;
          console.log('[AtividadeExternaForm] Response é array direto:', sectorsData);
        }

        if (Array.isArray(sectorsData) && sectorsData.length > 0) {
          const formattedSectors = sectorsData.map((s: any) => ({
            id: s.id,
            name: s.name || s.nome || `Setor ${s.id}`
          }));
          console.log('[AtividadeExternaForm] Setores formatados da API:', formattedSectors);
          setSetores(formattedSectors);
        } else {
          console.warn('[AtividadeExternaForm] API retornou dados inválidos, usando mock');
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
  }, []);

  const handleAddMembro = () => {
    if (novoMembro.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipeEnvolvida: [...prev.equipeEnvolvida, novoMembro.trim()],
      }));
      setNovoMembro("");
    }
  };

  return (
    <div className="">
      {" "}
      <section
        className={`rounded-md p-2 w-[900px] ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative px-6 py-3">
          {" "}
          <h2
            className={`text-xl font-bold leading-tight text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {" "}
            Nova Atividade Externa
          </h2>
          <IoMdClose
            onClick={onCancel}
            className={`absolute top-4 right-4 text-2xl cursor-pointer ${
              theme === "dark"
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />
          <p
            className={`mt-1 text-sm text-center mb-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {" "}
            Preencha os detalhes da atividade externa
          </p>
          <form className="w-full">
            <div className="space-y-3">
              {" "}
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                
                {" "}
                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Título
                  </label>
                  <div className="mt-2">
                    <input
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          titulo: e.target.value,
                        }))
                      }
                      placeholder="Título da Atividade"
                      type="text"
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                          : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`text-base font-medium ${
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
                  <div className="mt-2">
                    <select
                      value={formData.setorResponsavel}
                      onChange={(e) => {
                        console.log('[AtividadeExternaForm] Setor selecionado:', e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          setorResponsavel: e.target.value,
                        }));
                      }}
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                          : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
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
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Destino
                  </label>
                  <input
                    value={formData.destino}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        destino: e.target.value,
                      }))
                    }
                    placeholder="Local da atividade"
                    className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`text-base font-medium ${
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
                        status: e.target
                          .value as AtividadeExternaFormData["status"],
                      }))
                    }
                    className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="planejada">Planejada</option>
                    <option value="em-execucao">Em Execução</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Meio de Transporte
                  </label>
                  <input
                    value={formData.meioTransporte}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meioTransporte: e.target.value,
                      }))
                    }
                    placeholder="Opcional"
                    className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div className="col-span-2 flex">
                  {" "}
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Hora de Saída
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <DatePicker
                        selected={formData.dataHoraSaida}
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            dataHoraSaida: date || new Date(),
                          }))
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy HH:mm"
                        className={`flex h-9 w-[270px] rounded-md border px-3 py-2 text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
                        }`}
                        placeholderText="Data/Hora de Saída"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Hora de Retorno
                    </label>
                    <DatePicker
                      selected={formData.dataHoraRetorno}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dataHoraRetorno: date || new Date(),
                        }))
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      className={`flex h-9 w-[270px] rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                      placeholderText="Data/Hora de Retorno"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3">
                {" "}
                <div>
                  {/* Campo 'motivo da atividade' removido */}
                </div>
                <div className="col-span-3">
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    placeholder="Descrição da atividade externa"
                    className={`mt-2 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                    rows={2}
                  />
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Equipe Envolvida
                  </label>
                  <div className="mt-1 space-y-1">
                    {" "}
                    <div className="flex gap-2">
                      <input
                        value={novoMembro}
                        onChange={(e) => setNovoMembro(e.target.value)}
                        placeholder="Adicionar membro"
                        className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddMembro}
                        className={`px-4 py-2 rounded-md text-white ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {" "}
                      {formData.equipeEnvolvida.map((membro, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-md mb-1 ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-[#eaeaea] text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MdGroups
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            />
                            <span className="text-[15px]">{membro}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                equipeEnvolvida: prev.equipeEnvolvida.filter((_, i) => i !== index),
                              }));
                            }}
                            className={`ml-2 px-2 py-1 rounded text-xs ${theme === "dark" ? "bg-red-700 text-white" : "bg-red-200 text-red-800"}`}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Seção de Usuários Envolvidos */}
              <div className="mt-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  👥 Usuários Envolvidos
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
                        💡 <strong>Dica:</strong> Adicione os usuários envolvidos nesta atividade externa. Eles receberão notificações automaticamente.
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
                      <option value="">➕ Adicionar usuário envolvido</option>
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
                                  � Envolvido
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

              <div className="flex gap-4 pt-4">
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const setorId = Number(formData.setorResponsavel);
                    if (!formData.setorResponsavel || isNaN(setorId) || setorId === 0) {
                      alert("Selecione um setor válido antes de salvar.");
                      return;
                    }
                    if (!formData.descricao || formData.descricao.trim().length === 0) {
                      alert("Preencha a descrição da atividade externa.");
                      return;
                    }
                    const payload = {
                      title: formData.titulo,
                      description: formData.descricao,
                      type: "EXTERNAL_ACTIVITY",
                      priority: "MEDIUM",
                      startDate: formData.dataHoraSaida ? new Date(formData.dataHoraSaida).toISOString() : new Date().toISOString(),
                      endDate: formData.dataHoraRetorno ? new Date(formData.dataHoraRetorno).toISOString() : new Date().toISOString(),
                      isAllDay: false,
                      location: formData.destino || "",
                      sectorId: setorId,
                      setorResponsavel: setorId,
                      externalStatus: "PLANNED",
                      destino: formData.destino || "",
                      dataHoraSaida: formData.dataHoraSaida ? new Date(formData.dataHoraSaida).toISOString() : null,
                      dataHoraRetorno: formData.dataHoraRetorno ? new Date(formData.dataHoraRetorno).toISOString() : null,
                      meioTransporte: formData.meioTransporte || "",
                      motivoAtividade: "",
                      equipeEnvolvida: formData.equipeEnvolvida,
                      assigneeIds: usuariosSelecionados,
                    };
                    onSubmit(payload);
                  }}
                  className="flex-1 h-12 rounded-lg font-medium text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Salvar Atividade Externa
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
