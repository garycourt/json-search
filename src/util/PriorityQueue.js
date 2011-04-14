var PriorityQueue;

PriorityQueue = function () {};

PriorityQueue.prototype._size = 0;

PriorityQueue.prototype._maxSize = 0;

PriorityQueue.prototype._heap;// = []

PriorityQueue.prototype.lessThan;// = function (a, b) {};

PriorityQueue.prototype.getSentinelObject = function () {
	return null;
};

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

PriorityQueue.prototype.add = function (element) {
	this._size++;
	this._heap[this._size] = element;
	this.upHeap();
	return heap[1];
};