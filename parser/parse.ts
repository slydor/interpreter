import * as grammar from '../grammar/rule';
import { createParse } from './createParse';

export const parse = createParse(grammar);
