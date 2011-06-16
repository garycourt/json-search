/**
 * @interface
 */

function Analyzer() {};

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

Analyzer.prototype.parse = function (value, field) {};


/**
 * @interface
 */

function Index() {};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.indexDocument = function (doc, id, callback) {};

/**
 * @param {Object} doc
 * @param {DocumentID|null} [id]
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.addDocument = function (doc, id, callback) {};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

Index.prototype.getDocument = function (id, callback) {};

/**
 * @param {Indexer} indexer
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.setIndexer = function (indexer, callback) {};

/**
 * @param {function(PossibleError, Indexer)} callback
 */

Index.prototype.getIndexer = function (callback) {};

/**
 * @param {FieldName} field
 * @param {Term} term
 * @return {Stream}
 */

Index.prototype.getTermVectors = function (field, term) {};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} excludeStart
 * @param {boolean} excludeEnd
 * @param {function(PossibleError, Array.<string>)} [callback]
 */

Index.prototype.getTermRange = function (field, startTerm, endTerm, excludeStart, excludeEnd, callback) {
	
};

/**
 * @interface
 * @extends {Analyzer}
 */

function Indexer() {};

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

Indexer.prototype.parse = function (value, field) {};

/**
 * @param {*} doc
 * @param {DocumentID} id
 * @return {Array.<TermVector>}
 */

Indexer.prototype.index = function (doc, id) {};

/**
 * @return {string}
 */

Indexer.prototype.toSource = function () {};

/**
 * @interface
 */

function Query() {};

/**
 * @type {number}
 */

Query.prototype.boost;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

Query.prototype.score = function (similarity, index) {};

/**
 * @return {Array.<TermVector>}
 */

Query.prototype.extractTerms = function () {};

/**
 * @return {Query}
 */

Query.prototype.rewrite = function () {};

/**
 * @interface
 */

function Similarity() {};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

Similarity.prototype.norm = function (termVec) {};

/**
 * @param {DocumentTerms} doc
 * @return {number}
 */

Similarity.prototype.queryNorm = function (doc) {};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

Similarity.prototype.tf = function (termVec) {};

/**
 * @param {number} distance
 * @return {number}
 */

Similarity.prototype.sloppyFreq = function (distance) {};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

Similarity.prototype.idf = function (termVec) {};

/**
 * @param {number} overlap
 * @param {number} maxOverlap
 * @return {number}
 */

Similarity.prototype.coord = function (overlap, maxOverlap) {};

/**
 * @interface
 */

function TermVector() {};

/**
 * @type {Term}
 */

TermVector.prototype.term;

/**
 * @type {number|undefined}
 */

TermVector.prototype.termFrequency;

/**
 * @type {Array.<number>|undefined}
 */

TermVector.prototype.termPositions;

/**
 * @type {Array.<number>|undefined}
 */

TermVector.prototype.termStartOffsets;

/**
 * @type {Array.<number>|undefined}
 */

TermVector.prototype.termEndOffsets;

/**
 * @type {FieldName}
 */

TermVector.prototype.field;

/**
 * @type {number|undefined}
 */

TermVector.prototype.fieldBoost;

/**
 * @type {number|undefined}
 */

TermVector.prototype.totalFieldTokens;

/**
 * @type {number|undefined}
 */

TermVector.prototype.documentBoost;

/**
 * @type {DocumentID}
 */

TermVector.prototype.documentID;

/**
 * @type {number|undefined}
 */

TermVector.prototype.documentFrequency;

/**
 * @type {number|undefined}
 */

TermVector.prototype.totalDocuments;

/**
 * @constructor
 */

function Token() {};

/**
 * @type {Term}
 */

Token.prototype.value;

/**
 * @type {number|undefined}
 */

Token.prototype.startOffset;

/**
 * @type {number|undefined}
 */

Token.prototype.endOffset;

/**
 * @type {number}
 */

Token.prototype.positionIncrement;

/**
 * @typedef {(Error|string|number|boolean|null|undefined)}
 */

var PossibleError;

/**
 * @typedef {(string|number)}
 */

var DocumentID;

/**
 * @typedef {(string|null)}
 */

var FieldName;

/**
 * @typedef {(string|number|boolean|null)}
 */

var Term;