// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');
const lexer = moo.compile({
    _ws:       /[ \t]+/,
    _int:      { match: /0|-?[1-9][0-9]*/, value: n => parseInt(n) },
    _string:   { match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1) },
    _lparen:   '(',
    _rparen:   ')',
    _is:       /is|Is|IS/,
    _in:       /in|In|IN/,
    _not:      /not|Not|NOT/,
    _or:       /or|Or|OR/,
    _and:      /and|And|AND/,
    _br0:       /==|!=/,
    _br1:       /<=|<|>=|>/,
    _main :    'main.',
    _true:     { match: /true|True|TRUE/, value: () => true },
    _false:    { match: /false|False|FALSE/, value: () => false },
    _null:     { match: /null|Null|NULL/, value: () => null },
    _property: /[a-zA-Z][a-zA-Z0-9]*/,
});


  const mooId = (d) => d[0].value;
  const binary = ([l, w0, bin, w1, r]) => ({_type: 'BINARY', bin: bin.value, l, r});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "BooleanExp", "symbols": ["Or"], "postprocess": id},
    {"name": "Or", "symbols": ["Or", (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_or") ? {type: "_or"} : _or), (lexer.has("_ws") ? {type: "_ws"} : _ws), "And"], "postprocess": ([l, w0, or, w1, r]) => ({_type: 'OR', l, r})},
    {"name": "Or", "symbols": ["And"], "postprocess": id},
    {"name": "And", "symbols": ["And", (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_and") ? {type: "_and"} : _and), (lexer.has("_ws") ? {type: "_ws"} : _ws), "StatementAtom"], "postprocess": ([l, w0, or, w1, r]) => ({_type: 'AND', l, r})},
    {"name": "And", "symbols": ["StatementAtom"], "postprocess": id},
    {"name": "StatementAtom", "symbols": ["BinaryExp"], "postprocess": id},
    {"name": "StatementAtom", "symbols": ["NullCheck"], "postprocess": id},
    {"name": "StatementAtom", "symbols": ["Brackets"], "postprocess": id},
    {"name": "Brackets", "symbols": [(lexer.has("_lparen") ? {type: "_lparen"} : _lparen), "WS", "BooleanExp", "WS", (lexer.has("_rparen") ? {type: "_rparen"} : _rparen)], "postprocess": ([b0, w0, e, w1, b1]) => e},
    {"name": "BinaryExp", "symbols": ["ExpValOrNull", "WS", (lexer.has("_br0") ? {type: "_br0"} : _br0), "WS", "ExpValOrNull"], "postprocess": binary},
    {"name": "BinaryExp", "symbols": ["ExpValue", "WS", (lexer.has("_br0") ? {type: "_br0"} : _br0), "WS", "ExpValue"], "postprocess": binary},
    {"name": "BinaryExp", "symbols": ["ExpValue", "WS", (lexer.has("_br1") ? {type: "_br1"} : _br1), "WS", "ExpValue"], "postprocess": binary},
    {"name": "ExpValOrNull", "symbols": ["ExpValue"], "postprocess": id},
    {"name": "ExpValOrNull", "symbols": [(lexer.has("_null") ? {type: "_null"} : _null)], "postprocess": mooId},
    {"name": "ExpValue", "symbols": ["PropertyValue"], "postprocess": id},
    {"name": "ExpValue", "symbols": [(lexer.has("_string") ? {type: "_string"} : _string)], "postprocess": mooId},
    {"name": "ExpValue", "symbols": [(lexer.has("_int") ? {type: "_int"} : _int)], "postprocess": mooId},
    {"name": "ExpValue", "symbols": [(lexer.has("_true") ? {type: "_true"} : _true)], "postprocess": mooId},
    {"name": "ExpValue", "symbols": [(lexer.has("_false") ? {type: "_false"} : _false)], "postprocess": mooId},
    {"name": "NullCheck", "symbols": ["PropertyValue", (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_is") ? {type: "_is"} : _is), (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_null") ? {type: "_null"} : _null)], "postprocess": ([v, w0, is, w1, n]) => ({_type: 'FALSY_CHECK', v})},
    {"name": "NullCheck", "symbols": ["PropertyValue", (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_is") ? {type: "_is"} : _is), (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_not") ? {type: "_not"} : _not), (lexer.has("_ws") ? {type: "_ws"} : _ws), (lexer.has("_null") ? {type: "_null"} : _null)], "postprocess": ([v, w0, is, w1, not, w2, n]) => ({_type: 'TRUTHY_CHECK', v})},
    {"name": "PropertyValue", "symbols": [(lexer.has("_main") ? {type: "_main"} : _main), "Property"], "postprocess": ([main, p]) => ({_type: 'PROPERTY_VALUE', p})},
    {"name": "Property", "symbols": [(lexer.has("_property") ? {type: "_property"} : _property)], "postprocess": mooId},
    {"name": "WS", "symbols": []},
    {"name": "WS", "symbols": [(lexer.has("_ws") ? {type: "_ws"} : _ws)]}
]
  , ParserStart: "BooleanExp"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
