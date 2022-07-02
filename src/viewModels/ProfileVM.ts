import { Role } from "src/DTOs/response/Role";

export class ProfileVM {
  username!: string;
  fullname?: string;
  birthdate?: string;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  cityProvince?: string;
  district?: string;
  ward?: string;
  email?: string;
  roles?: Role[];
}
