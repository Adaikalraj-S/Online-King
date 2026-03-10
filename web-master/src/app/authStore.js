import axios from "../../axios";
import create from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  error: null,

  checkLocalStorageAndVerifyToken: async () => {
    const token = localStorage.getItem("onlineKingWebToken");

    if (!token) {
      set({ isAuthenticated: false, error: "Token not found in localStorage" });
      return;
    }

    try {
      const response = await axios.get("/api/verify-token", {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        set({ isAuthenticated: true, error: null });
      } else {
        set({ isAuthenticated: false, error: "Token verification failed" });
      }
    } catch (error) {
      set({ isAuthenticated: false, error: error.message });
    }
  },

  clearAuthentication: () => {
    localStorage.removeItem("onlineKingWebToken");
    set({ isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;
