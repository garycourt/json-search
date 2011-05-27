/**
 * @constructor
 * @extends {Stream}
 * @param {function(PossibleError, *)} listener
 */

function SingleCollector(listener) {
	Stream.call(this);
	this.listener = listener;
};

SingleCollector.prototype = Object.create(Stream.prototype);

/**
 * @type {function(PossibleError, *)}
 */

SingleCollector.prototype.listener;

/**
 * @type {*}
 */

SingleCollector.prototype.data;

/**
 * @param {*} data
 */

SingleCollector.prototype.write = function (data) {
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

SingleCollector.prototype.end = function () {
	if (this.listener) {
		this.listener(true);
	}
	Stream.prototype.end.call(this);
};

/**
 * @param {Error} err
 */

SingleCollector.prototype.error = function (err) {
	if (this.listener) {
		this.listener(err);
	}
	Stream.prototype.error.call(this, err);
};


exports.SingleCollector = SingleCollector;