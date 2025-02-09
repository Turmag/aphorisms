import { useStorage } from '@vueuse/core';
import { watch } from 'vue';
import { mainStore } from '@/stores/main.store';
import type { IScrollTopObject } from '@/shared/types';
import { getSecondsDiff } from '@/shared/helpers';

export const useScrollPosition = () => {
    const store = mainStore();
    const aphorismsScrollTop = useStorage('aphorismsScrollTop', {} as IScrollTopObject);

    window.onbeforeunload = () => {
        aphorismsScrollTop.value = {
            time: new Date().getTime(),
            top: window.scrollY,
        };
    };

    watch(
        () => store.isLoadedPage,
        () => {
            if (aphorismsScrollTop.value.time) {
                const diffSeconds = getSecondsDiff(new Date(), new Date(aphorismsScrollTop.value.time));
                if (diffSeconds > 5) {
                    aphorismsScrollTop.value = {} as IScrollTopObject;
                } else {
                    window.scrollTo({ top: aphorismsScrollTop.value.top });
                }
            }
        },
    );
};
