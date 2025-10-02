import api from "./api";
export const sectorServices = {
    getSectors: async () => {
        try {
            const response = await api.get("/sectors")
            return response.data
        } catch (error) {
            console.error("Error fetching sectors:", error);
        }
    },
    getSectorsbyId: async (id: number) => {
        try {
            const response = await api.get(`/sectors/${id}`)
            return response.data
        } catch (error) {
            console.error("Error fetching sectors by ID:", error);
        }
    },
    postSector: async (sectorsData: any) => {
        try {
            const response = await api.put("/sectors", sectorsData)
            return response.data
        } catch (error) {
            console.error("Error post sectors:", error);
        }
    },
    putSector: async (id: number, sectorsData: any) => {
        try {
            const response = await api.put(`/sectors/${id}`, sectorsData)
            return response.data
        } catch (error) {
            console.error("Error updating sectors:", error);
        }
    },
    postSubSector: async (managerId: number, subSectorData: any) => {
        try {
        const response = await api.post(`/sectors/${managerId}/subsectors`, subSectorData);
        return response.data;
        } catch (error) {
        console.error("Error creating sub-sector:", error);
        }
    },
    deleteSector: async (id: number) => {
        try {
        const response = await api.delete(`/sectors/${id}`);
        return response.data;
        } catch (error) {
        console.error("Error deleting sector:", error);
        }
    },
    addMemberToSector: async (sectorId: number, memberData: any) => {
        try {
        const response = await api.post(`/sectors/${sectorId}/members`, memberData);
        return response.data;
        } catch (error) {
        console.error("Error adding member to sector:", error);
        }
    },

    removeMemberFromSector: async (sectorId: number, userId: number) => {
        try {
        const response = await api.delete(`/sectors/${sectorId}/members/${userId}`);
        return response.data;
        } catch (error) {
        console.error("Error removing member from sector:", error);
        }
    },
}