import { parse } from './parse';

describe('parse', () => {
    describe('simple statement', () => {
        test('expect result using string value', () => {
            expect(parse('Name=="Batman"')).toEqual({
                prop: 'Name',
                rel: '==',
                value: 'Batman',
                type: 'statement',
                arity: 'binary'
            });
        });
        test('expect result using int values', () => {
            expect(parse('Nr>13')).toEqual({
                prop: 'Nr',
                rel: '>',
                value: 13,
                type: 'statement',
                arity: 'binary'
            });
            expect(parse('Status<=37')).toEqual({
                prop: 'Status',
                rel: '<=',
                value: 37,
                type: 'statement',
                arity: 'binary'
            });
        });
        test('expect result using boolean values', () => {
            expect(parse('Ready==true')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true,
                type: 'statement',
                arity: 'binary'
            });
            expect(parse('Ready!=false')).toEqual({
                prop: 'Ready',
                rel: '!=',
                value: false,
                type: 'statement',
                arity: 'binary'
            });
        });
    });

    describe('expect whitespaces in statement are ignored', () => {
        test('in front of statement', () => {
            expect(parse(' Ready==true')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true,
                type: 'statement',
                arity: 'binary'
            });
        });
        test('next to relation', () => {
            expect(parse('Ready  ==\ttrue')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true,
                type: 'statement',
                arity: 'binary'
            });
        });
        test('after statement', () => {
            expect(parse(' Ready==true\n')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true,
                type: 'statement',
                arity: 'binary'
            });
        });
    });

    describe('grouping statements', () => {
        test('simple "and"', () => {
            expect(parse('Name=="batman" and Status>7')).toEqual({
                type: 'and',
                left: {
                    prop: 'Name',
                    rel: '==',
                    value: 'batman',
                    type: 'statement',
                    arity: 'binary'
                },
                right: {
                    prop: 'Status',
                    rel: '>',
                    value: 7,
                    type: 'statement',
                    arity: 'binary'
                }
            });
        });

        test('simple "or"', () => {
            expect(parse('Status==1 or Status==3')).toEqual({
                type: 'or',
                left: {
                    prop: 'Status',
                    rel: '==',
                    value: 1,
                    type: 'statement',
                    arity: 'binary'
                },
                right: {
                    prop: 'Status',
                    rel: '==',
                    value: 3,
                    type: 'statement',
                    arity: 'binary'
                }
            });
        });

        test('multiple "and"', () => {
            expect(parse('Name=="batman" and Status==3 and Nr>17')).toEqual({
                type: 'and',
                left: {
                    type: 'and',
                    left: {
                        prop: 'Name',
                        rel: '==',
                        value: 'batman',
                        type: 'statement',
                        arity: 'binary'
                    },
                    right: {
                        prop: 'Status',
                        rel: '==',
                        value: 3,
                        type: 'statement',
                        arity: 'binary'
                    }
                },
                right: {
                    prop: 'Nr',
                    rel: '>',
                    value: 17,
                    type: 'statement',
                    arity: 'binary'
                }
            });
        });

        test('multiple "or"', () => {
            expect(parse('Status==1 or Status==3 or Status==5')).toEqual({
                type: 'or',
                left: {
                    type: 'or',
                    left: {
                        prop: 'Status',
                        rel: '==',
                        value: 1,
                        type: 'statement',
                        arity: 'binary'
                    },
                    right: {
                        prop: 'Status',
                        rel: '==',
                        value: 3,
                        type: 'statement',
                        arity: 'binary'
                    }
                },
                right: {
                    prop: 'Status',
                    rel: '==',
                    value: 5,
                    type: 'statement',
                    arity: 'binary'
                }
            });
        });

        test('expect "and" to have higher precedence than "or"', () => {
            expect(
                parse(
                    'Nr == 17 or Status > 3 and Status < 7 or Name == "batman"'
                )
            ).toEqual({
                type: 'or',
                left: {
                    type: 'or',
                    left: {
                        prop: 'Nr',
                        rel: '==',
                        value: 17,
                        type: 'statement',
                        arity: 'binary'
                    },
                    right: {
                        type: 'and',
                        left: {
                            prop: 'Status',
                            rel: '>',
                            value: 3,
                            type: 'statement',
                            arity: 'binary'
                        },
                        right: {
                            prop: 'Status',
                            rel: '<',
                            value: 7,
                            type: 'statement',
                            arity: 'binary'
                        }
                    }
                },
                right: {
                    prop: 'Name',
                    rel: '==',
                    value: 'batman',
                    type: 'statement',
                    arity: 'binary'
                }
            });
        });
    });
});
