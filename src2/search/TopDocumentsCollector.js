/**
 * @constructor
 * @extends {Collector}
 * @param {number} max
 * @param {function(PossibleError, Array.<DocumentTerms>=)} callback
 */

function TopDocumentsCollector(max, callback) {
	Collector.call(this, callback);
	this.max = max || 1;
};

/**
 * @param {DocumentTerms} a
 * @param {DocumentTerms} b
 * @return {number}
 */

TopDocumentsCollector.compareScores = function (a, b) {
	return b.score - a.score;
};

TopDocumentsCollector.prototype = Object.create(Collector.prototype);

/**
 * @type {Array.<DocumentTerms>}
 * @override
 */

TopDocumentsCollector.prototype.collection;

/**
 * @type {number}
 */

TopDocumentsCollector.prototype.max;

/**
 * @type {number}
 */

TopDocumentsCollector.prototype.lowestScore = 0;

/**
 * @param {DocumentTerms} doc
 * @override
 */

TopDocumentsCollector.prototype.push = function (doc) {
	if (this.collection.length < this.max || doc.score > this.lowestScore) {
		if (this.collection.length >= this.max) {
			this.collection.pop();  //remove lowest scored document
		}
		Array.orderedInsert(this.collection, doc, TopDocumentsCollector.compareScores);
		this.lowestScore = this.collection[this.collection.length - 1].score;
	}
};