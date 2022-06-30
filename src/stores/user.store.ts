import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    profile: null,
  }),
  getters: {
    isLoggedIn(state) {
      return state.profile != "";
    },
  },
  actions: {
    async getUserProfile(): Promise<void> {},
  },
});
