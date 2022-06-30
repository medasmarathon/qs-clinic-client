import { defineStore } from "pinia";
import { API } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { UserProfile } from "src/DTOs/UserProfile";
import { Profile } from "src/models/Profile";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    profile: null as Profile | null,
  }),
  getters: {
    getRoles: (state) => state.profile?.roles ?? [],
  },
  actions: {
    async getUserProfile(): Promise<UserProfile | null> {
      let userProfile = await httpRequest.get<UserProfile>(API.UserProfile);
      if (userProfile) {
        this.profile = new Profile();
        this.profile = { ...userProfile };
        return userProfile;
      }
      return null;
    },
  },
});
