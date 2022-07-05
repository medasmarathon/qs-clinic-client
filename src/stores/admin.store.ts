import { defineStore } from "pinia";
import { API, BASE_URL } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { UserProfileResponse } from "src/DTOs/response/UserProfileResponse";
import { Profile } from "src/models/Profile";
import { UpdateUserProfileRequest } from "src/DTOs/request/UpdateUserProfileRequest";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    profile: null as Profile | null,
  }),
  getters: {},
  actions: {
    async getAllUsers(): Promise<Profile | null> {
      let userProfile =
        this.profile ??
        (await httpRequest.get<UserProfileResponse>(
          `${BASE_URL}${API.UserProfile}`
        ));
      console.log(userProfile);
      if (userProfile) {
        this.profile = new Profile();
        this.profile = { ...userProfile };
        return this.profile;
      }
      return null;
    },
    async updateUserProfile(
      updateProfileRequest: UpdateUserProfileRequest
    ): Promise<Profile | null> {
      let userProfile = await httpRequest.put<UserProfileResponse>(
        `${BASE_URL}${API.UserProfile}`,
        updateProfileRequest
      );
      console.log(userProfile);
      if (userProfile) {
        this.profile = new Profile();
        this.profile = { ...userProfile };
        return this.profile;
      }
      return null;
    },
  },
});
