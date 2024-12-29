import { watch } from 'vue';
import { mainStore } from '@/store/main';
import { getSecondsDiff } from '@/shared/helpers';
import type { IScrollTopObject } from '@/shared/types';

export const useScrollPosition = () => {
    const store = mainStore();

    window.onbeforeunload = () => {
        const object = {
            top: window.scrollY,
            time: new Date().getTime(),
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
