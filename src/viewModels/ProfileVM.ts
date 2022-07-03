import { WardTownVillage } from "src/DTOs/response/Location";
import { Role } from "src/DTOs/response/Role";

export class ProfileVM {
  username!: string;
  fullname?: string;
  birthdate?: string;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  location?: WardTownVillage;
  email?: string;
  roles?: Role[];
}
