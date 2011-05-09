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
 * @type {*}
 */

SingleCollector.prototype.data;

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
	return this.data === "undefined";
};

SingleCollector.prototype.drain = function () {
	this.data = undefined;
	this.emit('drain');
};

/**
 * @param {*} [data]
 */

SingleCollector.prototype.end = function (data) {
	if (typeof data !== "undefined") {
		this.write(data);
	}
	this.destroy();
};


exports.SingleCollector = SingleCollector;