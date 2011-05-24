// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @constructor
 * @extends {EventEmitter}
 */

function Stream() {
	EventEmitter.call(this);
}

Stream.prototype = Object.create(EventEmitter.prototype);

/**
 * @type {boolean}
 */

Stream.prototype.readable = false;

/**
 * @type {boolean}
 */

Stream.prototype.writable = false;

/**
 * @param {WritableStream} dest
 * @param {Object} [options]
 */

Stream.prototype.pipe = function (dest, options) {
	var source = this;

	/**
	 * @param {?} chunk
	 */

	function ondata(chunk) {
		if (dest.writable) {
			if (false === dest.write(chunk)) source.pause();
		}
	}

	source.on('data', ondata);
	
	function onerror(err) {
		dest.emit('error', err);
		source.destroy();
	};
	
	if (!options || options.error !== false) {
		source.on('error', onerror);
	}

	function ondrain() {
		if (source.readable) source.resume();
	}

	dest.on('drain', ondrain);

	/*
	 * If the 'end' option is not supplied, dest.end() will be called when
	 * source gets the 'end' event.
	 */

	function onend() {
		dest.end();
	}

	if (!options || options.end !== false) {
		source.on('end', onend);
		source.on('close', onend);
	}

	function onpause() {
		source.pause();
	}

	dest.on('pause', onpause);

	function onresume() {
		if (source.readable) source.resume();
	};

	dest.on('resume', onresume);

	function cleanup() {
		source.removeListener('data', ondata);
		source.removeListener('error', onerror);
		dest.removeListener('drain', ondrain);
		source.removeListener('end', onend);
		source.removeListener('close', onend);

		dest.removeListener('pause', onpause);
		dest.removeListener('resume', onresume);

		source.removeListener('end', cleanup);
		source.removeListener('close', cleanup);
		source.removeListener('error', cleanup);

		dest.removeListener('end', cleanup);
		dest.removeListener('close', cleanup);
		
		//dest.emit('pipeDisconnected', source);
	};

	source.on('end', cleanup);
	source.on('close', cleanup);
	source.on('error', cleanup);

	dest.on('end', cleanup);
	dest.on('close', cleanup);

	//dest.emit('pipeConnected', source);
};

/**
 */

Stream.prototype.pause = function () {
	this.emit('pause');
};

/**
 */

Stream.prototype.resume = function () {
	this.emit('resume');
};

/**
 */

Stream.prototype.destroy = function () {
	this.readable = false;
	this.writable = false;
	this.emit('close');
	this.removeAllListeners();
};


exports.Stream = Stream;