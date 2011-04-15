/**
 * The results from querying an Index asynchronously.
 * @constructor
 */

var SearchResult = function () {};

/**
 * The number of documents in the database.
 * @type {number}
 */

SearchResult.prototype.numDocs;

/**
 * The number of documents that contain the term, for each term.
 * @type {Object.<number>}
 */

SearchResult.prototype.termDocFreq;


exports.SearchResult = SearchResult;