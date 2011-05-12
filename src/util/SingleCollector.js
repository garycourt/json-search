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