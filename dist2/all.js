typeof exports === "undefined" && (exports = {});
typeof require !== "function" && (require = function() {
  return exports
});
if(typeof Object.create !== "function") {
  var F = function() {
  };
  Object.create = function(a) {
    F.prototype = a;
    return new F
  }
}
if(typeof Array.add !== "function") {
  Array.add = function(a, b) {
    if(a.indexOf(b) === -1) {
      return a[a.length] = b, !0
    }
    return!1
  }
}
if(typeof Array.remove !== "function") {
  Array.remove = function(a, b) {
    var c = a.indexOf(b);
    if(c !== -1) {
      return a.splice(c, 1), !0
    }
    return!1
  }
}
if(typeof Array.orderedInsert !== "function") {
  Array.orderedInsert = function(a, b, c) {
    var d, f, e;
    if(a.length === 0) {
      a[0] = b
    }else {
      d = 0;
      f = a.length - 1;
      for(e = Math.floor(f / 2);f - d > 0;) {
        c(a[e], b) <= 0 ? d = e + 1 : f = e - 1, e = Math.round(d + (f - d) / 2)
      }
      c(a[e], b) <= 0 ? a.splice(e + 1, 0, b) : a.splice(e, 0, b)
    }
  }
}
;function Pipe(a) {
  this._inputs = [];
  this._outputs = [];
  a && (this._outputs[0] = a)
}
Pipe.prototype._open = !1;
Pipe.prototype._paused = !1;
Pipe.prototype.start = function(a) {
  var b;
  Array.add(this._inputs, a);
  this._paused && a.pause();
  if(!this._open) {
    a = 0;
    for(b = this._outputs.length;a < b;++a) {
      this._outputs[a].start(this)
    }
    this._open = !0
  }
};
Pipe.prototype.push = function(a) {
  var b, c;
  if(this._paused) {
    throw Error("Pipe is paused");
  }
  b = 0;
  for(c = this._outputs.length;b < c;++b) {
    this._outputs[b].push(a)
  }
};
Pipe.prototype.end = function(a, b) {
  var c, d;
  Array.remove(this._inputs, a);
  if(this._inputs.length === 0 && this._open) {
    c = 0;
    for(d = this._outputs.length;c < d;++c) {
      this._outputs[c].end(this, b)
    }
    this._open = !1
  }
};
Pipe.prototype.addOutput = function(a) {
  this._open && a.start(this);
  Array.add(this._outputs, a)
};
Pipe.prototype.removeOutput = function(a) {
  Array.remove(this._outputs, a);
  this._open && a.end(this)
};
Pipe.prototype.pause = function() {
  var a, b;
  this._paused = !0;
  a = 0;
  for(b = this._inputs.length;a < b;++a) {
    this._inputs[a].pause()
  }
};
Pipe.prototype.resume = function() {
  var a, b;
  this._paused = !1;
  a = 0;
  for(b = this._inputs.length;a < b;++a) {
    this._inputs[a].resume()
  }
};
Pipe.prototype.close = function() {
  var a, b;
  a = 0;
  for(b = this._inputs.length;a < b;++a) {
    this._inputs[a].close()
  }
  this._inputs = [];
  if(this._open) {
    a = 0;
    for(b = this._outputs.length;a < b;++a) {
      this._outputs[a].end(this)
    }
    this._open = !1
  }
};
function DocumentTerms(a, b) {
  this.id = a;
  this.terms = b || []
}
DocumentTerms.prototype.terms = [];
function Collector(a) {
  this._inputs = [];
  this.collection = [];
  this.callback = a
}
Collector.prototype.start = function(a) {
  Array.add(this._inputs, a)
};
Collector.prototype.push = function(a) {
  this.collection.push(a)
};
Collector.prototype.end = function(a, b) {
  Array.remove(this._inputs, a);
  this._inputs.length === 0 && this.callback(b, this.collection)
};
function TopDocumentsCollector(a, b) {
  Collector.call(this, b);
  this.max = a || 1
}
TopDocumentsCollector.compareScores = function(a, b) {
  return b.score - a.score
};
TopDocumentsCollector.prototype = Object.create(Collector.prototype);
TopDocumentsCollector.prototype.lowestScore = 0;
TopDocumentsCollector.prototype.push = function(a) {
  if(this.collection.length < this.max || a.score > this.lowestScore) {
    this.collection.length >= this.max && this.collection.pop(), Array.orderedInsert(this.collection, a, TopDocumentsCollector.compareScores), this.lowestScore = this.collection[this.collection.length - 1].score
  }
};
var DefaultSimilarity = function() {
};
DefaultSimilarity.prototype.norm = function(a) {
  return a.documentBoost * a.fieldBoost * (1 / Math.sqrt(a.totalFieldTerms))
};
DefaultSimilarity.prototype.queryNorm = function(a) {
  return 1 / Math.sqrt(a.sumOfSquaredWeights)
};
DefaultSimilarity.prototype.tf = function(a) {
  return Math.sqrt(a.termFrequency)
};
DefaultSimilarity.prototype.sloppyFreq = function(a) {
  return 1 / (a + 1)
};
DefaultSimilarity.prototype.idf = function(a) {
  return Math.log(a.totalDocuments / (a.documentFrequency + 1)) + 1
};
DefaultSimilarity.prototype.coord = function(a, b) {
  return a / b
};
exports.DefaultSimilarity = DefaultSimilarity;
function Searcher(a) {
  this._index = a
}
Searcher.prototype.similarity = new DefaultSimilarity;
Searcher.prototype.search = function(a, b, c) {
  b = new TopDocumentsCollector(b, c);
  (new NormalizedQuery(a)).createScorer(b).scoreDocuments(this._index)
};
function testSearch() {
  (new Searcher(new MemoryIndex)).search(new TermQuery("test", null), 10, function(a, b) {
    a ? console.error(a) : console.log(b)
  })
}
testSearch();
function TermQuery(a, b, c) {
  this.term = a;
  this.field = b || null;
  this.boost = c || 1
}
TermQuery.prototype.field = null;
TermQuery.prototype.boost = 1;
TermQuery.prototype.createScorer = function(a, b) {
  return new TermScorer(this, a, b)
};
TermQuery.prototype.extractTerms = function() {
  return[this.term]
};
function TermScorer(a, b, c) {
  this._query = a;
  this._searcher = b;
  Pipe.call(this, c)
}
TermScorer.prototype = Object.create(Pipe.prototype);
TermScorer.prototype.scoreDocuments = function(a) {
  a.getTermDocuments(this._query.term, this._query.field, this)
};
TermScorer.prototype.push = function(a) {
  var b = this._searcher.similarity, c = new DocumentTerms(a.documentID, [a]);
  c.sumOfSquaredWeights = Math.pow(b.idf(a) * this._query.boost, 2);
  c.score = b.tf(a) * Math.pow(b.idf(a), 2) * this._query.boost * b.norm(a);
  Pipe.prototype.push.call(this, c)
};
function Document(a, b, c) {
  this.id = a || null;
  this.boost = c;
  b && this.parseJSON(b)
}
Document.prototype.boost = 1;
Document.prototype.parseJSON = function() {
};
Document.prototype.addField = function() {
};
function MemoryIndex() {
}
MemoryIndex.prototype.addDocument = function() {
};
MemoryIndex.prototype.getDocument = function() {
};
MemoryIndex.prototype.getTermDocuments = function(a, b, c) {
  c.start(null);
  c.end(null)
};

