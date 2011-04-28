/**
 * @constructor
 * @implements {InputStream}
 * @implements {OutputStream}
 * @param {InputStream} [output]
 */

function Pipe(output) {
	this._inputs = [];
	this._outputs = [];
	
	if (output) {
		this._outputs[0] = output;
	}
};

/**
 * @protected
 * @type {Array.<OutputStream>}
 */

Pipe.prototype._inputs;

/**
 * @protected
 * @type {Array.<InputStream>}
 */

Pipe.prototype._outputs;

/**
 * @protected
 * @type {boolean}
 */

Pipe.prototype._open = false;

/**
 * @protected
 * @type {boolean}
 */

Pipe.prototype._paused = false;

/**
 * @param {OutputStream} input
 */

Pipe.prototype.start = function (input) {
	var i, il;
	Array.add(this._inputs, input);
	if (this._paused) {
		input.pause();
	}
	if (!this._open) {
		for (i = 0, il = this._outputs.length; i < il; ++i) {
			this._outputs[i].start(this);
		}
		this._open = true;
	}
};

/**
 * @param {?} data
 */

Pipe.prototype.push = function (data) {
	var i, il;
	if (this._paused) {
		throw new Error("Pipe is paused");
	}
	for (i = 0, il = this._outputs.length; i < il; ++i) {
		this._outputs[i].push(data);
	}
};

/**
 * @param {OutputStream} input
 * @param {PossibleError} [error]
 */

Pipe.prototype.end = function (input, error) {
	var i, il;
	Array.remove(this._inputs, input);
	if (this._inputs.length === 0 && this._open) {
		for (i = 0, il = this._outputs.length; i < il; ++i) {
			this._outputs[i].end(this, error);
		}
		this._open = false;
	}
};

/**
 * @param {InputStream} output
 */

Pipe.prototype.addOutput = function (output) {
	if (this._open) {
		output.start(this);
	}
	Array.add(this._outputs, output);
};

/**
 * @param {InputStream} output
 */

Pipe.prototype.removeOutput = function (output) {
	Array.remove(this._outputs, output);
	if (this._open) {
		output.end(this);
	}
};

/**
 */

Pipe.prototype.pause = function () {
	var i, il;
	this._paused = true;
	for (i = 0, il = this._inputs.length; i < il; ++i) {
		this._inputs[i].pause();
	}
};

/**
 */

Pipe.prototype.resume = function () {
	var i, il;
	this._paused = false;
	for (i = 0, il = this._inputs.length; i < il; ++i) {
		this._inputs[i].resume();
	}
};

/**
 */

Pipe.prototype.close = function () {
	var i, il;
	for (i = 0, il = this._inputs.length; i < il; ++i) {
		this._inputs[i].close();
	}
	this._inputs = [];
	if (this._open) {
		for (i = 0, il = this._outputs.length; i < il; ++i) {
			this._outputs[i].end(this);
		}
		this._open = false;
	}
};


exports.Pipe = Pipe;