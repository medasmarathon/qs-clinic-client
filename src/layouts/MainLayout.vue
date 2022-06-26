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

        <div>Clinic</div>
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

function toggleLeftMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
