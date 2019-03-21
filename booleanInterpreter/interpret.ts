import { parseBoolean } from '../parser/parseBoolean';
import { createBooleanFromAST } from './createBooleanFromAST';
import { getPropertyValues } from '../propertyValues';

export const interpret = (text: string): boolean => {
    const ast = parseBoolean(text);
    if (!ast) {
        // just for info re-fail the parsing with debug info
        parseBoolean(text, true);
        throw new Error('Could not parse text to interpret statement!');
    }
    const { func, params } = createBooleanFromAST(ast);
    // simulate property value lookups:
    const callParams = params.map(
        (paramName: string) => getPropertyValues()[paramName]
    );
    return func(callParams);
};
