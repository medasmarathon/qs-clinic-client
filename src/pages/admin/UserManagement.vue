<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-markup-table separator="horizontal" flat bordered>
        <thead>
          <tr>
            <th class="text-left">Username</th>
            <th class="text-right">Họ tên</th>
            <th class="text-right">Email</th>
            <th class="text-right">Vị trí</th>
            <th class="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="profile in userProfiles">
            <td class="text-left">{{ profile.username }}</td>
            <td class="text-right">{{ profile.fullname }}</td>
            <td class="text-right">{{ profile.email }}</td>
            <td class="text-right">
              <q-badge
                v-for="role in profile.roles"
                outline
                color="primary"
                :label="role.role_name?.toString()"
              />
            </td>
            <td class="text-right">
              <q-btn
                class="gt-xs"
                flat
                dense
                round
                color="negative"
                icon="delete"
                @click="deleteUser(profile)"
              />
              <q-btn
                class="gt-xs"
                flat
                dense
                round
                color="positive"
                icon="edit"
                @click="editUser(profile)"
              />
            </td>
          </tr>
        </tbody>
        <q-btn
          class="q-pa-md"
          flat
          dense
          outline
          color="primary"
          icon="add"
          @click="addUser()"
        >
          <template slot="prepend">
            <q-icon name="add" color="primary"></q-icon>
          </template>
          Thêm người dùng
        </q-btn>
      </q-markup-table>
    </q-card>

    <q-dialog v-model="isEditingUser">
      <div>
        <q-bar class="row items-center bg-primary text-white">
          <div class="text-h6">Chỉnh sửa thông tin người dùng</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-bar>
        <profile-input
          v-model:profile="currentEditedUser"
          @confirm="confirmEditUser"
          :for-new="!currentEditedUser.id"
        ></profile-input>
      </div>
    </q-dialog>

    <q-dialog v-model="isDeletingUser">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            Xác nhận xóa người dùng <b>{{ currentEditedUser.username }}</b> ?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="negative" v-close-popup />
          <q-btn
            flat
            label="Xác nhận"
            color="positive"
            @click="confirmDeleteUser(currentEditedUser)"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import dayjs from "dayjs";
import { useQuasar } from "quasar";
import ProfileInput from "src/components/ProfileInput.vue";
import { useAdminStore } from "src/stores";
import { ProfileVM } from "src/viewModels/ProfileVM";
import { onBeforeMount } from "vue";

const adminStore = useAdminStore();
const $q = useQuasar();

const userProfiles = ref<ProfileVM[]>([]);
const isEditingUser = ref(false);
const isDeletingUser = ref(false);
const currentEditedUser = ref<ProfileVM>(new ProfileVM());

onBeforeMount(() => {
  adminStore
    .getMultipleUsers()
    .then((profiles) => {
      if (profiles)
        userProfiles.value = profiles.map((profile) => {
          return {
            ...profile,
            phone: profile.phone ?? [],
            password: "",
            birthdate: dayjs(profile.birthdate)
              .locale(Intl.DateTimeFormat().resolvedOptions().locale)
              .format("YYYY MM DD"),
          };
        });
      console.log("Profiles" + JSON.stringify(userProfiles.value));
    })
    .catch((err) => console.log(err));
});

function deleteUser(user: ProfileVM) {
  isDeletingUser.value = true;
  currentEditedUser.value = user;
}

function editUser(user: ProfileVM) {
  isEditingUser.value = true;
  currentEditedUser.value = user;
}

function confirmEditUser(user: ProfileVM) {
  isEditingUser.value = false;
  console.log("edit " + JSON.stringify(user));
}

function confirmDeleteUser(user: ProfileVM) {
  console.log("delete " + user.id);
}

function addUser() {
  currentEditedUser.value = new ProfileVM();
  isEditingUser.value = true;
  console.log("add " + JSON.stringify(currentEditedUser.value));
}
</script>

<style scoped></style>
