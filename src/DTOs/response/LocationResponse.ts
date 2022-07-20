export class WardTownVillageResponse {
    id: string = "";
    name?: string;
    type?: string;
    district?: DistrictResponse;
}
export class DistrictResponse {
    id: string = "";
    name?: string;
    type?: string;
    cityProvince?: CityProvinceResponse;
}
export class CityProvinceResponse {
    id: string = "";
    name?: string;
    type?: string;
    slug?: string;
}
