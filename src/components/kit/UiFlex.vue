<template>
    <div
        :class="[
            $style.container,
            $style[height],
            $style[width],
            $style[radius],
            $style[`direction-${direction}`],
            $style[`bg-${bg}`],
            $style[`border-${borderColor}`],
            {
                [$style.wrap]: !!wrap,
                [$style.grow]: !!grow,
                [$style['align-items']]: !!alignItems,
                [$style['align-self']]: !!alignSelf,
                [$style['align-content']]: !!alignContent,
                [$style['justify-items']]: !!justifyItems,
                [$style['justify-content']]: !!justifyContent,
                [$style['justify-self']]: !!justifySelf,
                [$style.padding]: !!padding,
                [$style['padding-inline']]: !!paddingInline,
                [$style['padding-block']]: !!paddingBlock,
                [$style['position']]: !!position,
                [$style.gap]: !!gap,
                [$style['column-gap']]: !!colGap,
                [$style['row-gap']]: !!rowGap,
            }
        ]"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    alignContent?: '' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'normal' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: '' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    alignSelf?: '' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'auto';
    bg?: '' | 'default' | 'button' | 'blockquote-primary' | 'blockquote-secondary' | 'blockquote-copy';
    borderColor?: '' | 'default' | 'special';
    colGap?: '' | 'g2' | 'g4' | 'g6' | 'g8' | 'g10' | 'g12' | 'g16' | 'g20' | 'g24' | 'g28' | 'g32' | 'g36' | 'g40' | 'g48' | 'g56' | 'g60' | 'g64' | 'g80' | 'g120';
    direction?: '' | 'col' | 'reverse' | 'col-reverse';
    gap?: '' | 'g2' | 'g4' | 'g6' | 'g8' | 'g10' | 'g12' | 'g16' | 'g20' | 'g24' | 'g28' | 'g32' | 'g36' | 'g40' | 'g48' | 'g56' | 'g60' | 'g64' | 'g80' | 'g120';
    grow?: boolean;
    height?: '' | 'hfull';
    justifyContent?: '' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'normal' | 'space-between' | 'space-around' | 'space-evenly';
    justifyItems?: '' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
    justifySelf?: '' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'auto';
    padding?: '' | 'p2' | 'p4' | 'p6' | 'p8' | 'p10' | 'p12' | 'p14' | 'p16' | 'p18' | 'p20' | 'p24' | 'p28' | 'p32' | 'p36' | 'p40' | 'p42' | 'p64' | 'p80' | 'p120';
    paddingBlock?: '' | 'p2' | 'p4' | 'p6' | 'p8' | 'p10' | 'p12' | 'p14' | 'p16' | 'p18' | 'p20' | 'p24' | 'p28' | 'p32' | 'p36' | 'p40' | 'p42' | 'p64' | 'p80' | 'p120';
    paddingInline?: '' | 'p2' | 'p4' | 'p6' | 'p8' | 'p10' | 'p12' | 'p14' | 'p16' | 'p18' | 'p20' | 'p24' | 'p28' | 'p32' | 'p36' | 'p40' | 'p42' | 'p64' | 'p80' | 'p120';
    position?: '' | 'relative' | 'absolute' | 'sticky';
    radius?: '' | 'r0' | 'r2' | 'r4' | 'r6' | 'r8' | 'r12' | 'r14' | 'r16' | 'r18' | 'r20' | 'r22' | 'r24' | 'r26' | 'r28' | 'r30' | 'r32';
    rowGap?: '' | 'g2' | 'g4' | 'g6' | 'g8' | 'g10' | 'g12' | 'g16' | 'g20' | 'g24' | 'g28' | 'g32' | 'g36' | 'g40' | 'g42' | 'g48' | 'g56' | 'g60' | 'g64' | 'g80' | 'g120';
    width?: '' | 'wfull';
    wrap?: '' | 'nowrap' | 'wrap' | 'wrap-reverse';
}>(), {
    alignContent: '',
    alignItems: '',
    alignSelf: '',
    bg: '',
    borderColor: '',
    colGap: '',
    direction: '',
    gap: '',
    grow: false,
    height: '',
    justifyContent: '',
    justifyItems: '',
    justifySelf: '',
    padding: '',
    paddingBlock: '',
    paddingInline: '',
    position: '',
    radius: 'r0',
    rowGap: '',
    width: '',
    wrap: '',
});

const indent: Record<string, string> = {};
const gapSizes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 42, 48, 56, 60, 64, 80, 120];
gapSizes.forEach(size => {
    indent[`p${size}`] = `${size}px`;
    indent[`g${size}`] = `${size}px`;
});

const paddingStyle = computed(() => indent[props.padding] ?? null);
const paddingInlineStyle = computed(() => indent[props.paddingInline] ?? null);
const paddingBlockStyle = computed(() => indent[props.paddingBlock] ?? null);
const positionStyle = computed(() => props.position);
const gapStyle = computed(() => indent[props.gap] ?? null);
const columnGapStyle = computed(() => indent[props.colGap] ?? null);
const rowGapStyle = computed(() => indent[props.rowGap] ?? null);
</script>

<style module lang="scss">
    .container {
        display: flex;
    }

    $directions: (
        "col": column,
        "reverse": row-reverse,
        "col-reverse": column-reverse,
    );

    @each $key, $value in $directions {
        .direction-#{$key} {
            flex-direction: #{$value};
        }
    }

    .hfull {
        height: 100%;
    }

    .wfull {
        width: 100%;
    }

    @for $i from 0 to 32 {
        $radius: $i * 2;

        .r#{$radius} {
            border-radius: #{$radius}px;
        }
    }

    .wrap {
        flex-wrap: v-bind(wrap);
    }

    .grow {
        flex-grow: 1;
    }

    .align-items {
        align-items: v-bind(alignItems);
    }

    .align-self {
        align-self: v-bind(alignSelf);
    }

    .align-content {
        align-content: v-bind(alignContent);
    }

    .justify-items {
        justify-items: v-bind(justifyItems);
    }

    .justify-content {
        justify-content: v-bind(justifyContent);
    }

    .justify-self {
        justify-self: v-bind(justifySelf);
    }

    .padding {
        padding: v-bind(paddingStyle);
    }

    .padding-inline {
        padding-inline: v-bind(paddingInlineStyle);
    }

    .padding-block {
        padding-block: v-bind(paddingBlockStyle);
    }

    .position {
        position: v-bind(positionStyle);
    }

    .gap {
        gap: v-bind(gapStyle);
    }

    .column-gap {
        column-gap: v-bind(columnGapStyle);
    }

    .row-gap {
        row-gap: v-bind(rowGapStyle);
    }

    $bg-colors: default, button, blockquote-primary, blockquote-secondary, blockquote-copy;

    @each $color in $bg-colors {
        .bg-#{$color} {
            background-color: var(--background-color-#{$color});
        }
    }

    $border-colors: default, special;

    @each $color in $border-colors {
        .border-#{$color} {
            border: 1px solid;
            border-color: var(--color-border-#{$color});
        }
    }
</style>
