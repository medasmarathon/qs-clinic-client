import { WardTownVillage } from "./Location";
import { Role } from "./Role";

export class UserProfile {
  username!: string;
  password?: string;
  fullname?: string;
  addressLine1?: string;
  birthday?: Date;
  email?: string;
  location_id?: string;
  location?: WardTownVillage;
  roles?: Role[];
}
