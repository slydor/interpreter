import { parse } from './parse';

describe('parse', () => {
    describe('simple statement', () => {
        test('expect result using string value', () => {
            expect(parse('Name=="Batman"')).toEqual({
                prop: 'Name',
                rel: '==',
                value: 'Batman'
            });
        });
        test('expect result using int values', () => {
            expect(parse('Nr>13')).toEqual({
                prop: 'Nr',
                rel: '>',
                value: 13
            });
            expect(parse('Status<=37')).toEqual({
                prop: 'Status',
                rel: '<=',
                value: 37
            });
        });
        test('expect result using boolean values', () => {
            expect(parse('Ready==true')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true
            });
            expect(parse('Ready!=false')).toEqual({
                prop: 'Ready',
                rel: '!=',
                value: false
            });
        });
    });

    describe('expect whitespaces in statement are ignored', () => {
        test('in front of statement', () => {
            expect(parse(' Ready==true')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true
            });
        });
        test('next to relation', () => {
            expect(parse('Ready  ==\ttrue')).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true
            });
        });
        test('after statement', () => {
            expect(parse(' Ready==true\n', true)).toEqual({
                prop: 'Ready',
                rel: '==',
                value: true
            });
        });
    });
});
