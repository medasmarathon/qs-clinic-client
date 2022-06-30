export class UpdateUserProfileRequest {
  username?: string;
  password?: string;
  birthday?: Date;
  email?: string;
  addressLine1?: string;
  locationId?: string;

  roleIds?: Array<string>;
}
