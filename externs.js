/**
 * @interface
 */
 
function Emitter() {};

/**
 * @param {string} type
 * @param {...*} [args]
 * @return {boolean}
 */

Emitter.prototype.emit = function (type, args) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.addListener = function (type, listener) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.on = function (type, listener) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.once = function (type, listener) {};

/**
 * @param {string} type
 * @param {function(...)} listener
 * @return {EventEmitter}
 */

Emitter.prototype.removeListener = function (type, listener) {};

/**
 * @param {string} type
 * @return {EventEmitter}
 */

Emitter.prototype.removeAllListeners = function (type) {};

/**
 * @param {string} type
 * @return {Array.<function(...)>}
 */

Emitter.prototype.listeners = function (type) {};

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
 * @param {TermIndexer} indexer
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.setTermIndexer = function (indexer, callback) {};

/**
 * @param {FieldName} field
 * @param {Term} term
 * @return {ReadableStream}
 */

Index.prototype.getTermVectors = function (field, term) {};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {ReadableStream}
 */

Index.prototype.getTermRangeVectors = function (field, startTerm, endTerm, excludeStart, excludeEnd) {};

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
 * @return {ReadableStream}
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
 * @extends {Emitter}
 */

function ReadableStream() {}

/**
 * @type {boolean}
 */

ReadableStream.prototype.readable;

/**
 * @param {WritableStream} dest
 * @param {Object} [options]
 */

ReadableStream.prototype.pipe = function (dest, options) {};

/**
 */

ReadableStream.prototype.pause = function () {};

/**
 */

ReadableStream.prototype.resume = function () {};

/**
 */

ReadableStream.prototype.destroy = function () {};

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

function TermIndexer() {};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @return {Array.<TermVector>}
 */

TermIndexer.prototype.index = function (doc, id) {};

/**
 * @return {string}
 */

TermIndexer.prototype.toSource = function () {};

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
 * @type {Array.<number>|null|undefined}
 */

TermVector.prototype.termPositions;

/**
 * @type {Array.<number>|null|undefined}
 */

TermVector.prototype.termOffsets;

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
 * @interface
 * @extends {Emitter}
 */

function WritableStream() {}

/**
 * @type {boolean}
 */

WritableStream.prototype.writable;

/**
 * @param {...?} data
 * @return {boolean}
 */

WritableStream.prototype.write = function (data) {};

/**
 * @param {...?} [data]
 */

WritableStream.prototype.end = function (data) {};

/**
 */

WritableStream.prototype.destroy = function () {};

/**
 * @typedef {(Error|string|null|undefined)}
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