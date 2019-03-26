"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammar = require("../grammar/boolean");
const createParse_1 = require("./createParse");
exports.parseBoolean = createParse_1.createParse(grammar);
