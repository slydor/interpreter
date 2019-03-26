import * as nearley from 'nearley';
import * as grammar from '../grammar/demo';

export const demo = (text: string) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(text);
    const { results } = parser;
    return results[0];
};
