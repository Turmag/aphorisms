import {
    describe,
    expect,
    test,
} from 'vitest';
import { getSecondsDiff } from '@/shared/helpers';

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
});
