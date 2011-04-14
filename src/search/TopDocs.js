var TopDocs;

TopDocs = function (totalHits, scoreDocs, maxScore) {
	this.totalHits = totalHits || 0;
	this.scoreDocs = scoreDocs || [];
	this.maxScore = maxScore || NaN;
};

TopDocs.prototype.totalHits;

TopDocs.prototype.scoreDocs;

TopDocs.prototype.maxScore;


exports.TopDocs = TopDocs;