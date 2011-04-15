/**
 * @constructor
 */

var Index = function () {};  //TODO

/**
 * @param {function(PossibleError, number=)} callback
 */

Index.prototype.numDocs = function (callback) {
	throw new Error("Not Implemented");
};

/**
 * @param {Term} term
 * @param {function(PossibleError, number=)} callback
 */

Index.prototype.docFreq = function (term, callback) {
	throw new Error("Not Implemented");
};

//...