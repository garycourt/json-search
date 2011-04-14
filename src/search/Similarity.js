/**
 * @interface
 */

var Similarity = function () {};

/**
 * @const
 * @type {number}
 */

Similarity.NO_DOC_ID_PROVIDED = -1;


/**
 * @param {string} field
 * @param {FieldInvertState} state
 * @return {number}
 */

Similarity.prototype.computeNorm = function (field, state) {};

/**
 * @param {number} sumOfSquaredWeights
 * @return {number}
 */

Similarity.prototype.queryNorm = function (sumOfSquaredWeights) {};

/**
 * @param {number} freq
 * @return {number}
 */

Similarity.prototype.tf = function (freq) {};

/**
 * @param {number} distance
 * @return {number}
 */

Similarity.prototype.sloppyFreq = function (distance) {};

/**
 * @param {number} docFreq
 * @param {number} numDocs
 * @return {number}
 */

Similarity.prototype.idf = function (docFreq, numDocs) {};

/**
 * @param {number} overlap
 * @param {number} maxOverlap
 * @return {number}
 */

Similarity.prototype.coord = function (overlap, maxOverlap) {};

/**
 * @param {DocumentID} docId
 * @param {string} fieldName
 * @param {number} start
 * @param {number} end
 * @param {Array} payload
 * @param {number} offset
 * @param {number} length
 * 
 * @return {number}
 */

Similarity.prototype.scorePayload = function (docId, fieldName, start, end, payload, offset, length) {};


exports.Similarity = Similarity;