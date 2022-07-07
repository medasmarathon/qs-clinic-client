export class UpdateUserProfileRequest {
  id?: string;
  username?: string;
  password?: string;
  fullname?: string;
  phone?: string[];
  birthdate?: string;
  email?: string;
  addressLine1?: string;
  locationId?: string;

  roleIds?: Array<string>;
}
