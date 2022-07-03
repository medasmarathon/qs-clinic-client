export class WardTownVillage {
  id!: string;
  name?: string;
  type?: string;
  district?: District;
}
export class District {
  id!: string;
  name?: string;
  type?: string;
  city_province?: CityProvince;
}
export class CityProvince {
  id!: string;
  name?: string;
  type?: string;
  slug?: string;
}
