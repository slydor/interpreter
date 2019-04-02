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

    test('expect undefined for keyword IS without NULL', () => {
        expect(parseBoolean('main.Name IS')).toBe(undefined);
    });
    test('expect undefined for keyword NULL without IS', () => {
        expect(parseBoolean('main.Name NULL')).toBe(undefined);
    });
    test('expect undefined for keyword NOT without IS or NULL', () => {
        expect(parseBoolean('main.Name NOT')).toBe(undefined);
    });
    test('expect undefined for keywords IS+NOT without NULL', () => {
        expect(parseBoolean('main.Name IS NOT')).toBe(undefined);
    });
    test('expect undefined for keywords NOT+NUL without IS', () => {
        expect(parseBoolean('main.Name NOT NULL')).toBe(undefined);
    });
    test('expect undefined for keywords IS+NULL in wrong order', () => {
        expect(parseBoolean('IS main.Name NULL')).toBe(undefined);
        expect(parseBoolean('IS NULL main.Name')).toBe(undefined);
        expect(parseBoolean('main.Name NULL IS')).toBe(undefined);
        expect(parseBoolean('NULL main.Name IS')).toBe(undefined);
    });
    test('expect undefined for keywords IS+NOT+NULL in wrong order', () => {
        expect(parseBoolean('main.Name NOT IS NULL')).toBe(undefined);
        expect(parseBoolean('main.Name NULL IS NOT')).toBe(undefined);
        expect(parseBoolean('main.Name IS NULL NOT')).toBe(undefined);
    });

    test('expect keywords "is null" to create falsy check node', () => {
        expect(parseBoolean('main.Name is null')).toEqual({
            _type: 'FALSY_CHECK',
            v: {
                _type: 'PROPERTY_VALUE',
                p: 'Name'
            }
        });
    });
    test('expect keywords "Is Null" in pascal case to create falsy check node', () => {
        expect(parseBoolean('main.Name Is Null')).toEqual({
            _type: 'FALSY_CHECK',
            v: {
                _type: 'PROPERTY_VALUE',
                p: 'Name'
            }
        });
    });
    test('expect keywords "IS NULL" in upper case to create falsy check node', () => {
        expect(parseBoolean('main.Name IS NULL')).toEqual({
            _type: 'FALSY_CHECK',
            v: {
                _type: 'PROPERTY_VALUE',
                p: 'Name'
            }
        });
    });

    test('expect keywords "is not null" to create truthy check node', () => {
        expect(parseBoolean('main.Name is not null')).toEqual({
            _type: 'TRUTHY_CHECK',
            v: {
                _type: 'PROPERTY_VALUE',
                p: 'Name'
            }
        });
    });
    test('expect keywords "Is Not Null" in pascal case to create truthy check node', () => {
        expect(parseBoolean('main.Name Is Not Null')).toEqual({
            _type: 'TRUTHY_CHECK',
            v: {
                _type: 'PROPERTY_VALUE',
                p: 'Name'
            }
        });
    });
    test('expect keywords "IS NOT NULL" in upper case to create truthy check node', () => {
        expect(parseBoolean('main.Name IS NOT NULL')).toEqual({
            _type: 'TRUTHY_CHECK',
            v: {
                _type: 'PROPERTY_VALUE',
                p: 'Name'
            }
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

    test('expect different binary comparisons combined works', () => {
        expect(
            parseBoolean(
                '1 < 2 or 3 <= 4 or 5 > 6 or 7 >= 8 or 9 == 0 or 10 != 11'
            )
        ).toEqual({
            _type: 'OR',
            l: {
                _type: 'OR',
                l: {
                    _type: 'OR',
                    l: {
                        _type: 'OR',
                        l: {
                            _type: 'OR',
                            l: {
                                _type: 'BINARY',
                                bin: '<',
                                l: 1,
                                r: 2
                            },
                            r: {
                                _type: 'BINARY',
                                bin: '<=',
                                l: 3,
                                r: 4
                            }
                        },
                        r: {
                            _type: 'BINARY',
                            bin: '>',
                            l: 5,
                            r: 6
                        }
                    },
                    r: {
                        _type: 'BINARY',
                        bin: '>=',
                        l: 7,
                        r: 8
                    }
                },
                r: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 9,
                    r: 0
                }
            },
            r: {
                _type: 'BINARY',
                bin: '!=',
                l: 10,
                r: 11
            }
        });
    });

    test('expect AND keyword to be case insensitive', () => {
        const expected = {
            _type: 'AND',
            l: {
                _type: 'BINARY',
                bin: '==',
                l: 0,
                r: 0
            },
            r: {
                _type: 'BINARY',
                bin: '==',
                l: 0,
                r: 0
            }
        };
        expect(parseBoolean('0==0 and 0==0')).toEqual(expected);
        expect(parseBoolean('0==0 And 0==0')).toEqual(expected);
        expect(parseBoolean('0==0 AND 0==0')).toEqual(expected);
    });

    test('expect OR keyword to be case insensitive', () => {
        const expected = {
            _type: 'OR',
            l: {
                _type: 'BINARY',
                bin: '==',
                l: 0,
                r: 0
            },
            r: {
                _type: 'BINARY',
                bin: '==',
                l: 0,
                r: 0
            }
        };
        expect(parseBoolean('0==0 or 0==0')).toEqual(expected);
        expect(parseBoolean('0==0 Or 0==0')).toEqual(expected);
        expect(parseBoolean('0==0 OR 0==0')).toEqual(expected);
    });

    test('expect boolean value true to be written in lower case, pascal case or upper case', () => {
        const expected = {
            _type: 'BINARY',
            bin: '==',
            l: true,
            r: true
        };
        expect(parseBoolean('true == true')).toEqual(expected);
        expect(parseBoolean('True == True')).toEqual(expected);
        expect(parseBoolean('TRUE == TRUE')).toEqual(expected);
    });

    test('expect boolean value false to be written in lower case, pascal case or upper case', () => {
        const expected = {
            _type: 'BINARY',
            bin: '==',
            l: false,
            r: false
        };
        expect(parseBoolean('false == false')).toEqual(expected);
        expect(parseBoolean('False == False')).toEqual(expected);
        expect(parseBoolean('FALSE == FALSE')).toEqual(expected);
    });

    test('expect negative integer to be parsed', () => {
        expect(parseBoolean('-1 < 0')).toEqual({
            _type: 'BINARY',
            bin: '<',
            l: -1,
            r: 0
        });
    });

    test('expect null to be parsed with ==', () => {
        expect(parseBoolean('null == 0')).toEqual({
            _type: 'BINARY',
            bin: '==',
            l: null,
            r: 0
        });
    });

    test('expect null to be parsed with !=', () => {
        expect(parseBoolean('null != 0')).toEqual({
            _type: 'BINARY',
            bin: '!=',
            l: null,
            r: 0
        });
    });

    test('expect null not to be parsable with <', () => {
        expect(parseBoolean('null < 0')).toEqual(undefined);
    });

    test('expect null not to be parsable with <=', () => {
        expect(parseBoolean('null <= 0')).toEqual(undefined);
    });

    test('expect null not to be parsable with >', () => {
        expect(parseBoolean('null > 0')).toEqual(undefined);
    });

    test('expect null not to be parsable with >=', () => {
        expect(parseBoolean('null >= 0')).toEqual(undefined);
    });

    test('expect null value to be written in lower case, pascal case or upper case', () => {
        const expected = {
            _type: 'BINARY',
            bin: '==',
            l: null,
            r: null
        };
        expect(parseBoolean('null == null')).toEqual(expected);
        expect(parseBoolean('Null == Null')).toEqual(expected);
        expect(parseBoolean('NULL == NULL')).toEqual(expected);
    });
});
