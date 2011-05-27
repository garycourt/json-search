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

Collector.prototype.write = function (entry) {
	this.collection.push(entry);
};

/**
 * @param {Array.<*>} entries
 */

Collector.prototype.writeBulk = function (entries) {
	this.collection = this.collection.concat(entries);
};

/**
 */

Collector.prototype.end = function () {
	if (this.callback) {
		this.callback(null, this.collection);
		this.callback = null;
	}
};

/**
 * @param {Error} err
 */

Collector.prototype.error = function (err) {
	if (this.callback) {
		this.callback(err);
		this.callback = null;
	}
};


exports.Collector = Collector;