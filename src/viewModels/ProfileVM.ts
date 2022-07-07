import { WardTownVillageResponse } from "src/DTOs/response/LocationResponse";
import { RoleResponse } from "src/DTOs/response/RoleResponse";

export class ProfileVM {
  id?: string;
  username!: string;
  password?: string;
  fullname?: string;
  birthdate?: string;
  phone: string[] = [];
  addressLine1?: string;
  location?: WardTownVillageResponse;
  email?: string;
  roles?: RoleResponse[];
}
