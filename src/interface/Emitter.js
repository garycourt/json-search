/**
 * @interface
 */
 
function Emitter() {};

/**
 * @param {string} type
 * @param {...*} [args]
 * @return {boolean}
 */

Emitter.prototype.emit = function (type, args) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.addListener = function (type, listener) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.on = function (type, listener) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.once = function (type, listener) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.removeListener = function (type, listener) {};

/**
 * @param {string} type
 * @return {EventEmitter}
 */

Emitter.prototype.removeAllListeners = function (type) {};

/**
 * @param {string} type
 * @return {Array.<function(...)>}
 */

Emitter.prototype.listeners = function (type) {};