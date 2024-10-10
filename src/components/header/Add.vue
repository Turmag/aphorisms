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
import Add from '@/assets/icons/Add.vue';
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
        onCancel() {
            close();
        },
        async onApply(text, author) {
            const isSuccess = await store.addAphorism({
                text,
                author: author as string, 
            });
            if(isSuccess) {
                await store.getAphorisms();
                close();
            }
        },
    },
});
</script>

<style lang="scss" module>
    .add {
        outline: none;
        color: var(--color);
        cursor: pointer;
        user-select: none;
    }
</style>
