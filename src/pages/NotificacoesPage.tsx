import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNotifications } from "../hooks/useNotifications";
import { Sidebar } from "../components/elements/Sidebar";
import { NotificacaoInfoModal } from "../components/modals/NotificacaoInfoModal";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaEye,
  FaCalendar,
  FaFileAlt,
  FaClipboard,
  FaUsers,
  FaCog,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

import type { NotificacaoSetor } from "../hooks/useNotifications";

export const NotificacoesPage: React.FC = () => {
  const { theme } = useTheme();
  const {
    notificacoes,
    notificacoesNaoLidas,
    setNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<
    "todas" | "nao-lidas" | "lidas"
  >("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] =
    useState<NotificacaoSetor | null>(null);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
  const [notificacaoParaExcluir, setNotificacaoParaExcluir] =
    useState<NotificacaoSetor | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const abrirModal = (notificacao: NotificacaoSetor) => {
    setNotificacaoSelecionada(notificacao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setNotificacaoSelecionada(null);
  };

  const handleMarcarComoLida = (notificacao: NotificacaoSetor) => {
    marcarComoLida(notificacao.id);
  };

  const handleExcluirNotificacao = (notificacao: NotificacaoSetor) => {
    setNotificacaoParaExcluir(notificacao);
    setConfirmacaoExclusao(true);
  };

  const confirmarExclusao = () => {
    if (notificacaoParaExcluir) {
      excluirNotificacao(notificacaoParaExcluir.id);
    }
    setConfirmacaoExclusao(false);
    setNotificacaoParaExcluir(null);
  };

  const cancelarExclusao = () => {
    setConfirmacaoExclusao(false);
    setNotificacaoParaExcluir(null);
  };

  const limparNotificacoesLidas = () => {
    const notificacoesLidas = notificacoes.filter((n) => n.lida);
    notificacoesLidas.forEach((n) => excluirNotificacao(n.id));
  };

  const getIconeNotificacao = (tipo: NotificacaoSetor["tipo"]) => {
    switch (tipo) {
      case "evento_criado":
        return <FaPlus className="w-5 h-5 text-green-500" />;
      case "evento_editado":
        return <FaEdit className="w-5 h-5 text-blue-500" />;
      case "evento_excluido":
        return <FaTrash className="w-5 h-5 text-red-500" />;
      default:
        return <FaBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIconeOrigem = () => {
    return <FaCalendar className="w-3 h-3 text-blue-500" />;
  };

  const getCorNotificacao = (tipo: NotificacaoSetor["tipo"], lida: boolean) => {
    const baseColors = {
      evento_criado: "border-l-green-500",
      evento_editado: "border-l-blue-500",
      evento_excluido: "border-l-red-500",
    };

    return `${baseColors[tipo]} ${
      !lida ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""
    }`;
  };

  const formatarDataHora = (data: Date) => {
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const minutos = Math.floor(diferenca / (1000 * 60));
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `${minutos} min atrás`;
    } else if (horas < 24) {
      return `${horas}h atrás`;
    } else if (dias < 7) {
      return `${dias} dias atrás`;
    } else {
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const notificacoesFiltradas = () => {
    switch (filtroAtivo) {
      case "nao-lidas":
        return notificacoes.filter((n) => !n.lida);
      case "lidas":
        return notificacoes.filter((n) => n.lida);
      default:
        return notificacoes;
    }
  };

  const getTextoContador = () => {
    const filtradas = notificacoesFiltradas();
    switch (filtroAtivo) {
      case "nao-lidas":
        return `${filtradas.length} notificações não lidas`;
      case "lidas":
        return `${filtradas.length} notificações lidas`;
      default:
        return notificacoesNaoLidas > 0
          ? `${filtradas.length} notificações total (${notificacoesNaoLidas} não lidas)`
          : `${filtradas.length} notificações total`;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isOpen}
        activeView="notificacoes"
        onToggle={toggleSidebar}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div
          className={`min-h-screen overflow-y-auto ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
              : "bg-gradient-to-br from-blue-50 via-blue-25 to-blue-100"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-8">
              <div
                className={`relative overflow-hidden rounded-2xl p-8 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-[#004A7A]/50 to-[#0092DA]/50 border border-[#0092DA]/30"
                    : "bg-gradient-to-r from-[#0092DA] to-[#006BA6] text-white"
                } shadow-xl`}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          theme === "dark" ? "bg-[#0092DA]/20" : "bg-white/20"
                        }`}
                      >
                        <FaBell className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-white mb-1">
                          Central de Notificações
                        </h1>
                        <p className="text-blue-100 text-sm">
                          {getTextoContador()}
                        </p>
                      </div>
                    </div>

                    {notificacoesNaoLidas > 0 && (
                      <div
                        className={`px-4 text-[13px] py-2 rounded-full ${
                          theme === "dark"
                            ? "bg-red-500/20 border border-red-500/30"
                            : "bg-red-500/20 border border-red-300"
                        }`}
                      >
                        <span className="text-white font-semibold">
                          {notificacoesNaoLidas} não{" "}
                          {notificacoesNaoLidas === 1 ? "lida" : "lidas"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={marcarTodasComoLidas}
                      className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                    >
                      ✓ Marcar todas como lidas
                    </button>
                    <button
                      onClick={limparNotificacoesLidas}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-105"
                    >
                      🗑️ Limpar lidas
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div
                className={`rounded-2xl p-2 ${
                  theme === "dark"
                    ? "bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/70 border border-gray-200/50 backdrop-blur-sm"
                } shadow-lg`}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setFiltroAtivo("todas")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filtroAtivo === "todas"
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-[#0092DA] to-[#006BA6] text-white shadow-lg shadow-[#0092DA]/25 scale-105"
                          : "bg-gradient-to-r from-[#0092DA] to-[#006BA6] text-white shadow-lg shadow-[#0092DA]/25 scale-105"
                        : theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:scale-105"
                    }`}
                  >
                    <span className="text-lg">📋</span>
                    Todas
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        filtroAtivo === "todas"
                          ? "bg-white/20 text-white"
                          : theme === "dark"
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {notificacoes.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setFiltroAtivo("nao-lidas")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 relative ${
                      filtroAtivo === "nao-lidas"
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25 scale-105"
                          : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                        : theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:scale-105"
                    }`}
                  >
                    <span className="text-lg">🔔</span>
                    Não lidas
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        filtroAtivo === "nao-lidas"
                          ? "bg-white/20 text-white"
                          : theme === "dark"
                          ? "bg-red-600 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {notificacoesNaoLidas}
                    </span>
                    {notificacoesNaoLidas > 0 &&
                      filtroAtivo !== "nao-lidas" && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                  </button>

                  <button
                    onClick={() => setFiltroAtivo("lidas")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filtroAtivo === "lidas"
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25 scale-105"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 scale-105"
                        : theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:scale-105"
                    }`}
                  >
                    <FaCircleCheck className="text-xl h-6 text-green-600" />
                    Lidas
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        filtroAtivo === "lidas"
                          ? "bg-white/20 text-white"
                          : theme === "dark"
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {notificacoes.filter((n) => n.lida).length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {notificacoesFiltradas().map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`group rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
                    theme === "dark"
                      ? "bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80"
                      : "bg-white/80 border border-gray-200/50 backdrop-blur-sm hover:bg-white/90"
                  } ${
                    !notificacao.lida
                      ? "ring-2 ring-[#0092DA]/30 shadow-lg shadow-[#0092DA]/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl ${
                        notificacao.tipo === "evento_criado"
                          ? "bg-green-500/20 text-green-400"
                          : notificacao.tipo === "evento_editado"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {getIconeNotificacao(notificacao.tipo)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={`font-bold text-base leading-tight mb-2 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            } ${!notificacao.lida ? "text-[#0092DA]" : ""}`}
                          >
                            {notificacao.titulo}
                          </h3>

                          <p
                            className={`text-xs leading-relaxed mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {notificacao.descricao}
                          </p>

                          <div className="flex items-center gap-4">
                            <span
                              className={`text-xs flex items-center gap-1 ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              🕐 {formatarDataHora(notificacao.dataHora)}
                            </span>

                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                theme === "dark"
                                  ? "bg-[#0092DA]/20 text-blue-300 border border-[#0092DA]/30"
                                  : "bg-blue-100 text-blue-700 border border-blue-200"
                              }`}
                            >
                              <h1 className="inline-flex items-center gap-1">
                                {getIconeOrigem()}
                                {notificacao.setorNome}
                              </h1>
                            </span>

                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                theme === "dark"
                                  ? "bg-gray-600/50 text-gray-300"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              por {notificacao.autorNome}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {!notificacao.lida && (
                            <div className="w-3 h-3 bg-gradient-to-r from-[#0092DA] to-[#006BA6] rounded-full animate-pulse"></div>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMarcarComoLida(notificacao)}
                              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                notificacao.lida
                                  ? theme === "dark"
                                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                  : theme === "dark"
                                  ? "bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                                  : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600"
                              }`}
                              title={
                                notificacao.lida
                                  ? "Marcar como não lida"
                                  : "Marcar como lida"
                              }
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => abrirModal(notificacao)}
                              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                theme === "dark"
                                  ? "bg-[#0092DA]/20 text-blue-400 hover:bg-[#0092DA]/30"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                              title="Ver detalhes"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleExcluirNotificacao(notificacao)
                              }
                              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                theme === "dark"
                                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                              title="Excluir notificação"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notificacoesFiltradas().length === 0 && (
              <div
                className={`text-center py-16 rounded-2xl ${
                  theme === "dark"
                    ? "bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border border-gray-200/50 backdrop-blur-sm"
                } shadow-lg`}
              >
                <div
                  className={`inline-flex p-6 rounded-full mb-6 ${
                    filtroAtivo === "nao-lidas"
                      ? "bg-orange-500/20"
                      : filtroAtivo === "lidas"
                      ? "bg-green-500/20"
                      : "bg-[#0092DA]/20"
                  }`}
                >
                  <FaBell
                    className={`w-16 h-16 ${
                      filtroAtivo === "nao-lidas"
                        ? "text-orange-400"
                        : filtroAtivo === "lidas"
                        ? "text-green-400"
                        : theme === "dark"
                        ? "text-[#0092DA]"
                        : "text-[#0092DA]"
                    }`}
                  />
                </div>

                <h3
                  className={`text-lg font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {filtroAtivo === "nao-lidas"
                    ? "🎉 Tudo em dia!"
                    : filtroAtivo === "lidas"
                    ? "📭 Nenhuma notificação lida"
                    : "📬 Caixa de entrada vazia"}
                </h3>

                <p
                  className={`text-sm max-w-md mx-auto ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {filtroAtivo === "nao-lidas"
                    ? "Sem notificações não lidas!"
                    : filtroAtivo === "lidas"
                    ? "Nenhuma notificação foi marcada como lida ainda."
                    : "Não há notificações no momento! Quando houver novidades, elas aparecerão aqui."}
                </p>

                {filtroAtivo !== "todas" && (
                  <button
                    onClick={() => setFiltroAtivo("todas")}
                    className={`mt-6 px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                      theme === "dark"
                        ? "bg-[#0092DA] hover:bg-[#006BA6] text-white"
                        : "bg-[#0092DA] hover:bg-[#006BA6] text-white"
                    } shadow-lg`}
                  >
                    📋 Ver todas as notificações
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <NotificacaoInfoModal
        isOpen={modalAberto}
        notificacao={notificacaoSelecionada}
        onClose={fecharModal}
        onMarcarComoLida={handleMarcarComoLida}
        onExcluir={handleExcluirNotificacao}
      />

      {confirmacaoExclusao && notificacaoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm"
            onClick={cancelarExclusao}
          ></div>

          <div
            className={`relative rounded-xl shadow-2xl max-w-md w-full mx-4 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Confirmar Exclusão
              </h3>
            </div>

            <div className="px-6 py-4">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tem certeza de que deseja excluir a notificação "
                {notificacaoParaExcluir.titulo}"?
              </p>
              <p
                className={`text-xs mt-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div
              className={`px-6 py-4 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              } flex gap-3 justify-end`}
            >
              <button
                onClick={cancelarExclusao}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
