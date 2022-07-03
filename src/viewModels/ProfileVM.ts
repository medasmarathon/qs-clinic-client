import { Role } from "src/DTOs/response/Role";

export class ProfileVM {
  username!: string;
  fullname?: string;
  birthdate?: string;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  locationId?: string;
  email?: string;
  roles?: Role[];
}
