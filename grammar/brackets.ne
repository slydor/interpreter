# @preprocessor typescript # ts doesn't work with nearley-test
@builtin "whitespace.ne"

Exp      -> Binary                {% id %}

Binary   -> Or                    {% id %}

Brackets -> "(" _ Exp _ ")"       {% ([b0, w0, e, w1, b1]) => e %}

Or       -> Or __ "or" __ And     {% ([l, w0, or, w1, r]) => ({type: 'or', l, r}) %}
          | And                   {% id %}

And      -> And __ "and" __ Atom  {% ([l, w0, or, w1, r]) => ({type: 'and', l, r}) %}
          | Atom                  {% id %}

Atom     -> S                     {% id %}
          | Brackets              {% id %}

S        -> "a"                   {% id %}
          | "b"                   {% id %}
          | "c"                   {% id %}