# Prototype: interpreter for boolean expression

* support placeholders/lookups/variables
* support basic values **double quoted strings**, **integer**, **true**, **false**
* support binary relations **==**, **!=**, **<**, **<=**, **>**, **>=**
* support nesting with **AND**, **OR** and brackets

# Further ideas
* rename *params* to *identifier* in createInterpreterFromAST
## syntactic sugar
* support **IN**: *"status IN ("To Do", "In Progress", "Closed")"*
--> *status == "To Do" or status == "In Progress" or status == "Closed"*
* support **NOT IN** (as reverse of IN list)
* **IS EMPTY**/**IS NULL**, **NOT IS X**?
* floats (number instead int)
* functions (today(), currentuser()) -> may return single values or lists (combine with **IN**)
* CONTAINS: ~ for string props (substrings)
* handle date props (compare them to fixed values and function results, like now, startOfWeek,...)
* case-insensitive string equality **_=**
* 

* draw inspiration from https://docs.atlassian.com/advanced-searching https://confluence.atlassian.com/jirasoftwareserver/advanced-searching-939938733.html#Advancedsearching-ISIS