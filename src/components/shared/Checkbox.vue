<template>
    <div :class="$style.wrapper">
        <div :class="$style.checkboxWrapper">
            <span :class="$style.checkbox">
                <input id="input" v-model="modelValue" type="checkbox">
                <svg>
                    <use xlink:href="#checkbox-icon" :class="$style.checkbox" />
                </svg>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <symbol id="checkbox-icon" viewBox="0 0 22 22">
                    <path fill="none" stroke="currentColor" d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2" />
                </symbol>
            </svg>
        </div>
        <label v-if="$slots" for="input" :class="$style.text">
            <slot />
        </label>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>();
</script>

<style lang="scss" module>
    .wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        user-select: none;
    }

    .checkbox {
        display: block;
        width: 100%;
        height: 100%;
    }

    .checkboxWrapper {
        display: flex;

        .checkbox {
            --bg: var(--background-color);
            --brdr: var(--color);
            --brdr-actv: var(--color);
            --brdr-hovr: #bbc1e1;
            --dur: calc((var(--size, 2) / 2) * 0.6s);

            position: relative;
            display: inline-block;
            width: calc(var(--size, 1) * 22px);

            &::after {
                content: "";
                display: block;
                width: 100%;
                padding-top: 100%;
            }

            > * {
                position: absolute;
            }

            svg {
                top: 0;
                left: 0;
                display: block;
                width: 100%;
                height: 100%;
                color: var(--brdr);
                transition: stroke-dasharray var(--dur), stroke-dashoffset var(--dur);
                pointer-events: none;
                stroke: var(--stroke, var(--border-active));
                stroke-dasharray: var(--dash-array, 93);
                stroke-dashoffset: var(--dash-offset, 94);
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 2px;
            }

            input {
                display: block;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                border-radius: calc(var(--size, 1) * 4px);
                border: calc(var(--new-border, var(--size, 1)) * 1px) solid;
                background-color: var(--bg);
                color: var(--new-border-clear, var(--brdr));
                outline: none;
                transition: all calc(var(--dur) / 3) linear;
                cursor: pointer;
                appearance: none;
                -webkit-tap-highlight-color: transparent;

                &:hover, &:checked {
                    --new-border: calc(var(--size, 1) * 2);
                }

                &:hover {
                    --new-border-clear: var(--brdr-hovr);
                }

                &:checked {
                    --new-border-clear: var(--brdr-actv);

                    transition-delay: calc(var(--dur) / 1.3);
                }

                &:checked + svg {
                    --dash-array: 16 93;
                    --dash-offset: 109;
                }
            }
        }
    }

    .text {
        color: var(--color);
    }
  </style>
