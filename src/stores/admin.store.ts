import { defineStore } from "pinia";
import { API, BASE_URL } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { UserProfileResponse } from "src/DTOs/response/UserProfileResponse";
import { Profile } from "src/models/Profile";
import { UpdateUserProfileRequest } from "src/DTOs/request/UpdateUserProfileRequest";
import { ref } from "vue";
import { useUserStore } from "./user.store";
import { CreateUserProfileRequest } from "src/DTOs/request/CreateUserProfileRequest";

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
    if (userProfile) {
      let profile = userStore.mapResponseToProfile(userProfile);
      return profile;
    }
    return null;
  }

  async function createUserProfile(
    createRequest: CreateUserProfileRequest
  ): Promise<Profile | null> {
    let userProfile = await httpRequest.post<UserProfileResponse>(
      `${BASE_URL}${API.Admin.SingleUser}`,
      createRequest
    );
    if (userProfile) {
      let profile = userStore.mapResponseToProfile(userProfile);
      return profile;
    }
    return null;
  }

  async function updateUserProfile(
    updateProfileRequest: UpdateUserProfileRequest
  ): Promise<Profile | null> {
    let userProfile = await httpRequest.put<UserProfileResponse>(
      `${BASE_URL}${API.Admin.SingleUser}/${updateProfileRequest.id}`,
      updateProfileRequest
    );
    if (userProfile) {
      let profile = userStore.mapResponseToProfile(userProfile);
      return profile;
    }
    return null;
  }

  async function deleteUserById(id: string): Promise<string | null> {
    return await httpRequest.delete<string>(
      `${BASE_URL}${API.Admin.SingleUser}/${id}`
    );
  }

  return {
    users,
    getMultipleUsers,
    getUserById,
    createUserProfile,
    updateUserProfile,
    deleteUserById,
  };
});
