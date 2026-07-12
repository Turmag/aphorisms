import { notify } from '@kyvg/vue3-notification';
import { getErrorMessage } from '@/shared/helpers';

export const useSpecialToast = () => {
    const successToast = (title: string, text: string) => {
        notify({
            text,
            title,
            type: 'success',
        });
    };

    const warningToast = (title: string, text: string) => {
        notify({
            text,
            title,
            type: 'warn',
        });
    };

    const errorToast = (title: string, text: string) => {
        notify({
            text,
            title,
            type: 'error',
        });
    };

    const showError = (error: unknown, title = 'Ошибка сервиса', defaultMessage?: string) => {
        const errorMessage = typeof error === 'string' ? error : getErrorMessage(error, defaultMessage);
        console.error('error', error);

        errorToast(title, errorMessage);
    };

    return {
        errorToast,
        showError,
        successToast,
        warningToast,
    };
};
