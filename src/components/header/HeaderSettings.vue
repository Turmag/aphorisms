<template>
    <SvgIcon
        :class="$style.settings"
        width="30"
        height="30"
        viewBoxWidth="24"
        viewBoxHeight="24"
        icon-name="settings"
        @click="openSettingsLocal"
    />
</template>

<script setup lang="ts">
import { useModal } from 'vue-final-modal';
import { ref } from 'vue';
import { SvgIcon } from '@/components/kit';
import AuthorizeModal from '@/components/modals/AuthorizeModal.vue';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import { useAuthStore } from '@/stores/useAuth.store';

const authStore = useAuthStore();

const openSettingsLocal = () => {
    authStore.isAuthorized ? openLogoutModal() : openAuthorizeModal();
};

const isLoading = ref(false);
const { close: closeAuthorizeModal, open: openAuthorizeModal } = useModal({
    attrs: {
        getApplyText: () => 'Захожу',
        getCancelText: () => 'Нет, спасибо',
        getIsLoading: () => isLoading.value,
        getTitle: () => 'Хочешь войти?',
        async onApply(password: string) {
            isLoading.value = true;
            try {
                await authStore.authorize(password);
                closeAuthorizeModal();
            // eslint-disable-next-line no-empty
            } catch {}
            isLoading.value = false;
        },
        onCancel() {
            closeAuthorizeModal();
        },
    },
    component: AuthorizeModal,
});

const { close: closeLogoutModal, open: openLogoutModal } = useModal({
    attrs: {
        getApplyText: () => 'Выхожу',
        getCancelText: () => 'Нет, спасибо',
        getTitle: () => 'Хочешь выйти?',
        onApply() {
            authStore.logout();
            closeLogoutModal();
        },
        onCancel() {
            closeLogoutModal();
        },
    },
    component: ConfirmModal,
});
</script>

<style lang="scss" module>
    .settings {
        color: var(--color-text-default);
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>
