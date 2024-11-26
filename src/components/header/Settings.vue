<template>
    <IconBase
        :class="$style.settings"
        width="30"
        height="30"
        viewBoxWidth="24"
        viewBoxHeight="24"
        @click="openSettings"
    >
        <Settings />
    </IconBase>
</template>

<script setup lang="ts">
import IconBase from '@/components/shared/IconBase.vue';
import { Settings } from '@/assets/icons';
import Modal from '@/components/modal/Modal.vue';
import { useModal } from 'vue-final-modal';
import { authStore } from '@/store/auth';

const store = authStore();

const { open: openSettings, close } = useModal({
    component: Modal,
    attrs: {
        getTitle: () => store.isAuthorized ? 'Хочешь выйти?' : 'Хочешь войти?',
        getApplyText: () => store.isAuthorized ? 'Выхожу' : 'Захожу',
        getCancelText: () => 'Нет, спасибо',
        getIsShowInput: () => !store.isAuthorized,
        onCancel() {
            close();
        },
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
    },
});
</script>

<style lang="scss" module>
    .settings {
        outline: none;
        color: var(--color);
        cursor: pointer;
        user-select: none;
    }
</style>
