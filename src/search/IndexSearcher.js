//var DefaultSimilarity = require("./DefaultSimilarity").DefaultSimilarity,
//	Query = require("./Query").Query,
//	Weight = require("./Weight").Weight,

/**
 * @constructor
 * @param {Index} reader
 */

IndexSearcher = function (reader) {
	this.reader = reader;
};

/**
 * @type {Index}
 */

IndexSearcher.prototype.reader;

/**
 * @type {Similarity}
 */

IndexSearcher.prototype.similarity = new DefaultSimilarity();

/**
 * @param {Query} query
 * @return {Weight}
 */

IndexSearcher.prototype.createWeight = function (query) {
	return query.weight(this);
};

/**
 * @param {Query|Weight} query
 * @param {number} nDocs
 * @param {function((Error|string|null|undefined), TopDocs)} callback
 */

IndexSearcher.prototype.search = function (query, nDocs, callback) {
	var weight, collector;
	
	if (query instanceof Query) {
		weight = this.createWeight(query);
	} else if (query instanceof Weight) {
		weight = query;
	} else {
		throw new Error("Search query must be an instance of the Query class.");
	}
	
	nDocs = Math.min(nDocs, Number.MAX_VALUE);
	collector = TopScoreDocCollector.create(nDocs, !weight.scoresDocsOutOfOrder());
	//...
};

/**
 * @param {Query} original
 * @return {Query}
 */

IndexSearcher.prototype.rewrite = function (original) {
	var query = original,
		rewrittenQuery;
	for (rewrittenQuery = query.rewrite(this.reader); rewrittenQuery != query; rewrittenQuery = query.rewrite(this.reader)) {
		query = rewrittenQuery;
	}
	return query;
};

//..

exports.IndexSearcher = IndexSearcher;