<template>
    <div ref="anchor" :class="$style.wrapper">
        <button
            type="button"
            role="combobox"
            :class="$style.select"
            :disabled="disabled"
            :aria-label="label"
            :aria-expanded="isShow"
            :aria-controls="listId"
            :aria-activedescendant="isShow && hoveredIndex >= 0 ? `${listId}-${hoveredIndex}` : undefined"
            aria-haspopup="listbox"
            @click="toggle"
            @keydown="onKeydown"
            @blur="isShow = false"
        >
            {{ item?.title ?? placeholder }}
            <SvgIcon
                icon-name="chevron-down"
                :width="16"
                :height="16"
                :class="[$style.decor, isShow && $style.decorInversed]"
            />
        </button>
        <div
            v-if="isShow"
            :id="listId"
            role="listbox"
            :aria-label="label"
            :class="$style.popup"
        >
            <div
                v-for="(option, i) in options"
                :id="`${listId}-${i}`"
                :key="option.name"
                role="option"
                :aria-selected="item?.name === option.name"
                :class="[$style.popupItem, {
                    [$style.popupItemChosen]: item?.name === option.name,
                    [$style.popupItemHovered]: hoveredIndex === i,
                }]"
                @mousedown.prevent
                @click="setItem(option)"
                @mouseenter="hoveredIndex = i"
            >
                {{ option.title }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import {
    ref,
    useId,
    useTemplateRef,
    watch,
} from 'vue';
import SvgIcon from '@/components/kit/SvgIcon.vue';
import type { ISelectItem } from '@/shared/types';

interface IProps {
    disabled?: boolean;
    label?: string;
    options: ISelectItem[];
    placeholder?: string;
}

const props = withDefaults(defineProps<IProps>(), {
    disabled: false,
    label: 'Выбрать значение',
    placeholder: 'Выбрать значение',
});
const item = defineModel<ISelectItem>();
const isShow = ref(false);
const hoveredIndex = ref(-1);
const listId = useId();
const anchor = useTemplateRef('anchor');

onClickOutside(anchor, () => isShow.value = false);

const toggle = () => {
    if (props.disabled) return;
    isShow.value = !isShow.value;
    hoveredIndex.value = Math.max(0, props.options.findIndex(option => option.name === item.value?.name));
};

const setItem = (option: ISelectItem) => {
    if (props.disabled) return;
    item.value = option;
    isShow.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled) return;
    if (event.key === 'Escape' || event.key === 'Tab') {
        isShow.value = false;
        return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const option = props.options[hoveredIndex.value];
        if (isShow.value && option) setItem(option);
        else toggle();
        return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!isShow.value) {
            toggle();
            return;
        }
        const step = event.key === 'ArrowDown' ? 1 : -1;
        hoveredIndex.value = Math.max(0, Math.min(props.options.length - 1, hoveredIndex.value + step));
    }
};

watch(() => props.disabled, disabled => {
    if (disabled) isShow.value = false;
});
</script>

<style lang="scss" module>
    .wrapper {
        position: relative;
    }

    .select {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        min-width: 90px;
        height: 44px;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid var(--color-border-pagination);
        background-color: var(--background-color-default);
        color: var(--color-text-default);
        font: inherit;
        cursor: pointer;

        &:disabled {
            opacity: .5;
            cursor: not-allowed;
        }

        &:focus-visible {
            outline: 2px solid var(--color-icon-default);
            outline-offset: 2px;
        }
    }

    .decor {
        transition: transform .3s;
    }

    .decorInversed {
        transform: rotate(180deg);
    }

    .popup {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        z-index: 3;
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        padding: 4px;
        border-radius: 8px;
        border: 1px solid var(--color-border-pagination);
        background-color: var(--background-color-default);
        box-shadow: var(--shadow-s);
    }

    .popupItem {
        padding: 6px;
        border-radius: 6px;
        cursor: pointer;
        user-select: none;
    }

    .popupItemChosen, .popupItemHovered {
        background-color: var(--color-text-default);
        color: var(--background-color-default);
    }
</style>
