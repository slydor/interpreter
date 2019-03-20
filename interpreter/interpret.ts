import { parse } from '../parser/parse';
import { Node } from './Interpreter';
import { interpretRule } from './interpretRule';

export const interpret = (text: string) => {
    const res: Node = parse(text);
    if (!res) {
        return undefined;
    }
    return interpretRule(res);
};
