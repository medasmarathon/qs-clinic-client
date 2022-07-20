<template>
  <q-page class="q-pa-md">
    <q-toolbar class="row">
      <q-input
        outline
        v-model="patientBarcode"
        label="Nhập mã barcode bệnh nhân"
        class="q-pa-sm q-ma-xs"
        @keyup="(e) => (e.key === 'Enter' ? barcodeEnter() : null)"
      ></q-input>
      <q-btn
        outline
        color="primary"
        class="q-pa-sm q-ma-xs"
        @click="barcodeEnter"
      >
        Tìm
      </q-btn>
      <q-space />
      <q-btn outline color="primary" class="q-pa-sm q-ma-xs">
        Thêm bệnh nhân
      </q-btn>
    </q-toolbar>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

const patientBarcode = ref("");

function barcodeEnter() {
  console.log("Barcode enter");
}
</script>

<style scoped></style>
