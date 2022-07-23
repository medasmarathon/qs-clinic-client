<template>
    <div>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
            <q-step
                :name="1"
                title="Thông tin hành chính bệnh nhân"
                icon="settings"
                :done="step > 1"
            >
                <patient-info-input
                    ref="patientInfoInput"
                    v-model:patient-model="patient"
                ></patient-info-input>
            </q-step>

            <q-step
                :name="2"
                title="Thông tin khám bệnh"
                icon="local_hospital"
                :done="step > 2"
            >
                Lý do đến khám + tạm ứng
            </q-step>

            <template v-slot:navigation>
                <q-stepper-navigation>
                    <q-btn
                        @click="nextStep()"
                        color="primary"
                        :label="step === 2 ? 'Hoàn tất' : 'Tiếp tục'"
                    />
                    <q-btn
                        v-if="step > 1"
                        flat
                        color="primary"
                        @click="($refs.stepper as QStepper).previous()"
                        label="Quay lại"
                        class="q-ml-sm"
                    />
                </q-stepper-navigation>
            </template>
        </q-stepper>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { QStepper } from "quasar";
import { Patient } from "fhir/r5";
import PatientInfoInput from "./PatientInfoInput.vue";

const step = ref(1);
const stepper = ref<QStepper>();
const patientInfoInput = ref<typeof PatientInfoInput>();
const props = defineProps({
    patientModel: {
        type: Object as () => Patient,
        default: {} as Patient,
    },
});
const emits = defineEmits(["finish", "cancel"]);
const patientModelProps = toRef(props, "patientModel");
const patient = ref(patientModelProps.value);

function cancel() {
    emits("cancel");
}
async function nextStep() {
    if (step.value === 1) {
        await patientInfoInput.value?.confirm();
        stepper.value?.next();
        console.log(patient.value);
        return;
    }

    if (step.value === 2) {
        console.log("Finish");
        emits("finish");
        return;
    }
}
</script>

<style scoped></style>
