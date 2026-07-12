<template>
    <SvgIcon
        :class="$style.add"
        width="30"
        height="30"
        viewBoxWidth="24"
        viewBoxHeight="24"
        icon-name="add"
        @click="openSettings"
    />
</template>

<script setup lang="ts">
import { useModal } from 'vue-final-modal';
import { SvgIcon } from '@/components/kit';
import AddAphorismModal from '@/components/modals/AddAphorismModal.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();

const { close, open: openSettings } = useModal({
    attrs: {
        getApplyText: () => 'Добавить',
        getCancelText: () => 'Не нужно',
        getTitle: () => 'Добавление афоризма',
        async onApply(text: string, author?: string) {
            const isSuccess = await store.addAphorism({
                author: author!,
                text,
            });
            if (isSuccess) {
                await store.getAphorisms();
                close();
            }
        },
        onCancel() {
            close();
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
