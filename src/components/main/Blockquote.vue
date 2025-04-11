<template>
    <blockquote
        :class="blockquoteClasses"
        :isSingle="!isBlur"
    >
        <div
            :class="$style.icon"
            title="Скопировать ссылку на данный афоризм"
            @click="copyLink"
        >
            <div :class="$style.popupWrapper">
                <Transition name="fade">
                    <div
                        v-if="isLinkCopied"
                        :class="$style.popup"
                    >
                        Ссылка скопирована
                        <SvgIcon
                            :class="$style.decor"
                            width="22"
                            height="7"
                            icon-name="copy-decor"
                        />
                    </div>
                </Transition>
            </div>
        </div>
        <div :class="$style.numb">
            {{ numb }}
        </div>
        <div :class="$style.content">
            <textarea
                v-if="isEditable"
                v-model="editText"
                :class="$style.textarea"
                :style="`height: ${textBlockHeight}px;`"
            />
            <div
                v-else
                ref="textBlock"
                :class="$style.text"
                v-html="value"
            />
            <textarea
                v-if="isEditable"
                v-model="editAuthor"
                :class="[$style.textarea, $style.textareaAuthor]"
            />
            <div
                v-else
                :class="$style.author"
            >
                {{ author }}
            </div>
            <SvgIcon
                v-if="authStoreVariable.isAuthorized"
                :class="$style.edit"
                width="20"
                height="20"
                :viewBoxWidth="35"
                :viewBoxHeight="35"
                icon-name="edit"
                @click="toggleIsEditable"
            />
            <SvgIcon
                v-if="authStoreVariable.isAuthorized && isChangedAphorism"
                :class="$style.save"
                width="20"
                height="20"
                :viewBoxWidth="62"
                :viewBoxHeight="62"
                icon-name="save"
                @click="saveAphorism"
            />
            <SvgIcon
                v-if="authStoreVariable.isAuthorized"
                :class="$style.delete"
                width="20"
                height="20"
                :viewBoxWidth="24"
                :viewBoxHeight="24"
                icon-name="delete"
                @click="deleteAphorism"
            />
        </div>
    </blockquote>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { useModal } from 'vue-final-modal';
import { useRoute } from 'vue-router';
import {
    computed,
    ref,
    useCssModule,
    watch,
} from 'vue';
import { SvgIcon } from '@/components/kit';
import Modal from '@/components/modal/Modal.vue';
import { useAuthStore } from '@/stores/useAuth.store';
import { useMainStore } from '@/stores/useMain.store';

interface IProps {
    author: string;
    id: string;
    isEditable?: boolean;
    numb: number;
    text: string;
}

const props = withDefaults(defineProps<IProps>(), { isEditable: false });

const route = useRoute();
const store = useMainStore();
const authStoreVariable = useAuthStore();
const $style = useCssModule();

const [isLinkCopied, toggleIsLinkCopied] = useToggle();

let timeout: ReturnType<typeof setTimeout>;

const isBlur = computed(
    () =>
        Boolean(route.query.phraseNumb)
        && route.query.phraseNumb !== String(props.id)
        && !store.isUnBlured,
);

const blockquoteClasses = computed(() => ({
    [$style.blockquote]: true,
    [$style.blockquoteBlur]: isBlur.value,
}));

const value = computed(() => props.text.replace(/\n/g, '<br>'));

const copyLink = () => {
    clearTimeout(timeout);
    toggleIsLinkCopied(true);

    const link = `${location.origin}${location.pathname}?phraseNumb=${props.id}`;

    // Копируем ссылку в буфер обмена
    const temporaryInput = document.createElement('input');
    temporaryInput.setAttribute('value', link);
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand('copy');
    document.body.removeChild(temporaryInput);
    timeout = setTimeout(() => toggleIsLinkCopied(false), 1000);
};

const textBlock = ref<HTMLDivElement>();
const editText = ref(props.text);
const editAuthor = ref(props.author);
const textBlockHeight = ref(0);
const toggleIsEditable = () => {
    textBlockHeight.value = (textBlock.value?.clientHeight ?? 0) + 15;
    editText.value = props.text;
    editAuthor.value = props.author;
    store.toggleIsEditableAphorism(props.id);
};

const isChangedAphorism = computed(() => editText.value !== props.text || editAuthor.value !== props.author);

const saveAphorism = () => store.saveAphorism({
    author: editAuthor.value,
    id: props.id,
    text: editText.value,
});

const { close, open: deleteAphorism } = useModal({
    attrs: {
        getCancelText: () => 'Не хочу',
        getIsShowInput: () => false,
        getTitle: () => `Хочешь удалить афоризм #${props.numb}?`,
        onApply() {
            void (async () => {
                await store.removeAphorism(props.id);
                close();
            })();
        },
        onCancel() {
            close();
        },
    },
    component: Modal,
});

watch(
    () => props.id,
    () => {
        editText.value = props.text;
        editAuthor.value = props.author;
    },
);
</script>

<style lang="scss" module>
    .blockquote {
        position: relative;
        display: flex;
        align-items: center;
        margin: 0;
        padding-block: 40px;
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        border-left: 8px solid var(--border-left-color);
        background: var(--blockquote-bg-1);
        color: var(--blockquote-color);
        font-weight: 300;
        line-height: 30px;
        scroll-margin: 60px;

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
            color: var(--border-left-color);
            font-family: Arial, Verdana, Tahoma, sans-serif;
            font-size: 90px;
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
        color: var(--background-color);
        text-align: center;
        text-transform: none;
        font-size: 14px;
        line-height: 16px;
        cursor: default;
        filter: drop-shadow(0 7px 11px var(--copy-shadow-color))
            drop-shadow(0 3px 5px var(--copy-shadow-color));
    }

    .numb {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        min-width: 100px;
        height: 100%;
        font-size: 25px;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .text {
        font-size: 28px;
    }

    .textarea {
        width: 100%;
        border: none;
        background-color: transparent;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 28px;
        resize: none;
    }

    .textareaAuthor {
        font-size: 20px;
        font-style: italic;
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

    .edit, .save, .delete {
        position: absolute;
        top: 10px;
        right: 10px;
        color: var(--icon-color);
        cursor: pointer;
        user-select: none;
    }

    .save {
        top: 40px;
    }

    .delete {
        top: initial;
        bottom: 10px;
    }

    @media screen and (width <= 600px) {
        .numb {
            width: 60px;
            min-width: 60px;
        }
    }
</style>
