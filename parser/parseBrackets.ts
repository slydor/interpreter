import * as grammar from '../grammar/brackets';
import { createParse } from './createParse';

export const parseBrackets = createParse(grammar);
