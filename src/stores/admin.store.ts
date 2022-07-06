import { defineStore } from "pinia";
import { API, BASE_URL } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { UserProfileResponse } from "src/DTOs/response/UserProfileResponse";
import { Profile } from "src/models/Profile";
import { UpdateUserProfileRequest } from "src/DTOs/request/UpdateUserProfileRequest";
import { ref } from "vue";
import { useUserStore } from "./user.store";

export const useAdminStore = defineStore("admin", () => {
  const users = ref<Profile[]>([]);

  const userStore = useUserStore();

  async function getMultipleUsers(
    page?: number,
    limit?: number
  ): Promise<Profile[] | null> {
    let userProfileList;
    let searchParams = new URLSearchParams();
    if (page) searchParams.set("page", page.toString());
    if (limit) searchParams.set("limit", limit.toString());
    if (!!searchParams.toString())
      userProfileList = await httpRequest.get<UserProfileResponse[]>(
        `${BASE_URL}${API.Admin.MultipleUsers}?${searchParams}`
      );
    else
      userProfileList = await httpRequest.get<UserProfileResponse[]>(
        `${BASE_URL}${API.Admin.MultipleUsers}`
      );
    console.log(userProfileList);
    if (userProfileList) {
      users.value = userProfileList.map(userStore.mapResponseToProfile);
      return users.value;
    }
    return null;
  }

  async function getUserById(id: string): Promise<Profile | null> {
    let userProfile = await httpRequest.get<UserProfileResponse>(
      `${BASE_URL}${API.Admin.SingleUser}/${id}`
    );
    console.log(userProfile);
    if (userProfile) {
      let profile = userStore.mapResponseToProfile(userProfile);
      return profile;
    }
    return null;
  }

  return { users, getMultipleUsers, getUserById };
});
