import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { useAuthStore } from "./auth.store";

export { useAuthStore };

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
