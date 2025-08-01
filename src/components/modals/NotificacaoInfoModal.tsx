import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaTimes,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

interface NotificacaoSetor {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "evento_criado" | "evento_editado" | "evento_excluido";
  lida: boolean;
  dataHora: Date;
  setorId: number;
  setorNome: string;
  autorId: number;
  autorNome: string;
  eventoId?: string;
  eventoTitulo?: string;
}

interface NotificacaoInfoModalProps {
  isOpen: boolean;
  notificacao: NotificacaoSetor | null;
  onClose: () => void;
  onMarcarComoLida?: (notificacao: NotificacaoSetor) => void;
  onExcluir?: (notificacao: NotificacaoSetor) => void;
}

export const NotificacaoInfoModal: React.FC<NotificacaoInfoModalProps> = ({
  isOpen,
  notificacao,
  onClose,
  onMarcarComoLida,
  onExcluir,
}) => {
  const { theme } = useTheme();

  if (!isOpen || !notificacao) return null;

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

  const getTipoLabel = (tipo: NotificacaoSetor["tipo"]) => {
    switch (tipo) {
      case "evento_criado":
        return "Evento Criado";
      case "evento_editado":
        return "Evento Editado";
      case "evento_excluido":
        return "Evento Excluído";
      default:
        return "Notificação";
    }
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

  const handleMarcarComoLida = () => {
    if (onMarcarComoLida) {
      onMarcarComoLida(notificacao);
    }
    onClose();
  };

  const handleExcluir = () => {
    if (onExcluir) {
      onExcluir(notificacao);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className={`relative rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`px-6 py-4 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIconeNotificacao(notificacao.tipo)}
              <h2
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Detalhes da Notificação
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  notificacao.lida
                    ? theme === "dark"
                      ? "bg-green-900 text-green-300"
                      : "bg-green-100 text-green-800"
                    : theme === "dark"
                    ? "bg-blue-900 text-blue-300"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {notificacao.lida ? "Lida" : "Não lida"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === "dark"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                Setor: {notificacao.setorNome}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === "dark"
                    ? "bg-gray-600/50 text-gray-300"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                por {notificacao.autorNome}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Título
            </label>
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {notificacao.titulo}
            </h3>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Descrição
            </label>
            <p
              className={`text-sm leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {notificacao.descricao}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Tipo
              </label>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {getTipoLabel(notificacao.tipo)}
              </p>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Data e Hora
              </label>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {notificacao.dataHora.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                ID da Notificação
              </label>
              <p
                className={`text-sm font-mono ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                #{notificacao.id}
              </p>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Tempo Decorrido
              </label>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatarDataHora(notificacao.dataHora)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleMarcarComoLida}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {notificacao.lida ? "Marcar como não lida" : "Marcar como lida"}
            </button>
            <button
              onClick={handleExcluir}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Excluir
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
