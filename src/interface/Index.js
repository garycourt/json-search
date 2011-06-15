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