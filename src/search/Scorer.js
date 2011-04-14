var DocIdSetIterator = require("./DocIdSetIterator").DocIdSetIterator,
	Scorer;

Scorer = function (weight) {
	this.weight = weight;
};

Scorer.prototype = Object.create(DocIdSetIterator.prototype);

Scorer.prototype.weight;

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

Scorer.prototype.freq = function () {
	throw new Error("Scorer does not implement freq()");
};


exports.Scorer = Scorer;