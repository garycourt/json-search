{
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

TermType = term:Term wildcard:"*"? {
  if (wildcard) {
    return {prefix : term};
  } else {
    return {term : term};
  }
}

Range = startRange:("[" / "{") SKIP startTerm:Term SKIP ("TO" / "-")? SKIP endTerm:Term SKIP endRange:("]" / "}") {
  var excludeStart = (startRange === "{");
  var excludeEnd = (endRange === "}");
  return {startTerm:startTerm, endTerm:endTerm, excludeStart:excludeStart, excludeEnd:excludeEnd};
}

Phrase = '"' SKIP startTerm:Term otherTerms:(WHITESPACE+ Term)* SKIP '"' slop:("~" Number)? {
  var phrase = [ startTerm ];
  if (otherTerms) {
    for (var x = 0, xl = otherTerms.length; x < xl; ++x) {
      phrase.push(otherTerms[x][1]);
    }
  }
  return {phrase:phrase, slop:(slop ? slop[1] : 0)};
}

TermQuery = field:(Term ":")? term:(Phrase / Range / TermType) boost:Boost {
  field = field ? field[0] : defaultField;
  
  if (term.phrase) {
    return new PhraseQuery(field, term.phrase, term.slop, boost);
  } else if (term.startTerm) {
    return new TermRangeQuery(field, term.startTerm, term.endTerm, term.excludeStart, term.excludeEnd, boost);
  } else if (term.prefix) {
    return new PrefixQuery(field, term.prefix, boost);
  } else {
    return new TermQuery(field, term.term, boost);
  }
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

BooleanQuery = clause:BooleanClause otherClauses:(WHITESPACE+ BooleanClause)* {
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