// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "Exp", "symbols": ["Binary"], "postprocess": id},
    {"name": "Binary", "symbols": ["Or"], "postprocess": id},
    {"name": "Brackets", "symbols": [{"literal":"("}, "_", "Exp", "_", {"literal":")"}], "postprocess": ([b0, w0, e, w1, b1]) => e},
    {"name": "Or$string$1", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Or", "symbols": ["Or", "__", "Or$string$1", "__", "And"], "postprocess": ([l, w0, or, w1, r]) => ({type: 'or', l, r})},
    {"name": "Or", "symbols": ["And"], "postprocess": id},
    {"name": "And$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "And", "symbols": ["And", "__", "And$string$1", "__", "Atom"], "postprocess": ([l, w0, or, w1, r]) => ({type: 'and', l, r})},
    {"name": "And", "symbols": ["Atom"], "postprocess": id},
    {"name": "Atom", "symbols": ["S"], "postprocess": id},
    {"name": "Atom", "symbols": ["Brackets"], "postprocess": id},
    {"name": "S", "symbols": [{"literal":"a"}], "postprocess": id},
    {"name": "S", "symbols": [{"literal":"b"}], "postprocess": id},
    {"name": "S", "symbols": [{"literal":"c"}], "postprocess": id}
]
  , ParserStart: "Exp"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
