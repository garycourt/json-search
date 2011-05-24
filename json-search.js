/** @type {Object} */ var O = {};
/** @constructor */   function F() {};

/**
 * @param {*} o
 * @return {string}
 */

function typeOf(o) {
	return o === undefined ? 'undefined' : (o === null ? 'null' : Object.prototype.toString.call(/** @type {Object} */ (o)).split(' ').pop().split(']').shift().toLowerCase());
};

if (typeof exports === "undefined") {
	/**
	 * @type {Object}
	 */
	
	exports = {};
}

if (typeof require !== "function") {
	/**
	 * @param {string} id
	 * @return {Object}
	 */
	
	require = function (id) {
		return exports;
	}; 
}

if (typeof Object.create !== "function") {
	/**
	 * @param {Object} o
	 * @return {Object}
	 */
	
	Object.create = function (o) {
		F.prototype = o;
		return new F();
	};
}

if (typeof Array.isArray !== "function") {
	/**
	 * @param {Array} arr
	 * @return {boolean}
	 */
	
	Array.isArray = function (arr) {
		return typeOf(arr) === "array";
	};
}

if (typeof Array.add !== "function") {
	/**
	 * @param {Array} arr
	 * @param {*} obj
	 * @return {boolean}
	 */
	
	Array.add = function (arr, obj) {
		var index = arr.indexOf(obj);
		if (index === -1) {
			arr[arr.length] = obj;
			return true;
		}
		return false;
	};
}

if (typeof Array.remove !== "function") {
	/**
	 * @param {Array} arr
	 * @param {*} obj
	 * @return {boolean}
	 */
	
	Array.remove = function (arr, obj) {
		var index = arr.indexOf(obj);
		if (index !== -1) {
			arr.splice(index, 1);
			return true;
		}
		return false;
	};
}

if (!Array.append) {
	/**
	 * @param {Array} arr1 The target array to modify
	 * @param {Array} arr2 The array to append onto the target
	 * @returns {Array} The modified array for chaining
	 */
	
	Array.append = function (arr1, arr2) {
		arr2 = arr2.slice(0);
		arr2.unshift(arr1.length, 0);
		arr1.splice.apply(arr1, arr2);
		return arr1;
	};
}

if (typeof Array.orderedInsert !== "function") {
	/**
	 * @param {Array} arr
	 * @param {*} obj
	 * @param {function(?, ?)} comparator
	 * @return {boolean}
	 */
	
	Array.orderedInsert = function (arr, obj, comparator) {
		var start, end, pivot, cmp;
		if (arr.length === 0) {
			arr[0] = obj;
		} else {
			start = 0;
			end = arr.length - 1;
			pivot = Math.floor(end / 2);
			
			while ((end - start) > 0) {
				if (comparator(arr[pivot], obj) <= 0) {
					start = pivot + 1;
				} else {
					end = pivot - 1;
				}
				pivot = Math.round(start + ((end - start) / 2));
			}
			
			if (comparator(arr[pivot], obj) <= 0) {
				arr.splice(pivot + 1, 0, obj);
			} else {
				arr.splice(pivot, 0, obj);
			}
		}
	};
}

//if (!Function.prototype.bind) {
	/**
	 * @param {Object} obj
	 * @param {...*} [var_args]
	 * @return {!Function}
	 */
	/*
	Function.prototype.bind = function (obj, var_args) {
		var slice = Array.prototype.slice,
			self = this,
			args,
			bound;
		obj = obj || {};
		args = slice.call(arguments, 1);
		bound = function () {
			return self.apply(this instanceof F ? this : obj, args.concat(slice.call(arguments)));
		};

		F.prototype = self.prototype;
		bound.prototype = new F();

		return bound;
	};
	*/
//}

/**
 * Create our own EventEmitter
 * @constructor
 * @implements {Emitter}
 */

var EventEmitter = function () {};

try {
	if (!require("events").EventEmitter) {
		throw new Error();
	}
	
	/**
	 * use Node's implementation, if available
	 * @constructor
	 * @implements {Emitter}
	 */
	
	EventEmitter = require("events").EventEmitter;
} catch(e) {
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	/**
	 * @private
	 * @type {Object}
	 */
	
	EventEmitter.prototype._events;
	
	/**
	 * @param {string} type
	 * @param {...*} [args]
	 * @return {boolean}
	 */
	
	EventEmitter.prototype.emit = function (type, args) {
		// If there is no 'error' event listener then throw.
		if (type === 'error') {
			if (!this._events || !this._events.error || (Array.isArray(this._events.error) && !this._events.error.length)) {
				if (arguments[1] instanceof Error) {
					throw arguments[1]; // Unhandled 'error' event
				} else {
					throw new Error("Uncaught, unspecified 'error' event.");
				}
			}
		}
	
		if (!this._events) return false;
		var handler = this._events[type];
		if (!handler) return false;
	
		if (typeof handler == 'function') {
			switch (arguments.length) {
				// fast cases
			case 1:
				handler.call(this);
				break;
			case 2:
				handler.call(this, arguments[1]);
				break;
			case 3:
				handler.call(this, arguments[1], arguments[2]);
				break;
				// slower
			default:
				args = Array.prototype.slice.call(arguments, 1);
				handler.apply(this, args);
			}
			return true;
	
		} else if (Array.isArray(handler)) {
			args = Array.prototype.slice.call(arguments, 1);
	
			var listeners = handler.slice();
			for (var i = 0, l = listeners.length; i < l; i++) {
				listeners[i].apply(this, args);
			}
			return true;
	
		} else {
			return false;
		}
	};
	
	/**
	 * @param {string} type
	 * @param {function(...)} listener
	 * @return {EventEmitter}
	 */
	
	EventEmitter.prototype.addListener = function (type, listener) {
		if ('function' !== typeof listener) {
			throw new Error('addListener only takes instances of Function');
		}
	
		if (!this._events) this._events = {};
	
		// To avoid recursion in the case that type == "newListeners"! Before
		// adding it to the listeners, first emit "newListeners".
		//this.emit('newListener', type, listener);
	
		if (!this._events[type]) {
			// Optimize the case of one listener. Don't need the extra array object.
			this._events[type] = listener;
		} else if (Array.isArray(this._events[type])) {
			// If we've already got an array, just append.
			this._events[type].push(listener);
		} else {
			// Adding the second element, need to change to array.
			this._events[type] = [this._events[type], listener];
		}
	
		return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	/**
	 * @param {string} type
	 * @param {function(...)} listener
	 * @return {EventEmitter}
	 */
	
	EventEmitter.prototype.once = function (type, listener) {
		if ('function' !== typeof listener) {
			throw new Error('.once only takes instances of Function');
		}
	
		var self = this;
	
		function g() {
			self.removeListener(type, g);
			listener.apply(this, arguments);
		};
	
		g.listener = listener;
		self.on(type, g);
	
		return this;
	};
	
	/**
	 * @param {string} type
	 * @param {function(...)} listener
	 * @return {EventEmitter}
	 */
	
	EventEmitter.prototype.removeListener = function (type, listener) {
		if ('function' !== typeof listener) {
			throw new Error('removeListener only takes instances of Function');
		}
	
		// does not use listeners(), so no side effect of creating _events[type]
		if (!this._events || !this._events[type]) return this;
	
		var list = this._events[type];
	
		if (Array.isArray(list)) {
			var position = -1;
			for (var i = 0, length = list.length; i < length; i++) {
				if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
					position = i;
					break;
				}
			}
	
			if (position < 0) return this;
			
			if (list.length === 1) {
				delete this._events[type];
			} else {
				list.splice(position, 1);
			}
		} else if (list === listener || (list.listener && list.listener === listener)) {
			delete this._events[type];
		}
	
		return this;
	};
	
	/**
	 * @param {string} [type]
	 * @return {EventEmitter}
	 */
	
	EventEmitter.prototype.removeAllListeners = function (type) {
		if (arguments.length === 0) {
			this._events = {};
			return this;
		}
	
		// does not use listeners(), so no side effect of creating _events[type]
		if (type && this._events && this._events[type]) this._events[type] = null;
		return this;
	};
	
	/**
	 * @param {string} type
	 * @return {Array.<function(...)>}
	 */
	
	EventEmitter.prototype.listeners = function (type) {
		if (!this._events) this._events = {};
		if (!this._events[type]) this._events[type] = [];
		if (!Array.isArray(this._events[type])) {
			this._events[type] = [this._events[type]];
		}
		return this._events[type];
	};
}


exports.EventEmitter = EventEmitter;

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @constructor
 * @extends {EventEmitter}
 */

function Stream() {
	EventEmitter.call(this);
}

Stream.prototype = Object.create(EventEmitter.prototype);

/**
 * @type {boolean}
 */

Stream.prototype.readable = false;

/**
 * @type {boolean}
 */

Stream.prototype.writable = false;

/**
 * @param {WritableStream} dest
 * @param {Object} [options]
 */

Stream.prototype.pipe = function (dest, options) {
	var source = this;

	/**
	 * @param {?} chunk
	 */

	function ondata(chunk) {
		if (dest.writable) {
			if (false === dest.write(chunk)) source.pause();
		}
	}

	source.on('data', ondata);
	
	function onerror(err) {
		dest.emit('error', err);
		source.destroy();
	};
	
	if (!options || options.error !== false) {
		source.on('error', onerror);
	}

	function ondrain() {
		if (source.readable) source.resume();
	}

	dest.on('drain', ondrain);

	/*
	 * If the 'end' option is not supplied, dest.end() will be called when
	 * source gets the 'end' event.
	 */

	function onend() {
		dest.end();
	}

	if (!options || options.end !== false) {
		source.on('end', onend);
		source.on('close', onend);
	}

	function onpause() {
		source.pause();
	}

	dest.on('pause', onpause);

	function onresume() {
		if (source.readable) source.resume();
	};

	dest.on('resume', onresume);

	function cleanup() {
		source.removeListener('data', ondata);
		source.removeListener('error', onerror);
		dest.removeListener('drain', ondrain);
		source.removeListener('end', onend);
		source.removeListener('close', onend);

		dest.removeListener('pause', onpause);
		dest.removeListener('resume', onresume);

		source.removeListener('end', cleanup);
		source.removeListener('close', cleanup);
		source.removeListener('error', cleanup);

		dest.removeListener('end', cleanup);
		dest.removeListener('close', cleanup);
		
		//dest.emit('pipeDisconnected', source);
	};

	source.on('end', cleanup);
	source.on('close', cleanup);
	source.on('error', cleanup);

	dest.on('end', cleanup);
	dest.on('close', cleanup);

	//dest.emit('pipeConnected', source);
};

/**
 */

Stream.prototype.pause = function () {
	this.emit('pause');
};

/**
 */

Stream.prototype.resume = function () {
	this.emit('resume');
};

/**
 */

Stream.prototype.destroy = function () {
	this.readable = false;
	this.writable = false;
	this.emit('close');
	this.removeAllListeners();
};

Stream.prototype.destroySoon = Stream.prototype.destroy;


exports.Stream = Stream;

/**
 * @constructor
 * @extends {Stream}
 * @implements ReadableStream
 * @param {Array} entries
 * @param {function(?)} [mapper]
 */

function ArrayStream(entries, mapper) {
	Stream.call(this);
	this._entries = entries;
	this._index = 0;
	this._mapper = mapper;
};

ArrayStream.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {Array}
 */

ArrayStream.prototype._entries;

/**
 * @protected
 * @type {number}
 */

ArrayStream.prototype._index;

/**
 * @protected
 * @type {function(?)|undefined}
 */

ArrayStream.prototype._mapper;

/**
 * @protected
 * @type {boolean}
 */

ArrayStream.prototype._started = false;

/**
 * @protected
 * @type {boolean}
 */

ArrayStream.prototype._paused = false;

/**
 * @protected
 * @type {boolean}
 */

ArrayStream.prototype.readable = true;

/**
 * @protected
 */

ArrayStream.prototype._run = function () {
	var data;
	this._started = true;
	
	while (!this._paused && this._index < this._entries.length) {
		data = this._entries[this._index++];
		
		if (this._mapper) {
			data = this._mapper(data);
		}
		
		this.emit('data', data);
	}
	
	if (!this._paused && this._index >= this._entries.length) {
		this.emit('end');
		this.destroy();
	}
};

/**
 * @return {ArrayStream}
 */

ArrayStream.prototype.start = function () {
	var self = this;
	setTimeout(function () {
		self._run();
	}, 0);
	return this;
};

/**
 */

ArrayStream.prototype.pause = function () {
	this._paused = true;
	Stream.prototype.pause.call(this);
};

/**
 */

ArrayStream.prototype.resume = function () {
	var self = this;
	if (this._started && this._paused) {
		this._paused = false;
		this.start();
		Stream.prototype.resume.call(this);
	}
};

/**
 */

ArrayStream.prototype.destroy = function () {
	this._index = Number.POSITIVE_INFINITY;
	Stream.prototype.destroy.call(this);
};

/**
 */

ArrayStream.prototype.destroySoon = function () {};  //Does nothing


exports.ArrayStream = ArrayStream;

/**
 * @constructor
 * @extends {Stream}
 * @implements {WritableStream}
 * @param {function(PossibleError, Array=)} [callback]
 */

function Collector(callback) {
	var self = this;
	Stream.call(this);
	this.collection = [];
	this.callback = callback || null;
	
	this.on('error', function (err) {
		if (self.callback) {
			self.callback(err);
			self.callback = null;
		}
	});
};

Collector.prototype = Object.create(Stream.prototype);

/**
 * @type {Array}
 */

Collector.prototype.collection;

/**
 * @type {function(PossibleError, Array=)|null}
 */

Collector.prototype.callback = null;

/**
 * @type {boolean}
 */

Collector.prototype.writable = true;

/**
 * @param {?} data
 * @return {boolean}
 */

Collector.prototype.write = function (data) {
	this.collection.push(data);
	return true;
};

/**
 * @param {?} [data]
 */

Collector.prototype.end = function (data) {
	if (typeof data !== "undefined") {
		this.write(data);
	}
	this.destroy();
};

/**
 */

Collector.prototype.destroy = function () {
	if (this.callback) {
		this.callback(null, this.collection);
		this.callback = null;
	}
};

/**
 */

Collector.prototype.destroySoon = Collector.prototype.destroy;


exports.Collector = Collector;

/**
 * @constructor
 * @extends {Stream}
 * @implements {ReadableStream}
 * @implements {WritableStream}
 */

function SingleCollector() {
	Stream.call(this);
};

SingleCollector.prototype = Object.create(Stream.prototype);

/**
 * @private
 * @type {boolean}
 */

SingleCollector.prototype._writing = false;

/**
 * @type {*}
 */

SingleCollector.prototype.data;

/**
 * @type {boolean}
 */

SingleCollector.prototype.readable = true;

/**
 * @type {boolean}
 */

SingleCollector.prototype.writable = true;

/**
 * @param {*} data
 * @return {boolean}
 */

SingleCollector.prototype.write = function (data) {
	if (typeof this.data !== "undefined") {
		throw new Error("Stream is full");
	}
	
	this.data = data;
	this._writing = true;
	this.emit('data', data);
	this._writing = false;
	return (typeof this.data === "undefined");
};

SingleCollector.prototype.drain = function () {
	this.data = undefined;
	if (!this._writing) {
		this.emit('drain');
	}
};

/**
 * @param {*} [data]
 */

SingleCollector.prototype.end = function (data) {
	if (typeof data !== "undefined") {
		this.write(data);
	}
	this.emit('end');
	this.destroy();
};


exports.SingleCollector = SingleCollector;

/**
 * @constructor
 * @implements {TermIndexer}
 */

function DefaultTermIndexer() {};

/**
 * @param {Object} doc
 * @param {string} [field]
 * @return {Array.<TermVectorEntry>}
 */

DefaultTermIndexer.prototype.index = function (doc, field) {
	var terms,
		entries,
		key,
		/** @type {Array.<TermVectorEntry>} */
		result = [];
	
	switch (typeOf(doc)) {
	case 'null':
	case 'boolean':
	case 'number':
		result[0] = /** @type {TermVectorEntry} */ ({
				term : doc,
				field : field
		});
		break;
		
	case 'string':
		terms = doc.replace(/[^\w\d]/g, " ").replace(/\s\s/g, " ").toLowerCase().split(" ");
		entries = {};
		
		for (key = 0; key < terms.length; ++key) {
			if (!entries[terms[key]]) {
				entries[terms[key]] = /** @type {TermVectorEntry} */ ({
					term : terms[key],
					termFrequency : 1,
					termPositions : [key],
					termOffsets : [key],  //FIXME
					field : field,
					totalFieldTokens : terms.length
				});
			} else {
				//TODO: Optimize
				entries[terms[key]].termFrequency++;
				entries[terms[key]].termPositions.push(key);
				entries[terms[key]].termOffsets.push(key);  //FIXME
			}
		}
		
		for (key in entries) {
			if (entries[key] !== O[key]) {
				result[result.length] = entries[key];
			}
		}
		break;
		
	case 'object':
		for (key in doc) {
			if (doc[key] !== O[key]) {
				result = result.concat(this.index(doc[key], (field ? field + "." + key : key)));
			}
		}
		break;
	
	case 'array':
		for (key = 0; key < doc.length; ++key) {
			result = result.concat(this.index(doc[key], (field ? field + "." + key : String(key))));
		}
		break;
	}
	
	return result;
};

/**
 * @return {String}
 */

DefaultTermIndexer.prototype.toSource = function () {
	//TODO
};


exports.DefaultTermIndexer = DefaultTermIndexer;

/**
 * @constructor
 * @implements Index
 */

function MemoryIndex() {
	this._docs = {};
	this._termVecs = {};
};

/**
 * @param {TermVectorEntry} a
 * @param {TermVectorEntry} b
 * @return {number}
 */

MemoryIndex.documentIDComparator = function (a, b) {
	if (a.documentID < b.documentID) {
		return -1;
	} else if (a.documentID > b.documentID) {
		return 1;
	} 
	//else
	return 0;
};

/**
 * @protected
 * @type {Object}
 */

MemoryIndex.prototype._docs;

/**
 * @protected
 * @type {number}
 */

MemoryIndex.prototype._docCount = 0;

/**
 * @protected
 * @type {Object.<Array.<TermVectorEntry>>}
 */

MemoryIndex.prototype._termVecs;

/**
 * @protected
 * @type {TermIndexer}
 */

MemoryIndex.prototype._termIndexer = new DefaultTermIndexer();

/**
 * @return {string}
 */

MemoryIndex.prototype.generateID = function () {
	return String(Math.random());  //FIXME
};

/**
 * @param {Object} doc
 * @param {DocumentID|null} [id]
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.addDocument = function (doc, id, callback) {
	var termVecEnts, i, il, vecKey;
	if (typeof id === "undefined" || typeOf(id) === "null") {
		id = this.generateID();
	} else {
		id = String(id);
	}
	
	this._docs[id] = doc;
	this._docCount++;
	termVecEnts = this._termIndexer.index(doc);
	
	for (i = 0, il = termVecEnts.length; i < il; ++i) {
		termVecEnts[i].documentID = id;
		vecKey = JSON.stringify([termVecEnts[i].term, termVecEnts[i].field]);
		if (!this._termVecs[vecKey]) {
			this._termVecs[vecKey] = [ termVecEnts[i] ];
		} else {
			Array.orderedInsert(this._termVecs[vecKey], termVecEnts[i], MemoryIndex.documentIDComparator);
		}
	}
	
	if (callback) {
		callback(null);
	}
};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

MemoryIndex.prototype.getDocument = function (id, callback) {
	callback(null, this._docs[id]);
};

/**
 * @param {TermIndexer} indexer
 */

MemoryIndex.prototype.setTermIndexer = function (indexer) {
	this._termIndexer = indexer;
};

/**
 * @param {string} term
 * @param {string|null} field
 * @return {ReadableStream}
 */

MemoryIndex.prototype.getTermVectors = function (term, field) {
	var vecKey = JSON.stringify([term, field]),
		entries = this._termVecs[vecKey] || [],
		self = this,
		stream = new ArrayStream(entries, function (termVecEnt) {
			return /** @type {TermVector} */ ({
				term : termVecEnt.term,
				termFrequency : termVecEnt.termFrequency || 1,
				termPositions : termVecEnt.termPositions || [0],
				termOffsets : termVecEnt.termOffsets || [0],
				field : termVecEnt.field || null,
				fieldBoost : termVecEnt.fieldBoost || 1.0,
				totalFieldTokens : termVecEnt.totalFieldTokens || 1,
				documentBoost : termVecEnt.fieldBoost || 1.0,
				documentID : termVecEnt.documentID,
				documentFrequency : entries.length,
				totalDocuments : self._docCount
			});
		});
	return stream.start();
};


exports.MemoryIndex = MemoryIndex;

/**
 * @constructor
 * @param {Query} query
 * @param {Occur} [occur]
 */

function BooleanClause(query, occur) {
	this.query = query;
	this.occur = occur || Occur.SHOULD;
};

/**
 * @type {Query}
 */

BooleanClause.prototype.query;

/**
 * @type {Occur}
 */

BooleanClause.prototype.occur;


/**
 * @const
 * @enum {number}
 */

var Occur = {
	MUST : 1,
	SHOULD : 0,
	MUST_NOT : -1
};


exports.BooleanQuery = BooleanQuery;
exports.Occur = Occur;

/**
 * @constructor
 * @param {Array.<BooleanClause>} [clauses]
 * @param {number} [minimumOptionalMatches]
 * @param {number} [boost]
 */

function BooleanQuery(clauses, minimumOptionalMatches, boost) {
	this.clauses = clauses || [];
	this.minimumOptionalMatches = minimumOptionalMatches || 0;
	this.boost = boost || 1.0;
};

/**
 * @type {Array.<BooleanClause>}
 */

BooleanQuery.prototype.clauses;

/**
 * @type {number}
 */

BooleanQuery.prototype.minimumOptionalMatches = 0;

/**
 * @type {number}
 */

BooleanQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

BooleanQuery.prototype.score = function (similarity, index) {
	return new BooleanScorer(this, similarity, index);
};

/**
 * @return {Array.<TermVectorEntry>}
 */

BooleanQuery.prototype.extractTerms = function () {
	var x, xl, result = [];
	for (x = 0, xl = this.clauses.length; x < xl; ++x) {
		result = result.concat(this.clauses[x].query.extractTerms());
	}
	return result;
};

/**
 * @return {Query}
 */

BooleanQuery.prototype.rewrite = function () {
	var result, x, xl, rewrote = false;
	
	if (this.minimumOptionalMatches === 0 && this.clauses.length === 1 && this.clauses[0].occur !== Occur.MUST_NOT) {
		result = this.clauses[0].query;
		result = result.rewrite();
		result.boost *= this.boost;
	} else {
		result = new BooleanQuery();
		result.boost = this.boost;
		for (x = 0, xl = this.clauses.length; x < xl; ++x) {
			result.clauses[x] = new BooleanClause(this.clauses[x].query.rewrite(), this.clauses[x].occur);
			if (result.clauses[x].query !== this.clauses[x].query) {
				rewrote = true;
			}
		}
		
		if (!rewrote) {
			result = this;
		}
	}
	
	return /** @type {Query} */ (result);
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @implements {ReadableStream}
 * @implements {WritableStream}
 * @param {BooleanQuery} query
 * @param {Similarity} similarity
 * @param {Index} index
 */

function BooleanScorer(query, similarity, index) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
	this._index = index;
	this._inputs = [];
	
	this.addInputs(query.clauses);
};

BooleanScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {BooleanQuery} 
 */

BooleanScorer.prototype._query;

/**
 * @protected
 * @type {Similarity} 
 */

BooleanScorer.prototype._similarity;

/**
 * @protected
 * @type {Index} 
 */

BooleanScorer.prototype._index;

/**
 * @protected
 * @type {Array.<BooleanClauseStream>}
 */

BooleanScorer.prototype._inputs;

/**
 * @protected
 * @type {number}
 */

BooleanScorer.prototype._collectorCount = 0;

/**
 * @protected
 * @type {boolean}
 */

BooleanScorer.prototype._paused = false;

/**
 * @type {boolean}
 */

BooleanScorer.prototype.readable = true;

/**
 * @type {boolean}
 */

BooleanScorer.prototype.writable = true;

/**
 * @param {Array.<BooleanClause>} clauses
 */

BooleanScorer.prototype.addInputs = function (clauses) {
	var self = this, x, xl, clause, collector, bcs, remover;
	for (x = 0, xl = clauses.length; x < xl; ++x) {
		clause = clauses[x];
		collector = new SingleCollector();
		bcs = new BooleanClauseStream(clause.query, clause.occur, collector);
		
		collector.pipe(this, {end : false});
		clause.query.score(this._similarity, this._index).pipe(collector);
		
		this._inputs.push(bcs);
		this._collectorCount++;
		
		remover = (function (b) {
			return function () {
				b.collector.removeListener('end', arguments.callee);
				b.collector.removeListener('close', arguments.callee);
				b.collector = null;
				self._collectorCount--;
				
				if (!self._collectorCount || b.occur === Occur.MUST) {
					self._collectorCount = 0;  //to pass sanity checks
					self.end();
				}
			}
		})(bcs);
		
		collector.on('end', remover);
		collector.on('close', remover);
	}
};

/**
 * @return {boolean}
 */

BooleanScorer.prototype.write = function () {
	var x, xl, docs = [], lowestIndex = 0, lowestID, match = false, optionalMatches = 0, doc;
	
	if (this._paused) {
		return true;  //scorer is paused, proceed no further
	}
	
	//collect all documents, find lowest document ID
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (this._inputs[x].collector) {
			docs[x] = this._inputs[x].collector.data;
			
			if (typeof docs[x] === "undefined") {
				return true;  //not all collectors are full
			}
		} else {
			docs[x] = undefined;
		}
		
		if (x > 0 && (!docs[lowestIndex] || (docs[x] && docs[x].id < docs[lowestIndex].id))) {
			lowestIndex = x;
		}
	}
	
	lowestID = docs[lowestIndex].id;
	doc = new DocumentTerms(lowestID);
	
	//perform boolean logic
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (docs[x] && docs[x].id === lowestID) {
			if (this._inputs[x].occur === Occur.MUST_NOT) {
				match = false;
				break;  //this document has a forbidden term
			} else {  //MUST or SHOULD
				if (this._inputs[x].occur === Occur.SHOULD) {
					optionalMatches++;
				}
				match = true;
				doc.terms = doc.terms.concat(docs[x].terms);
				doc.sumOfSquaredWeights += docs[x].sumOfSquaredWeights;
				doc.score += docs[x].score;
			}
		} else if (this._inputs[x].occur === Occur.MUST) {
			match = false;
			break;  //this document does not have a required term
		}
	}
	
	if (match && optionalMatches >= this._query.minimumOptionalMatches) {
		doc.sumOfSquaredWeights *= this._query.boost;
		this.emit('data', doc);
	}
	
	//remove documents with lowestID
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (docs[x] && docs[x].id === lowestID) {
			this._inputs[x].collector.drain();
		}
	}
	
	return true;
};

/**
 */

BooleanScorer.prototype.end = function () {
	//sanity check
	if (this._collectorCount) {
		throw new Error("BooleanScorer#end called while there are still collectors attached!");
	}
	
	this.emit('end');
	this.destroy();
};

/**
 */

BooleanScorer.prototype.pause = function () {
	this._paused = true;
};

/**
 */

BooleanScorer.prototype.resume = function () {
	this._paused = false;
	this.write();
};

/**
 */

BooleanScorer.prototype.destroy = function () {
	var x, xl;
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (this._inputs[x].collector) {
			this._inputs[x].collector.destroy();
		}
	}
	Stream.prototype.destroy.call(this);
};

/**
 */

BooleanScorer.prototype.destroySoon = BooleanScorer.prototype.destroy;


/**
 * @protected
 * @constructor
 * @param {Query} query
 * @param {Occur} occur
 * @param {WritableStream} collector
 */

function BooleanClauseStream(query, occur, collector) {
	//BooleanClause.call(this, query, occur);
	this.query = query;
	this.occur = occur;
	this.collector = collector;
};

BooleanClauseStream.prototype = Object.create(BooleanClause.prototype);

/**
 * @type {WritableStream}
 */

BooleanClauseStream.prototype.collector;


exports.BooleanQuery = BooleanQuery;

/**
 * @constructor
 * @implements Similarity
 */

var DefaultSimilarity = function () {};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.norm = function (termVec) {
	return termVec.documentBoost * termVec.fieldBoost * (1.0 / Math.sqrt(termVec.totalFieldTokens));
};

/**
 * @param {DocumentTerms} doc
 * @return {number}
 */

DefaultSimilarity.prototype.queryNorm = function (doc) {
	return 1.0 / Math.sqrt(doc.sumOfSquaredWeights);
};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.tf = function (termVec) {
	return Math.sqrt(termVec.termFrequency);
};

/**
 * @param {number} distance
 * @return {number}
 */

DefaultSimilarity.prototype.sloppyFreq = function (distance) {
	return 1.0 / (distance + 1);
};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.idf = function (termVec) {
	return Math.log(termVec.totalDocuments / (termVec.documentFrequency + 1)) + 1.0;
};

/**
 * @param {number} overlap
 * @param {number} maxOverlap
 * @return {number}
 */

DefaultSimilarity.prototype.coord = function (overlap, maxOverlap) {
	return overlap / maxOverlap;
};


exports.DefaultSimilarity = DefaultSimilarity;

/**
 * @constructor
 * @param {DocumentID} id
 * @param {Array.<TermVector>} [terms]
 */

function DocumentTerms(id, terms) {
	this.id = id;
	this.terms = terms || [];
}

/**
 * @type {DocumentID}
 */

DocumentTerms.prototype.id;

/**
 * @type {Array.<TermVector>}
 */

DocumentTerms.prototype.terms = [];

/**
 * @type {number}
 */

DocumentTerms.prototype.sumOfSquaredWeights = 0;

/**
 * @type {number}
 */

DocumentTerms.prototype.score = 0;


exports.DocumentTerms = DocumentTerms;

/**
 * Used only by Searcher. Do not include this in your queries.
 * 
 * @constructor
 * @implements {Query}
 * @param {Query} query
 */

function NormalizedQuery(query) {
	this.query = query;
};

/**
 * @type {Query}
 */

NormalizedQuery.prototype.query;

/**
 * @type {number}
 */

NormalizedQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

NormalizedQuery.prototype.score = function (similarity, index) {
	var scorer = new NormalizedScorer(this, similarity);
	this.query.score(similarity, index).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVectorEntry>}
 */

NormalizedQuery.prototype.extractTerms = function () {
	return this.query.extractTerms();
};

/**
 * @return {Query}
 */

NormalizedQuery.prototype.rewrite = function () {
	var oldQuery;
	do {
		oldQuery = this.query;
		this.query = this.query.rewrite();
	} while (this.query !== oldQuery);
	return this;
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @implements {ReadableStream}
 * @implements {WritableStream}
 * @param {NormalizedQuery} query
 * @param {Similarity} similarity
 */

function NormalizedScorer(query, similarity) {
	Stream.call(this);
	this._similarity = similarity;
	this._maxOverlap = query.extractTerms().length;
}

NormalizedScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {Similarity}
 */

NormalizedScorer.prototype._similarity;

/**
 * @protected
 * @type {number}
 */

NormalizedScorer.prototype._maxOverlap;

NormalizedScorer.prototype.readable = true;

NormalizedScorer.prototype.writable = true;

/**
 * @param {DocumentTerms} doc
 */

NormalizedScorer.prototype.write = function (doc) {
	doc.score *= this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, this._maxOverlap);
	this.emit('data', doc);
};

/**
 * @param {DocumentTerms} [doc]
 */

NormalizedScorer.prototype.end = function (doc) {
	if (typeof doc !== "undefined") {
		this.write(doc);
	}
	this.emit('end');
	this.destroy();
};


exports.NormalizedQuery = NormalizedQuery;

/**
 * @constructor
 */

function QueryParser() {}

/**
 * Provided by the automatically generated QueryParserImpl.js
 * @type {Object}
 */

QueryParser.impl;

/**
 * @param {string} str
 * @param {string|null} [defaultField]
 * @return {Query}
 */

QueryParser.parse = function (str, defaultField) {
	var query, oldQuery;
	
	//extract query from query string
	query = QueryParser.impl.parse(str, undefined, defaultField || null);
	
	//optimize query
	do {
		oldQuery = query;
		query = query.rewrite();
	} while (query !== oldQuery);
	
	return query;
};

QueryParser.impl = (function(){
  /* Generated by PEG.js 0.6.1 (http://pegjs.majda.cz/). */
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "BooleanClause": parse_BooleanClause,
        "BooleanQuery": parse_BooleanQuery,
        "Boost": parse_Boost,
        "ESCAPED_CHAR": parse_ESCAPED_CHAR,
        "Number": parse_Number,
        "Query": parse_Query,
        "SKIP": parse_SKIP,
        "SubQuery": parse_SubQuery,
        "TERM_CHAR": parse_TERM_CHAR,
        "TERM_START_CHAR": parse_TERM_START_CHAR,
        "Term": parse_Term,
        "TermQuery": parse_TermQuery,
        "WHITESPACE": parse_WHITESPACE
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "Query";
      }
      
      var pos = 0;
      var reportMatchFailures = true;
      var rightmostMatchFailuresPos = 0;
      var rightmostMatchFailuresExpected = [];
      var cache = {};
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        
        if (charCode <= 0xFF) {
          var escapeChar = 'x';
          var length = 2;
        } else {
          var escapeChar = 'u';
          var length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function quote(s) {
        /*
         * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
         * string literal except for the closing quote character, backslash,
         * carriage return, line separator, paragraph separator, and line feed.
         * Any character may appear in the form of an escape sequence.
         */
        return '"' + s
          .replace(/\\/g, '\\\\')            // backslash
          .replace(/"/g, '\\"')              // closing quote character
          .replace(/\r/g, '\\r')             // carriage return
          .replace(/\n/g, '\\n')             // line feed
          .replace(/[\x80-\uFFFF]/g, escape) // non-ASCII characters
          + '"';
      }
      
      function matchFailed(failure) {
        if (pos < rightmostMatchFailuresPos) {
          return;
        }
        
        if (pos > rightmostMatchFailuresPos) {
          rightmostMatchFailuresPos = pos;
          rightmostMatchFailuresExpected = [];
        }
        
        rightmostMatchFailuresExpected.push(failure);
      }
      
      function parse_WHITESPACE() {
        var cacheKey = 'WHITESPACE@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        var savedReportMatchFailures = reportMatchFailures;
        reportMatchFailures = false;
        if (input.substr(pos).match(/^[ 	\n\r\u3000]/) !== null) {
          var result0 = input.charAt(pos);
          pos++;
        } else {
          var result0 = null;
          if (reportMatchFailures) {
            matchFailed("[ 	\\n\\r\\u3000]");
          }
        }
        reportMatchFailures = savedReportMatchFailures;
        if (reportMatchFailures && result0 === null) {
          matchFailed("whitespace");
        }
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_SKIP() {
        var cacheKey = 'SKIP@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var result0 = [];
        var result1 = parse_WHITESPACE();
        while (result1 !== null) {
          result0.push(result1);
          var result1 = parse_WHITESPACE();
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_Number() {
        var cacheKey = 'Number@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        var savedReportMatchFailures = reportMatchFailures;
        reportMatchFailures = false;
        var savedPos0 = pos;
        if (input.substr(pos).match(/^[0-9]/) !== null) {
          var result8 = input.charAt(pos);
          pos++;
        } else {
          var result8 = null;
          if (reportMatchFailures) {
            matchFailed("[0-9]");
          }
        }
        if (result8 !== null) {
          var result2 = [];
          while (result8 !== null) {
            result2.push(result8);
            if (input.substr(pos).match(/^[0-9]/) !== null) {
              var result8 = input.charAt(pos);
              pos++;
            } else {
              var result8 = null;
              if (reportMatchFailures) {
                matchFailed("[0-9]");
              }
            }
          }
        } else {
          var result2 = null;
        }
        if (result2 !== null) {
          var savedPos1 = pos;
          if (input.substr(pos, 1) === ".") {
            var result5 = ".";
            pos += 1;
          } else {
            var result5 = null;
            if (reportMatchFailures) {
              matchFailed("\".\"");
            }
          }
          if (result5 !== null) {
            if (input.substr(pos).match(/^[0-9]/) !== null) {
              var result7 = input.charAt(pos);
              pos++;
            } else {
              var result7 = null;
              if (reportMatchFailures) {
                matchFailed("[0-9]");
              }
            }
            if (result7 !== null) {
              var result6 = [];
              while (result7 !== null) {
                result6.push(result7);
                if (input.substr(pos).match(/^[0-9]/) !== null) {
                  var result7 = input.charAt(pos);
                  pos++;
                } else {
                  var result7 = null;
                  if (reportMatchFailures) {
                    matchFailed("[0-9]");
                  }
                }
              }
            } else {
              var result6 = null;
            }
            if (result6 !== null) {
              var result4 = [result5, result6];
            } else {
              var result4 = null;
              pos = savedPos1;
            }
          } else {
            var result4 = null;
            pos = savedPos1;
          }
          var result3 = result4 !== null ? result4 : '';
          if (result3 !== null) {
            var result1 = [result2, result3];
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(num, fract) {
            return parseFloat(num.concat(fract[0], fract[1]).join(""));
          })(result1[0], result1[1])
          : null;
        reportMatchFailures = savedReportMatchFailures;
        if (reportMatchFailures && result0 === null) {
          matchFailed("number");
        }
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_ESCAPED_CHAR() {
        var cacheKey = 'ESCAPED_CHAR@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        if (input.substr(pos, 1) === "\\") {
          var result1 = "\\";
          pos += 1;
        } else {
          var result1 = null;
          if (reportMatchFailures) {
            matchFailed("\"\\\\\"");
          }
        }
        if (result1 !== null) {
          if (input.length > pos) {
            var result2 = input.charAt(pos);
            pos++;
          } else {
            var result2 = null;
            if (reportMatchFailures) {
              matchFailed('any character');
            }
          }
          if (result2 !== null) {
            var result0 = [result1, result2];
          } else {
            var result0 = null;
            pos = savedPos0;
          }
        } else {
          var result0 = null;
          pos = savedPos0;
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_TERM_START_CHAR() {
        var cacheKey = 'TERM_START_CHAR@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        if (input.substr(pos).match(/^[^ 	\n\r\u3000+\-!():^[\]"{}~*?\\]/) !== null) {
          var result0 = input.charAt(pos);
          pos++;
        } else {
          var result0 = null;
          if (reportMatchFailures) {
            matchFailed("[^ 	\\n\\r\\u3000+\\-!():^[\\]\"{}~*?\\\\]");
          }
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_TERM_CHAR() {
        var cacheKey = 'TERM_CHAR@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var result4 = parse_TERM_START_CHAR();
        if (result4 !== null) {
          var result0 = result4;
        } else {
          var result3 = parse_ESCAPED_CHAR();
          if (result3 !== null) {
            var result0 = result3;
          } else {
            if (input.substr(pos, 1) === "-") {
              var result2 = "-";
              pos += 1;
            } else {
              var result2 = null;
              if (reportMatchFailures) {
                matchFailed("\"-\"");
              }
            }
            if (result2 !== null) {
              var result0 = result2;
            } else {
              if (input.substr(pos, 1) === "+") {
                var result1 = "+";
                pos += 1;
              } else {
                var result1 = null;
                if (reportMatchFailures) {
                  matchFailed("\"+\"");
                }
              }
              if (result1 !== null) {
                var result0 = result1;
              } else {
                var result0 = null;;
              };
            };
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_Term() {
        var cacheKey = 'Term@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        var savedReportMatchFailures = reportMatchFailures;
        reportMatchFailures = false;
        var savedPos0 = pos;
        var result2 = parse_TERM_START_CHAR();
        if (result2 !== null) {
          var result3 = [];
          var result4 = parse_TERM_CHAR();
          while (result4 !== null) {
            result3.push(result4);
            var result4 = parse_TERM_CHAR();
          }
          if (result3 !== null) {
            var result1 = [result2, result3];
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(start, rest) {
            return [ start ].concat(rest).join("");
          })(result1[0], result1[1])
          : null;
        reportMatchFailures = savedReportMatchFailures;
        if (reportMatchFailures && result0 === null) {
          matchFailed("term");
        }
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_Boost() {
        var cacheKey = 'Boost@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        var savedReportMatchFailures = reportMatchFailures;
        reportMatchFailures = false;
        var savedPos0 = pos;
        if (input.substr(pos, 1) === "^") {
          var result3 = "^";
          pos += 1;
        } else {
          var result3 = null;
          if (reportMatchFailures) {
            matchFailed("\"^\"");
          }
        }
        if (result3 !== null) {
          var result4 = parse_Number();
          if (result4 !== null) {
            var result2 = [result3, result4];
          } else {
            var result2 = null;
            pos = savedPos0;
          }
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        var result1 = result2 !== null ? result2 : '';
        var result0 = result1 !== null
          ? (function(boost) {
            if (boost) {
              boost = boost[1];
            }
            return (typeof boost === "number" ? boost : 1.0);
          })(result1)
          : null;
        reportMatchFailures = savedReportMatchFailures;
        if (reportMatchFailures && result0 === null) {
          matchFailed("boost");
        }
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_TermQuery() {
        var cacheKey = 'TermQuery@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result6 = parse_Term();
        if (result6 !== null) {
          if (input.substr(pos, 1) === ":") {
            var result7 = ":";
            pos += 1;
          } else {
            var result7 = null;
            if (reportMatchFailures) {
              matchFailed("\":\"");
            }
          }
          if (result7 !== null) {
            var result5 = [result6, result7];
          } else {
            var result5 = null;
            pos = savedPos1;
          }
        } else {
          var result5 = null;
          pos = savedPos1;
        }
        var result2 = result5 !== null ? result5 : '';
        if (result2 !== null) {
          var result3 = parse_Term();
          if (result3 !== null) {
            var result4 = parse_Boost();
            if (result4 !== null) {
              var result1 = [result2, result3, result4];
            } else {
              var result1 = null;
              pos = savedPos0;
            }
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(field, term, boost) {
            return new TermQuery(term, field ? field[0] : defaultField, boost);
          })(result1[0], result1[1], result1[2])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_BooleanClause() {
        var cacheKey = 'BooleanClause@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        if (input.substr(pos, 1) === "+") {
          var result8 = "+";
          pos += 1;
        } else {
          var result8 = null;
          if (reportMatchFailures) {
            matchFailed("\"+\"");
          }
        }
        if (result8 !== null) {
          var result6 = result8;
        } else {
          if (input.substr(pos, 1) === "-") {
            var result7 = "-";
            pos += 1;
          } else {
            var result7 = null;
            if (reportMatchFailures) {
              matchFailed("\"-\"");
            }
          }
          if (result7 !== null) {
            var result6 = result7;
          } else {
            var result6 = null;;
          };
        }
        var result2 = result6 !== null ? result6 : '';
        if (result2 !== null) {
          var result5 = parse_SubQuery();
          if (result5 !== null) {
            var result3 = result5;
          } else {
            var result4 = parse_TermQuery();
            if (result4 !== null) {
              var result3 = result4;
            } else {
              var result3 = null;;
            };
          }
          if (result3 !== null) {
            var result1 = [result2, result3];
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(occur, query) {
            if (occur === "+") {
              occur = Occur.MUST;
            } else if (occur === "-") {
              occur = Occur.MUST_NOT;
            } else {
              occur = Occur.SHOULD;
            }
            
            return new BooleanClause(query, occur);
          })(result1[0], result1[1])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_BooleanQuery() {
        var cacheKey = 'BooleanQuery@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var result2 = parse_BooleanClause();
        if (result2 !== null) {
          var result3 = [];
          var savedPos1 = pos;
          var result5 = parse_SKIP();
          if (result5 !== null) {
            var result6 = parse_BooleanClause();
            if (result6 !== null) {
              var result4 = [result5, result6];
            } else {
              var result4 = null;
              pos = savedPos1;
            }
          } else {
            var result4 = null;
            pos = savedPos1;
          }
          while (result4 !== null) {
            result3.push(result4);
            var savedPos1 = pos;
            var result5 = parse_SKIP();
            if (result5 !== null) {
              var result6 = parse_BooleanClause();
              if (result6 !== null) {
                var result4 = [result5, result6];
              } else {
                var result4 = null;
                pos = savedPos1;
              }
            } else {
              var result4 = null;
              pos = savedPos1;
            }
          }
          if (result3 !== null) {
            var result1 = [result2, result3];
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(clause, otherClauses) {
            var result = [ clause ];
            if (otherClauses) {
              for (var x = 0, xl = otherClauses.length; x < xl; ++x) {
                result[result.length] = otherClauses[x][1];
              }
            }
            return new BooleanQuery(result);
          })(result1[0], result1[1])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_SubQuery() {
        var cacheKey = 'SubQuery@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        if (input.substr(pos, 1) === "(") {
          var result2 = "(";
          pos += 1;
        } else {
          var result2 = null;
          if (reportMatchFailures) {
            matchFailed("\"(\"");
          }
        }
        if (result2 !== null) {
          var result3 = parse_Query();
          if (result3 !== null) {
            if (input.substr(pos, 1) === ")") {
              var result4 = ")";
              pos += 1;
            } else {
              var result4 = null;
              if (reportMatchFailures) {
                matchFailed("\")\"");
              }
            }
            if (result4 !== null) {
              var result5 = parse_Boost();
              if (result5 !== null) {
                var result1 = [result2, result3, result4, result5];
              } else {
                var result1 = null;
                pos = savedPos0;
              }
            } else {
              var result1 = null;
              pos = savedPos0;
            }
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(sub, boost) {
            sub.boost = boost;
            return sub;
          })(result1[1], result1[3])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_Query() {
        var cacheKey = 'Query@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var result2 = parse_SKIP();
        if (result2 !== null) {
          var result3 = parse_BooleanQuery();
          if (result3 !== null) {
            var result4 = parse_SKIP();
            if (result4 !== null) {
              var result1 = [result2, result3, result4];
            } else {
              var result1 = null;
              pos = savedPos0;
            }
          } else {
            var result1 = null;
            pos = savedPos0;
          }
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(query) {
            return query;
          })(result1[1])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function buildErrorMessage() {
        function buildExpected(failuresExpected) {
          failuresExpected.sort();
          
          var lastFailure = null;
          var failuresExpectedUnique = [];
          for (var i = 0; i < failuresExpected.length; i++) {
            if (failuresExpected[i] !== lastFailure) {
              failuresExpectedUnique.push(failuresExpected[i]);
              lastFailure = failuresExpected[i];
            }
          }
          
          switch (failuresExpectedUnique.length) {
            case 0:
              return 'end of input';
            case 1:
              return failuresExpectedUnique[0];
            default:
              return failuresExpectedUnique.slice(0, failuresExpectedUnique.length - 1).join(', ')
                + ' or '
                + failuresExpectedUnique[failuresExpectedUnique.length - 1];
          }
        }
        
        var expected = buildExpected(rightmostMatchFailuresExpected);
        var actualPos = Math.max(pos, rightmostMatchFailuresPos);
        var actual = actualPos < input.length
          ? quote(input.charAt(actualPos))
          : 'end of input';
        
        return 'Expected ' + expected + ' but ' + actual + ' found.';
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i <  rightmostMatchFailuresPos; i++) {
          var ch = input.charAt(i);
          if (ch === '\n') {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === '\r' | ch === '\u2028' || ch === '\u2029') {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
      
    var defaultField = arguments[2] || null;
      
  
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostMatchFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostMatchFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostMatchFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var errorPosition = computeErrorPosition();
        throw new this.SyntaxError(
          buildErrorMessage(),
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return typeof this._source === 'string' ? this._source : this.toString(); }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(message, line, column) {
    this.name = 'SyntaxError';
    this.message = message;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})()

/**
 * @constructor
 * @param {Index} index
 */

function Searcher(index) {
	this._index = index;
};

/**
 * @protected
 * @type {Index}
 */

Searcher.prototype._index;

/**
 * @type {Similarity}
 */

Searcher.prototype.similarity = new DefaultSimilarity();

/**
 * @param {Query} query
 * @param {number} max
 * @param {function(PossibleError, Array.<DocumentTerms>=)} callback
 */

Searcher.prototype.search = function (query, max, callback) {
	var collector = new TopDocumentsCollector(max, callback);
	var normQuery = new NormalizedQuery(query);
	normQuery.score(this.similarity, this._index).pipe(collector);
};


exports.Searcher = Searcher;

/**
 * @constructor
 * @implements Query
 * @param {string} term
 * @param {string|null} [field]
 * @param {number} [boost]
 */

function TermQuery(term, field, boost) {
	this.term = term;
	this.field = field || null;
	this.boost = boost || 1.0;
};

/**
 * @type {string}
 */

TermQuery.prototype.term;

/**
 * @type {string|null}
 */

TermQuery.prototype.field = null;

/**
 * @type {number}
 */

TermQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

TermQuery.prototype.score = function (similarity, index) {
	var scorer = new TermScorer(this, similarity);
	index.getTermVectors(this.term, this.field).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVectorEntry>}
 */

TermQuery.prototype.extractTerms = function () {
	return [ /** @type {TermVectorEntry} */ ({
		term : this.term,
		field : this.field
	})];
};

/**
 * @return {Query}
 */

TermQuery.prototype.rewrite = function () {
	return this;  //can not be optimized
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @implements {ReadableStream}
 * @implements {WritableStream}
 * @param {TermQuery} query
 * @param {Similarity} similarity
 */

function TermScorer(query, similarity) {
	Stream.call(this);
	this._boost = query.boost;
	this._similarity = similarity;
}

TermScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {number}
 */

TermScorer.prototype._boost;

/**
 * @protected
 * @type {Similarity}
 */

TermScorer.prototype._similarity;

TermScorer.prototype.readable = true;

TermScorer.prototype.writable = true;

/**
 * @param {TermVector} termVec
 */

TermScorer.prototype.write = function (termVec) {
	var similarity = this._similarity,
		doc = new DocumentTerms(termVec.documentID, [termVec]),
		idf = similarity.idf(termVec);
	
	//compute sumOfSquaredWeights
	doc.sumOfSquaredWeights = (idf * this._boost) * (idf * this._boost);
	
	//compute score
	doc.score = similarity.tf(termVec) * 
		idf * idf *
		this._boost * 
		similarity.norm(termVec);
	
	this.emit('data', doc);
};

/**
 * @param {TermVector} [termVec]
 */

TermScorer.prototype.end = function (termVec) {
	if (typeof termVec !== "undefined") {
		this.write(termVec);
	}
	this.emit('end');
	this.destroy();
};


exports.TermQuery = TermQuery;

/**
 * @constructor
 * @extends {Collector}
 * @param {number} max
 * @param {function(PossibleError, Array.<DocumentTerms>=)} callback
 */

function TopDocumentsCollector(max, callback) {
	Collector.call(this, callback);
	this.max = max || 1;
};

/**
 * @param {DocumentTerms} a
 * @param {DocumentTerms} b
 * @return {number}
 */

TopDocumentsCollector.compareScores = function (a, b) {
	return b.score - a.score;
};

TopDocumentsCollector.prototype = Object.create(Collector.prototype);

/**
 * @type {Array.<DocumentTerms>}
 * @override
 */

TopDocumentsCollector.prototype.collection;

/**
 * @type {number}
 */

TopDocumentsCollector.prototype.max;

/**
 * @type {number}
 */

TopDocumentsCollector.prototype.lowestScore = 0;

/**
 * @param {DocumentTerms} doc
 * @override
 */

TopDocumentsCollector.prototype.write = function (doc) {
	if (this.collection.length < this.max || doc.score > this.lowestScore) {
		if (this.collection.length >= this.max) {
			this.collection.pop();  //remove lowest scored document
		}
		Array.orderedInsert(this.collection, doc, TopDocumentsCollector.compareScores);
		this.lowestScore = this.collection[this.collection.length - 1].score;
	}
};


exports.TopDocumentsCollector = TopDocumentsCollector;