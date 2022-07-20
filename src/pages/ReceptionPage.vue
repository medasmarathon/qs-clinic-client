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

    <q-card flat>
      <q-tabs
        v-model="tab"
        dense
        align="left"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="waitlist" label="Phòng chờ" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="waitlist">
          <q-markup-table separator="horizontal" flat>
            <thead>
              <tr>
                <th class="text-left">
                  <span class="text-body1">Số thứ tự</span>
                </th>
                <th class="text-right">
                  <span class="text-body1">Mã</span>
                </th>
                <th class="text-right">
                  <span class="text-body1">Họ tên bệnh nhân</span>
                </th>
                <th class="text-right">
                  <span class="text-body1">Số điện thoại</span>
                </th>
                <th class="text-right">
                  <span class="text-body1">Tình trạng khám</span>
                </th>
                <th class="text-right">
                  <span class="text-body1">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patientInfo in patientReceptionInfoList">
                <td class="text-left">{{ patientInfo.orderNumber }}</td>
                <td class="text-right">{{ patientInfo.code }}</td>
                <td class="text-right">{{ patientInfo.fullname }}</td>
                <td class="text-right">
                  <q-chip
                    v-for="phone in patientInfo.telecom"
                    size="md"
                    outline
                    color="primary"
                    text-color="white"
                    :label="phone"
                  >
                  </q-chip>
                </td>
                <td class="text-right">
                  {{ patientInfo.visitStatus }}
                </td>
                <td class="text-right">Thao tác</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

const patientBarcode = ref("");
const tab = ref("waitlist");

function barcodeEnter() {
  console.log("Barcode enter");
}

const patientReceptionInfoList = ref();
</script>

<style scoped></style>
