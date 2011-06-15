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
 * @param {Query|string} query
 * @param {number} max
 * @param {function(PossibleError, Array.<DocumentTerms>=)} callback
 */

Searcher.prototype.search = function (query, max, callback) {
	var self = this, collector, normQuery;
	
	if (typeof query === "string") {
		this._index.getIndexer(function (err, indexer) {
			if (!err) {
				self.search(QueryParser.parse(/** @type {string} */ (query), indexer.defaultField, indexer), max, callback);
			} else {
				callback(err);
			}
		});
	} else {
		collector = new TopDocumentsCollector(max, callback);
		normQuery = new NormalizedQuery(query);
		normQuery.score(this.similarity, this._index).pipe(collector);
	}
};


exports.Searcher = Searcher;