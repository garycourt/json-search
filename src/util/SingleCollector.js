/**
 * @constructor
 * @extends {Stream}
 * @implements {WritableStream}
 * @param {function(PossibleError, Array=)} [callback]
 */

function SingleCollector(callback) {
	var self = this;
	Stream.call(this);
	this.callback = callback || null;
	
	this.on('error', function (err) {
		if (self.callback) {
			self.callback(err);
			self.callback = null;
		}
	});
};

SingleCollector.prototype = Object.create(Stream.prototype);

/**
 * @type {*}
 */

SingleCollector.prototype.data;

/**
 * @type {function(PossibleError, Array=)|null}
 */

SingleCollector.prototype.callback = null;

/**
 * @type {boolean}
 */

SingleCollector.prototype.writable = true;

/**
 * @param {?} data
 * @return {boolean}
 */

SingleCollector.prototype.write = function (data) {
	if (typeof this.data !== "undefined") {
		throw new Error("Stream is full");
	}
	
	this.data = data;
	if (this.callback) {
		this.callback(null, data);
	}
	return this.data === "undefined";
};

SingleCollector.prototype.drain = function () {
	this.data = undefined;
	this.emit('drain');
};

/**
 * @param {?} [data]
 */

SingleCollector.prototype.end = function (data) {
	if (typeof data !== "undefined") {
		this.write(data);
	}
	this.destroy();
};

/**
 */

SingleCollector.prototype.destroy = function () {
	this.callback = null;
};

/**
 */

SingleCollector.prototype.destroySoon = SingleCollector.prototype.destroy;


exports.SingleCollector = SingleCollector;