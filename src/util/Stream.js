/**
 * @constructor
 */

function Stream() {}

/**
 * @private
 * @type {Stream}
 */

Stream.prototype._streamInput = null;

/**
 * @private
 * @type {Stream}
 */

Stream.prototype._streamOutput = null;

/**
 * @private
 * @type {Array.<Array.<*>>}
 */

Stream.prototype._streamBuffer = null;

/**
 * @private
 * @type {boolean}
 */

Stream.prototype._streamPaused = false;

/**
 * @private
 * @type {boolean}
 */

Stream.prototype._streamEnded = false;

/**
 * @private
 * @type {Error|string|null}
 */

Stream.prototype._streamError = null;

/**
 * @private
 * @type {boolean}
 */

Stream.prototype._streamDraining = false;

/**
 * @private
 */

Stream.prototype._streamDrain = function () {
	var pointer, subpointer, sublength;
	if (this._streamBuffer && !this._streamPaused && !this._streamDraining) {
		this._streamDraining = true;
		
		try {
			for (pointer = 0; !this._streamPaused && pointer < this._streamBuffer.length; ++pointer) {
				if (this._streamBuffer[pointer].length > 1) {
					if (this.onBulkWrite !== Stream.prototype.onBulkWrite) {
						this.onBulkWrite(this._streamBuffer[pointer]);
					} else {
						for (subpointer = 0, sublength = this._streamBuffer[pointer].length; !this._streamPaused && subpointer < sublength; ++subpointer) {
							this.onWrite(this._streamBuffer[pointer][subpointer]);
						}
						if (subpointer < sublength) {
							this._streamBuffer[pointer] = this._streamBuffer[pointer].slice(subpointer);
							break;  //stop executing, don't increment pointer
						}
					}
				} else if (this._streamBuffer[pointer].length === 1) {
					this.onWrite(this._streamBuffer[pointer][0]);
				}
			}
		} catch(e) {
			this.error(e);
			pointer = this._streamBuffer.length;
		}
		
		if (!this._streamPaused && pointer >= this._streamBuffer.length) {
			this._streamBuffer = null;
			if (this._streamEnded) {
				try {
					if (this._streamError) {
						this.onError(this._streamError);
					} else {
						this.onEnd();
					}
				} catch(e) {}  //ignore any errors
			}
		} else {
			this._streamBuffer = this._streamBuffer.slice(pointer);
		}
		
		this._streamDraining = false;
	}
};

/**
 * @param {Stream} output
 */

Stream.prototype.pipe = function (output) {
	if (this._streamOutput) {
		throw new Error("Stream already has an output");
	}
	if (output._streamInput) {
		throw new Error("Output stream already has an input");
	}
	
	this._streamOutput = output;
	output._streamInput = this;
	output._streamEnded = false;
	output._streamError = null;
	
	output.onStart(this);
};

/**
 * @param {*} entry
 */

Stream.prototype.write = function (entry) {
	if (!this._streamPaused) {
		this.onWrite(entry);
	} else {
		if (!this._streamBuffer) {
			this._streamBuffer = [];
		}
		this._streamBuffer[this._streamBuffer.length] = [ entry ];
	}
};

/**
 * @param {*} entry
 */

Stream.prototype.emit = function (entry) {
	if (this._streamOutput) {
		this._streamOutput.write(entry);
	}
};

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.bulkWrite = function (entries) {
	if (!this._streamPaused) {
		this.onBulkWrite(entries);
	} else {
		if (!this._streamBuffer) {
			this._streamBuffer = [];
		}
		this._streamBuffer[this._streamBuffer.length] = entries;
	}
};

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.emitBulk = function (entries) {
	if (this._streamOutput) {
		this._streamOutput.bulkWrite(entries);
	}
};

/**
 * @return {boolean}
 */

Stream.prototype.isPaused = function () {
	return this._streamPaused;
};

/**
 */

Stream.prototype.pause = function () {
	if (!this._streamPaused) {
		this._streamPaused = true;
		if (this.onPause) {
			this.onPause();
		}
		if (this._streamInput) {
			this._streamInput.pause();
		}
	}
};

/**
 */

Stream.prototype.resume = function () {
	var self = this;
	if (this._streamPaused) {
		this._streamPaused = false;
		if (this.onResume) {
			this.onResume();
		}
		if (this._streamBuffer) {
			setTimeout(function () {
				self._streamDrain();
			}, 0);
		}
		if (this._streamInput) {
			this._streamInput.resume();
		}
	}
};

/**
 */

Stream.prototype.end = function () {
	if (!this._streamEnded) {
		this._streamEnded = true;
		
		if (!this._streamPaused && !this._streamBuffer) {
			this.onEnd();
		} else {
			if (!this._streamBuffer) {
				this._streamBuffer = [];
			}
		}
	}
};

/**
 */

Stream.prototype.emitEnd = function () {
	this._streamEnded = true;
	if (this._streamOutput) {
		this._streamOutput.end();
		this._streamOutput._streamInput = null;
		this._streamOutput = null;
	}
};

/**
 * @param {Error|string} error
 */

Stream.prototype.error = function (error) {
	if (!this._streamEnded) {
		this._streamEnded = true;
		this._streamError = error;
		
		if (!this._streamPaused && !this._streamBuffer) {
			this.onError(error);
		} else {
			if (!this._streamBuffer) {
				this._streamBuffer = [];
			}
		}
	}
};

/**
 * @param {Error|string} error
 */

Stream.prototype.emitError = function (error) {
	this._streamEnded = true;
	this._streamError = error;
	if (this._streamOutput) {
		this._streamOutput.error(error);
		this._streamOutput._streamInput = null;
		this._streamOutput = null;
	}
};

/**
 * @param {Stream} input
 */

Stream.prototype.onStart = function (input) {};

/**
 * @param {*} entry
 */

Stream.prototype.onWrite = Stream.prototype.emit;

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.onBulkWrite = function (entries) {
	if (this.onWrite !== Stream.prototype.onWrite) {
		if (!this._streamBuffer) {
			this._streamBuffer = [];
		}
		this._streamBuffer[this._streamBuffer.length] = entries;
		
		this._streamDrain();
	} else {
		this.emitBulk(entries);
	}
};

/**
 * @type {function()|undefined}
 */

Stream.prototype.onPause;

/**
 * @type {function()|undefined}
 */

Stream.prototype.onResume;

/**
 */

Stream.prototype.onEnd = Stream.prototype.emitEnd;

/**
 * @param {Error|string} error
 */

Stream.prototype.onError = Stream.prototype.emitError;


exports.Stream = Stream;