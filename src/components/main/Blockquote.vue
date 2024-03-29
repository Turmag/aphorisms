<template>
    <blockquote :class="blockquoteClasses" :isSingle="!isBlur">
        <div
            :class="$style.icon"
            title="Скопировать ссылку на данный афоризм"
            @click="copyLink"
        >
            <div :class="$style.popupWrapper">
                <Transition name="fade">
                    <div v-if="isLinkCopied" :class="$style.popup">
                        Ссылка скопирована
                        <IconBase
                            :class="$style.decor"
                            width="22"
                            height="7"
                        >
                            <CopyDecor />
                        </IconBase>
                    </div>
                </Transition>
            </div>
        </div>
        <div :class="$style.numb">
            {{ numb }}
        </div>
        <div :class="$style.text" v-html="value" />
        <div :class="$style.author">
            {{ author }}
        </div>
    </blockquote>
</template>

<script setup lang="ts">
import IconBase from '@/components/IconBase.vue';
import CopyDecor from '@/assets/icons/CopyDecor.vue';
import { computed, useCssModule } from 'vue';
import { useRoute } from 'vue-router';
import { mainStore } from '@/store/main';
import { useToggle } from '@vueuse/core';

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
const $style = useCssModule();

const [isLinkCopied, toggleIsLinkCopied] = useToggle();

let timeout: ReturnType<typeof setTimeout>;

const isBlur = computed(
    () =>
        Boolean(route.query.phraseNumb) &&
        route.query.phraseNumb !== String(props.numb) &&
        !store.unBlured,
);

const blockquoteClasses = computed(() => ({
    [$style.blockquote]: true,
    [$style.blockquoteBlur]: isBlur.value,
}));

const value = computed(() => props.text.replace(/\n/g, '<br>'));

const copyLink = () => {
    clearTimeout(timeout);
    toggleIsLinkCopied(true);

    var link = `${location.origin}${location.pathname}?phraseNumb=${props.numb}`;

    // Копируем ссылку в буфер обмена
    var tempInput = document.createElement('input');
    tempInput.setAttribute('value', link);
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    timeout = setTimeout(() => (toggleIsLinkCopied(false)), 1000);
};
</script>

<style lang="scss" module>
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

        & :global {
            .fade-enter-active,
            .fade-leave-active {
                transition: opacity 0.5s ease;
            }

            .fade-enter-from,
            .fade-leave-to {
                opacity: 0;
            }
        }
    }

    .blockquoteBlur {
        filter: blur(1px);
    }

    .icon {
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

    .popupWrapper {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .popup {
        position: absolute;
        top: 11px;
        box-sizing: border-box;
        width: 108px;
        padding: 10px;
        border-radius: 4px;
        background: var(--copy-bg);
        text-align: center;
        text-transform: none;
        font-size: 14px;
        line-height: 16px;
        color: var(--background-color);
        cursor: default;
        filter: drop-shadow(0 7px 11px var(--copy-shadow-color))
            drop-shadow(0 3px 5px var(--copy-shadow-color));
    }

    .numb {
        position: absolute;
        top: 50px;
        left: 15px;
        font-size: 25px;
    }

    .text {
        margin-bottom: 10px;
    }

    .author {
        font-size: 20px;
        font-style: italic;

        &::before {
            content: '— ';
        }
    }

    .decor {
        position: absolute;
        bottom: calc(100% - 1px);
        left: 15px;
        z-index: 1;
        display: block;
        width: 22px;
        height: 7px;
        color: var(--copy-bg);
        transform: rotate(180deg);
    }
</style>
