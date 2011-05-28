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