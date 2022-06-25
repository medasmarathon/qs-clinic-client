import { defineStore } from "pinia";

import { httpRequest } from "src/infrastructure/request";
import getErrorMessage from "src/infrastructure/errorHandling";
import { useRouter } from "vue-router";

const baseUrl = `${process.env.VUE_APP_CLINIC_URL}/auth`;

class LoginResponse {
  status!: "SUCCESS" | "ERROR" | "UNAUTHORIZED";
  message!: string;
  token?: string;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    accessToken: localStorage.getItem("accessToken") ?? "",
    returnUrl: null,
  }),
  getters: {
    isLoggedIn(state) {
      return state.accessToken != "";
    },
  },
  actions: {
    async login(username: string, password: string): Promise<void> {
      const router = useRouter();
      const loginResponse = await httpRequest.post<LoginResponse>(
        `${baseUrl}/login`,
        {
          username,
          password,
        }
      );

      if (!loginResponse.token) {
        throw new Error(loginResponse.status);
      }
      // update pinia state
      this.accessToken = loginResponse.token;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem("accessToken", JSON.stringify(loginResponse.token));

      // redirect to previous url or default to home page
      router.push(this.returnUrl || "/home");
    },
    logout() {
      const router = useRouter();
      this.accessToken = "";
      localStorage.removeItem("accessToken");
      router.push("/login");
    },
  },
});
