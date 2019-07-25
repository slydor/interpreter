import * as path from 'path';
import * as readline from 'readline';

import { parseBoolean } from '../parser/parseBoolean';
import { createBooleanFromAST } from '../booleanInterpreter/createBooleanFromAST';
import { getPropertyValues } from '../propertyValues';

const interpret = (text: string): boolean => {
    const ast = parseBoolean(text);
    if (!ast) {
        console.error('  Could not parse input, have a debug log here:\n');
        parseBoolean(text, true);
        throw new Error();
    }
    const { func, params } = createBooleanFromAST(ast);
    if (params.length) {
        console.log('  Lookup parameters:', JSON.stringify(params), '\n');
    }

    let missingLookup = false;
    const callParams = params.map((paramName: string) => {
        const value = getPropertyValues()[paramName];
        if (value === undefined) {
            missingLookup = true;
            console.error(
                `  Missing value for parameter "${paramName}", add it to ${path.resolve(
                    __dirname,
                    '../propertyValues.ts'
                )}`
            );
        }
        return value;
    });
    if (missingLookup) {
        throw new Error();
    }
    return func(callParams);
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    prompt: '\nEnter your boolean expression:\n> '
});

rl.prompt();

rl.on('line', function(line) {
    console.log();
    try {
        const value = interpret(line);
        console.log(`[${line}] <==> ${value}`);
    } catch (_error) {}
    rl.prompt();
});
