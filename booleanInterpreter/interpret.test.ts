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

describe('boolean interpreter > mock Batman as null, Name as "batman"', () => {
    beforeEach(() => {
        require('../propertyValues').getPropertyValues = () => ({
            Batman: null,
            Name: 'batman'
        });
    });

    test('expect Batman == null to be true', () => {
        expect(interpret('main.Batman == null')).toBe(true);
    });
    test('expect Batman != null to be false', () => {
        expect(interpret('main.Batman != null')).toBe(false);
    });
    test('expect Name == null to be false', () => {
        expect(interpret('main.Name == null')).toBe(false);
    });
    test('expect Name != null to be true', () => {
        expect(interpret('main.Name != null')).toBe(true);
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
        expect(
            interpret(
                'main.Status == 7 or main.Status == 2 or main.Status == 3'
            )
        ).toBe(true);
        expect(
            interpret(
                'main.Status == 1 or main.Status == 7 or main.Status == 3'
            )
        ).toBe(true);
        expect(
            interpret(
                'main.Status == 1 or main.Status == 2 or main.Status == 7'
            )
        ).toBe(true);
        expect(
            interpret(
                'main.Status == 1 or main.Status == 2 or main.Status == 3'
            )
        ).toBe(false);
    });

    test('expect to compare Ready with AND-groups correctly', () => {
        expect(
            interpret(
                'main.Ready == true and main.Ready != 1 and 2 != main.Ready'
            )
        ).toBe(true);
        expect(
            interpret(
                'main.Ready == false and main.Ready != 1 and 2 != main.Ready'
            )
        ).toBe(false);
        expect(
            interpret(
                'main.Ready == true and main.Ready == 1 and 2 != main.Ready'
            )
        ).toBe(false);
        expect(
            interpret(
                'main.Ready == true and main.Ready != 1 and 2 == main.Ready'
            )
        ).toBe(false);
    });

    test('expect to compare Id with brackets', () => {
        expect(
            interpret(
                '("mockId" == main.Id or main.Id == "bar") or main.Id == "foo"'
            )
        ).toBe(true);
        expect(
            interpret(
                '("foo" == main.Id or main.Id == "mockId") or main.Id == "bar"'
            )
        ).toBe(true);
        expect(
            interpret(
                '("foo" == main.Id or main.Id == "bar") and main.Id == main.Id'
            )
        ).toBe(false);
        expect(
            interpret(
                '("foo" == main.Id or main.Id == "bar") or main.Id == main.Id'
            )
        ).toBe(true);
    });
});
