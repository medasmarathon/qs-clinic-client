import { defineStore } from "pinia";

import { httpRequest } from "src/infrastructure/request";
import getErrorMessage from "src/infrastructure/errorHandling";
import Router from "src/router";
import { API, BASE_URL } from "src/globals";
import { debounce } from "quasar";
import {
  CityProvince,
  District,
  WardTownVillage,
} from "../DTOs/response/Location";

export const useLocationStore = defineStore({
  id: "location",
  state: () => ({
    profileLocation: null,
  }),
  actions: {
    async getLocation(wardTownVillageId: string): Promise<WardTownVillage> {
      return await httpRequest.get<WardTownVillage>(
        `${API.WardTownVillage}/${wardTownVillageId}`
      );
    },
    async getWardTownVillage(
      wardTownVillageId: string
    ): Promise<WardTownVillage> {
      return await httpRequest.get<WardTownVillage>(
        `${BASE_URL}${API.WardTownVillage}/${wardTownVillageId}`
      );
    },
    async getCityProvince(cityProvinceId: string): Promise<CityProvince> {
      return await httpRequest.get<CityProvince>(
        `${BASE_URL}${API.CityProvince}/${cityProvinceId}`
      );
    },
    async getDistrict(districtId: string): Promise<District> {
      return await httpRequest.get<District>(
        `${BASE_URL}${API.District}/${districtId}`
      );
    },
    async getAllWardTownVillage(): Promise<WardTownVillage[]> {
      return await httpRequest.get<WardTownVillage[]>(
        `${BASE_URL}${API.WardTownVillage}`
      );
    },
    async getAllCityProvince(): Promise<CityProvince[]> {
      return await httpRequest.get<CityProvince[]>(
        `${BASE_URL}${API.CityProvince}`
      );
    },
    async getAllDistrict(): Promise<District[]> {
      return await httpRequest.get<District[]>(`${BASE_URL}${API.District}`);
    },
    async getWardTownVillageAutocomplete(
      term: string,
      districtId: string,
      cityProvinceId: string
    ): Promise<WardTownVillage[]> {
      let searchParams = new URLSearchParams({
        term: term,
        districtId: districtId,
        cityProvinceId: cityProvinceId,
      });
      return await httpRequest.get<WardTownVillage[]>(
        `${BASE_URL}${API.WardTownVillage}?${searchParams}`
      );
    },
    async getCityProvinceAutocomplete(term: string): Promise<CityProvince[]> {
      let searchParams = new URLSearchParams();
      if (term) searchParams.set("term", term);
      return await httpRequest.get<CityProvince[]>(
        `${BASE_URL}${API.CityProvince}?${searchParams}`
      );
    },
    async getDistrictAutocomplete(
      term: string,
      cityProvinceId: string
    ): Promise<District[]> {
      let searchParams = new URLSearchParams();
      if (term) searchParams.set("term", term);
      if (cityProvinceId) searchParams.set("cityProvinceId", cityProvinceId);
      if (!!searchParams.toString())
        return await httpRequest.get<District[]>(
          `${BASE_URL}${API.District}?${searchParams}`
        );
      return await httpRequest.get<District[]>(`${BASE_URL}${API.District}`);
    },
  },
});
