import { watch } from 'vue';
import { mainStore } from '@/stores/main.store';
import type { IScrollTopObject } from '@/shared/types';
import { getSecondsDiff } from '@/shared/helpers';

export const useScrollPosition = () => {
    const store = mainStore();

    window.onbeforeunload = () => {
        const object = {
            time: new Date().getTime(),
            top: window.scrollY,
        };
        localStorage.setItem('aphorismsScrollTop', JSON.stringify(object));
    };

    watch(
        () => store.isLoadedPage,
        () => {
            const aphorismsScrollTopStringify = localStorage.getItem('aphorismsScrollTop') ?? '{}';
            const aphorismsScrollTopObject = JSON.parse(aphorismsScrollTopStringify) as IScrollTopObject;
            if (aphorismsScrollTopObject.time) {
                const diffSeconds = getSecondsDiff(new Date(), new Date(aphorismsScrollTopObject.time));
                if (diffSeconds > 5) {
                    localStorage.removeItem('aphorismsScrollTop');
                } else {
                    window.scrollTo({ top: aphorismsScrollTopObject.top });
                }
            }
        },
    );
};
