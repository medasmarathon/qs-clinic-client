import { ProfileVM } from "src/viewModels/ProfileVM";

export class CreateUserProfileRequest {
  id?: string;
  username!: string;
  password!: string;
  birthday?: Date;
  phone?: string[];
  email?: string;
  addressLine1?: string;
  locationId?: string;

  roleIds?: Array<string>;
  static fromProfileVM(userProfile: ProfileVM) {
    let updateRequest = new CreateUserProfileRequest();
    updateRequest = {
      ...userProfile,
      password: userProfile.password!,
      phone: userProfile.phone,
      locationId: userProfile?.location?.id,
    };
    if (updateRequest.email === "") delete updateRequest.email;
    return updateRequest;
  }
}
