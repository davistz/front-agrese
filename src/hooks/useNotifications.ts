import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { notificationServices } from "../services/notificationsServices";
import { NotificationData, NotificationFormData } from "../types/interfaces";

export interface NotificacaoSetor {
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

export const useNotifications = () => {
  const { user, hasPermission } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar notificações do backend
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      console.log('[useNotifications] Usuário não autenticado, não buscando notificações');
      return;
    }
    
    console.log('[useNotifications] Buscando notificações do backend...');
    setLoading(true);
    try {
      const data = await notificationServices.getNotifications();
      console.log('[useNotifications] Resposta do backend:', data);
      
      // Verificar estrutura da resposta
      let notificationsArray = [];
      if (Array.isArray(data)) {
        notificationsArray = data;
      } else if (data.notifications && Array.isArray(data.notifications)) {
        notificationsArray = data.notifications;
      } else if (data.data && Array.isArray(data.data)) {
        notificationsArray = data.data;
      } else {
        console.warn('[useNotifications] Estrutura de resposta desconhecida:', data);
        notificationsArray = [];
      }
      
      console.log(`[useNotifications] ${notificationsArray.length} notificações encontradas`);
      
      const parsed = notificationsArray.map((notification: any) => ({
        ...notification,
        createdAt: notification.createdAt ? new Date(notification.createdAt) : new Date(),
        readAt: notification.readAt ? new Date(notification.readAt) : undefined,
        scheduledFor: notification.scheduledFor ? new Date(notification.scheduledFor) : undefined,
      }));
      
      console.log('[useNotifications] Notificações parseadas:', parsed);
      setNotifications(parsed);
      setError(null);
    } catch (err: any) {
      console.error("[useNotifications] Erro ao buscar notificações:", err);
      console.error("[useNotifications] Detalhes do erro:", err.response?.data || err.message);
      setError("Erro ao carregar notificações");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Criar nova notificação
  const createNotification = useCallback(async (notificationData: NotificationFormData) => {
    try {
      const created = await notificationServices.createNotification(notificationData);
      const parsed = {
        ...created,
        createdAt: new Date(created.createdAt),
        readAt: created.readAt ? new Date(created.readAt) : undefined,
        scheduledFor: created.scheduledFor ? new Date(created.scheduledFor) : undefined,
      };
      setNotifications(prev => [parsed, ...prev]);
      return created;
    } catch (err) {
      console.error("Erro ao criar notificação:", err);
      setError("Erro ao criar notificação");
      throw err;
    }
  }, []);

  // Marcar como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationServices.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === parseInt(notificationId) 
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      );
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      setError("Erro ao marcar como lida");
    }
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationServices.markAllAsRead(user?.id.toString());
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          isRead: true, 
          readAt: new Date() 
        }))
      );
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      setError("Erro ao marcar todas como lidas");
    }
  }, [user?.id]);

  // Excluir notificação
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationServices.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== parseInt(notificationId))
      );
    } catch (err) {
      console.error("Erro ao excluir notificação:", err);
      setError("Erro ao excluir notificação");
    }
  }, []);

  // Buscar contagem de não lidas
  const getUnreadCount = useCallback(async (): Promise<number> => {
    try {
      const data = await notificationServices.getUnreadCount(user?.id.toString());
      return data.count || 0;
    } catch (err) {
      console.error("Erro ao buscar contagem de não lidas:", err);
      return 0;
    }
  }, [user?.id]);

  // Carregar notificações ao montar componente
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling para atualizações em tempo real (opcional)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Busca a cada 30 segundos

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  // Computar valores derivados
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Manter compatibilidade com interface legacy
  const notificacoes: NotificacaoSetor[] = notifications.map(notification => {
    console.log('[useNotifications] Convertendo notificação:', notification);
    return {
      id: notification.id.toString(),
      titulo: notification.title || "Notificação",
      descricao: notification.message || "",
      tipo: notification.type === "EVENT_CREATED" ? "evento_criado" : 
            notification.type === "EVENT_UPDATED" ? "evento_editado" : "evento_excluido",
      lida: notification.isRead || false,
      dataHora: notification.createdAt || new Date(),
      setorId: notification.sectorId || 0,
      setorNome: notification.metadata?.sectorName || "Setor não informado",
      autorId: notification.metadata?.createdBy || 0,
      autorNome: notification.metadata?.authorName || "Sistema",
      eventoId: notification.eventId?.toString(),
      eventoTitulo: notification.metadata?.eventTitle || "",
    };
  });
  
  console.log(`[useNotifications] ${notificacoes.length} notificações no formato legacy`);

  const marcarComoLida = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const marcarComoLidaApenas = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const marcarTodasComoLidas = () => {
    markAllAsRead();
  };

  const excluirNotificacao = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  return {
    // Nova interface
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,

    // Interface legacy para compatibilidade
    notificacoes,
    notificacoesNaoLidas: unreadCount,
    contadorAtualizado: 0, // Mantido para compatibilidade
    setNotificacoes: setNotifications,
    marcarComoLida,
    marcarComoLidaApenas,
    marcarTodasComoLidas,
    excluirNotificacao,
  };
};
