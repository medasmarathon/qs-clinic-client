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
                class="q-pa-xs col-md-3 col-12"
            />

            <q-select
                label="Hình thức khám"
                :options="appointmentTypeOptions"
                v-model="aptType"
                class="q-pa-xs col-md-3 col-12"
            />
        </q-card-section>
        <q-card-section class="row">
            <q-input
                outlined
                label="Lý do đến khám"
                stack-label
                class="col-md q-ma-xs"
                v-model="aptReason"
            />
        </q-card-section>
        <q-card-section class="row">
            <q-input
                outlined
                stack-label
                label="Thời gian bắt đầu hẹn khám"
                class="q-pa-xs col-md-6 col-12"
                v-model="requestedPeriodStart"
            >
                <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            <q-date
                                v-model="requestedPeriodStart"
                                mask="YYYY-MM-DD HH:mm"
                            >
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>

                <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            <q-time
                                v-model="requestedPeriodStart"
                                mask="YYYY-MM-DD HH:mm"
                                format24h
                            >
                            </q-time>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>

            <q-input
                outlined
                stack-label
                label="Thời gian kết thúc hẹn khám"
                class="q-pa-xs col-md-6 col-12"
                v-model="requestedPeriodEnd"
            >
                <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            <q-date
                                v-model="requestedPeriodEnd"
                                mask="YYYY-MM-DD HH:mm"
                            >
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>

                <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            <q-time
                                v-model="requestedPeriodEnd"
                                mask="YYYY-MM-DD HH:mm"
                                format24h
                            >
                            </q-time>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import {
    Appointment,
    CodeableConcept,
    Patient,
    AppointmentParticipant,
    CodeableReference,
    Period,
} from "fhir/r5";
import { QSelectOption } from "quasar";
import { CLINIC_NAME } from "src/globals";
import { toRef, ref, computed, watch } from "vue";
import dayjs from "dayjs";

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

defineExpose({
    confirm,
});
async function confirm() {
    appointment.value.participant = [];
    appointment.value.participant.push({
        actor: {
            reference: patientModelProps.value.id,
            type: "Patient",
        },
        required: true,
        status: "accepted",
    } as AppointmentParticipant);
    appointment.value.created = dayjs(Date.now())
        .locale(Intl.DateTimeFormat().resolvedOptions().locale)
        .format();
    appointment.value.reason = [
        {
            code: aptReason.value as CodeableConcept,
        } as CodeableReference,
    ];
    console.log(
        "🚀 ~ file: AppointmentInfoInput.vue ~ line 84 ~ confirm ~ value",
        appointment.value
    );
    emits("update:appointmentModel", appointment.value);
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
            ) ?? appointmentTypeOptions[0]
        );
    },
    set: (newValue: QSelectOption<TypeOptions>) => {
        appointment.value.appointmentType = newValue.value as CodeableConcept;
    },
});

const aptReason = ref("");

const requestedPeriodStart = computed({
    get: () => {
        if (!appointment.value.requestedPeriod)
            appointment.value.requestedPeriod = [];
        return appointment.value.requestedPeriod &&
            !!appointment.value.requestedPeriod[0]?.start
            ? dayjs(appointment.value.requestedPeriod[0].start)
                  .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                  .format("YYYY-MM-DD HH:mm")
            : dayjs(Date.now())
                  .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                  .format("YYYY-MM-DD HH:mm");
    },
    set: (newValue: string) => {
        if (
            appointment.value.requestedPeriod &&
            appointment.value.requestedPeriod.length > 0
        ) {
            appointment.value.requestedPeriod[0].start = dayjs(newValue)
                .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                .format();
            return;
        }
        appointment.value.requestedPeriod = [
            {
                start: dayjs(newValue)
                    .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                    .format("YYYY-MM-DD HH:mm"),
            } as Period,
        ];
    },
});
const requestedPeriodEnd = computed({
    get: () => {
        if (!appointment.value.requestedPeriod)
            appointment.value.requestedPeriod = [];
        return appointment.value.requestedPeriod &&
            !!appointment.value.requestedPeriod[0]?.end
            ? dayjs(appointment.value.requestedPeriod[0].end)
                  .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                  .format("YYYY-MM-DD HH:mm")
            : dayjs(Date.now())
                  .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                  .format("YYYY-MM-DD HH:mm");
    },
    set: (newValue: string) => {
        if (
            appointment.value.requestedPeriod &&
            appointment.value.requestedPeriod.length > 0
        ) {
            appointment.value.requestedPeriod[0].end = dayjs(newValue)
                .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                .format();
            return;
        }
        appointment.value.requestedPeriod = [
            {
                end: dayjs(newValue)
                    .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                    .format("YYYY-MM-DD HH:mm"),
            } as Period,
        ];
    },
});
</script>

<style scoped></style>
