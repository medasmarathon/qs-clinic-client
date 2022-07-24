<template>
    <q-page class="q-pa-md">
        <q-toolbar class="row">
            <q-input
                outline
                v-model="patientBarcode"
                label="Nhập mã barcode bệnh nhân"
                class="q-pa-sm q-ma-xs"
                @keyup="
                    (e) =>
                        e.key === 'Enter' ? barcodeEnter(patientBarcode) : null
                "
            ></q-input>
            <q-btn
                outline
                color="primary"
                class="q-pa-sm q-ma-xs"
                @click="barcodeEnter(patientBarcode)"
            >
                Tìm
            </q-btn>
            <q-space />
            <q-btn
                outline
                color="primary"
                class="q-pa-sm q-ma-xs"
                @click="addPatient"
            >
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
                                    <span class="text-body1"
                                        >Họ tên bệnh nhân</span
                                    >
                                </th>
                                <th class="text-right">
                                    <span class="text-body1"
                                        >Số điện thoại</span
                                    >
                                </th>
                                <th class="text-right">
                                    <span class="text-body1"
                                        >Tình trạng khám</span
                                    >
                                </th>
                                <th class="text-right">
                                    <span class="text-body1">Thao tác</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="patientInfo in receptionVM.patientWaitingList"
                            >
                                <td class="text-left">
                                    {{ patientInfo.orderNumber }}
                                </td>
                                <td class="text-right">
                                    {{ patientInfo.code }}
                                </td>
                                <td class="text-right">
                                    {{ patientInfo.fullname }}
                                </td>
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

        <q-dialog v-model="isEditingPatient">
            <q-card style="max-width: max-content" flat class="q-pa-none">
                <patient-reception-steps
                    :patient-model="currentEditingPatient"
                    @finish="confirmUpsertPatient"
                    @cancel="cancel"
                ></patient-reception-steps>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup lang="ts">
import { Patient } from "fhir/r5";
import { ReceptionVM } from "src/viewModels/ReceptionVM";
import { ref } from "vue";
import PatientReceptionSteps from "src/components/PatientReceptionSteps.vue";
import { usePatientStore } from "src/stores/patient.store";
import { useQuasar } from "quasar";

const receptionVM = ref(new ReceptionVM());
const patientBarcode = ref("");
const tab = ref("waitlist");
const isEditingPatient = ref(false);
const currentEditingPatient = ref<Patient>({ resourceType: "Patient" });

const $q = useQuasar();
const patientStore = usePatientStore();

function barcodeEnter(barcode: string) {
    patientStore
        .getPatientByCode(barcode)
        .then((patient) => {
            if (!patient) throw new Error("Cannot find Patient");
            currentEditingPatient.value = patient;
            isEditingPatient.value = true;
        })
        .catch((err) => {
            $q.notify({
                message: "Không tìm thấy bệnh nhân",
                color: "negative",
            });
        });
    console.log("Barcode enter");
}

function addPatient() {
    isEditingPatient.value = true;
}

function cancel() {
    isEditingPatient.value = false;
}

function confirmUpsertPatient() {
    isEditingPatient.value = false;
}
</script>

<style scoped></style>
