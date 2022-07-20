<template>
    <q-page class="row items-center justify-evenly">
        <q-markup-table separator="horizontal" flat bordered>
            <thead class="bg-primary text-white">
                <tr>
                    <th class="text-left">Username</th>
                    <th class="text-right">Họ tên</th>
                    <th class="text-right">Email</th>
                    <th class="text-right">Số điện thoại</th>
                    <th class="text-right">Vị trí</th>
                    <th class="text-right">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="profile in userProfiles"
                    :class="{
                        'bg-grey-3': profile.id === currentUserProfile?.id,
                    }"
                >
                    <td class="text-left">{{ profile.username }}</td>
                    <td class="text-right">{{ profile.fullname }}</td>
                    <td class="text-right">{{ profile.email }}</td>
                    <td class="text-right">
                        <q-chip
                            v-for="phone in profile.phone"
                            size="md"
                            outline
                            color="primary"
                            text-color="white"
                            :label="phone"
                        >
                        </q-chip>
                    </td>
                    <td class="text-right">
                        <q-badge
                            v-for="role in profile.roles"
                            outline
                            color="primary"
                            :label="role.role_name?.toString()"
                        />
                    </td>
                    <td class="text-right">
                        <q-btn
                            class="gt-xs"
                            :class="{
                                hidden: profile.id === currentUserProfile?.id,
                            }"
                            flat
                            dense
                            round
                            color="negative"
                            icon="delete"
                            @click="deleteUser(profile)"
                        >
                            <q-tooltip> Xóa </q-tooltip>
                        </q-btn>
                        <q-btn
                            class="gt-xs"
                            flat
                            dense
                            round
                            color="positive"
                            icon="edit"
                            @click="editUser(profile)"
                        >
                            <q-tooltip> Chỉnh sửa </q-tooltip>
                        </q-btn>
                    </td>
                </tr>
            </tbody>
            <q-btn
                class="q-pa-md"
                flat
                dense
                outline
                color="primary"
                icon="add"
                @click="addUser()"
            >
                <template slot="prepend">
                    <q-icon name="add" color="primary"></q-icon>
                </template>
                Thêm người dùng
            </q-btn>
        </q-markup-table>

        <q-dialog v-model="isEditingUser">
            <div>
                <q-bar class="row items-center bg-primary text-white">
                    <div class="text-h6">Chỉnh sửa thông tin người dùng</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-bar>
                <profile-input
                    v-model:profile="currentEditedUser"
                    @confirm="confirmUpsertUser"
                    :for-new="!currentEditedUser.id"
                ></profile-input>
            </div>
        </q-dialog>

        <q-dialog v-model="isDeletingUser">
            <q-card>
                <q-card-section class="row items-center">
                    <span class="q-ml-sm">
                        Xác nhận xóa người dùng
                        <b>{{ currentEditedUser.username }}</b> ?
                    </span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Hủy" color="negative" v-close-popup />
                    <q-btn
                        flat
                        label="Xác nhận"
                        color="positive"
                        @click="confirmDeleteUser(currentEditedUser)"
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import dayjs from "dayjs";
import { useQuasar } from "quasar";
import ProfileInput from "src/components/ProfileInput.vue";
import { CreateUserProfileRequest } from "src/DTOs/request/CreateUserProfileRequest";
import { UpdateUserProfileRequest } from "src/DTOs/request/UpdateUserProfileRequest";
import { useAdminStore, useUserStore } from "src/stores";
import { ProfileVM } from "src/viewModels/ProfileVM";
import { onBeforeMount } from "vue";

const adminStore = useAdminStore();
const userStore = useUserStore();
const $q = useQuasar();

const currentUserProfile = ref<ProfileVM>();
const userProfiles = ref<ProfileVM[]>([]);
const isEditingUser = ref(false);
const isDeletingUser = ref(false);
const currentEditedUser = ref<ProfileVM>(new ProfileVM());

onBeforeMount(() => {
    fetchUsers();
    userStore.getUserProfile().then((user) => {
        currentUserProfile.value = {
            ...user!,
            phone: user!.phone ?? [],
            password: "",
            birthdate: dayjs(user!.birthdate)
                .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                .format("YYYY MM DD"),
        };
    });
});

function fetchUsers() {
    adminStore
        .getMultipleUsers()
        .then((profiles) => {
            if (profiles)
                userProfiles.value = profiles.map((profile) => {
                    return {
                        ...profile,
                        phone: profile.phone ?? [],
                        password: "",
                        birthdate: dayjs(profile.birthdate)
                            .locale(
                                Intl.DateTimeFormat().resolvedOptions().locale
                            )
                            .format("YYYY MM DD"),
                    };
                });
        })
        .catch((err) => console.log(err));
}

function deleteUser(user: ProfileVM) {
    isDeletingUser.value = true;
    currentEditedUser.value = user;
}

function editUser(user: ProfileVM) {
    isEditingUser.value = true;
    currentEditedUser.value = user;
}

function addUser() {
    currentEditedUser.value = new ProfileVM();
    isEditingUser.value = true;
}

function confirmUpsertUser(user: ProfileVM) {
    isEditingUser.value = false;
    if (user.id) {
        let updateRequest = UpdateUserProfileRequest.fromProfileVM(
            currentEditedUser.value
        );
        adminStore
            .updateUserProfile(updateRequest)
            .then((profile) => {
                if (profile)
                    currentEditedUser.value = {
                        ...profile,
                        phone: profile.phone ?? [],
                        birthdate: dayjs(profile.birthdate)
                            .locale(
                                Intl.DateTimeFormat().resolvedOptions().locale
                            )
                            .format("YYYY MM DD"),
                    };
                $q.notify({
                    message: "Đã cập nhật thông tin hồ sơ",
                    color: "positive",
                });
                fetchUsers();
            })
            .catch((err) => {
                $q.notify({
                    message: "Cập nhật thất bại",
                    color: "negative",
                });
                console.log(err);
            });
        return;
    }

    let createRequest = CreateUserProfileRequest.fromProfileVM(
        currentEditedUser.value
    );
    adminStore
        .createUserProfile(createRequest)
        .then((profile) => {
            if (profile)
                currentEditedUser.value = {
                    ...profile,
                    phone: profile.phone ?? [],
                    birthdate: dayjs(profile.birthdate)
                        .locale(Intl.DateTimeFormat().resolvedOptions().locale)
                        .format("YYYY MM DD"),
                };
            $q.notify({
                message: "Đã tạo hồ sơ người dùng",
                color: "positive",
            });
            fetchUsers();
        })
        .catch((err) => {
            $q.notify({
                message: "Tạo mới thất bại",
                color: "negative",
            });
            console.log(err);
        });
}

function confirmDeleteUser(user: ProfileVM) {
    adminStore
        .deleteUserById(user.id!)
        .then(() => {
            $q.notify({
                message: "Đã xóa thông tin hồ sơ",
                color: "positive",
            });
            fetchUsers();
        })
        .catch((err) => {
            $q.notify({
                message: "Thao tác xóa thất bại",
                color: "negative",
            });
            console.log(err);
        });
}
</script>

<style scoped></style>
