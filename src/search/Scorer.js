/**
 * @constructor
 * @implements {DocIdSetIterator}
 * @param {Weight} weight
 */

var Scorer = function (weight) {
	this.weight = weight;
};

/**
 * @return {DocumentID}
 */

Scorer.prototype.docID = function () {
	throw new Error("Not Implemented");
};

/**
 * @return {DocumentID}
 */

Scorer.prototype.nextDoc = function () {
	throw new Error("Not Implemented");
};

/**
 * @param {DocumentID} target
 * @return {DocumentID}
 */

Scorer.prototype.advance = function (target) {
	throw new Error("Not Implemented");
};

/**
 * @type {Weight}
 */

Scorer.prototype.weight;

/**
 * @param {Collector} collector
 * @param {number} [max]
 * @param {DocumentID} [firstDocID]
 * @return {boolean}
 */

Scorer.prototype.score = function (collector, max, firstDocID) {
	var doc = firstDocID;
	collector.scorer = this;
	
	if (max !== undefined) {
		while (doc < max) {
			collector.collect(doc);
			doc = this.nextDoc()
		}
	} else {
		doc = this.nextDoc();
		while (doc !== DocIdSetIterator.NO_MORE_DOCS) {
			collector.collect(doc);
			doc = this.nextDoc();
		}
	}
	
	return doc !== DocIdSetIterator.NO_MORE_DOCS;
}

/**
 * @return {number}
 */

Scorer.prototype.freq = function () {
	throw new Error("Scorer does not implement freq()");
};


exports.Scorer = Scorer;