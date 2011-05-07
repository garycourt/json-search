var O = {};
function F() {
}
function typeOf(a) {
  return a === void 0 ? "undefined" : a === null ? "null" : Object.prototype.toString.call(a).split(" ").pop().split("]").shift().toLowerCase()
}
typeof exports === "undefined" && (exports = {});
typeof require !== "function" && (require = function() {
  return exports
});
if(typeof Object.create !== "function") {
  Object.create = function(a) {
    F.prototype = a;
    return new F
  }
}
if(typeof Array.isArray !== "function") {
  Array.isArray = function(a) {
    return typeOf(a) === "array"
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
if(!Array.append) {
  Array.append = function(a, b) {
    b = b.slice(0);
    b.unshift(a.length, 0);
    a.splice.apply(a, b);
    return a
  }
}
if(typeof Array.orderedInsert !== "function") {
  Array.orderedInsert = function(a, b, c) {
    var e, d, f;
    if(a.length === 0) {
      a[0] = b
    }else {
      e = 0;
      d = a.length - 1;
      for(f = Math.floor(d / 2);d - e > 0;) {
        c(a[f], b) <= 0 ? e = f + 1 : d = f - 1, f = Math.round(e + (d - e) / 2)
      }
      c(a[f], b) <= 0 ? a.splice(f + 1, 0, b) : a.splice(f, 0, b)
    }
  }
}
;var EventEmitter = function() {
};
try {
  if(!require("events").EventEmitter) {
    throw Error();
  }
  EventEmitter = require("events").EventEmitter
}catch(e$$5) {
  EventEmitter.DEFAULT_MAX_LISTENERS = 10, EventEmitter.prototype.setMaxListeners = function(a) {
    if(!this._events) {
      this._events = {}
    }
    this._events.maxListeners = a
  }, EventEmitter.prototype.emit = function(a, b) {
    if(a === "error" && (!this._events || !this._events.error || Array.isArray(this._events.error) && !this._events.error.length)) {
      if(arguments[1] instanceof Error) {
        throw arguments[1];
      }else {
        throw Error("Uncaught, unspecified 'error' event.");
      }
    }
    if(!this._events) {
      return!1
    }
    var c = this._events[a];
    if(!c) {
      return!1
    }
    if(typeof c == "function") {
      switch(arguments.length) {
        case 1:
          c.call(this);
          break;
        case 2:
          c.call(this, arguments[1]);
          break;
        case 3:
          c.call(this, arguments[1], arguments[2]);
          break;
        default:
          b = Array.prototype.slice.call(arguments, 1), c.apply(this, b)
      }
      return!0
    }else {
      if(Array.isArray(c)) {
        for(var b = Array.prototype.slice.call(arguments, 1), c = c.slice(), e = 0, d = c.length;e < d;e++) {
          c[e].apply(this, b)
        }
        return!0
      }else {
        return!1
      }
    }
  }, EventEmitter.prototype.addListener = function(a, b) {
    if("function" !== typeof b) {
      throw Error("addListener only takes instances of Function");
    }
    if(!this._events) {
      this._events = {}
    }
    this.emit("newListener", a, b);
    if(this._events[a]) {
      if(Array.isArray(this._events[a])) {
        if(!this._events[a].warned) {
          var c;
          if((c = this._events.maxListeners !== void 0 ? this._events.maxListeners : EventEmitter.DEFAULT_MAX_LISTENERS) && c > 0 && this._events[a].length > c) {
            this._events[a].warned = !0
          }
        }
        this._events[a].push(b)
      }else {
        this._events[a] = [this._events[a], b]
      }
    }else {
      this._events[a] = b
    }
    return this
  }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.once = function(a, b) {
    function c() {
      e.removeListener(a, c);
      b.apply(this, arguments)
    }
    if("function" !== typeof b) {
      throw Error(".once only takes instances of Function");
    }
    var e = this;
    c.listener = b;
    e.on(a, c);
    return this
  }, EventEmitter.prototype.removeListener = function(a, b) {
    if("function" !== typeof b) {
      throw Error("removeListener only takes instances of Function");
    }
    if(!this._events || !this._events[a]) {
      return this
    }
    var c = this._events[a];
    if(Array.isArray(c)) {
      for(var e = -1, d = 0, f = c.length;d < f;d++) {
        if(c[d] === b || c[d].listener && c[d].listener === b) {
          e = d;
          break
        }
      }
      if(e < 0) {
        return this
      }
      c.splice(e, 1);
      c.length == 0 && delete this._events[a]
    }else {
      (c === b || c.listener && c.listener === b) && delete this._events[a]
    }
    return this
  }, EventEmitter.prototype.removeAllListeners = function(a) {
    if(arguments.length === 0) {
      return this._events = {}, this
    }
    a && this._events && this._events[a] && (this._events[a] = null);
    return this
  }, EventEmitter.prototype.listeners = function(a) {
    if(!this._events) {
      this._events = {}
    }
    this._events[a] || (this._events[a] = []);
    Array.isArray(this._events[a]) || (this._events[a] = [this._events[a]]);
    return this._events[a]
  }
}
exports.EventEmitter = EventEmitter;
function Stream() {
  EventEmitter.call(this)
}
Stream.prototype = Object.create(EventEmitter.prototype);
Stream.pipes = [];
Stream.prototype.readable = !1;
Stream.prototype.writable = !1;
Stream.prototype.pipe = function(a, b) {
  function c(b) {
    a.writable && !1 === a.write(b) && g.pause()
  }
  function e(b) {
    a.emit("error", b);
    g.destroy()
  }
  function d() {
    g.readable && g.resume()
  }
  function f() {
    var b = Stream.pipes.indexOf(a);
    Stream.pipes.splice(b, 1);
    Stream.pipes.indexOf(a) === -1 && a.end()
  }
  function i() {
    g.pause()
  }
  function j() {
    g.readable && g.resume()
  }
  function h() {
    g.removeListener("data", c);
    g.removeListener("error", e);
    a.removeListener("drain", d);
    g.removeListener("end", f);
    g.removeListener("close", f);
    a.removeListener("pause", i);
    a.removeListener("resume", j);
    g.removeListener("end", h);
    g.removeListener("close", h);
    g.removeListener("error", h);
    a.removeListener("end", h);
    a.removeListener("close", h);
    a.emit("pipeDisconnected", g)
  }
  var g = this;
  Stream.pipes.push(a);
  g.on("data", c);
  g.on("error", e);
  a.on("drain", d);
  if(!b || b.end !== !1) {
    g.on("end", f), g.on("close", f)
  }
  a.on("pause", i);
  a.on("resume", j);
  g.on("end", h);
  g.on("close", h);
  g.on("error", h);
  a.on("end", h);
  a.on("close", h);
  a.emit("pipeConnected", g)
};
Stream.prototype.pause = function() {
  this.emit("pause")
};
Stream.prototype.resume = function() {
  this.emit("resume")
};
Stream.prototype.destroy = function() {
  this.writable = this.readable = !1;
  this.emit("close");
  this.removeAllListeners()
};
Stream.prototype.destroySoon = Stream.prototype.destroy;
exports.Stream = Stream;
function Collector(a) {
  var b = this;
  Stream.call(this);
  this.collection = [];
  this.callback = a || null;
  this.on("error", function(a) {
    if(b.callback) {
      b.callback(a), b.callback = null
    }
  })
}
Collector.prototype = Object.create(Stream.prototype);
Collector.prototype.callback = null;
Collector.prototype.writable = !0;
Collector.prototype.write = function(a) {
  this.collection.push(a);
  return!0
};
Collector.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.destroy()
};
Collector.prototype.destroy = function() {
  if(this.callback) {
    this.callback(null, this.collection), this.callback = null
  }
};
Collector.prototype.destroySoon = Collector.prototype.destroy;
exports.Collector = Collector;
function SingleCollector(a) {
  var b = this;
  Stream.call(this);
  this.callback = a || null;
  this.on("error", function(a) {
    if(b.callback) {
      b.callback(a), b.callback = null
    }
  })
}
SingleCollector.prototype = Object.create(Stream.prototype);
SingleCollector.prototype.callback = null;
SingleCollector.prototype.writable = !0;
SingleCollector.prototype.write = function(a) {
  if(typeof this.data !== "undefined") {
    throw Error("Stream is full");
  }
  this.data = a;
  this.callback && this.callback(null, a);
  return this.data === "undefined"
};
SingleCollector.prototype.drain = function() {
  this.data = void 0;
  this.emit("drain")
};
SingleCollector.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.destroy()
};
SingleCollector.prototype.destroy = function() {
  this.callback = null
};
SingleCollector.prototype.destroySoon = SingleCollector.prototype.destroy;
exports.SingleCollector = SingleCollector;
function DocumentTerms(a, b) {
  this.id = a;
  this.terms = b || []
}
DocumentTerms.prototype.terms = [];
exports.DocumentTerms = DocumentTerms;
function TopDocumentsCollector(a, b) {
  Collector.call(this, b);
  this.max = a || 1
}
TopDocumentsCollector.compareScores = function(a, b) {
  return b.score - a.score
};
TopDocumentsCollector.prototype = Object.create(Collector.prototype);
TopDocumentsCollector.prototype.lowestScore = 0;
TopDocumentsCollector.prototype.write = function(a) {
  if(this.collection.length < this.max || a.score > this.lowestScore) {
    this.collection.length >= this.max && this.collection.pop(), Array.orderedInsert(this.collection, a, TopDocumentsCollector.compareScores), this.lowestScore = this.collection[this.collection.length - 1].score
  }
};
exports.TopDocumentsCollector = TopDocumentsCollector;
function DefaultTermIndexer() {
}
DefaultTermIndexer.prototype.index = function(a, b) {
  var c, e, d, f = [];
  switch(typeOf(a)) {
    case "null":
    ;
    case "boolean":
    ;
    case "number":
      f[0] = {term:a, field:b};
      break;
    case "string":
      c = a.replace(/[^\w\d]/g, " ").replace(/\s\s/g, " ").toLowerCase().split(" ");
      e = {};
      for(d = 0;d < c.length;++d) {
        e[c[d]] ? (e[c[d]].termFrequency++, e[c[d]].termPositions.push(d), e[c[d]].termOffsets.push(d)) : e[c[d]] = {term:c[d], termFrequency:1, termPositions:[d], termOffsets:[d], field:b, totalFieldTokens:c.length}
      }
      for(d in e) {
        e[d] !== O[d] && (f[f.length] = e[d])
      }
      break;
    case "object":
      for(d in a) {
        a[d] !== O[d] && (f = f.concat(this.index(a[d], b ? b + "." + d : d)))
      }
      break;
    case "array":
      for(d = 0;d < a.length;++d) {
        f = f.concat(this.index(a[d], b ? b + "." + d : String(d)))
      }
  }
  return f
};
DefaultTermIndexer.prototype.toSource = function() {
};
exports.DefaultTermIndexer = DefaultTermIndexer;
function ArrayStream(a, b) {
  this._entries = a;
  this._index = 0;
  this._mapper = b
}
ArrayStream.prototype = Object.create(Stream.prototype);
ArrayStream.prototype._started = !1;
ArrayStream.prototype._paused = !1;
ArrayStream.prototype.readable = !0;
ArrayStream.prototype._run = function() {
  var a;
  for(this._started = !0;!this._paused && this._index < this._entries.length;) {
    a = this._entries[this._index++], this._mapper && (a = this._mapper(a)), this.emit("data", a)
  }
  this._index >= this._entries.length && (this.emit("end"), this.destroy())
};
ArrayStream.prototype.start = function() {
  var a = this;
  setTimeout(function() {
    a._run()
  }, 0);
  return this
};
ArrayStream.prototype.pause = function() {
  this._paused = !0;
  Stream.prototype.pause.call(this)
};
ArrayStream.prototype.resume = function() {
  if(this._started && this._paused) {
    this._paused = !1, this.start(), Stream.prototype.resume.call(this)
  }
};
ArrayStream.prototype.destroy = function() {
  this._index = Number.POSITIVE_INFINITY;
  Stream.prototype.destroy.call(this)
};
ArrayStream.prototype.destroySoon = function() {
};
exports.ArrayStream = ArrayStream;
function MemoryIndex() {
  this._docs = {};
  this._termVecs = {}
}
MemoryIndex.prototype._docCount = 0;
MemoryIndex.prototype._termIndexer = new DefaultTermIndexer;
MemoryIndex.prototype.generateID = function() {
  return String(Math.random())
};
MemoryIndex.prototype.addDocument = function(a, b, c) {
  var e, d, f, b = typeof b === "undefined" || typeOf(b) === "null" ? this.generateID() : String(b);
  this._docs[b] = a;
  this._docCount++;
  a = this._termIndexer.index(a);
  e = 0;
  for(d = a.length;e < d;++e) {
    a[e].documentID = b, f = JSON.stringify([a[e].term, a[e].field]), this._termVecs[f] ? this._termVecs[f].push(a[e]) : this._termVecs[f] = [a[e]]
  }
  c && c(null)
};
MemoryIndex.prototype.getDocument = function(a, b) {
  b(null, this._docs[a])
};
MemoryIndex.prototype.setTermIndexer = function(a) {
  this._termIndexer = a
};
MemoryIndex.prototype.getTermVectors = function(a, b) {
  var c = this._termVecs[JSON.stringify([a, b])] || [], e = this;
  return(new ArrayStream(c, function(a) {
    return{term:a.term, termFrequency:a.termFrequency || 1, termPositions:a.termPositions || [0], termOffsets:a.termOffsets || [0], field:a.field || null, fieldBoost:a.fieldBoost || 1, totalFieldTokens:a.totalFieldTokens || 1, documentBoost:a.fieldBoost || 1, documentID:a.documentID, documentFrequency:c.length, totalDocuments:e._docCount}
  })).start()
};
exports.MemoryIndex = MemoryIndex;
var DefaultSimilarity = function() {
};
DefaultSimilarity.prototype.norm = function(a) {
  return a.documentBoost * a.fieldBoost * (1 / Math.sqrt(a.totalFieldTokens))
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
  (new NormalizedQuery(a)).score(this.similarity, this._index).pipe(b)
};
exports.Searcher = Searcher;
function TermQuery(a, b, c) {
  this.term = a;
  this.field = b || null;
  this.boost = c || 1
}
TermQuery.prototype.field = null;
TermQuery.prototype.boost = 1;
TermQuery.prototype.score = function(a, b) {
  var c = new TermScorer(this, a);
  b.getTermVectors(this.term, this.field).pipe(c);
  return c
};
TermQuery.prototype.extractTerms = function() {
  return[{term:this.term, field:this.field}]
};
function TermScorer(a, b) {
  Stream.call(this);
  this._boost = a.boost;
  this._similarity = b
}
TermScorer.prototype = Object.create(Stream.prototype);
TermScorer.prototype.readable = !0;
TermScorer.prototype.writable = !0;
TermScorer.prototype.write = function(a) {
  var b = this._similarity, c = new DocumentTerms(a.documentID, [a]);
  c.sumOfSquaredWeights = Math.pow(b.idf(a) * this._boost, 2);
  c.score = b.tf(a) * Math.pow(b.idf(a), 2) * this._boost * b.norm(a);
  this.emit("data", c)
};
TermScorer.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.emit("end");
  this.destroy()
};
exports.TermQuery = TermQuery;
function NormalizedQuery(a) {
  this.query = a
}
NormalizedQuery.prototype.boost = 1;
NormalizedQuery.prototype.score = function(a, b) {
  var c = new NormalizedScorer(this, a);
  this.query.score(a, b).pipe(c);
  return c
};
NormalizedQuery.prototype.extractTerms = function() {
  return this.query.extractTerms()
};
function NormalizedScorer(a, b) {
  Stream.call(this);
  this._similarity = b;
  this._maxOverlap = a.extractTerms().length
}
NormalizedScorer.prototype = Object.create(Stream.prototype);
NormalizedScorer.prototype.readable = !0;
NormalizedScorer.prototype.writable = !0;
NormalizedScorer.prototype.write = function(a) {
  a.score *= this._similarity.queryNorm(a) * this._similarity.coord(a.terms.length, this._maxOverlap);
  this.emit("data", a)
};
NormalizedScorer.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.emit("end");
  this.destroy()
};
exports.NormalizedQuery = NormalizedQuery;
function BooleanClause(a, b) {
  this.query = a;
  this.occur = b || Occur.SHOULD
}
var Occur = {MUST:1, SHOULD:0, MUST_NOT:-1};
exports.BooleanQuery = BooleanQuery;
exports.Occur = Occur;
function BooleanQuery(a, b) {
  this.clauses = a || [];
  this.minimumOptionalMatches = b || 0
}
BooleanQuery.prototype.minimumOptionalMatches = 0;
BooleanQuery.prototype.boost = 1;
BooleanQuery.prototype.score = function(a, b) {
  return new BooleanScorer(this, a, b)
};
BooleanQuery.prototype.extractTerms = function() {
  var a, b, c = [];
  a = 0;
  for(b = this.clauses.length;a < b;++a) {
    c = c.concat(this.clauses[a].query.extractTerms())
  }
  return c
};
function BooleanScorer(a, b, c) {
  this._query = a;
  this._similarity = b;
  this._index = c;
  this._inputs = [];
  this.addInputs(a.clauses)
}
BooleanScorer.prototype.readable = !0;
BooleanScorer.prototype.addInputs = function(a) {
  var b = this, c, e, d, f;
  c = 0;
  for(e = a.length;c < e;++c) {
    d = a[c], f = new SingleCollector(function(a) {
      a ? b.emit("error", a) : b.process()
    }), d.query.score(this._similarity, this._index).pipe(f), this._inputs.push(new BooleanClauseStream(d.query, d.occur, f))
  }
};
BooleanScorer.prototype.process = function() {
};
BooleanScorer.prototype.pause = function() {
};
BooleanScorer.prototype.resume = function() {
};
BooleanScorer.prototype.destroy = function() {
};
BooleanScorer.prototype.destroySoon = function() {
};
function BooleanClauseStream(a, b, c) {
  this.query = a;
  this.occur = b;
  this.collector = c
}
BooleanClauseStream.prototype = Object.create(BooleanClause.prototype);
exports.BooleanQuery = BooleanQuery;

