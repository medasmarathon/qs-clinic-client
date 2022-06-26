<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <q-card class="row items-center justify-evenly">
        <q-card-section class="row">
          <q-input
            filled
            label="Tên đăng nhập"
            disable
            stack-label
            class="col q-ma-sm"
            v-model="userProfile.username"
          />
          <q-input
            outlined
            stack-label
            :type="isPwd ? 'password' : 'text'"
            label="Mật khẩu mới"
            class="col q-ma-sm"
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

        <q-card-section class="row">
          <q-btn
            :color="isEditingPassword ? 'positive' : 'primary'"
            @click="enableEditPassword()"
            class="col q-ma-sm"
            outlined
          >
            Thay đổi mật khẩu
          </q-btn>
          <q-btn
            :color="isEditingPassword ? 'negative' : 'dark'"
            :disable="!isEditingPassword"
            @click="cancelEditPassword()"
            class="col q-ma-sm"
            outlined
            >Hủy</q-btn
          >
        </q-card-section>
      </q-card>
      <q-card class="row">
        <q-card-section class="row">
          <q-input
            outlined
            label="Họ tên"
            stack-label
            class="q-ma-sm col"
            v-model="userProfile.fullName"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Ngày sinh"
            class="q-ma-sm col"
            :modelValue="''"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Số điện thoại"
            class="q-ma-sm col"
            :modelValue="''"
            :disable="!isEditing"
          />
        </q-card-section>
        <q-separator inset />
        <q-card-section class="row">
          <q-input
            outlined
            label="Địa chỉ"
            stack-label
            class="q-ma-sm col"
            v-model="userProfile.addressLine1"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Tỉnh/ thành phố"
            class="q-ma-sm col"
            v-model="userProfile.cityProvince"
            :disable="!isEditing"
          />
          <q-input
            outlined
            stack-label
            label="Quận huyện"
            class="q-ma-sm col"
            :disable="!isEditing"
            v-model="userProfile.district"
          />
          <q-input
            outlined
            stack-label
            label="Phường xã"
            class="q-ma-sm col"
            v-model="userProfile.ward"
            :disable="!isEditing"
          />
        </q-card-section>
        <q-separator inset />
        <q-card-section class="row">
          <q-btn
            :color="isEditing ? 'positive' : 'primary'"
            @click="enableEdit()"
            outlined
            class="col"
          >
            Chỉnh sửa
          </q-btn>
          <q-btn
            :color="isEditing ? 'negative' : 'dark'"
            :disable="!isEditing"
            @click="cancelEdit()"
            outlined
            class="col"
            >Hủy</q-btn
          >
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { UserProfile } from "src/models/userProfile";
import { reactive, ref } from "vue";

const isPwd = ref(true);
const isEditing = ref(false);
const isEditingPassword = ref(false);
const newPwd = ref("");
const userProfile = reactive<UserProfile>({ username: "" });

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
