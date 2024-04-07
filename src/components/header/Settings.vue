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
import IconBase from '@/components/IconBase.vue';
import Settings from '@/assets/icons/Settings.vue';
import Modal from '@/components/Modal.vue';
import { useModal } from 'vue-final-modal';
import { authStore } from '@/store/auth';

const store = authStore();

console.log('store.isAuthorized', store.isAuthorized);

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
            if(store.isAuthorized) await store.logout();
            else if(password.length) await store.authorize(password);
            close();
        },
    },
});
</script>

<style lang="scss" module>
    .settings {
        margin-left: auto;
        outline: none;
        color: var(--color);
        cursor: pointer;
        user-select: none;
    }
</style>
