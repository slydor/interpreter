@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
@builtin "string.ne"     # `dqstring`, `sqstring`

BinaryExp      -> ExpValue BinaryRel ExpValue      {% ([left, relation, right]) => ({_type: 'BINARY', relation, left, right}) %}

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

PropertyValue  -> Property                         {% ([property]) => ({_type: 'PROPERTY', property}) %}

Property       -> [a-zA-Z] [a-zA-Z0-9]:*           {% ([first, rest]) => first + rest.join('') %}
