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
 * @type {Array.<*>}
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
 * @type {Error|boolean|null}
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
	var pointer;
	if (this._streamBuffer && !this._streamPaused && !this._streamDraining) {
		this._streamDraining = true;
		
		try {
			for (pointer = 0; !this._streamPaused && pointer < this._streamBuffer.length; ++pointer) {
				this.write(this._streamBuffer[pointer]);
			}
		} catch(e) {
			this.error(e);
			pointer = this._streamBuffer.length;
		}
		
		if (!this._streamPaused) {
			this._streamBuffer = null;
			if (this._streamEnded) {
				try {
					if (this._streamError) {
						this._streamOutput.error(this._streamError);
					} else {
						this._streamOutput.end();
					}
				} catch(e) {}  //ignore any errors
				
				this._streamOutput._streamInput = null;
				this._streamOutput = null;
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
	
	output.start(this);
}; 

/**
 * @param {Stream} input
 */

Stream.prototype.start = function (input) {};

/**
 * @param {*} entry
 */

Stream.prototype.write = function (entry) {
	if (this._streamPaused) {
		throw new Error("Stream is paused");
	}
	
	if (this._streamOutput) {
		this._streamOutput.write(entry);
	}
};

/**
 * @param {Array.<*>} entries
 */

Stream.prototype.writeBulk = function (entries) {
	if (this._streamPaused) {
		//we could add this to the buffer, but this could eventually eat up all our memory over time
		//therefore, just throw an error as the stream should not be written to when it is paused
		throw new Error("Stream is paused");
	} else {
		if (this.write !== Stream.prototype.write) {
			if (this._streamBuffer) {
				this._streamBuffer = this._streamBuffer.concat(entries);
			} else {
				this._streamBuffer = entries;
			}
			
			this._streamDrain();
		} else {
			this._streamOutput.writeBulk(entries);
		}
	}
};

/**
 */

Stream.prototype.pause = function () {
	if (!this._streamPaused) {
		this._streamPaused = true;
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
		if (this._streamInput) {
			this._streamInput.resume();
		}
		if (this._streamBuffer) {
			setTimeout(function () {
				self._streamDrain();
			}, 0);
		}
	}
};

/**
 */

Stream.prototype.end = function () {
	if (!this._streamEnded) {
		this._streamEnded = true;
		if (!this._streamBuffer) {
			this._streamOutput.end();
			this._streamOutput._streamInput = null;
			this._streamOutput = null;
		}
	}
};

/**
 */

Stream.prototype.error = function (error) {
	if (!this._streamEnded) {
		this._streamEnded = true;
		this._streamError = error || true;
		if (!this._streamBuffer) {
			this._streamOutput.error(this._streamError);
			this._streamOutput._streamInput = null;
			this._streamOutput = null;
		}
	}
};


exports.Stream = Stream;