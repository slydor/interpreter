import { createBooleanFromAST } from './createBooleanFromAST';
import { example1 } from './ASTData';

describe('createBooleanFromAST', () => {
    test('TODO simple node with static comparison', () => {
        const { func, params } = createBooleanFromAST({
            _type: 'BINARY',
            bin: '==',
            l: 1,
            r: 2
        });
        expect(func()).toBe(false);
    });

    test.only('TODO visit nodes', () => {
        const { func, params } = createBooleanFromAST(example1);
        expect(func()).toBe(false);
    });
});
