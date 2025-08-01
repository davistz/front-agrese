export const localStorageUtils = {
  // Auth
  getAuthUser: () => {
    try {
      const user = localStorage.getItem("authUser");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setAuthUser: (user: any) => {
    try {
      localStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar usuário no localStorage:", error);
    }
  },

  removeAuthUser: () => {
    try {
      localStorage.removeItem("authUser");
    } catch (error) {
      console.error("Erro ao remover usuário do localStorage:", error);
    }
  },

  // Preferências do usuário
  getUserPreferences: () => {
    try {
      const prefs = localStorage.getItem("userPreferences");
      return prefs
        ? JSON.parse(prefs)
        : {
            theme: "light",
            language: "pt-BR",
            notifications: true,
            sidebarOpen: true,
          };
    } catch {
      return {
        theme: "light",
        language: "pt-BR",
        notifications: true,
        sidebarOpen: true,
      };
    }
  },

  setUserPreferences: (preferences: any) => {
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Erro ao salvar preferências no localStorage:", error);
    }
  },

  // Cache de dados para melhor performance
  getCachedData: (key: string) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);

      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  },

  setCachedData: (key: string, data: any, ttlMinutes = 30) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000,
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Erro ao salvar cache no localStorage:", error);
    }
  },

  // Limpeza geral
  clearUserData: () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith("auth") ||
            key.startsWith("user") ||
            key.startsWith("cache_"))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Erro ao limpar dados do localStorage:", error);
    }
  },

  // Informações do dispositivo/sessão
  getSessionInfo: () => {
    try {
      const info = localStorage.getItem("sessionInfo");
      return info ? JSON.parse(info) : null;
    } catch {
      return null;
    }
  },

  setSessionInfo: (info: {
    loginTime: Date;
    userAgent: string;
    ipAddress?: string;
    deviceInfo?: string;
  }) => {
    try {
      localStorage.setItem("sessionInfo", JSON.stringify(info));
    } catch (error) {
      console.error("Erro ao salvar informações da sessão:", error);
    }
  },
};
