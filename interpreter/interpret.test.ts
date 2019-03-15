import { interpret } from './interpret';
describe('interpret', () => {
    test('expect Name batman', () => {
        expect(interpret('Name == "batman"')).toBe(true);
    });

    describe('expect "and"/"or" grouping to work', () => {
        test('expect only truthy "and" to be true', () => {
            expect(
                interpret('Name == "batman" and Nr == 13 and Status > 4')
            ).toBe(true);
        });
        test('expect only falsy "or" to be false', () => {
            expect(interpret('Name != "batman" or Nr < 7 or Status == 4')).toBe(
                false
            );
        });
        test('expect "and" grouping with one falsy operand to be false', () => {
            expect(
                interpret('Nr==0 and Status>4 and Status<=7 and Ready!=false')
            ).toBe(false);
            expect(
                interpret('Status>4 and Status<=7 and Ready!=false and Nr==0')
            ).toBe(false);
        });
        test('expects single "or" with truthy operand to be true', () => {
            expect(
                interpret('Nr==0 and Status>4 and Status<=7 or Ready==true')
            ).toBe(true);
            expect(
                interpret('Ready==true or Nr==0 and Status>4 and Status<=7')
            ).toBe(true);
        });
    });
});
