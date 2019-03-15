import { Statement, Node, AndGroup, OrGroup } from './Interpreter';
import { interpretRelation } from './interpretRelation';

export const interpretRule = (statement: Node) => {
    switch (statement.type) {
        case 'statement':
            return interpretRelation(statement as Statement);
        case 'and': {
            const andGroup = statement as AndGroup;
            return (
                interpretRule(andGroup.left) && interpretRule(andGroup.right)
            );
        }
        case 'or': {
            const orGroup = statement as OrGroup;
            return interpretRule(orGroup.left) || interpretRule(orGroup.right);
        }
        default:
            throw new Error(
                `No implementation found for node type [${statement.type}]`
            );
    }
};
