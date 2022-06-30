<template>
  <q-page class="row items-center justify-evenly">
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
          <q-btn
            :color="isEditingPassword ? 'positive' : 'primary'"
            @click="enableEditPassword()"
            class="col-12 col-md-auto q-mb-sm"
            outline
          >
            {{ isEditingPassword ? "Xác nhận" : "Thay đổi mật khẩu" }}
          </q-btn>
          <q-btn
            color="negative"
            :class="{ hidden: !isEditingPassword }"
            @click="cancelEditPassword()"
            class="col-12 col-md-auto q-mb-sm"
            outline
            >Hủy</q-btn
          >
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
            v-model="userProfile.fullName"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Ngày sinh"
            class="q-ma-xs col-md"
            :modelValue="''"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Số điện thoại"
            class="q-ma-xs col-md"
            :modelValue="''"
            :disable="!isEditing"
          />
        </q-card-section>
        <q-card-section class="row">
          <q-input
            outlined
            label="Địa chỉ"
            stack-label
            class="q-ma-xs col-md"
            v-model="userProfile.addressLine1"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Tỉnh/ thành phố"
            class="q-ma-xs col-md"
            v-model="userProfile.cityProvince"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Quận huyện"
            class="q-ma-xs col-md"
            :disable="!isEditing"
            v-model="userProfile.district"
          />
          <q-input
            outlined
            stack-label
            label="Phường xã"
            class="q-ma-xs col-md"
            v-model="userProfile.ward"
            :disable="!isEditing"
          />
        </q-card-section>
        <q-card-actions class="row">
          <q-btn
            :color="isEditing ? 'positive' : 'primary'"
            @click="enableEdit()"
            outline
            class="col-12 col-md-auto"
          >
            {{ isEditing ? "Xác nhận" : "Chỉnh sửa" }}
          </q-btn>
          <q-btn
            color="negative"
            @click="cancelEdit()"
            outline
            :class="{ hidden: !isEditing }"
            class="col-12 col-md-auto"
            >Hủy</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Profile } from "src/models/Profile";
import { reactive, ref } from "vue";

const isPwd = ref(true);
const isEditing = ref(false);
const isEditingPassword = ref(false);
const newPwd = ref("");
const userProfile = reactive<Profile>({ username: "" });

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
</script>

<style lang="scss" scoped></style>
