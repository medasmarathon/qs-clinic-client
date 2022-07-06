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
          round
          color="primary"
          icon="add"
          @click="addUser()"
        />
      </q-markup-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import dayjs from "dayjs";
import { useAdminStore } from "src/stores";
import { ProfileVM } from "src/viewModels/ProfileVM";
import { onBeforeMount } from "vue";

const adminStore = useAdminStore();

const userProfiles = ref<ProfileVM[]>([]);

onBeforeMount(() => {
  adminStore
    .getMultipleUsers()
    .then((profiles) => {
      if (profiles)
        userProfiles.value = profiles.map((profile) => {
          return {
            ...profile,
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
  console.log("delete" + user.id);
}

function editUser(user: ProfileVM) {
  console.log("edit" + user.id);
}

function addUser() {
  console.log("add user");
}
</script>

<style scoped></style>
