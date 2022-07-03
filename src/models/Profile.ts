import { WardTownVillage } from "src/DTOs/response/Location";
import { Role } from "src/DTOs/response/Role";

export class Profile {
  username!: string;
  fullname?: string;
  birthdate?: Date;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  location?: WardTownVillage;
  email?: string;
  roles?: Role[];
}
