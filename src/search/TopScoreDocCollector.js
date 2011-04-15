//var TopDocsCollector = require("./TopDocsCollector").TopDocsCollector,
//	HitQueue = require("./HitQueue").HitQueue,

/**
 * @constructor
 * @extends {TopDocsCollector}
 * @param {number} numHits
 */

var TopScoreDocCollector = function (numHits) {
	TopDocsCollector.call(this, new HitQueue(numHits, true));
	this.pqTop = /** @type {ScoreDoc} */ (this.pq.top());
};

/**
 * @param {number} numHits
 * @param {boolean} docsScoredInOrder
 * @return {TopScoreDocCollector}
 */

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

/**
 * @type {ScoreDoc}
 */

TopScoreDocCollector.prototype.pqTop;

/**
 * @type {DocumentID|null}
 */

TopScoreDocCollector.prototype.docBase;

/**
 * @type {Scorer}
 */

TopScoreDocCollector.prototype.scorer;

/**
 * @param {Array.<ScoreDoc>} results
 * @param {number} start
 * @return {TopDocs}
 */

TopScoreDocCollector.prototype.newTopDocs = function (results, start) {
	var maxScore, i;
	
	if (!results) {
		return TopDocsCollector.EMPTY_TOPDOCS;
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

/**
 * @param {Index} reader
 * @param {DocumentID|null} base
 */

TopScoreDocCollector.prototype.setNextReader = function (reader, base) {
	this.docBase = base;
};


/**
 * @private
 * @constructor
 * @extends {TopScoreDocCollector}
 * @param {number} numHits
 */

var InOrderTopScoreDocCollector = function (numHits) {
	TopScoreDocCollector.call(this, numHits);
};

InOrderTopScoreDocCollector.prototype = Object.create(TopScoreDocCollector);

/**
 * @param {DocumentID} doc
 */

InOrderTopScoreDocCollector.prototype.collect = function (doc) {
	var score = this.scorer.score();
	
	this.totalHits++;
	if (score <= this.pqTop.score) {
		return;
	}
	
	this.pqTop.doc = (this.docBase ? this.docBase + doc : doc);
	this.pqTop.score = score;
	this.pqTop = /** @type {ScoreDoc} */ (this.pq.updateTop());
};

/**
 * @return {boolean}
 */

InOrderTopScoreDocCollector.prototype.acceptsDocsOutOfOrder = function () {
	return false;
};


/**
 * @private
 * @constructor
 * @extends {TopScoreDocCollector}
 * @param {number} numHits
 */

var OutOfOrderTopScoreDocCollector = function (numHits) {
	TopScoreDocCollector.call(this, numHits);
};

OutOfOrderTopScoreDocCollector.prototype = Object.create(TopScoreDocCollector);

/**
 * @param {DocumentID} doc
 */

OutOfOrderTopScoreDocCollector.prototype.collect = function (doc) {
	var score = this.scorer.score();
	
	this.totalHits++;
	doc = (this.docBase ? this.docBase + doc : doc);
	
	if (score < this.pqTop.score || (score === this.pqTop.score && doc > this.pqTop.doc)) {
		return;
	}
	
	this.pqTop.doc = doc;
	this.pqTop.score = score;
	this.pqTop = /** @type {ScoreDoc} */ (this.pq.updateTop());
};

/**
 * @return {boolean}
 */

OutOfOrderTopScoreDocCollector.prototype.acceptsDocsOutOfOrder = function () {
	return true;
};


exports.TopScoreDocCollector = TopScoreDocCollector;
exports.InOrderTopScoreDocCollector = InOrderTopScoreDocCollector;
exports.OutOfOrderTopScoreDocCollector = OutOfOrderTopScoreDocCollector;