import {
    StatementValue,
    StatementRelation
} from './Interpreter';

const binaryImpl = {
    '==': (left: StatementValue, right: StatementValue) => left === right,
    '!=': (left: StatementValue, right: StatementValue) => left !== right,
    '<': (left: StatementValue, right: StatementValue) => left < right,
    '<=': (left: StatementValue, right: StatementValue) => left <= right,
    '>': (left: StatementValue, right: StatementValue) => left > right,
    '>=': (left: StatementValue, right: StatementValue) => left >= right
};

export const interpretBinaryRelation = (
    relation: StatementRelation,
    left: StatementValue,
    right: StatementValue
): boolean => {
    const binary = binaryImpl[relation];
    if (!binary) {
        throw new Error(
            `No implementation found for binary relation [${relation}]`
        );
    }
    return binary(left, right);
};
