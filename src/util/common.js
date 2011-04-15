if (typeof exports === "undefined") {
	/**
	 * @type {Object}
	 */
	
	exports = {};
}

if (typeof require !== "function") {
	/**
	 * @param {string} id
	 * @return {Object}
	 */
	
	require = function (id) {
		return exports;
	}; 
}

if (typeof Object.create !== "function") {
	/**
	 * @constructor
	 */
	
	function F() {};
	
	/**
	 * @param {Object} o
	 * @return {Object}
	 */
	
	Object.create = function (o) {
		F.prototype = o;
		return new F();
	};
}

/**
 * @typedef {(Error|string|null|undefined)}
 */

var PossibleError;