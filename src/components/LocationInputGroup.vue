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

const userLocation = toRef(props, "location");

const selectedCityProvince = ref(
  null as QSelectOption<CityProvinceResponse> | null
);
const selectedDistrict = ref(null as QSelectOption<DistrictResponse> | null);
const selectedWardTownVillage = ref(
  null as QSelectOption<WardTownVillageResponse> | null
);

watch(userLocation, (location) => {
  selectedCityProvince.value = location?.district?.city_province
    ? toCityProvinceOption(location.district.city_province)
    : null;
  selectedDistrict.value = location?.district
    ? toDistrictOption(location.district)
    : null;
  selectedWardTownVillage.value = location ? toWardTownOption(location) : null;
});

const cityOptions = ref([] as QSelectOption<CityProvinceResponse>[]);
const districtOptions = ref([] as QSelectOption<DistrictResponse>[]);
const wardTownOptions = ref([] as QSelectOption<WardTownVillageResponse>[]);

const locationStore = useLocationStore();

function updateLocation() {
  let newLocation = new WardTownVillageResponse();
  if (!selectedWardTownVillage.value) return;
  newLocation = {
    ...selectedWardTownVillage.value.value,
    district: selectedDistrict.value
      ? {
          ...selectedDistrict.value.value,
          city_province: selectedCityProvince.value
            ? {
                ...selectedCityProvince.value.value,
              }
            : new CityProvinceResponse(),
        }
      : new DistrictResponse(),
  };
  emits("update:location", newLocation);
}

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
