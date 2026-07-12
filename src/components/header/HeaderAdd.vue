<template>
    <SvgIcon
        :class="$style.add"
        width="30"
        height="30"
        viewBoxWidth="24"
        viewBoxHeight="24"
        icon-name="add"
        @click="openAddAphorismModal"
    />
</template>

<script setup lang="ts">
import { useModal } from 'vue-final-modal';
import { ref } from 'vue';
import { SvgIcon } from '@/components/kit';
import AddAphorismModal from '@/components/modals/AddAphorismModal.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();

const isLoading = ref(false);
const { close: closeAddAphorismModal, open: openAddAphorismModal } = useModal({
    attrs: {
        getApplyText: () => 'Добавить',
        getCancelText: () => 'Не нужно',
        getIsLoading: () => isLoading.value,
        getTitle: () => 'Добавление афоризма',
        async onApply(text: string, author: string) {
            isLoading.value = true;
            const isSuccess = await store.addAphorism({
                author,
                text,
            });
            isLoading.value = false;
            if (isSuccess) {
                await store.getAphorisms();
                closeAddAphorismModal();
            }
        },
        onCancel() {
            closeAddAphorismModal();
        },
    },
    component: AddAphorismModal,
});
</script>

<style lang="scss" module>
    .add {
        color: var(--color-text-default);
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>
