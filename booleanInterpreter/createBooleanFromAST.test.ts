import { createBooleanFromAST } from './createBooleanFromAST';
import { example1 } from './ASTData';
import { parseBoolean } from '../parser/parseBoolean';

describe('createBooleanFromAST', () => {
    test('expect binary node with boolean values to create correct function and no parameter', () => {
        const bools = createBooleanFromAST({
            _type: 'BINARY',
            bin: '!=',
            l: true,
            r: false
        });
        expect(bools.func([])).toBe(true);
        expect(bools.params).toHaveLength(0);
    });
    test('expect binary node with null values to create correct function and no parameter', () => {
        const bools = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: null,
            r: null
        });
        expect(bools.func([])).toBe(true);
        expect(bools.params).toHaveLength(0);
    });
    test('expect binary node with int values to create correct function and no parameter', () => {
        const ints = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: 1,
            r: 2
        });
        expect(ints.func([])).toBe(false);
        expect(ints.params).toHaveLength(0);
    });
    test('expect binary node with string values to create correct function and no parameter', () => {
        const strings = createBooleanFromAST({
            _type: 'BINARY',
            bin: '!=',
            l: 'foo',
            r: 'bar'
        });
        expect(strings.func([])).toBe(true);
        expect(strings.params).toHaveLength(0);
    });

    test('expect binary node with (Property, bool) values to create correct function and paramter', () => {
        const isReady = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: { _type: 'PROPERTY_VALUE', p: 'Ready' },
            r: true
        });
        expect(isReady.func([true])).toBe(true);
        expect(isReady.func([false])).toBe(false);
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
        expect(equalsThirteen.func([13])).toBe(true);
        expect(equalsThirteen.func([37])).toBe(false);
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
        expect(equalsThirteen.func(['foobar', 'foobar'])).toBe(true);
        expect(equalsThirteen.func(['foo', 'bar'])).toBe(false);
        expect(equalsThirteen.params).toHaveLength(2);
        expect(equalsThirteen.params[0]).toBe('Info');
        expect(equalsThirteen.params[1]).toBe('Comment');
    });

    test('expect falsy check node to create correct function and paramter', () => {
        const propIsNull = createBooleanFromAST({
            _type: 'FALSY_CHECK',
            v: { _type: 'PROPERTY_VALUE', p: 'Prop' }
        });
        expect(propIsNull.func(['foobar'])).toBe(false);
        expect(propIsNull.func([13])).toBe(false);
        expect(propIsNull.func([true])).toBe(false);
        expect(propIsNull.func([null])).toBe(true);
        expect(propIsNull.func([''])).toBe(true);
        expect(propIsNull.func([0])).toBe(true);
        expect(propIsNull.func([false])).toBe(true);
        expect(propIsNull.params).toHaveLength(1);
        expect(propIsNull.params[0]).toBe('Prop');
    });

    test('expect truthy check node to create correct function and paramter', () => {
        const propIsNotNull = createBooleanFromAST({
            _type: 'TRUTHY_CHECK',
            v: { _type: 'PROPERTY_VALUE', p: 'Prop' }
        });
        expect(propIsNotNull.func(['foobar'])).toBe(true);
        expect(propIsNotNull.func([13])).toBe(true);
        expect(propIsNotNull.func([true])).toBe(true);
        expect(propIsNotNull.func([null])).toBe(false);
        expect(propIsNotNull.func([''])).toBe(false);
        expect(propIsNotNull.func([0])).toBe(false);
        expect(propIsNotNull.func([false])).toBe(false);
        expect(propIsNotNull.params).toHaveLength(1);
        expect(propIsNotNull.params[0]).toBe('Prop');
    });

    test('expect correct parameter list for extended nested nodes', () => {
        const { params } = createBooleanFromAST(example1);
        expect(params).toHaveLength(4);
        expect(params[0]).toBe('Ready');
        expect(params[1]).toBe('Name');
        expect(params[2]).toBe('Id');
        expect(params[3]).toBe('Name');
    });

    test('expect integration with parser to result in correct function with parameters', () => {
        const { func, params } = createBooleanFromAST(
            parseBoolean(
                'main.Status != 2 and main.Id is not null or main.Name == "batman"'
            )
        );
        // the and-group should compute to true
        expect(func([1, 'notNullId', 'foobar'])).toBe(true);
        // the rightmost binary should compute to true
        expect(func([2, null, 'batman'])).toBe(true);
        expect(func([2, 0, 'foobar'])).toBe(false);

        expect(params).toHaveLength(3);
        expect(params[0]).toBe('Status');
        expect(params[1]).toBe('Id');
        expect(params[2]).toBe('Name');
    });
});
