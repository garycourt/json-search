{
  function TermQuery(term, field, boost) {
    this.$type = "TermQuery";
    this.term = term;
    this.field = field;
    this.boost = boost;
  }

  var Occur = {
    MUST : 1,
    SHOULD : 0,
    MUST_NOT : -1
  };

  function BooleanClause(query, occur) {
    this.$type = "BooleanClause";
    this.query = query;
    this.occur = occur;
  }

  function BooleanQuery(clauses) {
    this.$type = "BooleanQuery";
    this.clauses = clauses;
  }
  
  var defaultField = arguments[2] || null;
}

start = Query

WHITESPACE "whitespace" = [ \t\n\r\u3000]
SKIP = WHITESPACE*

Number "number" = num:[0-9]+ fract:("." [0-9]+)? {
  return parseFloat(num.concat(fract[0], fract[1]).join(""));
}

ESCAPED_CHAR = "\\" .
TERM_START_CHAR = [^ \t\n\r\u3000+\-!():^\[\]"{}~*?\\]
TERM_CHAR = TERM_START_CHAR / ESCAPED_CHAR / "-" / "+"

Term "term" = start:TERM_START_CHAR rest:TERM_CHAR* {
  return [ start ].concat(rest).join("");
}

Boost "boost" = boost:("^" Number)? {
  if (boost) {
    boost = boost[1];
  }
  return (typeof boost === "number" ? boost : 1.0);
}

TermQuery = field:(Term ":")? term:Term boost:Boost {
  return new TermQuery(term, field ? field[0] : defaultField, boost);
}

BooleanClause = occur:("+" / "-")? query:(SubQuery / TermQuery) {
  if (occur === "+") {
    occur = Occur.MUST;
  } else if (occur === "-") {
    occur = Occur.MUST_NOT;
  } else {
    occur = Occur.SHOULD;
  }
  
  return new BooleanClause(query, occur);
}

BooleanQuery = clause:BooleanClause otherClauses:(SKIP BooleanClause)* {
  var result = [ clause ];
  if (otherClauses) {
    for (var x = 0, xl = otherClauses.length; x < xl; ++x) {
      result[result.length] = otherClauses[x][1];
    }
  }
  return new BooleanQuery(result);
}

SubQuery = "(" sub:Query ")" boost:Boost {
  sub.boost = boost;
  return sub;
}

Query = SKIP query:BooleanQuery SKIP {
  return query;
}