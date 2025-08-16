import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useTheme } from "../../contexts/ThemeContext";
import { usePermissions } from "../../hooks/usePermissions";

export interface Atividade {
  id: number;
  title: string;
  start: Date;
  end: Date;
  desc: string;
  autor: string;
  setor: string;
  tipo: string;
  status?: string;
  prioridade?: string;
  [key: string]: any;
}

interface FiltroAtividadesProps {
  atividades: Atividade[];
  onSelecionarAtividades: (atividades: Atividade[]) => void;
}

interface SetorHierarquia {
  nome: string;
  subsetores: string[];
}

const setoresHierarquia: { [key: string]: SetorHierarquia } = {
  Presidente: {
    nome: "Presidência",
    subsetores: [
      "Procuradoria",
      "Conselho Superior",
      "Gabinete",
      "Ouvidoria",
      "ASCOM",
    ],
  },
  DAF: {
    nome: "DAF",
    subsetores: [
      "Contabilidade",
      "Recursos Humanos",
      "Compras",
      "Licitação",
      "T.I",
      "Almoxarifado",
    ],
  },
  DiretorTecnico: {
    nome: "Diretoria Técnica",
    subsetores: [
      "CT Loterias",
      "CT Gás",
      "CT Energia",
      "CT Tarifária",
      "CT Saneamento",
    ],
  },
};

const categorias = [
  { id: "atividade", nome: "Atividade" },
  { id: "reuniao", nome: "Reunião" },
  { id: "documento", nome: "Documento" },
  { id: "atividades-externas", nome: "Atividades Externas" },
];

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        isActive
          ? "border-b-2 border-[#ffffff] text-[#ffffff]"
          : "text-[#ffffff83] hover:text-white transition-colors"
      }`}
    >
      {label}
    </button>
  );
};

export const FiltroAtividades: React.FC<FiltroAtividadesProps> = ({
  atividades,
  onSelecionarAtividades,
}) => {
  const { theme } = useTheme();
  const { canFilterBySector } = usePermissions();
  const [activeTab, setActiveTab] = useState<"setor" | "categoria">(
    canFilterBySector() ? "setor" : "categoria"
  );
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [subsetoresSelecionados, setSubsetoresSelecionados] = useState<
    string[]
  >([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSetorClick = useCallback((setor: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSetorSelecionado((prev) => (prev === setor ? "" : setor));
  }, []);

  const handleSubsetorToggle = useCallback((subsetor: string) => {
    setSubsetoresSelecionados((prev) =>
      prev.includes(subsetor)
        ? prev.filter((s) => s !== subsetor)
        : [...prev, subsetor]
    );
  }, []);

  const handleCategoriaToggle = useCallback((categoriaId: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((id) => id !== categoriaId)
        : [...prev, categoriaId]
    );
  }, []);

  const eventosFiltrados = useMemo(() => {
    if (
      !setorSelecionado &&
      !subsetoresSelecionados.length &&
      !categoriasSelecionadas.length
    ) {
      return atividades;
    }

    return atividades.filter((atividade) => {
      if (activeTab === "categoria" && categoriasSelecionadas.length > 0) {
        return categoriasSelecionadas.includes(atividade.tipo.toLowerCase());
      }

      if (activeTab === "setor") {
        if (subsetoresSelecionados.length > 0) {
          return subsetoresSelecionados.includes(atividade.setor);
        }
        return atividade.setor === setorSelecionado;
      }

      return true;
    });
  }, [
    atividades,
    setorSelecionado,
    subsetoresSelecionados,
    categoriasSelecionadas,
    activeTab,
  ]);

  useEffect(() => {
    onSelecionarAtividades(eventosFiltrados);
  }, [eventosFiltrados, onSelecionarAtividades]);

  const handleCloseFilter = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSetorSelecionado("");
    setSubsetoresSelecionados([]);
    setCategoriasSelecionadas([]);
  }, []);

  const handleLimparFiltros = useCallback(() => {
    setSetorSelecionado("");
    setSubsetoresSelecionados([]);
    setCategoriasSelecionadas([]);
    setActiveTab(canFilterBySector() ? "setor" : "categoria");
    onSelecionarAtividades(atividades);
  }, [atividades, onSelecionarAtividades, canFilterBySector]);

  return (
    <div
      className={`text-white rounded-lg shadow-lg w-full max-w-xs flex flex-col max-h-[calc(100vh-100px)] ${
        theme === "dark" ? "bg-[#006BA6]" : "bg-[#0092DA]"
      }`}
    >
      <div
        className={`p-3 pb-2 border-b flex-shrink-0 ${
          theme === "dark" ? "border-[#004b73]" : "border-[#007BB8]"
        }`}
      >
        <h2 className="text-lg font-semibold text-white">Filtros</h2>
      </div>

      <div className="px-3 pt-2 flex-shrink-0">
        <div className="flex">
          {canFilterBySector() && (
            <Tab
              label="Por Setor"
              isActive={activeTab === "setor"}
              onClick={() => setActiveTab("setor")}
            />
          )}
          <Tab
            label="Por Categoria"
            isActive={activeTab === "categoria"}
            onClick={() => setActiveTab("categoria")}
          />
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto px-3 py-2 min-h-0 scrollbar-thin ${
          theme === "dark"
            ? "scrollbar-thumb-[#005A8A] scrollbar-track-[#006BA6]"
            : "scrollbar-thumb-[#007BB8] scrollbar-track-[#0092DA]"
        }`}
      >
        <div className="space-y-1">
          {activeTab === "setor" && canFilterBySector() ? (
            <div className="space-y-1">
              {Object.entries(setoresHierarquia).map(([key, setor]) => (
                <div
                  key={key}
                  className={`border-b pb-1 last:border-b-0 ${
                    theme === "dark"
                      ? "border-[#004b73]/30"
                      : "border-[#007BB8]/30"
                  }`}
                >
                  <button
                    onClick={(e) => handleSetorClick(key, e)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                      setorSelecionado === key
                        ? theme === "dark"
                          ? "bg-[#005A8A] text-white font-medium"
                          : "bg-[#007BB8] text-white font-medium"
                        : theme === "dark"
                        ? "text-gray-200 hover:bg-[#005A8A]/50"
                        : "text-gray-200 hover:bg-[#007BB8]/50"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="truncate">{setor.nome}</span>
                      <IoIosArrowDroprightCircle
                        className={`transition-transform duration-300 flex-shrink-0 ml-2 text-lg ${
                          setorSelecionado === key ? "rotate-90" : ""
                        } text-gray-300`}
                      />
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      setorSelecionado === key
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      className={`ml-3 mt-1 space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin ${
                        theme === "dark"
                          ? "scrollbar-thumb-[#005A8A] scrollbar-track-[#006BA6]"
                          : "scrollbar-thumb-[#007BB8] scrollbar-track-[#0092DA]"
                      }`}
                    >
                      {setor.subsetores.map((subsetor) => (
                        <label
                          key={subsetor}
                          className={`flex items-center space-x-2 text-xs px-2 py-1 rounded cursor-pointer transition-colors text-gray-200 ${
                            theme === "dark"
                              ? "hover:bg-[#005A8A]/50"
                              : "hover:bg-[#007BB8]/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={subsetoresSelecionados.includes(subsetor)}
                            onChange={() => handleSubsetorToggle(subsetor)}
                            className={`rounded text-[#00B4E6] focus:ring-[#00B4E6] focus:ring-offset-0 w-3 h-3 flex-shrink-0 bg-white/10 ${
                              theme === "dark"
                                ? "border-[#005A8A]"
                                : "border-[#007BB8]"
                            }`}
                          />
                          <span className="leading-none truncate">
                            {subsetor}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {categorias.map((categoria) => (
                <label
                  key={categoria.id}
                  className={`flex items-center space-x-2 text-sm px-2 py-1.5 rounded cursor-pointer transition-colors text-gray-200 ${
                    theme === "dark"
                      ? "hover:bg-[#005A8A]/50"
                      : "hover:bg-[#007BB8]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.includes(categoria.id)}
                    onChange={() => handleCategoriaToggle(categoria.id)}
                    className={`rounded text-[#00B4E6] focus:ring-[#00B4E6] focus:ring-offset-0 w-4 h-4 flex-shrink-0 bg-white/10 ${
                      theme === "dark" ? "border-[#005A8A]" : "border-[#007BB8]"
                    }`}
                  />
                  <span className="leading-none truncate">
                    {categoria.nome}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`p-3 pt-2 flex-shrink-0 border-t ${
          theme === "dark" ? "border-[#005A8A]" : "border-[#007BB8]"
        }`}
      >
        <button
          onClick={handleLimparFiltros}
          className={`w-full px-3 py-2 text-xs text-white hover:text-gray-200 rounded-md border transition-colors ${
            theme === "dark"
              ? "hover:bg-[#005A8A]/50 border-[#005A8A]"
              : "hover:bg-[#007BB8]/50 border-[#007BB8]"
          }`}
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};
