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
import Modal from '@/components/modal/Modal.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();

const { close, open: openSettings } = useModal({
    attrs: {
        getApplyText: () => 'Добавить',
        getCancelText: () => 'Не нужно',
        getIsShowInput: () => false,
        getTitle: () => 'Добавление афоризма',
        isShowAphorismFields: true,
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
    component: Modal,
});
</script>

<style lang="scss" module>
    .add {
        color: var(--color);
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>
