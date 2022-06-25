<template>
  <n-space justify="center" align="center" class="login-form">
    <n-card>
      <n-space vertical justify="center">
        <n-form :model="loginValue">
          <n-form-item-row label="Tên đăng nhập">
            <n-input clear-input v-model:value="loginValue.username"></n-input>
          </n-form-item-row>
          <n-form-item-row label="Mật khẩu">
            <n-input
              clear-input
              type="password"
              v-model:value="loginValue.password"
            ></n-input>
          </n-form-item-row>
        </n-form>
        <n-text v-if="state.errorMessage != ''" type="error">
          {{ state.errorMessage }}
        </n-text>
        <n-button type="info" @click="submit">Đăng nhập</n-button>
      </n-space>
    </n-card>
  </n-space>
</template>

<script lang="ts" setup>
import getErrorMessage from "src/infrastructure/errorHandling";
import { useAuthStore } from "src/stores";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";

const loginSchema = yup.object({
  username: yup.string().required("Tên đăng nhập không được để trống"),
  password: yup.string().required("Mật khẩu không được để trống"),
});

const state = reactive({ errorMessage: "" });
const router = useRouter();
const auth = useAuthStore();
const loginValue = ref({ username: "", password: "" });

async function submit() {
  await loginSchema
    .validate({
      username: loginValue.value.username,
      password: loginValue.value.password,
    })
    .then((values) => {
      state.errorMessage = "";
      return auth.login(values.username, values.password);
    })
    .catch((error) => {
      console.log(error);
      if (error && error.status === "UNAUTHORIZED") {
        state.errorMessage = "Thông tin đăng nhập không hợp lệ";
      } else {
        state.errorMessage = error.cause
          ? error.cause.message
          : getErrorMessage(error);
      }
    });
}
</script>

<style scoped>
.login-form {
  height: 100vh;
}
</style>
