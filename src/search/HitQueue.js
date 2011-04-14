var ScoreDoc = require("./ScoreDoc").ScoreDoc,
	PriorityQueue = require("../util/PriorityQueue").PriorityQueue,
	HitQueue;

HitQueue = function (size, prePopulate) {
	this.prePopulate = prePopulate;
	this.initialize(size);
};

HitQueue.prototype = Object.create(PriorityQueue.prototype);

HitQueue.prototype.prePopulate;

HitQueue.prototype.getSentinelObject = function () {
	return !this.prePopulate ? null : new ScoreDoc("", Number.NEGATIVE_INFINITY);
};

HitQueue.prototype.lessThan = function (hitA, hitB) {
	if (hitA.score === hitB.score)
		return hitA.doc > hitB.doc; 
	else
		return hitA.score < hitB.score;
};


exports.HitQueue = HitQueue;