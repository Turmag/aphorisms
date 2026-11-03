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
import Api from '@/shared/api/MainApi';

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
    id: '51',
    numb: 51,
    text: 'Афоризм',
};
const getAphorisms = vi.mocked(Api.getAphorisms);

describe('Постраничная загрузка афоризмов', () => {
    beforeEach(() => {
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

    test('Запрашивает страницу по 50 элементов и передаёт прямую ссылку', async () => {
        const store = useMainStore();
        await store.getAphorisms('51');
        expect(getAphorisms).toHaveBeenCalledWith({
            limit: 50,
            page: 1,
            search: '',
            phraseNumb: '51',
        });
        expect(store.aphorisms).toEqual([item]);
        expect(store.total).toBe(101);
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
            phraseNumb: undefined,
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
            phraseNumb: undefined,
        });
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
