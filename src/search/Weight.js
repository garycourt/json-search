var Weight;

Weight = function () {};

Weight.prototype.explain;// = function (reader, doc) {};

Weight.prototype.getQuery;// = function () {};

Weight.prototype.getValue;// = function () {};

Weight.prototype.normalize;// = function (norm) {};

Weight.prototype.scorer;// = function (reader, scoreDocsInOrder, topScorer) {};

Weight.prototype.sumOfSquaredWeights;// = function () {};

Weight.prototype.scoresDocsOutOfOrder = function () {
	return false;
};


exports.Weight = Weight;