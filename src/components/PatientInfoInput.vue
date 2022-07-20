<template>
  <q-card>
    <q-card class="items-center justify-evenly">
      <q-input
        outlined
        label="Mã code bệnh nhân"
        disable
        stack-label
        class="col-md q-ma-xs"
        v-model="patientCode"
      />
    </q-card>
    <q-separator />
    <q-card class="items-center justify-evenly">
      <q-input
        outlined
        label="Họ tên"
        disable
        stack-label
        class="col-md q-ma-xs"
        v-model="fullName"
      />
    </q-card>
  </q-card>
</template>

<script setup lang="ts">
import { HumanName, Identifier, Patient } from "fhir/r5";
import { toRef, computed, ref } from "vue";
import { CLINIC_NAME } from "src/globals";

const props = defineProps({
  patientModel: Object as () => Patient,
});
const patientModelProps = toRef(props, "patientModel");
const emits = defineEmits(["update:patient", "confirm"]);

const patient = ref(patientModelProps.value);

const patientCode = computed({
  get() {
    let ptCode = patient.value?.identifier?.find(
      (id) => id.use === "official" && id.assigner === CLINIC_NAME
    );
    return ptCode ? ptCode.id : "";
  },
  set(newValue) {
    let existingPtCode = patient.value?.identifier?.find(
      (id) => id.use === "official" && id.assigner === CLINIC_NAME
    );
    if (existingPtCode) {
      existingPtCode.id = newValue;
    } else {
      patient.value?.identifier?.push({
        use: "official",
        assigner: CLINIC_NAME,
        id: newValue,
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
</script>

<style scoped></style>
