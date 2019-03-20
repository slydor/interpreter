import { parseBoolean } from './parseBoolean';

describe('parseBoolean: arbitrary nested statement comparison', () => {
    test('simple comparison (bool)', () => {
        expect(parseBoolean('true!=false')).toEqual({
            _type: 'BINARY',
            bin: '!=',
            l: true,
            r: false
        });
    });
    test('simple comparison (int)', () => {
        expect(parseBoolean('1 == 2')).toEqual({
            _type: 'BINARY',
            bin: '==',
            l: 1,
            r: 2
        });
    });
    test('simple comparison (str)', () => {
        expect(parseBoolean('"foo"  ==  "bar"')).toEqual({
            _type: 'BINARY',
            bin: '==',
            l: 'foo',
            r: 'bar'
        });
    });
    test('simple comparison (propValue, bool)', () => {
        expect(parseBoolean('main.Ready==true')).toEqual({
            _type: 'BINARY',
            bin: '==',
            l: { _type: 'PROPERTY_VALUE', p: 'Ready' },
            r: true
        });
    });
    test('simple comparison (int, propValue)', () => {
        expect(parseBoolean('13 != main.Status')).toEqual({
            _type: 'BINARY',
            bin: '!=',
            l: 13,
            r: { _type: 'PROPERTY_VALUE', p: 'Status' }
        });
    });
    test('simple comparison (propValue, propValue)', () => {
        expect(parseBoolean('main.Name  ==  main.Id')).toEqual({
            _type: 'BINARY',
            bin: '==',
            l: { _type: 'PROPERTY_VALUE', p: 'Name' },
            r: { _type: 'PROPERTY_VALUE', p: 'Id' }
        });
    });

    test('AND have precedence over OR', () => {
        expect(parseBoolean('1==2 and 3==4 or 5==6')).toEqual({
            _type: 'OR',
            l: {
                _type: 'AND',
                l: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 1,
                    r: 2
                },
                r: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 3,
                    r: 4
                }
            },
            r: {
                _type: 'BINARY',
                bin: '==',
                l: 5,
                r: 6
            }
        });
        expect(parseBoolean('1==2 or 3==4 and 5==6')).toEqual({
            _type: 'OR',
            l: {
                _type: 'BINARY',
                bin: '==',
                l: 1,
                r: 2
            },
            r: {
                _type: 'AND',
                l: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 3,
                    r: 4
                },
                r: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 5,
                    r: 6
                }
            }
        });
    });

    test('expect brackets to override precedence (with some random whitespaces to be ignored)', () => {
        expect(
            parseBoolean(
                '(1==2 and ( (  main.Ready == true   or\t"foo"==  main.Name ) or main.Id   !=main.Name  )   ) and ("bar"!=3  or   4==false)'
            )
        ).toEqual({
            _type: 'AND',
            l: {
                // (1==2 and ( (  main.Ready == true   or\t"foo"==  main.Name ) or main.Id   !=main.Name  )   )
                _type: 'AND',
                l: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 1,
                    r: 2
                },
                r: {
                    // ( (  main.Ready == true   or\t"foo"==  main.Name ) or main.Id   !=main.Name  )
                    _type: 'OR',
                    l: {
                        // (  main.Ready == true   or\t"foo"==  main.Name )
                        _type: 'OR',
                        l: {
                            _type: 'BINARY',
                            bin: '==',
                            l: {
                                _type: 'PROPERTY_VALUE',
                                p: 'Ready'
                            },
                            r: true
                        },
                        r: {
                            _type: 'BINARY',
                            bin: '==',
                            l: 'foo',
                            r: { _type: 'PROPERTY_VALUE', p: 'Name' }
                        }
                    },
                    r: {
                        // main.Id   !=main.Name
                        _type: 'BINARY',
                        bin: '!=',
                        l: {
                            _type: 'PROPERTY_VALUE',
                            p: 'Id'
                        },
                        r: {
                            _type: 'PROPERTY_VALUE',
                            p: 'Name'
                        }
                    }
                }
            },
            r: {
                // ("bar"!=3  or   4==false)
                _type: 'OR',
                l: {
                    _type: 'BINARY',
                    bin: '!=',
                    l: 'bar',
                    r: 3
                },
                r: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 4,
                    r: false
                }
            }
        });
    });
});
