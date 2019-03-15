@preprocessor typescript

@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
@builtin "string.ne"     # `dqstring`, `sqstring`

@{%

// not used
var propertyValue = function(d) {
    return {prop: d, type: "propertyValue"}
}

%}

rule -> or                   {% id %}
# introduce precedence: 'and' before 'or'
or   -> or "or" and          {% ([left, or, right]) => ({left, right, type: "or"}) %}
      | and                  {% id %}
and  -> and "and" statement  {% ([left, and, right]) => ({left, right, type: "and"}) %}
      | statement            {% id %}

statement -> _ property _ relation _ value _ {%

([w0, prop, w1, rel, w2, value, w3]) => ({prop, rel, value, type: "statement", arity: "binary"})

%}

# demo purpose only
property -> "Name"   {% id %}
          | "Nr"     {% id %}
          | "Status" {% id %}
          | "Ready"  {% id %}

relation -> "=="     {% id %}
          | "!="     {% id %}
          | "<"      {% id %}
          | "<="     {% id %}
          | ">"      {% id %}
          | ">="     {% id %}

value    -> dqstring {% id %}
          | int      {% id %}
          | boolean  {% id %}

boolean  -> "true"   {% (b) => true %}
          | "false"  {% (b) => false %}