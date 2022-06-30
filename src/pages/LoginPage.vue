<template>
  <q-layout>
    <q-page-container>
      <q-page class="row items-center justify-evenly">
        <q-card>
          <q-card-section>
            <q-form @submit="submit" class="q-gutter-md">
              <q-input
                outlined
                v-model="loginValue.username"
                label="Tên đăng nhập"
              />
              <q-input
                outlined
                v-model="loginValue.password"
                :type="isPwd ? 'password' : 'text'"
                label="Mật khẩu"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-form>
            <q-banner
              v-if="state.errorMessage != ''"
              inline-actions
              class="text-white bg-red q-mt-sm q-mb-sm"
            >
              {{ state.errorMessage }}
            </q-banner>
            <q-btn color="primary" @click="submit()" class="q-mt-sm">
              Đăng nhập
            </q-btn>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import getErrorMessage from "src/infrastructure/errorHandling";
import Router from "src/router";
import { useAuthStore } from "src/stores";
import { onBeforeMount, reactive, ref } from "vue";
import * as yup from "yup";

const loginSchema = yup.object({
  username: yup.string().required("Tên đăng nhập không được để trống"),
  password: yup.string().required("Mật khẩu không được để trống"),
});

const state = reactive({ errorMessage: "" });
const auth = useAuthStore();
const loginValue = ref({ username: "", password: "" });
const isPwd = ref(true);

onBeforeMount(() => {
  if (auth.isLoggedIn) {
    Router.push("/home");
  }
});

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
