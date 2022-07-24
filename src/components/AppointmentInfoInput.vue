<template>
    <q-card>
        <q-card-section class="items-center justify-evenly">
            <q-input
                filled
                label="Mã code bệnh nhân"
                disable
                stack-label
                class="col-md q-ma-xs"
                v-model="patientCode"
            />
        </q-card-section>
        <q-separator />
        <q-card-section class="row">
            <q-select
                label="Trạng thái đặt hẹn"
                :options="appointmentStatusOptions"
                v-model="aptStatus"
                class="q-pa-xs col-md-2 col-12"
            />

            <q-select
                label="Hình thức khám"
                :options="appointmentTypeOptions"
                v-model="aptType"
                class="q-pa-xs col-md-2 col-12"
            />
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { Appointment, CodeableConcept, Patient } from "fhir/r5";
import { QSelectOption } from "quasar";
import { CLINIC_NAME } from "src/globals";
import { toRef, ref, computed, watch } from "vue";

const props = defineProps({
    patientModel: {
        type: Object as () => Patient,
        default: {} as Patient,
    },
    appointmentModel: {
        type: Object as () => Appointment,
        default: {} as Appointment,
    },
});
const emits = defineEmits(["update:appointmentModel"]);
const patientModelProps = toRef(props, "patientModel");
const patientCode = computed(() => {
    let ptCode = patientModelProps.value?.identifier?.find(
        (id) => id.use === "official" && id.assigner === CLINIC_NAME
    );
    return ptCode ? ptCode.id : "";
});

const appointmentModelProps = toRef(props, "appointmentModel");
const appointment = ref(appointmentModelProps);

watch(appointmentModelProps, (newModel, oldModel) => {
    if (JSON.stringify(appointment.value) === JSON.stringify(newModel)) return;
    appointment.value = newModel;
});

async function confirm() {
    emits("update:appointmentModel");
}

type StatusOptions =
    | "proposed"
    | "pending"
    | "booked"
    | "arrived"
    | "fulfilled"
    | "cancelled"
    | "noshow"
    | "entered-in-error"
    | "waitlist"
    | "checked-in";
const appointmentStatusOptions: QSelectOption<StatusOptions>[] = [
    { value: "proposed", label: "Đề xuất" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "booked", label: "Đã đặt lịch hẹn" },
    { value: "arrived", label: "Bệnh nhân đã đến" },
    { value: "fulfilled", label: "Đã hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
    { value: "noshow", label: "Vắng mặt" },
    { value: "entered-in-error", label: "Nhập sai" },
    { value: "waitlist", label: "Chờ xếp lịch" },
    { value: "checked-in", label: "Hoàn tất check in" },
];
const aptStatus = computed({
    get: (): QSelectOption<StatusOptions> => {
        return (
            appointmentStatusOptions.find(
                (op) => op.value === appointment.value.status
            ) ?? appointmentStatusOptions[3]
        );
    },
    set: (newValue: QSelectOption<StatusOptions>) => {
        appointment.value.status = newValue.value;
    },
});

type TypeOptions = "ROUTINE" | "WALKIN" | "CHECKUP" | "FOLLOWUP" | "EMERGENCY";
const appointmentTypeOptions: QSelectOption<TypeOptions>[] = [
    { value: "ROUTINE", label: "Tổng quát" },
    { value: "WALKIN", label: "Vãng lai" },
    { value: "CHECKUP", label: "Định kỳ" },
    { value: "FOLLOWUP", label: "Tái khám" },
    { value: "EMERGENCY", label: "Cấp cứu" },
];
const aptType = computed({
    get: (): QSelectOption<TypeOptions> => {
        return (
            appointmentTypeOptions.find(
                (op) => op.value === appointment.value.appointmentType
            ) ?? appointmentTypeOptions[3]
        );
    },
    set: (newValue: QSelectOption<TypeOptions>) => {
        appointment.value.appointmentType = newValue.value as CodeableConcept;
    },
});
</script>

<style scoped></style>
