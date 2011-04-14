var DocIdSetIterator;

DocIdSetIterator = function () {};

DocIdSetIterator.NO_MORE_DOCS = Number.MAX_VALUE;

DocIdSetIterator.prototype.docID;// = function () {};

DocIdSetIterator.prototype.nextDoc;// = function () {};

DocIdSetIterator.prototype.advance;// = function (target) {};


exports.DocIdSetIterator = DocIdSetIterator;