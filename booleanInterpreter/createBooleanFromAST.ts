import {
    ASTNode,
    ASTNodeType,
    Interpreter,
    ExpressionValue
} from './Interpreter';

/**
 * The idea is to create a function thunk A and a list B.
 * B contains all the parameters required for A.
 * All of B's values might be dynamically resolved,
 * therefore they are not stored in the thunk.
 */
export const createBooleanFromAST = (node: ASTNode): Interpreter => {
    const props = [];
    visit(node, props);
    console.log('visited props', props);
    return {
        func: () => false,
        params: []
    };
};

const visit = (node: ASTNode, visitedProps: Array<string>) => {
    switch (node._type) {
        case 'AND':
        case 'OR':
            console.log('visit node', node._type);
            visit(node.l, visitedProps);
            visit(node.r, visitedProps);
            break;
        case 'BINARY':
            console.log(
                'visit node',
                node._type,
                '\n',
                'leaf binary',
                node.bin
            );
            if (typeof node.l === 'object') {
                visit(node.l, visitedProps);
            }
            if (typeof node.r === 'object') {
                visit(node.r, visitedProps);
            }
            break;
        case 'PROPERTY_VALUE':
            console.log('visit node', node._type, '\n', 'leaf prop', node.p);
            visitedProps.push(node.p);
            break;
    }
};

const binaryComp = {
    '==': (l: ExpressionValue, r: ExpressionValue) => l === r,
    '!=': (l: ExpressionValue, r: ExpressionValue) => l !== r
};

const convertNode = (node: ASTNode) => {
    switch (node._type) {
        case 'BINARY': {
            return () => binaryComp[node.bin](node.l, node.r);
        }
        default: {
            return () => {};
        }
    }
};
