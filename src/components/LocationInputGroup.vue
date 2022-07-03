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
      :model-value="cityProvince"
      @update:model-value="(val) => $emit('update:cityProvince', val.label)"
      class="q-ma-xs col-md"
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
      :model-value="districtId"
      @update:model-value="(val) => $emit('update:district', val.label)"
      class="q-ma-xs col-md"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Không tìm thấy lựa chọn
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      outlined
      stack-label
      label="Tỉnh/ thành phố"
      class="q-ma-xs col-md"
      :model-value="cityProvince"
      @update:model-value="(val) => $emit('update:cityProvince', val)"
      :disable="!isEditing"
    />
    <q-input
      outlined
      stack-label
      label="Quận huyện"
      class="q-ma-xs col-md"
      :disable="!isEditing"
      :model-value="district"
      @update:model-value="(val) => $emit('update:district', val)"
    />
    <q-input
      outlined
      stack-label
      label="Phường xã"
      class="q-ma-xs col-md"
      :model-value="wardTown"
      @update:model-value="(val) => $emit('update:wardTown', val)"
      :disable="!isEditing"
    />
  </div>
</template>

<script setup lang="ts">
import { QSelect, QSelectOption, QSelectProps } from "quasar";
import { CityProvince, District } from "src/DTOs/response/Location";
import { useLocationStore } from "src/stores";
import { defineProps, reactive, defineEmits, ref } from "vue";

const props = defineProps<{
  isEditing: boolean;
  addressLine1?: string;
  wardTown?: string;
  district?: string;
  cityProvince?: string;
  locationId?: string;
}>();

const cityProvinceId = ref("");
const districtId = ref("");
const wardTownId = ref("");

const emits = defineEmits([
  "update:addressLine1",
  "update:cityProvince",
  "update:district",
  "update:wardTown",
]);

const cityOptions = ref([] as QSelectOption<CityProvince>[]);
const districtOptions = ref([] as QSelectOption<CityProvince>[]);

const locationStore = useLocationStore();

function toCityProvinceOption(
  cityProvince: CityProvince
): QSelectOption<CityProvince> {
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

function toDistrictOption(district: District): QSelectOption<District> {
  return {
    value: district,
    label: district.name ?? "",
  };
}

const filterDistrict: QSelectProps["onFilter"] = (input: string, update) => {
  update(() => {
    locationStore
      .getDistrictAutocomplete(input, props.cityProvince ?? "")
      .then((values) => {
        console.log(cityProvinceId.value);
        if (values && values.length > 0) {
          districtOptions.value = values.map((value) =>
            toDistrictOption(value)
          );
        }
      });
  });
};
</script>

<style lang="scss" scoped></style>
