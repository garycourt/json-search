var TopDocsCollector = require("./TopDocsCollector").TopDocsCollector,
	HitQueue = require("./HitQueue").HitQueue,
	TopScoreDocCollector,
	InOrderTopScoreDocCollector,
	OutOfOrderTopScoreDocCollector;

TopScoreDocCollector = function (numHits) {
	TopDocsCollector.call(this, new HitQueue(numHits, true));
	this.pqTop = this.pq.top();
};

TopScoreDocCollector.create = function (numHits, docsScoredInOrder) {
	if (numHits <= 0) {
		throw new Error("numHits must be > 0; please use TotalHitCountCollector if you just need the total hit count");
	}

	if (docsScoredInOrder) {
		return new InOrderTopScoreDocCollector(numHits);
	} else {
		return new OutOfOrderTopScoreDocCollector(numHits);
	}
};

TopScoreDocCollector.prototype = Object.create(TopDocsCollector.prototype);

TopScoreDocCollector.prototype.pqTop;

TopScoreDocCollector.prototype.docBase = "";

TopScoreDocCollector.prototype.scorer;

TopScoreDocCollector.prototype.newTopDocs = function (results, start) {
	var maxScore, i;
	
	if (!results) {
		return this.EMPTY_TOPDOCS;
	}
	
	maxScore = Number.NaN;
	if (start === 0) {
		maxScore = results[0].score;
	} else {
		for (i = this.pq.size(); i > 1; i--) {
			this.pq.pop();
		}
		maxScore = this.pq.pop().score;
	}
	
	return new TopDocs(this.totalHits, results, maxScore);
};

TopScoreDocCollector.prototype.setNextReader = function (reader, base) {
	this.docBase = base;
};


InOrderTopScoreDocCollector = function (numHits) {
	TopScoreDocCollector.call(numHits);
};

InOrderTopScoreDocCollector.prototype = Object.create(TopScoreDocCollector);

InOrderTopScoreDocCollector.prototype.collect = function (doc) {
	var score = this.scorer.score();
	
	this.totalHits++;
	if (score <= this.pqTop.score) {
		return;
	}
	
	this.pqTop.doc = this.docBase + doc;
	this.pqTop.score = score;
	this.pqTop = this.pq.updateTop();
};

InOrderTopScoreDocCollector.prototype.acceptsDocsOutOfOrder = function () {
	return false;
};


OutOfOrderTopScoreDocCollector = function (numHits) {
	TopScoreDocCollector.call(numHits);
};

OutOfOrderTopScoreDocCollector = Object.create(TopScoreDocCollector);

OutOfOrderTopScoreDocCollector.prototype.collect = function (doc) {
	var score = this.scorer.score();
	
	this.totalHits++;
	doc = this.docBase + doc;
	
	if (score < this.pqTop.score || (score === this.pqTop.score && doc > this.pqTop.doc)) {
		return;
	}
	
	this.pqTop.doc = doc;
	this.pqTop.score = score;
	this.pqTop = this.pq.updateTop();
};

OutOfOrderTopScoreDocCollector.prototype.acceptsDocsOutOfOrder = function () {
	return true;
};


exports.TopScoreDocCollector = TopScoreDocCollector;
exports.InOrderTopScoreDocCollector = InOrderTopScoreDocCollector;
exports.OutOfOrderTopScoreDocCollector = OutOfOrderTopScoreDocCollector;