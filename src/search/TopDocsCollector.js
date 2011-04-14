var Collector = require("./Collector").Collector,
	TopDocs = require("./TopDocs").TopDocs,
	TopDocsCollector;
	
TopDocsCollector = function (pq) {
	Collector.call(this);
	this.pq = pq;
};

TopDocsCollector.EMPTY_TOPDOCS = new TopDocs(0, [], NaN);

TopDocsCollector.prototype = Object.create(Collector.prototype);

TopDocsCollector.prototype.pq;

TopDocsCollector.prototype.totalHits = 0;

TopDocsCollector.prototype.populateResults = function (results, howMany) {
	var i;
	for (i = howMany; i >= 0; i--) {
		results[i] = this.pq.pop();
	}
};

TopDocsCollector.prototype.newTopDocs = function (results, start) {
	return results == null ? TopDocsCollector.EMPTY_TOPDOCS : new TopDocs(this.totalHits, results);
};

TopDocsCollector.prototype.topDocs = function (start, howMany) {
	var size = Math.min(this.totalHits, this.pq.size()),
		results, i;
	start = start || 0;
	if (howMany === undefined) {
		howMany = size;
	}
	
	if (start < 0 || start >= size || howMany <= 0) {
		return this.newTopDocs(null, start);
	}
	
	howMany = Math.min(size - start, howMany);
	results = new Array(howMany);
	
	for (i = this.pq.size() - start - howMany; i > 0; i--) {
		this.pq.pop();
	}
	
	this.populateResults(results, howMany);
	
	return this.newTopDocs(results, start);
};


exports.TopDocsCollector = TopDocsCollector;