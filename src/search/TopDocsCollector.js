//var TopDocs = require("./TopDocs").TopDocs;

/**
 * @constructor
 * @implements {Collector}
 * @param {PriorityQueue} pq
 */

var TopDocsCollector = function (pq) {
	this.pq = pq;
};

/**
 * @type {TopDocs}
 * @const
 */

TopDocsCollector.EMPTY_TOPDOCS = new TopDocs(0, [], NaN);

/**
 * @type {Scorer}
 */

TopDocsCollector.prototype.scorer;

/**
 * @param {DocumentID} doc
 */

TopDocsCollector.prototype.collect = function (doc) {
	throw new Error("Not Implemented");
};

/**
 * @param {Index} reader
 * @param {DocumentID|null} docBase
 */

TopDocsCollector.prototype.setNextReader = function (reader, docBase) {
	throw new Error("Not Implemented");
};

/**
 * @return {boolean}
 */

TopDocsCollector.prototype.acceptsDocsOutOfOrder = function () {
	throw new Error("Not Implemented");
};

/**
 * @type {PriorityQueue.<ScoreDoc>}
 */

TopDocsCollector.prototype.pq;

/**
 * @type {number}
 */

TopDocsCollector.prototype.totalHits = 0;

/**
 * @param {Array.<ScoreDoc>} results
 * @param {number} howMany
 */

TopDocsCollector.prototype.populateResults = function (results, howMany) {
	var i;
	for (i = howMany; i >= 0; i--) {
		results[i] = /** @type {ScoreDoc} */ (this.pq.pop());
	}
};

/**
 * @param {Array.<ScoreDoc>} results
 * @param {number} start
 */

TopDocsCollector.prototype.newTopDocs = function (results, start) {
	return results == null ? TopDocsCollector.EMPTY_TOPDOCS : new TopDocs(this.totalHits, results);
};

/**
 * @param {number} start
 * @param {number} howMany
 * @return {TopDocs}
 */

TopDocsCollector.prototype.topDocs = function (start, howMany) {
	var size = Math.min(this.totalHits, this.pq.size()),
		results, i;
	start = start || 0;
	if (howMany === undefined) {
		howMany = size;
	}
	
	if (start < 0 || start >= size || howMany <= 0) {
		return this.newTopDocs(null, start);
	}
	
	howMany = Math.min(size - start, howMany);
	results = new Array(howMany);
	
	for (i = this.pq.size() - start - howMany; i > 0; i--) {
		this.pq.pop();
	}
	
	this.populateResults(results, howMany);
	
	return this.newTopDocs(results, start);
};


exports.TopDocsCollector = TopDocsCollector;