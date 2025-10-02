import api from "./api";
export const userServices = {
    getUsers: async () => {
        try {
            const response = await api.get("/users")
            return response.data
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },
    getUserbyId: async (id: string) => {
        try {
            const response = await api.get(`/users/${id}`)
            return response.data
        } catch (error) {
            console.error("Error fetching user by ID:", error);
        }
    },
    postUser: async (userData: any) => {
        try {
            const response = await api.post("/users", userData)
            return response.data
        } catch (error) {
            console.error("Error creating user:", error);
        }
    },
    putUser: async (id: string, userData: any) => {
        try {
            const response = await api.put(`/users/${id}`, userData)
            return response.data
        } catch (error) {
            console.error("Error updating user:", error);
        }
    },
    deleteUser: async (id: string) => {
        try {
            const response = await api.delete(`/users/${id}`)
            return response.data
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
}