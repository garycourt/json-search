{
/*
  function BooleanClause(query, occur) {
    this.query = query;
    this.occur = occur || Occur.SHOULD;
  };

  function BooleanQuery(clauses, minimumOptionalMatches, boost) {
    this.clauses = clauses || [];
    this.minimumOptionalMatches = minimumOptionalMatches || 0;
    this.boost = boost || 1.0;
  };
  
  var Occur = {
    MUST : 1,
    SHOULD : 0,
    MUST_NOT : -1
  };

  function PhraseQuery(field, terms, slop, boost) {
    this.field = field || null;
    this.terms = terms || [];
    this.slop = slop || 0;
    this.boost = boost || 1.0;
  };

  function PrefixQuery(field, prefix, boost) {
    this.field = field || null;
    this.prefix = prefix;
    this.boost = boost || 1.0;
  };

  function TermQuery(field, term, boost) {
    this.field = field || null;
    this.term = term;
    this.boost = boost || 1.0;
  };
  
  function TermRangeQuery(field, startTerm, endTerm, excludeStart, excludeEnd, boost) {
    this.field = field || null;
    this.startTerm = startTerm;
    this.endTerm = endTerm;
    this.excludeStart = excludeStart || false;
    this.excludeEnd = excludeEnd || false;
    this.boost = boost || 1.0;
  };
*/

  var defaultField = arguments[2] || null;
  var analyzer = arguments[3];  //must be available
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

Phrase = '"' phrase:[^"]* '"' slop:("~" Number)? {
  return {phrase:(phrase && phrase.length ? phrase.join("") : []), slop:(slop ? slop[1] : 0)};
}

TermQuery = field:(Term ":")? term:(Phrase / Range / TermType) boost:Boost {
  field = field ? field[0] : defaultField;
  
  if (term.phrase) {
    return new PhraseQuery(field, analyzer.parse(term.phrase, field), term.slop, boost);
  } else if (term.startTerm) {
    return new TermRangeQuery(field, term.startTerm, term.endTerm, term.excludeStart, term.excludeEnd, boost);
  } else if (term.prefix) {
    return new PrefixQuery(field, term.prefix, boost);
  } else {
    var tokens = analyzer.parse(term.term, field);
    if (tokens.length === 1) {
      return new TermQuery(field, tokens[0].value, boost);
    } else if (tokens.length > 1) {
      var terms = [];
      for (var x = 0, xl = tokens.length; x < xl; ++x) {
        terms[x] = tokens[x].value;
      }
      return new MultiTermQuery(field, terms, false, boost);
    }
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
  
  return query && new BooleanClause(query, occur);
}

BooleanQuery = clause:BooleanClause otherClauses:(WHITESPACE+ BooleanClause)* {
  var result = (clause ? [ clause ] : []);
  if (otherClauses) {
    for (var x = 0, xl = otherClauses.length; x < xl; ++x) {
      if (otherClauses[x][1]) {
        result[result.length] = otherClauses[x][1];
      }
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