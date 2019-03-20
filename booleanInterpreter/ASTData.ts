import { ASTNode } from './Interpreter';

export const example1: ASTNode = {
    _type: 'AND',
    l: {
        // (1==2 and ( (  main.Ready == true   or\t"foo"==  main.Name ) or main.Id   !=main.Name  )   )
        _type: 'AND',
        l: {
            _type: 'BINARY',
            bin: '==',
            l: 1,
            r: 2
        },
        r: {
            // ( (  main.Ready == true   or\t"foo"==  main.Name ) or main.Id   !=main.Name  )
            _type: 'OR',
            l: {
                // (  main.Ready == true   or\t"foo"==  main.Name )
                _type: 'OR',
                l: {
                    _type: 'BINARY',
                    bin: '==',
                    l: {
                        _type: 'PROPERTY_VALUE',
                        p: 'Ready'
                    },
                    r: true
                },
                r: {
                    _type: 'BINARY',
                    bin: '==',
                    l: 'foo',
                    r: { _type: 'PROPERTY_VALUE', p: 'Name' }
                }
            },
            r: {
                // main.Id   !=main.Name
                _type: 'BINARY',
                bin: '!=',
                l: {
                    _type: 'PROPERTY_VALUE',
                    p: 'Id'
                },
                r: {
                    _type: 'PROPERTY_VALUE',
                    p: 'Name'
                }
            }
        }
    },
    r: {
        // ("bar"!=3  or   4==false)
        _type: 'OR',
        l: {
            _type: 'BINARY',
            bin: '!=',
            l: 'bar',
            r: 3
        },
        r: {
            _type: 'BINARY',
            bin: '==',
            l: 4,
            r: false
        }
    }
};
