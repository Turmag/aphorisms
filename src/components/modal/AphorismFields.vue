<template>
    <div :class="$style.fields">
        <textarea v-model="localText" :class="$style.textarea" placeholder="Текст афоризма" />
        <textarea v-model="localAuthor" :class="$style.textarea" placeholder="Автор афоризма" />
    </div>
</template>

<script setup lang="ts">
const localText = defineModel<string>('text');
const localAuthor = defineModel<string>('author');
</script>

<style lang="scss" module>
    .fields {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .textarea {
        padding: 10px;
        background-color: transparent;
        color: var(--color);
        font-size: 16px;
    }
</style>
