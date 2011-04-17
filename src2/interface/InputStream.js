/**
 * @interface
 */

function InputStream() {};

/**
 * @param {OutputStream} input
 */

InputStream.prototype.start = function (input) {};

/**
 * @param {?} data
 */

InputStream.prototype.push = function (data) {};

/**
 * @param {OutputStream} input
 * @param {PossibleError} [error]
 */

InputStream.prototype.end = function (input, error) {};