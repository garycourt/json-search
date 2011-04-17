/**
 * @constructor
 * @implements {InputStream}
 * @param {function(PossibleError, Array=)} callback
 */

function Collector(callback) {
	this._inputs = [];
	this.collection = [];
	this.callback = callback;
};

/**
 * @protected
 * @type {Array.<OutputStream>}
 */

Collector.prototype._inputs;

/**
 * @type {Array}
 */

Collector.prototype.collection;

/**
 * @type {function(PossibleError, Array=)}
 */

Collector.prototype.callback;

/**
 * @param {OutputStream} input
 */

Collector.prototype.start = function (input) {
	Array.add(this._inputs, input);
};

/**
 * @param {?} data
 */

Collector.prototype.push = function (data) {
	this.collection.push(data);
};

/**
 * @param {OutputStream} input
 * @param {PossibleError} [error]
 */

Collector.prototype.end = function (input, error) {
	Array.remove(this._inputs, input);
	if (this._inputs.length === 0) {
		this.callback(error, this.collection);
	}
};