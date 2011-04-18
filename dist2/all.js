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
function TermDocument() {
}
;function DocumentTerms(a, b) {
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
function Searcher(a) {
  this._index = a
}
Searcher.prototype.search = function(a, b, c) {
  b = new TopDocumentsCollector(b, c);
  (new NormalizedQuery(a)).createScorer(b).scoreDocuments(this._index)
};
function testSearch() {
  (new Searcher(new MemoryIndex)).search(new TermQuery("test", null), 10, function(a, b) {
    a ? console.error(a) : console.log(b)
  })
}
;
