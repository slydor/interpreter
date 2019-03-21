import { interpret } from './interpret';
jest.mock('../propertyValues');

describe('boolean interpreter > mock Name as "batman"', () => {
    beforeEach(() => {
        require('../propertyValues').getPropertyValues = () => ({
            Name: 'batman'
        });
    });

    test('expect simple Name comparison to work (1)', () => {
        expect(interpret('main.Name == "batman"')).toBe(true);
    });
    test('expect simple Name comparison to work (2)', () => {
        expect(interpret('main.Name == "foobar"')).toBe(false);
    });
    test('expect simple Name comparison to work (3)', () => {
        expect(interpret('main.Name != "batman"')).toBe(false);
    });
    test('expect simple Name comparison to work (4)', () => {
        expect(interpret('main.Name != "foobar"')).toBe(true);
    });
});

describe('boolean interpreter > mock Status as 7, Id as "mockId" and Ready as true', () => {
    beforeEach(() => {
        require('../propertyValues').getPropertyValues = () => ({
            Status: 7,
            Id: 'mockId',
            Ready: true
        });
    });

    test('expect to compare Status with OR-groups correctly', () => {
        expect(interpret('main.Status == 7 or main.Status == 2 or main.Status == 3')).toBe(true);
        expect(interpret('main.Status == 1 or main.Status == 7 or main.Status == 3')).toBe(true);
        expect(interpret('main.Status == 1 or main.Status == 2 or main.Status == 7')).toBe(true);
        expect(interpret('main.Status == 1 or main.Status == 2 or main.Status == 3')).toBe(false);
    });

    test('expect to compare Status with OR-groups correctly', () => {
        expect(interpret('main.Status == 7 or main.Status == 2 or main.Status == 3')).toBe(true);
        expect(interpret('main.Status == 1 or main.Status == 7 or main.Status == 3')).toBe(true);
        expect(interpret('main.Status == 1 or main.Status == 2 or main.Status == 7')).toBe(true);
        expect(interpret('main.Status == 1 or main.Status == 2 or main.Status == 3')).toBe(false);
    });
});
