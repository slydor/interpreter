import * as nearley from 'nearley';
import * as grammar from './rule';

export const parse = (text: string, debug: boolean = false) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
        parser.feed(text);
        const { results } = parser;
        if (results.length === 1) {
            return results[0];
        }

        if (results.length > 1) {
            if (debug) {
                console.log(`grammar is ambiguous for text [${text}]`);
                console.log(JSON.stringify(results));
            }
            return results[0];
        }

        if (debug && results.length === 0) {
            console.log(`no parsing result for text [${text}]`);
        }
    } catch (error) {
        if (debug) {
            console.log(`parsing error for text [${text}]`);
            console.log(error);
        }
    }
    return undefined;
};
