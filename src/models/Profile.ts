import { WardTownVillageResponse } from "src/DTOs/response/LocationResponse";
import { RoleResponse } from "src/DTOs/response/RoleResponse";

export class Profile {
  id?: string;
  username!: string;
  fullname?: string;
  birthdate?: Date;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  location?: WardTownVillageResponse;
  email?: string;
  roles?: RoleResponse[];
}
