/**
 * @constructor
 */

var PriorityQueue = function () {};

/**
 * @private
 * @type {number}
 */

PriorityQueue.prototype._size = 0;

/**
 * @private
 * @type {number}
 */

PriorityQueue.prototype._maxSize = 0;

/**
 * @private
 * @type {Array}
 */

PriorityQueue.prototype._heap;// = []

/**
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 */

PriorityQueue.prototype.lessThan = function (a, b) {
	throw new Error("Not Implemented");
};

/**
 * @protected
 * @return {*}
 */

PriorityQueue.prototype.getSentinelObject = function () {
	return null;
};

/**
 * @protected
 * @param {number} maxSize
 */

PriorityQueue.prototype.initialize = function (maxSize) {
	var heapSize, sentinel, i;
	this._size = 0;
	
	if (0 === maxSize) {
		heapSize = 2;
	} else {
		if (maxSize === Number.MAX_VALUE) {
			heapSize = Number.MAX_VALUE;
		} else {
			heapSize = maxSize + 1;
		}
	}
	
	this._heap = new Array(heapSize);
	this._maxSize = maxSize;
	sentinel = this.getSentinelObject();
	
	if (sentinel !== null) {
		this._heap[1] = sentinel;
		for (i = 2; i < this._heap.length; i++) {
			this._heap[i] = this.getSentinelObject();
		}
		this._size = maxSize;
	}
};

/**
 * @param {*} element
 * @return {*}
 */

PriorityQueue.prototype.add = function (element) {
	this._size++;
	this._heap[this._size] = element;
	this.upHeap();
	return heap[1];
};

/**
 * @param {*} element
 * @return {*}
 */

PriorityQueue.prototype.insertWithOverflow = function (element) {
	var /** @type {*} */ ret;
	if (this._size < this._maxSize) {
		this.add(element);
		return null;
	} else if (this._size > 0 && !this.lessThan(element, this._heap[1])) {
		ret = this._heap[1];
		this._heap[1] = element;
		this.updateTop();
		return ret;
	} else {
		return element;
	}
};

/**
 * @return {*}
 */

PriorityQueue.prototype.top = function () {
	return this._heap[1];
};

/**
 * @return {*}
 */

PriorityQueue.prototype.pop = function () {
	var result;
	if (size > 0) {
		result = this._heap[1];                  // save first value
		this._heap[1] = this._heap[this._size];  // move last to first
		this._heap[this._size] = null;           // permit GC of objects
		this._size--;
		this.downHeap();                         // adjust heap
		return result;
    } else {
		return null;
    }
};

/**
 * @return {*}
 */

PriorityQueue.prototype.updateTop = function () {
	this.downHeap();
	return this._heap[1];
};

/**
 * @return {number}
 */

PriorityQueue.prototype.size = function () {
	return this._size;
};

/**
 */

PriorityQueue.prototype.clear = function () {
	this._heap = new Array(this._maxSize + 1);
	this._size = 0;
};

/**
 */

PriorityQueue.prototype.upHeap = function () {
	var i = this._size,
		node = this._heap[i],             // save bottom node
		j = i >>> 1;
	while (j > 0 && this.lessThan(node, this._heap[j])) {
		this._heap[i] = this._heap[j];    // shift parents down
		i = j;
		j = j >>> 1;
	}
	this._heap[i] = node;                 // install saved node
};

/**
 */

PriorityQueue.prototype.downHeap = function () {
	var i = 1,
		node = this._heap[i],  // save top node
		j = i << 1,            // find smaller child
		k = j + 1;
	
	if (k <= this._size && this.lessThan(this._heap[k], this._heap[j])) {
		j = k;
	}
	
	while (j <= this._size && this.lessThan(this._heap[j], node)) {
		this._heap[i] = this._heap[j];  // shift up child
		i = j;
		j = i << 1;
		k = j + 1;
		if (k <= this._size && this.lessThan(this._heap[k], this._heap[j])) {
			j = k;
		}
	}
	this._heap[i] = node;  // install saved node
}


exports.PriorityQueue = PriorityQueue;