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
        <IconBase
            v-if="authStoreVariable.isAuthorized"
            :class="$style.edit"
            width="20"
            height="20"
            :viewBoxWidth="35"
            :viewBoxHeight="35"
            @click="toggleIsEditable"
        >
            <Edit />
        </IconBase>
        <IconBase
            v-if="authStoreVariable.isAuthorized && isChangedAphorism"
            :class="$style.save"
            width="20"
            height="20"
            :viewBoxWidth="62"
            :viewBoxHeight="62"
            asdf
            @click="saveAphorism"
        >
            <Save />
        </IconBase>
        <IconBase
            v-if="authStoreVariable.isAuthorized"
            :class="$style.delete"
            width="20"
            height="20"
            :viewBoxWidth="24"
            :viewBoxHeight="24"
            @click="deleteAphorism"
        >
            <Delete />
        </IconBase>
    </blockquote>
</template>

<script setup lang="ts">
import { useModal } from 'vue-final-modal';
import IconBase from '@/components/shared/IconBase.vue';
import Modal from '@/components/modal/Modal.vue';
import {
    CopyDecor,
    Edit,
    Save,
    Delete,
} from '@/assets/icons';
import {
    ref,
    computed,
    watch,
    useCssModule,
} from 'vue';
import { useRoute } from 'vue-router';
import { mainStore } from '@/store/main';
import { authStore } from '@/store/auth';
import { useToggle } from '@vueuse/core';

interface IProps {
    id: string;
    text: string;
    author: string;
    numb: number;
    isEditable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), { isEditable: false });

const route = useRoute();
const store = mainStore();
const authStoreVariable = authStore();
const $style = useCssModule();

const [isLinkCopied, toggleIsLinkCopied] = useToggle();

let timeout: ReturnType<typeof setTimeout>;

const isBlur = computed(
    () =>
        Boolean(route.query.phraseNumb)
        && route.query.phraseNumb !== String(props.id)
        && !store.unBlured,
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
    id: props.id,
    text: editText.value,
    author: editAuthor.value,
});

const { open: deleteAphorism, close } = useModal({
    component: Modal,
    attrs: {
        getTitle: () => `Хочешь удалить афоризм #${props.numb}?`,
        getCancelText: () => 'Не хочу',
        getIsShowInput: () => false,
        onCancel() {
            close();
        },
        onApply() {
            void (async () => {
                await store.removeAphorism(props.id);
                close();
            })();
        },
    },
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
        margin: 0;
        padding: 40px 40px 40px 100px;
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
        position: absolute;
        top: 50px;
        left: 15px;
        font-size: 25px;
    }

    .text {
        margin-bottom: 10px;
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
</style>
