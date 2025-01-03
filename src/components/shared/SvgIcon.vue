<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${viewBoxWidth || width} ${viewBoxHeight || height}`"
        :style="`min-width: ${width}px`"
        role="presentation"
    >
        <g :fill="color">
            <component :is="icons[iconName]" />
        </g>
    </svg>
</template>

<script setup lang="ts">
import icons from '@/assets/icons';

interface IProps {
    color?: string;
    height?: string | number;
    iconName: string;
    viewBoxHeight?: string | number;
    viewBoxWidth?: string | number;
    width?: string | number;
}

withDefaults(defineProps<IProps>(), {
    color: 'currentColor',
    height: 18,
    viewBoxHeight: 0,
    viewBoxWidth: 0,
    width: 18,
});
</script>
