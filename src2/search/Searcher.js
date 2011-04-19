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
	var normQuery = new NormalizedQuery(query);
	var scorer = normQuery.createScorer(collector);
	scorer.scoreDocuments(this._index);
};

/**
 * MOVE ME SOMEWHERE ELSE
 */

function testSearch() {
	var searcher = new Searcher(new MemoryIndex());
	searcher.search(new TermQuery("test", null), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
	});
}

testSearch();