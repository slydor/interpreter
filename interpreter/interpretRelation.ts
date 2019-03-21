import { Statement } from './Interpreter';
import { interpretBinaryRelation } from './interpretBinaryRelation';
import { getPropertyValues } from '../propertyValues';

export const interpretRelation = (statement: Statement) => {
    switch (statement.arity) {
        case 'binary': {
            return interpretBinaryRelation(
                statement.rel,
                getPropertyValues()[statement.prop],
                statement.value
            );
        }
        case 'unary':
        case 'ternary':
        default:
            /* fall-through */
            throw new Error(
                `No implementation found for relation with arity [${
                    statement.arity
                }]`
            );
    }
};
