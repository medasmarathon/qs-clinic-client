<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftMenu"
        />

        <q-toolbar-title> Phòng khám </q-toolbar-title>

        <q-btn color="white" round flat icon="account_circle">
          <q-menu>
            <q-list style="min-width: 100px">
              <menu-link
                title="Thông tin cá nhân"
                link="home/profile"
              ></menu-link>
              <q-separator />
              <q-item clickable v-close-popup @click="logout" class="text-red">
                <q-item-section>Đăng xuất</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable @click="toggleLeftMenu" color="danger">
          <q-icon name="clear" size="2em"></q-icon>
        </q-item>
        <q-item-label header> Danh mục </q-item-label>
        <menu-link
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import MenuLink from "components/MenuLink.vue";
import { useAuthStore } from "src/stores";

const essentialLinks = [
  {
    title: "Tiếp nhận",
    link: "/reception",
  },
  {
    title: "Khám",
    link: "/examination",
  },
  {
    title: "Tra cứu kết quả",
    link: "/review",
  },
  {
    title: "Cấp phát thuốc",
    link: "/pharmacy",
  },
  {
    title: "Kế toán",
    link: "/accounting",
  },
];

const leftDrawerOpen = ref(false);
const auth = useAuthStore();

function toggleLeftMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  return auth.logout();
}
</script>
