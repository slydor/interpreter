import {
    ASTNode,
    Interpreter,
    ExpressionValue,
    PropertyValueNode
} from './Interpreter';

/**
 * The idea is to create a thunk A and a list B.
 * A always expects be to called with an array of parameters.
 * B contains the parameter information required for A.
 * All of B's values might be dynamically resolved,
 * therefore they are not stored in the thunk.
 */
export const createBooleanFromAST = (node: ASTNode): Interpreter => {
    return create(node);
};

const andOrOp = {
    AND: (l: any, r: any) => l && r,
    OR: (l: any, r: any) => l || r
};
const binaryComp = {
    '==': (l: ExpressionValue, r: ExpressionValue) => l === r,
    '!=': (l: ExpressionValue, r: ExpressionValue) => l !== r,
    '<': (l: ExpressionValue, r: ExpressionValue) => l < r,
    '<=': (l: ExpressionValue, r: ExpressionValue) => l <= r,
    '>': (l: ExpressionValue, r: ExpressionValue) => l > r,
    '>=': (l: ExpressionValue, r: ExpressionValue) => l >= r
};

const create = (node: ASTNode): Interpreter => {
    switch (node._type) {
        case 'AND':
        /* fall-through */
        case 'OR': {
            let func: (params: any[]) => boolean;
            let params = new Array<string>();

            const left = create(node.l);
            const right = create(node.r);
            const leftParamsLength = left.params.length;
            const rightParamsLength = right.params.length;

            func = params => {
                const leftValue = left.func(params.slice(0, leftParamsLength));
                const rightValue = right.func(
                    params.slice(
                        leftParamsLength,
                        leftParamsLength + rightParamsLength
                    )
                );
                return andOrOp[node._type](leftValue, rightValue);
            };

            params.push(...left.params);
            params.push(...right.params);
            return {
                func,
                params
            };
        }
        case 'FALSY_CHECK': {
            const func = ([p]) =>
                p === null || p === 0 || p === '' || p === false;
            const params = [node.v.p];
            return {
                func,
                params
            };
        }
        case 'TRUTHY_CHECK': {
            const func = ([p]) =>
                p !== null && p !== 0 && p !== '' && p !== false;
            const params = [node.v.p];
            return {
                func,
                params
            };
        }
        case 'BINARY': {
            let func: (params: any[]) => boolean;
            let params = new Array<string>();
            const { bin, l, r } = node;
            const isFstObj = typeof l === 'object' && l !== null;
            const isSndObj = typeof r === 'object' && r !== null;
            if (isFstObj && isSndObj) {
                func = ([p0, p1]) => binaryComp[bin](p0, p1);
                params.push((l as PropertyValueNode).p);
                params.push((r as PropertyValueNode).p);
            } else if (isFstObj) {
                func = ([p0]) => binaryComp[bin](p0, r);
                params.push((l as PropertyValueNode).p);
            } else if (isSndObj) {
                func = ([p0]) => binaryComp[bin](l, p0);
                params.push((r as PropertyValueNode).p);
            } else {
                func = () => binaryComp[bin](l, r);
            }
            return {
                func,
                params
            };
        }
    }
};

// simple, unused tree recursion
const visit = (node: ASTNode, visitedProps: Array<string>) => {
    switch (node._type) {
        case 'AND':
        case 'OR':
            console.log('visit node', node._type);
            visit(node.l, visitedProps);
            visit(node.r, visitedProps);
            break;
        case 'TRUTHY_CHECK':
        case 'FALSY_CHECK':
            console.log('visit node', node._type);
            visit(node.v, visitedProps);
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
