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
    <q-select
      label="Tỉnh/ thành phố"
      use-input
      input-debounce="300"
      :options="cityOptions"
      @filter="filterCityProvinces"
      v-model="selectedCityProvince"
      class="q-ma-xs col-md"
      :disable="!isEditing"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Không tìm thấy lựa chọn
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select
      label="Quận/ huyện"
      use-input
      input-debounce="300"
      :options="districtOptions"
      @filter="filterDistrict"
      v-model="selectedDistrict"
      class="q-ma-xs col-md"
      :disable="!isEditing"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Không tìm thấy lựa chọn
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select
      label="Phường xã"
      use-input
      input-debounce="300"
      :options="wardTownOptions"
      @filter="filterWardTownVillage"
      v-model="selectedWardTownVillage"
      @blur="updateLocation"
      class="q-ma-xs col-md"
      :disable="!isEditing"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Không tìm thấy lựa chọn
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from "@vue/reactivity";
import { QSelect, QSelectOption, QSelectProps } from "quasar";
import {
  CityProvinceResponse,
  DistrictResponse,
  WardTownVillageResponse,
} from "src/DTOs/response/LocationResponse";
import { useLocationStore } from "src/stores";
import {
  reactive,
  ref,
  onBeforeMount,
  onMounted,
  watch,
  watchEffect,
} from "vue";

const props = defineProps<{
  isEditing: boolean;
  addressLine1?: string;
  location?: WardTownVillageResponse;
}>();

const emits = defineEmits(["update:addressLine1", "update:location"]);

const userLocationProps = toRef(props, "location");
const userLocation = ref(new WardTownVillageResponse());
watch(userLocationProps, (value) => {
  userLocation.value = value ?? userLocation.value;
});

const selectedCityProvince = computed({
  get(): QSelectOption<CityProvinceResponse> | null {
    if (userLocation?.value?.district?.city_province === undefined) return null;
    return userLocation?.value?.district?.city_province
      ? toCityProvinceOption(userLocation.value.district.city_province)
      : null;
  },
  set(selectedCityProvinceOption) {
    if (!selectedCityProvinceOption?.value) return null;

    let newLocation = new WardTownVillageResponse();
    newLocation.district = new DistrictResponse();
    newLocation.district.city_province = selectedCityProvinceOption.value;
    userLocation.value = newLocation;
  },
});
const selectedDistrict = computed({
  get(): QSelectOption<DistrictResponse> | null {
    if (userLocation?.value?.district === undefined) return null;
    return userLocation?.value?.district
      ? toDistrictOption(userLocation.value.district)
      : null;
  },
  set(selectedDistrictOption) {
    if (!selectedDistrictOption?.value) return null;

    let newLocation = new WardTownVillageResponse();
    newLocation.district = selectedDistrictOption.value;
    newLocation.district.city_province = selectedCityProvince.value?.value;
    userLocation.value = newLocation;
  },
});
const selectedWardTownVillage = computed({
  get(): QSelectOption<WardTownVillageResponse> | null {
    if (userLocation?.value === undefined) return null;
    return userLocation?.value ? toWardTownOption(userLocation.value) : null;
  },
  set(selectedWardTownOption) {
    if (!selectedDistrict.value || !selectedCityProvince.value) return null;
    if (selectedWardTownOption?.value) {
      let newLocation = new WardTownVillageResponse();
      newLocation = selectedWardTownOption.value;
      newLocation.district = selectedDistrict.value.value;
      newLocation.district.city_province = selectedCityProvince.value.value;
      userLocation.value = newLocation;
    }
  },
});

const cityOptions = ref([] as QSelectOption<CityProvinceResponse>[]);
const districtOptions = ref([] as QSelectOption<DistrictResponse>[]);
const wardTownOptions = ref([] as QSelectOption<WardTownVillageResponse>[]);

const locationStore = useLocationStore();

function updateLocation() {
  emits("update:location", userLocation.value);
}

watch(userLocation, () => {
  emits("update:location", userLocation.value);
});

function toCityProvinceOption(
  cityProvince: CityProvinceResponse
): QSelectOption<CityProvinceResponse> {
  return {
    value: cityProvince,
    label: cityProvince.name ?? "",
  };
}

const filterCityProvinces: QSelectProps["onFilter"] = (
  input: string,
  update
) => {
  if (input === "") {
    update(() => {
      locationStore.getAllCityProvince().then((values) => {
        cityOptions.value = values.map((value) => toCityProvinceOption(value));
      });
    });
    return;
  } else
    update(() => {
      locationStore.getCityProvinceAutocomplete(input).then((values) => {
        if (values && values.length > 0) {
          cityOptions.value = values.map((value) =>
            toCityProvinceOption(value)
          );
        }
      });
    });
};

function toDistrictOption(
  district: DistrictResponse
): QSelectOption<DistrictResponse> {
  return {
    value: district,
    label: district.name ?? "",
  };
}

const filterDistrict: QSelectProps["onFilter"] = (input: string, update) => {
  update(() => {
    locationStore
      .getDistrictAutocomplete(
        input,
        selectedCityProvince.value ? selectedCityProvince.value.value?.id : ""
      )
      .then((values) => {
        if (values && values.length > 0) {
          districtOptions.value = values.map((value) =>
            toDistrictOption(value)
          );
        }
      });
  });
};

function toWardTownOption(
  wardTown: WardTownVillageResponse
): QSelectOption<WardTownVillageResponse> {
  return {
    value: wardTown,
    label: wardTown.name ?? "",
  };
}

const filterWardTownVillage: QSelectProps["onFilter"] = (
  input: string,
  update
) => {
  update(() => {
    locationStore
      .getWardTownVillageAutocomplete(
        input,
        selectedDistrict.value ? selectedDistrict.value.value.id : "",
        selectedCityProvince.value ? selectedCityProvince.value.value?.id : ""
      )
      .then((values) => {
        if (values && values.length > 0) {
          wardTownOptions.value = values.map((value) =>
            toWardTownOption(value)
          );
        }
      });
  });
};
</script>

<style lang="scss" scoped></style>
