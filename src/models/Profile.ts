import { Role } from "src/DTOs/response/Role";

export class Profile {
  username!: string;
  fullname?: string;
  birthdate?: Date;
  phoneNumber?: string[] = [];
  addressLine1?: string;
  cityProvince?: string;
  district?: string;
  ward?: string;
  email?: string;
  roles?: Role[];
}
