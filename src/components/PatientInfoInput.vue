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
            <q-input
                outlined
                label="Họ tên"
                stack-label
                class="col-md-8 q-pa-xs col-12"
                v-model="patientFullName"
            />
            <q-select
                label="Giới tính"
                :options="genderOptions"
                v-model="gender"
                class="q-pa-xs col-md-2 col-12"
            />
            <q-input
                outlined
                stack-label
                label="Ngày sinh"
                class="q-pa-xs col-md-2 col-12"
                v-model="patient.birthDate"
            >
                <template v-slot:prepend>
                    <q-icon name="event">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            <q-date v-model="patient.birthDate"> </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
        </q-card-section>
        <q-card-section class="row items-center justify-evenly">
            <location-input
                :is-editing="true"
                v-model:address-line1="addressLine"
                v-model:location="addressLocation"
            >
            </location-input>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { HumanName, Identifier, Patient } from "fhir/r5";
import { toRef, computed, ref, onMounted } from "vue";
import { CLINIC_NAME } from "src/globals";
import { uniqueId } from "lodash";
import { QPopupProxy, QSelectOption } from "quasar";
import LocationInput from "./LocationInput.vue";
import { useLocationStore } from "src/stores";
import { WardTownVillageResponse } from "src/DTOs/response/LocationResponse";
import { usePatientStore } from "src/stores/patient.store";

const locationStore = useLocationStore();
onMounted(async () => {
    await getLocation();
});

const props = defineProps({
    patientModel: {
        type: Object as () => Patient,
        default: {} as Patient,
    },
});
const patientModelProps = toRef(props, "patientModel");
const patient = ref(patientModelProps.value);
defineExpose({
    confirm,
});
const emits = defineEmits(["update:patientModel"]);

const patientStore = usePatientStore();

async function confirm() {
    setName(patientFullName.value);
    setAddress(
        addressLine.value ?? "",
        addressLocation.value ?? new WardTownVillageResponse()
    );
    let upsertResult = await patientStore.upsertPatient(patient.value);
    console.log(
        "🚀 ~ file: PatientInfoInput.vue ~ line 97 ~ confirm ~ upsertResult",
        upsertResult
    );
    emits("update:patientModel", upsertResult);
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
const fullName = computed(() => {
    let humanName = patient.value?.name?.find((n) => n.use === "official");
    return humanName
        ? `${humanName?.family} ${humanName?.given?.join(" ")}`
        : "";
});
const patientFullName = ref(fullName.value);
function setName(newPatientName: string) {
    let existingHumanName = patient.value?.name?.find(
        (n) => n.use === "official"
    );
    let nameParts = newPatientName.split(" ");
    let humanName: HumanName = {
        use: "official",
        family: nameParts[0],
        given: nameParts.splice(1, nameParts.length - 1),
    };
    if (existingHumanName) {
        patient.value.name!.map((name) =>
            name.use === "official" ? humanName : name
        );
    } else {
        patient.value.name || (patient.value.name = []);
        patient.value?.name.push(humanName);
    }
}
const genderOptions: QSelectOption<"male" | "female" | "other" | "unknown">[] =
    [
        { value: "male", label: "Nam" },
        {
            value: "female",
            label: "Nữ",
        },
        { value: "other", label: "Khác" },
        {
            value: "unknown",
            label: "Không xác định",
        },
    ];
const gender = computed({
    get: (): QSelectOption<"male" | "female" | "other" | "unknown"> => {
        return (
            genderOptions.find((op) => op.value === patient.value.gender) ??
            genderOptions[3]
        );
    },
    set: (newValue: QSelectOption<"male" | "female" | "other" | "unknown">) => {
        patient.value.gender = newValue.value;
    },
});

const addressLine = ref<string>();
const addressLocation = ref();

async function getLocation() {
    let curAddress = patient.value.address?.find((ad) => ad.use === "home");
    if (
        !curAddress ||
        !curAddress.district ||
        !curAddress.city ||
        !curAddress.line?.length
    ) {
        addressLocation.value = new WardTownVillageResponse();
        return;
    }

    let city = curAddress.city;
    let district = curAddress.district;
    let wardTown = curAddress.line.slice(-1)[0];
    let wardTowns = await locationStore.getWardTownVillageAutocomplete(
        wardTown
    );
    addressLine.value = curAddress.line.slice(0, -1).join(", ");

    if (wardTowns.length === 1) {
        addressLocation.value = wardTowns[0];
        return;
    }
    let districts = await locationStore.getDistrictAutocomplete(district);
    if (districts.length === 1) {
        addressLocation.value = {
            district: districts[0],
        } as WardTownVillageResponse;
        return;
    }
    let cities = await locationStore.getCityProvinceAutocomplete(city);
    if (cities.length === 1) {
        addressLocation.value = {
            district: {
                cityProvince: cities[0],
            },
        } as WardTownVillageResponse;
        return;
    }
}
function setAddress(
    newAddressLine: string,
    newLocation: WardTownVillageResponse
) {
    addressLine.value = newAddressLine;
    let existingAddress = patient.value.address?.find(
        (ad) => ad.use === "home"
    );
    if (existingAddress) {
        existingAddress = {
            ...existingAddress,
            line: `${newAddressLine}, ${newLocation.name}`.split(", "),
            city: newLocation.district?.cityProvince?.name,
            district: newLocation.district?.name,
        };
    } else {
        patient.value.address || (patient.value.address = []);
        patient.value.address.push({
            use: "home",
            line: `${newAddressLine}, ${newLocation.name}`.split(", "),
            city: newLocation.district?.cityProvince?.name,
            district: newLocation.district?.name,
        });
    }
}
</script>

<style scoped></style>
