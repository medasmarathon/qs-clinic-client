<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          stretch
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftMenu"
        />
        <q-separator dark vertical inset />

        <q-toolbar-title> Phòng khám </q-toolbar-title>

        <q-space />

        <q-btn-dropdown stretch flat label="Quản lý">
          <q-list>
            <menu-link
              v-for="link in adminLinks"
              :key="link.title"
              v-bind="link"
            />
          </q-list>
        </q-btn-dropdown>
        <q-btn color="white" round flat icon="account_circle">
          <q-menu>
            <q-list style="min-width: 100px">
              <menu-link
                title="Thông tin cá nhân"
                link="/home/profile"
              ></menu-link>
              <q-separator inset spaced />
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
        <menu-link v-for="link in mainLinks" :key="link.title" v-bind="link" />
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

const mainLinks = [
  {
    title: "Tiếp nhận",
    link: "/home/reception",
  },
  {
    title: "Khám",
    link: "/home/examination",
  },
  {
    title: "Tra cứu kết quả",
    link: "/home/review",
  },
  {
    title: "Cấp phát thuốc",
    link: "/home/pharmacy",
  },
  {
    title: "Kế toán",
    link: "/home/accounting",
  },
];

const adminLinks = [
  {
    title: "Quản lý nhân sự",
    link: "/admin/user-management",
    icon: "manage_accounts",
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
