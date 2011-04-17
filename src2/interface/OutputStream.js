/**
 * @interface
 */

function OutputStream() {};

/**
 * @param {InputStream} output
 */

OutputStream.prototype.addOutput = function (output) {};

/**
 * @param {InputStream} output
 */

OutputStream.prototype.removeOutput = function (output) {};

/**
 */

OutputStream.prototype.pause = function () {};

/**
 */

OutputStream.prototype.resume = function () {};

/**
 */

OutputStream.prototype.close = function () {};