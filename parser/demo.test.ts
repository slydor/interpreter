import { demo } from './demo';

describe('demonstration of very simple pasring by given demo grammar', () => {
    test('expect AST being created for statement "Status==6"', () => {
        expect(demo('Status==6')).toEqual({
            _type: 'BINARY',
            relation: '==',
            left: {
                _type: 'PROPERTY',
                property: 'Status'
            },
            right: 6
        });
    });
});
