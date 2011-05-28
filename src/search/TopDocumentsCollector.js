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
 */

TopDocumentsCollector.prototype.onWrite = function (doc) {
	if (this.collection.length < this.max || doc.score > this.lowestScore) {
		if (this.collection.length >= this.max) {
			this.collection.pop();  //remove lowest scored document
		}
		Array.orderedInsert(this.collection, doc, TopDocumentsCollector.compareScores);
		this.lowestScore = this.collection[this.collection.length - 1].score;
	}
};

/**
 * @param {Array.<DocumentTerms>} docs
 */

TopDocumentsCollector.prototype.onBulkWrite = function (docs) {
	var x, xl;
	for (x = 0, xl = docs.length; x < xl; ++x) {
		if (this.collection.length < this.max || docs[x].score > this.lowestScore) {
			if (this.collection.length >= this.max) {
				this.collection.pop();  //remove lowest scored document
			}
			Array.orderedInsert(this.collection, docs[x], TopDocumentsCollector.compareScores);
			this.lowestScore = this.collection[this.collection.length - 1].score;
		}
	}
};


exports.TopDocumentsCollector = TopDocumentsCollector;