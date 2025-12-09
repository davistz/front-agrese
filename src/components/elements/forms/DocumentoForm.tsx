import { useEffect, useState } from "react";
import { DocumentoFormData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../../../contexts/ThemeContext";
import { sectorServices } from "../../../services/sectorsServices";
import { userServices } from "../../../services/usersServices";

interface DocumentoFormProps {
  initialData?: Partial<DocumentoFormData>;
  onSubmit: (data: DocumentoFormData) => void;
  onCancel: () => void;
}

export const DocumentoForm: React.FC<DocumentoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<DocumentoFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || [],
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    tipoDocumento: initialData?.tipoDocumento || "",
    status: initialData?.status || "pendente",
    responsavel: initialData?.responsavel || "",
    dataCriacao: initialData?.dataCriacao || new Date(),
    prazoAnalise: initialData?.prazoAnalise || new Date(),
    dataEnvioRecebimento: initialData?.dataEnvioRecebimento || null,
    observacoes: initialData?.observacoes || "",
  });
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

  return (
    <div className="">
      <section
        className={`rounded-md p-2 w-[900px] ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative px-6 py-3">
          <h2
            className={`text-xl font-bold leading-tight text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Novo Documento
          </h2>
          <IoMdClose
            onClick={onCancel}
            className={`absolute top-4 right-4 text-2xl cursor-pointer ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          />
          <p
            className={`mt-1 text-sm text-center mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Preencha os detalhes do documento
          </p>

          <form className="w-full">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Título do Documento
                  </label>
                  <input
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        titulo: e.target.value,
                      }))
                    }
                    placeholder="Título do documento"
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Setor de Origem
                    {loadingSetores && (
                      <span className="text-xs text-yellow-500 ml-2">
                        (Carregando setores...)
                      </span>
                    )}
                  </label>
                  <div className="space-y-2">
                    <div className={`mt-1 max-h-32 overflow-y-auto rounded-md border p-2 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}>
                      {loadingSetores ? (
                        <p className="text-sm text-gray-400">Carregando setores...</p>
                      ) : setores.length === 0 ? (
                        <p className="text-sm text-red-500">Nenhum setor encontrado</p>
                      ) : (
                        setores.map((setor) => (
                          <label
                            key={setor.id}
                            className={`flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-opacity-50 ${
                              theme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-100 text-gray-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.setorResponsavel.includes(setor.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    setorResponsavel: [...prev.setorResponsavel, setor.id],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    setorResponsavel: prev.setorResponsavel.filter((id) => id !== setor.id),
                                  }));
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{setor.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                    {formData.setorResponsavel.length > 0 && (
                      <p className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {formData.setorResponsavel.length} setor(es) selecionado(s)
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Tipo de Documento
                  </label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipoDocumento: e.target.value,
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="oficio">Ofício</option>
                    <option value="relatorio">Relatório</option>
                    <option value="memorando">Memorando</option>
                    <option value="parecer">Parecer</option>
                    <option value="portaria">Portaria</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Responsável
                  </label>
                  <input
                    value={formData.responsavel}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        responsavel: e.target.value,
                      }))
                    }
                    placeholder="Nome do responsável"
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
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
                        status: e.target.value as DocumentoFormData["status"],
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em-analise">Em Análise</option>
                    <option value="assinado">Assinado</option>
                    <option value="enviado">Enviado</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Data de Envio/Recebimento
                  </label>
                  <DatePicker
                    selected={formData.dataEnvioRecebimento}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataEnvioRecebimento: date,
                      }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholderText="Data de envio/recebimento"
                    isClearable
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Prazo para Análise
                  </label>
                  <DatePicker
                    selected={formData.prazoAnalise}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        prazoAnalise: date || new Date(),
                      }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholderText="Prazo para análise"
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Data de Criação
                  </label>
                  <DatePicker
                    selected={formData.dataCriacao}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataCriacao: date || new Date(),
                      }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholderText="Data de criação"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-3">
                <div>
                  <label
                    className={`text-sm font-medium ${
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
                    placeholder="Finalidade ou tipo do documento"
                    className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
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
                    Arquivo do Documento
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        arquivo: e.target.files?.[0] || null,
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-400 file:text-gray-300"
                        : "bg-white border-gray-300 text-gray-400 file:text-gray-600"
                    }`}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        observacoes: e.target.value,
                      }))
                    }
                    placeholder="Observações adicionais"
                    className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    rows={2}
                  />
                </div>
              </div>

              {/* Seção de Usuários para Notificação */}
              <div className="col-span-3 mt-4">
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
                        💡 <strong>Dica:</strong> Selecione os usuários que devem ser notificados automaticamente quando este documento for criado.
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
                    onSubmit({ ...formData, assigneeIds: usuariosSelecionados });
                  }}
                  className="flex-1 h-12 rounded-lg font-medium text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Salvar Documento
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
