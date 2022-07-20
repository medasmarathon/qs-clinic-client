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
    <q-card-section class="row items-center justify-evenly">
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
      <q-input
        outlined
        stack-label
        label="Ngày sinh"
        class="q-ma-xs col-md"
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
        :address-line1="addressLine"
        :location="addressLocation"
        @update:address-line1="updateAddressLine"
        @update:location="updateLocation"
      >
      </location-input>
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
import { toRef, computed, ref, onMounted } from "vue";
import { CLINIC_NAME } from "src/globals";
import { uniqueId } from "lodash";
import { QPopupProxy } from "quasar";
import LocationInput from "./LocationInput.vue";
import { useLocationStore } from "src/stores";
import { WardTownVillageResponse } from "src/DTOs/response/LocationResponse";

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

const addressLine = computed(
  () =>
    patient.value.address
      ?.find((ad) => ad.use === "home")
      ?.line?.slice(0, -1)
      .join(" ") ?? ""
);
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
  let wardTowns = await locationStore.getWardTownVillageAutocomplete(wardTown);

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
  addressLocation.value = new WardTownVillageResponse();
}
function updateAddressLine(addressLine: string) {
  console.log(addressLine);
}
function updateLocation(location: WardTownVillageResponse) {
  console.log(location);
}

const genderOptions = ["male", "female", "other", "unknown"];
</script>

<style scoped></style>
