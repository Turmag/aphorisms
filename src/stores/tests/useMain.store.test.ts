import { createPinia, setActivePinia } from 'pinia';
import {
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from 'vitest';
import { nextTick } from 'vue';
import { useMainStore } from '@/stores/useMain.store';
import type * as VueUse from '@vueuse/core';
import Api from '@/shared/api/MainApi';

const storedValues = vi.hoisted(() => new Map<string, string>());

vi.mock('@vueuse/core', async importOriginal => {
    const vueUse = await importOriginal<typeof VueUse>();
    return {
        ...vueUse,
        useStorage: (key: string, defaults: number) => vueUse.useStorage(key, defaults, {
            getItem: name => storedValues.get(name) ?? null,
            setItem: (name, value) => storedValues.set(name, value),
            removeItem: name => storedValues.delete(name),
        }),
    };
});

vi.mock('@/shared/api/MainApi', () => ({
    default: {
        getAphorisms: vi.fn(),
        removeAphorism: vi.fn(),
    },
}));
vi.mock('@/shared/composables/useSpecialToast', () => ({
    useSpecialToast: () => ({
        successToast: vi.fn(),
        showError: vi.fn(),
    }),
}));

const item = {
    author: 'Автор',
    id: '73',
    numb: 51,
    text: 'Афоризм',
};
const getAphorisms = vi.mocked(Api.getAphorisms);

describe('Постраничная загрузка афоризмов', () => {
    beforeEach(() => {
        storedValues.clear();
        setActivePinia(createPinia());
        vi.resetAllMocks();
        getAphorisms.mockResolvedValue({
            data: {
                items: [item],
                page: 1,
                total: 101,
            },
        } as never);
    });

    test('Восстанавливает сохранённый размер страницы при первом запросе', async () => {
        storedValues.set('aphorismsItemsPerPage', '150');
        const store = useMainStore();
        await store.getAphorisms();
        expect(store.itemsPerPage).toBe(150);
        expect(getAphorisms).toHaveBeenCalledWith(expect.objectContaining({ limit: 150 }));
    });

    test('Сохраняет размер страницы при изменении и сбросе', async () => {
        const store = useMainStore();
        store.itemsPerPage = 200;
        await nextTick();
        expect(storedValues.get('aphorismsItemsPerPage')).toBe('200');
        store.resetFilters();
        await nextTick();
        expect(storedValues.get('aphorismsItemsPerPage')).toBe('50');
    });

    test('Заменяет недопустимое сохранённое количество на 50', () => {
        storedValues.set('aphorismsItemsPerPage', '300');
        expect(useMainStore().itemsPerPage).toBe(50);
    });

    test('Прямая ссылка включает поиск по номеру одним запросом', async () => {
        getAphorisms.mockResolvedValueOnce({
            data: {
                items: [item],
                page: 1,
                total: 1,
            },
        } as never);
        const store = useMainStore();
        const loading = store.loadFromQuery('51');
        expect(store.isSearchByNumber).toBe(true);
        expect(store.filterWord).toBe('51');
        await loading;
        expect(getAphorisms).toHaveBeenCalledOnce();
        expect(getAphorisms).toHaveBeenCalledWith({
            limit: 50,
            page: 1,
            search: '51',
            searchByNumber: 1,
        });
        expect(store.aphorisms).toEqual([item]);
        expect(store.aphorisms[0].numb).toBe(51);
        expect(store.aphorisms[0].id).toBe('73');
        expect(store.total).toBe(1);
    });

    test('Поиск и изменение размера страницы сбрасывают страницу одним запросом', async () => {
        const store = useMainStore();
        store.currentPage = 3;
        store.itemsPerPage = 150;
        store.filterWord = 'Автор';
        await nextTick();
        expect(getAphorisms).toHaveBeenCalledOnce();
        expect(getAphorisms).toHaveBeenCalledWith({
            limit: 150,
            page: 1,
            search: 'Автор',
            searchByNumber: 0,
        });
    });

    test('Запоздавший ответ не заменяет актуальную страницу', async () => {
        let finishFirst!: (value: never) => void;
        getAphorisms.mockImplementationOnce(() => new Promise(resolve => finishFirst = resolve));
        const store = useMainStore();
        const first = store.getAphorisms();
        getAphorisms.mockResolvedValueOnce({
            data: {
                items: [item],
                page: 2,
                total: 101,
            },
        } as never);
        store.changePage(2);
        await vi.waitFor(() => expect(store.isLoading).toBe(false));
        finishFirst({
            data: {
                items: [],
                page: 1,
                total: 0,
            },
        } as never);
        await first;
        expect(store.currentPage).toBe(2);
        expect(store.aphorisms).toEqual([item]);
    });

    test('После удаления принимает скорректированную сервером страницу', async () => {
        const store = useMainStore();
        store.currentPage = 3;
        getAphorisms.mockResolvedValueOnce({
            data: {
                items: [item],
                page: 2,
                total: 100,
            },
        } as never);
        await store.removeAphorism('101');
        expect(store.currentPage).toBe(2);
        expect(store.total).toBe(100);
        expect(getAphorisms).toHaveBeenCalledWith({
            limit: 50,
            page: 3,
            search: '',
            searchByNumber: 0,
        });
    });

    test('Сброс очищает поиск, размер страницы и режим поиска по номеру с одним запросом', async () => {
        const store = useMainStore();
        store.filterWord = 'Нет результатов';
        store.itemsPerPage = 200;
        store.isSearchByNumber = true;
        await nextTick();
        getAphorisms.mockClear();
        store.currentPage = 4;
        store.resetFilters();
        await nextTick();
        expect(store.filterWord).toBe('');
        expect(store.itemsPerPage).toBe(50);
        expect(store.currentPage).toBe(1);
        expect(store.isSearchByNumber).toBe(false);
        expect(getAphorisms).toHaveBeenCalledOnce();
        expect(getAphorisms).toHaveBeenCalledWith({
            limit: 50,
            page: 1,
            search: '',
            searchByNumber: 0,
        });
    });

    test('Без параметра ссылки поиск по номеру выключен', async () => {
        const store = useMainStore();
        expect(store.isSearchByNumber).toBe(false);
        await store.loadFromQuery('51');
        getAphorisms.mockClear();
        await store.loadFromQuery();
        expect(store.isSearchByNumber).toBe(false);
        expect(store.filterWord).toBe('');
        expect(getAphorisms).toHaveBeenCalledOnce();
        expect(getAphorisms).toHaveBeenCalledWith(expect.objectContaining({
            search: '',
            searchByNumber: 0,
        }));
    });

    test('Переключение галочки сбрасывает страницу и меняет режим поиска', async () => {
        const store = useMainStore();
        store.currentPage = 4;
        store.filterWord = '51';
        store.isSearchByNumber = true;
        await nextTick();
        expect(getAphorisms).toHaveBeenCalledOnce();
        expect(getAphorisms).toHaveBeenCalledWith(expect.objectContaining({
            page: 1,
            search: '51',
            searchByNumber: 1,
        }));
        getAphorisms.mockClear();
        store.isSearchByNumber = false;
        await nextTick();
        expect(getAphorisms).toHaveBeenCalledWith(expect.objectContaining({
            search: '51',
            searchByNumber: 0,
        }));
    });

    test('Повторная загрузка после ошибки сохраняет номер из ссылки', async () => {
        getAphorisms.mockRejectedValueOnce(new Error('Нет сети'));
        const store = useMainStore();
        await store.loadFromQuery('51');
        expect(store.loadError).toBe(true);
        await store.getAphorisms();
        expect(getAphorisms).toHaveBeenLastCalledWith(expect.objectContaining({
            search: '51',
            searchByNumber: 1,
        }));
        expect(store.loadError).toBe(false);
    });

    test('Ошибка загрузки показывает состояние для повторного запроса', async () => {
        getAphorisms.mockRejectedValueOnce(new Error('Нет сети'));
        const store = useMainStore();
        await store.getAphorisms();
        expect(store.isLoading).toBe(false);
        expect(store.loadError).toBe(true);
        await store.getAphorisms();
        expect(store.loadError).toBe(false);
    });
});
