/**
 * @interface
 * @extends {Emitter}
 */

function ReadableStream() {}

/**
 * @type {boolean}
 */

ReadableStream.prototype.readable;

/**
 * @param {WritableStream} dest
 * @param {Object} [options]
 */

ReadableStream.prototype.pipe = function (dest, options) {};

/**
 */

ReadableStream.prototype.pause = function () {};

/**
 */

ReadableStream.prototype.resume = function () {};

/**
 */

ReadableStream.prototype.destroy = function () {};

/**
 */

ReadableStream.prototype.destroySoon = function () {};