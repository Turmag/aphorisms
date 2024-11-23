import { watch } from 'vue';
import { mainStore } from '@/store/main';
import { getSecondsDiff } from '@/shared/helpers';
import type { IScrollTopObj } from '@/shared/types';

export const useScrollPosition = () => {
    const store = mainStore();

    window.onbeforeunload = () => {
        const obj = {
            top: window.scrollY,
            time: new Date().getTime(),
        };
        localStorage.setItem('aphorismsScrollTop', JSON.stringify(obj));
    };

    watch(
        () => store.isLoadedPage,
        () => {
            const aphorismsScrollTopStringify = localStorage.getItem('aphorismsScrollTop') ?? '{}';
            const aphorismsScrollTopObj = JSON.parse(aphorismsScrollTopStringify) as IScrollTopObj;
            if(aphorismsScrollTopObj.time) {
                const diffSeconds = getSecondsDiff(new Date(), new Date(aphorismsScrollTopObj.time));
                if(diffSeconds > 5) {
                    localStorage.removeItem('aphorismsScrollTop');
                } else {
                    window.scrollTo({ top: aphorismsScrollTopObj.top });
                }
            }
        },
    );
};
