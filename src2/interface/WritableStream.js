/**
 * @interface
 * @extends {Emitter}
 */

function WritableStream() {}

/**
 * @type {boolean}
 */

WritableStream.prototype.writable;

/**
 * @param {...?} data
 * @return {boolean}
 */

WritableStream.prototype.write = function (data) {};

/**
 * @param {...?} [data]
 */

WritableStream.prototype.end = function (data) {};

/**
 */

WritableStream.prototype.destroy = function () {};

/**
 */

WritableStream.prototype.destroySoon = function () {};