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
var PossibleError;
var DocumentID;
var ScoreDoc = function(a, b) {
  this.doc = a;
  this.score = b
};
exports.ScoreDoc = ScoreDoc;
var TopDocs = function(a, b, c) {
  this.totalHits = a || 0;
  this.scoreDocs = b || [];
  this.maxScore = c || NaN
};
exports.TopDocs = TopDocs;
var Collector = function() {
};
Collector.prototype.collect = function() {
};
Collector.prototype.setNextReader = function() {
};
Collector.prototype.acceptsDocsOutOfOrder = function() {
};
exports.Collector = Collector;
var TopDocsCollector = function(a) {
  this.pq = a
};
TopDocsCollector.EMPTY_TOPDOCS = new TopDocs(0, [], NaN);
TopDocsCollector.prototype.collect = function() {
  throw Error("Not Implemented");
};
TopDocsCollector.prototype.setNextReader = function() {
  throw Error("Not Implemented");
};
TopDocsCollector.prototype.acceptsDocsOutOfOrder = function() {
  throw Error("Not Implemented");
};
TopDocsCollector.prototype.totalHits = 0;
TopDocsCollector.prototype.populateResults = function(a, b) {
  var c;
  for(c = b;c >= 0;c--) {
    a[c] = this.pq.pop()
  }
};
TopDocsCollector.prototype.newTopDocs = function(a) {
  return a == null ? TopDocsCollector.EMPTY_TOPDOCS : new TopDocs(this.totalHits, a)
};
TopDocsCollector.prototype.topDocs = function(a, b) {
  var c = Math.min(this.totalHits, this.pq.size()), d, a = a || 0;
  b === void 0 && (b = c);
  if(a < 0 || a >= c || b <= 0) {
    return this.newTopDocs(null, a)
  }
  b = Math.min(c - a, b);
  c = Array(b);
  for(d = this.pq.size() - a - b;d > 0;d--) {
    this.pq.pop()
  }
  this.populateResults(c, b);
  return this.newTopDocs(c, a)
};
exports.TopDocsCollector = TopDocsCollector;
var DocIdSetIterator = function() {
};
DocIdSetIterator.NO_MORE_DOCS = Number.MAX_VALUE;
DocIdSetIterator.prototype.docID = function() {
};
DocIdSetIterator.prototype.nextDoc = function() {
};
DocIdSetIterator.prototype.advance = function() {
};
exports.DocIdSetIterator = DocIdSetIterator;
var Scorer = function(a) {
  this.weight = a
};
Scorer.prototype.docID = function() {
  throw Error("Not Implemented");
};
Scorer.prototype.nextDoc = function() {
  throw Error("Not Implemented");
};
Scorer.prototype.advance = function() {
  throw Error("Not Implemented");
};
Scorer.prototype.collect = function(a, b, c) {
  a.scorer = this;
  if(b !== void 0) {
    for(;c < b;) {
      a.collect(c), c = this.nextDoc()
    }
  }else {
    for(c = this.nextDoc();c !== DocIdSetIterator.NO_MORE_DOCS;) {
      a.collect(c), c = this.nextDoc()
    }
  }
  return c !== DocIdSetIterator.NO_MORE_DOCS
};
Scorer.prototype.score = function() {
  throw Error("Not Implemented");
};
Scorer.prototype.freq = function() {
  throw Error("Scorer does not implement freq()");
};
exports.Scorer = Scorer;
var Weight = function() {
};
Weight.prototype.explain = function() {
};
Weight.prototype.getQuery = function() {
};
Weight.prototype.getValue = function() {
};
Weight.prototype.normalize = function() {
};
Weight.prototype.scorer = function() {
};
Weight.prototype.sumOfSquaredWeights = function() {
};
Weight.prototype.scoresDocsOutOfOrder = function() {
};
exports.Weight = Weight;
var PriorityQueue = function() {
};
PriorityQueue.prototype._size = 0;
PriorityQueue.prototype._maxSize = 0;
PriorityQueue.prototype.lessThan = function() {
  throw Error("Not Implemented");
};
PriorityQueue.prototype.getSentinelObject = function() {
  return null
};
PriorityQueue.prototype.initialize = function(a) {
  var b;
  this._size = 0;
  this._heap = Array(0 === a ? 2 : a === Number.MAX_VALUE ? Number.MAX_VALUE : a + 1);
  this._maxSize = a;
  b = this.getSentinelObject();
  if(b !== null) {
    this._heap[1] = b;
    for(b = 2;b < this._heap.length;b++) {
      this._heap[b] = this.getSentinelObject()
    }
    this._size = a
  }
};
PriorityQueue.prototype.add = function(a) {
  this._size++;
  this._heap[this._size] = a;
  this.upHeap();
  return heap[1]
};
PriorityQueue.prototype.insertWithOverflow = function(a) {
  var b;
  return this._size < this._maxSize ? (this.add(a), null) : this._size > 0 && !this.lessThan(a, this._heap[1]) ? (b = this._heap[1], this._heap[1] = a, this.updateTop(), b) : a
};
PriorityQueue.prototype.top = function() {
  return this._heap[1]
};
PriorityQueue.prototype.pop = function() {
  var a;
  return size > 0 ? (a = this._heap[1], this._heap[1] = this._heap[this._size], this._heap[this._size] = null, this._size--, this.downHeap(), a) : null
};
PriorityQueue.prototype.updateTop = function() {
  this.downHeap();
  return this._heap[1]
};
PriorityQueue.prototype.size = function() {
  return this._size
};
PriorityQueue.prototype.clear = function() {
  this._heap = Array(this._maxSize + 1);
  this._size = 0
};
PriorityQueue.prototype.upHeap = function() {
  for(var a = this._size, b = this._heap[a], c = a >>> 1;c > 0 && this.lessThan(b, this._heap[c]);) {
    this._heap[a] = this._heap[c], a = c, c >>>= 1
  }
  this._heap[a] = b
};
PriorityQueue.prototype.downHeap = function() {
  var a = 1, b = this._heap[a], c = a << 1, d = c + 1;
  for(d <= this._size && this.lessThan(this._heap[d], this._heap[c]) && (c = d);c <= this._size && this.lessThan(this._heap[c], b);) {
    this._heap[a] = this._heap[c], a = c, c = a << 1, d = c + 1, d <= this._size && this.lessThan(this._heap[d], this._heap[c]) && (c = d)
  }
  this._heap[a] = b
};
exports.PriorityQueue = PriorityQueue;
var HitQueue = function(a, b) {
  this.prePopulate = b;
  this.initialize(a)
};
HitQueue.prototype = Object.create(PriorityQueue.prototype);
HitQueue.prototype.getSentinelObject = function() {
  return!this.prePopulate ? null : new ScoreDoc("", Number.NEGATIVE_INFINITY)
};
HitQueue.prototype.lessThan = function(a, b) {
  return a.score === b.score ? a.doc > b.doc : a.score < b.score
};
exports.HitQueue = HitQueue;
var Index = function() {
};
Index.prototype.numDocs = function() {
  throw Error("Not Implemented");
};
Index.prototype.docFreq = function() {
  throw Error("Not Implemented");
};
var Query = function() {
};
Query.prototype.boost = 1;
Query.prototype.createWeight = function() {
  throw Error("Unsupported Operation");
};
Query.prototype.weight = function(a) {
  var b = a.rewrite(this).createWeight(a), c = b.sumOfSquaredWeights(), a = a.similarity.queryNorm(c);
  if(a === Number.POSITIVE_INFINITY || a === Number.NEGATIVE_INFINITY || isNaN(a)) {
    a = 1
  }
  b.normalize(a);
  return b
};
Query.prototype.rewrite = function() {
  return this
};
Query.prototype.extractTerms = function() {
  throw Error("Unsupported Operation");
};
exports.Query = Query;
IndexSearcher = function(a) {
  this.reader = a
};
IndexSearcher.prototype.similarity = new DefaultSimilarity;
IndexSearcher.prototype.createWeight = function(a) {
  return a.weight(this)
};
IndexSearcher.prototype.search = function(a, b, c) {
  var d;
  if(a instanceof Query) {
    a = this.createWeight(a)
  }else {
    if(!(a instanceof Weight)) {
      throw Error("Search query must be an instance of the Query class.");
    }
  }
  b = Math.min(b, Number.MAX_VALUE);
  d = TopScoreDocCollector.create(b, !a.scoresDocsOutOfOrder());
  this.collectSearch(a, d, function(a) {
    a ? c(a) : c(null, d.topDocs())
  })
};
IndexSearcher.prototype.collectSearch = function(a, b) {
  var c;
  b.setNextReader(this.reader, null);
  c = a.scorer(this.reader, !b.acceptsDocsOutOfOrder(), !0);
  c !== null && c.collect(b)
};
IndexSearcher.prototype.rewrite = function(a) {
  var b;
  for(b = a.rewrite(this.reader);b !== a;b = a.rewrite(this.reader)) {
    a = b
  }
  return a
};
exports.IndexSearcher = IndexSearcher;
var Similarity = function() {
};
Similarity.NO_DOC_ID_PROVIDED = -1;
Similarity.prototype.computeNorm = function() {
};
Similarity.prototype.queryNorm = function() {
};
Similarity.prototype.tf = function() {
};
Similarity.prototype.sloppyFreq = function() {
};
Similarity.prototype.idf = function() {
};
Similarity.prototype.coord = function() {
};
Similarity.prototype.scorePayload = function() {
};
Similarity.prototype.explainTermIDF = function() {
};
Similarity.prototype.explainPhraseIDF = function() {
};
exports.Similarity = Similarity;
var DefaultSimilarity = function() {
};
DefaultSimilarity.prototype.discountOverlaps = !0;
DefaultSimilarity.prototype.computeNorm = function(a, b) {
  return b.boost * (1 / Math.sqrt(this.discountOverlaps ? b.length - b.numOverlap : b.length))
};
DefaultSimilarity.prototype.queryNorm = function(a) {
  return 1 / Math.sqrt(a)
};
DefaultSimilarity.prototype.tf = function(a) {
  return Math.sqrt(a)
};
DefaultSimilarity.prototype.sloppyFreq = function(a) {
  return 1 / (a + 1)
};
DefaultSimilarity.prototype.idf = function(a, b) {
  return Math.log(b / (a + 1)) + 1
};
DefaultSimilarity.prototype.coord = function(a, b) {
  return a / b
};
DefaultSimilarity.prototype.scorePayload = function() {
  return 1
};
DefaultSimilarity.prototype.explainTermIDF = function(a, b, c) {
  var d = b.numDocs || 0;
  c === void 0 && (c = b.termDocFreq[a] || 0);
  return new Explanation(this.idf(c, d), "idf(docFreq=" + c + ", maxDocs=" + d + ")")
};
DefaultSimilarity.prototype.explainPhraseIDF = function(a, b) {
  var c = b.numDocs || 0, d = 0, e = [], f, g;
  for(f = 0;f < a.length;f++) {
    g = b.termDocFreq[a[f]] || 0, d += this.idf(g, c), e.push(" "), e.push(a[f].text), e.push("="), e.push(g)
  }
  return new Explanation(d, e.join(""))
};
exports.DefaultSimilarity = DefaultSimilarity;
var FieldInvertState = function(a, b, c, d, e) {
  this.position = a || 0;
  this.length = b || 0;
  this.numOverlap = c || 0;
  this.offset = d || 0;
  this.maxTermFrequency = 0;
  this.boost = e || 1
};
FieldInvertState.prototype.position = 0;
FieldInvertState.prototype.length = 0;
FieldInvertState.prototype.numOverlap = 0;
FieldInvertState.prototype.offset = 0;
FieldInvertState.prototype.maxTermFrequency = 0;
FieldInvertState.prototype.boost = 1;
FieldInvertState.prototype.reset = function(a) {
  this.maxTermFrequency = this.offset = this.numOverlap = this.length = this.position = 0;
  this.boost = a
};
exports.FieldInvertState = FieldInvertState;
var TopScoreDocCollector = function(a) {
  TopDocsCollector.call(this, new HitQueue(a, !0));
  this.pqTop = this.pq.top()
};
TopScoreDocCollector.create = function(a, b) {
  if(a <= 0) {
    throw Error("numHits must be > 0; please use TotalHitCountCollector if you just need the total hit count");
  }
  return b ? new InOrderTopScoreDocCollector(a) : new OutOfOrderTopScoreDocCollector(a)
};
TopScoreDocCollector.prototype = Object.create(TopDocsCollector.prototype);
TopScoreDocCollector.prototype.newTopDocs = function(a, b) {
  var c;
  if(!a) {
    return TopDocsCollector.EMPTY_TOPDOCS
  }
  if(b === 0) {
    c = a[0].score
  }else {
    for(c = this.pq.size();c > 1;c--) {
      this.pq.pop()
    }
    c = this.pq.pop().score
  }
  return new TopDocs(this.totalHits, a, c)
};
TopScoreDocCollector.prototype.setNextReader = function(a, b) {
  this.docBase = b
};
var InOrderTopScoreDocCollector = function(a) {
  TopScoreDocCollector.call(this, a)
};
InOrderTopScoreDocCollector.prototype = Object.create(TopScoreDocCollector);
InOrderTopScoreDocCollector.prototype.collect = function(a) {
  var b = this.scorer.score();
  this.totalHits++;
  if(!(b <= this.pqTop.score)) {
    this.pqTop.doc = this.docBase ? this.docBase + a : a, this.pqTop.score = b, this.pqTop = this.pq.updateTop()
  }
};
InOrderTopScoreDocCollector.prototype.acceptsDocsOutOfOrder = function() {
  return!1
};
var OutOfOrderTopScoreDocCollector = function(a) {
  TopScoreDocCollector.call(this, a)
};
OutOfOrderTopScoreDocCollector.prototype = Object.create(TopScoreDocCollector);
OutOfOrderTopScoreDocCollector.prototype.collect = function(a) {
  var b = this.scorer.score();
  this.totalHits++;
  a = this.docBase ? this.docBase + a : a;
  if(!(b < this.pqTop.score || b === this.pqTop.score && a > this.pqTop.doc)) {
    this.pqTop.doc = a, this.pqTop.score = b, this.pqTop = this.pq.updateTop()
  }
};
OutOfOrderTopScoreDocCollector.prototype.acceptsDocsOutOfOrder = function() {
  return!0
};
exports.TopScoreDocCollector = TopScoreDocCollector;
exports.InOrderTopScoreDocCollector = InOrderTopScoreDocCollector;
exports.OutOfOrderTopScoreDocCollector = OutOfOrderTopScoreDocCollector;
var Term = function(a, b) {
  this.field = a || "";
  this.text = b || ""
};
Term.prototype.createTerm = function(a) {
  return new Term(this.field, a)
};
Term.prototype.equals = function(a) {
  return this === a || typeof a === "object" && this.field === a.field && this.text === a.text
};
exports.Term = Term;
var Explanation = function(a, b) {
  this.value = a;
  this.description = b;
  this.details = []
};
Explanation.prototype.isMatch = function() {
  return this.value > 0
};
Explanation.prototype.getSummary = function() {
  return this.value + " = " + this.description
};
Explanation.prototype.toString = function(a) {
  var b = [], c, a = a || 0;
  for(c = 0;c < a;c++) {
    b.push("  ")
  }
  b.push(this.getSummary());
  b.push("\n");
  if(this.details) {
    for(c = 0;c < this.details.length;c++) {
      b.push(this.details[c].toString(a + 1))
    }
  }
  return b.join("")
};
exports.Explanation = Explanation;
var SearchResult = function() {
};
exports.SearchResult = SearchResult;

