<template>
  <q-card>
    <q-card class="items-center justify-evenly">
      <q-card-section>
        <div class="text-h6">Thông tin đăng nhập</div>
      </q-card-section>
      <q-card-section class="row">
        <q-input
          filled
          label="Tên đăng nhập"
          disable
          stack-label
          class="col-md q-ma-xs"
          v-model="userProfile.username"
        />
        <q-input
          outlined
          stack-label
          :type="isPwd ? 'password' : 'text'"
          label="Mật khẩu mới"
          class="col-md q-ma-xs"
          :class="{ hidden: !isEditingPassword }"
          v-model="newPwd"
          :disable="!isEditingPassword"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions class="row">
        <div class="col-xs-12 col-md-auto row q-pa-xs">
          <q-btn
            :color="isEditingPassword ? 'positive' : 'primary'"
            @click="isEditingPassword ? confirm() : enableEditPassword()"
            class="col-xs-12"
            outline
          >
            {{ isEditingPassword ? "Xác nhận" : "Thay đổi mật khẩu" }}
          </q-btn>
        </div>

        <div class="col-xs-12 col-md-auto row q-pa-xs">
          <q-btn
            color="negative"
            :class="{ hidden: !isEditingPassword }"
            @click="cancelEditPassword()"
            class="col-xs-12"
            outline
          >
            Hủy
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>

    <q-separator inset />
    <q-card class="items-center justify-evenly">
      <q-card-section>
        <div class="text-h6">Thông tin cá nhân</div>
      </q-card-section>
      <q-card-section class="row">
        <q-input
          outlined
          label="Họ tên"
          stack-label
          class="q-ma-xs col-md"
          v-model="userProfile.fullname"
          :disable="!isEditing"
        />
      </q-card-section>
      <q-card-section class="row">
        <q-input
          outlined
          stack-label
          label="Ngày sinh"
          class="q-ma-xs col-md"
          v-model="userProfile.birthdate"
          :disable="!isEditing"
        >
          <template v-slot:prepend>
            <q-icon name="event">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="userProfile.birthdate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          label="Số điện thoại"
          outlined
          multiple
          use-chips
          v-model="userProfile.phone"
          use-input
          hide-dropdown-icon
          @new-value="createNewPhoneNumber"
          class="q-ma-xs col-md"
          :disable="!isEditing"
        />
        <q-input
          outlined
          stack-label
          label="Email"
          class="q-ma-xs col-md"
          v-model="userProfile.email"
          :disable="!isEditing"
        />
      </q-card-section>
      <q-card-section class="row">
        <location-input
          v-model:is-editing="isEditing"
          v-model:address-line1="userProfile.addressLine1"
          v-model:location="userProfile.location"
        >
        </location-input>
      </q-card-section>
      <q-card-actions class="row">
        <div class="col-xs-12 col-md-auto row q-pa-xs">
          <q-btn
            :color="isEditing ? 'positive' : 'primary'"
            @click="isEditing ? confirm() : enableEdit()"
            outline
            class="col-xs-12"
          >
            {{ isEditing ? "Xác nhận" : "Chỉnh sửa" }}
          </q-btn>
        </div>

        <div class="col-xs-12 col-md-auto row q-pa-xs">
          <q-btn
            color="negative"
            @click="cancelEdit()"
            outline
            :class="{ hidden: !isEditing }"
            class="col-xs-12"
          >
            Hủy
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-card>
</template>

<script setup lang="ts">
import { ProfileVM } from "src/viewModels/ProfileVM";
import LocationInput from "src/components/LocationInput.vue";
import { ref, toRef } from "vue";

const props = defineProps<{ profile: ProfileVM }>();
const emits = defineEmits(["update:profile", "confirm"]);
const userProfile = toRef(props, "profile");

const isPwd = ref(true);
const isEditing = ref(false);
const isEditingPassword = ref(false);
const newPwd = ref("");

function createNewPhoneNumber(phoneNumber: string, done: Function) {
  done(phoneNumber, "add-unique");
}
function enableEdit() {
  isEditing.value = true;
}
function cancelEdit() {
  isEditing.value = false;
}
function enableEditPassword() {
  isEditingPassword.value = true;
}
function cancelEditPassword() {
  isEditingPassword.value = false;
}
function confirm() {
  cancelEdit();
  cancelEditPassword();
  emits("update:profile", userProfile);
  emits("confirm", userProfile);
}
</script>

<style scoped></style>
