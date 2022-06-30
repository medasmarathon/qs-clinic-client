import { Role } from "src/DTOs/Role";

export class Profile {
  username!: string;
  fullName?: string;
  birthdate?: Date;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  cityProvince?: string;
  district?: string;
  ward?: string;
  email?: string;
  roles?: Role[];
}
