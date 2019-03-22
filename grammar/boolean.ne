# @preprocessor typescript # ts doesn't work with nearley-test

@{%
const moo = require('moo');
const lexer = moo.compile({
    _ws:       /[ \t]+/,
    _int:      { match: /0|-?[1-9][0-9]*/, value: n => parseInt(n) },
    _string:   { match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1) },
    _lparen:   '(',
    _rparen:   ')',
    _or:       /[oO][rR]/,
    _and:      /[aA][nN][dD]/,
    _br0:       /==|!=/,
    _br1:       /<=|<|>=|>/,
    _main :    'main.',
    _t:        { match: /true|True|TRUE/, value: () => true },
    _f:        { match: /false|False|FALSE/, value: () => false },
    _property: /[a-zA-Z][a-zA-Z0-9]*/,
});
%}
@lexer lexer
@{% const mooId = (d) => d[0].value; %}

BooleanExp     -> Or                                 {% id %}

Or             -> Or %_ws %_or %_ws And              {% ([l, w0, or, w1, r]) => ({_type: 'OR', l, r}) %}
                | And                                {% id %}

And            -> And %_ws %_and %_ws StatementAtom  {% ([l, w0, or, w1, r]) => ({_type: 'AND', l, r}) %}
                | StatementAtom                      {% id %}

StatementAtom  -> BinaryExp                          {% id %}
                | Brackets                           {% id %}


Brackets       -> %_lparen WS BooleanExp WS %_rparen {% ([b0, w0, e, w1, b1]) => e %}

BinaryExp      -> ExpValue WS BinaryRel WS ExpValue  {% ([l, w0, bin, w1, r]) => ({_type: 'BINARY', bin, l, r}) %}

BinaryRel      -> %_br0                              {% mooId %}
                | %_br1                              {% mooId %}

ExpValue       -> PropertyValue                      {% id %}
                | %_string                           {% mooId %}
                | %_int                              {% mooId %}
                | %_t                                {% mooId %}
                | %_f                                {% mooId %}

PropertyValue  -> %_main Property                    {% ([main, p]) => ({_type: 'PROPERTY_VALUE', p}) %}

Property       -> %_property                         {% mooId %}

WS             -> null
                | %_ws