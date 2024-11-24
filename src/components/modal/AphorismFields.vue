<template>
    <div :class="$style.fields">
        <textarea v-model="localText" :class="$style.textarea" placeholder="Текст афоризма" />
        <textarea v-model="localAuthor" :class="$style.textarea" placeholder="Автор афоризма" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
    text: string;
    author: string;
}

const props = defineProps<IProps>();

interface IEmits {
    (event: 'update:text', value: string): void;
    (event: 'update:author', value: string): void;
}

const emits = defineEmits<IEmits>();

const localText = computed({
    get: () => props.text,
    set: value => emits('update:text', value),
});

const localAuthor = computed({
    get: () => props.author,
    set: value => emits('update:author', value),
});
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
        font-size: 16px;
        color: var(--color);
    }
</style>
