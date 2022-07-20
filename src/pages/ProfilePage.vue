<template>
    <q-page class="row items-center justify-evenly">
        <profile-input
            v-model:profile="userProfile"
            @confirm="confirm()"
        ></profile-input>

        <q-dialog v-model="isConfirming" persistent>
            <q-card>
                <q-card-section class="row items-center">
                    <span class="q-ml-sm"> Xác nhận cập nhật thông tin ? </span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Hủy" color="negative" v-close-popup />
                    <q-btn
                        flat
                        label="Xác nhận"
                        color="positive"
                        @click="submit()"
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { UpdateUserProfileRequest } from "src/DTOs/request/UpdateUserProfileRequest";
import { useUserStore } from "src/stores/user.store";
import { ProfileVM } from "src/viewModels/ProfileVM";
import { onBeforeMount, onBeforeUpdate, reactive, ref, toRef } from "vue";
import dayjs from "dayjs";
import ProfileInput from "src/components/ProfileInput.vue";

const isConfirming = ref(false);
const userProfile = ref(new ProfileVM());
const phoneNumbers = ref<string[]>([]);

const userStore = useUserStore();
const $q = useQuasar();

onBeforeMount(() => {
    userStore
        .getUserProfile()
        .then((profile) => {
            if (profile) {
                userProfile.value = {
                    ...profile,
                    phone: profile.phone ?? [],
                    password: "",
                    birthdate: dayjs(profile.birthdate)
                        .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                        .format("YYYY MM DD"),
                };
                phoneNumbers.value = userProfile.value.phone;
            }
            console.log("Profile" + JSON.stringify(userProfile.value));
        })
        .catch((err) => console.log(err));
});

function confirm() {
    isConfirming.value = true;
}

function submit() {
    isConfirming.value = false;
    let updateRequest = UpdateUserProfileRequest.fromProfileVM(
        userProfile.value
    );
    userStore
        .updateUserProfile(updateRequest)
        .then((profile) => {
            if (profile)
                userProfile.value = {
                    ...profile,
                    phone: profile.phone ?? [],
                    birthdate: dayjs(profile.birthdate)
                        .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                        .format("YYYY MM DD"),
                };
            $q.notify({
                message: "Đã cập nhật thông tin hồ sơ",
                color: "positive",
            });
        })
        .catch((err) => {
            $q.notify({
                message: "Cập nhật thất bại",
                color: "negative",
            });
            console.log(err);
        });
}
</script>

<style lang="scss" scoped></style>
