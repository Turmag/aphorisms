<template>
    <label
        :class="{
            [$style.field]: true,
            [$style.fieldDisabled]: disabled,
        }"
        :style="width ? `width: ${width}px; min-width: ${width}px;` : ''"
    >
        <UiFlex
            position="relative"
            align-items="center"
            gap="g4"
            width="wfull"
            radius="r0"
            :class="$style.inner"
        >
            <input
                :id
                ref="inputRef"
                v-model="inputValue"
                v-bind="$attrs"
                :name
                :required
                :class="$style.input"
                :placeholder="placeholder"
                :type="isEye ? 'text' : type"
                @keydown.space.stop
                @keyup.stop="$emit('keyup', $event)"
                @click="$emit('click', $event)"
                @focus="setIsActive(true)"
                @blur="setIsActive(false)"
            >
            <SvgIcon
                v-if="type === 'password'"
                :icon-name="isEye ? 'eye' : 'eye-crossed'"
                :class="$style.eye"
                @click="toggleEye()"
            />
            <SvgIcon
                v-show="String(inputValue)?.length && !disabled"
                :class="$style.clear"
                icon-name="cross"
                :width="12"
                :height="12"
                :view-box-width="8"
                :view-box-height="9"
                @click="clear"
            />
        </UiFlex>
    </label>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { UiFlex } from 'turmag-vue-components';
import { ref, useTemplateRef } from 'vue';
import { SvgIcon } from '@/components/kit';

interface IProps {
    disabled?: boolean;
    id?: string | undefined;
    name?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    width?: number | null;
}

withDefaults(defineProps<IProps>(), {
    disabled: false,
    id: undefined,
    name: '',
    placeholder: '',
    required: false,
    type: '',
    width: null,
});

interface IEmits {
    (event: 'keyup', value: KeyboardEvent): void;
    (event: 'click', value: MouseEvent): void;
    (event: 'clear'): void;
}

const emits = defineEmits<IEmits>();

const inputValue = defineModel<string | number>();
const [isEye, toggleEye] = useToggle();

const isActive = ref(false);

const setIsActive = (isActiveLocal: boolean) => isActive.value = isActiveLocal;

const clear = () => {
    inputValue.value = '';
    emits('clear');
    focus();
};

const input = useTemplateRef('inputRef');
const focus = () => (input.value as HTMLInputElement).focus();

const setSelectionRange = (start: number, end: number) => (input.value as HTMLInputElement).setSelectionRange(start, end);

defineExpose({
    focus,
    setSelectionRange,
});
</script>

<style lang="scss" module>
    .field {
        position: relative;
        display: flex;
        width: 100%;
        height: 40px;
        min-height: 40px;
        border-radius: 4px;
    }

    .inner {
        margin: 1px;
        box-shadow: var(--color-border-default) 0 1px;
        transition: box-shadow 0.2s;

        &:has(input:focus) {
            box-shadow: var(--color-border-default) 0 3px;
        }
    }

    .fieldDisabled {
        opacity: .5;
        pointer-events: none;
    }

    .input {
        flex-grow: 1;
        width: 100%;
        padding-block: 4px;
        padding-inline: 8px;
        border: 0;
        background-color: transparent;
        color: var(--color-text-default);
        outline: 0;
        font-size: var(--font-family);
        font-size: 20px;
        line-height: 120%;
    }

    .eye, .clear {
        margin-right: 8px;
        color: var(--color-text-default);
        transition: 0.3s;
        transition-property: stroke, color;
        cursor: pointer;
        user-select: none;

        &:hover {
            color: var(--color-text-active);
        }
    }
</style>
