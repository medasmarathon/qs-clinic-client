import { WardTownVillageResponse } from "./LocationResponse";
import { RoleResponse } from "./RoleResponse";

export class UserProfileResponse {
    id?: string;
    username!: string;
    password?: string;
    fullname?: string;
    addressLine1?: string;
    birthdate?: Date;
    email?: string;
    locationId?: string;
    location?: WardTownVillageResponse;
    roles?: RoleResponse[];
}
