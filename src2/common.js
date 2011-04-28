/** @type {Object} */ var O = {};
/** @constructor */   function F() {};

/**
 * @param {*} o
 * @return {string}
 */

function typeOf(o) {
	return o === undefined ? 'undefined' : (o === null ? 'null' : Object.prototype.toString.call(/** @type {Object} */ (o)).split(' ').pop().split(']').shift().toLowerCase());
};

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
	 * @param {Object} o
	 * @return {Object}
	 */
	
	Object.create = function (o) {
		F.prototype = o;
		return new F();
	};
}

if (typeof Array.add !== "function") {
	/**
	 * @param {Array} arr
	 * @param {*} obj
	 * @return {boolean}
	 */
	
	Array.add = function (arr, obj) {
		var index = arr.indexOf(obj);
		if (index === -1) {
			arr[arr.length] = obj;
			return true;
		}
		return false;
	};
}

if (typeof Array.remove !== "function") {
	/**
	 * @param {Array} arr
	 * @param {*} obj
	 * @return {boolean}
	 */
	
	Array.remove = function (arr, obj) {
		var index = arr.indexOf(obj);
		if (index !== -1) {
			arr.splice(index, 1);
			return true;
		}
		return false;
	};
}

if (typeof Array.orderedInsert !== "function") {
	/**
	 * @param {Array} arr
	 * @param {*} obj
	 * @param {function(?, ?)} comparator
	 * @return {boolean}
	 */
	
	Array.orderedInsert = function (arr, obj, comparator) {
		var start, end, pivot, cmp;
		if (arr.length === 0) {
			arr[0] = obj;
		} else {
			start = 0;
			end = arr.length - 1;
			pivot = Math.floor(end / 2);
			
			while ((end - start) > 0) {
				if (comparator(arr[pivot], obj) <= 0) {
					start = pivot + 1;
				} else {
					end = pivot - 1;
				}
				pivot = Math.round(start + ((end - start) / 2));
			}
			
			if (comparator(arr[pivot], obj) <= 0) {
				arr.splice(pivot + 1, 0, obj);
			} else {
				arr.splice(pivot, 0, obj);
			}
		}
	};
}