import api from "./api";
export const eventservices = {
    getEvents: async () => {
        try {
            const response = await api.get("/events")
            return response.data
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    },
    getEventsbyId: async (id: string) => {
        try {
            const response = await api.get(`/events/${id}`)
            return response.data
        } catch (error) {
            console.error("Error fetching events by ID:", error);
        }
    },
    postEvents: async (eventsData: any) => {
        try {
            const response = await api.post("/events", eventsData)
            return response.data
        } catch (error) {
            console.error("Error creating events:", error);
        }
    },
    putEvents: async (id: string, eventsData: any) => {
        try {
            const response = await api.put(`/events/${id}`, eventsData)
            return response.data
        } catch (error) {
            console.error("Error updating events:", error);
        }
    },
    deleteEvents: async (id: string) => {
        try {
            const response = await api.delete(`/events/${id}`)
            return response.data
        } catch (error) {
            console.error("Error deleting events:", error);
        }
    }
}