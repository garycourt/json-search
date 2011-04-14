var DefaultSimilarity = require("./DefaultSimilarity").DefaultSimilarity,
	Query = require("./Query").Query,
	Weight = require("./Weight").Weight,
	IndexSearcher;

IndexSearcher = function (reader) {
	this.reader = reader;
};

IndexSearcher.prototype.reader;

IndexSearcher.prototype.similarity = new DefaultSimilarity();

IndexSearcher.prototype.createWeight = function (query) {
	return query.weight(this);
};

IndexSearcher.prototype.search = function (query, nDocs) {
	var weight, limit, collector;
	
	if (query instanceof Query) {
		weight = this.createWeight(query);
	} else if (query instanceof Weight) {
		weight = query;
	} else {
		throw new Error("Search query must be an instance of the Query class.");
	}
	
	limit = reader.maxDoc() || 1;
	nDocs = Math.min(nDocs, limit);
	collector = TopScoreDocCollector.create(nDocs, !weight.scoresDocsOutOfOrder());
	//...
};

//..

exports.IndexSearcher = IndexSearcher;