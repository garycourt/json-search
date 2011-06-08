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
			
			while (start < end) {
				if (comparator(arr[pivot], obj) <= 0) {
					start = pivot + 1;
				} else {
					end = pivot - 1;
				}
				pivot = Math.round(start + ((end - start) / 2));
			}
			
			if (start === end) {
				if (comparator(arr[start], obj) <= 0) {
					arr.splice(start + 1, 0, obj);
				} else {
					arr.splice(start, 0, obj);
				}
			} else {
				arr.splice(end + 1, 0, obj);
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
 * @constructor
 */

function Stream() {}

/**
 * @private
 * @type {Stream}
 */

Stream.prototype._streamInput = null;

/**
 * @private
 * @type {Stream}
 */

Stream.prototype._streamOutput = null;

/**
 * @private
 * @type {Array.<Array.<*>>}
 */

Stream.prototype._streamBuffer = null;

/**
 * @private
 * @type {boolean}
 */

Stream.prototype._streamPaused = false;

/**
 * @private
 * @type {boolean}
 */

Stream.prototype._streamEnded = false;

/**
 * @private
 * @type {Error|string|null}
 */

Stream.prototype._streamError = null;

/**
 * @private
 * @type {boolean}
 */

Stream.prototype._streamDraining = false;

/**
 * @private
 */

Stream.prototype._streamDrain = function () {
	var pointer, subpointer, sublength;
	if (this._streamBuffer && !this._streamPaused && !this._streamDraining) {
		this._streamDraining = true;
		
		try {
			for (pointer = 0; !this._streamPaused && pointer < this._streamBuffer.length; ++pointer) {
				if (this._streamBuffer[pointer].length > 1) {
					if (this.onBulkWrite !== Stream.prototype.onBulkWrite) {
						this.onBulkWrite(this._streamBuffer[pointer]);
					} else {
						for (subpointer = 0, sublength = this._streamBuffer[pointer].length; !this._streamPaused && subpointer < sublength; ++subpointer) {
							this.onWrite(this._streamBuffer[pointer][subpointer]);
						}
						if (subpointer < sublength) {
							this._streamBuffer[pointer] = this._streamBuffer[pointer].slice(subpointer);
							break;  //stop executing, don't increment pointer
						}
					}
				} else if (this._streamBuffer[pointer].length === 1) {
					this.onWrite(this._streamBuffer[pointer][0]);
				}
			}
		} catch(e) {
			this.error(e);
			pointer = this._streamBuffer.length;
		}
		
		if (!this._streamPaused && pointer >= this._streamBuffer.length) {
			this._streamBuffer = null;
			if (this._streamEnded) {
				try {
					if (this._streamError) {
						this.onError(this._streamError);
					} else {
						this.onEnd();
					}
				} catch(e) {}  //ignore any errors
			}
		} else {
			this._streamBuffer = this._streamBuffer.slice(pointer);
		}
		
		this._streamDraining = false;
	}
};

/**
 * @param {Stream} output
 */

Stream.prototype.pipe = function (output) {
	if (this._streamOutput) {
		throw new Error("Stream already has an output");
	}
	if (output._streamInput) {
		throw new Error("Output stream already has an input");
	}
	
	this._streamOutput = output;
	output._streamInput = this;
	output._streamEnded = false;
	output._streamError = null;
	
	output.onStart(this);
};

/**
 * @param {*} entry
 */

Stream.prototype.write = function (entry) {
	if (!this._streamPaused) {
		this.onWrite(entry);
	} else {
		if (!this._streamBuffer) {
			this._streamBuffer = [];
		}
		this._streamBuffer[this._streamBuffer.length] = [ entry ];
	}
};

/**
 * @param {*} entry
 */

Stream.prototype.emit = function (entry) {
	if (this._streamOutput) {
		this._streamOutput.write(entry);
	}
};

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.bulkWrite = function (entries) {
	if (!this._streamPaused) {
		this.onBulkWrite(entries);
	} else {
		if (!this._streamBuffer) {
			this._streamBuffer = [];
		}
		this._streamBuffer[this._streamBuffer.length] = entries;
	}
};

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.emitBulk = function (entries) {
	if (this._streamOutput) {
		this._streamOutput.bulkWrite(entries);
	}
};

/**
 * @return {boolean}
 */

Stream.prototype.isPaused = function () {
	return this._streamPaused;
};

/**
 */

Stream.prototype.pause = function () {
	if (!this._streamPaused) {
		this._streamPaused = true;
		if (this.onPause) {
			this.onPause();
		}
		if (this._streamInput) {
			this._streamInput.pause();
		}
	}
};

/**
 */

Stream.prototype.resume = function () {
	var self = this;
	if (this._streamPaused) {
		this._streamPaused = false;
		if (this.onResume) {
			this.onResume();
		}
		if (this._streamBuffer) {
			setTimeout(function () {
				self._streamDrain();
			}, 0);
		}
		if (this._streamInput) {
			this._streamInput.resume();
		}
	}
};

/**
 */

Stream.prototype.end = function () {
	if (!this._streamEnded) {
		this._streamEnded = true;
		
		if (!this._streamPaused && !this._streamBuffer) {
			this.onEnd();
		} else {
			if (!this._streamBuffer) {
				this._streamBuffer = [];
			}
		}
	}
};

/**
 */

Stream.prototype.emitEnd = function () {
	this._streamEnded = true;
	if (this._streamOutput) {
		this._streamOutput.end();
		this._streamOutput._streamInput = null;
		this._streamOutput = null;
	}
};

/**
 * @param {Error|string} error
 */

Stream.prototype.error = function (error) {
	if (!this._streamEnded) {
		this._streamEnded = true;
		this._streamError = error;
		
		if (!this._streamPaused && !this._streamBuffer) {
			this.onError(error);
		} else {
			if (!this._streamBuffer) {
				this._streamBuffer = [];
			}
		}
	}
};

/**
 * @param {Error|string} error
 */

Stream.prototype.emitError = function (error) {
	this._streamEnded = true;
	this._streamError = error;
	if (this._streamOutput) {
		this._streamOutput.error(error);
		this._streamOutput._streamInput = null;
		this._streamOutput = null;
	}
};

/**
 * @param {Stream} input
 */

Stream.prototype.onStart = function (input) {};

/**
 * @param {*} entry
 */

Stream.prototype.onWrite = Stream.prototype.emit;

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.onBulkWrite = function (entries) {
	if (this.onWrite !== Stream.prototype.onWrite) {
		if (!this._streamBuffer) {
			this._streamBuffer = [];
		}
		this._streamBuffer[this._streamBuffer.length] = entries;
		
		this._streamDrain();
	} else {
		this.emitBulk(entries);
	}
};

/**
 * @type {function()|undefined}
 */

Stream.prototype.onPause;

/**
 * @type {function()|undefined}
 */

Stream.prototype.onResume;

/**
 */

Stream.prototype.onEnd = Stream.prototype.emitEnd;

/**
 * @param {Error|string} error
 */

Stream.prototype.onError = Stream.prototype.emitError;


exports.Stream = Stream;

/**
 * @constructor
 * @extends {Stream}
 * @param {function(PossibleError, Array.<*>=)} [callback]
 */

function Collector(callback) {
	var self = this;
	Stream.call(this);
	this.collection = [];
	this.callback = callback || null;
};

Collector.prototype = Object.create(Stream.prototype);

/**
 * @type {Array.<*>}
 */

Collector.prototype.collection;

/**
 * @type {function(PossibleError, Array=)|null}
 */

Collector.prototype.callback = null;

/**
 * @param {*} entry
 */

Collector.prototype.onWrite = function (entry) {
	this.collection.push(entry);
};

/**
 * @param {Array.<*>} entries
 */

Collector.prototype.onBulkWrite = function (entries) {
	this.collection = this.collection.concat(entries);
};

/**
 */

Collector.prototype.onEnd = function () {
	if (this.callback) {
		this.callback(null, this.collection);
		this.callback = null;
	}
};

/**
 * @param {Error} err
 */

Collector.prototype.onError = function (err) {
	if (this.callback) {
		this.callback(err);
		this.callback = null;
	}
};


exports.Collector = Collector;

/**
 * @typedef {Array.<(string|number), ScapegoatTreeNode, ScapegoatTreeNode>}
 */

var ScapegoatTreeNode;

/**
 * @constructor
 * @param {number} [alpha]
 */

function ScapegoatTree(alpha) {
	this.a = (alpha && alpha >= 0.5 && alpha < 1 ? alpha : 0.5);
	this.lna = Math.log(1 / this.a);
	this.root = null;
	this.size = 0;
}

/**
 * @type {number}
 */

ScapegoatTree.prototype.a;

/**
 * @type {number}
 */

ScapegoatTree.prototype.lna;

/**
 * @type {ScapegoatTreeNode}
 */

ScapegoatTree.prototype.root;

/**
 * @type {number}
 */

ScapegoatTree.prototype.size;

/**
 * @private
 * @param {ScapegoatTreeNode} node
 * @return {number}
 */

function Scapegoat_size(node) {
	return node === null ? 0 : Scapegoat_size(node[1]) + Scapegoat_size(node[2]) + 1;
}

/**
 * @private
 * @param {ScapegoatTreeNode} node
 * @return {Array.<string|number>}
 */

function Scapegoat_toArray(node) {
	if (node === null) {
		return [];
	}
	//else
	return Scapegoat_toArray(node[1]).concat([ node[0] ], Scapegoat_toArray(node[2]));
}

/**
 * @private
 * @param {Array.<(string|number)>} arr
 * @return {ScapegoatTreeNode}
 */

function Scapegoat_toTree(arr) {
	var mid;
	if (arr.length === 0) {
		return null;
	}
	if (arr.length === 1) {
		return [arr[0], null, null];
	}
	mid = Math.floor(arr.length / 2);
	return [arr[mid], Scapegoat_toTree(arr.slice(0, mid)), Scapegoat_toTree(arr.slice(mid + 1))];
}

/**
 * @param {string|number} key
 */

ScapegoatTree.prototype.insert = function (key) {
	var maxHeight, stack, node, parent, nodeSize, brotherSize, parentSize, balance;
	
	if (this.root !== null) {
		this.size++;
		maxHeight = (Math.log(this.size) / this.lna) + 1;
		stack = [ this.root ];
		node = this.root;
		
		while (true) {
			if (node[0] > key) {
				if (node[1] !== null) {
					node = node[1];
				} else {
					node = node[1] = [key, null, null];
					break;
				}
			} else {
				if (node[2] !== null) {
					node = node[2];
				} else {
					node = node[2] = [key, null, null];
					break;
				}
			}
			stack[stack.length] = node;
		}
		
		if (stack.length + 1 > maxHeight) {  //rebalance tree
			parent = node;
			parentSize = 1;
			while (stack.length) {
				node = parent;
				nodeSize = parentSize;
				parent = stack.pop();
				if (parent[1] === node) {
					brotherSize = Scapegoat_size(parent[2]);
				} else {
					brotherSize = Scapegoat_size(parent[1]);
				}
				parentSize = nodeSize + brotherSize + 1;
				balance = parentSize * this.a;
				
				if (nodeSize > balance || brotherSize > balance) {  //found scapegoat
					node = Scapegoat_toTree(Scapegoat_toArray(parent));  //rebalance node
					if (stack.length === 0) {
						this.root = node;
					} else if (stack[stack.length - 1][1] === parent) {
						stack[stack.length - 1][1] = node;
					} else {
						stack[stack.length - 1][2] = node;
					}
					break;  //tree is balanced
				}
			}
		}
	} else {
		this.root = [key, null, null];
		this.size = 1;
	}
};

/**
 * @param {Array.<string|number>} keys
 */

ScapegoatTree.prototype.insertAll = function (keys) {
	var x, xl;
	for (x = 0, xl = keys.length; x < xl; ++x) {
		this.insert(keys[x]);
	}
};

/**
 * @param {string|number} startKey
 * @param {string|number} endKey
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {Array.<string|number>}
 */

ScapegoatTree.prototype.range = function (startKey, endKey, excludeStart, excludeEnd) {
	var stack = [],
		node = this.root,
		result = [];
	
	while (node !== null && node[0] !== startKey) {
		if (node[0] >= startKey) {
			stack[stack.length] = node;
			node = node[1];
		} else {
			node = node[2];
		}
	}
	
	if (node !== null && (!excludeStart || node[0] !== startKey)) {
		result[result.length] = node[0];
	}
	
	while (stack.length) {
		node = stack.pop();
		
		if (node[0] >= endKey) {
			if (!excludeEnd && node[0] === endKey) {
				result[result.length] = node[0];
			}
			break;
		}
		
		result[result.length] = node[0];
		node = node[2];
		
		while (node !== null) {
			stack[stack.length] = node;
			node = node[1];
		}
	}
	
	return result;
};

/**
 * @return {Array.<string|number>}
 */

ScapegoatTree.prototype.toArray = function () {
	return Scapegoat_toArray(this.root);
};


exports.ScapegoatTree = ScapegoatTree;

/**
 * @constructor
 * @extends {Stream}
 * @param {function(PossibleError, *=)} listener
 */

function SingleCollector(listener) {
	Stream.call(this);
	this.listener = listener;
};

SingleCollector.prototype = Object.create(Stream.prototype);

/**
 * @type {function(PossibleError, *=)|null}
 */

SingleCollector.prototype.listener;

/**
 * @type {*}
 */

SingleCollector.prototype.data;

/**
 * @param {*} data
 */

SingleCollector.prototype.onWrite = function (data) {
	if (typeof this.data !== "undefined") {
		throw new Error("Stream is full");
	}
	
	this.data = data;
	if (this.listener) {
		this.listener(null, data);
	}
	if (typeof this.data !== "undefined") {
		this.pause();
	}
};

/**
 */

SingleCollector.prototype.drain = function () {
	this.data = undefined;
	this.resume();
};

/**
 */

SingleCollector.prototype.onEnd = function () {
	if (this.listener) {
		this.listener(true);
		this.listener = null;
	}
	this.emitEnd();
};

/**
 * @param {Error} err
 */

SingleCollector.prototype.onError = function (err) {
	if (this.listener) {
		this.listener(err);
		this.listener = null;
	}
	this.emitError(err);
};


exports.SingleCollector = SingleCollector;

/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 * @param {function(Token): boolean} [filterer]
 * @param {function(Token): Token} [mapper]
 */

function BaseFilter(analyzer, filterer, mapper) {
	this.analyzer = analyzer;
	this.filterer = filterer;
	this.mapper = mapper;
};

/**
 * @type {Analyzer}
 */

BaseFilter.prototype.analyzer;

/**
 * @type {(function(Token): boolean)|undefined}
 */

BaseFilter.prototype.filterer;

/**
 * @type {(function(Token): Token)|undefined}
 */

BaseFilter.prototype.mapper;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

BaseFilter.prototype.tokenize = function (field, value) {
	var tokens = this.analyzer.tokenize(field, value),
		x, xl, result, skipped = 0;
		
	if (this.filterer) {
		result = [];
		for (x = 0, xl = tokens.length; x < xl; ++x) {
			if (this.filterer(tokens[x])) {
				tokens[x].positionIncrement += skipped;
				result[result.length] = tokens[x];
				skipped = 0;
			} else {
				skipped += tokens[x].positionIncrement;
			}
		}
	} else {
		result = tokens;
	}
	
	if (this.mapper) {
		result = result.map(this.mapper);
	}
	
	return result;
};


exports.BaseFilter = BaseFilter;

/**
 * @constructor
 * @implements {Analyzer}
 * @param {RegExp} regexp
 * @param {boolean} [match]
 */

function CharTokenizer(regexp, match) {
	this.regexp = regexp;
};

/**
 * @type {RegExp}
 */

CharTokenizer.prototype.regexp;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

CharTokenizer.prototype.tokenize = function (field, value) {
	var x, xl, 
		regexp = this.regexp, 
		word = "", 
		startOffset = 0, 
		result = [];
	
	for (x = 0, xl = value.length; x < xl; ++x) {
		//TODO: Make this Unicode compliant
		if (regexp.test(value[x])) {
			word += value[x];
		} else {
			if (word.length) {
				result[result.length] = /** @type {Token} */ ({
					type : "word",
					value : word,
					startOffset : startOffset,
					endOffset : x,
					positionIncrement : 1
				});
				word = "";
			}
			startOffset = x + 1;
		}
	}
	
	if (word.length) {
		result[result.length] = /** @type {Token} */ ({
			type : "word",
			value : word,
			startOffset : startOffset,
			endOffset : value.length,
			positionIncrement : 1
		});
	}
	
	return result;
};


/**
 * @constructor
 * @extends {CharTokenizer}
 * @implements {Analyzer}
 */

function WhitespaceTokenizer() {};
WhitespaceTokenizer.prototype = Object.create(CharTokenizer.prototype);
WhitespaceTokenizer.prototype.regexp = /[^\u0009-\u000D\u001C-\u001F\u0020\u0085\u1680\u180E\u2000-\u2006\u2008-\u200A\u2028\u2029\u205F\u3000]/;


/**
 * @constructor
 * @extends {CharTokenizer}
 * @implements {Analyzer}
 */

function LetterTokenizer() {};
LetterTokenizer.prototype = Object.create(CharTokenizer.prototype);
LetterTokenizer.prototype.regexp = /[A-Za-z]/;


exports.CharTokenizer = CharTokenizer;
exports.WhitespaceTokenizer = WhitespaceTokenizer;
exports.LetterTokenizer = LetterTokenizer;

/**
 * @constructor
 * @implements {Analyzer}
 */

function IDTokenizer() {};

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

IDTokenizer.prototype.tokenize = function (field, value) {
	return [ /** @type {Token} */ ({
		type : "word",
		value : value,
		startOffset : 0,
		endOffset : value.length,
		positionIncrement : 1
	}) ];
};


exports.IDTokenizer = IDTokenizer;

/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 * @param {number} [min]
 * @param {number} [max]
 */

function LengthFilter(analyzer, min, max) {
	this.analyzer = analyzer;
	this.min = min || 0;
	this.max = max || Number.POSITIVE_INFINITY;
};

/**
 * @type {Analyzer}
 */

LengthFilter.prototype.analyzer;

/**
 * @type {number}
 */

LengthFilter.prototype.min;

/**
 * @type {number}
 */

LengthFilter.prototype.max;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

LengthFilter.prototype.tokenize = function (field, value) {
	var x, xl, tokenValue,
		tokens = this.analyzer.tokenize(field, value),
		min = this.min,
		max = this.max,
		result = [],
		skipped = 0;
	for (x = 0, xl = tokens.length; x < xl; ++x) {
		tokenValue = tokens[x].value;
		if (typeof tokenValue === "string" && tokenValue.length >= min && tokenValue.length <= max) {
			tokens[x].positionIncrement += skipped;
			result[result.length] = tokens[x];
			skipped = 0;
		} else {
			skipped += tokens[x].positionIncrement;
		}
	}
	return result;
};


exports.LengthFilter = LengthFilter;

/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 */

function LowerCaseFilter(analyzer) {
	this.analyzer = analyzer;
};

/**
 * @type {Analyzer}
 */

LowerCaseFilter.prototype.analyzer;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

LowerCaseFilter.prototype.tokenize = function (field, value) {
	var x, xl, result = this.analyzer.tokenize(field, value);
	for (x = 0, xl = result.length; x < xl; ++x) {
		if (typeof result[x].value === "string") {
			result[x].value = result[x].value.toLowerCase();
		}
	}
	return result;
};


exports.LowerCaseFilter = LowerCaseFilter;

/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 * @param {Object.<boolean>|Array.<string>} stopWords
 */

function StopFilter(analyzer, stopWords) {
	this.analyzer = analyzer;
	if (typeOf(stopWords) === "array") {
		this.stopWords = StopFilter.toHash(/** @type {Array.<string>} */ (stopWords));
	} else {
		this.stopWords = /** @type {Object.<boolean>} */ (stopWords);
	}
};

/**
 * @param {Array.<string>} arr
 * @return {Object.<boolean>}
 */

StopFilter.toHash = function (arr) {
	var x, xl, result = {};
	for (x = 0, xl = arr.length; x < xl; ++x) {
		result[arr[x]] = true;
	}
	return result;
};

/**
 * @type {Analyzer}
 */

StopFilter.prototype.analyzer;

/**
 * @type {Object.<boolean>}
 */

StopFilter.prototype.stopWords;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

StopFilter.prototype.tokenize = function (field, value) {
	var x, xl, tokenValue,
		tokens = this.analyzer.tokenize(field, value),
		stopWords = this.stopWords,
		result = [],
		skipped = 0;
	for (x = 0, xl = tokens.length; x < xl; ++x) {
		tokenValue = tokens[x].value;
		if (typeof tokenValue === "string" && stopWords[tokenValue] !== true) {
			tokens[x].positionIncrement += skipped;
			result[result.length] = tokens[x];
			skipped = 0;
		} else {
			skipped += tokens[x].positionIncrement;
		}
	}
	return result;
};


exports.StopFilter = StopFilter;

/**
 * Transforms the token stream as per the Porter stemming algorithm.
 * 
 * Note: the input to the stemming filter must already be in lower case,
 * so you will need to use LowerCaseFilter farther down the Tokenizer 
 * chain in order for this to work properly!
 * 
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 */

function PorterFilter(analyzer) {
	this.analyzer = analyzer;
};

/**
 * @type {Analyzer}
 */

PorterFilter.prototype.analyzer;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

PorterFilter.prototype.tokenize = function (field, value) {
	var x, xl, result = this.analyzer.tokenize(field, value);
	for (x = 0, xl = result.length; x < xl; ++x) {
		if (typeof result[x].value === "string") {
			result[x].value = porterStem(result[x].value);
		}
	}
	return result;
};


exports.PorterFilter = PorterFilter;

// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
// paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
//  no. 3, pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

// Release 1 be 'andargor', Jul 2004
// Release 2 (substantially revised) by Christopher McKenzie, Aug 2009

var porterStem = (function(){
	var step2list = {
			"ational" : "ate",
			"tional" : "tion",
			"enci" : "ence",
			"anci" : "ance",
			"izer" : "ize",
			"bli" : "ble",
			"alli" : "al",
			"entli" : "ent",
			"eli" : "e",
			"ousli" : "ous",
			"ization" : "ize",
			"ation" : "ate",
			"ator" : "ate",
			"alism" : "al",
			"iveness" : "ive",
			"fulness" : "ful",
			"ousness" : "ous",
			"aliti" : "al",
			"iviti" : "ive",
			"biliti" : "ble",
			"logi" : "log"
		},

		step3list = {
			"icate" : "ic",
			"ative" : "",
			"alize" : "al",
			"iciti" : "ic",
			"ical" : "ic",
			"ful" : "",
			"ness" : ""
		},

		c = "[^aeiou]",          // consonant
		v = "[aeiouy]",          // vowel
		C = c + "[^aeiouy]*",    // consonant sequence
		V = v + "[aeiou]*",      // vowel sequence

		mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
		meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
		mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
		s_v = "^(" + C + ")?" + v;                   // vowel in stem

	return function (w) {
		var 	stem,
			suffix,
			firstch,
			re,
			re2,
			re3,
			re4,
			origword = w;

		if (w.length < 3) { return w; }

		firstch = w.substr(0,1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) { w = w.replace(re,"$1$2"); }
		else if (re2.test(w)) {	w = w.replace(re2,"$1$2"); }

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re,"");
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
				if (re2.test(w)) {	w = w + "e"; }
				else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
				else if (re4.test(w)) { w = w + "e"; }
			}
		}

		// Step 1c
		re = /^(.+?)y$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(s_v);
			if (re.test(stem)) { w = stem + "i"; }
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step2list[suffix];
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step3list[suffix];
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			if (re.test(stem)) {
				w = stem;
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(mgr1);
			if (re2.test(stem)) {
				w = stem;
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			re2 = new RegExp(meq1);
			re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
			}
		}

		re = /ll$/;
		re2 = new RegExp(mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re,"");
		}

		// and turn initial Y back to y

		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}

		return w;
	}
})();

/**
 * @constructor
 * @implements {Indexer}
 */

function DefaultIndexer() {};

/**
 * @param {Object} doc
 * @param {FieldName} [field]
 * @return {Array.<TermVector>}
 */

DefaultIndexer.prototype.index = function (doc, id, field) {
	var terms,
		entries,
		key,
		/** @type {Array.<TermVector>} */
		result = [];
	
	switch (typeOf(doc)) {
	case 'null':
	case 'boolean':
	case 'number':
		result[0] = /** @type {TermVector} */ ({
				term : doc,
				field : field || null,
				documentID : id
		});
		break;
		
	case 'string':
		terms = doc.replace(/[^\w\d]/g, " ").replace(/\s\s/g, " ").toLowerCase().split(" ");
		entries = {};
		
		for (key = 0; key < terms.length; ++key) {
			if (!entries[terms[key]]) {
				entries[terms[key]] = /** @type {TermVector} */ ({
					term : terms[key],
					termFrequency : 1,
					termPositions : [key],
					//termOffsets : [key],  //FIXME
					field : field,
					totalFieldTokens : terms.length,
					documentID : id
				});
			} else {
				//TODO: Optimize
				entries[terms[key]].termFrequency++;
				entries[terms[key]].termPositions.push(key);
				//entries[terms[key]].termOffsets.push(key);  //FIXME
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
				result = result.concat(this.index(doc[key], id, (field ? field + "." + key : key)));
			}
		}
		break;
	
	case 'array':
		for (key = 0; key < doc.length; ++key) {
			result = result.concat(this.index(doc[key], id, (field ? field + "." + key : String(key))));
		}
		break;
	}
	
	return result;
};

/**
 * @return {string}
 */

DefaultIndexer.prototype.toSource = function () {
	//TODO
};


exports.DefaultIndexer = DefaultIndexer;

/**
 * @constructor
 * @implements {Index}
 */

function MemoryIndex() {
	this._docs = {};
	this._index = {};
	this._indexKeys = new ScapegoatTree();
};

/**
 * @param {TermVector} a
 * @param {TermVector} b
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
 * @param {string} a
 * @param {string} b
 * @return {number}
 */

MemoryIndex.stringComparator = function (a, b) {
	if (a < b) {
		return -1;
	} else if (a > b) {
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
 * @type {Object.<Array.<TermVector>>}
 */

MemoryIndex.prototype._index;

/**
 * @protected
 * @type {ScapegoatTree}
 */

MemoryIndex.prototype._indexKeys;

/**
 * @protected
 * @type {Indexer}
 */

MemoryIndex.prototype._indexer = new DefaultIndexer();

/**
 * @return {DocumentID}
 */

MemoryIndex.prototype.generateID = function () {
	return String(Math.random());  //FIXME
};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.indexDocument = function (doc, id, callback) {
	var entry, i, il, key;
	entry = this._indexer.index(doc, id);
	
	for (i = 0, il = entry.length; i < il; ++i) {
		key = JSON.stringify([entry[i].field, entry[i].term]);
		if (!this._index[key]) {
			this._index[key] = [ entry[i] ];
			this._indexKeys.insert(key);
		} else {
			Array.orderedInsert(this._index[key], entry[i], MemoryIndex.documentIDComparator);
		}
	}
	
	if (callback) {
		callback(null);
	}
};

/**
 * @param {Object} doc
 * @param {DocumentID|null} [id]
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.addDocument = function (doc, id, callback) {
	if (typeof id === "undefined" || typeOf(id) === "null") {
		id = this.generateID();
	} else {
		id = String(id);
	}
	
	this._docs[id] = doc;
	this._docCount++;
	
	this.indexDocument(doc, id, callback);
};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

MemoryIndex.prototype.getDocument = function (id, callback) {
	callback(null, this._docs[id]);
};

/**
 * @param {Indexer} indexer
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.setIndexer = function (indexer, callback) {
	var docs = this._docs, id;
	this._indexer = indexer;
	
	//reindex all documents
	this._index = {};
	for (id in docs) {
		if (docs.hasOwnProperty(id)) {
			this.indexDocument(docs[id], id);
		}
	}
	
	if (callback) {
		callback(null);
	}
};

/**
 * @param {FieldName} field
 * @param {Term} term
 * @return {Stream}
 */

MemoryIndex.prototype.getTermVectors = function (field, term) {
	var key = JSON.stringify([field, term]),
		entries = this._index[key] || [],
		self = this,
		stream = new Stream();
		
	stream.pause();             //allow caller to attach to stream
	stream.bulkWrite(entries);  //buffered
	stream.end();               //buffered
	stream.resume();            //asynchronous
	
	return stream;
};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {Stream}
 */

MemoryIndex.prototype.getTermRangeVectors = function (field, startTerm, endTerm, excludeStart, excludeEnd) {
	var startKey = JSON.stringify([field, startTerm]),
		endKey = JSON.stringify([field, endTerm]),
		keys = this._indexKeys.range(startKey, endKey, excludeStart, excludeEnd),
		i, il
		stream = new Stream();

	stream.pause();             //allow caller to attach to stream	

	for (i = 0, il = keys.length; i < il; ++i) {
		stream.bulkWrite(this._index[keys[i]]);  //buffered
	}
	
	stream.end();               //buffered
	stream.resume();            //asynchronous
	return stream;
};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} excludeStart
 * @param {boolean} excludeEnd
 * @param {function(PossibleError, Array.<string>)} [callback]
 */

MemoryIndex.prototype.getTermRange = function (field, startTerm, endTerm, excludeStart, excludeEnd, callback) {
	var startKey = JSON.stringify([field, startTerm]),
		endKey = JSON.stringify([field, endTerm]),
		keys = this._indexKeys.range(startKey, endKey, excludeStart, excludeEnd).map(function (key) {
			return JSON.parse(key)[1];
		});
	
	setTimeout(function () {
		callback(null, keys);
	}, 0);
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
 * @implements {Query}
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
 * @return {Stream}
 */

BooleanQuery.prototype.score = function (similarity, index) {
	return new BooleanScorer(this, similarity, index);
};

/**
 * @return {Array.<TermVector>}
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
 * @param {Array.<BooleanClause>} clauses
 */

BooleanScorer.prototype.addInputs = function (clauses) {
	var self = this;
	clauses.forEach(function (clause) {
		var collector = new SingleCollector(function onCollection(done, data) {
			if (!done) {
				return self.match();
			} else if (done === true) {
				bcs.collector = null;
				self._collectorCount--;
				
				if (self._collectorCount === 0 || bcs.occur === Occur.MUST) {
					self._collectorCount = 0;  //to pass sanity checks
					self.end();
				} else if (self._collectorCount > 0) {
					self.match();
				}
			} else {  //done instanceof Error
				self.error(done);
			}
		}), 
		bcs = new BooleanClauseStream(clause.query, clause.occur, collector);
		
		clause.query.score(self._similarity, self._index).pipe(collector);
		self._inputs.push(bcs);
		self._collectorCount++;
	});
};

/**
 */

BooleanScorer.prototype.match = function () {
	var x, xl, docs = [], lowestIndex = 0, lowestID, match = false, optionalMatches = 0, doc;
	
	if (this.isPaused()) {
		return;  //scorer is paused, proceed no further
	}
	
	//collect all documents, find lowest document ID
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (this._inputs[x].collector) {
			docs[x] = this._inputs[x].collector.data;
			
			if (typeof docs[x] === "undefined") {
				return;  //not all collectors are full
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
		doc.score *= this._query.boost;
		doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;
		this.emit(doc);
	}
	
	//remove documents with lowestID
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (docs[x] && docs[x].id === lowestID) {
			this._inputs[x].collector.drain();
		}
	}
};

/**
 */

BooleanScorer.prototype.onResume = function () {
	var self = this;
	setTimeout(function () {
		self.match();
	}, 0);
};

/**
 */

BooleanScorer.prototype.onEnd = function () {
	//sanity check
	if (this._collectorCount) {
		throw new Error("BooleanScorer#end called while there are still collectors attached!");
	}
	
	this.emitEnd();
	this._cleanup();
};

/**
 * @param {Error} err
 */

BooleanScorer.prototype.onError = function (err) {
	this.emitError(err);
	this._cleanup();
};

/**
 * @private
 */

BooleanScorer.prototype._cleanup = function () {
	var x, xl;
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (this._inputs[x].collector) {
			this._inputs[x].collector.end();
		}
	}
	this._inputs = [];
};


/**
 * @protected
 * @constructor
 * @extends {BooleanClause}
 * @param {Query} query
 * @param {Occur} occur
 * @param {Stream} collector
 */

function BooleanClauseStream(query, occur, collector) {
	//BooleanClause.call(this, query, occur);
	this.query = query;
	this.occur = occur;
	this.collector = collector;
};

BooleanClauseStream.prototype = Object.create(BooleanClause.prototype);

/**
 * @type {Stream}
 */

BooleanClauseStream.prototype.collector;


exports.BooleanQuery = BooleanQuery;

/**
 * @constructor
 * @implements {Similarity}
 */

var DefaultSimilarity = function () {};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.norm = function (termVec) {
	return (termVec.documentBoost || 1.0) * 
	       (termVec.fieldBoost || 1.0) * 
	       (1.0 / Math.sqrt(termVec.totalFieldTokens || 1));
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
	return Math.sqrt(termVec.termFrequency || 1);
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
	return Math.log((termVec.totalDocuments || 1) / ((termVec.documentFrequency || 1) + 1)) + 1.0;
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

DocumentTerms.compare = function (a, b) {
	if (a.id < b.id) {
		return -1;
	} else if (a.id > b.id) {
		return 1;
	} 
	//else
	return 0;
};

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
 * @constructor
 * @implements {Query}
 * @param {Query} query
 * @param {function(DocumentTerms)} filter
 * @param {number} [boost]
 */

function FilterQuery(query, filter, boost) {
	this.query = query;
	this.filter = filter;
	this.boost = boost || 1.0;
};

/**
 * @type {Query}
 */

FilterQuery.prototype.query;

/**
 * @type {function(DocumentTerms)}
 */

FilterQuery.prototype.filter;

/**
 * @type {number}
 */

FilterQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

FilterQuery.prototype.score = function (similarity, index) {
	var scorer = new FilterScorer(this, similarity);
	this.query.score(similarity, index).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
 */

FilterQuery.prototype.extractTerms = function () {
	return this.query.extractTerms();
};

/**
 * @return {Query}
 */

FilterQuery.prototype.rewrite = function () {
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
 * @param {FilterQuery} query
 * @param {Similarity} similarity
 */

function FilterScorer(query, similarity) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
	this._maxOverlap = query.extractTerms().length;
}

FilterScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {FilterQuery}
 */

FilterScorer.prototype._query;

/**
 * @protected
 * @type {Similarity}
 */

FilterScorer.prototype._similarity;

/**
 * @protected
 * @type {number}
 */

FilterScorer.prototype._maxOverlap;

/**
 * @param {DocumentTerms} doc
 */

FilterScorer.prototype.onWrite = function (doc) {
	var boost = this._query.boost;
	if (this._query.filter(doc)) {
		doc.score *= boost;
		doc.sumOfSquaredWeights *= boost * boost;
		this.emit(doc);
	}
};

/**
 * @param {Array.<DocumentTerms>} docs
 */

FilterScorer.prototype.onBulkWrite = function (docs) {
	var x, xl 
	boost = this._query.boost;
	
	docs = docs.filter(this._query.filter);
	for (x = 0, xl = docs.length; x < xl; ++x) {
		if (filter(docs[x])) {
			docs[x].score *= boost;
			docs[x].sumOfSquaredWeights *= boost * boost;
		}
	}
	
	this.emitBulk(docs);
};


exports.FilterQuery = FilterQuery;

/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {Array.<Term>} terms
 * @param {boolean} [all]
 * @param {number} [boost]
 */

function MultiTermQuery(field, terms, all, boost) {
	this.field = field;
	this.terms = terms;
	this.all = all || false;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

MultiTermQuery.prototype.field;

/**
 * @type {Array.<Term>}
 */

MultiTermQuery.prototype.terms;

/**
 * @type {boolean}
 */

MultiTermQuery.prototype.all = false;

/**
 * @type {number}
 */

MultiTermQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

MultiTermQuery.prototype.score = function (similarity, index) {
	return this.rewrite().score(similarity, index);
};

/**
 * @return {Array.<TermVector>}
 */

MultiTermQuery.prototype.extractTerms = function () {
	var terms, result, x, xl;
	terms = this.terms;
	result = new Array(terms.length);
	for (x = 0, xl = terms.length; x < xl; ++x) {
		result[x] = /** @type {TermVector} */ ({
			term : terms[x],
			field : this.field
		});
	}
	return result;
};

/**
 * @return {Query}
 */

MultiTermQuery.prototype.rewrite = function () {
	var query, terms, occur, x, xl;
	if (this.terms.length === 1) {
		return new TermQuery(this.field, this.terms[0], this.boost);
	}
	//else
	query = new BooleanQuery();
	query.boost = this.boost;
	terms = this.terms;
	occur = this.all ? Occur.MUST : Occur.SHOULD;
	for (x = 0, xl = terms.length; x < xl; ++x) {
		query.clauses.push(new BooleanClause(new TermQuery(this.field, terms[x]), occur));
	}
	return query;
};


exports.MultiTermQuery = MultiTermQuery;

/**
 * Used only by Searcher. Do not include this in your queries.
 * 
 * @constructor
 * @implements {Query}
 * @param {Query} query
 * @param {number} [boost]
 */

function NormalizedQuery(query, boost) {
	this.query = query;
	this.boost = boost || 1.0;
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
 * @return {Stream}
 */

NormalizedQuery.prototype.score = function (similarity, index) {
	var scorer = new NormalizedScorer(this, similarity);
	this.query.score(similarity, index).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
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
 * @param {NormalizedQuery} query
 * @param {Similarity} similarity
 */

function NormalizedScorer(query, similarity) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
}

NormalizedScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {NormalizedQuery}
 */

NormalizedScorer.prototype._query;

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

/**
 * @param {DocumentTerms} doc
 */

NormalizedScorer.prototype.onWrite = function (doc) {
	if (!this._maxOverlap) {
		this._maxOverlap = this._query.extractTerms().length;
	}
	
	doc.score *= this._query.boost * this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, this._maxOverlap);
	//doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;  //normally this operation is useless
	this.emit(doc);
};

/**
 * @param {Array.<DocumentTerms>} docs
 */

NormalizedScorer.prototype.onBulkWrite = function (docs) {
	var x, xl, doc;
	
	if (!this._maxOverlap) {
		this._maxOverlap = this._query.extractTerms().length;
	}
	
	for (x = 0, xl = docs.length; x < xl; ++x) {
		doc = docs[x];
		doc.score *= this._query.boost * this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, this._maxOverlap);
		//doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;  //normally this operation is useless
	}
	this.emitBulk(docs);
};


exports.NormalizedQuery = NormalizedQuery;

/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} [field]
 * @param {Array.<Term|undefined>} [terms]
 * @param {number} [slop]
 * @param {number} [boost]
 */

function PhraseQuery(field, terms, slop, boost) {
	this.field = field || null;
	this.terms = terms || [];
	this.slop = slop || 0;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

PhraseQuery.prototype.field = null;

/**
 * @type {Array.<Term|undefined>}
 */

PhraseQuery.prototype.terms;

/**
 * @type {number}
 */

PhraseQuery.prototype.slop = 0;

/**
 * @type {number}
 */

PhraseQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

PhraseQuery.prototype.score = function (similarity, index) {
	var stream = new PhraseFilter(this),
		x, xl, terms = [];
	
	for (x = 0, xl = this.terms.length; x < xl; ++x) {
		if (typeof this.terms[x] !== "undefined") {
			terms[terms.length] = this.terms[x];
		}
	}
	
	(new MultiTermQuery(this.field, terms, true, this.boost)).score(similarity, index).pipe(stream);
	return stream;
};

/**
 * @return {Array.<TermVector>}
 */

PhraseQuery.prototype.extractTerms = function () {
	var x, xl, terms = [];
	for (x = 0, xl = this.terms.length; x < xl; ++x) {
		if (typeof this.terms[x] !== "undefined") {
			terms.push(/** @type {TermVector} */ ({
				term : this.terms[x],
				field : this.field
			}));
		}
	}
	return terms;
};

/**
 * @return {Query}
 */

PhraseQuery.prototype.rewrite = function () {
	//TODO: Remove useless undefineds from start/end of array
	
	if (this.terms.length === 1 && typeof this.terms[0] !== "undefined") {
		return new TermQuery(this.field, /** @type {string} */ (this.terms[0]), this.boost);
	}
	//else
	return this;
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @param {PhraseQuery} query
 */

function PhraseFilter(query) {
	Stream.call(this);
	this._query = query;
};

PhraseFilter.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {PhraseQuery}
 */

PhraseFilter.prototype._query;

/**
 * @param {DocumentTerms} doc
 */

PhraseFilter.prototype.onWrite = function (doc) {
	var x, xl, y, yl, z, zl,
		phrase = this._query.terms,
		slop = this._query.slop,
		termVecs = doc.terms, 
		termPositions = {},
		positions,
		minOffset,
		maxOffset,
		sibPositions;
	
	//create hash of term positions
	for (x = 0, xl = termVecs.length; x < xl; ++x) {
		if (!(termPositions[termVecs[x].term] = termVecs[x].termPositions)) {
			//no term position information available, just fail
			return;
		}
	}
	
	//use the first term in the phrase as the offset to compare to
	positions = termPositions[phrase[0]];
	
	//for each position of the first term
	for (x = 0, xl = positions.length; x < xl; ++x) {
		//for each other term
		for (y = 1, yl = phrase.length; y < yl; ++y) {
			if (typeof phrase[y] !== "undefined") {
				minOffset = positions[x] + y - slop;
				maxOffset = positions[x] + y + slop;
				sibPositions = termPositions[phrase[y]];
				//for each position of the other term
				for (z = 0, zl = sibPositions.length; z < zl; ++z) {
					//if the position of the other term is within the sloppy offset, we have a match
					if (sibPositions[z] >= minOffset && sibPositions[z] <= maxOffset) {
						break;
					}
				}
				//if the above loop completed without breaking, the term was not within the offset
				if (z >= zl) {
					break;
				}
			}
		}
		//if the above loop completed without breaking, we found a doc that matches the phrase
		if (y >= yl) {
			this.emit(doc);
			break;
		}
	}
};


exports.PhraseQuery = PhraseQuery;

/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {string} prefix
 * @param {number} [boost]
 */

function PrefixQuery(field, prefix, boost) {
	this.field = field || null;
	this.prefix = prefix;
	this.boost = boost || 1.0;
};

/**
 * @type {string}
 */

PrefixQuery.prototype.prefix;

/**
 * @type {FieldName}
 */

PrefixQuery.prototype.field = null;

/**
 * @type {number}
 */

PrefixQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

PrefixQuery.prototype.score = function (similarity, index) {
	return this.rewrite().score(similarity, index);
};

/**
 * @return {Array.<TermVector>}
 */

PrefixQuery.prototype.extractTerms = function () {
	//since we don't know how many terms have this prefix
	//return the prefix as a term
	return [ /** @type {TermVector} */ ({
		term : this.prefix,
		field : this.field
	})];
};

/**
 * @return {TermRangeQuery}
 */

PrefixQuery.prototype.rewrite = function () {
	var endTerm = this.prefix.replace(/.$/, function (chr) {
		return String.fromCharCode(chr.charCodeAt(0) + 1);
	});
	return new TermRangeQuery(this.field, this.prefix, endTerm, false, true, this.boost);
};


exports.PrefixQuery = PrefixQuery;

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
	var collector, normQuery;
	collector = new TopDocumentsCollector(max, callback);
	normQuery = new NormalizedQuery(query);
	normQuery.score(this.similarity, this._index).pipe(collector);
};


exports.Searcher = Searcher;

/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {Term} term
 * @param {number} [boost]
 */

function TermQuery(field, term, boost) {
	this.field = field || null;
	this.term = term;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

TermQuery.prototype.field = null;

/**
 * @type {Term}
 */

TermQuery.prototype.term;

/**
 * @type {number}
 */

TermQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

TermQuery.prototype.score = function (similarity, index) {
	var scorer = new TermScorer(this, similarity);
	index.getTermVectors(this.field, this.term).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
 */

TermQuery.prototype.extractTerms = function () {
	return [ /** @type {TermVector} */ ({
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
 * @param {Query} query
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

/**
 * @param {TermVector} termVec
 */

TermScorer.prototype.onWrite = function (termVec) {
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
	
	this.emit(doc);
};

/**
 * @param {Array.<TermVector>} termVecs
 */

TermScorer.prototype.onBulkWrite = function (termVecs) {
	var similarity = this._similarity,
		termVec, doc, idf,
		docs = new Array(termVecs.length);
	
	for (x = 0, xl = termVecs.length; x < xl; ++x) {
		termVec = termVecs[x];
		doc = new DocumentTerms(termVec.documentID, [termVec]);
		idf = similarity.idf(termVec);
		
		//compute sumOfSquaredWeights
		doc.sumOfSquaredWeights = (idf * this._boost) * (idf * this._boost);
		
		//compute score
		doc.score = similarity.tf(termVec) * 
			idf * idf *
			this._boost * 
			similarity.norm(termVec);
		
		docs[x] = doc;
	}
	
	this.emitBulk(docs);
};


exports.TermQuery = TermQuery;

/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @param {number} [boost]
 */

function TermRangeQuery(field, startTerm, endTerm, excludeStart, excludeEnd, boost) {
	this.field = field || null;
	this.startTerm = startTerm;
	this.endTerm = endTerm;
	this.excludeStart = excludeStart || false;
	this.excludeEnd = excludeEnd || false;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

TermRangeQuery.prototype.field = null;

/**
 * @type {Term}
 */

TermRangeQuery.prototype.startTerm;

/**
 * @type {Term}
 */

TermRangeQuery.prototype.endTerm;

/**
 * @type {boolean}
 */

TermRangeQuery.prototype.excludeStart = false;

/**
 * @type {boolean}
 */

TermRangeQuery.prototype.excludeEnd = false;

/**
 * @type {number}
 */

TermRangeQuery.prototype.boost = 1.0;

/**
 * @private
 * @type {Array.<Term>|null}
 */
 
TermRangeQuery.prototype._terms = null;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

TermRangeQuery.prototype.score = function (similarity, index) {
	var self = this,
		stream = new Stream();
	
	index.getTermRange(this.field, this.startTerm, this.endTerm, this.excludeStart, this.excludeEnd, function (err, terms) {
		if (!err) {
			try {
				self._terms = terms;
				(new MultiTermQuery(self.field, terms, false, self.boost)).score(similarity, index).pipe(stream);
			} catch (e) {
				stream.error(e);
			}
		} else {
			stream.error(err);
		}
	});
	
	return stream;
};

/**
 * @return {Array.<TermVector>}
 */

TermRangeQuery.prototype.extractTerms = function () {
	var terms, result, x, xl;
	if (this._terms) {
		terms = this._terms;
		result = new Array(terms.length);
		for (x = 0, xl = terms.length; x < xl; ++x) {
			result[x] = /** @type {TermVector} */ ({
				term : terms[x],
				field : this.field
			});
		}
		return result;
	} else {
		//we don't know how many terms this range encompasses
		//the best we can do is return at least one term
		return [ /** @type {TermVector} */ ({
			term : this.startTerm,
			field : this.field
		})];
	}
};

/**
 * @return {Query}
 */

TermRangeQuery.prototype.rewrite = function () {
	return this;  //can not be optimized
};


exports.TermRangeQuery = TermRangeQuery;

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
 */

TopDocumentsCollector.prototype.onWrite = function (doc) {
	if (this.collection.length < this.max || doc.score > this.lowestScore) {
		if (this.collection.length >= this.max) {
			this.collection.pop();  //remove lowest scored document
		}
		Array.orderedInsert(this.collection, doc, TopDocumentsCollector.compareScores);
		this.lowestScore = this.collection[this.collection.length - 1].score;
	}
};

/**
 * @param {Array.<DocumentTerms>} docs
 */

TopDocumentsCollector.prototype.onBulkWrite = function (docs) {
	var x, xl;
	for (x = 0, xl = docs.length; x < xl; ++x) {
		if (this.collection.length < this.max || docs[x].score > this.lowestScore) {
			if (this.collection.length >= this.max) {
				this.collection.pop();  //remove lowest scored document
			}
			Array.orderedInsert(this.collection, docs[x], TopDocumentsCollector.compareScores);
			this.lowestScore = this.collection[this.collection.length - 1].score;
		}
	}
};


exports.TopDocumentsCollector = TopDocumentsCollector;

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
 * @throws {SyntaxError}
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
        "Phrase": parse_Phrase,
        "Query": parse_Query,
        "Range": parse_Range,
        "SKIP": parse_SKIP,
        "SubQuery": parse_SubQuery,
        "TERM_CHAR": parse_TERM_CHAR,
        "TERM_START_CHAR": parse_TERM_START_CHAR,
        "Term": parse_Term,
        "TermQuery": parse_TermQuery,
        "TermType": parse_TermType,
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
      
      function parse_TermType() {
        var cacheKey = 'TermType@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var result2 = parse_Term();
        if (result2 !== null) {
          if (input.substr(pos, 1) === "*") {
            var result4 = "*";
            pos += 1;
          } else {
            var result4 = null;
            if (reportMatchFailures) {
              matchFailed("\"*\"");
            }
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
          ? (function(term, wildcard) {
            if (wildcard) {
              return {prefix : term};
            } else {
              return {term : term};
            }
          })(result1[0], result1[1])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_Range() {
        var cacheKey = 'Range@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        if (input.substr(pos, 1) === "[") {
          var result17 = "[";
          pos += 1;
        } else {
          var result17 = null;
          if (reportMatchFailures) {
            matchFailed("\"[\"");
          }
        }
        if (result17 !== null) {
          var result2 = result17;
        } else {
          if (input.substr(pos, 1) === "{") {
            var result16 = "{";
            pos += 1;
          } else {
            var result16 = null;
            if (reportMatchFailures) {
              matchFailed("\"{\"");
            }
          }
          if (result16 !== null) {
            var result2 = result16;
          } else {
            var result2 = null;;
          };
        }
        if (result2 !== null) {
          var result3 = parse_SKIP();
          if (result3 !== null) {
            var result4 = parse_Term();
            if (result4 !== null) {
              var result5 = parse_SKIP();
              if (result5 !== null) {
                if (input.substr(pos, 2) === "TO") {
                  var result15 = "TO";
                  pos += 2;
                } else {
                  var result15 = null;
                  if (reportMatchFailures) {
                    matchFailed("\"TO\"");
                  }
                }
                if (result15 !== null) {
                  var result13 = result15;
                } else {
                  if (input.substr(pos, 1) === "-") {
                    var result14 = "-";
                    pos += 1;
                  } else {
                    var result14 = null;
                    if (reportMatchFailures) {
                      matchFailed("\"-\"");
                    }
                  }
                  if (result14 !== null) {
                    var result13 = result14;
                  } else {
                    var result13 = null;;
                  };
                }
                var result6 = result13 !== null ? result13 : '';
                if (result6 !== null) {
                  var result7 = parse_SKIP();
                  if (result7 !== null) {
                    var result8 = parse_Term();
                    if (result8 !== null) {
                      var result9 = parse_SKIP();
                      if (result9 !== null) {
                        if (input.substr(pos, 1) === "]") {
                          var result12 = "]";
                          pos += 1;
                        } else {
                          var result12 = null;
                          if (reportMatchFailures) {
                            matchFailed("\"]\"");
                          }
                        }
                        if (result12 !== null) {
                          var result10 = result12;
                        } else {
                          if (input.substr(pos, 1) === "}") {
                            var result11 = "}";
                            pos += 1;
                          } else {
                            var result11 = null;
                            if (reportMatchFailures) {
                              matchFailed("\"}\"");
                            }
                          }
                          if (result11 !== null) {
                            var result10 = result11;
                          } else {
                            var result10 = null;;
                          };
                        }
                        if (result10 !== null) {
                          var result1 = [result2, result3, result4, result5, result6, result7, result8, result9, result10];
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
        } else {
          var result1 = null;
          pos = savedPos0;
        }
        var result0 = result1 !== null
          ? (function(startRange, startTerm, endTerm, endRange) {
            var excludeStart = (startRange === "{");
            var excludeEnd = (endRange === "}");
            return {startTerm:startTerm, endTerm:endTerm, excludeStart:excludeStart, excludeEnd:excludeEnd};
          })(result1[0], result1[2], result1[6], result1[8])
          : null;
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_Phrase() {
        var cacheKey = 'Phrase@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        if (input.substr(pos, 1) === "\"") {
          var result2 = "\"";
          pos += 1;
        } else {
          var result2 = null;
          if (reportMatchFailures) {
            matchFailed("\"\\\"\"");
          }
        }
        if (result2 !== null) {
          var result3 = parse_SKIP();
          if (result3 !== null) {
            var result4 = parse_Term();
            if (result4 !== null) {
              var result5 = [];
              var savedPos2 = pos;
              var result15 = parse_WHITESPACE();
              if (result15 !== null) {
                var result13 = [];
                while (result15 !== null) {
                  result13.push(result15);
                  var result15 = parse_WHITESPACE();
                }
              } else {
                var result13 = null;
              }
              if (result13 !== null) {
                var result14 = parse_Term();
                if (result14 !== null) {
                  var result12 = [result13, result14];
                } else {
                  var result12 = null;
                  pos = savedPos2;
                }
              } else {
                var result12 = null;
                pos = savedPos2;
              }
              while (result12 !== null) {
                result5.push(result12);
                var savedPos2 = pos;
                var result15 = parse_WHITESPACE();
                if (result15 !== null) {
                  var result13 = [];
                  while (result15 !== null) {
                    result13.push(result15);
                    var result15 = parse_WHITESPACE();
                  }
                } else {
                  var result13 = null;
                }
                if (result13 !== null) {
                  var result14 = parse_Term();
                  if (result14 !== null) {
                    var result12 = [result13, result14];
                  } else {
                    var result12 = null;
                    pos = savedPos2;
                  }
                } else {
                  var result12 = null;
                  pos = savedPos2;
                }
              }
              if (result5 !== null) {
                var result6 = parse_SKIP();
                if (result6 !== null) {
                  if (input.substr(pos, 1) === "\"") {
                    var result7 = "\"";
                    pos += 1;
                  } else {
                    var result7 = null;
                    if (reportMatchFailures) {
                      matchFailed("\"\\\"\"");
                    }
                  }
                  if (result7 !== null) {
                    var savedPos1 = pos;
                    if (input.substr(pos, 1) === "~") {
                      var result10 = "~";
                      pos += 1;
                    } else {
                      var result10 = null;
                      if (reportMatchFailures) {
                        matchFailed("\"~\"");
                      }
                    }
                    if (result10 !== null) {
                      var result11 = parse_Number();
                      if (result11 !== null) {
                        var result9 = [result10, result11];
                      } else {
                        var result9 = null;
                        pos = savedPos1;
                      }
                    } else {
                      var result9 = null;
                      pos = savedPos1;
                    }
                    var result8 = result9 !== null ? result9 : '';
                    if (result8 !== null) {
                      var result1 = [result2, result3, result4, result5, result6, result7, result8];
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
          ? (function(startTerm, otherTerms, slop) {
            var phrase = [ startTerm ];
            if (otherTerms) {
              for (var x = 0, xl = otherTerms.length; x < xl; ++x) {
                phrase.push(otherTerms[x][1]);
              }
            }
            return {phrase:phrase, slop:(slop ? slop[1] : 0)};
          })(result1[2], result1[3], result1[6])
          : null;
        
        
        
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
        var result9 = parse_Term();
        if (result9 !== null) {
          if (input.substr(pos, 1) === ":") {
            var result10 = ":";
            pos += 1;
          } else {
            var result10 = null;
            if (reportMatchFailures) {
              matchFailed("\":\"");
            }
          }
          if (result10 !== null) {
            var result8 = [result9, result10];
          } else {
            var result8 = null;
            pos = savedPos1;
          }
        } else {
          var result8 = null;
          pos = savedPos1;
        }
        var result2 = result8 !== null ? result8 : '';
        if (result2 !== null) {
          var result7 = parse_Phrase();
          if (result7 !== null) {
            var result3 = result7;
          } else {
            var result6 = parse_Range();
            if (result6 !== null) {
              var result3 = result6;
            } else {
              var result5 = parse_TermType();
              if (result5 !== null) {
                var result3 = result5;
              } else {
                var result3 = null;;
              };
            };
          }
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
          var result7 = parse_WHITESPACE();
          if (result7 !== null) {
            var result5 = [];
            while (result7 !== null) {
              result5.push(result7);
              var result7 = parse_WHITESPACE();
            }
          } else {
            var result5 = null;
          }
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
            var result7 = parse_WHITESPACE();
            if (result7 !== null) {
              var result5 = [];
              while (result7 !== null) {
                result5.push(result7);
                var result7 = parse_WHITESPACE();
              }
            } else {
              var result5 = null;
            }
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