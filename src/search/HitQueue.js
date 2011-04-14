//var ScoreDoc = require("./ScoreDoc").ScoreDoc,
//	PriorityQueue = require("../util/PriorityQueue").PriorityQueue,

/**
 * @constructor
 * @extends PriorityQueue
 * @param {number} size
 * @param {boolean} prePopulate
 */

var HitQueue = function (size, prePopulate) {
	this.prePopulate = prePopulate;
	this.initialize(size);
};

HitQueue.prototype = Object.create(PriorityQueue.prototype);

/**
 * @type {boolean}
 */

HitQueue.prototype.prePopulate;

/**
 * @return {ScoreDoc}
 */

HitQueue.prototype.getSentinelObject = function () {
	return !this.prePopulate ? null : new ScoreDoc("", Number.NEGATIVE_INFINITY);
};

/**
 * @param {ScoreDoc} hitA
 * @param {ScoreDoc} hitB
 * @return {boolean}
 */

HitQueue.prototype.lessThan = function (hitA, hitB) {
	if (hitA.score === hitB.score)
		return hitA.doc > hitB.doc; 
	else
		return hitA.score < hitB.score;
};


exports.HitQueue = HitQueue;