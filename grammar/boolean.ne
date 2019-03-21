# @preprocessor typescript # ts doesn't work with nearley-test
@builtin "whitespace.ne"
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
@builtin "string.ne"     # `dqstring`, `sqstring`


BooleanExp     -> Or                               {% id %}

Or             -> Or __ "or" __ And                {% ([l, w0, or, w1, r]) => ({_type: 'OR', l, r}) %}
                | And                              {% id %}

And            -> And __ "and" __ StatementAtom    {% ([l, w0, or, w1, r]) => ({_type: 'AND', l, r}) %}
                | StatementAtom                    {% id %}

StatementAtom  -> BinaryExp                        {% id %}
                | Brackets                         {% id %}

Brackets       -> "(" _ BooleanExp _ ")"           {% ([b0, w0, e, w1, b1]) => e %}

BinaryExp      -> ExpValue _ BinaryRel _ ExpValue  {% ([l, w0, bin, w1, r]) => ({_type: 'BINARY', bin, l, r}) %}

BinaryRel      -> "=="                             {% id %}
                | "!="                             {% id %}
                | "<"                              {% id %}
                | "<="                             {% id %}
                | ">"                              {% id %}
                | ">="                             {% id %}

ExpValue       -> PropertyValue                    {% id %}
                | dqstring                         {% id %}
                | int                              {% id %}
                | "true"                           {% (d) => true %}
                | "false"                          {% (d) => false %}

PropertyValue  -> "main." Property                 {% ([main, p]) => ({_type: 'PROPERTY_VALUE', p}) %}

Property       -> [a-zA-Z] [a-zA-Z0-9]:*           {% ([first, rest]) => first + rest.join('') %}
