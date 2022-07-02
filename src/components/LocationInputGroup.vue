<template>
  <div class="row">
    <q-input
      outlined
      label="Địa chỉ"
      stack-label
      class="q-ma-xs col-md"
      :model-value="addressLine1"
      @update:model-value="
        (val) => {
          $emit('update:addressLine1', val);
        }
      "
      :disable="!isEditing"
    />
    <q-input
      outlined
      stack-label
      label="Tỉnh/ thành phố"
      class="q-ma-xs col-md"
      :model-value="cityProvince"
      @update:model-value="(val) => $emit('update:cityProvince', val)"
      :disable="!isEditing"
    />
    <q-input
      outlined
      stack-label
      label="Quận huyện"
      class="q-ma-xs col-md"
      :disable="!isEditing"
      :model-value="district"
      @update:model-value="(val) => $emit('update:district', val)"
    />
    <q-input
      outlined
      stack-label
      label="Phường xã"
      class="q-ma-xs col-md"
      :model-value="wardTown"
      @update:model-value="(val) => $emit('update:wardTown', val)"
      :disable="!isEditing"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, defineEmits } from "vue";

const props = defineProps<{
  isEditing: boolean;
  addressLine1?: string;
  wardTown?: string;
  district?: string;
  cityProvince?: string;
}>();

const emits = defineEmits([
  "update:addressLine1",
  "update:cityProvince",
  "update:district",
  "update:wardTown",
]);

// const location = reactive({
//   addressLine1: props.addressLine1,
//   wardTown: props.wardTown,
//   district: props.district,
//   cityProvince: props.cityProvince
// })
</script>

<style lang="scss" scoped></style>
