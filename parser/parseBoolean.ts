import * as grammar from '../grammar/boolean';
import { createParse } from './createParse';

export const parseBoolean = createParse(grammar);
