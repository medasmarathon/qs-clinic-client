<template>
  <q-card>
    <q-card-section class="items-center justify-evenly">
      <q-input
        outlined
        label="Mã code bệnh nhân"
        disable
        stack-label
        class="col-md q-ma-xs"
        v-model="patientCode"
      />
    </q-card-section>
    <q-separator />
    <q-card-section class="items-center justify-evenly">
      <q-input
        outlined
        label="Họ tên"
        disable
        stack-label
        class="col-md q-ma-xs"
        v-model="fullName"
      />
      <q-select
        label="Giới tính"
        :options="genderOptions"
        v-model="gender"
        class="q-ma-xs col-md"
      />
    </q-card-section>
    <q-card-actions class="row">
      <div class="col-xs-12 col-md-auto row q-pa-xs">
        <q-btn color="positive" @click="confirm()" outline class="col-xs-12">
          Xác nhận
        </q-btn>
      </div>

      <div class="col-xs-12 col-md-auto row q-pa-xs">
        <q-btn color="negative" @click="cancel()" outline class="col-xs-12">
          Hủy
        </q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { HumanName, Identifier, Patient } from "fhir/r5";
import { toRef, computed, ref } from "vue";
import { CLINIC_NAME } from "src/globals";
import { uniqueId } from "lodash";

const props = defineProps({
  patientModel: {
    type: Object as () => Patient,
    default: {} as Patient,
  },
});
const patientModelProps = toRef(props, "patientModel");
const emits = defineEmits(["update:patientModel", "confirm", "cancel"]);

const patient = ref(patientModelProps.value);

function cancel() {
  emits("cancel");
}
function confirm() {
  emits("update:patientModel", patient.value ?? {});
  emits("confirm");
}
const patientCode = computed({
  get() {
    let ptCode = patient.value?.identifier?.find(
      (id) => id.use === "official" && id.assigner === CLINIC_NAME
    );
    return ptCode ? ptCode.value : "";
  },
  set(newValue) {
    let existingPtCode = patient.value?.identifier?.find(
      (id) => id.use === "official" && id.assigner === CLINIC_NAME
    );
    if (existingPtCode) {
      existingPtCode.id = newValue;
    } else {
      patient.value?.identifier?.push({
        id: uniqueId(),
        use: "official",
        assigner: CLINIC_NAME,
        value: newValue,
      } as Identifier);
    }
  },
});
const fullName = computed({
  get() {
    let humanName = patient.value?.name?.find((n) => n.use === "official");
    return humanName
      ? `${humanName?.family} ${humanName?.given?.join(" ")}`
      : "";
  },
  set(newValue) {
    let existingHumanName = patient.value?.name?.find(
      (n) => n.use === "official"
    );
    let nameParts = newValue.split(" ");
    let humanName: HumanName = {
      use: "official",
      family: nameParts[0],
      given: nameParts.splice(1, nameParts.length - 1),
    };
    if (existingHumanName) {
      existingHumanName = humanName;
    } else {
      patient.value?.name?.push(humanName);
    }
  },
});
const gender = computed({
  get: () => patient.value.gender,
  set: (newValue) => {
    patient.value.gender = newValue;
  },
});

const genderOptions = ["male", "female", "other", "unknown"];
</script>

<style scoped></style>
