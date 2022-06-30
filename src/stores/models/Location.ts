export class WardTownVillage {
  id!: String;
  name?: String;
  type?: String;
  district?: District;
}
export class District {
  id!: String;
  name?: String;
  type?: String;
  city_province?: CityProvince;
}
export class CityProvince {
  id!: String;
  name?: String;
  type?: String;
  slug?: String;
}
