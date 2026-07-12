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
        <UiFlex v-if="isShowInput" justify-content="center" width="wfull">
            <UiInput
                ref="inputRef"
                v-model="password"
                type="password"
                autocomplete="new-password"
                placeholder="Пароль для входа"
                :class="$style.input"
                @keydown.enter="sendPassword"
            />
        </UiFlex>
        <AphorismFields v-if="isShowAphorismFields" v-model:text="text" v-model:author="author" />
        <UiFlex
            justify-content="center"
            gap="g32"
            width="wfull"
            :class="$style.buttons"
        >
            <UiButton @click="emits('cancel')">
                {{ cancelText }}
            </UiButton>
            <UiButton @click="apply">
                {{ applyText }}
            </UiButton>
        </UiFlex>
    </VueFinalModal>
</template>

<script setup lang="ts">
import { UiFlex } from 'turmag-vue-components';
import { VueFinalModal } from 'vue-final-modal';
import {
    computed,
    onMounted,
    ref,
    useTemplateRef,
} from 'vue';
import { UiButton, UiInput } from '@/components/kit';
import AphorismFields from '@/components/modal/ModalAphorismFields.vue';

interface IProps {
    getApplyText?: () => string;
    getCancelText?: () => string;
    getIsShowInput?: () => boolean;
    getTitle: () => string;
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
    (event: 'apply', value: string, additionalValue?: string): void;
    (event: 'cancel'): void;
}

const emits = defineEmits<IEmits>();

const title = computed(() => props.getTitle() ?? '');
const applyText = computed(() => props.getApplyText());
const cancelText = computed(() => props.getCancelText());
const isShowInput = computed(() => props.getIsShowInput());

const password = ref('');

const apply = () => props.isShowAphorismFields ? addAphorism() : sendPassword();

const sendPassword = () => {
    console.log('sendPassword');
    // emits('apply', password.value);
};

const text = ref('');
const author = ref('');
const addAphorism = () => emits('apply', text.value, author.value);

const inputRef = useTemplateRef('inputRef');
// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
onMounted(() => setTimeout(() => inputRef.value?.focus()));
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
        flex-direction: column;
        gap: 16px;
        width: 880px;
        min-height: 100px;
        max-height: 500px;
        padding: 24px;
        border-radius: 15px;
        border: 1px solid var(--color-border-default);
        background-color: var(--background-color-default);

        @media screen and (width <= 600px) {
            width: 380px;
        }
    }

    .title {
        width: 100%;
        color: var(--color-text-default);
        text-align: center;
        font-size: 40px;
        line-height: normal;

        @media screen and (width <= 600px) {
            font-size: 32px;
        }
    }

    .input {
        width: 400px;
        height: 60px;
        text-align: center;
    }

    .buttons {
        @media screen and (width <= 600px) {
            gap: 16px;
        }
    }
</style>
