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