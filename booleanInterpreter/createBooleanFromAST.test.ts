import { createBooleanFromAST } from './createBooleanFromAST';
import { example1 } from './ASTData';

describe('createBooleanFromAST', () => {
    test('expect binary node with boolean values to create correct function and no parameter', () => {
        const bools = createBooleanFromAST({
            _type: 'BINARY',
            bin: '!=',
            l: true,
            r: false
        });
        expect(bools.func()).toBe(true);
        expect(bools.params).toHaveLength(0);
    });
    test('expect binary node with int values to create correct function and no parameter', () => {
        const ints = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: 1,
            r: 2
        });
        expect(ints.func()).toBe(false);
        expect(ints.params).toHaveLength(0);
    });
    test('expect binary node with string values to create correct function and no parameter', () => {
        const strings = createBooleanFromAST({
            _type: 'BINARY',
            bin: '!=',
            l: 'foo',
            r: 'bar'
        });
        expect(strings.func()).toBe(true);
        expect(strings.params).toHaveLength(0);
    });

    test('expect binary node with (Property, bool) values to create correct function and paramter', () => {
        const isReady = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: { _type: 'PROPERTY_VALUE', p: 'Ready' },
            r: true
        });
        expect(isReady.func(true)).toBe(true);
        expect(isReady.func(false)).toBe(false);
        expect(isReady.params).toHaveLength(1);
        expect(isReady.params[0]).toBe('Ready');
    });

    test('expect binary node with (int, Property) values to create correct function and paramter', () => {
        const equalsThirteen = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: 13,
            r: { _type: 'PROPERTY_VALUE', p: 'Status' }
        });
        expect(equalsThirteen.func(13)).toBe(true);
        expect(equalsThirteen.func(37)).toBe(false);
        expect(equalsThirteen.params).toHaveLength(1);
        expect(equalsThirteen.params[0]).toBe('Status');
    });

    test('expect binary node with (Property, Property) values to create correct function and paramter', () => {
        const equalsThirteen = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: { _type: 'PROPERTY_VALUE', p: 'Info' },
            r: { _type: 'PROPERTY_VALUE', p: 'Comment' }
        });
        expect(equalsThirteen.func('foobar', 'foobar')).toBe(true);
        expect(equalsThirteen.func('foo', 'bar')).toBe(false);
        expect(equalsThirteen.params).toHaveLength(2);
        expect(equalsThirteen.params[0]).toBe('Info');
        expect(equalsThirteen.params[1]).toBe('Comment');
    });

    /* test('TODO', () => {
        const { func, params } = createBooleanFromAST(example1);
        expect(func()).toBe(false);
    }); */
});
