import { Statement, Node } from './Interpreter';
import { interpretRelation } from './interpretRelation';

export const interpretRule = (statement: Node) => {
    switch (statement.type) {
        case 'statement':
            return interpretRelation(statement as Statement);
        case 'and':
        case 'or':
        default:
            throw new Error(
                `No implementation found for node type [${statement.type}]`
            );
    }
};
