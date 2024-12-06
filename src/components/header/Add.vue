<template>
    <IconBase
        :class="$style.add"
        width="30"
        height="30"
        viewBoxWidth="24"
        viewBoxHeight="24"
        @click="openSettings"
    >
        <Add />
    </IconBase>
</template>

<script setup lang="ts">
import IconBase from '@/components/shared/IconBase.vue';
import { Add } from '@/assets/icons';
import Modal from '@/components/modal/Modal.vue';
import { useModal } from 'vue-final-modal';
import { mainStore } from '@/store/main';
const store = mainStore();

const { open: openSettings, close } = useModal({
    component: Modal,
    attrs: {
        getTitle: () => 'Добавление афоризма',
        getApplyText: () => 'Добавить',
        getCancelText: () => 'Не нужно',
        getIsShowInput: () => false,
        isShowAphorismFields: true,
        async onCancel() {
            close();
        },
        async onApply(text: string, author?: string) {
            const isSuccess = await store.addAphorism({
                text,
                author: author!,
            });
            if (isSuccess) {
                await store.getAphorisms();
                close();
            }
        },
    },
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
