import { defineStore } from "pinia";

import { httpRequest } from "src/infrastructure/request";
import getErrorMessage from "src/infrastructure/errorHandling";
import Router from "src/router";
import { API, BASE_URL } from "src/globals";
import { debounce } from "quasar";
import {
  CityProvinceResponse,
  DistrictResponse,
  WardTownVillageResponse,
} from "../DTOs/response/LocationResponse";

export const useLocationStore = defineStore({
  id: "location",
  state: () => ({
    profileLocation: null,
  }),
  actions: {
    async getLocation(
      wardTownVillageId: string
    ): Promise<WardTownVillageResponse> {
      return await httpRequest.get<WardTownVillageResponse>(
        `${API.WardTownVillage}/${wardTownVillageId}`
      );
    },
    async getWardTownVillage(
      wardTownVillageId: string
    ): Promise<WardTownVillageResponse> {
      return await httpRequest.get<WardTownVillageResponse>(
        `${BASE_URL}${API.WardTownVillage}/${wardTownVillageId}`
      );
    },
    async getCityProvince(
      cityProvinceId: string
    ): Promise<CityProvinceResponse> {
      return await httpRequest.get<CityProvinceResponse>(
        `${BASE_URL}${API.CityProvince}/${cityProvinceId}`
      );
    },
    async getDistrict(districtId: string): Promise<DistrictResponse> {
      return await httpRequest.get<DistrictResponse>(
        `${BASE_URL}${API.District}/${districtId}`
      );
    },
    async getAllWardTownVillage(): Promise<WardTownVillageResponse[]> {
      return await httpRequest.get<WardTownVillageResponse[]>(
        `${BASE_URL}${API.WardTownVillage}`
      );
    },
    async getAllCityProvince(): Promise<CityProvinceResponse[]> {
      return await httpRequest.get<CityProvinceResponse[]>(
        `${BASE_URL}${API.CityProvince}`
      );
    },
    async getAllDistrict(): Promise<DistrictResponse[]> {
      return await httpRequest.get<DistrictResponse[]>(
        `${BASE_URL}${API.District}`
      );
    },
    async getWardTownVillageAutocomplete(
      term: string,
      districtId: string,
      cityProvinceId: string
    ): Promise<WardTownVillageResponse[]> {
      let searchParams = new URLSearchParams();
      if (term) searchParams.set("term", term);
      if (cityProvinceId) searchParams.set("cityProvinceId", cityProvinceId);
      if (districtId) searchParams.set("districtId", districtId);
      if (!!searchParams.toString())
        return await httpRequest.get<WardTownVillageResponse[]>(
          `${BASE_URL}${API.WardTownVillage}?${searchParams}`
        );
      return await httpRequest.get<WardTownVillageResponse[]>(
        `${BASE_URL}${API.WardTownVillage}`
      );
    },
    async getCityProvinceAutocomplete(
      term: string
    ): Promise<CityProvinceResponse[]> {
      let searchParams = new URLSearchParams();
      if (term) searchParams.set("term", term);
      if (!!searchParams.toString())
        return await httpRequest.get<CityProvinceResponse[]>(
          `${BASE_URL}${API.CityProvince}?${searchParams}`
        );
      return await httpRequest.get<CityProvinceResponse[]>(
        `${BASE_URL}${API.CityProvince}`
      );
    },
    async getDistrictAutocomplete(
      term: string,
      cityProvinceId: string
    ): Promise<DistrictResponse[]> {
      let searchParams = new URLSearchParams();
      if (term) searchParams.set("term", term);
      if (cityProvinceId) searchParams.set("cityProvinceId", cityProvinceId);
      if (!!searchParams.toString())
        return await httpRequest.get<DistrictResponse[]>(
          `${BASE_URL}${API.District}?${searchParams}`
        );
      return await httpRequest.get<DistrictResponse[]>(
        `${BASE_URL}${API.District}`
      );
    },
  },
});
