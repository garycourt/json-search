var ScoreDoc;

ScoreDoc = function (doc, score) {
	this.doc = doc;
	this.score = score;
}

ScoreDoc.prototype.score;

ScoreDoc.prototype.doc;


exports.ScoreDoc = ScoreDoc;