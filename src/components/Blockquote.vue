<template>
    <blockquote class="blockquote" :class="blockquoteClass">
        <div
            class="blockquote__icon"
            title="Скопировать ссылку на данный афоризм"
            @click="copyLink"
        >
            <div class="blockquote__icon-popup-wrapper">
                <Transition name="fade">
                    <div v-if="isLinkCopied" class="blockquote__icon-popup">
                        Ссылка скопирована
                    </div>
                </Transition>
            </div>
        </div>
        <div class="blockquote__numb">
            {{ numb }}
        </div>
        <div class="blockquote__text" v-html="value" />
        <div class="blockquote__author">
            {{ author }}
        </div>
    </blockquote>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { mainStore } from '@/store/main';
const props = defineProps({
    numb: {
        type: Number,
        default: 0,
    },
    text: {
        type: String,
        default: '',
    },
    author: {
        type: String,
        default: '',
    },
});
const route = useRoute();
const store = mainStore();

const isLinkCopied = ref(false);
let timeout: ReturnType<typeof setTimeout>;

const isBlur = computed(
    () =>
        Boolean(route.query.phraseNumb) &&
        route.query.phraseNumb !== String(props.numb) &&
        !store.unBlured,
);

const blockquoteClass = computed(() => ({
    'blockquote--blur': isBlur.value,
    'blockquote--single': !isBlur.value,
}));

const value = computed(() => props.text.replace(/\n/g, '<br>'));

const copyLink = () => {
    clearTimeout(timeout);
    isLinkCopied.value = true;

    var link = `${location.origin}${location.pathname}?phraseNumb=${props.numb}`;

    // Копируем ссылку в буфер обмена
    var tempInput = document.createElement('input');
    tempInput.setAttribute('value', link);
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    timeout = setTimeout(() => (isLinkCopied.value = false), 1000);
};
</script>

<style lang="scss" scoped>
    .blockquote {
        position: relative;
        margin: 0;
        padding: 40px 40px 40px 100px;
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        border-left: 8px solid var(--border-left-color);
        background: var(--blockquote-bg-1);
        font-size: 28px;
        line-height: 30px;
        color: var(--blockquote-color);
        font-weight: 300;

        &:nth-child(2n) {
            background: var(--blockquote-bg-2);
        }

        &:first-child {
            border-top: 1px solid var(--border-color);
        }

        &--blur {
            filter: blur(1px);
        }

        &__icon {
            position: absolute;
            top: 35px;
            left: 15px;
            z-index: 1;
            width: 85px;
            cursor: pointer;
            user-select: none;

            &::before {
                content: '\201C';
                position: absolute;
                font-family: Arial, Verdana, Tahoma, sans-serif;
                font-size: 90px;
                color: var(--border-left-color);
            }
        }

        &__icon-popup-wrapper {
            position: absolute;
            bottom: 0;
            display: flex;
            justify-content: center;
            width: 100%;
        }

        &__icon-popup {
            position: absolute;
            top: 11px;
            box-sizing: border-box;
            width: 108px;
            padding: 10px;
            border-radius: 4px;
            background: rgb(0 0 0 / 85%);
            text-align: center;
            text-transform: none;
            font-size: 14px;
            line-height: 16px;
            color: #fff;
            cursor: default;
            filter: drop-shadow(0 7px 11px rgb(8 0 47 / 7%))
                drop-shadow(0 3px 5px rgb(8 0 47 / 5%));

            &::before {
                content: '';
                position: absolute;
                bottom: calc(100% - 1px);
                left: 15px;
                z-index: 1;
                display: block;
                width: 22px;
                height: 7px;
                background: url("../assets/popup-decor.svg") center no-repeat;
                transform: rotate(180deg);
            }
        }

        &__numb {
            position: absolute;
            top: 50px;
            left: 15px;
            font-size: 25px;
        }

        &__text {
            margin-bottom: 10px;
        }

        &__author {
            font-size: 20px;
            font-style: italic;

            &::before {
                content: '— ';
            }
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
