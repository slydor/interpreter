# @preprocessor typescript # ts doesn't work with nearley-test

@{%
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
%}
@lexer lexer
@{%
  const mooId = (d) => d[0].value;
  const binary = ([l, w0, bin, w1, r]) => ({_type: 'BINARY', bin: bin.value, l, r});
%}

BooleanExp     -> Or                                              {% id %}

Or             -> Or %_ws %_or %_ws And                           {% ([l, w0, or, w1, r]) => ({_type: 'OR', l, r}) %}
                | And                                             {% id %}

And            -> And %_ws %_and %_ws StatementAtom               {% ([l, w0, or, w1, r]) => ({_type: 'AND', l, r}) %}
                | StatementAtom                                   {% id %}

StatementAtom  -> BinaryExp                                       {% id %}
                | NullCheck                                       {% id %}
                | Brackets                                        {% id %}

Brackets       -> %_lparen WS BooleanExp WS %_rparen              {% ([b0, w0, e, w1, b1]) => e %}

BinaryExp      -> ExpValOrNull WS %_br0 WS ExpValOrNull           {% binary %}
                | ExpValue WS %_br0 WS ExpValue                   {% binary %}
                | ExpValue WS %_br1 WS ExpValue                   {% binary %}

ExpValOrNull   -> ExpValue                                        {% id %}
                | %_null                                          {% mooId %}

ExpValue       -> PropertyValue                                   {% id %}
                | %_string                                        {% mooId %}
                | %_int                                           {% mooId %}
                | %_true                                          {% mooId %}
                | %_false                                         {% mooId %}

NullCheck      -> PropertyValue %_ws %_is %_ws %_null             {% ([v, w0, is, w1, n]) => ({_type: 'FALSY_CHECK', v}) %}
                | PropertyValue %_ws %_is %_ws %_not %_ws %_null  {% ([v, w0, is, w1, not, w2, n]) => ({_type: 'TRUTHY_CHECK', v}) %}

PropertyValue  -> %_main Property                                 {% ([main, p]) => ({_type: 'PROPERTY_VALUE', p}) %}

Property       -> %_property                                      {% mooId %}

WS             -> null
                | %_ws