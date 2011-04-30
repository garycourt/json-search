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
if(typeof Array.orderedInsert !== "function") {
  Array.orderedInsert = function(a, b, c) {
    var d, f, g;
    if(a.length === 0) {
      a[0] = b
    }else {
      d = 0;
      f = a.length - 1;
      for(g = Math.floor(f / 2);f - d > 0;) {
        c(a[g], b) <= 0 ? d = g + 1 : f = g - 1, g = Math.round(d + (f - d) / 2)
      }
      c(a[g], b) <= 0 ? a.splice(g + 1, 0, b) : a.splice(g, 0, b)
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
        for(var b = Array.prototype.slice.call(arguments, 1), c = c.slice(), d = 0, f = c.length;d < f;d++) {
          c[d].apply(this, b)
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
      d.removeListener(a, c);
      b.apply(this, arguments)
    }
    if("function" !== typeof b) {
      throw Error(".once only takes instances of Function");
    }
    var d = this;
    c.listener = b;
    d.on(a, c);
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
      for(var d = -1, f = 0, g = c.length;f < g;f++) {
        if(c[f] === b || c[f].listener && c[f].listener === b) {
          d = f;
          break
        }
      }
      if(d < 0) {
        return this
      }
      c.splice(d, 1);
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
    a.writable && !1 === a.write(b) && e.pause()
  }
  function d(b) {
    a.emit("error", b);
    e.destroy()
  }
  function f() {
    e.readable && e.resume()
  }
  function g() {
    var b = Stream.pipes.indexOf(a);
    Stream.pipes.splice(b, 1);
    Stream.pipes.indexOf(a) === -1 && a.end()
  }
  function i() {
    e.pause()
  }
  function j() {
    e.readable && e.resume()
  }
  function h() {
    e.removeListener("data", c);
    e.removeListener("error", d);
    a.removeListener("drain", f);
    e.removeListener("end", g);
    e.removeListener("close", g);
    a.removeListener("pause", i);
    a.removeListener("resume", j);
    e.removeListener("end", h);
    e.removeListener("close", h);
    e.removeListener("error", h);
    a.removeListener("end", h);
    a.removeListener("close", h);
    a.emit("pipeDisconnected", e)
  }
  var e = this;
  Stream.pipes.push(a);
  e.on("data", c);
  e.on("error", d);
  a.on("drain", f);
  if(!b || b.end !== !1) {
    e.on("end", g), e.on("close", g)
  }
  a.on("pause", i);
  a.on("resume", j);
  e.on("end", h);
  e.on("close", h);
  e.on("error", h);
  a.on("end", h);
  a.on("close", h);
  a.emit("pipeConnected", e)
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
  this.callback = a;
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
DefaultTermIndexer.prototype.index = function() {
};
DefaultTermIndexer.prototype.toSource = function() {
};
exports.DefaultTermIndexer = DefaultTermIndexer;
function MemoryIndex() {
  this._docs = {};
  this._termVecs = {}
}
MemoryIndex.queue = function(a) {
  setTimeout(a, 0)
};
MemoryIndex.prototype._termIndexer = new DefaultTermIndexer;
MemoryIndex.prototype.generateID = function() {
  return String(Math.random())
};
MemoryIndex.prototype.addDocument = function(a, b, c) {
  var d, f, b = typeof b === "undefined" || typeof b === "null" ? this.generateID() : String(b);
  this._docs[b] = a;
  a = this._termIndexer.index(a);
  b = 0;
  for(d = a.length;b < d;++b) {
    f = JSON.stringify([a[b].term, a[b].field]), this._termVecs[f] ? this._termVecs[f].push(a[b]) : this._termVecs[f] = [a[b]]
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
  var c = this._termVecs[JSON.stringify([a, b])], d = new MemoryIndexVectorizer(c);
  MemoryIndex.queue(function() {
    d._run()
  });
  return d
};
function MemoryIndexVectorizer(a) {
  this._entries = a;
  this._index = 0
}
MemoryIndexVectorizer.prototype = Object.create(Stream.prototype);
MemoryIndexVectorizer.prototype._started = !1;
MemoryIndexVectorizer.prototype._paused = !1;
MemoryIndexVectorizer.prototype.readable = !0;
MemoryIndexVectorizer.prototype._run = function() {
  for(this._started = !0;!this._paused && this._index < this._entries.length;) {
    this._index++, this.emit("data", void 0)
  }
  this._index >= this._entries.length && (this.emit("end"), this.destroy())
};
MemoryIndexVectorizer.prototype.pause = function() {
  this._paused = !0;
  Stream.prototype.pause.call(this)
};
MemoryIndexVectorizer.prototype.resume = function() {
  var a = this;
  if(this._started && this._paused) {
    this._paused = !1, MemoryIndex.queue(function() {
      a._run()
    }), Stream.prototype.resume.call(this)
  }
};
MemoryIndexVectorizer.prototype.destroy = function() {
  this._index = Number.POSITIVE_INFINITY;
  Stream.prototype.destroy.call(this)
};
MemoryIndexVectorizer.prototype.destroySoon = function() {
};
exports.MemoryIndex = MemoryIndex;
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
  a.score(this._index, this.similarity).pipe(b)
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
  var c = new TermScorer(this, b);
  a.getTermVectors(this.term, this.field).pipe(c);
  return c
};
TermQuery.prototype.extractTerms = function() {
  return[this.term]
};
function TermScorer(a, b) {
  Stream.call(this);
  this._query = a;
  this._similarity = b
}
TermScorer.prototype = Object.create(Stream.prototype);
TermScorer.prototype.readable = !0;
TermScorer.prototype.writable = !0;
TermScorer.prototype.write = function(a) {
  var b = this._similarity, c = new DocumentTerms(a.documentID, [a]);
  c.sumOfSquaredWeights = Math.pow(b.idf(a) * this._query.boost, 2);
  c.score = b.tf(a) * Math.pow(b.idf(a), 2) * this._query.boost * b.norm(a);
  this.emit("data", c)
};
TermScorer.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.emit("end");
  this.destroy()
};
exports.TermQuery = TermQuery;

