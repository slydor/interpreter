export type ASTNodeType = 'AND' | 'OR' | 'BINARY' | 'PROPERTY_VALUE';

export type ASTNodeBase = {
    _type: ASTNodeType;
};

export type ASTNode = AndNode | OrNode | BinaryNode | PropertyValueNode;

export type AndNode = ASTNodeBase & {
    _type: 'AND';
    /** right node */
    l: ASTNode;
    /** left node */
    r: ASTNode;
};

export type OrNode = ASTNodeBase & {
    _type: 'OR';
    /** right node */
    l: ASTNode;
    /** left node */
    r: ASTNode;
};

export type BinaryType = '==' | '!=';

export type ExpressionValue = string | number | boolean | PropertyValueNode;

export type BinaryNode = ASTNodeBase & {
    _type: 'BINARY';
    /** binary relation */
    bin: BinaryType;
    /** right node */
    l: ExpressionValue;
    /** left node */
    r: ExpressionValue;
};

export type PropertyValueNode = ASTNodeBase & {
    _type: 'PROPERTY_VALUE';
    /** property name */
    p: string;
};

export type InterpretFunction = (params: any[]) => boolean;

export type InterpretParameter = string;

export type InterpretParameters = Array<InterpretParameter>;

export type Interpreter = {
    func: InterpretFunction;
    params: InterpretParameters;
};
