import {
    beforeEach,
    describe,
    expect,
    type Mock,
    test,
    vi,
} from 'vitest';
import type { TExtendedError } from '@/shared/types';
import type { AxiosInstance } from 'axios';
import {
    getAxiosInstance,
    getErrorMessage,
    getSecondsDiff,
} from '@/shared/helpers';

type TMockAuthStore = {
    accessToken: string;
    checkAccessToken: Mock<() => Promise<void>>;
};

const {
    axiosCreate,
    mockAuthStore,
    mockAxiosInstance,
} = vi.hoisted(() => {
    const mockAxiosInstance = { post: vi.fn() } as unknown as AxiosInstance;

    const axiosCreate = vi.fn((): AxiosInstance => mockAxiosInstance);

    const mockAuthStore: TMockAuthStore = {
        accessToken: '',
        checkAccessToken: vi.fn<() => Promise<void>>(),
    };

    return {
        axiosCreate,
        mockAuthStore,
        mockAxiosInstance,
    };
});

vi.mock('@/stores/useAuth.store', () => ({ useAuthStore: (): TMockAuthStore => mockAuthStore }));

vi.mock('axios', () => ({ default: { create: axiosCreate } }));

const createExtendedError = (
    message: string,
    response?: TExtendedError['response'],
): TExtendedError => {
    const error = new Error(message) as TExtendedError;
    error.response = response;

    return error;
};

describe('getSecondsDiff', () => {
    test('Проверяем метод getSecondsDiff при разнице в день', () => {
        const d1 = new Date('2026-03-21');
        const d2 = new Date('2026-03-22');
        expect(getSecondsDiff(d1, d2)).toBe(86400);
    });

    test('Проверяем метод getSecondsDiff при разнице в час', () => {
        const d1 = new Date('2026-03-21 16:00:00');
        const d2 = new Date('2026-03-21 15:00:00');
        expect(getSecondsDiff(d1, d2)).toBe(3600);
    });

    test('Проверяем метод getSecondsDiff при разнице в минуту', () => {
        const d1 = new Date('2026-03-21 16:00:00');
        const d2 = new Date('2026-03-21 16:01:00');
        expect(getSecondsDiff(d1, d2)).toBe(60);
    });

    test('Проверяем метод getSecondsDiff при разнице в секунду', () => {
        const d1 = new Date('2026-03-21 16:00:00');
        const d2 = new Date('2026-03-21 16:00:01');
        expect(getSecondsDiff(d1, d2)).toBe(1);
    });

    test('Проверяем метод getSecondsDiff при одинаковых датах', () => {
        const date = new Date('2026-03-21 16:00:00');
        expect(getSecondsDiff(date, date)).toBe(0);
    });
});

describe('getErrorMessage', () => {
    test('Возвращает title из response.data', () => {
        const error: TExtendedError = createExtendedError('Ошибка', { data: { title: 'Неверный пароль' } });

        expect(getErrorMessage(error)).toBe('Неверный пароль');
    });

    test('Возвращает сообщение по умолчанию, если response отсутствует', () => {
        expect(getErrorMessage({})).toBe('Произошла ошибка');
    });

    test('Возвращает кастомное сообщение по умолчанию', () => {
        expect(getErrorMessage({}, 'Что-то пошло не так')).toBe('Что-то пошло не так');
    });

    test('Возвращает message у Error, если title равен сообщению по умолчанию', () => {
        const error = new Error('Сеть недоступна');

        expect(getErrorMessage(error)).toBe('Сеть недоступна');
    });

    test('Возвращает title из response, даже если ошибка instanceof Error', () => {
        const error = createExtendedError('Сеть недоступна', { data: { title: 'Ошибка сервера' } });

        expect(getErrorMessage(error)).toBe('Ошибка сервера');
    });

    test('Возвращает сообщение по умолчанию, если response.data не объект', () => {
        const error = { response: { data: 'unexpected' } } as unknown;

        expect(getErrorMessage(error, 'Ошибка запроса')).toBe('Ошибка запроса');
    });

    test('Возвращает message у Error, если title в response пустой', () => {
        const error = createExtendedError('Таймаут', { data: { title: '' } });

        expect(getErrorMessage(error)).toBe('Таймаут');
    });
});

describe('getAxiosInstance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuthStore.accessToken = '';
    });

    test('Вызывает checkAccessToken перед созданием axios-инстанса', async () => {
        await getAxiosInstance();

        expect(mockAuthStore.checkAccessToken).toHaveBeenCalledOnce();
    });

    test('Создаёт axios-инстанс без Authorization, если токен пустой', async () => {
        mockAuthStore.accessToken = '';

        const axiosInstance = await getAxiosInstance();
        const instance = axiosInstance.value;

        expect(axiosCreate).toHaveBeenCalledWith({ headers: {} });
        expect(instance).toBe(mockAxiosInstance);
    });

    test('Создаёт axios-инстанс с Bearer-токеном, если токен есть', async () => {
        mockAuthStore.accessToken = 'test-token';

        const axiosInstance = await getAxiosInstance();
        const instance = axiosInstance.value;

        expect(axiosCreate).toHaveBeenCalledWith({ headers: { Authorization: 'Bearer test-token' } });
        expect(instance).toBe(mockAxiosInstance);
    });
});
