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

    <q-dialog v-model="isConfirming" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"> Xác nhận cập nhật thông tin ? </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="negative" v-close-popup />
          <q-btn
            flat
            label="Xác nhận"
            color="positive"
            @click="submit()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Profile } from "src/models/Profile";
import { useUserStore } from "src/stores/user.store";
import { onBeforeMount, reactive, ref } from "vue";

const isPwd = ref(true);
const isEditing = ref(false);
const isEditingPassword = ref(false);
const isConfirming = ref(false);
const newPwd = ref("");
const userStore = useUserStore();
const userProfile = ref(new Profile());

onBeforeMount(() => {
  userStore
    .getUserProfile()
    .then((profile) => {
      console.log("Response" + profile);
      if (profile) userProfile.value = profile;
    })
    .catch((err) => console.log(err));
});

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
  console.log("confirm");
  isConfirming.value = true;
}
function submit() {
  isConfirming.value = false;
  console.log(userProfile);
}
</script>

<style lang="scss" scoped></style>
