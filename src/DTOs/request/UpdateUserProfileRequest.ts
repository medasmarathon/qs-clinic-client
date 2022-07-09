import { ProfileVM } from "src/viewModels/ProfileVM";

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

  static fromProfileVM(userProfile: ProfileVM) {
    let updateRequest = new UpdateUserProfileRequest();
    updateRequest = {
      ...userProfile,
      phone: userProfile.phone,
      locationId: userProfile?.location?.id,
    };
    if (updateRequest.password === "") delete updateRequest.password;
    if (updateRequest.email === "") delete updateRequest.email;
    return updateRequest;
  }
}
