export type NodeType = 'statement' | 'and' | 'or';
export type Node = {
    type: NodeType;
};

export type AndGroup = Node & {
    left: AndGroup | OrGroup | Statement;
    right: AndGroup | OrGroup | Statement;
};
export type OrGroup = Node & {
    left: AndGroup | OrGroup | Statement;
    right: AndGroup | OrGroup | Statement;
};

export type StatementProperty = 'Name' | 'Nr' | 'Status' | 'Ready';
export type StatementRelation = '==' | '!=' | '<' | '<=' | '>' | '>=';
export type StatementValue = string | number | boolean;
export type StatementArity = 'unary' | 'binary' | 'ternary';

export type Statement = Node & {
    prop: StatementProperty;
    rel: StatementRelation;
    value: StatementValue;
    arity: StatementArity;
};
