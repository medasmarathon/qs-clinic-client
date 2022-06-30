import { defineStore } from "pinia";

import { httpRequest } from "src/infrastructure/request";
import getErrorMessage from "src/infrastructure/errorHandling";
import Router from "src/router";
import { API } from "src/globals";

const baseUrl = `${process.env.VUE_APP_CLINIC_URL}/auth`;

class WardTownVillage {
  id!: String;
  name?: String;
  type?: String;
  district?: District;
}
class District {
  id!: String;
  name?: String;
  type?: String;
  city_province?: CityProvince;
}
class CityProvince {
  id!: String;
  name?: String;
  type?: String;
  slug?: String;
}

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
        `${API.WardTownVillage}/${wardTownVillageId}`
      );
    },
    async getCityProvince(cityProvinceId: string): Promise<CityProvince> {
      return await httpRequest.get<CityProvince>(
        `${API.CityProvince}/${cityProvinceId}`
      );
    },
    async getDistrict(districtId: string): Promise<District> {
      return await httpRequest.get<District>(`${API.District}/${districtId}`);
    },
    async getAllWardTownVillage(): Promise<WardTownVillage[]> {
      return await httpRequest.get<WardTownVillage[]>(`${API.WardTownVillage}`);
    },
    async getAllCityProvince(): Promise<CityProvince[]> {
      return await httpRequest.get<CityProvince[]>(`${API.CityProvince}`);
    },
    async getAllDistrict(): Promise<District[]> {
      return await httpRequest.get<District[]>(`${API.District}`);
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
        `${API.WardTownVillage}?${searchParams}`
      );
    },
    async getCityProvinceAutocomplete(term: string): Promise<CityProvince[]> {
      let searchParams = new URLSearchParams({
        term: term,
      });
      return await httpRequest.get<CityProvince[]>(
        `${API.CityProvince}?${searchParams}`
      );
    },
    async getDistrictAutocomplete(
      term: string,
      cityProvinceId: string
    ): Promise<District[]> {
      let searchParams = new URLSearchParams({
        term: term,
        cityProvinceId: cityProvinceId,
      });
      return await httpRequest.get<District[]>(
        `${API.District}?${searchParams}`
      );
    },
  },
});
