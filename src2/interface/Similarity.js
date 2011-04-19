/**
 * @interface
 */

function Similarity() {};

/**
 * @param {TermDocument} termDoc
 * @return {number}
 */

Similarity.prototype.norm = function (termDoc) {};

/**
 * @param {DocumentTerms} doc
 * @return {number}
 */

Similarity.prototype.queryNorm = function (doc) {};

/**
 * @param {TermDocument} termDoc
 * @return {number}
 */

Similarity.prototype.tf = function (termDoc) {};

/**
 * @param {number} distance
 * @return {number}
 */

Similarity.prototype.sloppyFreq = function (distance) {};

/**
 * @param {TermDocument} termDoc
 * @return {number}
 */

Similarity.prototype.idf = function (termDoc) {};

/**
 * @param {number} overlap
 * @param {number} maxOverlap
 * @return {number}
 */

Similarity.prototype.coord = function (overlap, maxOverlap) {};