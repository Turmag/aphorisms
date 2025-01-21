<template>
    <SvgIcon
        :class="$style.settings"
        width="30"
        height="30"
        viewBoxWidth="24"
        viewBoxHeight="24"
        icon-name="settings"
        @click="openSettings"
    />
</template>

<script setup lang="ts">
import { useModal } from 'vue-final-modal';
import Modal from '@/components/modal/Modal.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { authStore } from '@/store/auth.store';

const store = authStore();

const { close, open: openSettings } = useModal({
    attrs: {
        getApplyText: () => store.isAuthorized ? 'Выхожу' : 'Захожу',
        getCancelText: () => 'Нет, спасибо',
        getIsShowInput: () => !store.isAuthorized,
        getTitle: () => store.isAuthorized ? 'Хочешь выйти?' : 'Хочешь войти?',
        async onApply(password: string) {
            let isSuccess = false;
            if (store.isAuthorized) {
                await store.logout();
                isSuccess = true;
            } else if (password.length) {
                isSuccess = await store.authorize(password);
            }
            if (isSuccess) close();
        },
        onCancel() {
            close();
        },
    },
    component: Modal,
});
</script>

<style lang="scss" module>
    .settings {
        color: var(--color);
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>
