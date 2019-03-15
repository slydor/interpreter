import { interpret } from './interpret';
describe('interpret', () => {
    test('expect Name batman', () => {
        expect(interpret('Name == "batman"')).toBe(true);
    });
});
