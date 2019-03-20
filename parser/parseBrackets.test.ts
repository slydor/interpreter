import { parseBrackets } from './parseBrackets';

describe('parseBrackets: simplified grammar to test and/or with brackets', () => {
    test('simple statements', () => {
        expect(parseBrackets('a')).toEqual('a');
        expect(parseBrackets('b')).toEqual('b');
        expect(parseBrackets('c')).toEqual('c');
    });

    test('"and" have precedence over "or"', () => {
        expect(parseBrackets('a and b or c')).toEqual({
            type: 'or',
            l: { type: 'and', l: 'a', r: 'b' },
            r: 'c'
        });
        expect(parseBrackets('a or b and c')).toEqual({
            type: 'or',
            l: 'a',
            r: { type: 'and', l: 'b', r: 'c' }
        });
    });

    test('"and" have precedence over "or" (extended)', () => {
        expect(parseBrackets('a and b or a and c or b and b')).toEqual({
            type: 'or',
            l: {
                type: 'or',
                l: {
                    type: 'and',
                    l: 'a',
                    r: 'b'
                },
                r: {
                    type: 'and',
                    l: 'a',
                    r: 'c'
                }
            },
            r: {
                type: 'and',
                l: 'b',
                r: 'b'
            }
        });
    });

    test('simple brackets do not affect result', () => {
        expect(parseBrackets('(a) and b or (c)')).toEqual({
            type: 'or',
            l: { type: 'and', l: 'a', r: 'b' },
            r: 'c'
        });
        expect(parseBrackets('( a or b and c)')).toEqual({
            type: 'or',
            l: 'a',
            r: { type: 'and', l: 'b', r: 'c' }
        });
    });

    test('"or" in brackets should precede "and"', () => {
        expect(parseBrackets('a and (b or c)')).toEqual({
            type: 'and',

            l: 'a',
            r: { type: 'or', l: 'b', r: 'c' }
        });
        expect(parseBrackets('(a or b) and c')).toEqual({
            type: 'and',
            l: { type: 'or', l: 'a', r: 'b' },
            r: 'c'
        });
    });

    test('extended brackets example', () => {
        expect(parseBrackets('(a and ((b or a) or c)) and (b or b)')).toEqual({
            type: 'and',
            l: {
                type: 'and',
                l: 'a',
                r: {
                    type: 'or',
                    l: {
                        type: 'or',
                        l: 'b',
                        r: 'a'
                    },
                    r: 'c'
                }
            },
            r: {
                type: 'or',
                l: 'b',
                r: 'b'
            }
        });
    });
});
