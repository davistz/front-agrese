import api from "./api";
export const eventservices = {
    getEvents: async () => {
        try {
            const response = await api.get("/events")
            return response.data
        } catch (error) {
            console.error("Error fetching events:", error);
            throw error;
        }
    },
    getEventsbyId: async (id: string) => {
        try {
            const response = await api.get(`/events/${id}`)
            return response.data
        } catch (error) {
            console.error("Error fetching events by ID:", error);
            throw error;
        }
    },
    postEvents: async (eventsData: any) => {
        try {
            console.log('[postEvents] Enviando dados:', eventsData);
            const response = await api.post("/events", eventsData)
            console.log('[postEvents] Resposta do backend:', response.data);
            return response.data
        } catch (error) {
            console.error("Error creating events:", error);
            throw error;
        }
    },
    putEvents: async (id: string, eventsData: any) => {
        try {
            console.log('[putEvents] Atualizando evento:', id, eventsData);
            const response = await api.put(`/events/${id}`, eventsData)
            console.log('[putEvents] Resposta do backend:', response.data);
            return response.data
        } catch (error) {
            console.error("Error updating events:", error);
            throw error;
        }
    },
    deleteEvents: async (id: string) => {
        try {
            const response = await api.delete(`/events/${id}`)
            return response.data
        } catch (error) {
            console.error("Error deleting events:", error);
            throw error;
        }
    }
}