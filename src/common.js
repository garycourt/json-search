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

if (typeof Array.isArray !== "function") {
	/**
	 * @param {Array} arr
	 * @return {boolean}
	 */
	
	Array.isArray = function (arr) {
		return typeOf(arr) === "array";
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

if (!Array.append) {
	/**
	 * @param {Array} arr1 The target array to modify
	 * @param {Array} arr2 The array to append onto the target
	 * @returns {Array} The modified array for chaining
	 */
	
	Array.append = function (arr1, arr2) {
		arr2 = arr2.slice(0);
		arr2.unshift(arr1.length, 0);
		arr1.splice.apply(arr1, arr2);
		return arr1;
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

//if (!Function.prototype.bind) {
	/**
	 * @param {Object} obj
	 * @param {...*} [var_args]
	 * @return {!Function}
	 */
	/*
	Function.prototype.bind = function (obj, var_args) {
		var slice = Array.prototype.slice,
			self = this,
			args,
			bound;
		obj = obj || {};
		args = slice.call(arguments, 1);
		bound = function () {
			return self.apply(this instanceof F ? this : obj, args.concat(slice.call(arguments)));
		};

		F.prototype = self.prototype;
		bound.prototype = new F();

		return bound;
	};
	*/
//}