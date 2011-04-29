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
	var collector = new TopDocumentsCollector(max, callback);
	//var normQuery = new NormalizedQuery(query);
	//normQuery.score(this._index, this.similarity).pipe(collector);
	//FIXME:
	query.score(this._index, this.similarity).pipe(collector);
};


exports.Searcher = Searcher;