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


exports.Collector = Collector;