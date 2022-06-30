import { defineStore } from "pinia";
import { API } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { UserProfile } from "src/DTOs/response/UserProfile";
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
    async getUserProfile(): Promise<Profile | null> {
      let userProfile =
        this.profile ??
        (await httpRequest.get<UserProfile>(
          `${process.env.VUE_APP_CLINIC_URL}${API.UserProfile}`
        ));
      console.log(userProfile);
      if (userProfile) {
        this.profile = new Profile();
        this.profile = { ...userProfile };
        return this.profile;
      }
      return null;
    },
    async updateUserProfile(profile: Profile): Promise<Profile | null> {
      return null;
    },
  },
});
