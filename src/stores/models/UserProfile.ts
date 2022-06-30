import { WardTownVillage } from "./Location";
import { Role } from "./Role";

export class UserProfile {
  username?: String;
  password?: String;
  addressLine1?: String;
  birthday?: Date;
  email?: String;
  location_id?: String;
  location?: WardTownVillage;
  roles?: Role[];
}
