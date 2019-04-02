export type ASTNodeType =
    | 'AND'
    | 'OR'
    | 'BINARY'
    | 'TRUTHY_CHECK'
    | 'FALSY_CHECK'
    | 'PROPERTY_VALUE';

export type ASTNodeBase = {
    _type: ASTNodeType;
};

export type ASTNode =
    | AndNode
    | OrNode
    | BinaryNode
    | TruthyCheckNode
    | FalsyCheckNode
    | PropertyValueNode;

export type AndNode = ASTNodeBase & {
    _type: 'AND';
    /** left node */
    l: ASTNode;
    /** right node */
    r: ASTNode;
};

export type OrNode = ASTNodeBase & {
    _type: 'OR';
    /** left node */
    l: ASTNode;
    /** right node */
    r: ASTNode;
};

export type BinaryType = '==' | '!=' | '<' | '<=' | '>' | '>=';

export type ExpressionValue =
    | string
    | number
    | boolean
    | null
    | PropertyValueNode;

export type BinaryNode = ASTNodeBase & {
    _type: 'BINARY';
    /** binary relation */
    bin: BinaryType;
    /** left node */
    l: ExpressionValue;
    /** right node */
    r: ExpressionValue;
};

export type PropertyValueNode = ASTNodeBase & {
    _type: 'PROPERTY_VALUE';
    /** property name */
    p: string;
};

export type TruthyCheckNode = ASTNodeBase & {
    _type: 'TRUTHY_CHECK';
    v: PropertyValueNode;
};

export type FalsyCheckNode = ASTNodeBase & {
    _type: 'FALSY_CHECK';
    v: PropertyValueNode;
};

export type InterpretFunction = (params: any[]) => boolean;

export type InterpretParameter = string;

export type InterpretParameters = Array<InterpretParameter>;

export type Interpreter = {
    func: InterpretFunction;
    params: InterpretParameters;
};
