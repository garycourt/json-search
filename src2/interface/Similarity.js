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