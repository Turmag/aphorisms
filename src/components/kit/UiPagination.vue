<template>
    <div :class="$style.wrapper">
        <label :class="$style.helper">
            Показывать по
            <select v-model="itemsPerPage" :class="$style.select" :disabled="disabled">
                <option v-for="count in [50, 100, 150, 200]" :key="count" :value="count">
                    {{ count }}
                </option>
            </select>
        </label>
        <nav aria-label="Страницы афоризмов" :class="$style.pages">
            <button
                type="button"
                :class="$style.button"
                :disabled="disabled || currentPage <= 1"
                aria-label="Предыдущая страница"
                @click="goToPage(currentPage - 1)"
            >
                <SvgIcon
                    icon-name="chevron-down"
                    :width="16"
                    :height="16"
                    :class="$style.leftIcon"
                />
            </button>
            <template v-for="(page, i) in pagesToRender" :key="i">
                <span v-if="page === null" aria-hidden="true">
                    …
                </span>
                <button
                    v-else
                    type="button"
                    :class="[$style.button, currentPage === page && $style.active]"
                    :disabled="disabled"
                    :aria-label="`Страница ${page}`"
                    :aria-current="currentPage === page ? 'page' : undefined"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>
            </template>
            <button
                type="button"
                :class="$style.button"
                :disabled="disabled || currentPage >= totalPages"
                aria-label="Следующая страница"
                @click="goToPage(currentPage + 1)"
            >
                <SvgIcon
                    icon-name="chevron-down"
                    :width="16"
                    :height="16"
                    :class="$style.rightIcon"
                />
            </button>
        </nav>
        <span>{{ rangeText }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SvgIcon from '@/components/kit/SvgIcon.vue';

interface IProps {
    disabled?: boolean;
    total: number;
}

const props = withDefaults(defineProps<IProps>(), { disabled: false });
const itemsPerPage = defineModel<number>({ default: 50 });
const currentPage = defineModel<number>('currentPage', { default: 1 });

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / itemsPerPage.value)));
const rangeText = computed(() => {
    const start = props.total ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0;
    const end = Math.min(currentPage.value * itemsPerPage.value, props.total);
    return `${start}-${end} из ${props.total}`;
});

// Схема из Vinyl: первая, последняя и две соседние страницы с каждой стороны.
const pagesToRender = computed(() => {
    const resultSet = new Set([1, totalPages.value]);
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);
    for (let page = start; page <= end; page++) resultSet.add(page);

    const pages = [...resultSet].sort((a, b) => a - b);
    const result: (number | null)[] = [];
    pages.forEach((page, i) => {
        if (i > 0 && page - pages[i - 1] > 1) result.push(null);
        result.push(page);
    });
    return result;
});

const goToPage = (page: number) => {
    if (props.disabled || page === currentPage.value) return;
    currentPage.value = Math.max(1, Math.min(page, totalPages.value));
};
</script>

<style lang="scss" module>
    .wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        width: 100%;
        padding: 20px 24px;
    }

    .helper, .pages {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    }

    .pages {
        gap: 4px;
    }

    .button, .select {
        height: 44px;
        border-radius: 8px;
        border: 1px solid var(--color-border-pagination);
        background-color: var(--background-color-default);
        color: var(--color-text-default);
        font: inherit;
        cursor: pointer;
    }

    .button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 44px;
        padding: 8px;
        font-weight: 700;
        transition: .3s;
    }

    .select {
        padding: 8px;
    }

    .button:disabled, .select:disabled {
        opacity: .5;
        cursor: not-allowed;
    }

    .button:focus-visible, .select:focus-visible {
        outline: 2px solid var(--color-icon-default);
        outline-offset: 2px;
    }

    .button:hover:enabled {
        background-color: var(--background-color-secondary-hover);
    }

    .button:active:enabled {
        background-color: var(--background-color-secondary-active);
    }

    .active {
        background-color: var(--color-border-special);
        color: #213547;
    }

    .leftIcon {
        transform: rotate(90deg);
    }

    .rightIcon {
        transform: rotate(-90deg);
    }

    @media screen and (width <= 600px) {
        .wrapper {
            padding: 16px;
        }

        .pages {
            width: 100%;
        }
    }
</style>
