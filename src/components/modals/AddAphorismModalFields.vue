<template>
    <UiFlex direction="col" gap="g8">
        <textarea v-model="localText" :class="$style.textarea" placeholder="Текст афоризма" />
        <textarea v-model="localAuthor" :class="$style.textarea" placeholder="Автор афоризма" />
    </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'turmag-vue-components';

const localText = defineModel<string>('text');
const localAuthor = defineModel<string>('author');
</script>

<style lang="scss" module>
    .textarea {
        padding: 10px;
        background-color: transparent;
        color: var(--color-text-default);
        font-size: 16px;
        resize: vertical;
    }
</style>
