<template>
    <UiTooltipWrapper
        :trigger-class="$style.tooltipTrigger"
        :disabled="!tooltipText"
    >
        <template #trigger>
            <UiFlex
                :tag
                :to
                position="relative"
                align-items="center"
                width="wfull"
                radius="r8"
                :class="{
                    [$style.wrapper]: true,
                    [$style.wrapperActive]: isActive,
                    [$style.wrapperFull]: width === 'wfull',
                    [$style.wrapperDisabled]: disabled || loading,
                    [$style.wrapperIcon]: Boolean(iconName),
                }"
            >
                <button
                    :class="[$style.button, $style[radius], $style[`padding-inline-${paddingInline}`]]"
                    :disabled
                    v-bind="$attrs"
                    @click="onClick"
                >
                    <SvgIcon
                        v-if="iconName"
                        :icon-name
                        :width="iconWidth"
                        :height="iconHeight"
                        :view-box-width="iconViewBoxWidth"
                        :view-box-height="iconViewBoxHeight"
                        :color="iconColor"
                    />
                    <template v-else>
                        <UiLoader
                            v-if="loading"
                            :width="24"
                            :height="24"
                            :class="$style.loader"
                        />
                        <UiFlex
                            justify-content="center"
                            align-items="center"
                            gap="g8"
                            :class="loading && $style.contentHidden"
                        >
                            <SvgIcon
                                v-if="prependIcon"
                                :icon-name="prependIcon"
                                :width="prependIconWidth"
                                :height="prependIconHeight"
                                :view-box-height="prependIconViewBoxHeight ? prependIconViewBoxHeight : prependIconHeight"
                                :view-box-width="prependIconViewBoxWidth ? prependIconViewBoxWidth : prependIconWidth"
                            />
                            <UiText :size="textSize">
                                <slot />
                            </UiText>
                            <SvgIcon
                                v-if="appendIcon"
                                :icon-name="appendIcon"
                                :width="appendIconWidth"
                                :height="appendIconHeight"
                                :view-box-height="appendIconViewBoxHeight ? appendIconViewBoxHeight : appendIconHeight"
                                :view-box-width="appendIconViewBoxWidth ? appendIconViewBoxWidth : appendIconWidth"
                            />
                        </UiFlex>
                    </template>
                </button>
            </UiFlex>
        </template>
        <UiTooltipContent>{{ tooltipText }}</UiTooltipContent>
    </UiTooltipWrapper>
</template>

<script setup lang="ts">
import {
    type TUiFlexPadding,
    type TUiFlexRadius,
    type TUiTextSize,
    UiFlex,
    UiLoader,
    UiText,
    UiTooltipContent,
    UiTooltipWrapper,
} from 'turmag-vue-components';
import { SvgIcon } from '@/components/kit';
import type icons from '@/assets/icons';

interface IProps {
    appendIcon?: keyof typeof icons | undefined;
    appendIconHeight?: number;
    appendIconViewBoxHeight?: number;
    appendIconViewBoxWidth?: number;
    appendIconWidth?: number;
    disabled?: boolean;
    iconColor?: string;
    iconHeight?: number;
    iconName?: keyof typeof icons | undefined;
    iconViewBoxHeight?: number | undefined;
    iconViewBoxWidth?: number | undefined;
    iconWidth?: number;
    isActive?: boolean;
    loading?: boolean;
    name?: string;
    paddingInline?: TUiFlexPadding;
    prependIcon?: keyof typeof icons | undefined;
    prependIconHeight?: number;
    prependIconViewBoxHeight?: number;
    prependIconViewBoxWidth?: number;
    prependIconWidth?: number;
    radius?: TUiFlexRadius;
    tag?: keyof HTMLElementTagNameMap | 'router-link';
    textSize?: TUiTextSize;
    to?: unknown;
    tooltipText?: string;
    width?: 'wfull' | '';
}

const props = withDefaults(defineProps<IProps>(), {
    appendIcon: undefined,
    appendIconHeight: 24,
    appendIconViewBoxHeight: undefined,
    appendIconViewBoxWidth: undefined,
    appendIconWidth: 24,
    disabled: false,
    iconColor: 'var(--color-text-secondary)',
    iconHeight: 24,
    iconName: undefined,
    iconViewBoxHeight: undefined,
    iconViewBoxWidth: undefined,
    iconWidth: 24,
    isActive: false,
    loading: false,
    name: '',
    paddingInline: 'p16',
    prependIcon: undefined,
    prependIconHeight: 24,
    prependIconViewBoxHeight: undefined,
    prependIconViewBoxWidth: undefined,
    prependIconWidth: 24,
    radius: 'r16',
    tag: 'div',
    textSize: 'fs24',
    to: undefined,
    tooltipText: '',
    width: '',
});

const emits = defineEmits<{
    (event: 'click', value: Event): void;
}>();

const onClick = (event: Event) => {
    if (props.disabled || props.loading) {
        event.stopPropagation();
        event.preventDefault();
        return;
    }

    emits('click', event);
};
</script>

<style lang="scss" module>
    .tooltipTrigger {
        height: 100%;
    }

    .wrapper {
        min-width: 50px;
        min-height: 40px;
        text-decoration: none;

        &:global(.router-link-active) button {
            background-color: var(--background-color-button-active);
        }

        a {
            text-decoration: none;
        }
    }

    .wrapperFull {
        width: 100%;
    }

    .wrapperActive {
        .button {
            background-color: var(--background-color-button-active);
        }
    }

    .wrapperIcon {
        min-width: 20px;
        min-height: 20px;

        .button {
            justify-content: center;
        }
    }

    .wrapperDisabled {
        opacity: .5;
        pointer-events: none;
    }

    /* stylelint-disable-next-line no-descending-specificity */
    .button {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        min-width: 200px;
        height: 100%;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid var(--color-border-default);
        background-color: var(--background-color-secondary);
        color: var(--color-text-on-color);
        transition: 0.3s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--background-color-secondary-hover);
        }

        &:active {
            background-color: var(--background-color-secondary-active);
        }

        &:disabled {
            opacity: .5;
        }

        @media screen and (width <= 600px) {
            min-width: 170px;
            height: 40px;
        }
    }

    @for $i from 0 to 120 {
        $value: $i * 2;

        .r#{$value} {
            border-radius: #{$value}px;
        }

        .padding-inline-p#{$value} {
            padding-inline: #{$value}px;
        }
    }

    .loader {
        position: absolute;
        height: 22px !important;
    }

    .contentHidden {
        visibility: hidden;
    }
</style>
