import { defineStore } from "pinia";

import { httpRequest } from "src/infrastructure/request";
import getErrorMessage from "src/infrastructure/errorHandling";
import Router from "src/router";
import { API } from "src/globals";
import { debounce } from "quasar";
import { CityProvince, District, WardTownVillage } from "../DTOs/Location";

const baseUrl = `${process.env.VUE_APP_CLINIC_URL}/auth`;

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
      const search = async (t: string, d: string, cp: string) => {
        let searchParams = new URLSearchParams({
          term: t,
          districtId: d,
          cityProvinceId: cp,
        });
        return await httpRequest.get<WardTownVillage[]>(
          `${API.WardTownVillage}?${searchParams}`
        );
      };
      return debounce(search, 500)(term, districtId, cityProvinceId);
    },
    async getCityProvinceAutocomplete(term: string): Promise<CityProvince[]> {
      const search = async (t: string) => {
        let searchParams = new URLSearchParams({
          term: t,
        });
        return await httpRequest.get<CityProvince[]>(
          `${API.CityProvince}?${searchParams}`
        );
      };
      return debounce(search, 500)(term);
    },
    async getDistrictAutocomplete(
      term: string,
      cityProvinceId: string
    ): Promise<District[]> {
      const search = async (t: string, cp: string) => {
        let searchParams = new URLSearchParams({
          term: t,
          cityProvinceId: cp,
        });
        return await httpRequest.get<District[]>(
          `${API.District}?${searchParams}`
        );
      };
      return debounce(search, 500)(term, cityProvinceId);
    },
  },
});
