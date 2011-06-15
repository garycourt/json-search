/**
 * @constructor
 * @param {Index} index
 */

function Searcher(index) {
	this._index = index;
};

/**
 * @protected
 * @type {Index}
 */

Searcher.prototype._index;

/**
 * @type {Similarity}
 */

Searcher.prototype.similarity = new DefaultSimilarity();

/**
 * @param {Query} query
 * @param {number} max
 * @param {function(PossibleError, Array.<DocumentTerms>=)} callback
 */

Searcher.prototype.search = function (query, max, callback) {
	var collector, normQuery;
	collector = new TopDocumentsCollector(max, callback);
	normQuery = new NormalizedQuery(query);
	normQuery.score(this.similarity, this._index).pipe(collector);
};


exports.Searcher = Searcher;