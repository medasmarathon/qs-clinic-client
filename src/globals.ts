export const API = {
    UserProfile: "/api/user/profile",
    CityProvince: "/api/location/city-province",
    WardTownVillage: "/api/location/ward-town-village",
    District: "/api/location/district",
    Admin: {
        MultipleUsers: "/api/admin/users",
        SingleUser: "/api/admin/user",
    },
};

export const BASE_URL = process.env.VUE_APP_CLINIC_URL;
export const CLINIC_NAME = process.env.VUE_APP_CLINIC_NAME;
