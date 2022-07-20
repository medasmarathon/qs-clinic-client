import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { useAuthStore } from "./auth.store";
import { useUserStore } from "./user.store";
import { useLocationStore } from "./location.store";
import { useAdminStore } from "./admin.store";

export { useAuthStore, useUserStore, useLocationStore, useAdminStore };

export default store((/* { ssrContext } */) => {
    const pinia = createPinia();

    // You can add Pinia plugins here
    // pinia.use(SomePiniaPlugin)

    return pinia;
});
