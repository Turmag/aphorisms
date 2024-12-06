<template>
    <VueFinalModal
        :class="$style.modal"
        :content-class="$style.content"
        :lock-scroll="false"
        overlay-transition="vfm-fade"
        content-transition="vfm-fade"
    >
        <div :class="$style.title">
            {{ title }}
        </div>
        <div v-if="isShowInput" :class="$style.inputWrapper">
            <input
                ref="input"
                v-model="password"
                :class="$style.input"
                type="password"
                autocomplete="new-password"
                placeholder="Пароль для входа"
                @keydown.enter="sendPassword"
            >
        </div>
        <AphorismFields v-if="isShowAphorismFields" v-model:text="text" v-model:author="author" />
        <div :class="$style.btns">
            <div :class="$style.btn" @click="emits('cancel')">
                {{ cancelText }}
            </div>
            <div :class="$style.btn" @click="apply">
                {{ applyText }}
            </div>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
import AphorismFields from '@/components/modal/AphorismFields.vue';
import { VueFinalModal } from 'vue-final-modal';
import {
    ref,
    computed,
    useTemplateRef,
    onMounted,
} from 'vue';

interface IProps {
    getTitle: () => string;
    getApplyText?: () => string;
    getCancelText?: () => string;
    getIsShowInput?: () => boolean;
    isShowAphorismFields?: boolean;
}

const props = withDefaults(
    defineProps<IProps>(), {
        getApplyText: () => 'Да',
        getCancelText: () => 'Отмена',
        getIsShowInput: () => true,
        isShowAphorismFields: false,
    },
);

interface IEmits {
    (e: 'apply', value: string, additionalValue?: string): void;
    (e: 'cancel'): void;
}

const emits = defineEmits<IEmits>();

const title = computed(() => props.getTitle() ?? '');
const applyText = computed(() => props.getApplyText());
const cancelText = computed(() => props.getCancelText());
const isShowInput = computed(() => props.getIsShowInput());

const password = ref('');

const apply = () => props.isShowAphorismFields ? addAphorism() : sendPassword();

const sendPassword = () => emits('apply', password.value);

const text = ref('');
const author = ref('');
const addAphorism = () => emits('apply', text.value, author.value);

const input = useTemplateRef('input');
onMounted(() => setTimeout(() => (input.value as HTMLInputElement)?.focus()));
</script>

<style lang="scss" module>
    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        position: relative;
        overflow: hidden;
        display: flex;
        gap: 16px;
        width: 880px;
        min-height: 100px;
        max-height: 500px;
        padding: 24px;
        border-radius: 15px;
        border: 1px solid var(--border-color);
        background-color: var(--background-color);
        flex-direction: column;

        @media screen and (width <= 600px) {
            width: 380px;
        }
    }

    .title {
        width: 100%;
        color: var(--color);
        text-align: center;
        font-size: 40px;
        line-height: normal;

        @media screen and (width <= 600px) {
            font-size: 32px;
        }
    }

    .inputWrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .input {
        width: 400px;
        height: 60px;
        padding: 5px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 24px;
    }

    .btns {
        display: flex;
        justify-content: center;
        gap: 30px;
        width: 100%;

        @media screen and (width <= 600px) {
            gap: 16px;
        }
    }

    .btn {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 200px;
        height: 64px;
        padding: 16px;
        border-radius: 15px;
        background-color: var(--btn-background-color);
        color: var(--color);
        font-size: 24px;
        font-weight: 400;
        line-height: normal;
        transition: 0.3s ease;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--btn-background-color-hover);
        }

        &:active {
            background-color: var(--btn-background-color-active);
        }

        @media screen and (width <= 600px) {
            min-width: 170px;
            height: 40px;
            font-size: 20px;
        }
    }
</style>
