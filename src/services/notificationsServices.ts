import api from "./api";

export const notificationServices = {
    getNotifications: async () => {
        try {
            console.log('[notificationServices] Fazendo requisição GET /notifications');
            const response = await api.get("/notifications");
            console.log('[notificationServices] Resposta recebida:', response);
            console.log('[notificationServices] Data:', response.data);
            return response.data;
        } catch (error: any) {
            console.error("[notificationServices] Error fetching notifications:", error);
            console.error("[notificationServices] Error details:", error.response?.data || error.message);
            throw error;
        }
    },
    getNotificationById: async (id: string) => {
        try {
            const response = await api.get(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching notification by ID:", error);
            throw error;
        }
    },
    createNotification: async (notificationData: any) => {
        try {
            const response = await api.post("/notifications", notificationData);
            return response.data;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    },
    updateNotification: async (id: string, notificationData: any) => {
        try {
            const response = await api.put(`/notifications/${id}`, notificationData);
            return response.data;
        } catch (error) {
            console.error("Error updating notification:", error);
            throw error;
        }
    },
    deleteNotification: async (id: string) => {
        try {
            const response = await api.delete(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    },
    markAsRead: async (id: string) => {
        try {
            const response = await api.patch(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    },
    markAllAsRead: async (userId?: string) => {
        try {
            const url = userId ? `/notifications/read-all?userId=${userId}` : "/notifications/read-all";
            const response = await api.patch(url);
            return response.data;
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw error;
        }
    },
    getUnreadCount: async (userId?: string) => {
        try {
            const url = userId ? `/notifications/unread-count?userId=${userId}` : "/notifications/unread-count";
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching unread notifications count:", error);
            throw error;
        }
    }
};