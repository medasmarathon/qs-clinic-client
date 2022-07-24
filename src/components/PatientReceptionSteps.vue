<template>
    <q-card>
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
                title="Thông tin đặt hẹn khám bệnh"
                icon="local_hospital"
                :done="step > 2"
            >
                <appointment-info-input
                    ref="appointmentInfoInput"
                    v-model:patient-model="patient"
                    v-model:appointment-model="appointment"
                ></appointment-info-input>
            </q-step>

            <q-step
                :name="3"
                title="Thông tin tạm ứng"
                icon="local_hospital"
                :done="step > 3"
            >
                Tạm ứng
            </q-step>

            <q-step
                :name="4"
                title="Thông tin tổng quát"
                icon="local_hospital"
                :done="step > 4"
            >
                Thông tin tổng quát: sinh hiệu cân nặng chiều cao
            </q-step>

            <template v-slot:navigation>
                <q-stepper-navigation>
                    <q-btn
                        @click="nextStep()"
                        color="primary"
                        :label="
                            step === 3
                                ? 'Hoàn tất / Chuyển phòng khám'
                                : 'Tiếp tục'
                        "
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
    </q-card>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { QStepper } from "quasar";
import { Patient, Appointment } from "fhir/r5";
import PatientInfoInput from "./PatientInfoInput.vue";
import AppointmentInfoInput from "./AppointmentInfoInput.vue";

const step = ref(1);
const stepper = ref<QStepper>();
const patientInfoInput = ref<typeof PatientInfoInput>();
const appointmentInfoInput = ref<typeof AppointmentInfoInput>();
const props = defineProps({
    patientModel: {
        type: Object as () => Patient,
        default: {} as Patient,
    },
});
const emits = defineEmits(["finish", "cancel"]);
const patientModelProps = toRef(props, "patientModel");
const patient = ref(patientModelProps.value);
const appointment = ref();

function cancel() {
    emits("cancel");
}
async function nextStep() {
    if (step.value === 1) {
        await patientInfoInput.value?.confirm();
        appointment.value = { resourceType: "Appointment" } as Appointment;
        stepper.value?.next();
        console.log(patient.value);
        return;
    }

    if (step.value === 2) {
        await appointmentInfoInput.value?.confirm();
        console.log(appointment.value);
    }

    if (step.value === 4) {
        console.log("Finish");
        emits("finish");
        return;
    }
}
</script>

<style scoped></style>
